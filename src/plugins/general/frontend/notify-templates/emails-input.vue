<template>
  <v-combobox
    v-model="emails"
    :items="users"
    :search-input.sync="search"
    hide-selected
    multiple
    small-chips deletable-chips
    :full-width="fullWidth"
    :single-line="singleLine"
    :hide-details="hideDetails"
    :label="label"
    :prefix="prefix"
    :hint="hint"
    :persistent-hint="persistentHint"
    :rules="[validate]"
    :filter="(item, v) => searchReg.test(item.text) || searchReg.test(item.value)"
  >
    <template slot="no-data">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>
            No results for "<strong>{{ search }}</strong>".
            Press <kbd>enter</kbd> to create.
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    <template
      slot="item"
      slot-scope="{ index, item }"
    >
      <v-list-tile-content>
        <v-list-tile-title v-html="highlight(item.text)" />
        <v-list-tile-sub-title v-html="highlight(item.value)" />
      </v-list-tile-content>
    </template>
    <template
      slot="selection"
      slot-scope="{ item, parent, selected }"
    >
      <v-tooltip top>
        <v-chip
          slot="activator"
          small
          :selected="selected"
          :color="test(item) ? 'default' : 'error'"
          :dark="test(item) ? undefined : true"
        >
          <span>{{item.text || item}}</span>
          <v-icon right small @click="parent.selectItem(item)" style="margin-left: 6px;">
            {{$vuetify.icons.clear}}
          </v-icon>
        </v-chip>
        <span>{{item.value || item}}</span>
      </v-tooltip>
    </template>
  </v-combobox>
</template>

<script>
import { mapGetters } from 'vuex';

const tagsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHTML = v => v.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);

export default {
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    prefix: { type: String, default: '' },
    hint: { type: String, default: '' },
    fullWidth: { type: Boolean, default: false },
    singleLine: { type: Boolean, default: false },
    hideDetails: { type: Boolean, default: false },
    persistentHint: { type: Boolean, default: false },
  },
  data() {
    return {
      emails: [],
      search: '',
    };
  },
  computed: {
    ...mapGetters('users', { findUsers: 'find' }),
    users() { return this.findUsers().data.map(u => ({ text: u.name, value: u.email })); },
    searchReg() {
      const query = (this.search || '')
        .trim()
        .replace(/[^\w- @.]/g, '')
        .replace(/\./g, '\\.');
      return RegExp(`(${query.replace(/\s/g, ')|(')})`, 'ig');
    },
  },
  methods: {
    test(v) { return /^.*@.*\..*$/.test(v.value || v); },
    validate(emails) {
      const valid = emails.map(this.test).indexOf(false) === -1;
      this.$emit('update:valid', valid);
      return valid || 'Invalid Email';
    },
    highlight(v) { return escapeHTML(v).replace(this.searchReg, h => `<span class="v-list__tile__mask">${h}</span>`); },
    loadEmails() {
      this.emails = this.value
        .split(', ')
        .filter(v => v)
        .map(v => this.users.find(u => u.value === v) || v);
    },
  },
  mounted() {
    this.loadEmails();
  },
  watch: {
    value() { this.loadEmails(); },
    emails() {
      const list = this.emails.map(v => v.value || v).join(', ');
      if (list !== this.value) this.$emit('input', list);
    },
  },
};
</script>
