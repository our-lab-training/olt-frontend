<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content
      value="true"
      v-for="(group, i) in groups"
      :key="i"
    >
      <div slot="header" class="title" v-text="group.name"></div>

      <v-layout align-start justify-start class="icon-list">
        <module-icon
          v-for="(mod, i) in group.modules"
          :key="i"
          :title="mod.name"
          :icon="mod.icon"
          :notify="mod.notify"
        />
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import moduleIcon from './module-icon.vue';

export default {
  components: {
    moduleIcon,
  },
  data() {
    return {
      groups: [{
        name: 'Group A',
        modules: [
          { name: 'Content', icon: 'folder_open', notify: false },
          { name: 'Edit Something', icon: 'edit', notify: true },
        ],
      },
      {
        name: 'Group B',
        modules: [
          { name: 'Cards', icon: 'credit_card', notify: true },
          { name: 'Content', icon: 'folder_open', notify: false },
          { name: 'Edit Something', icon: 'edit', notify: false },
        ],
      }],
    };
  },
};
</script>

<style scoped>
.icon-list {
  margin: 12px 0;
  padding-left: 12px;
}
</style>
