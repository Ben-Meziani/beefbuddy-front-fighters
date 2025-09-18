/**
 * 🔒 Configuration de sécurité pour les requêtes HTTP
 */

import axios from 'axios'
import { getXsrfToken, setXsrfToken } from './auth'
import store from '../store'

// Variable pour éviter les requêtes de refresh multiples simultanées
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | null) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

/**
 * Configuration des en-têtes de sécurité pour les requêtes
 */
export const getSecurityHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const xsrfToken = getXsrfToken()
  if (xsrfToken) {
    headers['X-XSRF-TOKEN'] = xsrfToken
  }

  return headers
}

/**
 * Configuration Axios avec sécurité renforcée + refresh token
 */
export const configureAxiosSecurity = (): void => {
  // Intercepteur pour injecter les headers
  axios.interceptors.request.use((config) => {
    const securityHeaders = getSecurityHeaders()
    config.headers = { ...config.headers, ...securityHeaders }
    config.withCredentials = true
    return config
  })

  // Intercepteur pour gérer les erreurs 401 avec tentative de refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Si un refresh est déjà en cours, on met la requête en file d'attente
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers['X-XSRF-TOKEN'] = token
              return axios(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const xsrfToken = getXsrfToken()
          if (!xsrfToken) {
            throw new Error('No XSRF token available for refresh')
          }

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/token/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                'X-XSRF-TOKEN': xsrfToken,
              },
            },
          )

          // Mise à jour du nouveau xsrfToken
          const newXsrfToken = response.data.xsrfToken
          if (newXsrfToken) {
            setXsrfToken(newXsrfToken)
            console.log('Token XSRF refreshed successfully')
          } else {
            throw new Error('No new XSRF token received from server')
          }

          // Fix: Convert to number to match store type
          const userId = Number(response.data.id)
          if (userId) {
            store.commit('setUserId', userId)
          }

          // Traite la file d'attente avec succès
          processQueue(null, newXsrfToken)

          // Rejoue la requête d'origine avec le nouveau token
          originalRequest.headers['X-XSRF-TOKEN'] = newXsrfToken
          return axios(originalRequest)
        } catch (refreshError) {
          console.warn('Échec du refresh → redirection vers login', refreshError)

          // Traite la file d'attente avec erreur
          processQueue(refreshError, null)

          // Nettoyer les données d'authentification
          store.commit('setUserId', null)
          localStorage.removeItem('xsrfToken')
          localStorage.removeItem('userId')

          // Fallback to window.location since router isn't configured
          window.location.href = '/login'
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  )
}

/**
 * Validation de la réponse du serveur
 */
export const validateServerResponse = (response: any): boolean => {
  return response && response.status === 200 && response !== null && response !== undefined
}
