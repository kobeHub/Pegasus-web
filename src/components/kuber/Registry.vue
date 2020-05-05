<template>
  <section class="registry">
    <div class="row">
      <div class="col-xl-12 col-sm-12 col-md-12 grid-margin stetch-card">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Image Registry</h4>
            <b-tabs class="tab-solid tab-solid-success">
              <b-tab active>
                <template v-slot:title>
                  <i class="mdi mdi-folder-image">Public image</i>
                </template>
                <b-container>
                  <b-row v-for="(row, i) in publicImageRows" :key="'dyn-row-' + i">
                    <b-col
                      v-for="(item, j) in row"
                      :key="'dyn-col-' + (i*3+j)">
                      <b-card
                        class="m-2"
                        bg-variant="light"
                        border-variant="succcess"
                        img-alt="Docker image">
                        <router-link
                          :to="'/images/' + item+ '?base=registry.cn-hangzhou.aliyuncs.com/pegasus-registry/' + item">
                        <b-row>
                          <b-img
                            :src="publicImageBg(i*3 + j)"
                            width=130></b-img>
                          <b-card-text>
                            <h5>{{item}}</h5>
                          </b-card-text>
                        </b-row>
                        </router-link>

                        <template v-slot:footer>
                          <small class="text-muted">Last updated 3 mins ago</small>
                        </template>
                      </b-card>
                    </b-col>
                  </b-row>
                </b-container>

              </b-tab>

              <b-tab>
                <template v-slot:title>
                  <i class="mdi mdi-folder-lock">Private image</i>
                </template>
                <b-table responsive hover striped fixed
                  :fields="imageFields"
                  :items="privateImages"
                  @row-clicked="privateDetail"
                ></b-table>
                <b-button class="social-btn btn-rounded float-right mt-5" variant="success" @click.prevent="getPrivateImages"><i class="mdi mdi-refresh"></i></b-button>
              </b-tab>

              <b-tab>
                <template v-slot:title>
                  <i class="mdi mdi-folder-plus">New image</i>
                </template>
                <h5 class="text-info">Create image repository</h5>
                <ValidationProvider :rules="{ regex: /[a-z]+(?:[._-][a-z]*[0-9]*)*/}" name="name" v-slot="{ errors }">
                  <b-form-group label="Name">
                    <b-form-input placeholder="repository name" name="repoName"
                      type="text" v-model="repoName"></b-form-input>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="summary" v-slot="{ errors }">
                  <b-form-group label="Summary">
                    <b-form-input placeholder="repository summary" name="repoName"
                      type="text" v-model="repoSummary"></b-form-input>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="isOverSea"
                  v-slot="{ errors }">
                  <b-form-group label="Over Sea" description="Use Oversea machine to build or not">
                    <b-form-radio-group id="overseaRadio" v-model="isOversea"
                      name="isovsersea">
                      <b-form-radio value="true">True</b-form-radio>
                      <b-form-radio value="false">False</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="disableCache"
                  v-slot="{ errors }">
                  <b-form-group label="Disable Cache" description="Disable cache during image build">
                    <b-form-radio-group id="disablecacheRadio" v-model="disableCache"
                      name="disableCache">
                      <b-form-radio value="true">True</b-form-radio>
                      <b-form-radio value="false">False</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider rules="required" name="isPublic"
                  v-slot="{ errors }" v-if="showPublicLabel">
                  <b-form-group label="Public image" description="Cluster admin can add public image repository">
                    <b-form-radio-group id="ispublicRadio" v-model="isPublic"
                      name="isPublic">
                      <b-form-radio value="true">True</b-form-radio>
                      <b-form-radio value="false">False</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <b-button variant="success" class="col-md-5 mt-3 mr-2" @click="commitRepo">Create</b-button>
                <b-button variant="danger" class="col-md-5 mt-3 ml-2" @click="clearRepo">
                  Clear
                </b-button>

                <br><br><br><br>
                <h5 class="text-info">Create image tag</h5>
                <ValidationProvider rules="required" name="tagRepo" v-slot="{ errors }">
                  <b-form-group label="Repo name">
                    <b-form-input placeholder="repo name" name="tagName"
                      type="text" v-model="tagRepo"></b-form-input>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider rules="required" name="tagName" v-slot="{ errors }">
                  <b-form-group label="Tag name">
                    <b-form-input placeholder="tag name" name="tagName"
                      type="text" v-model="tagName"></b-form-input>
                  </b-form-group>
                  <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
                <p class="card-description text-info">
                  Please copy your dockerfile here or edit it.
                </p>

                <AceEditor
                  :fontSize="14"
                  :showPrintMargin="true"
                  :showGutter="true"
                  width="width"
                  :maxLines=40
                  :highlightActiveLine="true"
                  mode="dockerfile"
                  :value="initContent"
                  theme="monokai"
                  name="editor"
                  :onChange="onChange"
                  :editorProps="{$blockScrolling: true}"/>

                <b-button variant="success" class="col-md-5 mt-3 mr-2" @click="commitRule">Create</b-button>
                <b-button variant="danger" class="col-md-5 mt-3 ml-1" @click="clearRule">
                  Clear
                </b-button>
                <b-overlay :show="isLoading" no-wrap></b-overlay>
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
import { Ace as AceEditor} from 'vue2-brace-editor'

import 'brace/mode/dockerfile'
import 'brace/theme/monokai'

export default {
  name: 'Registry',
  data() {
    return {
      publicImages: [],
      imageFields: [
        {
          key: 'id',
          sortable: true
        },
        {
          key: 'name',
          sortable: true
        },
        'status',
        'downloads',
        {
          key: 'url',
          label: 'Docker Pull'
        }
      ],
      privateImages: [],
      repoName: '',
      repoSummary: '',
      isOversea: 'true',
      disableCache: 'false',
      isPublic: 'false',
      tagRepo: '',
      tagName: '',
      isLoading: false,
      timer: null,
      dockerfile: '',
      initContent: dedent`# FROM <image>[:<tag>|@<digest]
FROM scratch
# The MAINTAINER instruction allows you to set the Author field of the
# generated images.
#
# MAINTAINER <name>
MAINTAINER FirstName LastName <first.last@company.com>
# VOLUME <mount_point> ...
# VOLUME [ "<mount_point>", ... ]
VOLUME /srv/data
# ENV <key> <value>
# ENV <key>=<value> ...
ENV ENV_VAR "value"
# EXPOSE <port> [<port>...]
EXPOSE 80
# SHELL ["executable", "parameters"]
SHELL ["/bin/sh", "-c"]
# ADD <src>... <dest>
# ADD ["<src>"... "<dest>"] (this form is required for paths containing
#                            whitespace)
ADD src/file.cpp /usr/include/mylib/file.cpp
# WORKDIR <path>
WORKDIR /path/to/workdir
# CMD command param1 param2 (shell form)
CMD /usr/bin/default_cmd`,
      bgs: [
        'https://d1q6f0aelx0por.cloudfront.net/product-logos/library-golang-logo.png',
        'https://d1q6f0aelx0por.cloudfront.net/product-logos/library-python-logo.png',
        'https://d1q6f0aelx0por.cloudfront.net/product-logos/library-rust-logo.png',
        'https://d1q6f0aelx0por.cloudfront.net/product-logos/library-openjdk-logo.png',
        'https://d1q6f0aelx0por.cloudfront.net/product-logos/library-ubuntu-logo.png',
        'https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png'
      ]
    }
  },
  components: {
    AceEditor,
    YamlView,
    ValidationProvider,
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
    },
    showPublicLabel() {
      return this.$store.state.userInfo.role == 'ClusterAdmin'
    },
    publicImageRows() {
      var rows = []
      var itemPerRow = 3
      var arr = this.publicImages
      for (var i = 0; i < arr.length / itemPerRow; i ++) {
        var row = []
        let ii = i * itemPerRow
        for (var z = 0; (z < itemPerRow) && (ii + z < arr.length); z++) {
          row.push(arr[ii + z])
        }
        rows.push(row)
      }
      return rows
    },
  },
  async mounted() {
    await this.getPublicImages()
    await this.getPrivateImages()
  },
  methods: {
    commitRepo() {
      let param = {}
      if (this.isPublic === 'true') {
        param = {
          name: this.repoName,
          summary: this.repoSummary,
          isOverSea: this.isOversea === 'true',
          disableCache: this.disableCache === 'true',
          isPublic: true
        }
      } else {
        param = {
          name: this.repoName,
          summary: this.repoSummary,
          isOverSea: this.isOversea === 'true',
          disableCache: this.disableCache === 'true',
          isPublic: false,
          belong_to: this.currentId,
        }
      }

      this.$fire({
        title: 'Have you checked out the form?',
        text: 'Create a repository may take a long time, you can do other things!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.value) {
          this.isLoading = true
          await axios.post( '/api/repos/create', param ).then(res => {
            let data = res.data
            this.isLoading = false
            this.$toast.info(data.msg)
          }).catch(err => {
            this.isLoading = false
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
              this.$toast.error(res.data.msg)
            } else {
              this.$toast.error(res.data.msg)
            }
          })
        }
      })
      this.tagRepo = this.repoName
    },
    clearRepo() {
      this.repoName = ''
      this.repoSummary = ''
    },
    commitRule() {
      let param = {
        repoName: this.tagRepo,
        tag: this.tagName,
        dockerfile: this.dockerfile,
      }
      this.$fire({
        title: 'Have you checked out the form?',
        text: 'Create a image may take a long time!!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.value) {
          this.isLoading = true
          await axios.post( '/api/repos/rule', param ).then(res => {
            let data = res.data
              this.isLoading = false
              this.$toast.info(data.msg)
              this.$router.push('/registry')
          }).catch(err => {
            this.isLoading = false
            let res = err.response
            if (res.status == 500) {
              this.$router.push('/error')
              this.$toast.error(res.data.msg)
            } else {
              this.$toast.error(res.data.msg)
            }
          })
          this.isLoading = false
        }
      })
    },
    clearRule() {},
    async getPublicImages() {
      const { data } = await axios.get( '/api/repos/public' )
      this.publicImages = data.data
    },
    onChange(value) {
      this.dockerfile = value
    },
    publicImageBg(index) {
      if (index < 5) {
        return this.bgs[index]
      } else {
        return this.bgs[5]
      }
    },
    async getPrivateImages() {
      const { data } = await axios.get( '/api/repos/private?uid=' + this.currentId )
      this.privateImages = data
    },
    privateDetail(record) {
      this.$router.push('/images/' + record.name + '?base=' + record.url)
    }
  },
  beforeDestory: function() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">

</style>
