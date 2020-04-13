<template>
  <section class="serviceedit">
    <div class="col-xl-6 col-md-12 grid-margin stretch-card mx-auto">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Service Edit</h4>
          <b-tabs class="tab-solid tab-solid-success">
            <b-tab active>
              <template v-slot:title>
                <i class="mdi mdi-lead-pencil">Edit</i>
              </template>
              <b-form-group label="Name">
                <b-form-input type="text" v-model="object.metadata.name" readonly></b-form-input>
              </b-form-group>
              <b-form-group label="Namespace">
                <b-form-input type="text" v-model="object.metadata.namespace" readonly></b-form-input>
              </b-form-group>
              <b-form-group label="Port">
                <b-form-input type="number" placeholder="9090" v-model="port"></b-form-input>
              </b-form-group>
              <b-button variant="success" class="col-md-12 mt-3" @click="commitSvc">Commit</b-button>
              <b-button variant="danger" class="col-md-12 mt-2" @click="cancelEdit">
                Cancel
              </b-button>
            </b-tab>
            <b-tab>
              <template v-slot:title>
                <i class="mdi mdi-file-plus">Edit yaml</i>
              </template>

              <p class="card-description text-info">
                Please edit yaml below, for advanced users only!!!
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
import YAML from 'json2yaml'
import YamlView from '../code/YamlView.vue'

export default {
  name: 'ServiceEdit',
  data() {
    return {
      yaml: '',
      object: '',
      port: null
    }
  },
  props: ['ns', 'name'],
  components: {
    YamlView
  },
  computed: {
    currentId() {
      return this.$store.state.userInfo.uid
    }
  },
  async mounted() {
    await this.getService()
  },
  methods: {
    commitSvc() {
      this.$fire({
        title: 'Have you checked out the form?',
        text: 'Please make sure your infomations correct!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, commit it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          this.object.spec.ports[0].port = parseInt(this.port)
          axios.post( '/api/tasks/replacesvc', this.object).then(res => {
            if (res.data.status) {
              this.$toast.info(res.data.msg)
              this.$router.push('/task')
            } else {
              this.$toast.info(res.data.msg)
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
    async getService() {
      const { data } = await axios.get( '/api/tasks/svc?namespace=' + this.ns +
                                        '&name=' + this.name)
      this.object = data
      this.yaml = YAML.stringify(data)
      this.port = this.object.spec.ports[0].port
    },
    cancelEdit() {
      this.port = this.object.spec.ports[0].port
    }
  }
}
</script>

<style>

</style>
