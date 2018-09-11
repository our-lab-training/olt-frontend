<template>
  <div class="ion-page">
    <header-bar headerTitle="Test"></header-bar>
    <router-view/>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar.vue';

export default {
  components: {
    HeaderBar,
  },
};
</script>
