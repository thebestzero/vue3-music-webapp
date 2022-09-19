import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
// 自定义指令
import loadingDirective from '@/components/Base/Loading/directive'
import noResultDirective from '@/components/Base/No-Result/directive'
// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, { loading: require('@/assets/images/default.png') })
  .directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
