<template>
  <span v-if="error" class="error--text">
    {{message}} <v-btn
      flat small
      :loading="isCreatePending"
      :disabled="isCreatePending || snackbar"
      @click="report"
    >Report Issue</v-btn>
    <v-snackbar
      v-model="snackbar"
      :color="success ? 'success' : 'error'"
      :timeout="6000"
    >
      {{ success
        ? 'Issue has been reported, thanks!'
        : 'Another error has occurred, please contact an administrator.'
      }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </span>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  props: {
    error: {
      type: Error,
      default: () => undefined,
    },
    data: {
      type: Object,
      default: () => undefined,
    },
    message: {
      type: String,
      default: 'An unknown error occured.',
    },
  },
  data() {
    return {
      snackbar: false,
      success: false,
    };
  },
  computed: {
    ...mapState('issues', ['isCreatePending']),
  },
  methods: {
    async report() {
      if (this.isCreatePending || this.snackbar) return;
      const { Issue } = this.$FeathersVuex;
      console.log(this.$route);
      try {
        const issue = new Issue({
          title: `${this.error.message} - ${moment().format('HH:mm DD/MM/YYYY')}`,
          labels: ['bug'],
          body: `
### Stacktrace
\`\`\`
${this.error.stack}
\`\`\`
### Route
\`\`\`json
${JSON.stringify({ ...this.$route, matched: undefined })}
\`\`\`
### Other Data
\`\`\`json
${JSON.stringify(this.data)}
\`\`\`
---
Agent: \`${window.navigator.userAgent}\`
Time: ${moment().format('HH:mm DD/MM/YYYY')}
`,
        });
        await issue.save();
        this.success = true;
      } catch (err) {
        console.error(err);
        this.success = false;
      }
      this.snackbar = true;
    },
  },
};
</script>
