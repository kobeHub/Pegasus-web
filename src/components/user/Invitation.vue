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
                <b-button class="social-btn btn-rounded float-right mt-5" variant="success" @click.prevent="getDepartList"><i class="mdi mdi-refresh"></i></b-button>
              </b-tab>
              <b-tab title="<i class='mdi mdi-database-plus'></i>Invitation">
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
    <Loading v-if="isSending" marginTop="-30%"></Loading>
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
      departs: [
        { value: '', text: 'Please select an department' },
      ],
      email: '',
      department_id: '',
      roles: 'Lessee',
      timer: null,
      isSending: false,
    }
  },
  props: [
    'depart_id',
  ],
  components: {
    Loading,
    ValidationProvider,
  },
  async mounted() {
    const { data } = await axios.get( '/api/departs/list' )
    data.forEach(item => {
      this.departs.push({value: item.id, text: item.name})
    })
  },
  methods: {
    sendInvitation() {
      let param = {
        'email': this.email,
        'department': this.department_id,
        'is_admin': this.roles == 'Lessee',
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
