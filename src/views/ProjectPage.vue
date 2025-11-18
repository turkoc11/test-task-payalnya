<template>
  <div class="container">
    <button @click="goBack">Back</button>
    <h2>{{project?.name}}</h2>

    <div style="margin:12px 0">
      <button class="btn" @click="showTaskModal=true">Add Task</button>
    </div>

    <div class="columns">
      <div class="col" v-for="col in columns" :key="col.key">
        <h4>{{col.title}}</h4>
        <draggable v-model="colTasks[col.key]" :group="{ name: 'tasks', pull: true, put: true }" @end="onDragEnd">
          <template #item="{element}">
            <div class="task-card">
              <strong>{{element.title}}</strong>
              <div>{{element.assignee}}</div>
              <div>{{element.dueDate}}</div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <TaskModal v-if="showTaskModal" @close="showTaskModal=false" @save="createTask" :projectId="projectId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import draggable from 'vue-draggable-next'
import TaskModal from '@/components/TaskModal.vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)
const projects = useProjectsStore()
const tasks = useTasksStore()
const project = computed(()=> projects.items.find(p=>p.id===projectId))

const columns = [ { key: 'todo', title: 'To Do' }, { key: 'in_progress', title: 'In Progress' }, { key: 'done', title: 'Done' } ]
const colTasks = ref<{[k:string]: any[]}>({ todo:[], in_progress:[], done:[] })
const showTaskModal = ref(false)

async function load(){
  await projects.fetchAll()
  await tasks.fetchForProject(projectId)
  columns.forEach(c=> colTasks.value[c.key] = tasks.items.filter(t=>t.status===c.key).slice().sort((a,b)=>a.order-b.order))
}

onMounted(()=> load())

async function onDragEnd(){
  const merged: any[] = []
  columns.forEach(c=> colTasks.value[c.key].forEach((t:any, idx:number)=>{ t.status = c.key; t.order = idx+1; merged.push(t) }))
  tasks.items = tasks.items.filter(t=>t.projectId!==projectId).concat(merged)
  await tasks.persistOrder(projectId)
  toast.success('Tasks reordered')
}

function goBack(){ router.push('/') }

async function createTask(payload:any){
  const existing = tasks.items.filter(t=>t.projectId===projectId)
  const maxOrder = existing.length ? Math.max(...existing.map(t=>t.order)) : 0
  const newTask = { ...payload, projectId, order: maxOrder+1 }
  const created = await tasks.create(newTask)
  await tasks.fetchForProject(projectId)
  columns.forEach(c=> colTasks.value[c.key] = tasks.items.filter(t=>t.status===c.key).slice().sort((a,b)=>a.order-b.order))
  showTaskModal.value = false
  toast.success('Task added')
}
</script>
