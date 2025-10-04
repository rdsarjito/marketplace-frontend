import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/RegisterView.vue'
import ForgotPasswordView from '@/pages/ForgotPasswordView.vue'
import ResetPasswordView from '@/pages/ResetPasswordView.vue'
import DashboardView from '@/pages/DashboardView.vue'
import ProductsListView from '@/pages/ProductsListView.vue'
import ProductDetailView from '@/pages/ProductDetailView.vue'
import CartView from '@/pages/CartView.vue'
import CheckoutView from '@/pages/CheckoutView.vue'
import OrdersView from '@/pages/OrdersView.vue'
import OrderDetailView from '@/pages/OrderDetailView.vue'
import ProfileView from '@/pages/ProfileView.vue'
import ProductsManageView from '@/pages/ProductsManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/my-products',
      name: 'my-products',
      component: ProductsManageView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    }
    ,
    {
      path: '/products',
      name: 'products',
      component: ProductsListView,
      meta: { requiresAuth: false }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: false }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: false }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresAuth: false }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: OrderDetailView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  
  const isAuthenticated = authStore.isAuthenticated
  
  // Check if token exists but user is not authenticated (token might be expired)
  const token = localStorage.getItem('token')
  if (token && !isAuthenticated) {
    // Token exists but user is not authenticated - likely expired
    // Clear the expired token and redirect to login
    authStore.logout()
    next('/login')
    return
  }
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router