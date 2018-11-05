<template>
  <v-card>
    <v-progress-linear
      indeterminate
      color="primary"
      height="2"
      id="pluginAdminLoading"
      v-if="isPatchPending || isUpdatePending"
    />
    <v-card-title class="headline">Manage {{currentGroup.name}}</v-card-title>

    <v-tabs v-model="tab">
      <v-tab key="settings">
        <v-icon style="padding-right: 0.5em;">build</v-icon>
        Settings
      </v-tab>
      <v-tab key="plugins">
        <v-icon style="padding-right: 0.5em;">extension</v-icon>
        Plugins
      </v-tab>
    </v-tabs>

    <v-divider xs12></v-divider>

    <v-tabs-items v-model="tab">
      <v-tab-item key="settings">
        <v-container grid-list-md>
          <small>*indicates required field</small>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Name *" required v-model="currentClone.name" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Type *"
                :items="['private', 'public', 'global', 'template']"
                v-model="currentClone.type"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea label="Description" v-model="currentClone.desc"></v-textarea>
            </v-flex>
            <v-flex xs12>
              <h3>Group Logo</h3>
            </v-flex>
            <v-flex xs3 v-if="!imageSrc && !currentClone.logo">
              <v-select
                label="Select Logo"
                :items="icons"
                v-model="currentClone.icon"
              >
                <template slot="item" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-icon>{{data.item}}</v-icon>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs3 v-if="imageSrc || currentClone.logo">
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
                    currentClone.logo='';
                    imageReset = Math.random();
                  "
                >delete</v-icon>
                <img :src="imageSrc || currentClone.logo" alt="group logo" id="group-logo-preview">
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
      </v-tab-item>

      <v-tab-item key="plugins">
        <v-list>
          <v-list-tile avatar v-for="(plugin, ref) in this.$plugins" :key="ref">

            <v-list-tile-avatar>
              <v-icon v-text="getIcon(plugin)"></v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title >{{plugin.name || ref}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-layout row wrap>
                <v-flex style="margin-right: 1em;">
                  <v-btn
                    flat
                    icon
                    :to="plugin.settingsLink.replace('{groupId}', currentGroup._id)"
                    v-if="plugin.settingsLink"
                  >
                    <v-icon>settings</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex>
                  <v-switch
                    :value="plugin.ref"
                    :readonly="plugin.global"
                    v-model="plugins"
                    @change="pluginsChange"
                  />
                </v-flex>
              </v-layout>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-tab-item>

    </v-tabs-items>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        flat="flat"
        @click="closeAndClear()"
      >
        Close
      </v-btn>
      <v-btn
        v-if="tab===0"
        flat="flat"
        @click.stop="saveSettings()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { find, filter, reduce } from 'lodash';
import icons from '@/views/partials/groups/icons.json';
import fileUpload from '@/views/partials/file-upload.vue';

export default {
  components: {
    fileUpload,
  },
  props: ['entry'],
  data() {
    return {
      plugins: [],
      tab: 0,
      icons,
      imageSrc: '',
      imageErr: '',
      imageSuc: '',
      imageReset: 0,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapState('groups', ['isPatchPending', 'isUpdatePending']),
    currentClone() {
      const { Group } = this.$FeathersVuex;
      return (new Group(this.currentGroup)).clone();
    },
  },
  mounted() {
    this.plugins = [
      ...(this.currentGroup.plugins || []),
      // add globals
      ...reduce(this.$plugins, (a, p) => [...a, ...(p.global ? [p.ref] : [])], []),
    ];
  },
  methods: {
    getIcon(plugin) {
      if (plugin.icon) return plugin.icon;
      const { icon } = find(plugin.entries, entry => entry.icon);
      return icon || 'dashboard';
    },
    pluginsChange() {
      this.currentGroup.plugins = filter(this.plugins, p => !this.$plugins[p].global) || [];
      this.currentGroup.save();
    },
    async saveSettings() {
      this.currentClone.commit();
      await this.currentClone.save();
      this.$emit('modalClose');
    },
    async closeAndClear() {
      this.currentClone.reset();
      this.$emit('modalClose');
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
          this.currentClone.logo = this.imageSrc;
          this.imageSuc = 'Image is valid.';
        }
      }, 100);
    },
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
