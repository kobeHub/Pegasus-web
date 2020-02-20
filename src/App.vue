<template>
  <div id="app">
    <div class="container-scroller" v-if="isLogged">
      <!--header-->
      <app-header/>
      <div class="container-fluid page-body-wrapper">
        <!--sidebar-->
        <app-sidebar/>
        <div class="main-panel">
          <div class="content-wrapper">
            <router-view></router-view>
          </div>
          <app-footer/>
          <!--app-footer-->
        </div>
        <!--main panel ends-->
      </div>
      <!--page body wrapper ends-->
    </div>

    <div class="container" v-if="!isLogged">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  data: () => {
    return {
      isLogged: false,
      userInfo: {
        uid: null,
        email: null,
        name: null
      }
    }
  },
  updated: () => {
    console.log('Before create')
    axios.post('/api/users/whoami').then(res => {
      if (res.status == 200) {
        this.isLogged = true
        this.userInfo = {
          uid: res.data.id,
          email: res.data.email,
          name: res.data.name
        }
        this.$store.commit('updateUserInfo', this.userInfo)
        this.$router.push('/')
      } else if(res.status == 401) {
        this.isLogged = false
        this.$store.commit('clearUserInfo')
        this.$router.push('/login')
      }
    }).catch(e => {
      this.isLogged = false
      console.log(e)
    })
  }
}
</script>

<style>
 @import "../node_modules/mdi/css/materialdesignicons.min.css";
 @import "../node_modules/flag-icon-css/css/flag-icon.min.css";
 @import "../node_modules/font-awesome/css/font-awesome.min.css";
</style>

<style lang="scss">
 @import "~@/assets/scss/style";
</style>
