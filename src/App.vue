<template>
  <div id="app">
    <div class="logo">
      <img alt="Vue logo" width="200px" src="./assets/swagger_logo.svg" />
    </div>
    <Index />
  </div>
</template>

<script>
import Index from "./components/Index";

export default {
  name: "app",
  components: { Index }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}
</style>
