import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {renderSite,safeURL} from '../assets/render.js';
export const root = resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function validate(m) {
 assert.equal(m.schema_version,1);
 const ids=new Set();
 function id(value){assert.equal(typeof value,'string');assert.match(value,/^[\w-]+$/);assert(!ids.has(value),'Doppelte ID: '+value);ids.add(value);}
 assert(Object.keys(m.typen).length>0);
 const expectedDays=(Date.parse(m.reise.bis)-Date.parse(m.reise.von))/86400000+1;
 assert.equal(m.tage.length,expectedDays,'Alle Reisetage müssen vorhanden sein');
 const usedA=new Set(),usedR=new Set();
 for(const [key,a] of Object.entries(m.aktivitäten)) {
  id(a.id);assert.equal(key,a.id);assert(m.typen[a.typ],'Unbekannter Typ '+a.typ);
  for(const field of ['name','ort','typ','bild_alt','beschreibung','herkunft','priorität']) assert.equal(typeof a[field],'string',a.id+': '+field);
  for(const field of ['dauer','tageszeit','startzeit','endzeit','reservierung','preis','link'])assert(field in a,a.id+': '+field+' fehlt');
  assert(a.bild_alt.trim().length>0);assert(a.beschreibung.trim().length>20);
  assert.match(a.beschreibung,/\b[Ww]ir\b|\buns\b/,'Beschreibung aus unserer Sicht: '+a.id);
  assert(['fest','geplant','optional','gestrichen','zu_prüfen'].includes(a.status));
  assert(safeURL(a.bild.url,true));assert(a.bild.url.startsWith('assets/images/'),'Bilder werden lokal ausgeliefert');
  assert(existsSync(resolve(root,a.bild.url)),'Bild fehlt: '+a.bild.url);assert(safeURL(a.bild.quelle));
 }
 for(const [key,r] of Object.entries(m.verbindungen)) {
  id(r.id);assert.equal(key,r.id);
  for(const field of ['von','nach','verkehrsmittel','startzeit','ankunft','fahrtzeit','gehzeit_start','gehzeit_ziel','gesamtdauer','route_link'])assert(field in r,r.id+': '+field+' fehlt');
  assert(safeURL(r.route_link));
  for(const ref of ['von_ref','nach_ref'])if(r[ref])assert(m.aktivitäten[r[ref]],'Unbekannter Bezug '+r[ref]);
 }
 m.tage.forEach((d,i)=>{
  id(d.id);assert.equal(d.datum,new Date(Date.parse(m.reise.von)+i*86400000).toISOString().slice(0,10));
  assert.equal(d.wochentag,new Intl.DateTimeFormat('de-DE',{weekday:'long',timeZone:'UTC'}).format(new Date(d.datum)));
  for(const [index,item] of d.ablauf.entries()) {
   assert.equal(Object.keys(item).length,1);
   if(item.aktivität){assert(m.aktivitäten[item.aktivität]);assert(!usedA.has(item.aktivität),'Aktivität doppelt geplant');usedA.add(item.aktivität);if(index&&!d.auswahltag)assert(!d.ablauf[index-1].aktivität,'Verbindung fehlt zwischen Aktivitäten');}
   else {assert(m.verbindungen[item.verbindung]);assert(!usedR.has(item.verbindung));usedR.add(item.verbindung);}
  }
  for(const key of d.alternativen){assert(m.aktivitäten[key]);assert(!usedA.has(key));usedA.add(key);}
 });
 assert.equal(usedA.size,Object.keys(m.aktivitäten).length,'Nicht dargestellte Aktivitäten');
 assert.equal(usedR.size,Object.keys(m.verbindungen).length,'Nicht dargestellte Verbindungen');
 for(const t of m.todos){id(t.id);assert(t.aufgabe);assert(['offen','erledigt','wartet'].includes(t.status));}
 const html=renderSite(m);
 assert.equal((html.match(/<article class="activity/g)||[]).length,usedA.size);
 assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));
 return {tage:m.tage.length,aktivitäten:usedA.size,verbindungen:usedR.size,todos:m.todos.length};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(validate(JSON.parse(readFileSync(resolve(root,'data/reise.json'),'utf8'))));
