# Japanreise 2026 – MASTER

```yaml
reise:
  titel: "Japanreise Familie Niederehe 2026"
  von: "2026-10-16"
  bis: "2026-11-01"
  reisende: 3
  status: "Arbeitsstand"
  masterquelle: true
  zeitlogik: "AKTIVITÄT → VERBINDUNG → AKTIVITÄT"
  statuswerte: [fest, geplant, optional, gestrichen, zu_prüfen]
  herkunftswerte: [Reisebüro, Daniel, Miriam, ChatGPT]
```

## Datenmodell

### AKTIVITÄT
```yaml
aktivität:
  name:
  ort:
  typ:
  status:
  priorität:
  herkunft:
  tageszeit:
  startzeit:
  dauer:
  endzeit:
  reservierung:
  preis:
  link:
  beschreibung:
  grund:
  notizen:
```

### VERBINDUNG
```yaml
verbindung:
  von:
  nach:
  verkehrsmittel:
  bahnhof_start:
  bahnhof_ziel:
  linie:
  startzeit:
  fahrtzeit:
  gehzeit_start:
  gehzeit_ziel:
  gesamtdauer:
  ankunft:
  status:
  route_link:
  notiz:
```

## Grundregeln
- Gebuchte Flüge, Züge, Transfers und Hotels aus den Reiseunterlagen haben Vorrang.
- Noch nicht endgültig bestätigte Zug- und Shuttle-Uhrzeiten werden als **zu prüfen** markiert.
- Jeder Programmpunkt wird über eine VERBINDUNG mit dem nächsten Programmpunkt verbunden.
- Lokale Wege werden mit Verkehrsmittel, Stationen sowie Fahrt- und Gehzeiten gepflegt.
- Optionale Reisebüro-Aktivitäten stehen beim passenden Reisetag, nicht gesammelt am Ende.
- Die öffentliche Webseite wird aus diesem Master abgeleitet.

## Reiseverlauf

### 2026-10-16 · Freitag · Frankfurt → Tokyo
- **20:10** · Flug FRA → NRT · JL durchgeführt / Finnair Codeshare AY5826 · **fest**
- Ankunft: **17.10., 16:15** Ortszeit.

### 2026-10-17 · Samstag · Tokyo
- **16:15** · Landung Narita · **fest**
- VERBINDUNG: Narita → hotel MONday Premium Ueno Okachimachi · Shared Shuttle · Abholzeit **zu prüfen**
- Abend: Hotel-Check-in.
- Optional: Ameyoko / Okachimachi und leichtes Abendessen.

### 2026-10-18 · Sonntag · Tokyo
- Vormittag: Treffen mit deutschsprachigem Guide · Treffpunkt/Uhrzeit **zu prüfen**.
- Asakusa / Sensō-ji / Nakamise.
- VERBINDUNG: Asakusa → Shibuya · Tokyo Metro.
- Shibuya Crossing.
- Harajuku.
- Meiji Jingu.
- VERBINDUNG: Harajuku/Meiji → Shinjuku · JR Yamanote.
- Spätnachmittag: Tokyo Metropolitan Government Building.
- **ab 18:00** · TOKYO Night & Light.
- Abend: Shinjuku bei Nacht.

### 2026-10-19 · Montag · Tokyo
- **ca. 10:00** · FUJIFILM Imaging Plaza · Herkunft Daniel · Priorität unbedingt.
- VERBINDUNG: Marunouchi → Azabudai Hills · Metro.
- **ca. 11:30–14:15** · teamLab Borderless.
- VERBINDUNG: Azabudai Hills → Shibuya · Metro.
- **ca. 16:20–18:00** · Shibuya Sky; Sonnenuntergang ca. 17:01.
- Abend: Shibuya bei Nacht.

### 2026-10-20 · Dienstag · Tokyo
- Vormittag optional: Tsukiji Outer Market.
- Kaiserpalast / Marunouchi.
- Tokyo Station + Mittagessen.
- Optional: Sony Store Ginza.
- Ginza Mitsukoshi / Depachika.
- Abend: Izakaya.

### 2026-10-21 · Mittwoch · Tokyo
- Ueno Park / Shinobazu.
- Optional: Tokyo National Museum.
- Yanaka + Mittagessen/Café.
- Nezu Shrine.
- Hotelpause.
- Abend: Akihabara · Arcades · Gachapon · Anime/AKIRA.
- Optional: Maid Café / Izakaya.

### 2026-10-22 · Donnerstag · Tokyo → Kanazawa
- VERBINDUNG: Hotel → Tokyo Station · ÖPNV.
- VERBINDUNG: Tokyo Station → Kanazawa Station · Hokuriku Shinkansen · 1. Klasse reserviert · genaue Uhrzeit **zu prüfen**.
- VERBINDUNG: Kanazawa Station → Hotel Amanek Kanazawa · Bus/Taxi.
- Nachmittag: Nagamachi Samurai District.
- Abend: Katamachi.

### 2026-10-23 · Freitag · Kanazawa
- Vormittag: Kenroku-en.
- VERBINDUNG: Kenroku-en → Kanazawa Castle Park · zu Fuß.
- Kanazawa Castle Park.
- VERBINDUNG: Castle → Omicho Market · zu Fuß/Bus.
- Omicho Market + Mittagessen.
- VERBINDUNG: Omicho → Higashi Chaya · zu Fuß.
- Higashi Chaya District.
- Optional: Café / Goldblatt-Snack.

### 2026-10-24 · Samstag · Kanazawa
- Optional: Ninja-dera / Myoryuji.
- Optional: 21st Century Museum of Contemporary Art.
- Optional: Teramachi / Blattgold- oder Kimono-Manufaktur.
- Reisebüro-Alternativen: Gartentour + private Teezeremonie; Shirakawa-go & Gokayama; Inami Holzkunst.

### 2026-10-25 · Sonntag · Kanazawa → Kyoto
- VERBINDUNG: Hotel → Kanazawa Station.
- VERBINDUNG: Kanazawa → Kyoto via Tsuruga · Shinkansen + Thunderbird · reserviert · genaue Uhrzeit **zu prüfen**.
- VERBINDUNG: Kyoto Station → KOKO HOTEL Kyoto Sanjo.
- Nachmittag/Abend: Gion · Shirakawa · Pontocho · Yasaka.

### 2026-10-26 · Montag · Kyoto
- Früh: Kiyomizu-dera.
- Sannenzaka / Ninenzaka.
- Yasaka Shrine / Gion.
- Nachmittag: Teezeremonie · Anbieter/Ticket **zu buchen**.
- Optional: Samurai-Ninja-Erfahrung des Reisebüros.

### 2026-10-27 · Dienstag · Nara + Kyoto
- VERBINDUNG: Hotel → Kyoto Station.
- VERBINDUNG: Kyoto → Kintetsu-Nara · Kintetsu.
- Nara Park / Hirsche.
- Tōdai-ji.
- Kasuga Taisha.
- Naramachi + Mittagessen/Café.
- VERBINDUNG: Nara → Kyoto.
- Hotelpause / frühes Abendessen.
- **19:00** · Gion Corner · Maiko/Geiko & traditionelle Künste · Tickets **zu buchen**.

### 2026-10-28 · Mittwoch · Kyoto
- Früh: Fushimi Inari.
- VERBINDUNG: Fushimi Inari → Arashiyama · JR via Kyoto.
- Arashiyama Bambushain + Umgebung.
- Nachmittag frei / Erholung.
- Abend: Wäsche waschen.
- Universal Studios Osaka: **gestrichen**.

### 2026-10-29 · Donnerstag · Kyoto → Mishima → Shuzenji
- VERBINDUNG: Kyoto Station → Mishima · Tokaido Shinkansen reserviert · genaue Uhrzeit **zu prüfen**.
- VERBINDUNG: Mishima → Shuzenji · Izu-Hakone Railway Sunzu Line.
- VERBINDUNG: Shuzenji Station → Yukairou Kikuya · Bus/Taxi.
- Nachmittag: Ryokan / Onsen.
- Abend: Ryokan-Abendessen; Sonderkost vorher anmelden.

### 2026-10-30 · Freitag · Shuzenji
- Ryokan-Frühstück.
- Shuzenji Temple.
- Kleiner Bambuswald / Spaziergang.
- Café / Mittagessen.
- Nachmittag: bewusst frei / Onsen.
- Ryokan-Abendessen.

### 2026-10-31 · Samstag · Shuzenji → Tokyo
- VERBINDUNG: Ryokan → Shuzenji Station.
- VERBINDUNG: Shuzenji → Tokyo Station · Odoriko Express reserviert · genaue Uhrzeit **zu prüfen**.
- VERBINDUNG: Tokyo Station → Hotel Monte Hermana Tokyo · zu Fuß.
- Letzter Nachmittag als Joker.
- Optional: Odaiba bei Nacht / Abschiedsabend.

### 2026-11-01 · Sonntag · Tokyo → Frankfurt
- Früher Check-out.
- VERBINDUNG: Hotel → Narita Airport · Shared Shuttle · Abholzeit **zu prüfen**.
- **10:45** · Rückflug NRT → FRA · AY5827, durchgeführt von Japan Airlines.
- **17:00** · Ankunft Frankfurt Ortszeit.

## To-dos
- [ ] Guide am 18.10.: Treffpunkt und genaue Zeit bestätigen.
- [ ] teamLab Borderless für 19.10. buchen.
- [ ] Shibuya Sky für 19.10. ca. 16:20 buchen.
- [ ] Gion Corner 27.10., 19:00 – 3 Tickets buchen.
- [ ] Teezeremonie Kyoto auswählen und buchen.
- [ ] Zugnummern/-zeiten nach Ticketausgabe ergänzen.
- [ ] Shuttle-Zeiten nach Bekanntgabe ergänzen.
- [ ] Sonderkost Yukairou Kikuya anmelden.
- [ ] Visit Japan Web erledigen.
- [ ] 3 Reiseadapter mit USB.
- [ ] Mastercard für Ehefrau.
- [ ] Google Pay einrichten.
- [ ] WLAN-Connector vom Reisebüro.
- [ ] ICOCA-Karten nicht vergessen.

## Quellen
- Reisebüro: ausführlicher Reiseplan „Familie Niederehe – Ihre Reise nach Japan“.
- Reisebüro: Buchungsbestätigung / Flugdaten.
- Ergänzende offizielle Quellen werden bei Detailplanung und Fahrtzeiten je Programmpunkt dokumentiert.
