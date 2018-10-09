<template>
  <div>
    <groups-list />
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex';
import groupsList from './partials/groups/list.vue';

export default {
  components: {
    groupsList,
  },
  data() {
    return {
      myLocations: [],
    };
  },
  methods: {
    // ...mapActions('locations', { findLocations: 'find' }),
    // ...mapGetters('self', { listSelf: 'list' }),
  },
  async mounted() {
    /* const self = await this.listSelf()[0];
    const myLocations = await this.findLocations({
      query: {
        // eslint-disable-next-line
        users: { $in: [self._id] },
      },
    });
    console.log(myLocations); */
  },
};
</script>
