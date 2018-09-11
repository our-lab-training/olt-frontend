<template>
  <v-container fluid fill-height class='background'>
    <router-view/>
  </v-container>
</template>

<style scoped>
.background{
  background: linear-gradient(135deg, #1e5799 0%,#207cca 16%,#7db9e8 32%,
  #2989d8 57%,#5093c9 79%,#207cca 95%);
}
</style>
