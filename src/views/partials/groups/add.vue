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
          <small>*indicates required field</small>
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
            <v-flex xs12>
              <v-textarea label="Description" v-model="newGroup.desc"></v-textarea>
            </v-flex>
            <v-flex xs12>
              <h3>Group Logo</h3>
            </v-flex>
            <v-flex xs3 v-if="!imageSrc && !newGroup.logo">
              <v-select
                label="Select Logo"
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
            <v-flex xs3 v-if="imageSrc || newGroup.logo">
              <v-badge right overlap color="black">
                <v-icon
                  slot="badge"
                  dark
                  small
                  style="cursor: pointer;"
                  @click="
                    imageSrc='';
                    imageErr='';
                    imageSuc='';
                    newGroup.logo='';
                    imageReset = Math.random();
                  "
                >delete</v-icon>
                <img :src="imageSrc || newGroup.logo" alt="group logo" id="group-logo-preview">
              </v-badge>
            </v-flex>
            <v-flex xs9>
              <file-upload
                label="Upload Logo"
                icon="cloud_upload"
                @formData="checkFile"
                accept="image/png"
                :reset="imageReset"
              />
            </v-flex>
            <v-flex xs12>
              <span :class="imageErr ? 'error--text': imageSuc ? 'success--text' : 'caption'">
                {{
                  imageErr ||
                  imageSuc ||
                  'Logo must be a PNG, less than 30KB, square, and more than 64px. ' +
                  'Preferably with a transparent background.'
                }}
              </span>
            </v-flex>
          </v-layout>
        </v-container>
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
import fileUpload from '@/views/partials/file-upload.vue';
import icons from './icons.json';

const blankGroup = {
  name: '',
  type: 'private',
  desc: '',
  icon: 'group',
};

export default {
  components: {
    fileUpload,
  },
  methods: {
    async submit() {
      const { Group } = this.$FeathersVuex;
      const group = new Group(this.newGroup);
      await group.save();
      this.dialog = false;
      this.newGroup = { ...blankGroup };
    },
    checkFile(files) {
      this.imageErr = '';
      this.imageSuc = '';
      if (files.length === 0) return;
      const file = files[0];
      if (file.size > 30000) {
        this.imageErr = 'Image too large, cannot be more than 30KB.';
        return;
      }
      if (file.type !== 'image/png') {
        this.imageErr = 'Invalid file format, must be a .png image.';
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imageSrc = reader.result;
      }, false);
      reader.readAsDataURL(file);
      setTimeout(() => {
        const imgEl = document.getElementById('group-logo-preview');
        if (imgEl.naturalHeight < 64) {
          this.imageErr = 'Image too small, must be larger than 64 pixels.';
        } else if (imgEl.naturalHeight !== imgEl.naturalWidth) {
          this.imageErr = 'Image must be square.';
        } else {
          this.newGroup.logo = this.imageSrc;
          this.imageSuc = 'Image is valid.';
        }
      }, 100);
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
      imageSrc: '',
      imageErr: '',
      imageSuc: '',
      imageReset: 0,
    };
  },
};
</script>

<style scoped>

#pluginAdminLoading {
  margin: 0;
}

img {
  max-width: 3em;
  cursor: default;
}

</style>
