import Vue from 'vue'
import Vuex from 'vuex'
import Persistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    admin: {
      name: '',
      id: ''
    }
  },
  mutations: {
    logout (state) {
      state.admin.name = ''
      state.admin.id = ''
    },
    login (state, data) {
      state.admin.name = data.account
      state.admin.id = data._id
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [Persistedstate()]
})
