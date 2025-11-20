<template>
  <div style="background:white;padding:12px;border-radius:8px">
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  projects: any[],
  tasks: any[]
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const renderChart = () => {
  if (!chartRef.value) return;

  if (chart) {
    chart.destroy();
  }

  const statuses = ["To Do", "In Progress", "Done"];

  const counts = statuses.map(status =>
    props.tasks.filter(t => t.status === status).length
  );

  chart = new Chart(chartRef.value, {
    type: "doughnut",
    data: {
      labels: statuses,
      datasets: [
        {
          data: counts
        }
      ]
    }
  });
};

onMounted(renderChart);

watch(() => props.tasks, renderChart, { deep: true });
</script>
