<template>
  <v-expansion-panel expand v-model="expanded">
    <v-expansion-panel-content
      v-for="(group, i) in groups"
      :key="i"
    >
      <div slot="header" class="title" v-text="group.name"></div>

      <v-layout align-start justify-start class="icon-list">
        <entry-icon
          v-for="(entry, i) in group.entries"
          :key="i"
          :entry="entry"
          :group="group"
          @openModal="$emit('openModal', $event)"
        />
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import { find, filter, map, orderBy } from 'lodash';
import { mapGetters, mapState } from 'vuex';
import entryIcon from './entry-icon.vue';

export default {
  components: {
    entryIcon,
  },
  computed: {
    ...mapState('groups', ['isRemovePending', 'isCreatePending', 'isFindPending']),
    ...mapGetters('users', ['hasPerm']),
    ...mapGetters('groups', { findGroup: 'find' }),
    groups() {
      if (this.isFindPending || this.isRemovePending || this.isCreatePending) Math.random();
      if (this.type === 'search' && !this.query) return [];

      const { user } = this.$store.state.auth;
      let query = null;
      if (this.type === 'search') {
        query = RegExp(`(${this.query.trim().replace(/[^\w ]/g, '').replace(/[ ]+/g, ')|(')})`, 'i');
      }
      const typeQueries = {
        search: { name: v => query.test(v) },
        public: { type: 'public' },
        templates: { type: 'template' },
        enrolled: { _id: { $in: user.perms.groups } },
      };
      let groups = this.findGroup({ query: typeQueries[this.type] }).data;

      groups = groups.map((group) => {
        const isEnrolled = user.perms.groups.indexOf(group._id) !== -1;
        if (isEnrolled || ['template', 'public'].indexOf(group.type) !== -1) {
          group.entries = this.loadPluginEntries(group, isEnrolled);
        }
        return group;
      });

      return groups;
    },
  },
  props: ['type', 'query'],
  methods: {
    loadPluginEntries(group, isEnrolled) {
      const plugs = [
        ...filter(this.$plugins, plugin => plugin.global),
      ];
      const ents = [];
      map(plugs, (plugin) => {
        map(plugin.entries, (entry, ref) => {
          if ((
            entry.onlyGroupOfTypes &&
            entry.onlyGroupOfTypes.indexOf(group.type) === -1
          ) ||
          (
            typeof entry.ifEnrolledIs === 'boolean' &&
            entry.ifEnrolledIs !== isEnrolled
          ) ||
          (
            entry.visiblePerms &&
            !find(entry.visiblePerms, perm => this.hasPerm(perm.replace('{groupId}', group._id)))
          ) ||
          (
            entry.invisiblePerms &&
            find(entry.invisiblePerms, perm => this.hasPerm(perm.replace('{groupId}', group._id)))
          )) return;
          ents.push({
            ...entry,
            ref,
            plugin,
            priority: entry.priority || 100,
          });
        });
      });
      return orderBy(ents, ['priority', 'name'], ['desc', 'asc']);
    },
  },
  data() {
    return {
      expanded: [true, true, true],
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
