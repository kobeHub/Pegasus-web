<template>
  <div class="yamlview">
  <AceEditor
    :fontSize="14"
    :showPrintMargin="true"
    :showGutter="true"
    width="width"
    :maxLines=40
    :highlightActiveLine="true"
    mode="yaml"
    :value="code"
    theme="monokai"
    name="editor"
    :editorProps="{$blockScrolling: true}"/>
  </div>
</template>

<script>
import { Ace as AceEditor} from 'vue2-brace-editor'

import 'brace/mode/yaml'
import 'brace/theme/monokai'

export default {
  name: 'YamlView',
  components: {
    AceEditor,
  },
  props: ['width', 'code'],
  methods: {

  }
}
</script>
