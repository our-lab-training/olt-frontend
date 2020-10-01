<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn slot="activator">
      <v-icon left>fal fa-plus</v-icon> Create Organisation
    </v-btn>
    <v-card>
      <v-progress-linear
        color="primary"
        height="4"
        style="margin: 0;"
        :indeterminate="isCreatePending"
      />
      <v-card-title>
        <span class="headline">Create New Organisation</span>
      </v-card-title>
      <v-card-text>
        <group-settings v-model="newGroup" :err="error"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click.native="dialog = false">Close</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click.stop="submit()"
          :disabled="isCreatePending"
          :loading="isCreatePending"
        >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import groupSettings from './settings.vue';

const blankGroup = {
  name: '',
  type: 'private',
  desc: '',
  icon: 'group',
};

export default {
  components: {
    groupSettings,
  },
  data() {
    return {
      dialog: false,
      newGroup: { ...blankGroup },
      error: {},
    };
  },
  computed: {
    ...mapState('groups', ['isCreatePending']),
  },
  methods: {
    ...mapActions('roles', { findRoles: 'find' }),
    async submit() {
      if (this.isCreatePending) return;
      const { Group } = this.$FeathersVuex;
      let group = new Group(this.newGroup);
      try {
        group = await group.save();
        console.log('done creating');
        this.findRoles({ query: { groupId: group._id } });
        this.dialog = false;
        this.newGroup = { ...blankGroup };
      } catch (err) {
        console.error(err);
        this.error = err;
      }
    },
  },
};
</script>

<style scoped>

#pluginAdminLoading {
  margin: 0;
}

</style>
