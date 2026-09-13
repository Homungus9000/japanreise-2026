import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.equal((html.match(/<details class="day"/g)||[]).length,17,'17 Reisetage');
assert.ok(!/<script|<link[^>]+stylesheet|fetch\(|reise\.json/i.test(html),'Seite muss eigenständig sein');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Eindeutige Sprungziele');
for (const [,href] of html.matchAll(/href="([^"]+)"/g)) {
 if(href.startsWith('#')) { assert.ok(ids.includes(href.slice(1))); continue; }
 const url=new URL(href.replaceAll('&amp;','&'));
 assert.equal(url.protocol,'https:');
 if(url.pathname==='/maps/dir/') {
  assert.ok(url.searchParams.get('origin')); assert.ok(url.searchParams.get('destination'));
  assert.ok(['walking','transit','driving'].includes(url.searchParams.get('travelmode')));
  assert.ok(!url.searchParams.has('waypoints'),'Keine Tagesgesamtrouten');
 }
}
console.log('Eigenständige HTML-Seite, 17 Tage, Sprungziele und Kartenlinks geprüft.');
