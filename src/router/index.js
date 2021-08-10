import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Empty from '@/views/empty'

// modules

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-house' }
    }]
  },

  {
    path: '/profile',
    hidden: true,
    component: Layout,
    children: [{
      path: '',
      name: 'profile',
      component: () => import('@/views/profile/index'),
      meta: { title: 'profile' }
    }]
  },
  {
    path: '/admin',
    component: Layout,
    meta: { title: '权限管理', permissions: ['auth'], icon: 'el-icon-setting' },
    children: [
      { path: '', redirect: '/admin/user' },
      {
        path: 'user',
        component: Empty,
        meta: { title: '账号', permissions: ['auth.admin_user'] },
        children: [
          { path: '', name: 'AdminUserIndex', component: () => import('@/views/admin-user/index'), meta: { title: '列表' }, hidden: true },
          { path: 'create', name: 'AdminUserCreate', component: () => import('@/views/admin-user/create'), meta: { title: '添加', activeMenu: '/admin/user' }, hidden: true },
          { path: ':id/edit', name: 'AdminUserEdit', component: () => import('@/views/admin-user/edit'), meta: { title: '修改', activeMenu: '/admin/user' }, hidden: true }
        ]
      },
      {
        path: 'role',
        component: Empty,
        meta: { title: '角色', permissions: ['auth.role'] },
        children: [
          { path: '', name: 'RoleIndex', component: () => import('@/views/role/index'), meta: { title: '列表' }, hidden: true },
          { path: 'create', name: 'RoleCreate', component: () => import('@/views/role/create'), meta: { title: '添加', activeMenu: '/admin/role' }, hidden: true },
          { path: ':id/edit', name: 'RoleEdit', component: () => import('@/views/role/edit'), meta: { title: '修改', activeMenu: '/admin/role' }, hidden: true }
        ]
      },
      {
        path: 'permission',
        component: Empty,
        meta: { title: '权限', permissions: ['auth.permission'] },
        children: [
          { path: '', name: 'PermissionIndex', component: () => import('@/views/permission/index'), meta: { title: '列表' }, hidden: true },
          { path: 'create', name: 'PermissionCreate', component: () => import('@/views/permission/create'), meta: { title: '添加', activeMenu: '/admin/permission' }, hidden: true },
          { path: ':id/edit', name: 'PermissionEdit', component: () => import('@/views/permission/edit'), meta: { title: '修改', activeMenu: '/admin/permission' }, hidden: true }
        ]
      }
    ]
  },
  {
    path: '/media',
    component: Layout,
    meta: { title: '媒体管理', permissions: ['media'] },
    children: [
      { path: '', name: 'MediaIndex', component: () => import('@/views/media/index'), meta: { title: '媒体管理', icon: 'el-icon-picture-outline' }}
    ]
  },
  {
    path: '/activity-log',
    component: Layout,
    meta: { permissions: ['activity-log'] },
    children: [
      {
        path: '',
        component: () => import('@/views/activity-log/index'),
        meta: { title: '操作日志', icon: 'el-icon-s-operation' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const agentRoutes = [
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
