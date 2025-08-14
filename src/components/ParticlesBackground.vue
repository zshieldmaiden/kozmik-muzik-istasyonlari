<template>
  <div class="particles-container">
    <div class="particle" 
         v-for="n in 100" 
         :key="n" 
         :style="getParticleStyle(n)">
    </div>
    <div class="shooting-star" 
         v-for="n in 3" 
         :key="`star-${n}`" 
         :style="getShootingStarStyle(n)">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

function getParticleStyle(index) {
  const size = Math.random() * 3 + 1
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (Math.random() * 4 + 3) + 's'
  }
}

function getShootingStarStyle(index) {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 50 + '%',
    animationDelay: (index * 3) + 's',
    animationDuration: '2s'
  }
}
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: twinkle infinite ease-in-out;
}

.shooting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: shoot infinite linear;
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.5);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes shoot {
  0% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
  }
  70% {
    opacity: 0.7;
    transform: translateX(300px) translateY(150px) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translateX(500px) translateY(250px) scale(0.3);
  }
}
</style>
