
<template>
  <ion-grid>
    <ion-row align-items-center>
      <ion-col
        size-xs="12"
        offset-xs="0"
        size-sm="8"
        offset-sm="2"
        offset-md="4"
        size-md="4"
      >
        <slot/>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
export default {
  name: 'Centered',
};
</script>

<style scoped>
</style>
