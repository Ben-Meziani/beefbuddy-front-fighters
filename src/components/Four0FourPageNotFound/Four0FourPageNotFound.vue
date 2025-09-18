<template>
  <main style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      text-align: center;
    ">
    <!-- <img src="/src/assets/img/bagarreur.png" alt="Bagarreur perdu" style="max-width: 300px; margin-bottom: 2rem" /> -->
    <h1>404 - T'es perdu ?</h1>
    <p>
      On dirait que tu t'es pris un coup de poing et t'es tombé sur une page qui n'existe pas !<br />Retourne
      à l'arène pour continuer la bagarre.
    </p>
    <a href="/" @click.prevent="navigateToHome"
      style="margin-top: 2rem; font-weight: bold; color: #e63946; text-decoration: underline">Retour à l'accueil
    </a>
  </main>
</template>

<script setup lang="ts">
function navigateToHome(event: MouseEvent) {
  event.preventDefault()
  window.history.pushState({}, '', '/')
  window.location.reload()
}
</script>
