import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const day = date => html.split(`id="tag-${date}"`)[1].split('</details>')[0];
test('Aktuelle Tokyo-Reihenfolge und Buchung',()=>{
 const t=day('19-10');
 assert.match(t,/11:00–14:00/);assert.match(t,/Tickets fest gebucht/);
 assert.match(t,/14:20–15:15/);assert.match(t,/16:00–17:30/);
 assert.ok(t.indexOf('<h3>teamLab')<t.indexOf('<h3>FUJIFILM'));
 assert.ok(t.indexOf('<h3>FUJIFILM')<t.indexOf('<h3>Shibuya Sky'));
});
test('Guide bleibt ein Tagespunkt; Museum fest; keine Hotelpause am 21.',()=>{
 assert.equal((day('18-10').match(/<h3>Privater Tokyo-Guide/g)||[]).length,1);
 assert.match(day('21-10'),/10:45–12:45/);assert.match(day('21-10'),/Hiroshige/);
 assert.ok(!/<h3>[^<]*Hotelpause/.test(day('21-10')));
});
test('Familienlisten und letzter Abend vorhanden',()=>{
 assert.match(html,/id="todos"/);assert.match(html,/id="packliste"/);
 assert.match(html,/Telezoom – unbedingt/);assert.match(html,/3 Reiseadapter mit USB/);
 assert.match(day('31-10'),/SKY BUS Tokyo/);
});
