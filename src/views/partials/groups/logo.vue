<template>
  <div class="groupLogo">
    <img
      v-if="group.logo"
      :src="group.logo"
      alt=""
      :class="greyscale ? 'greyscale' : ''"
    >
    <v-icon v-else :color="color">{{group.icon}}</v-icon>
  </div>
</template>

<script>
export default {
  props: ['group', 'color', 'greyscale'],
};
</script>

<style scoped>

.groupLogo {
  display: inline;
}

img {
  height: 24px;
  vertical-align: text-bottom;
}

img.greyscale {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
  opacity: 0.70;
}

img.greyscale:hover {
  -webkit-filter: grayscale(0); /* Safari 6.0 - 9.0 */
  filter: grayscale(0);
  opacity: 1;
}

</style>

<style>
.v-list__group__header:hover img.greyscale {
  -webkit-filter: grayscale(0); /* Safari 6.0 - 9.0 */
  filter: grayscale(0);
  opacity: 1;
}
</style>
