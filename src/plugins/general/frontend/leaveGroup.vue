<template>
  <v-card>
        <v-card-title class="headline" v-text="entry.name"></v-card-title>

        <v-card-text>
          Are you sure?
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
            color="error"
            flat="flat"
            @click="$emit('close')"
          >
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
export default {
  props: ['entry'],
  data() {
    return {};
  },
  updated() {
    this.$emit('setWidth', 300);
  },
};
</script>

