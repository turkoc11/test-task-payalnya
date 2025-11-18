import { defineStore } from 'pinia';
import { ref } from 'vue';
import { TasksAPI } from '@/api/tasks';
import type { Task } from '@/types/models';

export const useTasksStore = defineStore('tasks', () => {
  const items = ref<Task[]>([]);
  const loading = ref(false);

  async function fetchForProject(projectId: number){
    loading.value = true;
    try {
      const r = await TasksAPI.list({ projectId });
      items.value = r.data.sort((a,b)=>a.order - b.order);
    } finally { loading.value = false; }
  }

  async function create(task: Partial<Task>){
    const r = await TasksAPI.create(task);
    items.value.push(r.data as Task);
    return r.data as Task;
  }

  async function update(id:number, payload: Partial<Task>){
    const r = await TasksAPI.update(id, payload);
    const idx = items.value.findIndex(t=>t.id===id);
    if(idx>=0) items.value[idx] = r.data as Task;
  }

  async function remove(id:number){
    await TasksAPI.remove(id);
    items.value = items.value.filter(t=>t.id!==id);
  }

  async function persistOrder(projectId:number){
    const toUpdate = items.value.filter(t=>t.projectId===projectId).map((t, idx)=>({ ...t, order: idx+1 }));
    for(const t of toUpdate){
      await TasksAPI.update(t.id, { order: t.order, status: t.status });
    }
    await fetchForProject(projectId);
  }

  return { items, loading, fetchForProject, create, update, remove, persistOrder };
});
