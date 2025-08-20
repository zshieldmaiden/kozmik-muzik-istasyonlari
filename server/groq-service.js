// Groq AI Client for Backend
import fetch from 'node-fetch';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqAIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ GROQ_API_KEY not found in environment variables');
    }
  }

  async generateMusicRecommendation(mood, weather, location) {
    if (!this.apiKey) {
      return this.getFallbackRecommendation(mood);
    }

    try {
      const prompt = `Sen bir müzik uzmanısın. ${location} şehrinde hava durumu ${weather} ve kullanıcının ruh hali ${mood}. Bu duruma uygun 3 şarkı öner. Sadece JSON formatında cevap ver:

{
  "songs": [
    {
      "title": "Şarkı Adı",
      "artist": "Sanatçı Adı", 
      "genre": "Tür",
      "mood": "Ruh Hali",
      "reason": "Bu şarkının neden uygun olduğu"
    }
  ]
}`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty AI response');
      }

      return JSON.parse(content);

    } catch (error) {
      console.error('Groq AI Error:', error);
      return this.getFallbackRecommendation(mood);
    }
  }

  async generateAuralisResponse(userText, weather, history) {
    if (!this.apiKey) {
      return this.getFallbackAuralisResponse(userText);
    }

    try {
      const prompt = `Sen bir kozmik müzik DJ'isin! MUTLAKA şu formatta yanıt ver:

🌌 Ruh Hali Analizi: [Kullanıcının ruh halini tek cümleyle açıkla]
🌟 Seçilen İstasyon: [İstasyon emoji ve adı] - [Neden seçildi?]

💫 Kozmik Müzik Önerileri:
1. [Sanatçı] - [Şarkı] | [Kısa açıklama]
2. [Sanatçı] - [Şarkı] | [Kısa açıklama]
3. [Sanatçı] - [Şarkı] | [Kısa açıklama]
4. [Sanatçı] - [Şarkı] | [Kısa açıklama]
5. [Sanatçı] - [Şarkı] | [Kısa açıklama]

🚀 Kozmik Mesaj: [Motivasyonlu kısa mesaj]

Kullanıcı: "${userText}"
Hava: ${weather}
Geçmiş: ${JSON.stringify(history)}

Yukarıdaki FORMATLA yanıt ver! Türkçe!`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackAuralisResponse(userText);

    } catch (error) {
      console.error('Groq AI Error:', error);
      return this.getFallbackAuralisResponse(userText);
    }
  }

  getFallbackRecommendation(mood) {
    const recommendations = {
      happy: [
        { title: "Happy", artist: "Pharrell Williams", genre: "pop", mood: "happy", reason: "Mutluluk veren klasik hit" },
        { title: "Good as Hell", artist: "Lizzo", genre: "pop", mood: "happy", reason: "Kendine güven artırıcı" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "funk", mood: "happy", reason: "Dans ettiren enerji" }
      ],
      sad: [
        { title: "Someone Like You", artist: "Adele", genre: "ballad", mood: "sad", reason: "Duygusal bağ kurucu" },
        { title: "Mad World", artist: "Gary Jules", genre: "alternative", mood: "sad", reason: "Melankolik atmosfer" },
        { title: "The Sound of Silence", artist: "Disturbed", genre: "rock", mood: "sad", reason: "Derin duygusal deneyim" }
      ],
      energetic: [
        { title: "Thunder", artist: "Imagine Dragons", genre: "rock", mood: "energetic", reason: "Yüksek enerji patlaması" },
        { title: "Titanium", artist: "David Guetta ft. Sia", genre: "electronic", mood: "energetic", reason: "Güçlü motivasyon" },
        { title: "Eye of the Tiger", artist: "Survivor", genre: "rock", mood: "energetic", reason: "Mücadele ruhu" }
      ]
    };

    const selectedMood = mood?.toLowerCase() || 'happy';
    return {
      songs: recommendations[selectedMood] || recommendations.happy
    };
  }

  getFallbackAuralisResponse(userText) {
    return `🌌 Ruh Hali Analizi: Kozmik bir keşif modundasınız!
🌟 Seçilen İstasyon: 🌌 SAMANYOLU İstasyonu - Çeşitlilik için perfect!

💫 Kozmik Müzik Önerileri:
1. Pink Floyd - Comfortably Numb | Psikedelik yolculuk
2. Hans Zimmer - Interstellar | Epik orkestra
3. Radiohead - Karma Police | Alternatif derinlik
4. Aphex Twin - Windowlicker | Deneysel elektronik
5. Sigur Rós - Hoppípolla | Post-rock atmosfer

🚀 Kozmik Mesaj: Müzik evreninde sınır yoktur! ✨`;
  }
}
