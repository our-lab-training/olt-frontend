<template>
  <div class="groups-entry-icon subheader text-xs-center">
    <v-badge overlap color="orange" :value="!!notify || notify === ''">
      <v-icon slot="badge" dark small>notifications</v-icon>

      <v-btn outline large fab color="indigo" style="margin: 0;" @click="btnClick">
        <v-icon v-text="entry.icon"></v-icon>
      </v-btn>

    </v-badge>
    <span v-text="entry.name"></span>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  props: ['entry', 'group'],
  data() {
    return {
      notify: false,
      plugins: this.$plugins,
    };
  },
  methods: {
    ...mapMutations('groups', ['setCurrent']),
    btnClick() {
      this.setCurrent(this.group._id);
      this.$emit('openModal', this.entry);
    },
  },
};
</script>

<style scoped>
.groups-entry-icon {
  max-width: 72px;
  margin: 0 12px;
}
</style>

