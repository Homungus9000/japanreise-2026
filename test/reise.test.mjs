import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate,root} from '../scripts/validate.mjs';
import {renderActivity,renderConnection,renderSite,localTime,safeURL} from '../assets/render.js';
const m=JSON.parse(readFileSync(root+'/data/reise.json','utf8'));
const onDay=(date,id)=>m.tage.find(d=>d.datum===date).ablauf.some(item=>item.aktivität===id);
test('Vollständigkeit, Datenmodell, lokale Bilder und eindeutige Darstellung',()=>validate(m));
test('Aktueller Master hat Vorrang vor dem älteren Reiseplan',()=>{
 assert.equal(m.tage.length,17);assert.equal(m.todos.length,14);
 assert(onDay('2026-10-19','A-20-fuji'));assert(!onDay('2026-10-20','A-20-fuji'));
 assert(onDay('2026-10-26','A-28-tee'));assert(onDay('2026-10-27','A-27-gioncorner'));
 assert(onDay('2026-10-23','A-22-higashi'));assert(onDay('2026-10-24','A-23-gartentour'));
 for(const [id,start,end] of [['A-19-teamlab','11:30','14:15'],['A-19-sky','16:20','18:00'],['A-27-gioncorner','19:00',null]]){
  assert.equal(m.aktivitäten[id].startzeit,start);assert.equal(m.aktivitäten[id].endzeit,end);
 }
 assert.equal(m.aktivitäten['A-20-fuji'].herkunft,'Daniel');
 assert.equal(m.aktivitäten['A-28-usj'].status,'gestrichen');
 assert.equal(m.aktivitäten['A-19-sushi'].preis,'98 EUR pro Person');
 assert.equal(m.aktivitäten['A-24-inami'].preis,'323 EUR für alle 3 Personen');
 assert.equal(m.aktivitäten['A-28-samurai'].herkunft,'Reisebüro');
});
test('Alle bisherigen öffentlichen To-dos bleiben wortgleich erhalten',()=>{
 const prior=readFileSync(root+'/data/previous-master.md','utf8');
 const tasks=prior.split('## To-dos\n')[1].split('## Quellen')[0].split('\n').filter(x=>x.startsWith('- [ ] ')).map(x=>x.slice(6));
 assert.deepEqual(m.todos.map(t=>t.aufgabe),tasks);
});
test('Karten zeigen Pflichtfelder ohne Aufklappen, Optionen sind eindeutig',()=>{
 const a=m.aktivitäten['A-19-sushi'];const html=renderActivity(a,m.typen);const main=html.split('<details')[0];
 for(const x of ['Optional','Reisebüro','1,5 Stunden','wenn-Zeit',a.beschreibung,a.name,'<img'])assert(main.includes(x));
 assert(html.includes('is-optional'));
 const r=Object.values(m.verbindungen).find(r=>!r.startzeit);const route=renderConnection(r);
 for(const x of ['Start','Ankunft','Fahrt','Noch offen','Route öffnen'])assert(route.includes(x));
});
test('Masteränderungen erscheinen direkt im Renderer, ohne statische Tagesdaten',()=>{
 const copy=structuredClone(m);copy.aktivitäten['A-19-teamlab'].name='Aktualisierter Name';
 assert(renderSite(copy).includes('Aktualisierter Name'));
 assert(!readFileSync(root+'/index.html','utf8').includes('teamLab'));
});
test('Texte und URLs aus dem Master können kein HTML einschleusen',()=>{
 const a={...m.aktivitäten['A-19-teamlab'],name:'<script>alert(1)</script>',link:'javascript:alert(1)'};
 const html=renderActivity(a,m.typen);
 assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('javascript:'));
 assert.equal(safeURL('javascript:alert(1)'),null);assert.equal(safeURL('assets/images/../../secret',true),null);
});
test('Flugzeiten behalten Datum und Zeitzone; unbekannte Dauer bleibt offen',()=>{
 assert.equal(localTime('2026-10-16T20:10:00+02:00'),'16.10. 20:10 (UTC+02:00)');
 assert.equal(localTime(null),null);
 assert.equal(m.aktivitäten['A-16-flug'].endzeit,'2026-10-17T16:15:00+09:00');
 assert.equal(m.aktivitäten['A-01-flug'].endzeit,'2026-11-01T17:00:00+01:00');
});
