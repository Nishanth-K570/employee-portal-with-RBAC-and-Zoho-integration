// Seeds initial roles, permissions, and an Admin user.
// Run with: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const { User, Role, Permission } = require('./models');

const ROLE_NAMES = ['Admin', 'HR', 'Sales', 'Support', 'Finance'];

const PERMISSIONS = [
  { key: 'zoho:people:access', description: 'Access Zoho People' },
  { key: 'zoho:crm:access', description: 'Access Zoho CRM' },
  { key: 'zoho:desk:access', description: 'Access Zoho Desk' },
  { key: 'zoho:books:access', description: 'Access Zoho Books' },
  { key: 'admin:manage_users', description: 'Manage portal users and roles' },
];

const ROLE_PERMISSION_MAP = {
  Admin: PERMISSIONS.map((p) => p.key),
  HR: ['zoho:people:access'],
  Sales: ['zoho:crm:access'],
  Support: ['zoho:desk:access'],
  Finance: ['zoho:books:access'],
};

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops & recreates tables - fine for first setup

  const roles = {};
  for (const name of ROLE_NAMES) {
    roles[name] = await Role.create({ name });
  }

  const permissions = {};
  for (const perm of PERMISSIONS) {
    permissions[perm.key] = await Permission.create(perm);
  }

  for (const [roleName, permKeys] of Object.entries(ROLE_PERMISSION_MAP)) {
    const permInstances = permKeys.map((k) => permissions[k]);
    await roles[roleName].setPermissions(permInstances);
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await User.create({
    name: 'Portal Admin',
    email: 'admin@company.com',
    passwordHash,
  });
  await admin.setRoles([roles.Admin]);

  // A demo HR user too, useful for the video recording
  const hrHash = await bcrypt.hash('Hr@12345', 10);
  const hrUser = await User.create({ name: 'HR Demo', email: 'hr@company.com', passwordHash: hrHash });
  await hrUser.setRoles([roles.HR]);

  console.log('Seed complete.');
  console.log('Admin login -> email: admin@company.com  password: Admin@123');
  console.log('HR login    -> email: hr@company.com      password: Hr@12345');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
