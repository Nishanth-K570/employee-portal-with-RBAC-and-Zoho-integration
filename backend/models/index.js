const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ---- Users ----
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// ---- Roles ----
const Role = sequelize.define('Role', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }, // Admin, HR, Sales, Support, Finance
});

// ---- Permissions ----
const Permission = sequelize.define('Permission', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  key: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g. 'zoho:people:access'
  description: { type: DataTypes.STRING },
});

// ---- AuditLogs ----
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: true },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.JSONB, allowNull: true },
  ipAddress: { type: DataTypes.STRING },
});

// ---- Join tables ----
const UserRole = sequelize.define('UserRole', {});
const RolePermission = sequelize.define('RolePermission', {});

// ---- Associations ----
User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

module.exports = { sequelize, User, Role, Permission, AuditLog, UserRole, RolePermission };
