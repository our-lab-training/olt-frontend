<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-btn slot="activator">
      <v-icon left>fal fa-users-crown</v-icon> Manage Admins
    </v-btn>
    <v-card>
      <v-card-title class="headline">Manage Super Admins</v-card-title>
      <v-card-text>
        <h4>Can Create Groups</h4>
        <manage-perm :perm="['superadmin', 'groups', 'create']"/>
        <h4>Can Delete Groups</h4>
        <manage-perm :perm="['superadmin', 'groups', 'delete']"/>
        <h4>Can Override Everything (Really, Everything) (DO NOT REMOVE YOURSELF)</h4>
        <manage-perm :perm="['*']"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import managePerm from './manage-perm.vue';

export default {
  components: {
    managePerm,
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
