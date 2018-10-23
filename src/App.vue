<template>
  <v-app>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app absolute>
      <v-flex text-xs-center>
        <span>&copy; 2018 - Coded By <a class="th-link" href="https://thinkhub.io">Think<b>Hub</b>.io</a></span>
      </v-flex>
    </v-footer>
  </v-app>
</template>

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
</style>
