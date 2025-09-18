<template>
<main>
    <!-- <TheWelcome /> -->
    <AppLayout />
</main>
</template>
<script setup lang="ts">
import AppLayout from './components/layouts/AppLayout.vue'
</script>

<!-- <style scoped src="./App.css" /> -->
 <style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
main {
  min-height: 100vh;
  /* width: 100vw; */
  /* padding: 2rem;
    background-color: #f0f0f0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif; */
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
