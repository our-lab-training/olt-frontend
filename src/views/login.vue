<template>
  <v-card class="loginCard">
    <v-card-title class="headline">
      <img alt="" :src="logo">
      Our Lab Training Login
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation @submit="submit">
        <span class="error--text">{{loginError || '&nbsp;'}}</span>
        <v-text-field
          v-model="user.username"
          :rules="usernameRules"
          :counter="8"
          label="Pheme Number"
          required
          @keyup.enter="submit"
          validate-on-blur
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
          @keyup.enter="submit"
          validate-on-blur
        ></v-text-field>
        <v-btn
          :disabled="!/^\d{8}$/.test(user.username) || !user.password.trim()"
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
      logo: `${process.env.BASE_URL}img/icons/icon-192x192.png`,
      loginError: '',
      user: {
        username: '',
        password: '',
      },
      usernameRules: [
        (v) => !!v || 'Pheme number is required',
        (v) => /^\d{8}$/.test(v) || 'Pheme number must be 8 digits',
      ],
      passwordRules: [
        (v) => !!v.trim() || 'Password is required',
      ],
    };
  },
  methods: {
    ...mapActions('auth', { authenticate: 'authenticate' }),
    async submit() {
      if (this.$refs.form.validate()) {
        const { query } = this.$router.currentRoute;
        try {
          await this.authenticate({
            strategy: 'local',
            username: this.user.username,
            password: this.user.password,
          });
          this.user.password = '';
          this.$router.push((query && query.followPath) || '/dashboard');
        } catch (err) {
          this.user.password = '';
          this.loginError = err.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.loginCard {
  max-width: 320px;
  margin: 1rem auto;
}

.loginCard img {
  height: 2em;
  padding-right: 0.5em;
}

.loginCard .headline {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-bottom: 0;
}
</style>
