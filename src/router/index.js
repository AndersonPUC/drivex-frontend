import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import Usuarios from '../views/Usuarios.vue'
import Clientes from '../views/Clientes.vue'

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
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})
export default router
