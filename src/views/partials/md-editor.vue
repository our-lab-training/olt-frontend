<template>
  <editor
    :value="value"
    @input="$emit('input', $event)"
    :options="opts"
    previewStyle="tab"
    mode="wysiwyg"
    height="100%"
  />
</template>
<script>
/* eslint-disable import/no-extraneous-dependencies */
import 'tui-editor/dist/tui-editor.css';
// import 'tui-chart/dist/tui-chart.min.css';
import 'tui-color-picker/dist/tui-color-picker.min.css';
// import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import { Editor } from '@toast-ui/vue-editor';
import 'tui-color-picker';
// import 'raphael';
// import 'tui-chart';
import 'tui-editor/dist/tui-editor-extScrollSync';
import 'tui-editor/dist/tui-editor-extTable';
import 'tui-editor/dist/tui-editor-extUML';
import 'tui-editor/dist/tui-editor-extColorSyntax';
// import 'tui-editor/dist/tui-editor-extChart';

/* const chart = {
  name: 'chart',
  minWidth: 100,
  maxWidth: 600,
  minHeight: 100,
  maxHeight: 300,
}; */

export default {
  components: {
    editor: Editor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      opts: {
        usageStatistics: false,
        // previewStyle: 'vertical',
        exts: ['scrollSync', 'colorSyntax', 'uml', /* chart, */ 'table'],
      },
    };
  },
};
</script>

<style scoped>
.v-card__text {
  padding: 0!important;
  height: calc(100vh - 108px - 34px);
}
</style>
