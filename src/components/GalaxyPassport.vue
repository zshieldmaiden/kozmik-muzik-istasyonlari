<template>
  <div class="p-4 rounded-xl glassmorphism text-white">
    <h3 class="text-lg font-semibold mb-2">Galaksi Pasaportu</h3>
    <div class="flex gap-2 flex-wrap">
      <span v-for="stamp in safeStamps" :key="stamp" class="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs">
        {{ stamp }}
      </span>
      <span v-if="!hasStamps" class="text-white/60 text-sm">Henüz damga yok</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getGalaxyPassport } from '@/utils/gamification'

const stamps = ref([])

const safeStamps = computed(() => {
  return Array.isArray(stamps.value) ? stamps.value : []
})

const hasStamps = computed(() => {
  return safeStamps.value.length > 0
})

function refresh() { 
  try {
    const passport = getGalaxyPassport()
    stamps.value = Array.isArray(passport) ? passport : []
  } catch (e) {
    console.warn('GalaxyPassport refresh error:', e)
    stamps.value = []
  }
}

onMounted(refresh)
</script>

<style scoped>
.glassmorphism { background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); }
</style>