<template>
  <div class="nodeview">
    <div class="col-12 ml-auto">
      <b-card-group deck>
        <b-card bg-variant="dark" header="Dark" text-variant="white" class="text-center">
          <iframe src="http://grafana.local/d-solo/mNdiCfrWz/pegasus-front?orgId=1&refresh=10s&from=1585564422701&to=1585564722701&panelId=6" width="450" height="200" frameborder="0"></iframe>
          <div>

          </div>
        </b-card>

        <b-card bg-variant="dark" header="Dark" text-variant="white" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <div class="col-12 mt-3 ml-auto">
      <b-card-group deck>
        <b-card bg-variant="dark" header="Dark" text-variant="white" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>

        <b-card bg-variant="dark" header="Dark" text-variant="white" class="text-center">
          <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeGrafana',
}
</script>

<scss scoped lang="scss">

</scss>
