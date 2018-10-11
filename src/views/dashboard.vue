<template>
  <div>
    <v-layout row wrap>
      <v-flex order-xs4 order-md1 class="tabs-wrapper">
        <v-tabs
          slot="extension"
          left
          v-model="tabsValue"
          color="transparent"
        >
          <v-tab>My Groups</v-tab>
          <v-tab>Public</v-tab>
          <v-tab v-if="showTemplates">Templates</v-tab>
          <v-tab v-if="searchValue">Search</v-tab>
        </v-tabs>
      </v-flex>
      <v-flex order-xs2 order-sm1 order-md2 xs12 sm6 md3 lg4
        v-if="hasPerm('superadmin.groups.create')">
        <groups-add />
        <groups-delete v-if="hasPerm('superadmin.groups.delete')" />
      </v-flex>
      <v-flex hidden-xs-only order-sm3>
        <v-spacer />
      </v-flex>
      <v-flex xs12 sm6 md3 order-xs1 order-md4 right>
        <v-text-field
        prepend-icon="search"
        label="Search"
        flat
        v-model="searchValue"
        @keyup="tabsValue = searchValue ? searchTab : 0"
      ></v-text-field>
      </v-flex>

    </v-layout>
    <v-tabs-items v-model="tabsValue" class="elevation-1">
      <v-tab-item>
        <groups-list type="enrolled"/>
      </v-tab-item>
      <v-tab-item>
        <groups-list type="public"/>
      </v-tab-item>
      <v-tab-item v-if="showTemplates">
        <groups-list type="templates"/>
      </v-tab-item>
      <v-tab-item v-if="searchValue">
        <groups-list type="search" :query="searchValue"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import groupsAdd from './partials/groups/add.vue';
import groupsDelete from './partials/groups/delete.vue';
import groupsList from './partials/groups/list.vue';

export default {
  components: {
    groupsAdd,
    groupsList,
    groupsDelete,
  },
  data() {
    return {
      showTemplates: false,
      tabsValue: 0,
      searchTab: 2,
      searchValue: '',
    };
  },
  methods: {
    ...mapActions('groups', { findGroups: 'find' }),
  },
  computed: {
    ...mapGetters('users', ['hasPerm']),
  },
  async mounted() {
    await this.findGroups();
    this.showTemplates = this.hasPerm('superadmin.groups.read');
    if (this.showTemplates) this.searchTab += 1;
  },
};
</script>

<style scoped>

/* makes the tabs wrapper only as wide as it's contents when larger than md*/
@media not screen and (max-width: 960px) {
  .tabs-wrapper {
    display: contents;
  }
}
</style>
