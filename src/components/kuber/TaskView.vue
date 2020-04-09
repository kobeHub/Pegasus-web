<template>
  <section class="taskview">
    <div class="row">
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
              <h4 class="card-title mb-4">Namespaces</h4>
              <h6 class="card-description text-info">
                Select namespaces as work environment
              </h6>

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
                    <b-button variant="danger">
                      <i class="mdi mdi-delete-forever">delete</i>
                    </b-button>
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
              <h6 class="card-description text-info">Select one deployment.</h6>

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
                    <b-button variant="danger">
                      <i class="mdi mdi-delete">delete</i>
                    </b-button>
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
              <h6 class="card-description text-info">Services under selected work enviroment</h6>
              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  :fields="svcFields" :items="svcItems">
                  <template v-slot:cell(isActive)>
                    <b-badge pill variant="success">Active</b-badge>
                  </template>
                  <template v-slot:cell(actions)>
                    <b-button variant="danger">
                      <i class="mdi mdi-delete">delete</i>
                    </b-button>
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
                  <b-button variant="danger">
                    <i class="mdi mdi-delete">remove</i>
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
      this.nsItems = []
      // TODO: isActive to be updated
      infos.namespace.forEach(item => {
        this.nsItems.push({name: item, isActive: true})
      })

      this.deployItems = []
      //TODO:
      for (var ns1 in infos.deploy) {
        infos.deploy[ns1].forEach(item => {
          this.deployItems.push({name: item, isActive: true, namespace: ns1})
        })
      }

      // TODO:
      this.svcItems = []
      for (var ns2 in infos.service) {
        infos.service[ns2].forEach(item => {
          this.svcItems.push({name: item, namespace: ns2, isActive: true})
        })
      }

      // TODO:
      this.podItems = []
      for (var ns3 in infos.pod) {
        for (var deploy in infos.pod[ns3]) {
          infos.pod[ns3][deploy].forEach(item => {
            this.podItems.push({name: item, deployment: deploy, namespace: ns3, isActive: true})
          })
        }
      }
    },
    onNsSelected(items) {
      if (items.length == 0) {
        this.$toast.info("Display all namespaces infomations")
        return
      }
      this.nsSelected = items
      let names = ''
      items.forEach(i => names += ' ' + i.name)
      this.$toast.info('Use namespace ' + names + ' as work enviroment')
    }
  },
}
</script>

<style scoped lang="scss">

</style>
