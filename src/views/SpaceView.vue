<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
        Uzay Keşifleri
      </h1>
      
      <!-- Uzay Zaman Çizelgesi Bileşeni -->
      <SpaceTimeline />
      
      <!-- Ana sayfaya dönüş butonu -->
      <div class="mt-12 text-center">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 rounded-full bg-purple-700 hover:bg-purple-600 transition-colors text-white font-medium"
        >
          <span class="mr-2">←</span> Ana Sayfaya Dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import SpaceTimeline from '../components/SpaceTimeline.vue';
</script>

<style scoped>
/* İlave stil yok */
</style>
