<template>
  <v-app :dark="dark">

    <v-content>
      <router-view/>
    </v-content>

    <v-footer inset class="footer">
      <v-flex text-xs-center xs12>
        <span>
          <v-btn flat icon small @click="dark = !dark">
            <v-icon small>fal fa-{{darkIcon}}</v-icon>
          </v-btn>
        </span>
        <span>&copy; {{(new Date()).getFullYear()}} - Coded By <a
          class="th-link"
          href="https://thinkhub.io"
          :style="$vuetify.dark ? 'color: white;' : ''"
        >Think<b>Hub</b>.io</a></span>
        <report-dialog v-if="$store.state.auth.user" />
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import reportDialog from './views/partials/report-dialog.vue';

export default {
  components: {
    reportDialog,
  },
  data() {
    return {
      dark: false,
    };
  },
  computed: {
    darkIcon() {
      if (this.dark) return 'lightbulb-slash';
      else if ((new Date()).getMonth() === 11) return 'lights-holiday';
      return 'lightbulb-on';
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato:400,700');

.th-link {
  font-family: 'Lato', sans-serif;
  text-decoration: none;
  color: black;
}

.th-link:hover {
  text-decoration: underline;
}

.footer >>> .v-btn {
  margin: 0 8px;
}
</style>
