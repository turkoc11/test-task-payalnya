<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>New Task</h3>
      <form @submit.prevent="onSubmit" class="grid">
        <input v-model="form.title" placeholder="Title" required />
        <input v-model="form.assignee" placeholder="Assignee" />
        <select v-model="form.status">
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <input type="date" v-model="form.dueDate" />
        <div style="display:flex;justify-content:flex-end;gap:8px">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button class="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const emit = defineEmits(['close','save'])
const props = defineProps({ projectId: { type: Number, required: true } })
const form = reactive({ title:'', assignee:'', status:'todo', dueDate: '' })
function onSubmit(){ if(!form.title.trim()) return alert('Title required'); emit('save', { ...form }) }
</script>
