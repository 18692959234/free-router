import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.config.optionMergeStrategies.meta = function (parentVal, childVal, vm) {
  console.log(parentVal)
  console.log(childVal)
  console.log(vm)
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
