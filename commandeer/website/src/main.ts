import App from './App.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';
import './plugins/vuetify';
import router from './router';
import store from './store';
import 'vuetify/dist/vuetify.min.css';
import vuexI18n from 'vuex-i18n';
import en from './translations/en';

const VueHighlightJs = require('vue-highlightjs');

Vue.config.productionTip = false;

Vue.use(vuexI18n.plugin, store);
Vue.i18n.add('en', en);
Vue.i18n.set('en');

Vue.use(Vuetify, {
  theme: {
    primary: '#ffa500',
    secondary: '#fff',
    accent: '#0565b2',
    error: '#ff576b',
  },
});

Vue.use(VueHighlightJs); // syntax highlighting with Vue.js

async function initialize() {
  // do any kind of await async operations to setup the shop
}

function loadApp() {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
}

initialize().then(() => {
  loadApp();
}).catch(() => {
  loadApp();
});
