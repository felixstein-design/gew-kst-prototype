# Gewerbesteuer MVP Prototype — Behavior Spec

Source: [FigJam GewSteuer](https://www.figma.com/board/L6eZgVvTyt7c3BLk7UKyqb/Bookclosing-Exploration?node-id=869-8046) · `Inbox/Table.png`, `Inbox/berechnung.png`

## FigJam screen map

| FigJam | Prototype file |
|--------|----------------|
| Screen 1 | `01_dashboard-empty.html` |
| Modal | Modal on Screen 1 (+ duplicate on updated dashboard) |
| Screen 2 + sidepanel | `02_bemessungsgrundlagen.html` |
| Screen 3 | `03_berechnung.html` |
| Screen 4 | `04_erklaerung_pruefen.html` |
| Screen 5 | `05_uebermittlung.html` |
| Screen 1 updated | `05_dashboard-in-progress.html` · `06_dashboard-saved.html` · `07_dashboard-eingereicht.html` |

## Wizard (4 steps)

1. Bemessungsgrundlagen  
2. Berechnung  
3. Erklärung prüfen  
4. Übermittlung  

No separate Einreichen step.

## Demo numbers (consistent across screens)

| Step | Key value |
|------|-----------|
| Bemessungsgrundlagen | Gewerbeertrag **53.714,47** (57.902 + 3.799 − 7.987) |
| Berechnung | Steuermessbetrag **1.879,50** · Hebesatz **0** default (manual) · Gewerbesteuer = Messbetrag × Hebesatz (live) |
| Übermittlung | Steuerschuld = Gewerbesteuer from step 3 (via sessionStorage) |
| Dashboard (gespeichert) | Gewerbeertrag **53.714,47** · Steuermessbetrag **1.879,50** · Gewerbesteuer from wizard (sessionStorage) |

## Happy paths

- **Speichern:** `01` → Modal → `02` → `03` → `04` → `05` (Jetzt nicht einreichen) → **Speichern** → `06` (Gespeichert)
- **Senden:** `01` → … → `05` (Sofort einreichen) → **Senden** → `07` (Eingereicht)

## Key behaviors

| Behavior | Implementation |
|----------|----------------|
| Screen 2 table | Row labels from `Table.png`; Open on Entgelte für Schulden |
| Manual override | Orange warning icon at cell start only after editing a green autofill value |
| Side panel | Sync banner (blue) or override banner (orange) depending on cell state |
| Screen 3 | `berechnung.png` — Hebesatztabelle link → [regionalstatistik.de](https://www.regionalstatistik.de/genesis/online?language=de&sequenz=tabelleAufbau&selectionname=71231-03-01-5#astructure) on Hebesatz row |
| Generate entry | Checkbox off by default; check to show bookings |
| Screen 4 | **Erklärung prüfen** — full-page form viewer (official Vordruck JPG pages + typed values); export via pdf-lib |
| Screen 5 | Übermittlung — radio cards, Steuerschuld summary, client email |
| Finish later | → `05_dashboard-in-progress`, In Bearbeitung |
| Footer buttons | Centered as a group on wizard screens |
| Dashboard table | Zeitraum · Erstellt von · Status · Zuletzt geändert · Gewerbeertrag · Steuermessbetrag · Gewerbesteuer · Buchungssätze · Aktionen |
| Dashboard Ansehen | → `04_erklaerung_pruefen.html` (Eingereicht) |

### GewSt 1 A — filled fields (Screen 4)

| Form page | Zeile | Wert (Demo) |
|-----------|-------|-------------|
| 1 | 1–2 Finanzamt, Steuernummer | Berlin Mitte · 27/123/45678 |
| 1 | 3 Unternehmen/Firma | Hausmann & Partner GmbH |
| 1 | 4 Gegenstand | IT-Dienstleistungen |
| 2 | 30–31 Betriebsstätte | 10115 Berlin |
| 2 | 39 Gewinn | 54.612,36 |
| 3 | 50 Entgelte für Schulden | 161,10 |
| 3 | 53 Miete bewegliche WG | 6.596,52 |
| 3 | 55 Miete unbewegliche WG | 23.115,97 |
| 3 | 56 Lizenzen | 8.632,23 |
| 5 | 89d Kürzung Gewinnanteile | 7.987,00 |

Assets: `Prototypes/assets/gewst1a/page-1.jpg` … `page-9.jpg`. Export composes filled pages client-side via pdf-lib.

## Out of scope

- ELSTER live submit errors, Fehlgeschlagen rows
