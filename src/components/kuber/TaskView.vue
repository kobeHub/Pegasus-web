<template>
  <section class="taskview">
    <div class="row">
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Namespaces</h4>
            <b-row align-h="between">
              <b-col cols="8"><h6 class="card-description text-info">
                Select namespaces as work environment
              </h6>
              </b-col>
              <b-col cols="4">
                <b-button-group>
                  <b-button class="btn-fw btn-rounded mb-3" variant="secondary"><i class="mdi mdi-plus-circle-outline"></i></b-button>
                  <b-button class="btn-fw btn-rounded mb-3" variant="light"><i class="mdi mdi-refresh"></i></b-button>
                </b-button-group>
              </b-col>
            </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  selectable
                  :selectMode="multi"
                  :fields="nsFields"
                  :items="nsItems"
                  @row-selected="onNsSelected">
                  <template v-slot:cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                      <span aria-hidden="true">&check;</span>
                      <span class="sr-only">Selected</span>
                    </template>
                    <template v-else>
                      <span aria-hidden="true">&nbsp;</span>
                      <span class="sr-only">Not selected</span>
                    </template>
                  </template>
                  <template v-slot:cell(isActive)>
                    <b-badge pill variant="success">Active</b-badge>
                  </template>
                  <template v-slot:cell(actions)>
                    <b-button-group>
                      <b-button class="btn-rounded" variant="danger">
                        <i class="mdi mdi-delete-forever">delete</i>
                      </b-button>
                      <b-button class="btn-rounded" variant="light">
                        <i class="mdi mdi-pencil">edit</i>
                      </b-button>
                    </b-button-group>
                  </template>
                </b-table>
              </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Deployments</h4>
              <b-row align-h="between">
                <b-col cols="8"><h6 class="card-description text-info">
                  Select one deployment.
                </h6>
                </b-col>
                <b-col cols="4">
                  <b-button-group>
                    <b-button class="btn-fw btn-rounded mb-3" variant="secondary"><i class="mdi mdi-plus-circle-outline"></i></b-button>
                    <b-button class="btn-fw btn-rounded mb-3" variant="light"><i class="mdi mdi-refresh"></i></b-button>
                  </b-button-group>
                </b-col>
              </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  selectable
                  :selectMode="single"
                  :fields="deployFields"
                  :items="deployItems"
                  @row-selected="onDeploySelected">
                  <template v-slot:cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                      <span aria-hidden="true">&check;</span>
                      <span class="sr-only">Selected</span>
                    </template>
                    <template v-else>
                      <span aria-hidden="true">&nbsp;</span>
                      <span class="sr-only">Not selected</span>
                    </template>
                  </template>
                  <template v-slot:cell(isActive)>
                    <b-badge pill variant="success">Active</b-badge>
                  </template>
                  <template v-slot:cell(actions)>
                    <b-button-group>
                      <b-button class="btn-rounded" variant="danger">
                        <i class="mdi mdi-delete-forever">delete</i>
                      </b-button>
                      <b-button class="btn-rounded" variant="light">
                        <i class="mdi mdi-pencil">edit</i>
                      </b-button>
                    </b-button-group>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Services</h4>
              <h6 class="card-description text-info"></h6>
              <b-row align-h="between">
                <b-col cols="8"><h6 class="card-description text-info">
                  Services under selected work enviroment
                </h6>
                </b-col>
                <b-col cols="4">
                  <b-button-group>
                    <b-button class="btn-fw btn-rounded mb-3" variant="secondary"><i class="mdi mdi-plus-circle-outline"></i></b-button>
                    <b-button class="btn-fw btn-rounded mb-3" variant="light"><i class="mdi mdi-refresh"></i></b-button>
                  </b-button-group>
                </b-col>
              </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  :fields="svcFields" :items="svcItems">
                  <template v-slot:cell(isActive)>
                    <b-badge pill variant="success">Active</b-badge>
                  </template>
                  <template v-slot:cell(actions)>
                    <b-button-group>
                      <b-button class="btn-rounded" variant="danger">
                        <i class="mdi mdi-delete-forever">delete</i>
                      </b-button>
                      <b-button class="btn-rounded" variant="light">
                        <i class="mdi mdi-pencil">edit</i>
                      </b-button>
                    </b-button-group>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
      </div>
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Pods</h4>
            <h6 class="card-description text-info">Pods infomations</h6>
            <div class="d-flex justify-content-between flex-wrap">
              <b-table responsive hover striped fixed
                :fields="podFields" :items="podItems">
                <template v-slot:cell(isActive)>
                  <b-badge pill variant="success">Active</b-badge>
                </template>
                <template v-slot:cell(actions)>
                    <b-button class="btn-rounded" variant="danger">
                      <i class="mdi mdi-delete-forever">delete</i>
                    </b-button>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TaskView',
  data() {
    return {
      'nsFields': [
        {
          key: 'selected',
          label: ''
        },
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'isActive',
          label: 'Status'
        },
        'actions'
      ],
      'nsItems': [],
      'allns': [],
      'nsSelected': [],
      'deployFields': [
        {
          key: 'selected',
          label: ''
        },
        {
          key: 'name',
          sortable: true,
        },
        'namespace',
        {
          key: 'isActive',
          label: 'Status',
        },
        'actions'
      ],
      'alldeploy': null,
      'deployItems': [],
      'deploySelected': [],
      'svcFields': [
        {
          key: 'name',
          sortable: true
        },
        'namespace',
        {
          key: 'isActive',
          label: 'Status'
        },
        'actions'
      ],
      'allsvc': null,
      'svcItems': [],
      'podFields': [
        {
          key: 'name',
          sortable: true,
        },
        'deployment',
        'namespace',
        {
          key: 'isActive',
          label: 'Status'
        },
        'actions'
      ],
      'allpod': null,
      'podItems': [],
    }
  },
  computed: {
    currentId: function() {
      return this.$store.state.userInfo.uid
    }
  },
  async mounted() {
    await this.getTaskInfos()
  },
  methods: {
    async getTaskInfos() {
      const { data } = await axios.get( '/api/tasks/infos?id=' + this.currentId )
      let infos = data.data
      this.allns = infos.namespace
      this.alldeploy = infos.deploy
      this.allsvc = infos.service
      this.allpod = infos.pod
      this.nsItems = []
      // TODO: isActive to be updated
      infos.namespace.forEach(item => {
        this.nsItems.push({name: item, isActive: true})
      })

      this.setDeploy(infos.namespace)
      this.setService(infos.namespace)
      this.setPod(this.alldeploy)
    },
    // All the table set functions
    setDeploy(nss) {
      this.deployItems = []
      //TODO:
      nss.forEach(ns => {
        this.alldeploy[ns].forEach(item => {
          this.deployItems.push({name: item, isActive: true, namespace: ns})
        })
      })
    },
    setService(nss) {
      this.svcItems = []
      //TODO
      nss.forEach(ns => {
        this.allsvc[ns].forEach(item => {
          this.svcItems.push({name: item, namespace: ns, isActive: true})
        })
      })
    },
    setPod(deploy_info) {
      this.podItems = []
      for (var ns in deploy_info) {
        deploy_info[ns].forEach(deploy => {
          this.allpod[ns][deploy].forEach(item => {
            this.podItems.push({name: item, deployment: deploy, namespace: ns, isActive: true})
          })
        })
      }
    },
    // table click events
    onNsSelected(items) {
      this.nsSelected = []
      if (items.length == 0) {
        this.$toast.info("Display all namespaces infomations")
        this.setDeploy(this.allns)
        this.setService(this.allns)
        return
      }
      items.forEach(item => {
        this.nsSelected.push(item.name)
      })
      console.log(this.nsSelected.toString())
      this.$toast.info('Use namespace ' + this.nsSelected.toString() + ' as work enviroment')

      this.setDeploy(this.nsSelected)
      this.setService(this.nsSelected)
    }
  },
}
</script>

<style scoped lang="scss">

</style>
