import api from './axios';
import { Task } from '@/types/models';
export const TasksAPI = {
  list(params?:Record<string,any>){ return api.get<Task[]>('/tasksCRUD', { params }); },
  create(payload: Partial<Task>){ return api.post('/tasksCRUD', payload); },
  update(id:number, payload: Partial<Task>){ return api.put(`/tasksCRUD/${id}`, payload); },
  remove(id:number){ return api.delete(`/tasksCRUD/${id}`); }
};
