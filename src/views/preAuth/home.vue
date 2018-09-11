<template>
  <div class="ion-page">
    <header-bar headerType="login" headerTitle="Login" />
    <ion-content padded>
      <login-card />
    </ion-content>
    <router-view/>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar.vue';
import LoginCard from '@/components/LoginCard.vue';

export default {
  components: {
    HeaderBar,
    LoginCard,
  },
};
</script>
