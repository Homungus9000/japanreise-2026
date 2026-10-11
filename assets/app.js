import {renderSite} from './render.js';
import {WEATHER_CACHE_KEY,WEATHER_CACHE_MS,forecastURL,forecastMessage,getDaily,getHourly,placeFor,weatherCode} from './weather.js';
const app = document.getElementById('app');
const tokyoDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo'}).format(now);
const addDays = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate()+days);
  return value.toISOString().slice(0,10);
};
const shortDate = date => new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit'}).format(new Date(`${date}T00:00:00Z`));
const degree = value => Number.isFinite(value) ? `${Math.round(value)} °C` : '—';
const rain = value => Number.isFinite(value) ? `Regen ${Math.round(value)} %` : 'Regen —';

function cachedForecast(place) {
  try {
    const cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || '{}');
    const key = `${place.latitude},${place.longitude},${place.timezone}`;
    if (cache[key] && Date.now()-cache[key].savedAt < WEATHER_CACHE_MS) return cache[key].data;
  } catch { /* A private browser may deny storage; a live request still works. */ }
  return null;
}
function saveForecast(place, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || '{}');
    cache[`${place.latitude},${place.longitude},${place.timezone}`] = {savedAt:Date.now(),data};
    localStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify(cache));
  } catch { /* Caching is optional. */ }
}
async function loadForecast(place) {
  const cached = cachedForecast(place);
  if (cached) return cached;
  const response = await fetch(forecastURL(place));
  if (!response.ok) throw new Error(`Wetterdienst ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data?.daily?.time) || !Array.isArray(data?.hourly?.time)) throw new Error('Unvollständige Wetterdaten');
  saveForecast(place,data);
  return data;
}
function setWeather(slot, message, state = 'ready') {
  const target = slot.querySelector('.weather-slot-content') || slot;
  target.textContent = message;
  slot.dataset.weatherState = state;
}
function dailyText(daily, place) {
  const [icon,description] = weatherCode(daily.code);
  return `${icon} ${place.name}: ${degree(daily.min)}–${degree(daily.max)} · ${rain(daily.rain)} · ${description}`;
}
function activityText(slot, data, place) {
  const hourly = getHourly(data,slot.dataset.weatherDate,slot.dataset.weatherTime);
  if (hourly) {
    const [icon,description] = weatherCode(hourly.code);
    return `${icon} ${slot.dataset.weatherTime} Uhr · ${degree(hourly.temperature)} · ${rain(hourly.rain)} · ${description}`;
  }
  const daily = getDaily(data,slot.dataset.weatherDate);
  return daily ? `🌤️ Ohne feste Uhrzeit · ${dailyText(daily,place)}` : forecastMessage(slot.dataset.weatherDate);
}
function prepareOverview(model) {
  const today = tokyoDate();
  const day = model.tage.find(item => item.datum >= today) || model.tage.at(-1);
  const overview = document.querySelector('[data-weather-kind="overview"]');
  if (!overview || !day) return;
  overview.dataset.weatherDate = day.datum;
  overview.dataset.weatherPlace = day.ort;
  overview.querySelector('h2').textContent = day.datum === today ? 'Heutiges Wetter im Reiseplan' : `Tageswetter · ${shortDate(day.datum)}`;
}
async function loadWeather(model) {
  prepareOverview(model);
  const today = tokyoDate();
  const lastForecastDay = addDays(today,15);
  const groups = new Map();
  for (const slot of document.querySelectorAll('[data-weather-kind]')) {
    const place = placeFor(slot.dataset.weatherPlace);
    if (!place) { setWeather(slot,'Wetterort noch nicht eindeutig genug hinterlegt.','unavailable'); continue; }
    if (slot.dataset.weatherDate < today || slot.dataset.weatherDate > lastForecastDay) { setWeather(slot,forecastMessage(slot.dataset.weatherDate),'unavailable'); continue; }
    const key = `${place.latitude},${place.longitude},${place.timezone}`;
    const group = groups.get(key) || {place,slots:[]};
    group.slots.push(slot); groups.set(key,group);
  }
  await Promise.all([...groups.values()].map(async ({place,slots}) => {
    try {
      const data = await loadForecast(place);
      for (const slot of slots) {
        const daily = getDaily(data,slot.dataset.weatherDate);
        const message = slot.dataset.weatherKind === 'activity' ? activityText(slot,data,place) : daily ? dailyText(daily,place) : forecastMessage(slot.dataset.weatherDate);
        setWeather(slot,message,daily ? 'ready' : 'unavailable');
      }
    } catch {
      for (const slot of slots) setWeather(slot,'Wetterdaten sind gerade nicht erreichbar. Bitte später erneut versuchen.','error');
    }
  }));
}
async function load() {
  try {
    const response = await fetch(new URL('../data/reise.json', import.meta.url), {cache:'no-cache'});
    if (!response.ok) throw new Error('Masterdaten nicht erreichbar');
    const model = await response.json();
    if (model.schema_version !== 1 || !Array.isArray(model.tage)) throw new Error('Unbekanntes Datenformat');
    app.innerHTML = renderSite(model);
    const dateFormat = new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
    document.getElementById('travel-dates').textContent = dateFormat.format(new Date(model.reise.von))+' – '+dateFormat.format(new Date(model.reise.bis));
    document.getElementById('travel-stops').textContent = [...new Set(model.hotels.map(h=>h.ort))].join(' · ');
    document.title = model.reise.titel;
    app.removeAttribute('aria-live');
    app.addEventListener('error',event=>{
      if (event.target instanceof HTMLImageElement) {
        event.target.hidden=true;
        const caption=event.target.closest('figure')?.querySelector('figcaption');
        if(caption) caption.prepend('Bild derzeit nicht verfügbar. ');
      }
    },true);
    if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    void loadWeather(model);
  } catch {
    app.innerHTML='<div class="notice" role="alert"><h2>Der Reiseplan konnte nicht geladen werden.</h2><p>Bitte die Verbindung prüfen und erneut laden. Die <a href="data/reise.json">Masterdaten</a> sind auch direkt abrufbar.</p><button type="button" id="retry">Erneut laden</button></div>';
    document.getElementById('retry').addEventListener('click',load,{once:true});
  }
}
load();
