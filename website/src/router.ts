import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    redirect: { name: 'tanksPage' },
  }, {
    path: '/team',
    name: 'teamPage',
    component: () => import('./team/TeamPage.vue'),
    children: [{
      path: ':id/view',
      name: 'userDetail',
      component: () => import('./team/UserComponent.vue') ,
      props: true,
    }],
  }, {
    path: '/tanks',
    name: 'tanksPage',
    component: () => import('./tanks/TankPage.vue'),
    children: [{
      path: ':id/view',
      name: 'tankDetail',
      component: () => import('./tanks/TankComponent.vue') ,
      props: true,
    }],
  }, {
    path: '/battles',
    name: 'battlePage',
    component: () => import('./battles/BattlePage.vue'),
  }],
});

router.beforeEach((to: any, from: any, next: any) => {
  next();
});

export default router;