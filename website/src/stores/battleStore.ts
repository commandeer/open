import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { IRootState } from '../store';
import { Battle, BattleService } from '../battles';

const namespaced: boolean = true;

export { Battle };

export interface IBattleState {
  battles?: Battle[];
  error: boolean;
};

const state: IBattleState = {
  battles: [],
  error: false
};

const actions: ActionTree<IBattleState, IRootState> = {

  async clearCache({ commit }): Promise<any> {
    try {
      await BattleService.clearCache();
      commit('battlesCleared');
    } catch (error) {
      commit('battleError');
      throw error;
    }
  },

  async fetchBattles({ commit }): Promise<any> {
    try {
      const battles = await BattleService.getBattles();
      commit('battlesLoaded', battles);
    } catch (error) {
      commit('battleError');
      throw error;
    }
  },

};

const getters: GetterTree<IBattleState, IRootState> = {};

const mutations: MutationTree<IBattleState> = {

  battlsCleared(state) {
    state.error = false;
    state.battles = [];
  },

  battlesLoaded(state, battles: Battle[]) {
    state.error = false;
    state.battles = battles;
  },

  battleError(state) {
    state.error = true;
    state.battles = [];
  }

};

export const battleStore: Module<IBattleState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
