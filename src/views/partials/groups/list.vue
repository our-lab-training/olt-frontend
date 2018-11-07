<template>
  <v-expansion-panel expand v-model="expanded">
    <v-expansion-panel-content
      v-for="(group, i) in groups"
      :key="i"
    >
      <div slot="header" class="title">
        <group-logo style="margin-right:0.5em;" :group="group" />
        <span>{{group.name}}</span>
      </div>

      <v-layout align-start justify-start class="icon-list" wrap row>
        <entry-icon
          v-for="(entry, ref) in groupEntries[group._id]"
          :key="ref"
          :entry="entry"
          :groupId="group._id"
          @openModal="$emit('openModal', $event)"
        />
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import groupEntries from '@/lib/groupEntries';
import entryIcon from './entry-icon.vue';
import groupLogo from './logo.vue';

export default {
  components: {
    entryIcon,
    groupLogo,
  },
  computed: {
    ...mapState('groups', ['isRemovePending', 'isCreatePending', 'isFindPending', 'isPatchPending']),
    ...mapGetters('users', { hasPerm: 'hasPerm', currentUser: 'current' }),
    ...mapGetters('groups', { findGroup: 'find' }),
    groups() {
      const user = this.currentUser._id === this.$store.state.auth.payload.userId ?
        this.currentUser : this.$store.state.auth.user;
      // force recompute on state change
      if (
        this.isFindPending ||
        this.isRemovePending ||
        this.isCreatePending ||
        this.isPatchPending
      ) Math.random();

      if (this.type === 'search' && !this.query) return [];
      let query = null;
      if (this.type === 'search') {
        const queryString = this.query.replace(/[^\w ]/g, '').trim();
        if (!queryString) return [];
        query = RegExp(`(${queryString.replace(/[ ]+/g, ')|(')})`, 'i');
      }
      const typeQueries = {
        search: { name: v => query.test(v) },
        public: { type: 'public' },
        templates: { type: 'template' },
        enrolled: { _id: { $in: user.perms.groups } },
      };
      return this.findGroup({ query: typeQueries[this.type] }).data;
    },
    groupEntries: groupEntries(),
  },
  props: ['type', 'query'],
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
