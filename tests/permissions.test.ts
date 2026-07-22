import test from 'node:test';
import assert from 'node:assert';
import { hasPermission } from '../src/lib/permissions';

test('hasPermission allows Super Admin with ALL permission', () => {
  const userPermissions = ['ALL'];
  assert.strictEqual(hasPermission(userPermissions, 'dashboard.view'), true);
  assert.strictEqual(hasPermission(userPermissions, 'users.manage'), true);
});

test('hasPermission checks explicit permission string', () => {
  const userPermissions = ['dashboard.view', 'attendance.view'];
  assert.strictEqual(hasPermission(userPermissions, 'dashboard.view'), true);
  assert.strictEqual(hasPermission(userPermissions, 'attendance.view'), true);
  assert.strictEqual(hasPermission(userPermissions, 'payroll.approve'), false);
});

