<template>
  <section class="taskview">
    <b-overlay :show="isLoading" rounded="sm">
    <div class="row">
      <div class="col-xl-6 col-sm-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Namespaces</h4>
            <b-row align-h="between">
              <b-col cols="8">
                <h6 class="card-description text-info">
                Select namespaces as work environment
              </h6>
              </b-col>
              <b-col cols="4">
                <b-button-group>
                  <b-button class="btn-fw btn-rounded mb-3" variant="secondary" @click="createNs">
                    <i class="mdi mdi-plus-circle-outline"></i></b-button>
                  <b-button class="btn-fw btn-rounded mb-3" variant="light"
                    @click.prevent="onRefresh"><i class="mdi mdi-refresh"></i></b-button>
                </b-button-group>
              </b-col>
            </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  ref="nsSelect"
                  selectable
                  select-mode="multi"
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
                  <template v-slot:cell(isActive)="{ value }">
                    <b-badge pill v-if="value" variant="success">Active</b-badge>
                    <b-badge pill v-if="!value" variant="danger">Invalid</b-badge>
                  </template>
                  <template v-slot:cell(actions)="row">
                      <b-button class="btn-rounded" variant="danger" @click="onDeleteNs(row)">
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
              <b-row align-h="between">
                <b-col cols="8"><h6 class="card-description text-info">
                  Select one deployment.
                </h6>
                </b-col>
                <b-col cols="4">
                  <b-button-group>
                    <b-button class="btn-fw btn-rounded mb-3" variant="secondary" @click="$router.push('/createdeploy')">
                      <i class="mdi mdi-plus-circle-outline"></i></b-button>
                    <b-button class="btn-fw btn-rounded mb-3" variant="light"
                      @click.prevent="onRefresh"><i class="mdi mdi-refresh"></i></b-button>
                  </b-button-group>
                </b-col>
              </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  ref="deploySelect"
                  selectable
                  select-mode="single"
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
                  <template v-slot:cell(isActive)="{ value }">
                    <b-badge pill v-if="value" variant="success">Active</b-badge>
                    <b-badge pill v-if="!value" variant="danger">Invalid</b-badge>
                  </template>
                  <template v-slot:cell(actions)="row">
                    <b-button-group>
                      <b-button class="btn-rounded" variant="danger" @click="onDeleteDeploy(row)">
                        <i class="mdi mdi-delete-forever">delete</i>
                      </b-button>
                      <b-button class="btn-rounded" variant="light"
                        @click="$router.push(`/editdeploy/${row.item.namespace}/${row.item.name}`)">
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
                    <b-button class="btn-fw btn-rounded mb-3" variant="secondary" @click="$router.push('/createsvc')">
                      <i class="mdi mdi-plus-circle-outline"></i></b-button>
                    <b-button class="btn-fw btn-rounded mb-3" variant="light"
                      @click.prevent="onRefresh"><i class="mdi mdi-refresh"></i></b-button>
                  </b-button-group>
                </b-col>
              </b-row>

              <div class="d-flex justify-content-between flex-wrap">
                <b-table responsive hover striped fixed
                  :fields="svcFields" :items="svcItems">
                  <template v-slot:cell(isActive)="{ value }">
                    <b-badge pill v-if="value" variant="success">Active</b-badge>
                    <b-badge pill v-if="!value" variant="danger">Invalid</b-badge>
                  </template>
                  <template v-slot:cell(actions)="row">
                    <b-button-group>
                      <b-button class="btn-rounded" variant="danger" @click="onDeleteSvc(row)">
                        <i class="mdi mdi-delete-forever">delete</i>
                      </b-button>
                      <b-button class="btn-rounded" variant="light"
                        @click="$router.push(`/editsvc/${row.item.namespace}/${row.item.name}`)">
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
                <template v-slot:cell(isActive)="{ value }">
                  <b-badge pill v-if="value" variant="success">Active</b-badge>
                  <b-badge pill v-if="!value" variant="danger">Invalid</b-badge>
                </template>
                <template v-slot:cell(actions)="row">
                    <b-button class="btn-rounded" variant="danger" @click="onDeletePod(row)">
                      <i class="mdi mdi-delete-forever">delete</i>
                    </b-button>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </b-overlay>
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
      'isLoading': false,
      'timer': null
    }
  },
  beforeCreate() {
    if (this.$store.state.userInfo.role == null) {
      this.$router.push('/login')
      this.$toast.info('Login first, please')
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
          this.deployItems.push({name: item.name, isActive: item.state, namespace: ns})
        })
      })
    },
    setService(nss) {
      this.svcItems = []
      //TODO
      nss.forEach(ns => {
        this.allsvc[ns].forEach(item => {
          this.svcItems.push({name: item.name, namespace: ns, isActive: item.state})
        })
      })
    },
    setPod(deploy_info) {
      this.podItems = []
      for (var ns in deploy_info) {
        deploy_info[ns].forEach(deploy => {
          this.allpod[ns][deploy.name].forEach(item => {
            this.podItems.push({name: item.name, deployment: deploy.name,
                                namespace: ns, isActive: item.state})
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
      this.$toast.info('Use namespace ' + this.nsSelected.toString() + ' as work enviroment')

      this.setDeploy(this.nsSelected)
      this.setService(this.nsSelected)
    },
    onDeploySelected(items) {
      if (items.length == 0) {
        this.setPod(this.alldeploy)
        return
      }
      let item = items[0]
      this.podItems = []
      this.allpod[item.namespace][item.name].forEach(pod => {
        this.podItems.push({name: pod.name, deployment: item.name, namespace: item.namespace, isActive: pod.state})
      })
    },
    onRefresh() {
      this.$refs.nsSelect.clearSelected()
      this.$refs.deploySelect.clearSelected()
      this.isLoading = true
      this.getTaskInfos().then(() => {
        this.timer = setTimeout(() => {
          this.isLoading = false
        }, 500)
      })
    },
    // TODO: click
    onDeleteNs(row) {
      this.$fire({
        title: 'Are you sure to delete ns?',
        text: 'Before delete the namespace, please make sure all resources within it be deleted first!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          axios.delete( '/api/ns/delete', {
            data: {
              uid: this.currentId,
              namespace: row.item.name,
            }
          }).then(res => {
            this.$toast.info(res.data.msg)
            this.$alert('Namespace deleted successfully', 'Deleted', 'success')
            this.nsItems.splice(row.index, 1)
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        } else {
          this.$alert('Namespace didn\'t deleted', 'Cancel', 'success')
        }
      })
    },
    onDeleteDeploy(row) {
      this.$fire({
        title: 'Are you sure to delete deploy?',
        text: 'All the pods within the deploy will be deleted permanent!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          axios.delete( '/api/tasks/deploy', {
            data: {
              name: row.item.name,
              namespace: row.item.namespace,
            }
          }).then(res => {
            this.$toast.info(res.data.msg)
            this.$alert('Deployment deleted successfully', 'Deleted', 'success')
            this.deployItems.splice(row.index, 1)
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        } else {
          this.$alert('Deployment didn\'t delete', 'Cancel', 'success')
        }
      })
    },
    onDeleteSvc(row) {
      this.$fire({
        title: 'Are you sure to delete service?',
        text: 'Delete service cannot be accessed!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          axios.delete( '/api/tasks/svc', {
            data: {
              name: row.item.name,
              namespace: row.item.namespace,
            }
          }).then(res => {
            this.$toast.info(res.data.msg)
            this.$alert('Service deleted successfully', 'Deleted', 'success')
            this.svcItems.splice(row.index, 1)
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        } else {
          this.$alert('Service didn\'t delete', 'Cancel', 'success')
        }
      })
    },
    onDeletePod(row) {
      this.$fire({
        title: 'Are you sure to delete pod?',
        text: 'A new pod will be created, but be caution about statefulset, the state will be lose!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          axios.delete( '/api/tasks/pod', { data: {
            name: row.item.name,
            namespace: row.item.namespace
          }}).then(res => {
            this.$toast.info(res.data.msg)
            this.$alert('Pod deleted successfully', 'Deleted', 'success')
            this.podItems.splice(row.index, 1)
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        } else {
          this.$alert('Pod didn\'t delete', 'Cancel', 'success')
        }
      })
    },
    // create ns
    createNs() {
      this.$prompt(
        'Enter your namespace name',
        'example-ns',
        'Namespace',
        'question',
        { input: 'text' }
      ).then(r => {
        axios.post( '/api/ns/create', {uid: this.currentId, ns: r} ).then(() => {
          this.$alert(r, 'Create namespace successfully', 'success')
        }).catch(err => {
          let res = err.response
          if (res.status == 500) {
            this.$router.push('/error')
          } else {
            this.$toast.error(res.data.msg)
          }
        })
      }).catch(() => console.log('cancel'))
    }
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">

</style>
