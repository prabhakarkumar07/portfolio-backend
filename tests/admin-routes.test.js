const assert = require('node:assert/strict');

const app = require('../app');

async function withServer(run) {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
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
}

async function testLoginValidation() {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Validation failed');
  });
}

async function testProtectedAdminRoute() {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/admin/profile/assets`, {
      method: 'POST',
    });

    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.match(body.message, /No token provided/i);
  });
}

async function run() {
  await testLoginValidation();
  await testProtectedAdminRoute();
  console.log('admin route tests passed');
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = run;
