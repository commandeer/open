import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import  {
  battleStore,
  tankStore,
} from './stores'

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
  },
};

export default new Vuex.Store<IRootState>(store);
