import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Error404 from '@/components/Errors/error-404'

Vue.use(Router)

/**
 * Overide router push methods
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
    mode: 'history',
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
            path: "/logon/:uuid",
            component: Register,
            props: true
        },
        {
            path: '*',
            component: Error404
        }
    ]
})
