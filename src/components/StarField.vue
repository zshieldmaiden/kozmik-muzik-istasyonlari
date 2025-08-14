<template>
  <div class="absolute inset-0 z-0 pointer-events-none">
    <canvas ref="starCanvas" class="w-full h-full"></canvas>
  </div>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue'
import anime from 'animejs/lib/anime.es.js'
const props = defineProps({ speed: { type: Number, default: 1 } })
const starCanvas = ref(null)
let stars = []
function drawStars(ctx, width, height, speed) {
  ctx.clearRect(0, 0, width, height)
  for (const star of stars) {
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.globalAlpha = star.alpha
    ctx.fill()
    ctx.globalAlpha = 1
    star.y += star.speed * speed
    if (star.y > height) star.y = 0
  }
}
function animateStars() {
  const canvas = starCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const width = canvas.width = canvas.offsetWidth
  const height = canvas.height = canvas.offsetHeight
  if (stars.length === 0) {
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2
      })
    }
  }
  function loop() {
    drawStars(ctx, width, height, props.speed)
    requestAnimationFrame(loop)
  }
  loop()
}
onMounted(animateStars)
watch(() => props.speed, animateStars)
</script>
