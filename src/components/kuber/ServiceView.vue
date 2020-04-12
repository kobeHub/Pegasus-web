<template>
  <section class="serviceview">
    <div class="col-xl-6 col-sm-12 grid-margin stretch-card mx-auto">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Create Service</h4>
          <b-tabs class="tab-solid tab-solid-success">
            <b-tab active>
              <template v-slot:title>
                <i class="mdi mdi-playlist-plus">From details</i>
              </template>

              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Name">
                  <b-form-input placeholder="service" v-model="svcName" type="text"></b-form-input>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Namespace">
                  <b-form-select @change="setLabels" v-model="nsSelected" :options="nsOptions" size="sm"></b-form-select>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="App Label" description="Service should have same app lanel with the deployment wanted">
                  <b-form-select v-model="appLabel" :options="labelOptions" size="sm"></b-form-select>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Port">
                  <b-form-input type="number" placeholder="9090" v-model="port"></b-form-input>
                </b-form-group>
              </ValidationProvider>

              <b-button variant="success" class="col-md-12 mt-3" @click="createSvc">Create</b-button>
              <b-button variant="danger" class="col-md-12 mt-2" @click="clearSvc">
                Clear
              </b-button>
            </b-tab>

            <b-tab>
              <template v-slot:title>
                <i class="mdi mdi-file-plus">From yaml</i>
              </template>

              <p class="card-description text-info">
                Please edit nessary TODO fields below, for advanced users only!!!
              </p>

              <YamlView :code="yaml" width="800px"></YamlView>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import dedent from 'dedent'
import YamlView from '../code/YamlView.vue'
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'ServiceView',
  data() {
    return {
      svcName: '',
      nsOptions: [],
      nsSelected: '',
      allLabels: [],
      labelOptions: [],
      appLabel: '',
      port: null,
      yaml: dedent`
      apiVersion: v1
      `
    }
  },
  components: {
    YamlView,
    ValidationProvider
  },
  computed: {
    currentId: function() {
      return this.$store.state.userInfo.uid
    }
  },
  async mounted() {
    await this.getNs()
    await this.getAppLabels()
  },
  methods: {
    async getNs() {
      const { data } = await axios.get( '/api/ns/belong?id=' + this.currentId)
      this.nsOptions = data
    },
    async getAppLabels() {
      const { data } = await axios.get( '/api/ns/labels?id=' + this.currentId)
      this.allLabels = data
    },
    setLabels(v) {
      this.labelOptions = this.allLabels[v]
    },
    createSvc() {
      this.$fire({
        title: 'Have you checked out the form?',
        text: 'Please make sure your infomations correct!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          axios.post( '/api/tasks/svc', {name: this.svcName, namespace: this.nsSelected, app_label: this.appLabel, port: parseInt(this.port)} ).then(res => {
            let data = res.data
            if (data.status) {
              this.$toast.info(data.msg)
              this.$router.push('/task')
            }
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        }
      })
    },
    clearSvc() {
      this.svcName = ''
      this.nsSelected = ''
      this.appLabel = ''
      this.port = null
    }
  }
}
</script>

<style scoped lang="scss">
 span {font-size: 13px;}
</style>
