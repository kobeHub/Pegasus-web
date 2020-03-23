<template>
  <div class="register" id="register">
    <a href="/" class="log-close"><i class="icons close"></i></a>
    <div class="log-bg">
      <div class="log-cloud cloud1"></div>
      <div class="log-cloud cloud2"></div>
      <div class="log-cloud cloud3"></div>
      <div class="log-cloud cloud4"></div>

      <div class="log-logo">Sign up!</div>
      <div class="log-text">@Pegasus</div>
    </div>

    <form class="log-email">
      <div class="input-item">
        <input type="text" placeholder="Email" :class="'log-input' + (account==''?' log-input-empty':'')" v-model="account" readonly/>
      </div>

       <input type="text" placeholder="Department" :class="'log-input' + (department==''?' log-input-empty':'')" v-model="department" readonly/>

        <ValidationProvider rules="required|minmax:2,50" name="Name" v-slot="{ errors }">
          <input type="text" placeholder="Name" :class="'log-input' + (name==''?' log-input-empty':'')" v-model="name"/>
          <span class="span-text">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationObserver>
          <ValidationProvider rules="confirmed:confirmation|alpha_dash|minmax:10,16" name='Password' v-slot="{ errors }">
            <input type="password" placeholder="Password" :class="'log-input' + (password==''?' log-input-empty':'')" v-model="password"/>
            <span class="span-text">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider vid="confirmation" v-slot="{ errors }">
            <input type="password" placeholder="Re-enter" :class="'log-input' + (password==''?' log-input-empty':'')" v-model="confirmation" @keyup.enter="logon"/>
            <span class="span-text">{{ errors[0] }}</span>
          </ValidationProvider>
        </ValidationObserver>

      <a href="javascript:;" class="log-btn" @click="logon">Login</a>
    </form>
    <Loading v-if="isWorking" marginTop="-30%"></Loading>
  </div>
</template>

<script>
import Loading from '../partial/Loading.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      account: '',
      name: '',
      department: '',
      departments:'',
      belong_to: null,
      is_admin: null,
      password: '',
      confirmation: '',
      timer: null,
      isWorking: false
    }
  },
  props: ['uuid'],
  components: {
    Loading,
    ValidationProvider,
    ValidationObserver,
  },
  created() {
    axios.post( '/api/invitations/expire', {'id': this.uuid}).then(res => {
      //console.log(res.data.expire)
      if (res.data.expire) {
        alert('Invitaion token expired, ask admin for another one ')
        this.$router.push('/login')
      }
    })
    .catch(err => {
      console.log('Call API: invitations expire', err)
      alert(err)
      this.$router.push('/login')
    })
  },
  beforeMount() {
    this.$store.commit('logout')
    this.getDepartments().then( (departments) => {
      axios.post( '/api/invitations/get', {'id': this.uuid}).then(res => {
        this.account = res.data.email
        this.belong_to = res.data.department
        this.department = departments.get(this.belong_to)
        this.is_admin = res.data.is_admin
      })
      .catch(err => {
            alert('Sign up token error', err)
      })
    })

  },
  methods: {
    logon() {
      let param = {
        id: this.uuid,
        email: this.account,
        name: this.name,
        password: this.password,
        belong_to: this.belong_to,
        role: this.getRole(),
      }
      this.isWroking = true
      axios.post( '/api/users/register', param ).then(res => {
        console.log(res.data.msg)
        if(res.data.status) {
          alert('Sign up successfully!')
        } else {
          alert('Email address is occupied!')
        }

        this.timer = setTimeout(() => {
          this.isWorking = false
          this.$router.push('/login')
        }, 1000)
      })
      .catch(err => {
        let res = err.response
        console.log(res)
        if (res.status == 500) {
          this.$router.push('/error')
        } else {
          alert(res.data.msg)
        }
      })
    },
    getRole() {
      if (this.is_admin) {
        return 'DepartmentAdmin'
      } else {
        return 'Lessee'
      }
    },
    async getDepartments() {
      let departments = new Map()
      let res = await axios( '/api/departs/list')
      res.data.forEach(function(data) {
          departments.set(data.id, data.name)
      })
      return departments
    }
  },
  beforeDestory() {
    clearTimeout(this.timer)
  },
}
</script>

<style scoped>
 .register{position: fixed; overflow: hidden;left: 50%; margin-left: -250px; top:50%; margin-top: -350px; width: 500px; min-height: 555px; z-index: 10; right: 140px; background: #fff;-webkit-border-radius: 5px;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px; -webkit-box-shadow:  0px 3px 16px -5px #070707; box-shadow:  0px 3px 16px -5px #070707}
.log-close{display: block; position: absolute; top:12px; right: 12px; opacity: 1;}
.log-close:hover .icons{transform: rotate(180deg);}
.log-close .icons{opacity: 1; transition: all .3s}
.log-cloud{background-image: url(./../../assets/login-cloud.png); width: 63px ;height: 40px; position: absolute; z-index: 1}
.register .cloud1{top:21px; left: -30px; transform: scale(.6); animation: cloud1 20s linear infinite;}
.register .cloud2{top:87px; right: 20px; animation: cloud2 19s linear infinite;}
.register .cloud3{top:160px; left: 5px;transform: scale(.8);animation: cloud3 21s linear infinite;}
.register .cloud4{top:150px; left: -40px;transform: scale(.4);animation: cloud4 19s linear infinite;}
.log-bg{background: url(./../../assets/login-bg.jpg); width: 100%; height: 312px; overflow: hidden;}
.log-logo{height: 80px; margin: 120px auto 25px; text-align: center; color: #1fcab3; font-weight: bold; font-size: 40px;}
.log-text{color: #57d4c3; font-size: 13px; text-align: center; margin: 0 auto;}
.log-logo,.log-text{z-index: 2}
.icons{background:url(./../../assets/icons.png) no-repeat; display: inline-block;}
.close{height:16px;width:16px;background-position:-13px 0;}
.login-email{height:17px;width:29px;background-position:-117px 0;}
.log-btns{padding: 15px 0; margin: 0 auto;}
.log-btn{width:402px; display: block; text-align: left; line-height: 50px;margin:0 auto 15px; height:50px; color:#fff; font-size:13px;-webkit-border-radius: 5px; background-color: #3B5999;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px;
position: relative;}
.log-btn.tw{background-color: #13B4E9}
.log-btn.email{background-color: #50E3CE}
.log-btn:hover,.log-btn:focus{color: #fff; opacity: .8;}
.log-email{text-align: center; margin-top: 20px;}
.log-email .log-btn{background-color: #50E3CE;text-align: center;}
.log-email .span-text{font-weight: light; font-size: 13px; color: red;display: flex; margin-left: 65px;}
.log-input-empty{border: 1px solid #f37474 !important;}
.isloading{background: #d6d6d6}
.log-btn .icons{margin-left: 30px; vertical-align: middle;}
.log-btn .text{left: 95px; line-height: 50px; text-align: left; position: absolute;}
.log-input{width: 370px;overflow: hidden; padding: 0 15px;font-size: 13px; border: 1px solid #EBEBEB; margin:0 auto 15px; height: 48px; line-height: 48px; -webkit-border-radius: 5px;
-moz-border-radius: 5px;
-ms-border-radius: 5px;
-o-border-radius: 5px;
border-radius: 5px;}
.log-input.warn{border: 1px solid #f88787}
 @-webkit-keyframes cloud1 {
    0%{left: 200px}
    100%{left:-130px;}
}
@keyframes cloud1{
    0%{left: 200px}
    100%{left:-130px;}
}
 @-webkit-keyframes cloud2 {
    0%{left:500px;}
    100%{left:-90px;}
}
@keyframes cloud2{
    0%{left:500px;}
    100%{left:-90px;}
}
@-webkit-keyframes cloud3 {
    0%{left:620px;}
    100%{left:-70px;}
}
@keyframes cloud3{
    0%{left:620px;}
    100%{left:-70px;}
}@-webkit-keyframes cloud4 {
    0%{left:100px;}
    100%{left:-70px;}
}
@keyframes cloud4{
    0%{left:100px;}
    100%{left:-70px;}
}
</style>
