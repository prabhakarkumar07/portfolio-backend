const runHealthTest = require('./health.test');
const runAdminRoutesTest = require('./admin-routes.test');
const runContactValidationTest = require('./contact-validation.test');

async function run() {
  await runHealthTest();
  await runAdminRoutesTest();
  await runContactValidationTest();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
