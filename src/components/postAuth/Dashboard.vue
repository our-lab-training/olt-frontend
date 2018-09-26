<template>
  <div>
    <header-bar/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import HeaderBar from '../HeaderBar.vue';

export default {
  data() {
    return {
      myLocations: [],
    };
  },
  components: {
    HeaderBar,
  },
  methods: {
    ...mapActions('locations', { findLocations: 'find' }),
    ...mapGetters('self', { listSelf: 'list' }),
  },
  async mounted() {
    const self = await this.listSelf()[0];
    const myLocations = await this.findLocations({
      query: {
        // eslint-disable-next-line
        users: { $in: [self._id] },
      },
    });
    console.log(myLocations);
  },
};
</script>
