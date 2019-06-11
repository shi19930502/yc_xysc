import Vue from 'vue'
import Vuex from 'vuex'

import Cart from './moudules/cart'
import Products from './moudules/products'
import ShopList from './moudules/ShopList'
import Address from './moudules/address'
import Order from './moudules/order'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    quickUserInfo: {
      name: window.localStorage.getItem('quickUserInfo' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem(
        'quickUserInfo' || '[]')).username,
    },
    navBarTitle: '',
    isLoading: false,
  },
  mutations: {
    login(state, quickUserInfo) {
      state.quickUserInfo = quickUserInfo;
      window.localStorage.setItem('quickUserInfo', JSON.stringify(quickUserInfo));

    },
    changeNavBarTitle(state, name) {
      state.navBarTitle = name;
      document.title = state.navBarTitle;
    },
    updateLoadingStatus(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    changeNavBarTitle({
      commit,
      state
    }, name) {
      commit('changeNavBarTitle', name)
    }
  },
  modules: {
    Cart,
    Products,
    Address,
    Order
  },
});
