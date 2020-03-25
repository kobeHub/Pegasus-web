<template>
<section class="tabs">
    <div class="row">
      <div class="col-6 grid-margin stretch-card mx-auto">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Department member</h4>
            <b-tabs class="tab-solid tab-solid-success">
              <b-tab title="<i class='mdi mdi-format-list-bulleted'></i>Memobers" active>
                <div class="col-xl">
                  <h4 v-text="'members'"></h4>
                  <b-table striped hover responsive :items="members"></b-table>
                </div>
                <b-button class="social-btn btn-rounded float-right mt-5" variant="success" @click.prevent="getAllInfos"><i class="mdi mdi-refresh"></i></b-button>
              </b-tab>
              <b-tab :disabled='this.disableInvit' title="<i class='mdi mdi-database-plus'></i>Invitation">
                <p class="card-description">
                  Please enter your member information
                </p>

                <ValidationProvider rules="required|email" name="Email" v-slot="{ errors }">
                  <b-form-group>
                    <b-input-group>
                      <b-input-group-text slot="prepend" class="bg-info text-white">
                        <span>@</span>
                      </b-input-group-text>
                      <b-form-input placeholder="Email" v-model="email"></b-form-input>
                    </b-input-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="departSelect" v-slot="{ errors }">
                  <b-form-group label="Department">
                    <b-form-select v-model="department_id" name="departSelect" :options="departs"/>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="roleSelect" v-slot="{ errors }">
                  <b-form-group label="Role" description="Specific the membor role">
                    <b-form-radio-group id="radios2" v-model="roles" name="roleSlect">
                      <b-form-radio value="DepartmentAdmin">DepartmentAdmin</b-form-radio>
                      <b-form-radio value="Lessee">Lessee</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <b-form-group>
                  <b-button type="submit" variant="success" class="mr-2" :disabled="isSending" @click="sendInvitation">Submit</b-button>
                  <b-button variant="light" @click.prevent="onCancel">Cancel</b-button>
                </b-form-group>

              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>

    </div>
    <Loading v-if="isSending" marginTop="-50%"></Loading>
  </section>
</template>

<script>
import Loading from '../partial/Loading.vue'
import { ValidationProvider } from 'vee-validate'
import axios from 'axios'

export default {
  name: "Invitaiton",
  data() {
    return {
      // Invitation selection list
      departs: [
        { value: '', text: 'Please select an department' },
      ],
      // users list
      members: [],
      // For invitation tables
      email: '',
      department_id: '',
      roles: 'Lessee',
      timer: null,
      isSending: false,
      // departs info cache
      departs_cache: null,
    }
  },
  components: {
    Loading,
    ValidationProvider,
  },
  computed: {
    disableInvit: function() {
      return this.pageBelong == 'Lessee'
    },
    pageBelong: function() {
      return this.$store.state.userInfo.role
    },
    depart_id: function() {
      return this.$store.state.userInfo.belong_to
    }
  },
  beforeCreate() {
    if (this.$store.state.userInfo.role == null) {
      this.$router.push('/login')
      this.$toast.info('Login first, please')
    }
  },
  async mounted() {
    console.log('Pages: ', this.pageBelong)
    await this.getAllInfos()
  },
  methods: {
    sendInvitation() {
      if (this.pageBelong == 'DepartmentAdmin' && this.roles == 'DepartmentAdmin') {
        this.$toast.error('You are not allowed to create department admin')
        this.roles = 'Lessee'
        return
      }

      let param = {
        'email': this.email,
        'department': this.department_id,
        'is_admin': this.roles != 'Lessee',
      }
      this.isSending = true

      axios.post( '/api/invitations/post', param).then(res => {
        if (res.data.status) {
          this.$toast.success(res.data.msg)
        } else {
          this.$toast.error(res.data.msg)
        }

        this.timer = setTimeout(() => {
          this.isSending = false
          this.email = ''
        }, 1000)
      }).catch(err => {
        let res = err.response
        this.isSending = false
        if (res.status == 401) {
          this.$toast.error('Permission not allowed')
        } else {
          this.$router.push('/error')
        }
      })
    },
    onCancel() {
      this.email = ''
      this.department_id = ''
      this.roles = ''
    },
    async getAllDeparts(current_role, depart_id) {
      const { data } = await axios.get( '/api/departs/get' )
      data.forEach(item => {
        this.$store.commit('addDepart', item)
      })
      // Set selections if is cluster admin
      if (current_role == 'ClusterAdmin') {
        data.forEach(item => {
          this.departs.push({value: item.id, text: item.name})
        })
      } else if (current_role == 'DepartmentAdmin') {
        this.departs.push({value: depart_id,
                           text: this.$store.state.departs_cache.get(depart_id)})
      }
    },
    async getDepartUserInfo(id) {
      const { data } = await axios.get( '/api/users/list/' + id )
      this.members = []
      data.forEach(item => {
        this.members.push({name: item.name, email: item.email,
                           role: item.role,
                           departmnet: this.$store.state.departs_cache.get(id)})
      })
    },
    async getAllUserInfo() {
      const { data } = await axios.get( '/api/users/all' )
      this.members = []
      data.forEach(item => {
        this.members.push({name: item.name, email: item.email,
                           role: item.role,
                           departmnet: this.$store.state.departs_cache.get(item.belong_to)})
      })
    },
    async getAllInfos() {
      await this.getAllDeparts(this.pageBelong, this.depart_id)

      if (this.pageBelong == 'ClusterAdmin') {
        await this.getAllUserInfo()
      } else {
        await this.getDepartUserInfo(this.depart_id)
      }
    }
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">
span {font-size: 13px;}
</style>
