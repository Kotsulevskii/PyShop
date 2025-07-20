<script setup lang="ts">
import { ref } from 'vue'
import SearchLocation from './components/SearchLocation.vue'
import WeatherForecast from './components/WeatherForecast.vue'
import type { Lang } from './types'
import translationsRaw from './translations.json';

const translations = translationsRaw as Record<Lang, Record<string, string>>;

const location = ref<any|null>(null)
const geoError = ref<string|null>(null)
const theme = ref<'light'|'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
const lang = ref<Lang>('ru')

function translate(key: string) {
  return translations[lang.value][key] || key
}

function onLocationSelected(loc: any) {
  location.value = loc
  geoError.value = null
}

function getCurrentLocation() {
  geoError.value = null
  if (!navigator.geolocation) {
    geoError.value = translate('geoUnavailable')
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${lang.value}&format=json`
      try {
        const res = await fetch(url)
        const data = await res.json()
        if (data && data.results && data.results.length > 0) {
          location.value = data.results[0]
        } else {
          location.value = { name: translate('geoBtn'), country: '', latitude: lat, longitude: lon }
        }
      } catch (e) {
        location.value = { name: translate('geoBtn'), country: '', latitude: lat, longitude: lon }
      }
    },
    (err) => {
      if (err.code === 1) {
        geoError.value = translate('geoDenied');
      } else if (err.code === 2) {
        geoError.value = translate('geoUnavailable');
      } else if (err.code === 3) {
        geoError.value = translate('geoTimeout');
      } else {
        geoError.value = translate('geoError') + err.message;
      }
    }
  )
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <div :class="['main-container', theme]">
    <div class="header-row">
      <h1>{{ translate('title') }}</h1>
      <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? translate('lightTheme') : translate('darkTheme')">
        <span v-if="theme === 'dark'">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
    <div class="lang-row">
      <label for="lang-select">🌐</label>
      <select id="lang-select" v-model="lang" class="lang-select">
        <option value="ru">RU</option>
        <option value="en">EN</option>
        <option value="de">DE</option>
        <option value="fr">FR</option>
      </select>
    </div>
    <button @click="getCurrentLocation" class="geo-btn">{{ translate('geoBtn') }}</button>
    <SearchLocation @location-selected="onLocationSelected" :placeholder="translate('searchPlaceholder')" :lang="lang" />
    <WeatherForecast v-if="location" :location="location" :lang="lang" />
    <div v-if="geoError" class="geo-error">{{ geoError }}</div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  box-shadow: 0 2px 8px #0001;
  transition: background 0.3s, color 0.3s;
  --bg: #f8fafd;
  --text: #222;
}
.main-container.dark {
  --bg: #23272f;
  --text: #f8fafd;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
}
.theme-toggle {
  background: none;
  border: none;
  font-size: 1.7em;
  cursor: pointer;
  transition: color 0.2s;
}
.lang-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1em;
}
.lang-select {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1em;
}
.geo-btn {
  width: 100%;
  padding: 0.8em;
  margin-bottom: 1em;
  border-radius: 6px;
  border: none;
  background: #2196f3;
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.2s;
}
.geo-btn:hover {
  background: #1769aa;
}
.geo-error {
  color: #b71c1c;
  background: #ffeaea;
  border: 1px solid #fbb;
  border-radius: 6px;
  padding: 1em;
  margin: 1em 0;
  text-align: center;
}
@media (max-width: 600px) {
  .main-container {
    max-width: 100vw;
    margin: 0;
    border-radius: 0;
    padding: 0.5em;
  }
  .header-row h1 {
    font-size: 1.2em;
  }
  .geo-btn {
    font-size: 1em;
    padding: 0.6em;
  }
}
</style>
