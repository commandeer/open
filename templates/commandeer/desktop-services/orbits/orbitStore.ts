import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { OrbitService } from './orbitService';
import { IRootState } from '../../store';
import { IOrbitState } from './types';
import { Orbit } from './orbit';

const namespaced: boolean = true;
const state: IOrbitState = {
  orbits: [],
  error: false
};

const actions: ActionTree<IOrbitState, IRootState> = {

  async clearCache({ commit }): Promise<any> {
    try {
      await OrbitService.clearCache();
      commit('orbitsCleared');
    } catch (error) {
      commit('orbitError');
      throw error;
    }
  },

  async fetchOrbits({ commit }): Promise<any> {
    try {
      const orbits = await OrbitService.getOrbits();
      commit('orbitsLoaded', orbits);
    } catch (error) {
      commit('orbitError');
      throw error;
    }
  },

};

const getters: GetterTree<IOrbitState, IRootState> = {};

const mutations: MutationTree<IOrbitState> = {

  orbitsCleared(state) {
    state.error = false;
    state.orbits = [];
  },

  orbitsLoaded(state, orbits: Orbit[]) {
    state.error = false;
    state.orbits = orbits;
  },

  orbitError(state) {
    state.error = true;
    state.orbits = [];
  }

};

export const ec2Store: Module<IOrbitState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
