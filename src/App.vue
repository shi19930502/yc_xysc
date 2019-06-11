<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>
<script>
export default {
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },
}

</script>
<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
	/*font-family: 'PingFang-SC-Medium';*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2F3927;
  height: 100%;
  font-size: 0.24rem;
}

</style>
