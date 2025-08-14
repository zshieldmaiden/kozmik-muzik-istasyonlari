<template>
  <div class="p-3 rounded-xl glassmorphism text-white">
    <h3 class="text-sm font-semibold mb-2">🏆 Liderlik Tablosu</h3>
    <div class="leaderboard-scroll max-h-40 overflow-y-auto pr-2">
      <ol class="space-y-1">
        <li v-for="(row, i) in rows" :key="row.name" 
            class="flex justify-between text-xs p-1 rounded hover:bg-white/5 transition-all">
          <span class="opacity-80 flex items-center gap-1">
            <span class="bg-purple-500/30 rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs">
              {{ i + 1 }}
            </span>
            <span class="truncate max-w-20">{{ row.name }}</span>
          </span>
          <span class="font-semibold text-purple-300 text-xs">{{ row.points }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getLeaderboard } from '@/utils/gamification'
const rows = ref([])
function refresh() { rows.value = getLeaderboard() }
onMounted(refresh)
</script>
<style scoped>
.glassmorphism { 
  background: rgba(255,255,255,0.08); 
  backdrop-filter: blur(10px); 
}

/* Özel Kaydırma Çubuğu */
.leaderboard-scroll::-webkit-scrollbar {
  width: 4px;
}

.leaderboard-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.leaderboard-scroll::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.6);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.leaderboard-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.8);
}

/* Firefox için kaydırma çubuğu */
.leaderboard-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(147, 51, 234, 0.6) rgba(255, 255, 255, 0.1);
}
</style>
