<template>
<ion-grid>
  <ion-row>
    <ion-col>
      <ion-card class="loginCard">
        <ion-img src="https://via.placeholder.com/384x216"></ion-img>

        <ion-card-header>
          <ion-card-subtitle>Access 2.0</ion-card-subtitle>
          <ion-card-title>Login</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Username</ion-label>
            <ion-input></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input></ion-input>
          </ion-item>
          <br />
          <ion-button fill="solid" expand="full">Submit</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</ion-grid>
</template>

<style>
.loginCard {
  max-width: 320px;
  margin: 1rem auto;
}
</style>
