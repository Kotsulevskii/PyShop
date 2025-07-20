<template>
  <div class="search-block">
    <div class="search-row">
      <input ref="inputRef" v-model="query" @input="onInput" :placeholder="placeholder" class="search-input" />
    </div>
    <ul v-if="results.length" class="results-list">
      <li v-for="loc in results" :key="loc.id">
        <button @click="selectLocation(loc)" class="result-btn">
          {{ loc.name }}, {{ loc.country }} <span v-if="loc.admin1">({{ loc.admin1 }})</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue'

const props = defineProps<{ placeholder?: string, lang?: string }>()
const query = ref('')
const results = ref<any[]>([])
let timeout: ReturnType<typeof setTimeout> | null = null
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})

async function searchLocation(name: string) {
  if (!name) {
    results.value = []
    return
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=${props.lang || 'ru'}&format=json`
  const res = await fetch(url)
  const data = await res.json()
  results.value = data.results || []
}

function onInput() {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => searchLocation(query.value), 400)
}

const emit = defineEmits(['location-selected'])
function selectLocation(loc: any) {
  emit('location-selected', loc)
  results.value = []
  query.value = `${loc.name}, ${loc.country}`
}
</script>

<style scoped>
.search-block {
  margin-bottom: 1em;
}
.search-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.search-input {
  flex: 1;
  padding: 0.9em 1.2em;
  font-size: 1.1em;
  border-radius: 10px;
  border: 1.5px solid #bcd0ee;
  background: #f7fafd;
  box-shadow: 0 2px 8px #bcd0ee22;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  color: #222;
}
.search-input:focus {
  border-color: #2196f3;
  background: #f0f7ff;
  box-shadow: 0 4px 16px #2196f322;
}
.search-input::placeholder {
  color: #888;
  opacity: 0.7;
  font-size: 1em;
}
.results-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  margin: 0.5em 0 0 0;
}
.result-btn {
  width: 100%;
  text-align: left;
  padding: 1em;
  border: none;
  background: none;
  font-size: 1em;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}
.result-btn:hover {
  background: #f0f8ff;
}
@media (max-width: 600px) {
  .search-block { margin-bottom: 0.5em; }
  .result-btn { padding: 0.7em; font-size: 0.95em; }
  .search-input { font-size: 1em; padding: 0.7em 1em; }
}
</style> 