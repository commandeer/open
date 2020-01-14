import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import  { battleStore } from './battles/battleStore';
import  { tankStore } from './tanks/tankStore';
import  { userStore } from './users/userStore';

export interface IRootState {
  version: string;
}

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {
  state: {
    version: '1.0.0' // a simple property
  },
  modules: {
    battleStore,
    tankStore,
    userStore,
  },
};

export default new Vuex.Store<IRootState>(store);
