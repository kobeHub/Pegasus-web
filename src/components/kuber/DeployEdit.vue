<template>
  <section class="deployedit">
    <div class="row">
      <div class="col-xl-6 col-md-12 grid-margin stretch-card mx-auto">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Edit Deployment</h4>
            <b-tabs class="tab-solid tab-solid-success">
              <b-tab active>
                <template v-slot:title>
                  <i class="mdi mdi-lead-pencil">Edit</i>
                </template>
                <h5 class="text-info">Metadata</h5>
                <b-form-group label="Name">
                  <b-form-input placeholder="deployment" name="deployname"
                    type="text" v-model="object.metadata.name" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Namespace">
                  <b-form-input type="text" v-model="object.metadata.namespace" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Reschedulable" description="Whether expect your deployments' pods reschedulable during running, select true may result your app unstable">
                  <b-form-radio-group id="radios2" v-model="reschedule"
                    name="reschedulable">
                    <b-form-radio value="true">True</b-form-radio>
                    <b-form-radio value="false">False</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>

                <br><br>
                <h5 class="text-info">Contianers edit</h5>
                <b-card>
                  <b-tabs card>
                    <b-tab v-for="(con, i) in containers" :key="'dyn-tab-' + i" :title="con.name">
                      <b-form-group label="Name">
                        <b-form-input v-model="con.name"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Image">
                        <b-form-input v-model="con.image"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Args" description="Delete or add args">
                        <b-form-tags
                          input-id="tags-pills"
                          v-model="con.args"
                          tag-variant="primary"
                          tag-pills
                          size="lg"
                          seperator=" "
                          placeholder="Enter new args separated by space"
                          class="mb-2"
                        ></b-form-tags>
                      </b-form-group>
                      <div class="row">
                         <div class="col-md-6">
                           <b-form-group horizontal label="Resource request" description="Resources needed at least by the container, 1m CPU means 0.001 core, Memory 10Mi means 10M">
                             <b-form-input v-model="con.resources.requests.cpu" placeholder="cpu"></b-form-input>
                             <b-form-input v-model="con.resources.requests.memory" placeholder="memory" class="mt-2"></b-form-input>
                           </b-form-group>
                         </div>
                         <div class="col-md-6">
                           <b-form-group horizontal label="Resource limits" description="Resources needed at most by the container, 1m means 0.001 core, Memory 10Mi means 10M">
                             <b-form-input v-model="con.resources.limits.cpu" placeholder="cpu"></b-form-input>
                             <b-form-input v-model="con.resources.limits.memory" placeholder="memory" class="mt-2"></b-form-input>
                           </b-form-group>
                       </div>
                       </div>
                      <div>
                        <b-button variant="secondary" class="col-md-4 mr-2" @click="storeContainer(con)">Store</b-button>
                        <b-button variant="light" @click="closeTab(con)" class="col-md-4">
                          Delete
                        </b-button>
                      </div>
                    </b-tab>

                    <template v-slot:tabs-end>
                      <b-nav-item role="presentation" @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
                    </template>

                    <!-- Render this if no tabs -->
                    <template v-slot:empty>
                      <div class="text-center text-muted">
                        There are no containers<br>
                        Create a new container click the <b>+</b> button above.
                      </div>
                    </template>
                  </b-tabs>
                </b-card>
                <b-button variant="success" class="col-md-12 mt-3" @click="commitDeploy">Commit</b-button>
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
    </div>
  </section>
</template>

<script>
import axios from 'axios'
//import dedent from 'dedent'
import YamlView from '../code/YamlView.vue'
import YAML from 'json2yaml'

export default {
  name: 'DeployEdit',
  data() {
    return {
      yaml: '',
      object: '',
      reschedule: '',
      containers: [],
      conCnt: 0
    }
  },
  props: ['ns', 'name'],
  components: {
    YamlView
  },
  computed: {
    currentId() {
      return this.$store.state.userInfo.uid
    },
  },
  async mounted() {
    await this.getDeploy()
  },
  methods: {
    newTab() {
      let container = {
        name: 'new'+ (++this.conCnt),
        image: '',
        args: [],
        ports: [{
          name: 'default-http',
          containerPort: null,
          protocol: 'TCP'}],
        imagePullPolicy: 'IfNotPresent',
        resources: {limits: {cpu: '0m', memory: '0Mi'},
                    requests: {cpu: '0m', memory: '0Mi'}},
        terminationMessagePath: '/dev/termination-log',
        terminationMessagePolicy: 'File'}
      this.containers.push(container)
    },
    closeTab(con) {
      for (let i = 0; i < this.containers.length; i++) {
        if (this.containers[i].name == con.name) {
          this.containers.splice(i, 1)
        }
      }
    },
    storeContainer(con) {
      for (let i = 0; i < this.object.spec.template.spec.containers.length; i++) {
        if (this.object.spec.template.spec.containers[i].name == con.name) {
          this.$toast.info('Container '+ con.name + ' has stored, do not store again!')
          this.object.spec.template.spec.containers[i] = con
          return
        }
      }
      this.object.spec.template.spec.containers.push(con)
      this.$toast.info('Add container ' + con.name + ' successfully')
    },
    commitDeploy() {
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
          axios.post( '/api/tasks/replacedeploy', this.object).then(res => {
            let data = res.data
            if (data.status) {
              this.$toast.info(data.msg)
              this.$router.push('/task')
            } else {
              this.$toast.info(data.msg)
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
    cancelEdit() {
      this.$router.push('/task')
    },
    async getDeploy() {
      const { data } = await axios.get( '/api/tasks/deploy?namespace=' + this.ns +
                                  '&name=' + this.name)
      this.object = data
      this.yaml = YAML.stringify(data)
      this.reschedule = this.object.metadata.labels['pegausus.state/reschedulable'] === 'true'
      this.containers = this.object.spec.template.spec.containers
      this.object.spec.template.spec.containers = []
    }
  }
}
</script>

<style>

</style>
