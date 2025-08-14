<template>
  <canvas ref="canvas" class="fixed inset-0 w-full h-full -z-10"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
let ctx, width, height, animationId
let stars = []
let meteors = []

function randomBetween(a, b) {
  return Math.random() * (b - a) + a
}

function createStars(count) {
  stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      r: randomBetween(0.3, 1.2),
      speed: randomBetween(0.02, 0.08),
      twinkle: Math.random()
    })
  }
}

function createMeteor() {
  meteors.push({
    x: randomBetween(0, width),
    y: 0,
    len: randomBetween(80, 160),
    speed: randomBetween(4, 7),
    angle: Math.PI / 4,
    alpha: 1
  })
}

function draw() {
  ctx.clearRect(0, 0, width, height)
  // Stars
  for (const s of stars) {
    ctx.save()
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now() * 0.002 + s.twinkle * 10)
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.restore()
    s.y += s.speed
    if (s.y > height) s.y = 0
  }
  // Meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    ctx.save()
    ctx.globalAlpha = m.alpha
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(m.x + m.len * Math.cos(m.angle), m.y + m.len * Math.sin(m.angle))
    ctx.stroke()
    ctx.restore()
    m.x += m.speed * Math.cos(m.angle)
    m.y += m.speed * Math.sin(m.angle)
    m.alpha -= 0.01
    if (m.alpha <= 0) meteors.splice(i, 1)
  }
  animationId = requestAnimationFrame(draw)
}

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
  createStars(180)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  setInterval(createMeteor, 8000)
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
})
</script>

<style scoped>
canvas {
  pointer-events: none;
}
</style>
