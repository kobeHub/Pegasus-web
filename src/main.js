import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import { extend } from 'vee-validate'
import { required, email, alpha_dash, confirmed} from 'vee-validate/dist/rules'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(BootstrapVue)

// Vuex state store
const store = new Vuex.Store({
    state: {
        //domain: ""
        userInfo: {
            uid: null,
            email: null,
            name: null
        },
        isLogged: true
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
        },
        login(state) {
            state.isLogged = true
        },
        logout(state) {
            state.isLogged = false
        }
    }
})

// vee-validate extends
extend('email', {
    ...email,
    message: 'A valid email address is required'
})

extend('required', {
    ...required,
    message: 'This field is required'
})

extend('alpha_dash', {
    ...alpha_dash,
    message: 'Only characters, digits, _ are allowed'
})

extend('confirmed', {
    ...confirmed,
    message: 'Two passwords are not same'
})

extend('minmax', {
    validate(value, { min, max }) {
        return value.length >= min && value.length <= max;
    },
    params: ['min', 'max'],
    message: '{_field_} length must between {min}  and {max}'
});



new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
