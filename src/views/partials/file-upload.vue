<template>
  <div>
    <v-btn
      :required="required"
      @click.native="onFocus"
      :disabled="disabled"
      class="upload-btn"
    >
      <v-icon v-if="icon" left>{{icon}}</v-icon>
      {{filename || label}}
    </v-btn>
    <input
      type="file"
      :accept="accept"
      :multiple="false"
      :disabled="disabled"
      ref="fileInput"
      @change="onFileChange"
    >
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String],
    },
    accept: {
      type: String,
      default: '*',
    },
    label: {
      type: String,
      default: 'Please choose...',
    },
    icon: {
      type: String,
      default: 'fal fa-paperclip',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean, // not yet possible because of data
      default: false,
    },
    reset: {
      type: Number, // set to any number to reset
      default: 0,
    },
  },
  data() {
    return {
      filename: '',
      target: null,
    };
  },
  watch: {
    value(v) {
      this.filename = v;
    },
    reset() {
      if (this.target) {
        this.target.value = '';
        if (!/safari/i.test(navigator.userAgent)) {
          this.target.type = '';
          this.target.type = 'file';
        }
      }
      this.filename = '';
    },
  },
  mounted() {
    this.filename = this.value;
  },

  methods: {
    getFormData(files) {
      const data = new FormData();
      [...files].forEach((file) => {
        data.append('data', file, file.name); // currently only one file at a time
      });
      return data;
    },
    onFocus() {
      if (!this.disabled) {
        this.$refs.fileInput.click();
      }
    },
    onFileChange($event) {
      this.target = $event.target || $event.dataTransfer;
      const { files } = this.target;
      // const form = this.getFormData(files);
      if (files) {
        if (files.length > 0) {
          this.filename = [...files].map((file) => file.name).join(', ');
        } else {
          this.filename = null;
        }
      } else {
        this.filename = $event.target.value.split('\\').pop();
      }
      this.$emit('input', this.filename);
      this.$emit('formData', files);
    },
  },
};
</script>

<style scoped>

input[type=file] {
  position: absolute;
  left: -99999px;
}

</style>

<style>
.upload-btn {
  max-width: 100%;
}

.upload-btn > div{
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
}

.upload-btn .v-icon {
  margin-right: 0.25em;
  vertical-align: bottom;
}
</style>
