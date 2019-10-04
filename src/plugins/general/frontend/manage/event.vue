<template>
  <v-container grid-list-md>
    <v-layout v-if="item" row wrap>
      <v-flex v-if="err" xs12>
        <report-error :error="err" />
      </v-flex>
      <v-flex expand>
        <v-text-field
          label="Name"
          v-model="item.name"
          :disabled="loading"
          :loading="loading"
          @change="save"
        />
      </v-flex>
      <v-flex shrink>
        <v-menu offset-y>
          <v-btn flat icon slot="activator" :loading="isRemovePending">
            <v-icon>fal fa-trash</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="del()">
              <v-list-tile-title class="error--text">
                <v-icon color="error" left>fas fa-exclamation-triangle</v-icon>
                Delete Forever
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout v-if="item" row wrap>
      <v-flex>
        <h3>Triggers</h3>
        <small>What triggers the event to occur (either)</small>
      </v-flex>
      <v-spacer/>
      <v-btn
        flat color="primary"
        @click.stop="trigger={triggerType:'',perm:[]};trigDialog=true;"
        :disabled="loading"
        :loading="loading"
      >
        <v-icon left>fal fa-plus</v-icon>
        Add Trigger
      </v-btn>
      <v-flex xs12 two-line>
        <v-list two-line dense>
          <v-list-tile v-for="(trig, i) in item.triggers" :key="i" @click.stop="">
            <v-list-tile-content @click="trigger=trig;trigDialog=true;">
              <v-list-tile-title>
                {{triggerTypes.find(t => t.value === trig.triggerType).text}}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{perms.find(p => p.value === trig.perm.join('.')).text}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu offset-y>
                <v-btn flat icon small slot="activator"><v-icon small>fal fa-times</v-icon></v-btn>
                <v-list>
                  <v-list-tile @click.stop="item.triggers.splice(i, 1); save();">
                    <v-list-tile-title class="error--text">
                      <v-icon color="error" left>fal fa-trash</v-icon>
                      Remove
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider/>
        </v-list>
      </v-flex>
      <v-flex>
        <h3>Actions</h3>
        <small>What happens when the event occurs</small>
      </v-flex>
      <v-spacer/>
      <v-btn
        flat color="primary"
        @click.stop="action={actionType:'',perm:[]};actDialog=true;"
        :disabled="loading"
        :loading="loading"
      >
        <v-icon left>fal fa-plus</v-icon>
        Add Action
      </v-btn>
      <v-flex xs12>
        <v-list two-line dense>
          <v-list-tile v-for="(act, i) in item.actions" :key="i" @click.stop="">
            <v-list-tile-content  @click="action=act;actDialog=true;">
              <v-list-tile-title>
                {{actionTypes.find(t => t.value === act.actionType).text}}
              </v-list-tile-title>
              <v-list-tile-sub-title v-if="act.actionType.indexOf('perm') !== -1">
                {{perms.find(p => p.value === act.perm.join('.')).text}}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="act.actionType === 'notify'">
                {{ntGet(act.ntId).subject}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu offset-y>
                <v-btn flat icon small slot="activator"><v-icon small>fal fa-times</v-icon></v-btn>
                <v-list>
                  <v-list-tile @click.stop="item.actions.splice(i, 1);save();">
                    <v-list-tile-title class="error--text">
                      <v-icon color="error" left>fal fa-trash</v-icon>
                      Remove
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider/>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <h1 class="text-capitalize text-xs-center">please select an event.</h1>
      </v-flex>
    </v-layout>
    <v-dialog v-model="trigDialog" persistent max-width="300px">
      <v-card>
        <v-card-title>
          <span class="headline">{{trigger._id ? 'Edit' : 'New'}} Trigger</span>
        </v-card-title>
        <report-error :error="err" />
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-select
                label="Type of Trigger"
                :items="triggerTypes"
                v-model="trigger.triggerType"
              />
            </v-flex>
            <v-flex xs12 v-if="trigger.triggerType && trigger.triggerType.indexOf('perm') !== -1">
              <v-select
                label="Permission"
                :items="perms"
                :value="trigger.perm.join('.')"
                @input="trigger.perm = $event.split('.')"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat
            @click.stop="trigDialog = false; trigger = {};"
            :disabled="loading"
            :loading="loading"
            v-text="'Close'"
          />
          <v-btn
            flat color="success"
            @click.stop="saveTrig"
            :disabled="!trigValid || loading"
            :loading="loading"
            v-text="'Save'"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="actDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{!action._id ? 'New' : 'Edit'}} Action</span>
        </v-card-title>
        <report-error :error="err" />
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-select
                label="Type of Action"
                :items="actionTypes"
                v-model="action.actionType"
              />
            </v-flex>
            <v-flex xs12 v-if="action.actionType && action.actionType.indexOf('perm') !== -1">
              <v-select
                label="Permission"
                :items="perms.filter(p => !p.readonly)"
                :value="action.perm.join('.')"
                @input="action.perm = $event.split('.')"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <edit-template
          ref="nt" :id="action.ntId"
          v-if="action.actionType === 'notify'"
          :valid.sync="notifyValid"
        />
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat
            @click.stop="actDialog = false; action = {};"
            :disabled="loading"
            :loading="loading"
            v-text="'Close'"
          />
          <v-btn
            flat color="success"
            @click.stop="saveAct"
            :disabled="!actValid || loading"
            :loading="loading"
            v-text="'Save'"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import isEqual from 'lodash/isEqual';
import reportError from '@/views/partials/report-error.vue';
import editTemplate from '../notify-templates/edit.vue';

export default {
  components: {
    reportError,
    editTemplate,
  },
  props: {
    current: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      triggerTypes: [
        { text: 'User Permission Added', value: 'perm-create' },
        { text: 'User Permission Removed', value: 'perm-remove' },
      ],
      actionTypes: [
        { text: 'Send Notification', value: 'notify' },
        { text: 'Give User Permission', value: 'perm-create' },
        { text: 'Remove User Permission', value: 'perm-remove' },
      ],
      trigger: {},
      action: {},
      trigDialog: false,
      actDialog: false,
      notifyValid: false,
      err: null,
      item: null,
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('events', { eventsGet: 'get' }),
    ...mapGetters('notify-templates', { ntGet: 'get', ntFind: 'find' }),
    ...mapGetters('perms', { permsFind: 'find' }),
    ...mapState('events', ['isPatchPending', 'isRemovePending']),
    ...mapState('notify-templates', ['ntIsPatchPending', 'ntIsCreatePending']),
    perms() { return this.$perms(this.currentGroup._id); },
    loading() { return this.isPatchPending || this.ntIsPatchPending || this.ntIsCreatePending; },
    trigValid() {
      return !!(
        this.triggerTypes.find(t => t.value === this.trigger.triggerType)
        && (
          this.trigger.triggerType.indexOf('perm') === -1
          || this.perms.find(p => p.value === this.trigger.perm.join('.'))
        )
      );
    },
    actValid() {
      return !!(
        this.actionTypes.find(t => t.value === this.action.actionType)
        && (
          this.action.actionType.indexOf('perm') === -1
          || this.perms.find(p => p.value === this.action.perm.join('.'))
        ) && (
          this.action.actionType !== 'notify'
          || this.notifyValid
        )
      );
    },
  },
  watch: {
    current() {
      if (!this.current) return;
      const item = this.eventsGet(this.current);
      if (!item) return;
      this.item = (new this.$FeathersVuex.Event(item)).clone();
    },
  },
  methods: {
    async saveTrig() {
      if (!this.trigger._id) this.item.triggers.push(this.trigger);
      await this.save();
      if (!this.err) {
        this.trigger = {};
        this.trigDialog = false;
      }
    },
    async saveAct() {
      this.err = null;
      if (this.action.actionType === 'notify') {
        try {
          this.action.ntId = await this.$refs.nt.save();
        } catch (err) {
          console.error(err);
          this.err = err;
        }
      }
      if (!this.action._id) this.item.actions.push(this.action);
      await this.save();
      if (!this.err) {
        this.action = {};
        this.actDialog = false;
      }
    },
    async save() {
      if (!this.current) return;
      this.err = null;
      let item = this.eventsGet(this.current);
      if (
        item.name === this.item.name
        && isEqual(item.triggers, this.item.triggers)
        && isEqual(item.actions, this.item.actions)
      ) return;
      try {
        await this.item.save();
        item = this.eventsGet(this.current);
        if (!item) return;
        this.item = (new this.$FeathersVuex.Event(item)).clone();
      } catch (err) {
        console.error(err);
        this.err = err;
      }
    },
    async del() {
      await this.item.remove();
      this.item = undefined;
    },
  },
};
</script>
