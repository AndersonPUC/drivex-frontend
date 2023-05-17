import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import Usuarios from '../views/Usuarios.vue'
import Clientes from '../views/Clientes.vue'
import Seguradoras from '../views/Seguradoras.vue'
import Veiculos from '../views/Veiculos.vue'
import Locacao from '../views/Locacao.vue'


Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/clientes',
		name: 'Clientes',
		component: Clientes
	},
	{
		path: '/seguradoras',
		name: 'Seguradoras',
		component: Seguradoras
	},
	{
		path: '/veiculos',
		name: 'Veiculos',
		component: Veiculos
	},
	{
		path: '/signin',
		name: 'Signin',
		component: Signin
	},
	{
		path: '/signup',
		name: 'Signup',
		component: Signup
	},
	{
		path: '/usuarios',
		name: 'Usuários',
		component: Usuarios
	},
	{
		path: '/locacoes',
		name: 'Locação',
		component: Locacao
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})
export default router
