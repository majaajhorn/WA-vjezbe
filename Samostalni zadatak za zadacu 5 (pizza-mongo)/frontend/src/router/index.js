import { createRouter, createWebHistory } from 'vue-router';
import Homepage from '../components/Homepage.vue';
import Pizze from '../components/Pizze.vue';
import NewPizza from '../components/NewPizza.vue';
import Naruci from '../components/Naruci.vue';

const routes = [
    { path: '/', name: 'Homepage', component: Homepage },
    { path: '/pizze', name: 'Pizze', component: Pizze },
    { path: '/new-pizza', name: 'NewPizza', component: NewPizza },
    { path: '/naruci', name: 'naruci', component: Naruci },
];

const router = createRouter( {
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;