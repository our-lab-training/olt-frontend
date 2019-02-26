<template>
  <span v-if="error">
    <v-btn
      flat
      @click="dialog = true"
      small
    >
      <v-icon left small>fal fa-bullhorn</v-icon>
      Feedback
    </v-btn>
    <v-snackbar
      v-model="snackbar"
      :color="success ? 'success' : 'error'"
      :timeout="6000"
    >
      {{ success
        ? 'Bug has been reported, thanks!'
        : 'Another error has occurred, please contact an administrator.'
      }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"><v-icon left>fal fa-bullhorn</v-icon> Provide Feedback</span>
          <!-- <br><br>
          <span>
            Please note: This is only feedback for the COEUS software, not your marks/grades.
            If you need feedback for your marks/grades, please speak to your unit coordinator.
          </span> -->
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    label="What is the type of feedback?"
                    :items="types"
                    v-model="error.type"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="What is the title of the feedback?"
                    hint="A clear and concise summary"
                    v-model="error.title"
                    :counter="256"
                    :rules="[
                      v => /.+/.test(v) || 'Title is required.',
                      v => /^.{1,256}$/.test(v) || 'Cannot be longer than 256 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
                <v-flex xs12 v-if="error.type === 'bug'">
                  <v-text-field
                    label="What are you trying to do?"
                    hint="I was on this page, trying to do this activity."
                    v-model="error.action"
                    :counter="256"
                    :rules="[
                      v => /.+/.test(v) || 'Action is required.',
                      v => /^.{1,256}$/.test(v) || 'Cannot be longer than 256 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
                <v-flex xs12 v-if="error.type === 'bug'">
                  <v-text-field
                    label="What result did you expect to happen?"
                    hint="The activity submitted successfully after doing x."
                    v-model="error.expected"
                    :counter="256"
                    :rules="[
                      v => /.+/.test(v) || 'Expected result is required.',
                      v => /^.{1,256}$/.test(v) || 'Cannot be longer than 256 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
                <v-flex xs12 v-if="error.type === 'bug'">
                  <v-text-field
                    label="What result actually happened?"
                    hint="The submit butten froze while loading, no error was shown."
                    v-model="error.actual"
                    :counter="256"
                    :rules="[
                      v => /.+/.test(v) || 'Actual result is required.',
                      v => /^.{1,256}$/.test(v) || 'Cannot be longer than 256 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
                <v-flex xs12 v-if="error.type === 'bug'">
                  <v-textarea
                    label="Is there any other useful information we should know?"
                    hint="I only tried changing A, B and C.
  Jane was able to submit successfully."
                    v-model="error.other"
                    :counter="3072"
                    :rules="[
                      v => /^.{0,3072}$/.test(v) || 'Cannot be longer than 3072 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
                <v-flex xs12 v-if="error.type !== 'bug'">
                  <v-textarea
                    label="What is the feedback?"
                    hint="Please provide details/examples and be clear and concise."
                    v-model="error.other"
                    :counter="4096"
                    :rules="[
                      v => /.+/.test(v) || 'Massage is required.',
                      v => /^.{1,4069}$/.test(v) || 'Cannot be longer than 4069 characters long.',
                    ]"
                    validate-on-blur
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn
            color="success" flat
            @click.native="report"
            :loading="isCreatePending"
            :disabled="isCreatePending || snackbar"
          >Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      snackbar: false,
      success: false,
      dialog: false,
      error: {
        type: 'bug',
        title: '',
        action: '',
        expected: '',
        actual: '',
        other: '',
      },
      types: [
        { text: 'Issue/Bug', value: 'bug' },
        { text: 'Something isn\'t Working Right', value: 'invalid' },
        { text: 'Suggestion/Improvement', value: 'enhancement' },
      ],
    };
  },
  computed: {
    ...mapState('issues', ['isCreatePending']),
  },
  methods: {
    async report() {
      console.log(this.$refs.form.validate());
      if (!this.$refs.form.validate() || this.isCreatePending || this.snackbar) return;
      const { Issue } = this.$FeathersVuex;
      const issue = new Issue({
        title: `${this.error.title} - ${moment().format('HH:mm DD/MM/YYYY')}`,
        labels: [this.error.type],
        body: this.error.type === 'bug' ? `
### What are you trying to do?
${this.error.action}

### What result did you expect to happen?
${this.error.expected}

### What result actually happened?
${this.error.actual}

### Other Useful Information?
${this.error.other}

---
Agent: \`${window.navigator.userAgent}\`
Time: ${moment().format('HH:mm DD/MM/YYYY')}
` : this.error.other,
      });
      try {
        await issue.save();
        this.success = true;
        this.dialog = false;
        this.error = {
          type: 'bug',
          title: '',
          action: '',
          expected: '',
          actual: '',
          other: '',
        };
      } catch (err) {
        console.error(err);
        this.success = false;
      }
      this.snackbar = true;
    },
  },
};
</script>
