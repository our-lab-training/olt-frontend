<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <v-btn slot="activator" @click="loadGroups">
      <v-icon>delete_outline</v-icon> Remove
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Are you sure?</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          label="Group"
          :items="groups"
          v-model="groupId"
          clearable
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn color="error" flat @click.native="submit()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  methods: {
    ...mapGetters('groups', { findGroup: 'find', getGroup: 'get' }),
    async submit() {
      if (this.groupId) {
        const { Group } = this.$FeathersVuex;
        const group = new Group({ _id: this.groupId });
        await group.remove();
      }
      this.dialog = false;
      this.groupId = null;
    },
    async loadGroups() {
      // eslint-disable-next-line no-underscore-dangle
      this.groups = this.getGroups().data.map(g => ({ value: g._id, text: g.name }));
    },
  },
  data() {
    return {
      dialog: false,
      groups: [],
      groupId: null,
    };
  },
  async mounted() {
    this.getGroups = this.findGroup({
      query: {},
      paginate: false,
    });
  },
};
</script>
