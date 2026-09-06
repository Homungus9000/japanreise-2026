# Japanreise 2026 – Master

**Die einzige aktuelle Datenquelle ist [data/reise.json](data/reise.json).**

Die [Website](https://homungus9000.github.io/japanreise-2026/) liest diese Datei direkt. Diese Markdown-Datei enthält absichtlich keinen zweiten, separat zu pflegenden Reiseverlauf.

## Aufbau

- `reise`: Zeitraum, Stand und Planungsregeln.
- `typen`: zentrales Typ → Icon / Bezeichnung-Mapping.
- `tage`: 17 Tage; `ablauf` referenziert abwechselnd Aktivitäten und Verbindungen. `alternativen` enthält weitere Ideen. Ältere Wegplanungen sind ausdrücklich separat gekennzeichnet.
- `aktivitäten`: stabile IDs; Name, Ort, Typ, Bild, Bild-Alternativtext, Beschreibung in unserer Perspektive, Tageszeit, Start/Ende, Dauer, Herkunft, Status, Priorität und Buchungsdetails.
- `verbindungen`: Verkehrsmittel, Stationen, Linie, Start/Ankunft, Fahrt-/Gehzeit, Status und Route-Link. Reservierte Bahn- und Shuttle-Leistungen stehen hier.
- `todos`: Aufgabe und Status.
- `hotels` und `quellen`: erhaltene Unterkunfts- und Herkunftsangaben.

`null` bedeutet „noch offen“, niemals „0 Minuten“ oder „kostenlos“. Ungefähre Planungszeiten bleiben gekennzeichnet. Uhrzeiten sind Ortszeiten; Flüge enthalten Datums- und Zeitzonenangaben.

`optional` bedeutet Auswahl, nicht Zusatzpflicht. `gestrichen` bleibt sichtbar dokumentiert. Herkunft bezeichnet den Ursprung des Vorschlags; daraus folgt keine Buchung. IDs ändern sich beim Verschieben auf einen anderen Tag nicht.

Der [vorherige öffentliche Master](data/previous-master.md) ist ein unveränderter historischer Vergleichsstand, keine aktive Datenquelle. Er wird nicht parallel fortgeschrieben.
