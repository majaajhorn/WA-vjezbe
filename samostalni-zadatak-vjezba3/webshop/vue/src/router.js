import { createRouter, createWebHistory } from 'vue-router';
import ProductView from './components/ProductView.vue';
import Proizvod from './components/Proizvod.vue'
import PocetnaStranica from './components/PocetnaStranica.vue'

const routes = [
  { path: '/', component: PocetnaStranica},
  { path: '/proizvodi/:id', component: ProductView, name: 'ProductView'},
  { path: '/proizvodi', component: Proizvod, name: 'Proizvod'}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;