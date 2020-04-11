import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/user/Login'
import Register from '@/components/user/Register'
import Invitation from '@/components/user/Invitation'
import Department from '@/components/user/Department'
import TaskView from '@/components/kuber/TaskView'
import DeployView from '@/components/kuber/DeployView'

import Error404 from '@/components/Errors/error-404'
import Error500 from '@/components/Errors/error-500'

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
            path: '/login',
            component: Login
        },
        {
            path: '/logon/:uuid',
            component: Register,
            props: true
        },
        {
            path: '/members',
            component: Invitation,
            props: true
        },
        {
            path: '/departments',
            component: Department
        },
        {
            path: "/task",
            component: TaskView
        },
        {
            path: '/createdeploy',
            component: DeployView,
        },
        {
            path: '/error',
            component: Error500
        },
        {
            path: '/notfound',
            component: Error404
        },
        {
            path: '*',
            component: Error404
        }
    ]
})
