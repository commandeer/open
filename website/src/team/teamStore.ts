import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { IRootState } from '../store';
import { User, TeamService } from '../team';

const namespaced: boolean = true;

export { User };

export interface ITeamState {
  team?: User[];
  error: boolean;
};

const state: ITeamState = {
  team: [],
  error: false
};

const actions: ActionTree<ITeamState, IRootState> = {

  async clearCache({ commit }): Promise<any> {
    try {
      await TeamService.clearCache();
      commit('teamCleared');
    } catch (error) {
      commit('teamError');
      throw error;
    }
  },

  async fetchTeam({ commit }): Promise<any> {
    try {
      const team = await TeamService.getTeam();
      commit('teamLoaded', team);
    } catch (error) {
      commit('teamError');
      throw error;
    }
  },

};

const getters: GetterTree<ITeamState, IRootState> = {};

const mutations: MutationTree<ITeamState> = {

  personnelCleared(state) {
    state.error = false;
    state.team = [];
  },

  teamLoaded(state, team: User[]) {
    state.error = false;
    state.team = team;
  },

  teamError(state) {
    state.error = true;
    state.team = [];
  }

};

export const teamStore: Module<ITeamState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
