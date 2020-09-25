<template>
  <v-form class="notify-template-edit">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-switch
            label="Group users and send one notification?"
            v-model="template.groupUsers"
            hide-details
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-select
            :items="freqs"
            label="Sending frequency"
            v-model="template.sendOn"
          />
        </v-flex>
        <v-flex xs12 md6 v-if="template.sendOn === 'weekly'">
          <v-select
            :items="days"
            label="Days to send on"
            v-model="template.sendOnDay"
            multiple
          />
        </v-flex>
        <v-flex xs12 md6 v-if="template.sendOn === 'weekly'">
          <v-select
            :items="
              ' '.repeat(23).split(' ').map((v, i) => ({
                text: `${(i % 12) + 1} ${i/11 < 1 || i == 23 ? 'a' : 'p'}m`,
                value: (i + 1) % 24,
              }))
            "
            label="Hour to send on"
            v-model="template.sendOnHour"
          />
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-title>
      <span class="title">Message</span>
      <v-spacer/>
      <v-flex shrink>
        <v-switch
          :label="`Send notification to the user${template.groupUsers ? 's' : ''}?`"
          v-model="template.sendToUsers"
          hide-details
        />
      </v-flex>
    </v-card-title>
    <v-divider/>
    <emails-input
      v-model="template.to"
      prefix="to:"
      full-width single-line hide-details
      :valid.sync="toValid"
    />
    <v-divider/>
    <emails-input
      v-model="template.cc"
      prefix="cc:"
      full-width single-line hide-details
      :valid.sync="ccValid"
    />
    <v-divider/>
    <emails-input
      v-model="template.bcc"
      prefix="bcc:"
      full-width single-line hide-details
      :valid.sync="bccValid"
    />
    <v-divider/>
    <v-text-field
      prefix="subject:"
      full-width single-line hide-details
      :rules="[v => /^.{1,256}$/.test(v) || 'subject too long or too short']"
      v-model="template.subject"
    />
    <v-divider/>
    <v-textarea
      placeholder="message"
      full-width
      :counter="4096"
      v-model="template.text"
    />
    <md-info />
    <v-divider/>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex';
import emailsInput from './emails-input.vue';
import mdInfo from './info.vue';

export default {
  components: {
    emailsInput,
    mdInfo,
  },
  props: {
    id: { type: String, default: undefined },
  },
  data() {
    return {
      template: {},
      freqs: [
        { value: 'instant', text: 'Instantly (ish)' },
        { value: 'weekly', text: 'Weekly' },
      ],
      days: [
        { text: 'Sunday', value: 0 },
        { text: 'Monday', value: 1 },
        { text: 'Tuesday', value: 2 },
        { text: 'Wednesday', value: 3 },
        { text: 'Thursday', value: 4 },
        { text: 'Friday', value: 5 },
        { text: 'Satday', value: 6 },
      ],
      toValid: true,
      ccValid: true,
      bccValid: true,
    };
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('notify-templates', { ntGet: 'get' }),
    valid() {
      return this.toValid && this.ccValid && this.bccValid
        && this.template.sendOn
        && (this.template.sendToUsers || this.template.to)
        && (
          this.template.sendOn !== 'weekly'
          || (this.template.sendOnDay.length && typeof this.template.sendOnHour === 'number')
        ) && /^.{1,256}$/.test(this.template.subject)
        && /^.{1,4096}$/s.test(this.template.text);
    },
  },
  methods: {
    loadTemp() {
      const { NotifyTemplate } = this.$FeathersVuex;
      if (this.id) this.template = (new NotifyTemplate(this.ntGet(this.id))).clone();
      else this.template = new NotifyTemplate({ groupId: this.currentGroup._id });
    },
    async save() {
      this.template = await this.template.save();
      return this.template._id;
    },
  },
  mounted() { this.loadTemp(); },
  watch: {
    id() { this.loadTemp(); },
    valid(v) { this.$emit('update:valid', v); },
  },
};
</script>

<style>
.notify-template-edit .v-input--selection-controls {
  margin-top: 0;
}
</style>
