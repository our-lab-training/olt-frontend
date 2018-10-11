<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn slot="activator" @click="loadGroups">
      <v-icon>add</v-icon> Create
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
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
            <v-flex xs12 sm6>
              <v-autocomplete
                label="Copy Template *"
                :items="templates"
                v-model="template"
                clearable
              />
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

const blankGroup = {
  name: '',
  type: 'private',
  desc: '',
};

export default {
  methods: {
    ...mapGetters('groups', { findGroup: 'find' }),
    async submit() {
      const { Group } = this.$FeathersVuex;
      const group = new Group(this.newGroup);
      await group.save();
      this.dialog = false;
      this.newGroup = { ...blankGroup };
    },
    async loadGroups() {
      this.templates = [
        { value: null, text: 'None' },
        // eslint-disable-next-line no-underscore-dangle
        ...this.getGroups({ query: { type: 'template' } }).data.map(g => ({ value: g._id, text: g.name })),
      ];
    },
  },
  data() {
    return {
      dialog: false,
      templates: [
        { value: null, text: 'None' },
      ],
      newGroup: { ...blankGroup },
      template: null,
    };
  },
  async mounted() {
    this.getGroups = this.findGroup({
      query: { type: 'template' },
      paginate: false,
    });
    // eslint-disable-next-line no-underscore-dangle
    // this.templates.push(...this.getTemplates().data.map(g => ({ value: g._id, text: g.name })));
  },
};
</script>
