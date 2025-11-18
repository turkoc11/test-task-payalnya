<template>
  <div style="background:white;padding:12px;border-radius:8px">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)
import { defineProps } from 'vue'

const props = defineProps({ projects: Array, tasks: Array })
const canvas = ref<HTMLCanvasElement | null>(null)

function computeCounts(){
  const counts = { todo:0, in_progress:0, done:0 }
  props.tasks.forEach((t:any)=>{ if(t.status==='todo') counts.todo++; else if(t.status==='in_progress') counts.in_progress++; else if(t.status==='done') counts.done++ })
  return counts
}

let chart: any = null
onMounted(()=>{
  const counts = computeCounts()
  if(!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if(!ctx) return
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['To Do','In Progress','Done'], datasets: [{ data: [counts.todo, counts.in_progress, counts.done] }] }
  })
})

watch(()=>props.tasks, (n)=>{
  if(!chart) return
  const counts = computeCounts()
  chart.data.datasets[0].data = [counts.todo, counts.in_progress, counts.done]
  chart.update()
})
</script>
