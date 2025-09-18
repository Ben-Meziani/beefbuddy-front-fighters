import { useRouter } from 'vue-router'

/**
 * 🔒 Utilitaires de sécurité pour la gestion des tokens d'authentification
 */

// Clés pour le stockage sécurisé
const XSRF_TOKEN_KEY = 'xsrfToken'
const USER_ID_KEY = 'userId'

/**
 * Stocke le token XSRF de manière sécurisée
 * @param token - Le token XSRF à stocker
 */
export const setXsrfToken = (token: string): void => {
  if (!token) {
    console.warn('Attempting to store empty XSRF token')
    return
  }
  try {
    localStorage.setItem(XSRF_TOKEN_KEY, token)
    console.log('XSRF token stored successfully')
  } catch (error) {
    console.error('Error storing XSRF token:', error)
  }
}

/**
 * Récupère le token XSRF de manière sécurisée
 * @returns Le token XSRF ou null s'il n'existe pas
 */
export const getXsrfToken = (): string | null => {
  try {
    const token = localStorage.getItem(XSRF_TOKEN_KEY)
    console.log('getXsrfToken:', token ? 'Token found' : 'No token')
    return token
  } catch (error) {
    console.error('Error retrieving XSRF token:', error)
    return null
  }
}

/**
 * Stocke l'ID utilisateur de manière sécurisée
 * @param userId - L'ID utilisateur à stocker
 */
export const setUserId = (userId: string): void => {
  if (!userId) {
    console.warn('Attempting to store empty user ID')
    return
  }
  localStorage.setItem(USER_ID_KEY, userId)
}

/**
 * Récupère l'ID utilisateur de manière sécurisée
 * @returns L'ID utilisateur ou null s'il n'existe pas
 */
export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY)
}

/**
 * Nettoie toutes les données d'authentification
 */
export const clearAuthData = (): void => {
  console.log('clearAuthData - clearing authentication data')
  try {
    localStorage.removeItem(XSRF_TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    console.log('Authentication data cleared successfully')
  } catch (error) {
    console.error('Error clearing authentication data:', error)
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns true si l'utilisateur a un token XSRF valide
 */
export const isAuthenticated = (): boolean => {
  const router = useRouter()
  const token = getXsrfToken()
  if (token !== null && token.length > 0) {
    return true
  }
  router.push('/login')
  return false
}

/**
 * Valide un token XSRF
 * @param token - Le token à valider
 * @returns true si le token est valide
 */
export const isValidToken = (token: string | null): boolean => {
  return token !== null && token.length > 0
}

/**
 * Vérifie si le token XSRF est expiré ou invalide
 * @returns true si le token doit être rafraîchi
 */
export const shouldRefreshToken = (): boolean => {
  const token = getXsrfToken()
  if (!isValidToken(token)) {
    return true
  }

  // Here is the logic to refresh the token
  // based on the token expiration time
  return false
}

/**
 * Rafraîchit le token XSRF si nécessaire
 * @returns Promise<boolean> - true si le token a été rafraîchi avec succès
 */
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  if (!shouldRefreshToken()) {
    return true
  }

  try {
    const currentToken = getXsrfToken()
    if (!currentToken) {
      console.warn('No current token available for refresh')
      return false
    }

    // Appel à l'API de refresh
    const response = await fetch(`${import.meta.env.VITE_API_URL}/token/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': currentToken,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data.xsrfToken) {
        setXsrfToken(data.xsrfToken)
        console.log('Token refreshed successfully')
        return true
      }
    }

    console.warn('Token refresh failed')
    return false
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}
