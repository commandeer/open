import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'md',
  options: {
    customProperties: true
  },
  theme: {
    primary: '#ffa500',
    secondary: '#fff',
    accent: '#0565b2',
    error: '#ff576b',
  }
});
