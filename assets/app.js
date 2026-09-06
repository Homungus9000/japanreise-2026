import {renderSite} from './render.js';
const app = document.getElementById('app');
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
  } catch {
    app.innerHTML='<div class="notice" role="alert"><h2>Der Reiseplan konnte nicht geladen werden.</h2><p>Bitte die Verbindung prüfen und erneut laden. Die <a href="data/reise.json">Masterdaten</a> sind auch direkt abrufbar.</p><button type="button" id="retry">Erneut laden</button></div>';
    document.getElementById('retry').addEventListener('click',load,{once:true});
  }
}
load();
