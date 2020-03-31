<template>
  <div class="homepage" id="homepage">
    <NodeGrafana></NodeGrafana>
  </div>
</template>

<script>
// import axios from 'axios'
//import Loading from './partial/Loading.vue'
import NodeGrafana from './kuber/NodeGrafana.vue'

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
    NodeGrafana
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
