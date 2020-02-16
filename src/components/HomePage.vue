<template>
  <div class="homepage" id="homepage">

    <h1>{{ msg }}</h1>

    <transition name="fade">
    <div class="info">
      <img class="portrait" src="../assets/profile.png" width="200" height="200" />

      <div class="user-info">
        <h1 class="nick" v-text="'Hello, ' + $store.state.userInfo.name"></h1>
        <a href="javascript:;" class="logout" @click="logout" v-if="!isLogouting"> [退出]</a>
      </div>
      <Loading v-if="isLogouting" marginTop="3%"></Loading>
    </div>
  </transition>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from './Loading.vue'

export default {
  name: 'HomePage',
  data: function() {
    return {
      msg: "Welcome to Pegasus",
      isLogouting: false,
      timer: null,
    }
  },
  components: {
    Loading,
  },
  methods: {
    logout: function() {
      this.isLogouting = true
      axios.post('/api/users/logout').then(res => {
        if(res.status == 200) {
          alert('Logout success', res.data.msg)
          this.$state.commit('clearUserInfo')
        }
      })

      this.timer = setTimeout(() => {
        this.$router.push('/login')
        this.isLogouting = false
      }, 200)
    },
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 h3 {
   margin: 40px 0 0;
 }
 ul {
   list-style-type: none;
   padding: 0;
 }
 li {
   display: inline-block;
   margin: 0 10px;
 }
 a {
   color: #42b983;
 }
 .info{background: #fff; width: 100%; height: 600px; color: #2c3e50; text-align: center; padding-top: 170px;}
 .portrait{width: 200px; height: 200px; overflow:hidden; -webkit-border-radius: 100%;
   -moz-border-radius: 100%;
   -ms-border-radius: 100%;
   -o-border-radius: 100%;
   border-radius: 100%; background-color: #CCCCCC; margin:0 auto 15px;border: 2px solid #2c3e50; display: block;}
 .user-info{margin: 38px 0 0 0; vertical-align: top;}
 .user-info, .w-star, .w-diamond, .nick, .level{display: inline-block;}
 .nick{margin-right: 10px;}
 .cut{padding: 0 10px; color:#E9E9E9; font-size: 15px;}
 .logout{color: #2c3e50; display: block; margin-top: 20px;}
</style>
