<template>
  <div class="ion-page">
    <div class="background-image"></div>

    <ion-content class="clear-background">
      <transition :name="transitionName">
        <router-view/>
      </transition>
    </ion-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transitionName: '',
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      this.routeName = this.$router.currentRoute;
    },
  },
};
</script>

<style scoped>
.background-filter {
  position: fixed;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.69);
}
.background-image {
  position: fixed;
  height: 100vh;
  width: 100%;
  background: linear-gradient(
    135deg, #1e5799 0%,#207cca 21%,#284dd3 43%,#2989d8 55%,#207cca 74%,#207cca 74%,#7db9e8 100%
    );
}
ion-content {
  text-align: center;
  color: #ffffff;
}
ion-content .hero {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
</style>
