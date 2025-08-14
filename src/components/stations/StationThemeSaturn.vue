<template>
  <div class="relative h-96 flex items-center justify-center bg-gradient-to-br from-yellow-200 to-gray-400 rounded-3xl shadow-xl">
    <div class="absolute inset-0 z-10 pointer-events-none">
      <!-- Hava durumu efektleri buraya eklenecek -->
    </div>
    <div class="z-20">
      <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-300 to-gray-400 border-4 border-white flex items-center justify-center">
        <span class="text-4xl">🪐</span>
      </div>
      <h2 class="text-2xl font-bold text-white text-center mt-4">Satürn İstasyonu</h2>
    </div>
  </div>
</template>
<script setup>
defineProps({ weather: String, active: Boolean })
</script>
