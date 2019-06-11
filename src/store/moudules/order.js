const state = {
  // 确认订单选择支付方式及时间参数
  payParams: null,
}

/**
 * getters
 */
const getters = {
  getPayParams: state => state.payParams
}

/**
 * actions
 */
const actions = {
  setPayParams({
    commit
  }, payParams) {
    commit('setPayParams', payParams)
  }
}

/**
 * mutations
 */
const mutations = {
  setPayParams(state, payParams) {
    state.payParams = payParams
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
