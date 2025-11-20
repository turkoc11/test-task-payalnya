<template>
  <div class="container">
    <div class="toolbar">
      <input class="input" v-model="filters.name" placeholder="Search by name" />
      <select class="input" v-model="filters.status">
        <option value="">All statuses</option>
        <option value="active">active</option>
        <option value="on_hold">on_hold</option>
        <option value="archived">archived</option>
      </select>
      <button class="btn" @click="openAdd">Add Project</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th @click="sort('id')">ID</th>
          <th @click="sort('name')">Name</th>
          <th @click="sort('tasksCount')">#Tasks</th>
          <th @click="sort('status')">Status</th>
          <th @click="sort('createdAt')">Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in displayed" :key="p.id" @click="goTo(p.id)">
          <td>{{p.id}}</td>
          <td>{{p.name}}</td>
          <td>{{tasksCount(p.id)}}</td>
          <td>{{p.status}}</td>
          <td>{{formatDate(p.createdAt)}}</td>
        </tr>
      </tbody>
    </table>

    <ProjectModal v-if="showModal" @close="showModal=false" @save="createProject" />
    <div style="margin-top:12px">
      <ProjectsChart :projects="projects.items" :tasks="tasks.items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import ProjectModal from '@/components/ProjectModal.vue'
import ProjectsChart from '@/components/ProjectsChart.vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const projects = useProjectsStore()
const tasks = useTasksStore()
const router = useRouter()
const filters = ref({ name:'', status:'' })
const showModal = ref(false)
const sortBy = ref('id')
const sortDesc = ref(false)

onMounted(async ()=>{ projects.loadSettings(); await projects.fetchAll(); await tasks.fetchForProject(-1).catch(()=>{}) })

const displayed = computed(()=>{
  let list = projects.items.slice()
  if(filters.value.name) list = list.filter(p=>p.name.toLowerCase().includes(filters.value.name.toLowerCase()))
  if(filters.value.status) list = list.filter(p=>p.status === filters.value.status)
  list.sort((a:any,b:any)=>{
    const aVal = a[sortBy.value] ?? ''
    const bVal = b[sortBy.value] ?? ''
    if(aVal === bVal) return 0
    return (aVal > bVal ? 1 : -1) * (sortDesc.value ? -1 : 1)
  })
  return list
})

function sort(field:string){
  if(sortBy.value === field) sortDesc.value = !sortDesc.value
  else { sortBy.value = field; sortDesc.value = false }
  projects.saveSettings()
}

function formatDate(d?:string){ return d ? new Date(d).toLocaleDateString() : '' }
async function createProject(data:any){
  const created = await projects.create(data)
  toast.success('Project created')
  showModal.value = false
  router.push(`/projects/${created.id}`)
}
function goTo(id:number){ router.push(`/projects/${id}`) }
function tasksCount(projectId:number){ return tasks.items.filter(t=>t.projectId===projectId).length }

// ---- MISSING openAdd -> added here ----
function openAdd() {
  // prepare modal default
  const defaults = { name: '', description: '', status: 'active' }
  showModal.value = true
  // pass defaults via event when modal emits save
  // we rely on ProjectModal to emit save with payload
}
</script>
