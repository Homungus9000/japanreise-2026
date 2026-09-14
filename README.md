# Japanreise 2026 – Familienseite

Live: https://homungus9000.github.io/japanreise-2026/

Die Website besteht aus einer eigenständigen `index.html`. Der Reiseplan liegt darin verschlüsselt und wird nach Passworteingabe im Browser geöffnet. Keine Datenbank, keine externe Datenquelle, keine Passwortübertragung oder dauerhafte Speicherung. Nach Neuladen ist der Zugang wieder gesperrt.

Verschlüsselung: AES-256-GCM, PBKDF2-SHA-256 mit 600.000 Iterationen, zufälligem Salt und IV. Ein kurzes Passwort schützt nur begrenzt vor systematischem Durchprobieren; es gibt bei statischem Hosting keine serverseitige Zugriffskontrolle.

Änderungen: Den HTML-Reiseplan ausschließlich lokal außerhalb des Repositorys bearbeiten. Mit `node scripts/protect.mjs /pfad/zur/lokalen/index.html` neu verschlüsseln; das Passwort über Standardeingabe übergeben. Niemals Passwort oder entschlüsselte Reiseinhalte committen. GitHub Pages veröffentlicht die Wurzel von `main`.

`npm test` prüft Verschlüsselung und falsche Passwörter; `npm run build` prüft die geschützte Datei. Alte Seiten, Klartextdaten und nicht mehr verwendete Bild-Assets werden aus dem Veröffentlichungsstand entfernt. Bereits veröffentlichte Kopien und die Git-Historie sind dadurch nicht nachträglich geschützt.
