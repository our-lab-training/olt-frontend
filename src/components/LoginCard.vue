<template>
  <centered>
    <ion-card class="loginCard">
      <ion-card-header>
          <ion-card-subtitle>Access 2.0</ion-card-subtitle>
          <ion-card-title>Login</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="stacked">PhemeID (Exactly 8 Digits)</ion-label>
          <ion-input type="text"
          v-bind:value = "user.internalId"
          v-on:ionChange = "user.internalId = $event.target.value"
          @keyup.enter="loginUser"
          required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Password (Minimum of 6 Characters)</ion-label>
          <ion-input type="password"
          v-bind:value = "user.password"
          v-on:ionChange = "user.password = $event.target.value"
          @keyup.enter="loginUser"
          required></ion-input>
        </ion-item>
        <ion-item>
           <ion-button
            slot="start"
            color="secondary"
            size="default"
            fill="outline"
            @click="$router.push('/')"
          >
            Back
          </ion-button>
          <ion-button
            slot="end"
            color="primary"
            size="default"
            :disabled="!valid"
            @click="loginUser"
          >
            Submit
          </ion-button>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </centered>
</template>

<script>
import { mapActions } from 'vuex';

import Centered from '@/components/General/Centered.vue';

export default {
  components: {
    Centered,
  },
  data() {
    return {
      user: {
        internalId: '',
        password: '',
      },
    };
  },
  computed: {
    valid() {
      let result = true;
      if (this.user.password.length < 6 || this.user.internalId.length !== 8) {
        result = false;
      }
      if (!/^\d+$/.test(this.user.internalId)) {
        result = false;
      }
      return result;
    },
  },
  methods: {
    ...mapActions('auth', { authenticate: 'authenticate' }),
    ...mapActions('self', { findSelf: 'find' }),
    async loginUser() {
      if (this.valid) {
        await this.authenticate({
          strategy: 'pheme',
          username: this.user.internalId,
          password: this.user.password,
        });
        await this.findSelf();
        this.$router.push('/dashboard');
      }
    },
  },
};
</script>

<style>
.loginCard {
  max-width: 320px;
  margin: 1rem auto;
  background: #e8fcfe;
}
</style>
