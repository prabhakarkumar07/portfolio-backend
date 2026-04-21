const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const { startServer } = require('../server');

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();

  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  return { response, body };
}

async function run() {
  let server;
  let projectId;
  let token;

  try {
    server = await startServer();
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}/api`;

    const loginResult = await request(`${baseUrl}`, '/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
      }),
    });

    assert.equal(loginResult.response.status, 200, `Login failed: ${JSON.stringify(loginResult.body)}`);
    token = loginResult.body.token;

    const slugBase = `dummy-project-${Date.now()}`;
    const createPayload = {
      title: 'Dummy Project API Check',
      slug: slugBase,
      shortDescription: 'Disposable project used to verify admin CRUD endpoints.',
      description: 'This record is created during automated endpoint verification and removed afterwards.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      category: 'Web',
      githubUrl: 'https://github.com/example/dummy-project',
      liveUrl: 'https://example.com/dummy-project',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80'],
      role: 'Full Stack Developer',
      duration: '2 days',
      problem: 'Needed a safe way to verify project CRUD from the admin panel.',
      solution: 'Create a temporary project entry and update it through the real API.',
      impact: 'Confirms that the portfolio backend accepts and persists admin project changes.',
      keyFeatures: ['Create', 'Update', 'Delete'],
      metrics: [{ label: 'Checks', value: '4 API calls' }],
      featured: false,
      status: 'completed',
      order: 999,
    };

    const createResult = await request(`${baseUrl}`, '/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createPayload),
    });

    assert.equal(createResult.response.status, 201, `Create failed: ${JSON.stringify(createResult.body)}`);
    projectId = createResult.body?.data?._id;
    assert.ok(projectId, 'Created project id is missing');

    const updatePayload = {
      ...createPayload,
      title: 'Dummy Project API Check Updated',
      slug: `${slugBase}-updated`,
      shortDescription: 'Updated during automated endpoint verification.',
      featured: true,
      status: 'in-progress',
      metrics: [{ label: 'Checks', value: 'Create + Update verified' }],
    };

    const updateResult = await request(`${baseUrl}`, `/admin/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePayload),
    });

    assert.equal(updateResult.response.status, 200, `Update failed: ${JSON.stringify(updateResult.body)}`);
    assert.equal(updateResult.body?.data?.slug, `${slugBase}-updated`);
    assert.equal(updateResult.body?.data?.featured, true);
    assert.equal(updateResult.body?.data?.status, 'in-progress');

    const publicFetchResult = await request(`${baseUrl}`, `/projects/${slugBase}-updated`);
    assert.equal(
      publicFetchResult.response.status,
      200,
      `Public fetch failed: ${JSON.stringify(publicFetchResult.body)}`
    );
    assert.equal(publicFetchResult.body?.data?.title, 'Dummy Project API Check Updated');

    console.log('project CRUD live test passed');
  } finally {
    if (projectId && token && server) {
      try {
        const { port } = server.address();
        await request(`http://127.0.0.1:${port}/api`, `/admin/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {}
    }

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = run;
