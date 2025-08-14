<template>
  <div class="absolute inset-0 z-10 pointer-events-none">
    <canvas ref="meteorCanvas" class="w-full h-full"></canvas>
  </div>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue'
const props = defineProps({ speed: { type: Number, default: 1 } })
const meteorCanvas = ref(null)
let meteors = []
function drawMeteors(ctx, width, height, speed) {
  ctx.clearRect(0, 0, width, height)
  for (const meteor of meteors) {
    ctx.beginPath()
    ctx.moveTo(meteor.x, meteor.y)
    ctx.lineTo(meteor.x + meteor.length, meteor.y + meteor.length * 0.5)
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()
    meteor.x += meteor.vx * speed
    meteor.y += meteor.vy * speed
    if (meteor.x > width || meteor.y > height) {
      meteor.x = Math.random() * width
      meteor.y = -20
    }
  }
}
function animateMeteors() {
  const canvas = meteorCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const width = canvas.width = canvas.offsetWidth
  const height = canvas.height = canvas.offsetHeight
  if (meteors.length === 0) {
    for (let i = 0; i < 8; i++) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 40 + 30,
        vx: Math.random() * 2 + 2,
        vy: Math.random() * 1 + 1,
      })
    }
  }
  function loop() {
    drawMeteors(ctx, width, height, props.speed)
    requestAnimationFrame(loop)
  }
  loop()
}
onMounted(animateMeteors)
watch(() => props.speed, animateMeteors)
</script>
