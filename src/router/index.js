import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Bank from '../views/Bank.vue'

import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/bank/:bankId/:userId',
    name: 'Bank',
    component: Bank,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reports/:bankId/:userId',
    name: 'Reports',
    // route level code-splitting
    // this generates a separate chunk (reports.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "reports" */ '../views/Reports.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  firebase.auth().onAuthStateChanged((user) => {
    if (!user && requiresAuth) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  })
});

export default router
