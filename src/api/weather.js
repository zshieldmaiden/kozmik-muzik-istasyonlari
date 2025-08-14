// OpenWeatherMap API entegrasyonu
// Hata durumunda fallback veri döner
import axios from 'axios';

// API anahtarını alın ve değerini loglayın
// API anahtarını doğrudan sabit olarak tanımla
const API_KEY = 'c99d2fa61ce79aa4756128dea10d53e5';
console.log('Alınan API KEY:', API_KEY);

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// API Anahtarı hata kontrolü
if (!API_KEY || API_KEY === 'your_openweathermap_api_key' || API_KEY.includes('kendi_api_anahtarınızı_yazın')) {
  console.warn('OpenWeatherMap API anahtarı ayarlanmamış veya yanlış ayarlanmış. .env dosyanızı kontrol edin.');
}

// Fallback verileri
export const defaultWeather = {
  weather: [{ main: 'Clear', description: 'Açık' }],
  main: { temp: 22 },
  name: 'Fallback Şehir',
};

export async function fetchWeather(lat, lon) {
  try {
    // API anahtarı kontrolünü kaldırdım - doğrudan kullanıyoruz
    console.log('Hava durumu isteği gönderiliyor, API KEY:', API_KEY);
    
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'tr',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Hava durumu verisi alınamadı:', error);
    // Fallback veri
    return defaultWeather;
  }
}

// Şehir adıyla hava durumu getir
export async function fetchWeatherByCity(cityName) {
  try {
    console.log('Şehir hava durumu isteği gönderiliyor:', cityName);
    
    const response = await axios.get(BASE_URL, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
        lang: 'tr',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Şehir hava durumu verisi alınamadı:', error);
    
    // HTTP durum koduna göre hata mesajı belirle
    let errorMessage = 'Hava durumu bilgisi alınamadı';
    if (error.response?.status === 404) {
      errorMessage = `"${cityName}" şehri bulunamadı. Lütfen geçerli bir şehir adı girin.`;
    } else if (error.response?.status === 401) {
      errorMessage = 'API anahtarı geçersiz. Lütfen daha sonra tekrar deneyin.';
    } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      errorMessage = 'İnternet bağlantınızı kontrol edin.';
    }
    
    console.error('Hata detayları:', error.response?.data || error.message);
    
    // Hata bilgisi ile birlikte özel bir hata nesnesi fırlat
    const customError = new Error(errorMessage);
    customError.cityName = cityName;
    customError.originalError = error;
    customError.statusCode = error.response?.status;
    
    throw customError;
  }
}
