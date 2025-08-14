<template>
  <!-- Ana timeline container -->
  <div class="w-full py-8 overflow-hidden bg-gray-900">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-purple-300 mb-8">Uzay Teknolojileri Zaman Çizelgesi</h2>
    
    <!-- Yatay kaydırmalı timeline container -->
    <div class="relative">
      <!-- Yatay çizgi (timeline axis) -->
      <div class="absolute h-1 bg-purple-500 left-0 right-0 top-1/2 transform -translate-y-1/2"></div>
      
      <!-- Scroll edilebilen container -->
      <div class="overflow-x-auto pb-8">
        <div class="flex space-x-16 px-8 md:px-16 py-16 min-w-max">
          <!-- Her bir timeline olayı için v-for loop -->
          <div 
            v-for="(event, index) in spaceEvents" 
            :key="index" 
            class="relative group"
          >
            <!-- Olay noktası (nokta) -->
            <div 
              class="w-6 h-6 rounded-full bg-purple-600 border-4 border-purple-900 z-10 relative hover:bg-purple-400 hover:shadow-neon transition-all duration-300"
              @mouseover="activeEvent = index" 
              @mouseleave="activeEvent = null"
            ></div>
            
            <!-- Yıl etiketi -->
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 text-purple-300 font-bold">
              {{ event.year }}
            </div>
            
            <!-- Olay adı - alternatif pozisyonlar (üst/alt) -->
            <div 
              :class="[
                'absolute w-40 text-center font-medium transition-all duration-300',
                index % 2 === 0 ? 'top-12' : '-top-24',
                activeEvent === index ? 'text-neon-purple scale-110' : 'text-purple-200'
              ]"
            >
              {{ event.name }}
            </div>
            
            <!-- Detaylı tooltip - hover'da görünür -->
            <div 
              v-show="activeEvent === index"
              class="absolute z-20 w-64 bg-purple-900/90 backdrop-blur-sm p-4 rounded-lg border border-purple-400 shadow-neon left-1/2 transform -translate-x-1/2 text-white"
              :class="index % 2 === 0 ? 'top-24' : '-top-80'"
            >
              <img 
                v-if="event.image" 
                :src="event.image" 
                :alt="event.name"
                class="w-full h-32 object-cover rounded mb-2"
              />
              <h3 class="font-bold text-neon-purple">{{ event.name }} ({{ event.year }})</h3>
              <p class="text-sm mt-1 text-purple-100">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll göstergesi -->
      <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-purple-400 text-sm animate-pulse">
        <span class="mr-1">◄</span>Yatay Kaydırın<span class="ml-1">►</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Aktif olay indeksi (tooltip görünürlüğü için)
const activeEvent = ref(null)

// Uzay teknolojileri zaman çizelgesi verileri
const spaceEvents = [
  {
    year: 1961,
    name: "İlk İnsanlı Uzay Uçuşu",
    description: "Yuri Gagarin, Vostok 1 ile Dünya yörüngesine çıkan ilk insan oldu.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Gagarin_in_Sweden.jpg/640px-Gagarin_in_Sweden.jpg"
  },
  {
    year: 1969,
    name: "Apollo 11: Ay'a İniş",
    description: "Neil Armstrong ve Buzz Aldrin, Ay'a ayak basan ilk insanlar oldular.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Apollo_11_Lunar_Lander_-_5927_NASA.jpg/640px-Apollo_11_Lunar_Lander_-_5927_NASA.jpg"
  },
  {
    year: 1971,
    name: "Salyut 1: İlk Uzay İstasyonu",
    description: "Dünya'nın yörüngesine yerleştirilen ilk uzay istasyonu.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Salyut_1_-_interior.jpg/640px-Salyut_1_-_interior.jpg"
  },
  {
    year: 1981,
    name: "Space Shuttle Programı",
    description: "İlk yeniden kullanılabilir uzay aracı olan Space Shuttle Columbia'nın ilk uçuşu.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Space_Shuttle_Columbia_launching.jpg/640px-Space_Shuttle_Columbia_launching.jpg"
  },
  {
    year: 1986,
    name: "Mir Uzay İstasyonu",
    description: "Sovyetler Birliği tarafından fırlatılan modüler uzay istasyonu Mir, 15 yıl boyunca hizmet verdi.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mir_space_station_seen_from_Space_Shuttle_Endeavour.jpg/640px-Mir_space_station_seen_from_Space_Shuttle_Endeavour.jpg"
  },
  {
    year: 1990,
    name: "Hubble Uzay Teleskopu",
    description: "NASA'nın fırlattığı, Dünya'nın yörüngesinde dönen, uzak gök cisimlerinin gözlemlerini yapan uzay teleskopu.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HST-SM4.jpeg/640px-HST-SM4.jpeg"
  },
  {
    year: 1998,
    name: "ISS: İnşaata Başlangıç",
    description: "Uluslararası Uzay İstasyonu'nun ilk modülü Zarya'nın fırlatılması.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/ISS_March_2009.jpg/640px-ISS_March_2009.jpg"
  },
  {
    year: 2004,
    name: "Mars Gezgini: Spirit ve Opportunity",
    description: "NASA'nın Mars'a indirdiği ve uzun süreli görev yapan robotik gezginler.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/NASA_Mars_Rover.jpg/640px-NASA_Mars_Rover.jpg"
  },
  {
    year: 2012,
    name: "Curiosity Mars'ta",
    description: "NASA'nın Mars Science Laboratory görevinin bir parçası olan Curiosity gezgini Mars'a indi.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg/640px-Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg"
  },
  {
    year: 2015,
    name: "Plüton'un Keşfi",
    description: "New Horizons uzay aracı Plüton'un ilk yakın görüntülerini Dünya'ya iletti.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/New_Horizons_Pluto.jpg/640px-New_Horizons_Pluto.jpg"
  },
  {
    year: 2020,
    name: "SpaceX Crew Dragon",
    description: "Özel bir şirket tarafından geliştirilen uzay aracıyla ilk insanlı uçuş gerçekleştirildi.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/SpaceX_Crew_Dragon_%28More_cropped%29.jpg/640px-SpaceX_Crew_Dragon_%28More_cropped%29.jpg"
  },
  {
    year: 2021,
    name: "Perseverance Mars'ta",
    description: "NASA'nın Perseverance gezgini ve Ingenuity helikopteri Mars'a indi.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/PIA23764-Mars2020Rover-Perseverance-Artists_Rendition-20200304.jpg/640px-PIA23764-Mars2020Rover-Perseverance-Artists_Rendition-20200304.jpg"
  },
  {
    year: 2022,
    name: "James Webb Teleskopu",
    description: "Şimdiye kadar fırlatılan en büyük ve en güçlü uzay teleskopu olan James Webb Uzay Teleskopu göreve başladı.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/JWST_spacecraft_model_2.png/640px-JWST_spacecraft_model_2.png"
  },
  {
    year: 2023,
    name: "Artemis Programı",
    description: "NASA'nın Ay'a geri dönüş programı Artemis'in ilk insansız test uçuşları gerçekleştirildi.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Artemis_I_Launch_%28NHQ202211160002%29.jpg/640px-Artemis_I_Launch_%28NHQ202211160002%29.jpg"
  }
]
</script>

<style scoped>
/* Özel neon efekti için */
.text-neon-purple {
  color: #d8b4fe;
  text-shadow: 0 0 5px #d8b4fe, 0 0 10px #d8b4fe;
}

.shadow-neon {
  box-shadow: 0 0 8px #d8b4fe, 0 0 15px rgba(216, 180, 254, 0.6);
}

/* Kaydırma çubuğu stilini özelleştir */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #4c1d95;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8b5cf6;
}
</style>
