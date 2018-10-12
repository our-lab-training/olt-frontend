<template>
  <div class="groups-module-icon subheader text-xs-center">
      <v-badge overlap color="orange" :value="!!notify || notify === ''">
        <v-icon slot="badge" dark small>notifications</v-icon>

        <v-btn outline large fab color="indigo" style="margin: 0;">
          <v-icon v-text="icon"></v-icon>
        </v-btn>

      </v-badge>
      <span v-text="title"></span>
  </div>
</template>
<script>
export default {
  props: ['title', 'icon', 'notify', 'link'],
};
</script>

<style scoped>
.groups-module-icon {
  max-width: 72px;
  margin: 0 12px;
}
</style>

