<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn slot="activator">
      <v-icon>add</v-icon> Create
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Create New Group</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Name *" required v-model="newGroup.name" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Type *"
                :items="['private', 'public', 'global', 'template']"
                v-model="newGroup.type"
              />
            </v-flex>
            <v-flex xs12 sm6 hidden-sm-and-up hidden-xs-only>
              <v-autocomplete
                label="Copy Template *"
                :items="templates"
                v-model="template"
                clearable
              />
            </v-flex>
            <v-flex xs3>
              <v-select
                label="Icon"
                :items="icons"
                v-model="newGroup.icon"
              >
                <template slot="item" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Description" v-model="newGroup.desc"></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="submit()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import icons from './icons.json';

const blankGroup = {
  name: '',
  type: 'private',
  desc: '',
  icon: 'group',
};

export default {
  methods: {
    async submit() {
      const { Group } = this.$FeathersVuex;
      const group = new Group(this.newGroup);
      await group.save();
      this.dialog = false;
      this.newGroup = { ...blankGroup };
    },
  },
  computed: {
    ...mapGetters('groups', { findGroup: 'find' }),
    templates() {
      return [
        { value: null, text: 'None' },
        // eslint-disable-next-line no-underscore-dangle
        ...this.findGroup({ query: { type: 'template' } }).data.map(g => ({ value: g._id, text: g.name })),
      ];
    },
  },
  data() {
    return {
      dialog: false,
      newGroup: { ...blankGroup },
      template: null,
      icons,
    };
  },
};
</script>
