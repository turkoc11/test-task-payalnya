import api from './axios';
import { Project } from '@/types/models';
export const ProjectsAPI = {
  list(){ return api.get<Project[]>('/projects'); },
  get(id:number){ return api.get<Project>(`/projects/${id}`); },
  create(payload: Partial<Project>){ return api.post('/projects', payload); },
  update(id:number, payload: Partial<Project>){ return api.put(`/projects/${id}`, payload); },
  remove(id:number){ return api.delete(`/projects/${id}`); }
};
