<template>
  <div v-if="error" class="error-block">{{ translate('error') }}{{ error }}</div>
  <div v-else-if="loading" class="spinner-block">
    <span class="spinner"></span> {{ translate('loading') }}
  </div>
  <div v-else-if="weather" class="weather-block">
    <h2>{{ location.name }}, {{ location.country }}</h2>
    <div v-if="currentTemp !== null" class="current-temp">
      <strong>{{ translate('currentTemp') }}</strong>
      <span :class="tempClass(currentTemp)">{{ currentTemp }}°C</span>
    </div>
    <h3>{{ translate('forecastByDay') }}</h3>
    <ul class="forecast-list">
      <li v-for="(day, i) in daily" :key="i">
        <span class="weather-desc">{{ weatherDesc(day.temp) }}</span>
        {{ day.date }}: <span :class="tempClass(day.temp)">{{ day.temp }}°C</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Lang } from '../types'
import translationsRaw from '../translations.json'

const translations = translationsRaw as Record<Lang, Record<string, string>>;

const props = defineProps<{ location: any, lang?: string }>()
const weather = ref<any>(null)
const currentTemp = ref<number|null>(null)
const daily = ref<{date: string, temp: number}[]>([])
const loading = ref(false)
const error = ref<string|null>(null)

const lang = computed(() => (props.lang as Lang) || 'ru')
function translate(key: string) {
  return translations[lang.value][key] || key
}

function tempClass(temp: number) {
  if (temp >= 25) return 'hot';
  if (temp <= 5) return 'cold';
  return 'mild';
}

function weatherDesc(temp: number) {
  if (temp >= 25) return translate('hot')
  if (temp <= 5) return translate('cold')
  return translate('mild')
}

watch(() => props.location, async (loc) => {
  if (!loc) return
  weather.value = null
  currentTemp.value = null
  daily.value = []
  error.value = null
  loading.value = true

  try {
    const now = new Date()
    const start = now.toISOString().slice(0, 10)
    const endDate = new Date(now)
    endDate.setDate(now.getDate() + 3)
    const end = endDate.toISOString().slice(0, 10)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&start_date=${start}&end_date=${end}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    weather.value = data
    currentTemp.value = data.current_weather?.temperature ?? null
    if (data.daily && data.daily.time && data.daily.temperature_2m_max && data.daily.temperature_2m_min) {
      daily.value = data.daily.time.map((date: string, i: number) => ({
        date: new Date(date).toLocaleDateString(lang.value),
        temp: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2)
      }))
    }
  } catch (e: any) {
    error.value = e.message || 'API error'
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.weather-block {
  background: #f8fafd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  box-shadow: 0 2px 8px #0001;
  color: #222;
}
.weather-block h2,
.weather-block h3,
.weather-block .current-temp,
.weather-block .forecast-list li,
.weather-block .weather-desc {
  color: #222;
}
</style> 