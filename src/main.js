import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from './plugin/element'
import VueParticles from 'vue-particles'
import VCharts from 'v-charts'
//富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import VueClipboard from 'vue-clipboard2'//双击复制
import qs from 'qs'


//引入element
element()

//粒子特效
Vue.use(VueParticles)

Vue.config.productionTip = false

//富文本
Vue.use(VueQuillEditor)


//qs
Vue.prototype.$qs=qs

//v-charts
Vue.use(VCharts)

//双击复制
Vue.use(VueClipboard)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
