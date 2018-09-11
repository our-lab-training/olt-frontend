<template>
<ion-header v-if="headerType === 'login'">
  <ion-toolbar>
    <ion-title>{{ headerTitle }}</ion-title>
    <ion-buttons slot="primary">
      <ion-button fill="solid" color="primary">
        Training
        <ion-icon slot="end" name="book"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-header v-else-if="headerType === 'dashboard'">
  <ion-toolbar>
    <ion-title>{{ headerTitle }}</ion-title>
  </ion-toolbar>
</ion-header>
</template>

<script>
export default {
  props: [
    'headerType',
    'headerTitle',
  ],
};
</script>
