<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn slot="activator">
      <v-icon left>fal fa-plus</v-icon> Create
    </v-btn>
    <v-card>
      <v-progress-linear
        color="primary"
        height="4"
        style="margin: 0;"
        :indeterminate="isCreatePending"
      />
      <v-card-title>
        <span class="headline">Create New Group</span>
      </v-card-title>
      <v-card-text>
        <group-settings v-model="newGroup" :err="error"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click.native="submit()"
          :disabled="isCreatePending"
          :loading="isCreatePending"
        >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
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
    async submit() {
      if (this.isCreatePending) return;
      const { Group } = this.$FeathersVuex;
      const group = new Group(this.newGroup);
      try {
        await group.save();
        this.dialog = false;
        this.newGroup = { ...blankGroup };
      } catch (err) {
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
