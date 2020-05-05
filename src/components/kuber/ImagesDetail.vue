<template>
  <section class="imagesdetails">
    <b-card :title="title">
      <h5 class="text-info">Click tag to copy docker image url</h5><br>
      <b-badge
        class="m-2"
        href="#" v-for="(tag, i) in tags"
        :key="'dyn-badge-' + i"
        pill
        v-clipboard:copy="imageUrl(tag)"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        :variant="randomColor(i)">
        {{ tag }}
      </b-badge>

      <b-row>
        <b-col align-self="center">
          <router-link to="/registry">
            <b-img center width=50 :src="require('../../assets/images/back.png')"></b-img>
          </router-link>
        </b-col>
      </b-row>

    </b-card>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ImageDetail',
  data() {
    return {
      tags: [],
      styles: [
        'primary',
        'info',
        'success',
        'secondary',
        'dark',
        'warning'
      ],
    }
  },
  computed: {
    title() {
      return this.repo + ' tags'
    },
    base() {
      return this.$route.query.base
    }
  },
  props: ['repo'],
  async mounted() {
    await this.getTags()
  },
  methods: {
    async getTags() {
      this.tags = []
      const {data} = await axios.get( '/api/repos/tags?name=' + this.repo + '&page=1')
      let total = data.data.total
      let pageSize = data.data.pageSize
      data.data.tags.forEach((tag) => {
        this.tags.push(tag.tag)
      })
      if (total > pageSize) {
        for (let i = 2; i * pageSize <= total; i++) {
          const {data} = await axios.get( '/api/repos/tags?name=' + this.repo + '&page=1')
          data.data.tags.forEach((tag) => {
            this.tags.push(tag.tag)
          })
        }
      }
    },
    randomColor(i) {
      return this.styles[i % 6]
    },
    onCopy: function(e) {
      this.$toast.info('You\'ve copied: ' + e.text)
    },
    onError: function() {
      this.$toast.error('Failed to copy image url')
    },
    imageUrl(tag) {
      return this.base + ':' + tag
    }
  },
}
</script>

<style scoped lang="scss">

</style>
