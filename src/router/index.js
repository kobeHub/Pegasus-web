import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/Login'
import Register from '@/components/Register'

Vue.use(Router)

/**
 * Overide router push methods
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
    routes: [
        {
            path: '/',
            name: "index",
            component: HomePage
        },
        {
            path: "/login",
            component: Login
        },
        {
            path: "/logon",
            component: Register
        }
    ]
})
