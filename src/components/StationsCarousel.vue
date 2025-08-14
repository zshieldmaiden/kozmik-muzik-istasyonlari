<template>
  <div class="relative w-full overflow-x-auto flex snap-x snap-mandatory">
    <div
      v-for="station in stations"
      :key="station.id"
      class="snap-center min-w-[80vw] transition-transform cursor-pointer"
      @click="selectStation(station)"
    >
      <component :is="station.themeComponent" :weather="weather" :active="selectedStation.id === station.id" />
    </div>
  </div>
  <StarField :speed="starSpeed" />
  <MeteorShower :speed="meteorSpeed" />
  <!-- Müzik listesi ve arka plan burada güncellenir -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { stations } from '@/data/stations'
import StarField from './StarField.vue'
import MeteorShower from './MeteorShower.vue'

const selectedStation = ref(stations[0])
const weather = ref('clear') // Örnek, gerçek hava durumu ile entegre edilecek

function selectStation(station) {
  selectedStation.value = station
  // arka plan, müzik listesi, animasyon hızları güncellenir
}

const starSpeed = computed(() => selectedStation.value.id === 'mars' ? 2 : 1)
const meteorSpeed = computed(() => weather.value === 'rain' ? 3 : 1)
</script>
