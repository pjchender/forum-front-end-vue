import Vue from 'vue'
import Vuex from 'vuex'
import usersAPI from './apis/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
      image: '',
      isAdmin: false
    },
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    setCurrentUser (state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }

      state.token = localStorage.getItem('token')
      state.isAuthenticated = true
    },
    revokeAuthentication (state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {
    // 在 actions 中可以透過參數的方式取得 commit 的方法
    async fetchCurrentUser ({ commit }) {
      try {
        const { data: { profile }, statusText } = await usersAPI.get()

        if (statusText !== 'OK') {
          throw new Error(statusText)
        }

        commit('setCurrentUser', {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
          isAdmin: profile.isAdmin
        })
        return true
      } catch (error) {
        commit('revokeAuthentication')
        return false
      }
    }
  }
})
