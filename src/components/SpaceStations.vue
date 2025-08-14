<template>
  <div class="relative min-h-screen overflow-hidden bg-space">
    <!-- Animasyonlu arka plan elementleri -->
    <div class="stars"></div>
    <div class="meteors"></div>
    <div class="nebula"></div>
    
    <!-- Ana içerik -->
    <div class="relative z-10 container mx-auto px-4 py-8 text-white">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
          Kozmik Müzik İstasyonları
        </h1>
        <p class="text-xl text-blue-200 max-w-2xl mx-auto">
          Galaksiler arası bir müzik yolculuğuna çıkın ve kozmik müzik duraklarımızı keşfedin
        </p>
      </header>
      
      <!-- İstasyon seçici (yatay kaydırma) -->
      <div class="relative mb-16">
        <!-- Yatay kaydırma göstergesi -->
        <div class="hidden md:flex absolute -left-8 inset-y-0 items-center">
          <div class="text-blue-400 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </div>
        
        <div class="overflow-x-auto pb-6 space-station-scroll">
          <div class="flex space-x-6 md:space-x-8 px-4 min-w-max">
            <div 
              v-for="(station, index) in spaceStations" 
              :key="station.id"
              @click="selectStation(station)"
              :class="['station-card transform transition-all duration-500 cursor-pointer', 
                selectedStation && selectedStation.id === station.id ? 'scale-110 ring-4 ring-neon shadow-neon' : 'hover:scale-105']"
            >
              <!-- İstasyon kartı -->
              <div class="w-60 md:w-72 rounded-xl overflow-hidden glassmorphism border border-white/20">
                <!-- İstasyon görüntüsü -->
                <div class="h-40 overflow-hidden relative">
                  <img :src="station.image" :alt="station.name" class="w-full h-full object-cover">
                  <div :class="`absolute inset-0 opacity-60 ${station.overlayClass}`"></div>
                  
                  <!-- İstasyon koordinatları -->
                  <div class="absolute bottom-0 right-0 p-2 text-xs font-mono text-white/80">
                    {{ station.coordinates }}
                  </div>
                </div>
                
                <!-- İstasyon bilgileri -->
                <div class="p-4">
                  <h3 class="text-xl font-bold mb-1" :class="station.textColorClass">{{ station.name }}</h3>
                  <p class="text-sm text-blue-100 mb-3">{{ station.description }}</p>
                  
                  <!-- Atmosfer tipi ve müzik türleri -->
                  <div class="flex justify-between text-xs">
                    <span class="opacity-80">Atmosfer: {{ station.atmosphere }}</span>
                    <span :class="station.textColorClass">{{ station.genres.join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Yatay kaydırma göstergesi (sağ) -->
        <div class="hidden md:flex absolute -right-8 inset-y-0 items-center">
          <div class="text-blue-400 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Seçilen istasyon müzik önerileri -->
      <div v-if="selectedStation" class="max-w-4xl mx-auto">
        <div class="glassmorphism rounded-xl p-6 border border-white/20 mb-6">
          <h2 class="text-2xl md:text-3xl font-bold mb-4 flex items-center" :class="selectedStation.textColorClass">
            <span class="mr-2">{{ selectedStation.icon }}</span>
            {{ selectedStation.name }} Müzik Seçkileri
          </h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="(song, i) in selectedStation.songs" 
              :key="i"
              class="glassmorphism-light p-3 rounded-lg border border-white/10 hover:border-white/30 transition-all flex items-center space-x-3"
            >
              <!-- Şarkı kapak görseli -->
              <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <img :src="song.image" :alt="song.title" class="w-full h-full object-cover">
              </div>
              
              <!-- Şarkı bilgileri -->
              <div class="flex-grow min-w-0">
                <h4 class="font-medium truncate">{{ song.title }}</h4>
                <p class="text-sm text-blue-200 truncate">{{ song.artist }}</p>
              </div>
              
              <!-- Çalma butonu -->
              <button class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Tüm çalma listesi bağlantısı -->
          <div class="mt-6 text-center">
            <a href="#" :class="`inline-flex items-center px-4 py-2 rounded-full ${selectedStation.buttonClass} transition-colors text-white`">
              <span class="mr-2">Tüm Çalma Listesi</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        
        <!-- İstasyon hakkında detaylı bilgi -->
        <div class="glassmorphism rounded-xl p-6 border border-white/20">
          <h3 class="text-xl font-bold mb-3" :class="selectedStation.textColorClass">İstasyon Hakkında</h3>
          
          <p class="text-blue-100 mb-4">{{ selectedStation.about }}</p>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div class="font-semibold text-white">Atmosfer</div>
              <div class="text-blue-200">{{ selectedStation.atmosphere }}</div>
            </div>
            <div>
              <div class="font-semibold text-white">Kuruldu</div>
              <div class="text-blue-200">{{ selectedStation.established }}</div>
            </div>
            <div>
              <div class="font-semibold text-white">Müzik Türleri</div>
              <div class="text-blue-200">{{ selectedStation.genres.join(', ') }}</div>
            </div>
            <div>
              <div class="font-semibold text-white">Konum</div>
              <div class="text-blue-200 font-mono">{{ selectedStation.coordinates }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- İstasyon seçilmediğinde gösterilen mesaj -->
      <div v-else class="text-center text-xl text-blue-200 max-w-xl mx-auto glassmorphism rounded-xl p-6 border border-white/20">
        <p>Müzik yolculuğunuza başlamak için yukarıdaki istasyonlardan birini seçin</p>
      </div>
      
      <!-- Ana sayfaya dönüş butonu -->
      <div class="absolute top-4 left-4">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-space-blue hover:bg-blue-700 text-white rounded-full text-xs shadow-lg flex items-center"
        >
          <span class="mr-1">←</span>
          <span>Ana Sayfaya Dön</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])

// Seçilen istasyon
const selectedStation = ref(null)

// İstasyon seçme fonksiyonu
function selectStation(station) {
  selectedStation.value = station
  // İstasyon seçildiğinde sayfayı seçilen istasyonun görünümüne kaydırabilirsiniz
  setTimeout(() => {
    window.scrollTo({
      top: window.innerHeight / 2,
      behavior: 'smooth'
    })
  }, 100)
}

// Uzay istasyonları veri seti
const spaceStations = [
  {
    id: 1,
    name: 'Merkür Jazz Station',
    description: 'Güneş sisteminin en iç gezegeninde konumlanmış sıcak caz merkezi',
    atmosphere: 'Sıcak ve Yoğun',
    coordinates: 'GSK-42°11′25″, +28°36′59″',
    established: '2176',
    genres: ['Jazz', 'Fusion', 'Bebop'],
    icon: '🎷',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    overlayClass: 'bg-gradient-to-br from-orange-900/60 to-yellow-700/60',
    textColorClass: 'text-amber-400',
    buttonClass: 'bg-amber-700 hover:bg-amber-600',
    about: 'Merkür Jazz Station, 2176 yılında gezegendeki ilk kalıcı yerleşim yeri olarak kuruldu. Güneş\'e bu kadar yakın olmanın ve gezegendeki ekstrem sıcaklık dalgalanmalarının, müzisyenlere benzersiz bir ilham kaynağı sağladığı düşünülüyor. İstasyon, klasik caz severlerin yanı sıra deneysel caz akımlarının da merkezi konumunda.',
    songs: [
      { title: 'Solar Swing', artist: 'The Mercury Quartet', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Hot Surface Blues', artist: 'Ella Starwind', image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80' },
      { title: 'Bebop Revolution', artist: 'Miles Nebula', image: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80' },
      { title: 'Crater View', artist: 'John Cosmotrane', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Proxima Fusion', artist: 'Nina Spaceways', image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Morning on Mercury', artist: 'The Orbit Ensemble', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    ]
  },
  {
    id: 2,
    name: 'Satürn R&B Rings',
    description: 'Halkaların arasında dans etmek isteyenler için ritim ve melodi',
    atmosphere: 'Akışkan ve Dinamik',
    coordinates: 'GSK-78°14′05″, −42°19′47″',
    established: '2205',
    genres: ['R&B', 'Soul', 'Funk'],
    icon: '🎵',
    image: 'https://images.unsplash.com/photo-1614314107768-6018061e5704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    overlayClass: 'bg-gradient-to-br from-yellow-900/60 to-amber-700/60',
    textColorClass: 'text-yellow-400',
    buttonClass: 'bg-yellow-700 hover:bg-yellow-600',
    about: 'Satürn\'ün etkileyici halkaları arasında konumlanan bu istasyon, sistemdeki en iyi R&B ve soul müzik deneyimini sunuyor. Yerçekimi dalgalanmalarının ve halkaların oluşturduğu ışık oyunlarının ritimle uyumu, benzersiz bir müzik ve dans deneyimi yaratıyor. İstasyonda düzenlenen canlı performanslar, Güneş Sistemi\'nin her yerinden ziyaretçileri çekiyor.',
    songs: [
      { title: 'Ring Theory', artist: 'Saturn Soul Collective', image: 'https://images.unsplash.com/photo-1604080907141-1b52307258c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' },
      { title: 'Gravity Groove', artist: 'The Titans', image: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1195&q=80' },
      { title: 'Orbital Love', artist: 'Cassini & The Huygens', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80' },
      { title: 'Moonlight Funk', artist: 'Titan Express', image: 'https://images.unsplash.com/photo-1431376831251-6c21caac1616?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80' },
      { title: 'Hexagon Storm', artist: 'North Pole Players', image: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Golden Ratio', artist: 'Enceladus Ensemble', image: 'https://images.unsplash.com/photo-1519412203512-e67e36d11f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    ]
  },
  {
    id: 3,
    name: 'Andromeda Pop Hub',
    description: 'Komşu galaksiden gelen taze ve enerjik popüler müziğin merkezi',
    atmosphere: 'Neşeli ve Enerjik',
    coordinates: 'GSK-112°51′55″, +89°32′11″',
    established: '2246',
    genres: ['Pop', 'Dance', 'Electropop'],
    icon: '🌟',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1211&q=80',
    overlayClass: 'bg-gradient-to-br from-pink-900/60 to-purple-700/60',
    textColorClass: 'text-pink-400',
    buttonClass: 'bg-pink-700 hover:bg-pink-600',
    about: 'Andromeda Pop Hub, Samanyolu ve Andromeda galaksileri arasındaki kültürel alışveriş programı sonucunda kuruldu. İki galaksinin müzikal geleneklerini harmanlayan istasyon, sürekli değişen ve gelişen pop müzik akımlarının öncüsü konumunda. Buradaki şarkıların Dünya\'ya ulaşması yaklaşık 2.5 milyon yıl sürse de, kuantum iletişim teknolojileriyle bu müzikler anında yayınlanabiliyor.',
    songs: [
      { title: 'Galaxy Girl', artist: 'Nova Stella', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80' },
      { title: 'Quantum Love', artist: 'The Messier Brothers', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Intergalactic Party', artist: 'Stardust Sisters', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Neon Nebula', artist: 'Cosmic Crystals', image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=855&q=80' },
      { title: 'Star Crossed', artist: 'The Event Horizons', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Dance in Space', artist: 'Lightspeed', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    ]
  },
  {
    id: 4,
    name: 'Kara Delik Lo-fi Lounge',
    description: 'Evrenin en rahat çalışma ve dinlenme noktası',
    atmosphere: 'Sakin ve Derin',
    coordinates: 'GSK-23°04′45″, −62°48′30″',
    established: '2198',
    genres: ['Lo-fi', 'Chillhop', 'Ambient'],
    icon: '🎧',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
    overlayClass: 'bg-gradient-to-br from-gray-900/60 to-blue-900/60',
    textColorClass: 'text-blue-400',
    buttonClass: 'bg-blue-800 hover:bg-blue-700',
    about: 'Kara Delik Lo-fi Lounge, Sagittarius A* süper kütleli kara deliğin olay ufku yakınlarındaki güvenli bir konumda bulunuyor. Zamanın göreceli olarak daha yavaş aktığı bu istasyon, derin düşünce ve konsantrasyon gerektiren çalışmalar için ideal bir ortam sunuyor. İstasyonun kendine özgü akustik özellikleri, lo-fi ve ambient müziklerin harmonilerini benzersiz bir şekilde güçlendiriyor.',
    songs: [
      { title: 'Event Horizon', artist: 'Gravity Waves', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Singularity Study Session', artist: 'Time Dilation', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Quantum Cafe', artist: 'Hawking Radiation', image: 'https://images.unsplash.com/photo-1558304970-abd292c94b3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Spacetime Beats', artist: 'Cosmic Background', image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' },
      { title: 'Midnight on Sagittarius', artist: 'Relativity', image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Deep Space Meditation', artist: 'Entropy Ensemble', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    ]
  },
  {
    id: 5,
    name: 'Samanyolu Ambient Dock',
    description: 'Galaksimizin kolları arasında dinlenmeye var mısınız?',
    atmosphere: 'Dinlendirici ve Huzurlu',
    coordinates: 'GSK-07°22′15″, +33°09′52″',
    established: '2187',
    genres: ['Ambient', 'Space Music', 'New Age'],
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1213&q=80',
    overlayClass: 'bg-gradient-to-br from-indigo-900/60 to-purple-800/60',
    textColorClass: 'text-indigo-400',
    buttonClass: 'bg-indigo-700 hover:bg-indigo-600',
    about: 'Samanyolu galaksisinin Perseus kolunda yer alan bu istasyon, ambiyans müziğin en saf halini deneyimlemeye olanak sağlıyor. Özel olarak tasarlanmış akustik odaları ve 3D ses sistemleriyle, uzayın kendi doğal seslerini müzikle harmanlayan benzersiz bir deneyim sunuyor. İstasyon aynı zamanda galaksideki en büyük meditasyon ve zihinsel yenilenme merkezine ev sahipliği yapıyor.',
    songs: [
      { title: 'Cosmic Whispers', artist: 'Stellaris', image: 'https://images.unsplash.com/photo-1603888613934-ee2f7d693dd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80' },
      { title: 'Arms of the Galaxy', artist: 'Interstellar Echoes', image: 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' },
      { title: 'Stellar Nursery', artist: 'Nebula Dreams', image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1178&q=80' },
      { title: 'Celestial Drift', artist: 'The Void Walkers', image: 'https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80' },
      { title: 'Astral Projection', artist: 'Perseus Arm Collective', image: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { title: 'Hydrogen Harmony', artist: 'Oort Cloud Orchestra', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80' },
    ]
  }
]
</script>

<style scoped>
/* Arka plan stilleri */
.bg-space {
  background-color: #050920;
  background-image: linear-gradient(125deg, #050920 0%, #0a1128 60%, #161b33 100%);
}

/* Yıldız animasyonu */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(2px 2px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at calc(random(100) * 1vw) calc(random(100) * 1vh), white, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  z-index: 1;
}

/* Meteor animasyonu */
.meteors {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.meteors::before,
.meteors::after {
  content: "";
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
  top: 0;
  left: 50%;
  animation: meteor 5s linear infinite;
}

.meteors::after {
  animation-delay: 2.5s;
  top: 30%;
  left: 70%;
}

@keyframes meteor {
  0% {
    transform: translateY(0) translateX(0) rotate(45deg);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(-100vw) rotate(45deg);
    opacity: 0;
  }
}

/* Nebula animasyonu */
.nebula {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top right, rgba(121, 107, 255, 0.1) 0%, rgba(121, 107, 255, 0) 40%),
              radial-gradient(ellipse at bottom left, rgba(255, 107, 237, 0.1) 0%, rgba(255, 107, 237, 0) 40%);
  pointer-events: none;
  z-index: 0;
  animation: nebula-drift 120s linear infinite alternate;
}

@keyframes nebula-drift {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

/* Glassmorphism efektleri */
.glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glassmorphism-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
}

/* Özel yatay kaydırma çubuğu */
.space-station-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(138, 75, 255, 0.5) rgba(21, 23, 42, 0.3);
}

.space-station-scroll::-webkit-scrollbar {
  height: 8px;
}

.space-station-scroll::-webkit-scrollbar-track {
  background: rgba(21, 23, 42, 0.3);
  border-radius: 4px;
}

.space-station-scroll::-webkit-scrollbar-thumb {
  background: rgba(138, 75, 255, 0.5);
  border-radius: 4px;
  border: 2px solid rgba(21, 23, 42, 0.3);
}

/* Özel renkler */
.text-neon {
  text-shadow: 0 0 5px #fff, 0 0 10px currentColor, 0 0 20px currentColor;
}

.ring-neon {
  box-shadow: 0 0 10px rgba(138, 75, 255, 0.7), 0 0 20px rgba(138, 75, 255, 0.5);
}

.shadow-neon {
  box-shadow: 0 0 10px rgba(138, 75, 255, 0.7), 0 0 20px rgba(138, 75, 255, 0.5);
}

/* Button renkleri */
.bg-space-blue {
  background-color: rgba(43, 76, 126, 0.8);
}

/* İstasyon kartı hover efekti */
.station-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.station-card:hover {
  z-index: 10;
}

/* Mobil optimizasyonları */
@media (max-width: 768px) {
  .station-card {
    width: 240px;
  }
}
</style>
