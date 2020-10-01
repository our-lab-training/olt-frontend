<template>
  <v-container grid-list-md>
    <v-layout v-if="item" row wrap>
      <v-flex v-if="errs.general" xs12>
        <span class="error--text">{{errs.general}}</span>
      </v-flex>
      <v-flex :xs12="type === 'users'" :sm6="type === 'users'" :expand="type !== 'users'">
        <v-text-field
          label="Name"
          v-model="item.name"
          :disabled="type === 'users' || isPatchPending"
          :loading="isPatchPending"
          @change="save"
        />
      </v-flex><v-flex shrink v-if="type !== 'users'">
        <v-menu offset-y>
          <v-btn text icon slot="activator" :loading="isRemovePending">
            <v-icon>fal fa-trash</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="del()">
              <v-list-tile-title class="error--text">
                <v-icon color="error" left>fas fa-exclamation-triangle</v-icon>
                Delete Forever
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex><v-flex v-if="type === 'roles'" xs12>
        <v-textarea
          label="Role description."
          v-model="item.desc"
          :disabled="isPatchPending"
          :loading="isPatchPending"
          @change="save"
        />
      </v-flex><v-flex v-if="type === 'roles'" xs12>
        <v-switch
          label="Add role to newly joined users."
          v-model="item.addOnJoin"
          :disabled="isPatchPending"
          :loading="isPatchPending"
          @change="save"
        />
      </v-flex><v-flex v-if="type === 'users'" xs12 sm6>
        <v-text-field
          label="Username"
          v-model="item.username"
          disabled
        />
      </v-flex><v-flex v-if="type === 'users'" xs12>
        <v-text-field
          label="Email"
          v-model="item.email"
          disabled
        />
      </v-flex><v-flex v-if="type === 'users'" xs12>
        <v-autocomplete
          label="Roles"
          v-model="userRoles"
          :items="roles"
          item-text="name"
          item-value="_id"
          :disabled="loadingRoles || current === user._id"
          :loading="loadingRoles"
          multiple chips
          deletable-chips
          :error-messages="errs.roles || []"
        />
      </v-flex>
      <v-flex xs12>
        <v-autocomplete
          label="Permissions"
          v-model="itemPerms"
          :items="perms"
          :disabled="loadingPerms || current === user._id"
          :loading="loadingPerms"
          item-disabled="readonly"
          multiple chips
          deletable-chips
          :error-messages="errs.perms || []"
        />
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <h1 class="text-capitalize text-xs-center">please select a {{type.replace(/s$/, '')}}.</h1>
      </v-flex>
    </v-layout>
  </v-container>
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
      userRoles: [],
      itemPerms: [],
      loadingRoles: false,
      loadingPerms: false,
      errs: {},
      item: null,
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('users', { usersGet: 'get' }),
    ...mapGetters('roles', { rolesGet: 'get', rolesFind: 'find' }),
    ...mapGetters('perms', { permsFind: 'find' }),
    ...mapState('roles', ['isPatchPending', 'isRemovePending']),
    roles() { return this.rolesFind({ query: { groupId: this.currentGroup._id } }).data; },
    perms() { return this.$perms(this.currentGroup._id); },
  },
  watch: {
    current() {
      if (!this.current) return;
      const item = this[`${this.type}Get`](this.current);
      if (!item) return;
      if (this.type === 'users') {
        this.item = (new this.$FeathersVuex.User(item)).clone();
        this.userRoles = this.item.perms.roles.filter((id) => this.roles.find((r) => r._id === id));
        this.itemPerms = this.item.perms.userperms
          .map((p) => p.perm.join('.'))
          .filter((perm) => this.perms.find((p) => p.value === perm));
      } else if (this.type === 'roles') {
        this.item = (new this.$FeathersVuex.Role(item)).clone();
        this.itemPerms = this.item.perms
          .map((p) => p.perm.join('.'))
          .filter((perm) => this.perms.find((p) => p.value === perm));
      }
    },
    // eslint-disable-next-line func-names
    'item.perms.roles': function (v) {
      if (this.type !== 'users') return;
      this.userRoles = v.filter((id) => this.roles.find((r) => r._id === id));
    },
    // eslint-disable-next-line func-names
    'item.perms.userperms': function (v) {
      if (this.type !== 'users') return;
      this.itemPerms = v.map((p) => p.perm.join('.'))
        .filter((perm) => this.perms.find((p) => p.value === perm));
    },
    // eslint-disable-next-line func-names
    'item.perms': function (v) {
      if (this.type !== 'roles') return;
      this.itemPerms = !v ? [] : v.map((p) => p.perm.join('.'))
        .filter((perm) => this.perms.find((p) => p.value === perm));
    },
    async userRoles() {
      if (this.type !== 'users') return;
      this.loadingRoles = true;
      this.errs = {};
      try {
        const roles = this.item.perms.roles.filter((id) => this.roles.find((r) => r._id === id));
        const adds = this.userRoles.filter((id) => roles.indexOf(id) === -1);
        const removes = roles.filter((id) => this.userRoles.indexOf(id) === -1);
        await Promise.all(removes.map((id) => {
          const perm = this.item.perms.userperms.find((p) => p.perm[0] === 'roles' && p.perm[1] === id);
          if (!perm) return null;
          return this.$store.dispatch('perms/remove', perm._id);
        }));
        await Promise.all(adds.map((id) => this.$store.dispatch('perms/create', {
          grantee: this.item._id,
          perm: ['roles', id],
          type: 'users',
        })));
      } catch (err) {
        console.error(err);
        this.errs.roles = err.message;
      }
      this.loadingRoles = false;
    },
    async itemPerms() {
      this.loadingPerms = true;
      this.errs = {};
      try {
        const perms = (this.type === 'roles' ? this.item.perms : this.item.perms.userperms)
          .map((p) => p.perm.join('.'))
          .filter((perm) => this.perms.find((p) => p.value === perm));
        const adds = this.itemPerms.filter((perm) => perms.indexOf(perm) === -1);
        const removes = perms.filter((perm) => this.itemPerms.indexOf(perm) === -1);
        if (!adds.length && !removes.length) {
          this.loadingPerms = false;
          return;
        }
        await Promise.all(removes.map((permstr) => {
          const perm = (this.type === 'roles' ? this.item.perms : this.item.perms.userperms)
            .find((p) => p.perm.join('.') === permstr);
          if (!perm) return null;
          return this.$store.dispatch('perms/remove', perm._id);
        }));
        await Promise.all(adds.map((permstr) => this.$store.dispatch('perms/create', {
          grantee: this.item._id,
          perm: permstr.split('.'),
          type: this.type,
        })));
        await this.$store.dispatch(`${this.type}/get`, this.item._id);
        if (this.type === 'users') this.$store.commit('users/setCurrent', this.user._id);
      } catch (err) {
        console.error(err);
        this.errs.perms = err.message;
      }
      this.loadingPerms = false;
    },
  },
  methods: {
    async save() {
      if (!this.current) return;
      this.errs = {};
      const item = this[`${this.type}Get`](this.current);
      if (item.name === this.item.name && item.addOnJoin === this.item.addOnJoin) return;
      try {
        await this.item.save();
      } catch (err) {
        console.error(err);
        this.errs.general = err.message;
      }
    },
    async del() {
      await this.item.remove();
      this.item = undefined;
    },
  },
};
</script>
