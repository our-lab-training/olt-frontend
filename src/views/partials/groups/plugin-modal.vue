<template>
  <v-layout row justify-center>

    <v-dialog v-model="dialog" :max-width="width">
      <component
      :is="kebabCase(`${entry.plugin.ref}-${entry.ref}`)"
      :entry="entry"
      @modalClose="dialog = false"
      @setWidth="width=$event"
      />
    </v-dialog>
  </v-layout>
</template>

<script>
import { kebabCase } from 'lodash';
import { mapMutations } from 'vuex';

export default {
  props: ['entry'],
  data() {
    return {
      dialog: true,
      width: 901,
    };
  },
  watch: {
    entry(v) {
      if (v) this.dialog = true;
    },
    dialog(v) {
      if (v) return;
      this.clearCurrent();
      this.$emit('closed');
    },
  },
  methods: {
    ...mapMutations('groups', ['clearCurrent']),
    kebabCase,
  },
  mounted() {
    if (this.width === 901) this.width = 600;
  },
};
</script>

