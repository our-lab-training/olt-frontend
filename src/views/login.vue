<template>
  <v-card class="loginCard">
    <v-card-title class="headline">
      Access 2.0 Login
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation @submit="submit">
        <v-text-field
          v-model="user.username"
          :rules="usernameRules"
          :counter="8"
          label="Pheme Number"
          required
          @keyup.enter="submit"
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
          @keyup.enter="submit"
        ></v-text-field>
        <v-btn
          :disabled="!user.username.trim() || !user.password.trim() || !valid"
          @click="submit"
        >
          Login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      valid: false,
      user: {
        username: '',
        password: '',
      },
      usernameRules: [
        v => !!v || 'Pheme number is required',
        v => /^\d{8}$/.test(v) || 'Pheme number must be 8 digits',
      ],
      passwordRules: [
        v => !!v.trim() || 'Password is required',
      ],
    };
  },
  methods: {
    ...mapActions('auth', { authenticate: 'authenticate' }),
    // ...mapActions('self', { findSelf: 'find' }),
    async submit() {
      if (this.$refs.form.validate()) {
        await this.authenticate({
          strategy: 'local',
          username: this.user.username,
          password: this.user.password,
        });
        // await this.findSelf();
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
}
</style>
