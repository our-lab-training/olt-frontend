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
          <v-tab>My Organisations</v-tab>
          <v-tab>Public</v-tab>
          <v-tab v-if="showTemplates && false">Templates</v-tab>
          <v-tab v-if="searchValue">Search</v-tab>
        </v-tabs>
      </v-flex>
      <v-flex
        order-xs2 order-sm1 order-md2 xs12 sm6 md5 lg4
        v-if="hasPerm('superadmin.groups.create') || hasPerm('superadmin.groups.delete')"
      >
        <v-menu offset-y>
          <v-btn slot="activator">
            <v-icon left small>fal fa-caret-down</v-icon>
            Admin
          </v-btn>
          <v-list>
            <v-list-tile>
              <groups-add v-if="hasPerm('superadmin.groups.create')"/>
            </v-list-tile>
            <v-list-tile>
              <groups-delete v-if="hasPerm('superadmin.groups.delete')" />
            </v-list-tile>
            <v-list-tile>
              <super-admin v-if="hasPerm('superadmin.perms.write')"/>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
      <v-flex hidden-xs-only order-sm3>
        <v-spacer />
      </v-flex>
      <v-flex xs12 sm6 md3 order-xs1 order-md4 right>
        <v-text-field
        prepend-icon="far fa-search"
        label="Search"
        text
        v-model="searchValue"
        @keyup="tabsValue = searchValue ? searchTab : 0"
      ></v-text-field>
      </v-flex>

    </v-layout>
    <v-tabs-items v-model="tabsValue" class="elevation-1">
      <v-tab-item>
        <groups-list type="enrolled" @openModal="modalEntry=$event"/>
      </v-tab-item>
      <v-tab-item>
        <groups-list type="public" @openModal="modalEntry=$event"/>
      </v-tab-item>
      <v-tab-item v-if="showTemplates">
        <groups-list type="templates" @openModal="modalEntry=$event"/>
      </v-tab-item>
      <v-tab-item v-if="searchValue">
        <groups-list type="search" :query="searchValue" @openModal="modalEntry=$event"/>
      </v-tab-item>
    </v-tabs-items>
    <plugin-modal
      v-if="modalEntry"
      :entry="modalEntry"
      @closed="modalEntry=null"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import groupsAdd from './partials/groups/add.vue';
import groupsDelete from './partials/groups/delete.vue';
import groupsList from './partials/groups/list.vue';
import pluginModal from './partials/groups/plugin-modal.vue';
import superAdmin from './partials/super-admin.vue';

export default {
  components: {
    groupsAdd,
    groupsList,
    groupsDelete,
    pluginModal,
    superAdmin,
  },
  data() {
    return {
      showTemplates: false,
      tabsValue: 0,
      searchTab: 2,
      searchValue: '',
      modalEntry: null,
    };
  },
  computed: {
    ...mapGetters('users', ['hasPerm']),
  },
  async mounted() {
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
