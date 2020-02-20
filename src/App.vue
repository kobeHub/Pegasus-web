<template>
  <div id="app">
    <div class="container-scroller">
      <!--header-->
      <div class="container-fluid page-body-wrapper">
        <!--sidebar-->
        <div class="main-panel">
          <div class="content-wrapper">
            <router-view></router-view>
          </div>
          <!--app-footer-->
        </div>
        <!--main panel ends-->
      </div>
      <!--page body wrapper ends-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
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
