<template>
  <div id="app">
    <div class="container-scroller" v-if="$store.state.isLogged">
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

    <div class="container-fluid" v-if="!$store.state.isLogged">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/partial/AppHeader.vue'
import AppSidebar from './components/partial/AppSidebar.vue'
import AppFooter from './components/partial/AppFooter.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  data: function() {
     return {
      userInfo: {
         uid: null,
         email: null,
         name: null
       }
    }
  },
  mounted() {
    if (this.$store.state.userInfo.role == null) {
      this.authoInit()
    }
  },
  methods: {
    authoInit: function(){
      console.log('Authorized test')
      axios.post('/api/users/whoami').then(res => {
          this.userInfo = {
            uid: res.data.id,
            email: res.data.email,
            name: res.data.name,
            role: res.data.role,
            belong_to: res.data.belong_to,
          }
          this.$store.commit('updateUserInfo', this.userInfo)
          this.$store.commit('login')
      }).catch(e => {
        console.log(e)
        this.$store.commit('clearUserInfo')
      })
    },
    updateAuth(e) {
      this.isLogged = e
    },
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
