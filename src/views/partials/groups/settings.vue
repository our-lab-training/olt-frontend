<template>
  <v-container grid-list-md>
    <small>*indicates required field</small>
    <v-layout wrap>
      <v-flex xs12>
        <v-text-field
          label="Name *"
          required
          v-model="group.name"
          :error-messages="error.name"
          @input="error.name=''"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <v-select
          label="Type *"
          :items="['private', 'public', 'global', 'template']"
          v-model="group.type"
          :error-messages="error.type"
          @input="error.type=''"
        />
      </v-flex>
      <v-flex xs12 sm6 hidden-sm-and-up hidden-xs-only>
        <v-autocomplete
          label="Copy Template *"
          :items="templates"
          v-model="group.template"
          :error-messages="error.template"
          @input="error.template=''"
          clearable
        />
      </v-flex>
      <v-flex xs12>
        <v-textarea
          label="Description"
          v-model="group.desc"
          :error-messages="error.desc"
          @input="error.desc=''"
        />
      </v-flex>
      <v-flex xs12>
        <h3>Group Logo</h3>
      </v-flex>
      <v-flex xs3 v-if="!imageSrc && !group.logo">
        <v-select
          label="Select Logo"
          :items="icons"
          v-model="group.icon"
          :error-messages="error.icon"
          @input="error.icon=''"
        >
          <template slot="item" slot-scope="data">
            <v-icon>{{data.item}}</v-icon>
          </template>
          <template slot="selection" slot-scope="data">
            <v-icon>{{data.item}}</v-icon>
          </template>
        </v-select>
      </v-flex>
      <v-flex xs3 v-if="imageSrc || group.logo">
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
              group.logo='';
              imageReset = Math.random();
            "
          >delete</v-icon>
          <img :src="imageSrc || group.logo" alt="group logo" id="group-logo-preview">
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
</template>

<script>
import { isEqual } from 'lodash';
import { mapGetters } from 'vuex';
import fileUpload from '@/views/partials/file-upload.vue';
import icons from './icons.json';

export default {
  components: {
    fileUpload,
  },
  props: ['value', 'err'],
  data() {
    return {
      template: null,
      error: {
        name: '',
        type: '',
        desc: '',
        icon: '',
        logo: '',
      },
      group: this.value || {
        name: '',
        type: 'private',
        desc: '',
        icon: 'group',
        logo: '',
      },
      icons,
      imageSrc: '',
      imageErr: '',
      imageSuc: '',
      imageReset: 0,
    };
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
  watch: {
    value(v) {
      if (!isEqual(this.group, v)) this.group = v;
    },
    group(v) {
      if (!isEqual(this.value, v)) this.$emit('input', v);
    },
    err(err) {
      Object.keys(err.errors).forEach((key) => {
        const end = key.split('.').pop();
        this.error[end] =
          typeof err.errors[key] === 'string'
            ? err.message
            : err.errors[key].message;
      });
      if (this.error.logo) this.imageErr = this.error.logo;
    },
  },
  methods: {
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
          this.group.logo = this.imageSrc;
          this.imageSuc = 'Image is valid.';
        }
      }, 100);
    },
  },
};
</script>

<style scoped>

img {
  max-width: 3em;
  cursor: default;
}

</style>

