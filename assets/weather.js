// Weather data is fetched in the browser so the published itinerary needs no
// secret, server or scheduled job. Times returned by Open-Meteo are local to
// the place in question; Japan uses Asia/Tokyo throughout.
export const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
export const WEATHER_CACHE_KEY = 'japanreise-weather-v1';
export const WEATHER_CACHE_MS = 30 * 60 * 1000;

// The itinerary uses descriptive place names. These deliberately small areas
// keep the forecast tied to the stop even when a venue name cannot be geocoded.
const places = [
  ['Azabudai',35.6596,139.7457,'Asia/Tokyo'], ['Shinjuku',35.6938,139.7034,'Asia/Tokyo'],
  ['Shibuya',35.6580,139.7016,'Asia/Tokyo'], ['Harajuku',35.6702,139.7026,'Asia/Tokyo'],
  ['Akihabara',35.6984,139.7731,'Asia/Tokyo'], ['Ueno',35.7081,139.7743,'Asia/Tokyo'],
  ['Marunouchi',35.6812,139.7671,'Asia/Tokyo'], ['Ginza',35.6717,139.7650,'Asia/Tokyo'],
  ['Odaiba',35.6267,139.7750,'Asia/Tokyo'], ['Narita',35.7767,140.3186,'Asia/Tokyo'],
  ['Tokyo',35.6762,139.6503,'Asia/Tokyo'], ['Kanazawa',36.5613,136.6562,'Asia/Tokyo'],
  ['Tsuruga',35.6452,136.0555,'Asia/Tokyo'], ['Kyoto',35.0116,135.7681,'Asia/Tokyo'],
  ['Nara',34.6851,135.8050,'Asia/Tokyo'], ['Osaka',34.6937,135.5023,'Asia/Tokyo'],
  ['Mishima',35.1184,138.9185,'Asia/Tokyo'], ['Shuzenji',34.9709,138.9331,'Asia/Tokyo'],
  ['Izu',34.9769,138.9460,'Asia/Tokyo'], ['Frankfurt',50.1109,8.6821,'Europe/Berlin'],
  ['Freiburg',47.9990,7.8421,'Europe/Berlin']
];

export function placeFor(value = '') {
  const text = String(value).toLocaleLowerCase('de-DE');
  const match = places.find(([name]) => text.includes(name.toLocaleLowerCase('de-DE')));
  return match && {name:match[0],latitude:match[1],longitude:match[2],timezone:match[3]};
}

export function timeForActivity(activity = {}) {
  const exact = String(activity.startzeit || '').match(/(?:T|\s)(\d{2}:\d{2})(?::\d{2})?/);
  if (exact) return exact[1];
  const hint = String(activity.tageszeit || '');
  const hinted = hint.match(/(\d{1,2}):(\d{2})/);
  if (hinted) return `${hintedHour(hinted[1])}:${hinted[2]}`;
  const value = hint.toLocaleLowerCase('de-DE');
  if (/früh|morgen/.test(value)) return '09:00';
  if (/vormittag/.test(value)) return '10:00';
  if (/spät.*nachmittag/.test(value)) return '17:00';
  if (/nachmittag/.test(value)) return '15:00';
  if (/mittag/.test(value)) return '12:30';
  if (/abend/.test(value)) return '19:00';
  if (/nacht/.test(value)) return '21:00';
  return null;
}
function hintedHour(hour) { return String(hour).padStart(2,'0'); }

export function weatherCode(code) {
  const codes = {
    0:['☀️','klar'], 1:['🌤️','meist klar'], 2:['⛅','wechselnd bewölkt'], 3:['☁️','bedeckt'],
    45:['🌫️','Nebel'], 48:['🌫️','Nebel'], 51:['🌦️','Nieselregen'], 53:['🌦️','Nieselregen'],
    55:['🌦️','Nieselregen'], 56:['🌧️','gefrierender Nieselregen'], 57:['🌧️','gefrierender Nieselregen'],
    61:['🌧️','leichter Regen'], 63:['🌧️','Regen'], 65:['🌧️','starker Regen'], 66:['🌧️','gefrierender Regen'],
    67:['🌧️','gefrierender Regen'], 71:['🌨️','leichter Schnee'], 73:['🌨️','Schnee'], 75:['🌨️','starker Schnee'],
    77:['🌨️','Schneekörner'], 80:['🌦️','Regenschauer'], 81:['🌦️','Regenschauer'], 82:['🌧️','starke Schauer'],
    85:['🌨️','Schneeschauer'], 86:['🌨️','starke Schneeschauer'], 95:['⛈️','Gewitter'],
    96:['⛈️','Gewitter mit Hagel'], 99:['⛈️','Gewitter mit Hagel']
  };
  return codes[code] || ['🌡️','Wetter'];
}

export function forecastURL(place) {
  const query = new URLSearchParams({
    latitude:String(place.latitude), longitude:String(place.longitude), timezone:place.timezone,
    forecast_days:'16', hourly:'temperature_2m,precipitation_probability,weather_code',
    daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
  });
  return `${WEATHER_API}?${query}`;
}

export function getDaily(data, date) {
  const index = data?.daily?.time?.indexOf(date) ?? -1;
  if (index < 0) return null;
  return {date, code:data.daily.weather_code?.[index], max:data.daily.temperature_2m_max?.[index], min:data.daily.temperature_2m_min?.[index], rain:data.daily.precipitation_probability_max?.[index]};
}

export function getHourly(data, date, time) {
  if (!time) return null;
  const index = data?.hourly?.time?.indexOf(`${date}T${time}`) ?? -1;
  if (index < 0) return null;
  return {date,time,code:data.hourly.weather_code?.[index],temperature:data.hourly.temperature_2m?.[index],rain:data.hourly.precipitation_probability?.[index]};
}

export function forecastMessage(date, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo'}).format(now);
  if (date < today) return 'Für diesen vergangenen Reisetag liegt keine Live-Prognose vor.';
  const earliest = new Date(`${date}T00:00:00Z`);
  earliest.setUTCDate(earliest.getUTCDate() - 15);
  const availableFrom = new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit'}).format(earliest);
  return `Noch außerhalb des Vorhersagefensters. Voraussichtlich ab ${availableFrom} verfügbar.`;
}
