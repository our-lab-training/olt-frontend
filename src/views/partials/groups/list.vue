<template>
  <v-expansion-panel expand :value="groups.map((_, i) => i < 3)">
    <v-expansion-panel-content
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
import { mapGetters } from 'vuex';
import moduleIcon from './module-icon.vue';

export default {
  components: {
    moduleIcon,
  },
  props: ['type', 'query'],
  watch: {
    query(q) {
      this.loadGroups(q);
    },
  },
  methods: {
    ...mapGetters('groups', { findGroup: 'find' }),
    ...mapGetters('auth', { currentUser: 'current' }),
    async loadGroups(query) {
      const { user } = this.$store.state.auth;
      if (this.type === 'search' && query) {
        this.groups = this.getGroups({
          query: {
            name: { $regex: query, $options: 'i' },
          },
        }).data;
      } else if (this.type === 'public') {
        this.groups = this.getGroups({ query: { type: 'public' } }).data;
      } else if (this.type === 'templates') {
        this.groups = this.getGroups({ query: { type: 'template' } }).data;
      } else if (this.type === 'enrolled') {
        this.groups = this.getGroups({
          query: {
            _id: { $in: user.perms.groups },
          },
        }).data;
      }
    },
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
  async mounted() {
    this.getGroups = this.findGroup({
      query: {},
      paginate: false,
    });
    this.loadGroups(this.query);
  },
};
</script>

<style scoped>
.icon-list {
  margin: 12px 0;
  padding-left: 12px;
}
</style>
