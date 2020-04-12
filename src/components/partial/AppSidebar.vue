<template>
<section class="app-sidebar">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav">
        <li class="nav-item nav-profile">
          <div class="nav-link">
            <div class="profile-image"> <img src="../../assets/images/faces/face4.jpg" alt="image"/> <span class="online-status online"></span> </div>
            <div class="profile-name">
              <p class="name">{{ userName }}</p>
              <p class="designation">{{ userRole }}</p>
              <div class="badge badge-teal mx-auto mt-3">Online</div>
            </div>
          </div>
        </li>
        <li class="nav-item"><router-link class="nav-link" to="/"><img class="menu-icon" src="../../assets/images/menu_icons/dash.png" alt="menu icon"><span class="menu-title">Dashboard</span></router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/task"><img class="menu-icon" src="../../assets/images/menu_icons/task.png" alt="menu icon"><span class="menu-title">Tasks</span></router-link></li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'depart-member'">
            <img class="menu-icon" src="../../assets/images/menu_icons/depart.png" alt="menu icon"><span class="menu-title">Depart & members</span><i class="menu-arrow"></i>
          </span>
          <b-collapse id="depart-member">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item"><router-link class="nav-link" to="/departments">Department</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/members">Members</router-link></li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-b-toggle="'ui-components'">
            <img class="menu-icon" src="../../assets/images/menu_icons/k8s.png" alt="menu icon"><span class="menu-title">Establish</span><i class="menu-arrow"></i>
          </span>
          <b-collapse id="ui-components">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item"><router-link class="nav-link" to="/createdeploy">Deployment</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/createsvc">Service</router-link></li>
              <li class="nav-item"><router-link class="nav-link" to="/createing">Ingress</router-link></li>
            </ul>
          </b-collapse>
        </li>
        <li class="nav-item"><router-link class="nav-link" to="#"><img class="menu-icon" src="../../assets/images/menu_icons/docker.png" alt="menu icon"><span class="menu-title">Docker images registry</span></router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="#"><img class="menu-icon" src="../../assets/images/menu_icons/setting.png" alt="menu icon"><span class="menu-title">Settings</span></router-link></li>
        </ul>
    </nav>
  </section>
</template>

<script>
export default {
  name: 'app-sidebar',
  computed: {
    userRole: function() {
      return this.$store.state.userInfo.role
    },
    userName: function() {
      return this.$store.state.userInfo.name
    }
  }
}
</script>

<style scoped lang="scss">
.app-sidebar{}
</style>
