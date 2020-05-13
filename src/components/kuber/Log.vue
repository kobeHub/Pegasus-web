<template>
  <section class="log">
    <b-card title="Containers logs">
      <b-row>
      <h5 class="col text-info">Select a container show logs</h5>

        <b-col align-self="center">
          <router-link to="/task">
            <b-img center width=40 class="mb-3" :src="require('../../assets/images/back.png')"></b-img>
          </router-link>
        </b-col>
      </b-row>
      <b-badge
        class="m-2"
        v-for="(container, i) in containers"
        :key="'dyn-badge-' + i"
        :variant="randomColor(i)"
        href="#"
        @click="getLog(container)"
        pill>
        {{ container }}
      </b-badge>

      <AceEditor
        :fontSize="14"
        :showPrintMargin="true"
        :showGutter="true"
        width="width"
        :maxLines=40
        :highlightActiveLine="true"
        mode="dockerfile"
        :value="content"
        theme="monokai"
        name="editor"
        readOnly
        :editorProps="{$blockScrolling: true}"/>

    </b-card>
  </section>
</template>

<script>
import axios from 'axios'
import { Ace as AceEditor} from 'vue2-brace-editor'

import 'brace/mode/dockerfile'
import 'brace/theme/monokai'

export default {
  name: 'Log',
  data() {
    return {
      containers: [],
      content: '',
      styles: [
        'primary',
        'info',
        'success',
        'secondary',
        'dark',
        'warning'
      ],
    }
  },
  props: ['ns', 'pod'],
  components: {
    AceEditor,
  },
  async mounted() {
    await this.getContainers()
    if (this.containers.length >= 1) {
      await this.getLog(this.containers[0])
    }
  },
  methods: {
    async getContainers() {
      const { data } = await axios.get( '/api/tasks/containers?namespace='
                                + this.ns + '&name=' + this.pod)
      this.containers = data
    },
    async getLog(con) {
      const { data } = await axios.get( '/api/tasks/podlog?namespace='
                                      + this.ns + '&name=' + this.pod + '&container='
                                      + con)
      this.content = data
    },
    randomColor(i) {
      return this.styles[i % 6]
    }
  }
}
</script>
