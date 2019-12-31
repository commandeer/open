import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { TankService } from '../tanks/tankService';
import { IRootState } from '../store';
import { Tank } from '../tanks/tank';

const namespaced: boolean = true;

export { Tank };

export interface ITankState {
  tanks?: Tank[];
  error: boolean;
};

const state: ITankState = {
  tanks: [],
  error: false
};

const actions: ActionTree<ITankState, IRootState> = {

  async clearCache({ commit }): Promise<any> {
    try {
      await TankService.clearCache();
      commit('tanksCleared');
    } catch (error) {
      commit('tankError');
      throw error;
    }
  },

  async fetchTanks({ commit }): Promise<any> {
    try {
      const tanks = await TankService.getTanks();
      commit('tanksLoaded', tanks);
    } catch (error) {
      commit('tankError');
      throw error;
    }
  },

};

const getters: GetterTree<ITankState, IRootState> = {};

const mutations: MutationTree<ITankState> = {

  tanksCleared(state) {
    state.error = false;
    state.tanks = [];
  },

  tanksLoaded(state, tanks: Tank[]) {
    state.error = false;
    state.tanks = tanks;
  },

  tankError(state) {
    state.error = true;
    state.tanks = [];
  }

};

export const tankStore: Module<ITankState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
