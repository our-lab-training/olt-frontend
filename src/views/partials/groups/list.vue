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
          :link="mod.link"
        />
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import moduleIcon from './module-icon.vue';

export default {
  components: {
    moduleIcon,
  },
  computed: {
    ...mapState('groups', ['isRemovePending', 'isCreatePending', 'isFindPending']),
  },
  props: ['type', 'query'],
  watch: {
    query(q) {
      this.loadGroups(q);
    },
    isFindPending(pending) {
      if (pending) return;
      this.loadGroups(this.query);
    },
    isRemovePending(pending) {
      if (pending) return;
      // this.getGroups = this.findGroup();
      this.loadGroups(this.query);
    },
    isCreatePending(pending) {
      if (pending) return;
      // this.getGroups = this.findGroup();
      this.loadGroups(this.query);
    },
  },
  methods: {
    ...mapGetters('groups', { findGroup: 'find' }),
    ...mapGetters('auth', { currentUser: 'current' }),
    async loadGroups(query) {
      const { user } = this.$store.state.auth;
      const typeQueries = {
        search: { name: { $regex: query, $options: 'i' } },
        public: { type: 'public' },
        templates: { type: 'template' },
        enrolled: { $or: [{ _id: { $in: user.perms.groups } }, { type: 'global' }] },
      };
      if (this.type === 'search' && !query) return;
      this.groups = this.getGroups({ query: typeQueries[this.type] }).data.map((group) => {
        const isEnrolled = user.perms.groups.indexOf(group._id) !== -1 || group.type === 'global';
        if (isEnrolled || group.type === 'template') group.modules = this.loadModules(group);
        else group.modules = [];
        if (group.type === 'public') {
          if (isEnrolled) {
            group.modules.push({
              name: 'Leave Group',
              icon: 'cancel_presentation',
              link: `/groups/${group._id}/unenroll`,
            });
          } else {
            group.modules.push({
              name: 'Join Group',
              icon: 'input',
              link: `/groups/${group._id}/enroll`,
            });
          }
        }
        return group;
      });
      console.log(this.groups, this.type);
    },
    async loadModules(/* group */) {
      return [];
    },
  },
  data() {
    return {
      groups: [],
    };
  },
  async mounted() {
    this.getGroups = await this.findGroup();
    this.loadGroups(this.query || '');
  },
};
</script>

<style scoped>
.icon-list {
  margin: 12px 0;
  padding-left: 12px;
}
</style>
