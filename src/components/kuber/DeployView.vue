<template>
  <section class="deployview">
    <div class="row">
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card mx-auto">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Create Deployment</h4>
            <b-tabs class="tab-solid tab-solid-success">
              <b-tab active>
                <template v-slot:title>
                  <i class="mdi mdi-playlist-plus">From details</i>
                </template>

                <h5 class="text-info">Metadata</h5>

                <ValidationProvider rules="required" name="deployname" v-slot="{ errors }">
                  <b-form-group label="Name">
                    <b-form-input placeholder="deployment" name="deployname"
                      type="text" v-model="name"></b-form-input>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider rules="required" name="namespace" v-slot="{ errors }">
                  <b-form-group label="Namespace">
                    <b-form-select v-model="nsSelected" name="namespace"
                      :options="nsOptions" size="sm">
                    </b-form-select>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider rules="required" name="reschedulable"
                  v-slot="{ errors }">
                  <b-form-group label="Reschedulable" description="Whether expect your deployments' pods reschedulable during running, select true may result your app unstable">
                    <b-form-radio-group id="radios2" v-model="reschedulable"
                      name="reschedulable">
                      <b-form-radio value="true">True</b-form-radio>
                      <b-form-radio value="false">False</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <div class="row">
                  <div class="col-md-6">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group horizontal label="AppLabel"
                        description="The only identify of your app">
                        <b-form-input v-model="appLabel"></b-form-input>
                      </b-form-group>
                      <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                  <div class="col-md-6">
                    <ValidationProvider rules="required" v-slot="{ errors }">
                      <b-form-group horizontal label="Replicas" description="How many pods do you expect">
                        <b-form-input v-model="replicas" type="number" placeholder="1-10"></b-form-input>
                      </b-form-group>
                      <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                </div>

                <br><br>
                <h5 class="text-info">Containers specfic</h5>
                <b-card no-body>
                  <b-tabs card>
                    <!-- Render Tabs, supply a unique `key` to each tab -->
                    <b-tab v-for="(tab, i) in tabs" :key="'dyn-tab-' + i" :title="'Container ' + i">
                        <b-form-group label="Name">
                          <b-form-input v-model="tab.conName" placeholder="Container Name">
                          </b-form-input>
                        </b-form-group>
                        <b-form-group label="Image">
                          <b-form-input v-model="tab.image" placeholder="docker image"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Args" description="Args seperated by ; ">
                          <b-form-input v-model="tab.args" placeholder="--bar=1;--foo=test"></b-form-input>
                       </b-form-group>
                       <b-form-group label="Container port">
                         <b-form-input v-model="tab.port" type="number" placeholder="9090"></b-form-input>
                       </b-form-group>
                       <b-form-group label="Protocol">
                         <b-form-select v-model="tab.protocol" name="Protocol"
                           :options="protocolOptions" size="sm">
                         </b-form-select>
                       </b-form-group>
                       <b-form-group label="QoS set" description="recommand Guranteed QoS">
                         <b-form-select v-model="tab.qos"
                           :options="qosOptions" size="sm">
                         </b-form-select>
                       </b-form-group>
                       <div class="row">
                         <div class="col-md-6">
                           <b-form-group horizontal label="Resource request" description="Resources needed at least by the container, 1m CPU means 0.001 core, Memory 10Mi means 10M">
                             <b-form-input v-model="tab.reqCpu" placeholder="cpu"></b-form-input>
                             <b-form-input v-model="tab.reqMem" placeholder="memory" class="mt-2"></b-form-input>
                           </b-form-group>
                         </div>
                         <div class="col-md-6">
                           <b-form-group horizontal label="Resource limits" description="Resources needed at most by the container, 1m means 0.001 core, Memory 10Mi means 10M">
                             <b-form-input v-model="tab.limitCpu" placeholder="cpu"></b-form-input>
                             <b-form-input v-model="tab.limitMem" placeholder="memory" class="mt-2"></b-form-input>
                           </b-form-group>
                       </div>
                       </div>
                      <div>
                        <b-button variant="secondary" class="col-md-4 mr-2" @click="storeContainer(tab)">Store</b-button>
                        <b-button variant="light" @click="closeTab(i)" class="col-md-4">
                          Delete
                        </b-button>
                      </div>
                    </b-tab>

                    <!-- New Tab Button (Using tabs-end slot) -->



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


                <b-button variant="success" class="col-md-12 mt-3" @click="commitDeploy">Create</b-button>
                <b-button variant="danger" class="col-md-12 mt-2" @click="clearDeploy">
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
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import dedent from 'dedent'
import YamlView from '../code/YamlView.vue'
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'DeployView',
  data() {
    return {
      name: '',
      nsOptions: [],
      nsSelected: '',
      reschedulable: true,
      appLabel: '',
      replicas: 1,
      yaml: dedent`
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
  labels:
    pegasus.state/reschedulable: TODO
    pegasus.state/dispense: "pegasus"
    pegasus.name/app: TODO
  name: TODO
  namespace: TODO
spec:
  progressDeadlineSeconds: 600
  replicas: 2
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      pegasus.name/app: TODO
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      labels:
        pegasus.name/app: TODO
    spec:
      containers:
      - args:
        - TODO
        image: TODO
        imagePullPolicy: IfNotPresent
        name: TODO
        ports:
        - containerPort: TODO
          name: default-http
          protocol: TCP
        resources:
          limits:
            cpu: TODO: xxm
            memory: TODO: xxMi
          requests:
            cpu: TODO
            memory: TODO
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            add:
            - NET_BIND_SERVICE
            drop:
            - all
          readOnlyRootFilesystem: true
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        # volumeMounts:
        # - mountPath:
        #  name: config-volume
        #  readOnly: true
      dnsPolicy: Default
      nodeSelector:
        beta.kubernetes.io/os: linux
      priorityClassName: system-cluster-critical
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      # volumes:
      #
      `,
      tabs: [],
      tabsCnt: 0,
      protocolOptions: ['TCP', 'UDP'],
      qosOptions: ['Guaranteed', 'Burstable', 'BestEffort'],
      deployParam: {
        name: '',
        namespace: '',
        reschedulable: true,
        app_label: '',
        replicas: 1,
        containers: []
      }
    }
  },
  components: {
    YamlView,
    ValidationProvider,
  },
  computed: {
    currentId: function() {
      return this.$store.state.userInfo.uid
    }
  },
  beforeCreate() {
    if (this.$store.state.userInfo.role == null) {
      this.$router.push('/login')
      this.$toast.info('Login first, please')
    }
  },
  async mounted() {
    await this.getNs()
  },
  methods: {
    commitDeploy() {
      this.deployParam.name = this.name
      this.deployParam.namespace = this.nsSelected
      this.deployParam.reschedulable = this.reschedulable
      this.deployParam.app_label = this.appLabel
      this.deployParam.replicas = parseInt(this.replicas)

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
          axios.post( '/api/tasks/deploy', this.deployParam).then(res => {
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
    clearDeploy() {
      this.deployParam = {
        name: '',
        namespace: '',
        reschedulable: true,
        app_label: '',
        replicas: 1,
        containers: []
      }
      this.name = ''
      this.nsSelected = ''
      this.appLabel = ''
      this.tabs = []
    },
    // Containers tabs handlers
    closeTab(x) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].cnt === x) {
          this.tabs.splice(i, 1)
        }
      }
    },
    newTab() {
      this.tabs.push({
        cnt: this.tabsCnt++,
        conName: '',
        image: '',
        port: '',
        protocol: '',
        qos: '',
        reqCpu: '',
        reqMem: '',
        limitCpu: '',
        limitMem: ''
      })
    },
    storeContainer(tab) {
      let container = {
        name: tab.conName,
        image: tab.image,
        ports: [{
          name: 'default-http',
          containerPort: parseInt(tab.port),
          protocol: 'TCP'}],
        imagePullPolicy: 'IfNotPresent',
        resources: {limits: {cpu: tab.limitCpu, memory: tab.limitMem},
                    requests: {cpu: tab.reqCpu, memory: tab.reqMem}},
        terminationMessagePath: '/dev/termination-log',
        terminationMessagePolicy: 'File'}
      if (typeof(tab.args) != "undefined" && tab.args != null) {
        container.args = tab.args.split(';')
      }
      this.deployParam.containers.push(container)
      this.$toast.info('Add container ' + tab.conName + ' successfully')
    },
    // axios
    async getNs() {
      const { data } = await axios.get( '/api/ns/belong?id=' + this.currentId)
      this.nsOptions = data
    }
  },
}
</script>

<style scoped lang="scss">
 span {font-size: 13px;}
</style>
