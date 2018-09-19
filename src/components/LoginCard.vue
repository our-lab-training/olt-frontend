<template>
  <centered>
    <ion-card>
      <ion-card-header>
          <ion-card-subtitle>Access 2.0</ion-card-subtitle>
          <ion-card-title>Login</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item>
          <ion-label position="stacked">PhemeID</ion-label>
          <ion-input type="number"
          v-bind:value = "user.internalId"
          v-on:ionChange = "user.internalId = $event.target.value"
          @keyup.enter="loginUser"
          required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Password</ion-label>
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
import app from '@/feathers-client';


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
      Object.values(this.user).forEach((element) => {
        if (element.length === 0) {
          result = false;
        }
      });
      return result;
    },
  },
  methods: {
    async loginUser() {
      if (this.valid) {
        await app.authenticate({
          strategy: 'pheme',
          username: this.user.internalId,
          password: this.user.password,
        }).then(() => {
          // Logged in
        }).catch((e) => {
          // Show login page (potentially with `e.message`)
          console.error('Authentication error', e);
        });
      }
    },
    ...mapActions('user', ['login']),
  },
};
</script>


<style>
.loginCard {
  max-width: 320px;
  margin: 1rem auto;
}
</style>
