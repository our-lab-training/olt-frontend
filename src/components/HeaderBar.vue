<template>
<ion-header>
  <ion-toolbar>
    <ion-title>{{ headerTitle }}</ion-title>
  </ion-toolbar>
</ion-header>
</template>

<script>
export default {
  props: [
    'headerTitle',
  ],
};
</script>
