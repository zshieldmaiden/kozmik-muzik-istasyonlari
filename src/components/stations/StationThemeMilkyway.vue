<template>
  <div class="relative h-96 flex items-center justify-center bg-gradient-to-br from-white to-blue-200 rounded-3xl shadow-xl">
    <div class="absolute inset-0 z-10 pointer-events-none">
      <!-- Hava durumu efektleri buraya eklenecek -->
    </div>
    <div class="z-20">
      <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-white border-4 border-white flex items-center justify-center">
        <span class="text-4xl">🌌</span>
      </div>
      <h2 class="text-2xl font-bold text-blue-700 text-center mt-4">Samanyolu İstasyonu</h2>
    </div>
  </div>
</template>
<script setup>
defineProps({ weather: String, active: Boolean })
</script>
