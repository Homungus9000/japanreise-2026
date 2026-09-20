# Japanreise 2026 – geschützte Familienseite

Live: https://homungus9000.github.io/japanreise-2026/

Dieses öffentliche Repository ist das Veröffentlichungsziel. `index.html` enthält den verschlüsselten Reiseplan und wird nach Passworteingabe im Browser geöffnet. Das Passwort wird weder übertragen noch dauerhaft gespeichert.

## Inhalte ändern

Die einzige aktive Inhaltsquelle liegt im **privaten** Repository [Homungus9000/japanreise-2026-source](https://github.com/Homungus9000/japanreise-2026-source):

- `Japanreise_2026_MASTER.md`: Reiseplan, Texte, Zeiten, Links, To-dos und Packliste.
- `assets/`: Bilder und QR-Codes.
- `template.html`: Layout.
- `build.py`: deterministischer Generator.

Hier **keine Klartext-Reiseinhalte, Masterdateien, Bilder oder Passwörter hochladen**. `index.html` nicht manuell bearbeiten. Kleine Inhaltsänderungen gehören ausschließlich in den passenden privaten Master-Abschnitt bzw. in private Assets.

Die GitHub Action im privaten Repository prüft Änderungen und kann anschließend ausschließlich die verschlüsselte `index.html` hier aktualisieren. Zur einmaligen Aktivierung sind die Secrets und die Freigabevariable gemäß der [privaten Anleitung](https://github.com/Homungus9000/japanreise-2026-source#einmalige-aktivierung-der-veröffentlichung) erforderlich. GitHub Pages veröffentlicht weiterhin `main` → `/ (root)`; ein automatischer Push mit dem Deploy-Key löst das bestehende Pages-Deployment aus.

## Schutz und Prüfungen

AES-256-GCM, PBKDF2-SHA-256 mit 600.000 Iterationen, zufälligem Salt und IV. Kurze Passwörter können systematisch durchprobiert werden; statisches Hosting bietet keine serverseitige Zugriffskontrolle. Alte bereits veröffentlichte Kopien und frühere Git-Historie werden nicht rückwirkend geschützt.

`npm test` prüft die Verschlüsselung einschließlich falscher Passwörter. `npm run build` prüft die geschützte Veröffentlichungsdatei. To-dos und Packliste zeigen feste Statusanzeigen; Änderungen erfolgen in der privaten Masterdatei.
