<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <v-btn slot="activator" @click="groups=findGroups().data">
      <v-icon>delete_outline</v-icon> Remove
    </v-btn>
    <v-card>
      <v-progress-linear
        color="error"
        height="4"
        style="margin: 0;"
        :indeterminate="isRemovePending"
      />
      <v-card-title>
        <span class="headline">Are you sure?</span>
      </v-card-title>
      <v-card-text>
        <span v-if="error" class="error--text">{{error}}</span>
        <v-autocomplete
          label="Group"
          :items="groups"
          v-model="groupId"
          item-text="name"
          item-value="_id"
          clearable
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Cancel</v-btn>
        <v-btn
            color="error"
            flat
            @click.native="submit()"
            :disabled="isRemovePending"
            :loading="isRemovePending"
          >Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters('groups', { findGroups: 'find' }),
    ...mapState('groups', ['isRemovePending']),
  },
  methods: {
    ...mapActions('groups', { removeGroup: 'remove' }),
    async submit() {
      if (this.isRemovePending) return;
      this.error = '';
      if (this.groupId) {
        try {
          await this.removeGroup(this.groupId);
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
          this.error = 'An unknown error occured, please try again or alert an admin.';
        }
      }
      this.dialog = false;
      this.groupId = null;
    },
  },
  data() {
    return {
      dialog: false,
      groupId: null,
      groups: [],
      error: '',
    };
  },
};
</script>
