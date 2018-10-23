<template>
  <v-card>
        <v-card-title class="headline" v-text="entry.name"></v-card-title>

        <v-card-text>
          Are you sure you wish to join {{currentGroup.name}}?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            flat="flat"
            @click="$emit('close')"
          >
            Close
          </v-btn>
          <v-btn
            color="success"
            flat="flat"
            @click="$emit('close')"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['entry'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters('groups', { currentGroup: 'current' }),
  },
  mounted() {
    this.$emit('setWidth', 300);
  },
};
</script>

