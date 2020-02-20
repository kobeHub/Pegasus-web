import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(BootstrapVue)

const store = new Vuex.Store({
    state: {
        //domain: ""
        userInfo: {
            uid: null,
            email: null,
            name: null
        }
    },
    mutations: {
        // update
        updateUserInfo(state, newUserInfo) {
            state.userInfo = newUserInfo
        },
        clearUserInfo(state) {
            state.userInfo = {
                uid: null,
                email: null,
                name: null
            }
        }
    }
})


new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
