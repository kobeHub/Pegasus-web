<template>
  <section class="ingress">
    <div class="col-x-6 col-sm-12 grid-margin stretch-card mx-auto">
      <b-card>
        <div class="card-body">
          <h4 class="card-title">Ingress management</h4>
          <b-tabs class="tab-solid tab-solid-success">
            <b-tab active>
              <template v-slot:title>
                <i class="mdi mdi-format-list-bulleted">All</i>
              </template>

              <b-table responsive hover striped fixed
                :fields="ingFields"
                :items="ings"
              >
                <template v-slot:cell(actions)="row">
                  <b-button class="btn-rounded" variant="danger" @click="onDeleteIng(row)">
                    <i class="mdi mdi-delete-forever">delete</i>
                  </b-button>
                </template>
              </b-table>
              <b-button class="social-btn btn-rounded float-right mt-5" variant="success" @click.prevent="getIngs"><i class="mdi mdi-refresh"></i></b-button>
            </b-tab>

            <b-tab>
              <template v-slot:title>
                <i class="mdi mdi-database-plus">Create</i>
              </template>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Name">
                  <b-form-input placeholder="Ingress name" v-model="name" type="text"></b-form-input>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Access domain URL">
                  <b-form-input placeholder="domain" v-model="host" type="text"></b-form-input>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Namespace">
                  <b-form-select v-model="ns" @input="ns_selected"
                    :options="all_ns" size="sm"></b-form-select>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Service">
                  <b-form-select v-model="svc_name" :options="current_svc" size="sm"></b-form-select>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider rules="required" v-slot="{ errors }">
                <b-form-group label="Service port">
                  <b-form-input v-model="svc_port" type="number" placeholder="9090"></b-form-input>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>

              <b-button variant="success" class="col-md-12 mt-3" @click="commitIngress">Create</b-button>
              <b-button variant="danger" class="col-md-12 mt-2" @click="clearIngress">
                Clear
              </b-button>
            </b-tab>
          </b-tabs>
        </div>
      </b-card>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import {ValidationProvider} from 'vee-validate'

export default {
  name: 'Ingress',
  data() {
    return {
      ingFields: [
        'name',
        'namespace',
        'host',
        {
          key: 'svc_name',
          label: 'Service'
        },
        {
          key: 'svc_port',
          label: 'Service Port'
        },
        'actions'
      ],
      svc_map: null,
      current_svc: [],
      all_ns: [],
      ings: [],
      name: '',
      ns: '',
      host: '',
      svc_name: '',
      svc_port: null
    }
  },
  components: {
    ValidationProvider,
  },
  computed: {
    currentId: function() {
      return this.$store.state.userInfo.uid
    },
  },
  async mounted() {
    await this.getIngs()
    await this.getSvcMap()
  },
  methods: {
    async getIngs() {
      const { data } = await axios.get( '/api/ing/all?uid=' + this.currentId)
      this.ings = data
    },
    async getSvcMap() {
      this.svc_map = new Map()
      this.all_ns = []
      const { data } = await axios.get( '/api/ing/svcmap?uid=' + this.currentId)
      for(var ns in data) {
        let svcs = []
        this.all_ns.push(ns)
        data[ns].forEach(item => {
          svcs.push(item.name)
        })
        this.svc_map.set(ns, svcs)
      }
    },
    commitIngress() {
      let param = {
        name: this.name,
        ns: this.ns,
        host: this.host,
        paths: [{
          svc_name: this.svc_name,
          svc_port: parseInt(this.svc_port)
        }]
      }
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
            axios.post( '/api/ing/create', param).then(res => {
              let data = res.data
              if (data.status) {
                this.$toast.info(data.msg)
                this.$router.push('/ingress')
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
    clearIngress() {
      this.name = ''
      this.host = ''
      this.ns = ''
      this.svc_name = ''
      this.svc_port = null
    },
    ns_selected(value) {
      this.current_svc = this.svc_map.get(value)
    },
    onDeleteIng(row) {
      this.$fire({
        title: 'Are you sure to delete ns?',
        text: 'Before delete the namespace, please make sure all resources within it be deleted first!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then(result => {
        if (result.value) {
          axios.delete( '/api/ing/item', {
            data: {
              namespace: row.item.namespace,
              name: row.item.name
            }
          }).then(res => {
            this.$toast.info(res.data.msg)
            this.$alert('Namespace deleted successfully', 'Deleted', 'success')
            this.ings.splice(row.index, 1)
          }).catch(err => {
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        } else {
          this.$alert('Ingress rule didn\'t deleted', 'Cancel', 'success')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
 span {font-size: 13px;}
</style>
