<template>
  <v-container fluid fill-height="" class='background'>
  </v-container>
</template>

<script>
export default {
  mounted() {
    const self = this;
    self.$nextTick(() => {

    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.background{
  background: linear-gradient(
    135deg, rgba(70,159,236,1) 0%, rgba(93,195,239,1) 36%,
    rgba(92,140,237,1) 68%, rgba(30,153,230,1) 100%);
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
