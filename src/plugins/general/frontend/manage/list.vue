<template>
  <v-list class="managed-list">
    <v-list-tile>
      <v-list-tile-content>
        <v-text-field
          label="Search"
          prepend-icon="far fa-search"
          v-model="search"
        />
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click.stop="newDialog = true;">
      <v-list-tile-content>
        <v-list-tile-title class="text-capitalize">
          <v-icon small left>fal fa-plus</v-icon>
          New {{singular}}
        </v-list-tile-title>
      </v-list-tile-content>
      <v-dialog
        v-model="newDialog"
        max-width="300px"
      >
        <v-card>
          <v-card-text>
            <h1>New {{singular}}</h1>
            <span v-if="newErr" class="error--text">{{newErr}}</span>
            <v-text-field
              ref="newName"
              :label="type !== 'users' ? `${singular} Name` : 'User Pheme Number'"
              :counter="type !== 'users' ? 128 : 8"
              :rules="
                type !== 'users'
                ? [v => /^[\w- ]{1,128}$/.test(v) || 'Invalid Name.']
                : [v => /^[\d]{8}$/.test(v) || 'Invalid pheme number.']
              "
              v-model="newName"
            />
          </v-card-text>
          <v-card-actions><v-spacer />
            <v-btn flat @click="newDialog = false" :disabled="isCreatePending">Cancel</v-btn>
            <v-btn
              flat color="success"
              @click="newItem"
              :loading="isCreatePending"
              :disabled="isCreatePending"
            >Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list-tile>
    <v-list-tile
      v-for="(item, i) in items"
      :key="i"
      @click.stop="$emit('update:current', item._id)"
      :color="current === item._id ? 'primary' : ''"
    >
      <v-list-tile-content>
        <v-list-tile-title v-text="item.name" />
        <v-list-tile-sub-title v-if="item.subname" v-text="item.subname" />
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      default: 'users',
    },
    current: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      search: '',
      newDialog: false,
      newName: '',
      newErr: '',
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('users', { usersFind: 'find' }),
    ...mapGetters('roles', { rolesFind: 'find' }),
    ...mapGetters('events', { eventsFind: 'find' }),
    ...mapState('perms', { permsCreatePending: 'isCreatePending' }),
    ...mapState('roles', { rolesCreatePending: 'isCreatePending' }),
    ...mapState('events', { eventsCreatePending: 'isCreatePending' }),
    isCreatePending() {
      return this.permsCreatePending || this.rolesCreatePending || this.eventsCreatePending;
    },
    singular() { return this.type.replace(/^./, c => c.toUpperCase()).replace(/s$/, ''); },
    items() {
      const search = v => !this.search || v.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      const query = { $or: [{ name: search }] };
      switch (this.type) {
        case 'users':
          query.$or.push({ username: search });
          query['perms.groups'] = this.currentGroup._id;
          return this.usersFind({ query }).data.map(u => ({ ...u, subname: u.username }));
        case 'roles':
          query.groupId = this.currentGroup._id;
          return this.rolesFind({ query }).data;
        case 'events':
          query.groupId = this.currentGroup._id;
          return this.eventsFind({ query }).data;
        /* case 'perms':
          return this.perms.filter; */
        default:
          return [];
      }
    },
  },
  methods: {
    async newItem() {
      this.newErr = '';
      if (!this.$refs.newName.validate() || this.isCreatePending) return;
      try {
        if (this.type === 'roles' || this.type === 'events') {
          if (this.items.find(i => i.name.toLowerCase() === this.newName.toLowerCase())) {
            throw new Error(`${this.singular} name already exists!`);
          }
          await this.$store.dispatch(`${this.type}/create`, {
            name: this.newName,
            groupId: this.currentGroup._id,
          });
        } else if (this.type === 'users') {
          if (this.items.find(i => i.username.toLowerCase() === this.newName.toLowerCase())) {
            throw new Error('User is already joined!');
          }
          const perm = await this.$store.dispatch('perms/create', {
            grantee: this.newName,
            perm: [this.currentGroup._id, 'enrolled'],
            type: 'users',
          });
          this.$store.dispatch('users/get', perm.grantee);
        }
        this.newName = '';
        this.newDialog = false;
      } catch (err) {
        console.error(err);
        this.newErr = err.message;
      }
    },
  },
};
</script>

<style scoped>
.managed-list {
  border-right: solid thin rgba(0,0,0,.12);
  max-height: 400px;
  overflow-y: auto;
}
</style>

