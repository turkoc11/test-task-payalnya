import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProjectsAPI } from '@/api/projects';
import type { Project } from '@/types/models';

export const useProjectsStore = defineStore('projects', () => {
  const items = ref<Project[]>([]);
  const loading = ref(false);

  const tableSettingsKey = 'projects_table_settings';
  const tableSettings = ref({
    sortBy: 'id',
    sortDesc: false,
    filters: { name:'', status:'' },
    colWidths: {} as Record<string,number>
  });

  function loadSettings(){
    const s = localStorage.getItem(tableSettingsKey);
    if(s) tableSettings.value = JSON.parse(s);
  }
  function saveSettings(){ localStorage.setItem(tableSettingsKey, JSON.stringify(tableSettings.value)); }

  async function fetchAll(){
    loading.value = true;
    try {
      const r = await ProjectsAPI.list();
      items.value = r.data;
    } finally { loading.value = false; }
  }
  async function create(p: Partial<Project>){
    const r = await ProjectsAPI.create({ ...p, createdAt: new Date().toISOString() });
    items.value.push(r.data as Project);
    return r.data as Project;
  }
  async function update(id:number, payload: Partial<Project>){
    const r = await ProjectsAPI.update(id, payload);
    const idx = items.value.findIndex(x=>x.id===id);
    if(idx>=0) items.value[idx] = r.data as Project;
  }
  async function remove(id:number){
    await ProjectsAPI.remove(id);
    items.value = items.value.filter(x=>x.id!==id);
  }

  return { items, loading, fetchAll, create, update, remove, tableSettings, loadSettings, saveSettings };
});
