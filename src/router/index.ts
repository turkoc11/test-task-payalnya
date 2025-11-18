import { createRouter, createWebHistory } from 'vue-router'
import ProjectsPage from '@/views/ProjectsPage.vue'
import ProjectPage from '@/views/ProjectPage.vue'

const routes = [
  { path: '/', component: ProjectsPage },
  { path: '/projects/:id', component: ProjectPage, props: true }
]

export default createRouter({ history: createWebHistory(), routes })
