# Japanreise 2026

[GitHub-Pages-Reiseplan öffnen](https://homungus9000.github.io/japanreise-2026/)

## Reiseplan pflegen

Nur **`data/reise.json`** ändern. Die Website lädt diese strukturierte Masterdatei direkt. `index.html` ist lediglich die Hülle; `assets/render.js` erzeugt alle Karten, Wege, Tagesüberschriften, Hotels und To-dos aus den Daten. Es gibt keine separat zu pflegenden statischen Tagesinhalte.

- Aktivität ändern: Datensatz unter `aktivitäten` bearbeiten.
- Aktivität verschieben: die stabile ID in `tage[].ablauf` umordnen und passende Verbindungen anpassen. IDs können deshalb eine frühere Tagesnummer enthalten.
- Neue Aktivität: Pflichtfelder nach bestehendem Datensatz ergänzen, `typ` aus `typen` wählen und die ID in einen Tag aufnehmen.
- Neues Bild: lokal in `assets/images/` ablegen; `bild.url`, `bild.quelle`, `bild.hinweis` und `bild_alt` pflegen. Beispiel- und Umgebungsmotive ausdrücklich als solche kennzeichnen.
- Verbindungen: unbekannte Zeiten als `null` lassen. Route-Links dienen zum Nachschlagen, nicht als bestätigter Fahrplan.
- Optionen bleiben `optional`, verworfene Ideen `gestrichen`. Eine reservierte Verbindung kann weiterhin eine ungeklärte Uhrzeit haben.
- To-dos sind aus dem Master gerendert; eine Statusänderung wird ebenfalls dort gepflegt.

`Japanreise_2026_MASTER.md` erklärt das Modell und verlinkt die Daten. `data/previous-master.md` bewahrt den vorherigen öffentlichen Stand als historischen Vergleich. Er wird nicht weiterbearbeitet.

## Prüfung und Veröffentlichung

Node.js ab Version 20; keine Paketinstallation und keine externen Laufzeitbibliotheken nötig:

```sh
npm test
npm run build
```

`build` prüft alle Datensätze, Verweise, Bilder und die vollständige HTML-Erzeugung. Es erzeugt absichtlich keine zweite Kopie des Reiseplans. Anschließend Änderungen auf `main` committen und pushen; die vorhandene GitHub-Pages-Veröffentlichung aus dem Repository-Root bleibt bestehen. GitHub Actions führt dieselben Prüfungen bei Push und Pull Request aus.

Zur lokalen Vorschau einen HTTP-Server im Repository starten, zum Beispiel `python3 -m http.server 8765`. Das direkte Öffnen von `index.html` als Datei funktioniert wegen des JSON-Ladevorgangs nicht.

## Quellen und Migration

Der zuletzt veröffentlichte GitHub-Master bestimmt Tage, Reihenfolge und Zeiten. Der ausführliche ältere lokale Master ergänzt Herkunft, Reisebüro-Angebote, Preise und Detailnotizen. Beispiele: FUJIFILM steht nun am 19.10., Higashi Chaya am 23.10., die Gartentour als Option am 24.10. und die Teezeremonie am 26.10. Frühere Notizen und Wegplanungen bleiben gekennzeichnet zum Abgleich verfügbar.

Die Bilder stammen überwiegend aus den bereits verwendeten Japanreise-Dateien; weitere Motive wurden aus den verlinkten Quellen ergänzt. Optimierte lokale Kopien verhindern Abhängigkeiten von externen Bildservern beim Laden. Originalquelle und Bildbeschreibung stehen pro Aktivität im Master. Die Quelle ist keine pauschale Lizenzfreigabe; vorhandene Rechte verbleiben bei den jeweiligen Urhebern.
