import { createStore, createLogger } from 'vuex'
import state from '@/store/state'
import mutations from '@/store/mutations'
import * as actions from '@/store/actions'
import * as getters from '@/store/getters'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  actions,
  getters,
  plugins: debug ? [createLogger()] : []
})
