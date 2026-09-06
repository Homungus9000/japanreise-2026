export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHTML;
export function safeURL(value, image = false) {
  if (typeof value !== 'string') return null;
  if (image && /^assets\/images\/[a-zA-Z0-9_.-]+$/.test(value)) return value;
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}
const link = (url, label) => safeURL(url) ? `<a href="${e(safeURL(url))}" target="_blank" rel="noopener noreferrer">${e(label)} <span aria-hidden="true">↗</span></a>` : '';
const val = value => value === null || value === undefined || value === '' ? 'Noch offen' : typeof value === 'object' ? JSON.stringify(value) : String(value);
const fact = (label, value) => `<div><dt>${e(label)}</dt><dd>${e(val(value))}</dd></div>`;
const noteList = values => Array.isArray(values) && values.length ? `<ul>${values.map(v => `<li>${e(val(v))}</li>`).join('')}</ul>` : '';
export function localTime(value) {
  if (!value) return null;
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}):\d{2}([+-]\d{2}:\d{2})$/);
  return m ? `${m[3]}.${m[2]}. ${m[4]} (UTC${m[5]})` : value;
}
const statusNames = {fest:'Fest / gebucht',geplant:'Geplant',optional:'Optional',gestrichen:'Gestrichen',zu_prüfen:'Zu prüfen'};
const badge = (status) => `<span class="badge ${e(status)}">${e(statusNames[status] || status)}</span>`;
export function renderActivity(a, types) {
  const type = types[a.typ];
  const time = a.startzeit ? `${a.zeit_hinweis ? a.zeit_hinweis + ' ' : ''}${localTime(a.startzeit)}${a.endzeit ? ' – '+localTime(a.endzeit) : ''}` : a.tageszeit || 'Zeit noch offen';
  const image = safeURL(a.bild.url, true);
  return `<article class="activity ${a.status === 'optional' ? 'is-optional' : ''} ${a.status === 'gestrichen' ? 'is-cancelled' : ''}" id="${e(a.id)}">
    <figure>${image ? `<img src="${e(image)}" alt="${e(a.bild_alt)}" width="1000" height="750" loading="lazy" decoding="async">` : ''}<figcaption>${e(a.bild.hinweis || a.bild_alt)} ${link(a.bild.quelle,a.bild.credit || 'Bildquelle')}</figcaption></figure>
    <div class="activity-body"><div class="card-top"><span class="category"><span aria-hidden="true">${e(type.icon)}</span> ${e(type.name)}</span>${badge(a.status)}</div>
    <h3>${e(a.name)}</h3><p class="timing">${e(time)}</p><p class="description">${e(a.beschreibung)}</p>
    <dl class="facts">${fact('Dauer',a.dauer)}${fact('Herkunft',a.herkunft)}${fact('Priorität',a.priorität)}</dl>
    ${a.reservierung ? `<p class="reservation">${e(a.reservierung)}</p>` : ''}${a.preis ? `<p class="price">${e(a.preis)}</p>` : ''}${a.aktueller_hinweis ? `<p>${e(a.aktueller_hinweis)}</p>` : ''}
    <details class="more"><summary>Ort, Quellen & Details</summary><dl>${fact('Ort',a.ort)}${a.grund ? fact('Auswahlgrund',a.grund):''}</dl>
    <p>${link(a.link,'Information / Buchung')} ${link('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a.name+' '+a.ort),'Ort auf der Karte')}</p>
    ${a.notizen?.length ? '<h4>Frühere Planungsnotizen</h4>'+noteList(a.notizen):''}${a.quellen?.length ? '<h4>Quellenverweise</h4>'+noteList(a.quellen):''}</details></div></article>`;
}
export function renderConnection(r) {
  const mode = r.verkehrsmittel || 'Verkehrsmittel noch offen';
  const icon = /Fuß/.test(mode) ? '🚶' : /Shuttle|Taxi|Bus/.test(mode) ? '🚐' : /Shinkansen|JR|Metro|Zug|Express|Kintetsu|Railway|Thunderbird/.test(mode) ? '🚆' : '↳';
  return `<div class="connection" id="${e(r.id)}"><div class="connection-title"><span aria-hidden="true">${icon}</span><strong>${e(mode)}</strong>${r.optional ? '<span class="badge optional">Nur bei Auswahl</span>' : ''}</div>
    <p class="endpoints">${e(r.von)} <span aria-hidden="true">→</span> ${e(r.nach)}</p>
    <dl class="route-facts">${fact('Start',localTime(r.startzeit))}${fact('Ankunft',localTime(r.ankunft))}${fact('Fahrt',r.fahrtzeit)}${fact('Weg zum / vom Verkehrsmittel',r.gehzeit_start || r.gehzeit_ziel ? `${val(r.gehzeit_start)} / ${val(r.gehzeit_ziel)}` : null)}${r.gesamtdauer ? fact('Gesamt',r.gesamtdauer):''}</dl>
    ${r.reservierung ? `<p class="reservation">${e(r.reservierung)} · Uhrzeit noch zu prüfen</p>` : ''}<div class="connection-bottom">${link(r.route_link,'Route öffnen')}<details><summary>Verbindungsdetails</summary><dl>${fact('Status',statusNames[r.status])}${fact('Herkunft',r.herkunft)}${fact('Startstation',r.bahnhof_start)}${fact('Zielstation',r.bahnhof_ziel)}${fact('Linie',r.linie)}</dl><p>${e(r.notiz)}</p>${r.reservierung ? `<p>${e(r.reservierung)}</p>`:''}${r.preis ? `<p>${e(r.preis)}</p>`:''}${noteList(r.notizen)}${noteList(r.quellen)}</details></div></div>`;
}
export function renderSite(model) {
  const acts = model.aktivitäten;
  const hotels = Object.fromEntries(model.hotels.map(h => [h.id,h]));
  const names = Object.fromEntries([...Object.values(acts).map(a=>[a.id,a.name]),...model.hotels.map(h=>[h.id,h.name])]);
  const nav = model.tage.map(d=>`<a href="#${e(d.id)}">${d.datum.slice(8)}.${d.datum.slice(5,7)}. <span>${e(d.ort)}</span></a>`).join('');
  const days = model.tage.map((d,index)=>`<section class="day" id="${e(d.id)}"><header class="day-heading"><p class="eyebrow">Tag ${index+1} · ${e(d.wochentag)} · ${d.datum.slice(8)}.${d.datum.slice(5,7)}.</p><h2>${e(d.titel)}</h2>${hotels[d.übernachtung] ? `<p class="hotel">Übernachtung: ${e(hotels[d.übernachtung].name)}</p>`:''}</header>
    ${d.ablauf.every(item=>item.aktivität ? acts[item.aktivität].status==='optional' : true) ? '<p class="notice">Freier Tag: Diese Optionen sind Alternativen. Wir wählen zuerst aus und legen dann die Wege fest.</p>':''}
    <div class="timeline">${d.ablauf.map(item=>item.aktivität ? renderActivity(acts[item.aktivität],model.typen) : renderConnection(model.verbindungen[item.verbindung])).join('')}</div>
    ${d.alternativen.length ? `<details class="alternatives"><summary>Weitere Ideen & Optionen (${d.alternativen.length})</summary><p>Frühere Vorschläge zur Auswahl; keine zusätzlichen Pflichttermine.</p>${d.alternativen.map(id=>renderActivity(acts[id],model.typen)).join('')}</details>`:''}
    <details class="day-notes"><summary>Tagesnotizen & bisherige Wegplanung</summary>${d.wetteralternative?`<p>Wetteralternative: ${e(d.wetteralternative)}</p>`:''}${noteList(d.notizen)}
    <p>Die Karten oben zeigen den aktuellen Ablauf. Diese Wege stammen aus dem älteren Detailplan und bleiben zum Abgleich erhalten; die Reihenfolge kann abweichen.</p>
    ${d.fruehere_wegplanung.map(r=>`<div class="legacy-route"><strong>${e(names[r.von]||r.von)} → ${e(names[r.nach]||r.nach)}</strong><dl>${fact('Verkehrsmittel',r.verkehrsmittel)}${fact('Fahrtzeit',r.fahrtzeit)}${fact('Gehzeit',r.gehzeit)}${fact('Stationen',r.bahnhof_haltestelle)}</dl><p>${e(r.notiz)}</p></div>`).join('')}</details></section>`).join('');
  return `<div class="intro"><p class="notice">${e(model.reise.hinweis)}</p><p>Optionale Aktivitäten sind gekennzeichnet und bleiben eine Auswahl. Angaben zu Angeboten sind keine Buchungsbestätigung.</p></div><nav class="day-nav" aria-label="Reisetage">${nav}<a href="#todos">To-dos</a></nav>${days}
  <section class="todos" id="todos"><p class="eyebrow">Vor der Reise</p><h2>Unsere To-dos</h2><ul>${model.todos.map(t=>`<li><span class="todo-state">${t.status==='erledigt'?'✓ Erledigt':t.status==='wartet'?'◷ Wartet':'○ Offen'}</span><span>${e(t.aufgabe)}</span></li>`).join('')}</ul></section>
  <details class="sources"><summary>Hotels & Quellen</summary>${model.hotels.map(h=>`<h3>${e(h.name)}</h3><dl>${fact('Aufenthalt',h.check_in_datum+' bis '+h.check_out_datum)}${fact('Nächte',h.naechte)}${fact('Zimmer',h.zimmer)}${fact('Verpflegung',h.verpflegung)}${fact('Status',h.status)}</dl>`).join('')}<p>${e(model.reise.datenhinweis)}</p>${noteList(model.quellen)}<p>Stand: ${e(model.reise.stand)}</p></details>`;
}
