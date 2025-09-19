<template src="./RegisterUserFighter.html" />

<script setup lang="ts">
import ApiService from '@/services/ApiService'
// import axios from 'axios'
import { ref, reactive, computed } from 'vue'

interface RegisterForm {
  email: string
  username: string
  password: string
  confirmPassword: string
}

interface RegisterError {
  email?: string
  username?: string
  password?: string
  confirmPassword?: string
  general?: string
}

const form = reactive<RegisterForm>({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive<RegisterError>({})
const isLoading = ref(false)
const emit = defineEmits(['submit'])

// Form validation
const validateForm = (): boolean => {
  errors.email = ''
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.general = ''

  // Username validation
  if (!form.username.trim()) {
    errors.username = "Nom d'utilisateur est requis"
    return false
  }

  if (form.username.length < 3) {
    errors.username = "Nom d'utilisateur doit contenir au moins 3 caractères"
    return false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email est requis'
    return false
  }

  if (!form.email.includes('@')) {
    errors.email = 'Email invalide'
    return false
  }

  // Password validation
  if (!form.password.trim()) {
    errors.password = 'Mot de passe est requis'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'Mot de passe doit contenir au moins 6 caractères'
    return false
  }

  // Password confirmation validation
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = 'Confirmation du mot de passe est requise'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return false
  }

  return true
}

// Computed property for button disabled state
const isSubmitDisabled = computed(() => {
  return (
    isLoading.value ||
    !form.email.trim() ||
    !form.username.trim() ||
    !form.password.trim() ||
    !form.confirmPassword.trim()
  )
})

const submit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errors.general = ''

  try {
    const response = await ApiService.registerFighter(form.email.trim(), form.username.trim(), form.password)
    // Emit the submit event with the response data
    emit('submit', response)

    // Redirect to home page
    window.location.href = '/'
  } catch (error: unknown) {
    console.error('Failed to register:', error)

    const axiosError = error as any
    if (axiosError.response?.data?.error) {
      errors.general = axiosError.response.data.error
    } else if (axiosError.response?.status === 409) {
      errors.general = "Un utilisateur avec cet email ou nom d'utilisateur existe déjà"
    } else if (axiosError.response?.status === 422) {
      // Handle validation errors from server
      const serverErrors = axiosError.response.data.errors
      if (serverErrors?.email) {
        errors.email = serverErrors.email[0]
      }
      if (serverErrors?.username) {
        errors.username = serverErrors.username[0]
      }
      if (serverErrors?.password) {
        errors.password = serverErrors.password[0]
      }
    } else if (axiosError.code === 'NETWORK_ERROR') {
      errors.general = 'Erreur de connexion. Vérifiez votre connexion internet.'
    } else {
      errors.general = "Une erreur inattendue s'est produite. Veuillez réessayer."
    }
  } finally {
    isLoading.value = false
  }
}

const onGoogleRegister = () => {
  // TODO: Implement Google OAuth registration logic here
  alert('Google registration not implemented yet. (TODO)')
}

// Clear errors when user starts typing
const clearFieldError = (field: keyof RegisterError) => {
  if (errors[field]) {
    errors[field] = ''
  }
}
</script>
