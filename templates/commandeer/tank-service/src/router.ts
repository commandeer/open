import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('./tanks/TankPage.vue'),
  }],
});

router.beforeEach((to: any, from: any, next: any) => {
  next();
});

export default router;