import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Login from '@/components/user/Login'
import Register from '@/components/user/Register'
import Invitation from '@/components/user/Invitation'
import Department from '@/components/user/Department'
import TaskView from '@/components/kuber/TaskView'
import DeployView from '@/components/kuber/DeployView'
import ServiceView from '@/components/kuber/ServiceView'
import DeployEdit from '@/components/kuber/DeployEdit'
import ServiceEdit from '@/components/kuber/ServiceEdit'
import Registry from '@/components/kuber/Registry'
import ImagesDetail from '@/components/kuber/ImagesDetail'

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
            path: '/editdeploy/:ns/:name',
            component: DeployEdit,
            props: true
        },
        {
            path: '/editsvc/:ns/:name',
            component: ServiceEdit,
            props: true
        },
        {
            path: '/createsvc',
            component: ServiceView
        },
        {
            path: '/registry',
            component: Registry,
        },
        {
            path: '/images/:repo',
            component: ImagesDetail,
            props: true
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
