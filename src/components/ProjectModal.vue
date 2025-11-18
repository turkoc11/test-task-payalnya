<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>New Project</h3>
      <form @submit.prevent="onSubmit" class="grid">
        <input v-model="form.name" placeholder="Name" required />
        <textarea v-model="form.description" placeholder="Description"></textarea>
        <select v-model="form.status">
          <option value="active">active</option>
          <option value="on_hold">on_hold</option>
          <option value="archived">archived</option>
        </select>
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
const form = reactive({ name:'', description:'', status:'active' })
function onSubmit(){ if(!form.name.trim()) return alert('Name required'); emit('save', { ...form }) }
</script>
