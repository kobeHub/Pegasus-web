<template>
  <div class="nodegrafana">
    <div class="ml-auto">
      <b-card-group deck>
        <b-card bg-variant="light" header="Cluster CPU Usage" text-variant="dark" class="text-center">
          <iframe :src="ccpuUrl" width="400" height="300" frameborder="0"></iframe>
        </b-card>

        <b-card bg-variant="light" header="Cluster Memory Usage" text-variant="dark" class="text-center">
          <iframe frameborder="0" width="400" height="300" :src="cmemUrl"></iframe>
        </b-card>
      </b-card-group>
    </div>
    <div class="mt-5 ml-auto">
      <b-card-group deck>
        <b-card bg-variant="light" header="Nodes CPU stat" text-variant="dark" class="text-center">
          <iframe frameborder="0" width="500" height="300" :src="ncpuUrl"></iframe>
        </b-card>

        <b-card bg-variant="light" header="Node Memory stat" text-variant="dark" class="text-center">
          <iframe frameborder="0" width="500" height="300" :src="nmemUrl" scrolling=no></iframe>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeGrafana',
  data() {
    return {
      ccpuUrl: 'http://grafana.local/d-solo/mNdiCfrWz/pegasus-front?orgId=1&refresh=10s&theme=light&panelId=6',
      cmemUrl: 'http://grafana.local/d-solo/mNdiCfrWz/pegasus-front?orgId=1&refresh=10s&theme=light&panelId=8',
      ncpuUrl: 'http://grafana.local/d-solo/mNdiCfrWz/pegasus-front?orgId=1&refresh=10s&theme=light&panelId=2',
      nmemUrl: 'http://grafana.local/d-solo/mNdiCfrWz/pegasus-front?orgId=1&refresh=10s&theme=light&panelId=4',
    }
  },
}
</script>

<scss scoped lang="scss">

</scss>
