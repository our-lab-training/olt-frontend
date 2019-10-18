<template>
  <v-btn
    outlined
    small
    :class="right ? 'float-right' : ''"
    @click="btnClick"
    :to="!entry.modal ? entry.link : ''"
    :style="right ? { float: 'right' } : {}"
  >
    <v-icon left small>{{entry.icon}}</v-icon>
    {{entry.name}}
  </v-btn>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  props: ['entry', 'groupId', 'right'],
  data() {
    return {
      plugins: this.$plugins,
    };
  },
  methods: {
    ...mapMutations('groups', ['setCurrent']),
    btnClick() {
      if (!this.entry.modal) return;
      this.setCurrent(this.groupId);
      this.$emit('openModal', this.entry);
    },
  },
};
</script>

