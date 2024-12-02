import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import WeatherDetailPage from '@/pages/WeatherDetailPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/weather/:id',
      name: 'weather-detail',
      component: WeatherDetailPage,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    }
  ]
});

export default router; 