<template>
  <div class="homepage" id="homepage">

    <h1>{{ msg }}</h1>

    <transition name="fade">
    <div class="info">
      <img class="portrait" src="../assets/profile.png" width="200" height="200" />

      <div class="user-info">
        <h1 class="nick" v-text="'Hello, ' + $store.state.userInfo.name"></h1>
      </div>
      <Loading v-if="isLogouting" marginTop="3%"></Loading>
    </div>
  </transition>
  </div>
</template>

<script>
// import axios from 'axios'
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
  beforeCreate() {
    if (this.$store.state.userInfo.uid !== null) {
      this.$store.commit('login')
    } else {
      //alert('Please login first')
      this.$router.push('/login')
    }
  },
  components: {
    Loading,
  },
  methods: {
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
 .log-btn{width:80px; display: block; text-align: left; line-height: 50px;margin:0 auto 15px; height:40px; color:#fff; font-size:13px;-webkit-border-radius: 5px; background-color: #3B5999;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px;
position: relative;}
 .log-btn{background-color: #50E3CE;text-align: center;}
 .log-btn .icons{margin-left: 30px; vertical-align: middle;}
 .log-btn .text{left: 95px; line-height: 50px; text-align: left; position: relative;}

</style>
