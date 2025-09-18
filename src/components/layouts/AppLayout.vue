<template>
<div class="layout">
  <header>
    <Disclosure as="nav" class="bg-transparent" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          <!-- Logo -->
          <div class="flex items-center">
            <!-- <img class="h-24 w-auto" src="/img/BeefBuddyLogo.png" alt="BeefBuddy Logo" /> -->
          </div>

          <!-- Desktop navigation -->
          <div class="hidden sm:flex sm:space-x-4">
            <RouterLink :class="[active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" to="/">Accueil</RouterLink>
            <RouterLink :class="[active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" v-if="user == 'guest'" to="/login">Se connecter</RouterLink>
            <RouterLink :class="[active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" v-if="user == 'guest'" to="/register">Créer un compte</RouterLink>
            <RouterLink :class="[active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" v-if="user != 'guest'" to="/profile">Mon profil</RouterLink>
          </div>

            <!-- Right side -->
            <div class="flex items-center space-x-4">
            <!-- Fighter interface link -->
            <a
            :href="userInterfaceUrl"
            target="_blank"
            class="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            Interface utilisateur
          </a>
              <!-- Notification button -->
            <button
              type="button"
              class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">Voir les notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <div>
                <MenuButton class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="sr-only">Ouvrir le menu utilisateur</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...&q=80"
                    alt=""
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem v-slot="{ active }" v-if="user == 'guest'">
                    <RouterLink :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']" 
                      to="/login"> 
                      <span class="text-orange-500">Se connecter</span>
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-if="user != 'guest'">
                    <RouterLink :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']" 
                      to="/profile"> 
                      <span class="text-orange-500">Mon profil</span>
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-if="user != 'guest'">
                    <a @click.prevent="Logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']" href="#"><span class="text-orange-500">Se déconnecter</span></a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-else>
                    <RouterLink :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']" 
                      to="/register"> 
                      <span class="text-orange-500">Créer un compte</span>
                    </RouterLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Mobile menu button -->
          <div class="sm:hidden">
            <DisclosureButton
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            > 
              <span class="sr-only">Ouvrir le menu principal</span>
              <component :is="open ? XMarkIcon : Bars3Icon" class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <!-- Mobile navigation panel -->
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton
            v-for="item in navigation"
            :key="item.name"
            as="a"
            :href="item.href"
            @click="(event) => navigate(event, item.href)"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium'
            ]"
            :aria-current="item.current ? 'page' : undefined"
          >
            {{ item.name }}
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </header>
      <RouterView />
    <footer>
      <p>© BeefBuddy {{ new Date().getFullYear() }} - Réserve ton sparring</p>
    </footer>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getXsrfToken, setUserId, clearAuthData, isValidToken } from '@/utils/auth'
import { validateServerResponse } from '@/utils/security'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import ApiService from '@/services/ApiService'
// import ApiService from '@/services/ApiService'

const currentPath = ref(window.location.pathname)
window.addEventListener('popstate', () => {
  currentPath.value = window.location.pathname
})

const navigation = ref([
  { name: 'Accueil', href: '/' },
  { name: 'Connexion', href: '/login' },
  { name: 'Inscription', href: '/register' },
])

function navigate(event: MouseEvent, href: string) {
  event.preventDefault()
  window.history.pushState({}, '', href)
  currentPath.value = href
}
const info = ref<any>(null)
const user = ref<any>(null)
const userInterfaceUrl = import.meta.env.VITE_USER_INTERFACE_URL

// Intervalle pour surveiller le token XSRF
let tokenCheckInterval: NodeJS.Timeout | null = null

// const startTokenMonitoring = () => {
//   tokenCheckInterval = setInterval(() => {
//     const currentToken = getXsrfToken()
//     if (!currentToken && user.value && user.value !== 'guest') {
//       console.warn('XSRF Token lost during session - redirecting to login')
//       clearAuthData()
//       user.value = 'guest'
//       navigation.value = [
//         { name: 'Accueil', href: '/' },
//         { name: 'Connexion', href: '/login' },
//         { name: 'Inscription', href: '/register' },
//       ]
//       window.location.href = '/login'
//     }
//   }, 30000) // Vérifie toutes les 30 secondes
// }

// const stopTokenMonitoring = () => {
//   if (tokenCheckInterval) {
//     clearInterval(tokenCheckInterval)
//     tokenCheckInterval = null
//   }
// }

onMounted(async () => {
  try {
    // const xsrfToken = getXsrfToken()
    // // console.log('AppLayout mounted - XSRF Token status:', xsrfToken ? 'Present' : 'Missing')

    // // Validation du token XSRF
    // if (!isValidToken(xsrfToken)) {
    //   // console.log('XSRF token not found or invalid, redirecting to login')
    //   user.value = 'guest'
    //   navigation.value = [
    //     { name: 'Accueil', href: '/' },
    //     { name: 'Connexion', href: '/login' },
    //     { name: 'Inscription', href: '/register' },
    //   ]
    //   return
    // }

    const response = await ApiService.getHome()
    console.log(response)
    if (!validateServerResponse(response)) {
      throw new Error('Invalid response from server')
    }

    // info.value = response
    // if (info?.value?.user) {
    //   user.value = info.value.user
    //   if (info.value.user.id) {
    //     // 🔒 Utilisation des utilitaires de sécurité
    //     setUserId(info.value.user.id)
    //     // Start token monitoring
    //     startTokenMonitoring()
    //   }
    // }

    // navigation.value =
    //   user.value && user.value !== 'guest'
    //     ? [
    //       { name: 'Accueil', href: '/' },
    //       { name: 'Profil', href: '/profile' },
    //     ]
    //     : [
    //       { name: 'Accueil', href: '/' },
    //       { name: 'Connexion', href: '/login' },
    //       { name: 'Inscription', href: '/register' },
    //     ]
  }
  catch (error) {
    // console.error('Failed to fetch:', error)

    // clearAuthData()
    // stopTokenMonitoring()

    user.value = 'guest'
    navigation.value = [
      { name: 'Accueil', href: '/' },
      { name: 'Connexion', href: '/login' },
      { name: 'Inscription', href: '/register' },
    ]
  }
})

async function Logout() {
//   if (confirm('Etes vous de vouloir vous déconnecter ?')) {
//     try {
//       await ApiService.logout()
//     } catch (error) {
//       console.error('Error during logout:', error)
//     } finally {
//       // Stop token monitoring
//       stopTokenMonitoring()
//       // Clear authentication data
//       clearAuthData()
//       window.location.href = '/'
//     }
//   }
}

// Cleanup when component is unmounted
onUnmounted(() => {
//   stopTokenMonitoring()
})


</script>

<style scoped>

</style>