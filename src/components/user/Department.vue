<template>
  <section class="tabs">
    <div class="row">
      <div class="col-8 grid-margin stretch-card mx-auto">
        <div class="card">
            <div class="card-body">
              <h3 class="card-title">Department management</h3>

              <b-tabs class="tab-solid tab-solid-success">
                <b-tab active>
                  <template v-slot:title>
                    <i class='mdi mdi-format-list-bulleted'>List</i>
                  </template>
                  <div class="col-xl">
                    <h4>Departments list</h4>
                    <b-table striped hover responsive :items="departments"></b-table>
                  </div>

                  <b-button class="social-btn btn-rounded float-right mt-5" variant="success" @click.prevent="getDepartList"><i class="mdi mdi-refresh"></i></b-button>
                </b-tab>

                <b-tab :disabled="disableCreate">
                  <template v-slot:title>
                    <i class='mdi mdi-database-plus'>Create</i>
                  </template>
                   <h4 class="card-description">
                     Create new departments
                   </h4>

              <ValidationProvider rules="required|minmax:2,50" name="Name" v-slot="{ errors }">
                <b-form-group>
                  <b-input-group>
                    <b-input-group-text slot="prepend" class="bg-info text-white">
                      <span>@</span>
                    </b-input-group-text>
                    <b-form-input placeholder="Name" v-model="name"></b-form-input>
                  </b-input-group>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider rules="email" name=AdminEmail v-slot="{ errors }">
                <b-form-group label="Admin email(Optional)">
                  <b-form-input v-model="adminEmail" placeholder="Email" name="AdminEmail"/>
                </b-form-group>
                <span class="text-danger">{{ errors[0] }}</span>
              </ValidationProvider>

              <b-form-group>
                <b-button type="submit" variant="success" class="mr-2" :disabled="isSending" @click="postDepart">Submit</b-button>
                <b-button variant="light" @click.prevent="onCancel">C
                  ancel</b-button>
              </b-form-group>
                </b-tab>
              </b-tabs>
            </div>
          </div>
      </div>
    </div>
    <Loading v-if="isSending" marginTop="-30%"></Loading>
  </section>
</template>

<script>
import Loading from '../partial/Loading.vue'
import { ValidationProvider } from 'vee-validate'
import axios from 'axios'

export default {
  name: 'Department',
  data() {
    return {
      name: '',
      adminEmail: '',
      timer: null,
      isSending: false,
      departments: [],
    }
  },
  beforeCreate() {
    if (this.$store.state.userInfo.role == null) {
      this.$router.push('/login')
      this.$toast.info('Login first, please')
    }
  },
  components: {
    Loading,
    ValidationProvider,
  },
  computed: {
    disableCreate: function() {
      return this.pageBelong != 'ClusterAdmin'
    },
    pageBelong: function() {
      return this.$store.state.userInfo.role
    },
  },
  async mounted() {
   await this.getDepartList()
  },
  methods: {
    postDepart() {
      let param = null
      if (this.adminEmail == '') {
        param = {
          name: this.name
        }
      } else {
        param = {name: this.name, email: this.adminEmail}
      }
      this.isSending = true
      axios.post( '/api/departs/create ', param ).then(() => {
        this.$toast.success("Create department " + this.name + " successfully")

        this.timer = setTimeout(() => {
          this.onCancel()
          this.isSending = false
        }, 1000)
      }).catch(err => {
        let res = err.response
        this.isSending = false
        console.log(err)
        if (res.status == 404) {
          this.$toast.error(res.data.msg)
        } else if (res.status == 401) {
          this.$toast.error('Permission not allowed')
        } else if (res.status == 409) {
          this.$toast.error('The department existed already!')
        } else {
          this.$router.push('/error')
        }
      })

    },
    onCancel() {
      this.name = ''
      this.adminEmail = ''
    },
    async getDepartList() {
      const { data } = await axios.get( '/api/departs/list' )
      this.departments = []
      data.forEach(item => {
        this.departments.push({id: item.id, name: item.name,
                               admin: item.admin, email: item.email})
      })
    },
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}

</script>

<style scoped lang="scss">

</style>
