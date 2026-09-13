# Japanreise 2026 – Familienseite

Live: https://homungus9000.github.io/japanreise-2026/

Die vollständige Website steht in `index.html`: alle Reiseinhalte, eingebettetes CSS und native HTML-Tageskarten (`details` / `summary`). Keine Datenbank, kein JSON als Datenquelle, keine externen Skripte, kein Build erforderlich. Änderungen direkt in der HTML vornehmen.

`npm test` und `npm run build` prüfen die Seite; sie generieren keine Inhalte. GitHub Pages veröffentlicht die Wurzel von `main`.

Die älteren Dateien in `data/` und `assets/` sind nur noch historische Bestände und werden von der Familienseite nicht geladen. Sie sind keine aktuelle Planungsquelle.

Buchungen und Wunschzeiten klar auseinanderhalten. Kartenlinks zeigen entweder einen Ort oder genau eine Verbindung mit Verkehrsmittel. Checkboxen speichern keine Daten; sie dienen nur zum lokalen Abhaken. Für Ausdrucke alle gewünschten Tageskarten öffnen.
