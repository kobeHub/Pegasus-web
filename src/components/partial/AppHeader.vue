<template>
  <b-navbar class="fixed-top" toggleable="md" type="dark" variant="info">
    <div class="text-center navbar-brand-wrapper d-flex align=items-top justify-content-center">
      <b-navbar-brand to="/">
        <div class="text-success">Pegasus</div>
      </b-navbar-brand>
      <a class="navbar-brand brand-logo-mini" href="/">
        <img alt="logo" src="../../assets/images/logo.png"/>
      </a>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center ml-auto ml-lg-0">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right class="preview-list">
          <template slot="button-content">
            <div class="count-indicator">
              <i class="icon mdi mdi-email-variant"></i>
              <span class="count">0</span>
            </div>
          </template>
          <b-dropdown-item class="preview-item" href="#">
            <p class="mb-0 font-weight-normal float-left">You have 4 new notifications
            </p>
            <span class="badge badge-pill badge-warning">View all</span>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item" href="#">
            <div class="preview-thumbnail">
              <div class="preview-icon bg-success">
                <i class="mdi mdi-alert-circle-outline mx-0"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <h6 class="preview-subject font-weight-medium">Application Error</h6>
              <p class="font-weight-light small-text">
                Just now
              </p>
            </div>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item" href="#">
            <div class="preview-thumbnail">
              <div class="preview-icon bg-warning">
                <i class="mdi mdi-comment-text-outline mx-0"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <h6 class="preview-subject font-weight-medium">Settings</h6>
              <p class="font-weight-light small-text">
                Private message
              </p>
            </div>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item" href="#">
            <div class="preview-thumbnail">
              <div class="preview-icon bg-info">
                <i class="mdi mdi-email-outline mx-0"></i>
              </div>
            </div>
            <div class="preview-item-content">
              <h6 class="preview-subject font-weight-medium">New user registration</h6>
              <p class="font-weight-light small-text">
                 2 days ago
              </p>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right class="preview-list">
          <template slot="button-content">
            <div class="count-indicator">
              <i class="icon mdi mdi-bell-outline"></i>
              <span class="count">0</span>
            </div>
          </template>
          <b-dropdown-item class="preview-item flex-wrap flex-sm-nowrap" href="#">
            <p class="mb-0 font-weight-normal float-left">You have 4 unread mails</p>
            <span class="badge badge-pill badge-warning">View all</span>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item">
            <div class="preview-thumbnail">
              <img src="../../assets/images/faces/face10.jpg" alt="image" class="img-sm profile-pic">
            </div>
            <div class="preview-item-content flex-grow py-2">
              <p class="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
              <p class="font-weight-light small-text"> The meeting is cancelled </p>
            </div>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item">
            <div class="preview-thumbnail">
              <img src="../../assets/images/faces/face12.jpg" alt="image" class="img-sm profile-pic">
            </div>
            <div class="preview-item-content flex-grow py-2">
              <p class="preview-subject ellipsis font-weight-medium text-dark">David Grey</p>
              <p class="font-weight-light small-text"> The meeting is cancelled </p>
            </div>
          </b-dropdown-item>
          <b-dropdown-item class="preview-item">
            <div class="preview-thumbnail">
              <img src="../../assets/images/faces/face1.jpg" alt="image" class="img-sm profile-pic">
            </div>
            <div class="preview-item-content flex-grow py-2">
              <p class="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins</p>
              <p class="font-weight-light small-text"> The meeting is cancelled </p>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown right class="preview-list">
          <template slot="button-content">
            <img src="../../assets/images/faces/face4.jpg" alt="profile image"  class="img-xs rounded-circle">
          </template>
          <b-dropdown-item href="javsscript:;" class="preview-item flex-wrap">profile</b-dropdown-item>
          <b-dropdown-item href="javascript:;" class="preview-item flex-wrap" @click="logout">logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <button class="navbar-toggler navbar-toggler-right align-self-center" type="button" @click="collapedMobileSidebar()">
        <span class="mdi mdi-menu"></span>
      </button>
    </div>
  </b-navbar>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app-header',
  data() {
    return {
      isLogouting: null,
      mainProps: { width: 78, height: 58}
    }
  },
  methods: {
    collapedMobileSidebar: () => {
      document.querySelector('.sidebar').classList.toggle('active')
    },
    logout: function() {
      this.isLogouting = true
      axios.post('/api/users/logout').then(res => {
        if(res.status == 200) {
          alert('Logout success', res.data.msg)
          this.$store.commit('clearUserInfo')
          this.$store.commit('logout')
        }
      }).catch(err => {
        let res = err.response
        if (res.status == 500) {
          this.$router.push('/error')
        } else {
          this.$toast.error(res.data.msg)
        }
      })

      this.timer = setTimeout(() => {
        this.$router.push('/login')
      }, 200)
    },
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">
 .app-header {
 }
</style>
