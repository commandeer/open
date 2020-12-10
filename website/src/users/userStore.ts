import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { IRootState } from '../store';
import { User } from './types/user';
import { UserService } from './userService';

const namespaced: boolean = true;

export { User };

export interface IUserState {
  users?: User[];
  error: boolean;
};

const state: IUserState = {
  users: [],
  error: false
};

const actions: ActionTree<IUserState, IRootState> = {

  async clearCache({ commit }): Promise<any> {
    try {
      await UserService.clearCache();
      commit('userCleared');
    } catch (error) {
      commit('userError');
      throw error;
    }
  },

  async fetchUsers({ commit }): Promise<any> {
    try {
      const users = await UserService.getUsers();
      commit('usersLoaded', users);
    } catch (error) {
      commit('userError');
      throw error;
    }
  },

};

const getters: GetterTree<IUserState, IRootState> = {};

const mutations: MutationTree<IUserState> = {

  usersCleared(state) {
    state.error = false;
    state.users = [];
  },

  usersLoaded(state, users: User[]) {
    state.error = false;
    state.users = users;
  },

  userError(state) {
    state.error = true;
    state.users = [];
  }

};

export const userStore: Module<IUserState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
