import Home from '@/components/HomeSite/HomeSite.vue'
// import Login from '@/components/LoginUser/LoginUser.vue'
// import Register from '@/components/RegisterUser/RegisterUser.vue'
// import Profile from '@/components/ProfileUser/ProfileUser.vue'
// import FightersList from '@/components/FightersList/FightersList.vue'
// import FighterProfile from '@/components/FighterProfile/FighterProfile.vue'
// import Reservation from '@/components/ReservationFighter/ReservationFighter.vue'
// import ResetPassword from '@/components/ResetPassword/ResetPassword.vue'
// import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm.vue'
import NotFound from '@/components/Four0FourPageNotFound/Four0FourPageNotFound.vue'
// import PaymentSuccess from '@/components/PaymentSuccess/PaymentSuccess.vue'
// import PaymentFailed from '@/components/PaymentFailed/PaymentFailed.vue'
// import EditProfile from '@/components/ProfileUser/EditProfile/EditProfile.vue'
// import { isAuthenticated } from '../utils/auth'

const routes = [
  { path: '/', component: Home },
//   {
//     path: '/login',
//     component: Login,
//   },
//   {
//     path: '/register',
//     component: Register
//   },
//   {
//     path: '/profile',
//     component: Profile,
//     beforeEnter: isAuthenticated,
//   },
//   {
//     path: '/fighters-list',
//     component: FightersList
//   },
//   {
//     path: '/fighter-profile/:id',
//     component: FighterProfile,
//   },
//   {
//     path: '/payment-success',
//     component: PaymentSuccess,
//   },
//   {
//     path: '/payment-failed',
//     component: PaymentFailed,
//   },
//   {
//     path: '/reservation/:id',
//     component: Reservation,
//     beforeEnter: isAuthenticated,
//   },
//   {
//     path: '/reset-password',
//     component: ResetPassword
//   },
//   {
//     path: '/reset-password-form',
//     component: ResetPasswordForm },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  },
//   {
//     name: 'edit-profile',
//     path: '/profile/edit',
//     component: EditProfile,
//     beforeEnter: isAuthenticated,
//   }
]

export default routes
