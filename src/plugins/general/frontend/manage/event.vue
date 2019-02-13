<template>
  <v-container grid-list-md>
    <v-layout v-if="item" row wrap>
      <v-flex v-if="err" xs12>
        <report-error :error="err" />
      </v-flex>
      <v-flex xs12>
        <v-text-field
          label="Name"
          v-model="item.name"
          :disabled="isPatchPending"
          :loading="isPatchPending"
          @change="save"
        />
      </v-flex>
      <v-flex>
        <h3>Triggers</h3>
        <small>What triggers the event to occur (either)</small>
      </v-flex>
      <v-spacer/>
      <v-btn
        flat color="primary"
        @click.stop="trigger={eventType:'',matchPerm:[]};trigDialog=true;"
      >
        <v-icon left>fal fa-plus</v-icon>
        Add Trigger
      </v-btn>
      <v-flex xs12 two-line>
        <v-list v-for="(trig, i) in item.matches" :key="i">
          <v-list-tile @click.stop="">
            <v-list-tile-content @click="trigger=trig;trigIndex=i;trigDialog=true;">
              <v-list-tile-title>
                {{triggerTypes.find(t => t.value === trig.eventType).text}}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{perms.find(p => p.value === trig.matchPerm.join('.')).text}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu offset-y>
                <v-btn flat icon small slot="activator"><v-icon small>fal fa-times</v-icon></v-btn>
                <v-list>
                  <v-list-tile @click.stop="item.matches.splice(i, 1); save();">
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
      <v-btn flat color="primary">
        <v-icon left>fal fa-plus</v-icon>
        Add Action
      </v-btn>
      <v-flex xs12>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>action name</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu offset-y>
                <v-btn flat icon small slot="activator"><v-icon small>fal fa-times</v-icon></v-btn>
                <v-list>
                  <v-list-tile @click.stop="">
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
          <span class="headline">{{typeof trigIndex !== 'number' ? 'New' : 'Edit'}} Trigger</span>
        </v-card-title>
        <v-card-text>
          <report-error :error="err" />
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  label="Type of Trigger"
                  required
                  :items="triggerTypes"
                  v-model="trigger.eventType"
                />
              </v-flex>
              <v-flex xs12 v-if="trigger.eventType && trigger.eventType.indexOf('perm') !== -1">
                <v-select
                  label="Permission"
                  required
                  :items="perms"
                  :value="trigger.matchPerm.join('.')"
                  @input="trigger.matchPerm = $event.split('.')"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat
            @click.stop="trigDialog = false; trigIndex = undefined; trigger = {};"
          >Close</v-btn>
          <v-btn
            flat color="success"
            @click.stop="saveTrig"
            :disabled="!trigValid || isPatchPending"
            :loading="isPatchPending"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import isEqual from 'lodash/isEqual';
import reportError from '@/views/partials/report-error.vue';

export default {
  components: {
    reportError,
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
      trigger: {},
      trigDialog: false,
      trigIndex: undefined,
      userRoles: [],
      itemPerms: [],
      loadingRoles: false,
      loadingPerms: false,
      err: undefined,
      item: null,
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('groups', { currentGroup: 'current' }),
    ...mapGetters('events', { eventsGet: 'get' }),
    ...mapGetters('roles', { rolesGet: 'get', rolesFind: 'find' }),
    ...mapGetters('perms', { permsFind: 'find' }),
    ...mapState('events', ['isPatchPending']),
    perms() { return this.$perms(this.currentGroup._id); },
    trigValid() {
      return !!(
        this.triggerTypes.find(t => t.value === this.trigger.eventType)
        && (
          this.trigger.eventType.indexOf('perm') === -1
          || this.perms.find(p => p.value === this.trigger.matchPerm.join('.'))
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
      if (typeof this.trigIndex !== 'number') this.item.matches.push(this.trigger);
      await this.save();
      if (!this.err) {
        this.trigger = {};
        this.trigIndex = undefined;
        this.trigDialog = false;
      }
    },
    async save() {
      if (!this.current) return;
      this.err = undefined;
      const item = this.eventsGet(this.current);
      if (
        item.name === this.item.name
        && isEqual(item.matches, this.item.matches)
        && isEqual(item.actions, this.item.actions)
      ) return;
      try {
        await this.item.save();
      } catch (err) {
        console.error(err);
        this.err = err;
      }
    },
  },
};
</script>
