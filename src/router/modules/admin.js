import Empty from '@/views/empty'

const admin = [
  {
    path: 'user',
    component: Empty,
    meta: { title: '账号', roles: ['web.admin.admin_user'] },
    children: [
      { path: '', name: 'AdminUserIndex', component: () => import('@/views/admin-user/index'), meta: { title: 'Index' }, hidden: true },
      { path: 'create', name: 'AdminUserCreate', component: () => import('@/views/admin-user/create'), meta: { title: 'Create', activeMenu: '/admin/user' }, hidden: true },
      { path: ':id/edit', name: 'AdminUserEdit', component: () => import('@/views/admin-user/edit'), meta: { title: 'Edit', activeMenu: '/admin/user' }, hidden: true }
    ]
  },
  {
    path: 'role',
    component: Empty,
    meta: { title: '角色', roles: ['web.admin.role'] },
    children: [
      { path: '', name: 'RoleIndex', component: () => import('@/views/role/index'), meta: { title: 'Index' }, hidden: true },
      { path: 'create', name: 'RoleCreate', component: () => import('@/views/role/create'), meta: { title: 'Create', activeMenu: '/admin/role' }, hidden: true },
      { path: ':id/edit', name: 'RoleEdit', component: () => import('@/views/role/edit'), meta: { title: 'Edit', activeMenu: '/admin/role' }, hidden: true }
    ]
  },
  {
    path: 'permission',
    component: Empty,
    meta: { title: '权限', roles: ['web.admin.permission'] },
    children: [
      { path: '', name: 'PermissionIndex', component: () => import('@/views/permission/index'), meta: { title: 'Index' }, hidden: true },
      { path: 'create', name: 'PermissionCreate', component: () => import('@/views/permission/create'), meta: { title: 'Create', activeMenu: '/admin/permission' }, hidden: true },
      { path: ':id/edit', name: 'PermissionEdit', component: () => import('@/views/permission/edit'), meta: { title: 'Edit', activeMenu: '/admin/permission' }, hidden: true }
    ]
  }
]

export default admin
