import { createRouter, createWebHistory } from 'vue-router';
import Asignaciones from '../components/Asignaciones.vue';
import Vehiculos from '../components/Vehiculos.vue';
import Empleados from '../components/Empleados.vue';

const routes = [
  { path: '/', redirect: '/asignaciones' }, 
  { path: '/empleados', component: Empleados },
  { path: '/vehiculos', component: Vehiculos },
  { path: '/asignaciones', component: Asignaciones },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;