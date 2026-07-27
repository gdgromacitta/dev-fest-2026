# DevFest Roma 2026 — Piano implementativo della mascotte AI

**Stato:** implementato e validato localmente; deploy remoto non ancora eseguito  
**Data:** 24 luglio 2026  
**Repository:** `gdgromacitta/dev-fest-2026`  
**Obiettivo:** portare nel sito DevFest Roma una guida AI equivalente a Gibby, sostituendo il
gibbone con una lupetta DevFest e mantenendo il codice il più possibile segregato dal resto
dell'applicazione.

## 1. Sintesi

La portabilità funzionale della mascotte del sito personale è stimata intorno all'80–85%.
Possono essere riutilizzati quasi integralmente:

- gestione stateless della conversazione;
- streaming SSE;
- stati visivi `idle`, `hover`, `thinking`, `speaking`, `success`, `error`;
- eye tracking;
- validazione Pydantic della cronologia;
- limiti di conversazione e output;
- rate limiting;
- integrazione Pydantic AI;
- osservabilità Logfire;
- accessibilità e gestione `prefers-reduced-motion`.

Non è possibile una copia infrastrutturale 1:1. Il sito personale ospita frontend Next.js e
backend FastAPI nello stesso progetto Vercel, mentre DevFest viene esportato staticamente e
pubblicato su GitHub Pages. GitHub Pages non può eseguire `/api/guide`.

La soluzione raccomandata è:

1. mantenere invariato il deploy statico su GitHub Pages;
2. isolare il backend della mascotte in un sottoprogetto Python;
3. distribuire tale sottoprogetto separatamente su Vercel;
4. collegare il frontend statico al backend tramite HTTPS, SSE e CORS;
5. mantenere un'unica integrazione minima nel layout del sito.

## 2. Obiettivi

- Offrire una mascotte in overlay, disponibile in tutte le pagine localizzate.
- Mantenere la conversazione esclusivamente nello stato React del browser.
- Inviare al backend l'intera cronologia a ogni richiesta.
- Rispondere in italiano o inglese in base al locale corrente.
- Fornire soltanto informazioni DevFest pubbliche e verificate.
- Non esporre contenuti provvisori, disabilitati o ancora non annunciati.
- Mantenere il backend read-only e privo di azioni con effetti esterni.
- Consentire un rollback immediato tramite feature flag.
- Rendere frontend e backend della mascotte eliminabili senza ristrutturare il sito.

## 3. Non obiettivi

- Memoria persistente fra refresh o dispositivi.
- Account utente o autenticazione dei visitatori.
- Invio di email, registrazioni o proposte CFP dalla chat.
- Navigazione web autonoma.
- Modifica dei contenuti del sito.
- Sostituzione dell'attuale sistema editoriale TypeScript/`next-intl`.
- Migrazione dell'intero sito da GitHub Pages a Vercel.
- Utilizzo di Rive nella prima versione.

La prima versione continuerà a usare SVG React e CSS Modules, come la mascotte personale.

## 4. Vincoli rilevati

### 4.1 Deploy statico

`next.config.ts` contiene `output: "export"` e la pipeline GitHub Actions pubblica `out/` su
GitHub Pages. Il frontend non può quindi contenere API route o funzioni Python eseguite dallo
stesso host.

### 4.2 Internazionalizzazione

Le pagine sono prefissate con `/it` e `/en` e avvolte da `NextIntlClientProvider`.
L'interfaccia della mascotte deve usare un namespace dedicato in:

- `messages/it.json`;
- `messages/en.json`.

### 4.3 Contenuti provvisori

Il repository contiene dati non ancora pubblicabili:

- `features.agenda` è disabilitato;
- `features.speakers` è disabilitato;
- alcune sessioni e alcuni speaker sono placeholder;
- la homepage pubblica riporta il 10 ottobre 2026;
- i dati di esempio delle sessioni riportano il 21 novembre 2026.

Il backend non deve leggere indiscriminatamente tutti i contenuti del repository.

### 4.4 Permessi

L'utente dispone attualmente di permesso GitHub `push`, ma non dei ruoli `maintain` o `admin`.
Può implementare, pushare un branch e aprire una PR, ma il merge, le impostazioni del repository
e gli eventuali secret richiedono i permessi previsti dalle regole dell'organizzazione.

Sul collegamento Vercel corrente è visibile soltanto il team personale. Una preview può essere
distribuita autonomamente, mentre il deploy ufficiale dovrebbe appartenere a un team GDG.

## 5. Architettura

```text
devfest2026.gdgromacitta.it
GitHub Pages — static export
          │
          │ POST JSON + streaming SSE
          ▼
guide-api.devfest2026.gdgromacitta.it
Vercel Python Function / FastAPI
          │
          ├── Pydantic AI
          ├── OpenAI Responses API
          ├── tool read-only DevFest
          ├── Upstash rate limiting
          └── Logfire
```

### 5.1 Struttura proposta

```text
src/features/devfest-guide/
  DevFestGuideChat.tsx
  WolfMascot.tsx
  devfest-guide.module.css
  api-client.ts
  types.ts

services/devfest-guide-api/
  api/
    index.py
  devfest_guide/
    agent.py
    config.py
    knowledge.py
    models.py
    observability.py
    rate_limit.py
    service.py
    web.py
  data/
    devfest-knowledge.json
  tests/
    test_guide_api.py
    test_knowledge.py
  pyproject.toml
  uv.lock
  vercel.json
  README.md

tests/unit/devfest-guide/
  api-client.test.ts
  knowledge-consistency.test.ts
```

### 5.2 Punti di contatto con il sito

Le sole modifiche fuori dai folder della feature dovrebbero essere:

- aggiunta di `devfestGuide` in `src/content/features.ts`;
- import e rendering di `<DevFestGuideChat />` in `app/[locale]/layout.tsx`;
- namespace `devfestGuide` nei due file di traduzione;
- script di sviluppo e test in `package.json`;
- URL pubblico del backend durante il build;
- eventuale documentazione del deploy.

Non sono previste modifiche a header, footer, homepage, agenda, speaker, sponsor o venue.

## 6. Portabilità dei componenti esistenti

| Blocco | Riuso stimato | Adattamento |
|---|---:|---|
| Stato conversazione React | 90% | Nomi, i18n, endpoint |
| Stati visivi | 100% | Nessuno |
| Eye tracking | 100% | Applicazione agli occhi della lupetta |
| Parser SSE | 95% | URL remoto |
| Abort della risposta | 100% | Nessuno |
| Limite di sei turni | 100% | Testi localizzati |
| Validazione cronologia | 95% | Aggiunta del locale |
| Streaming Pydantic AI | 100% | Prompt e tool |
| Rate limiting | 85% | Produzione più rigida |
| Logfire | 90% | Decisione sulla cattura dei contenuti |
| Geometria SVG | 20–30% | Ridisegno completo |
| Animazioni SVG/CSS | 70–80% | Nuovi gruppi anatomici |
| Deploy | 40% | Backend separato e CORS |

## 7. Fase 1 — Audit dei contenuti pubblici

Prima dell'implementazione dei tool deve essere definito un insieme di informazioni verificato.

### Attività

1. Inventariare:
   - nome e descrizione dell'evento;
   - data e orari;
   - tema;
   - track;
   - venue e indicazioni;
   - CFP e scadenza;
   - registrazione;
   - FAQ;
   - link ufficiali;
   - organizzatori;
   - sponsor pubblicati;
   - speaker e sessioni pubblicati.
2. Identificare esplicitamente placeholder e contenuti non annunciati.
3. Creare `devfest-knowledge.json`.
4. Aggiungere `published` a entità soggette ad annuncio.
5. Fare approvare il dataset iniziale da un maintainer o responsabile contenuti.

### Schema iniziale

```json
{
  "schema_version": 1,
  "updated_at": "2026-07-24",
  "event": {},
  "venue": {},
  "cfp": {},
  "registration": {},
  "tracks": [],
  "faq": [],
  "official_links": [],
  "organizers": [],
  "sponsors": [],
  "speakers": [],
  "sessions": [],
  "guide": {}
}
```

### Regole

- I tool restituiscono soltanto elementi `published: true`.
- I dati mancanti producono una risposta esplicita, non una supposizione.
- I link devono provenire dal sito o da canali ufficiali.
- Il backend non deve conoscere automaticamente tutti i file TypeScript.
- Un test di coerenza deve confrontare almeno data, venue, ID pubblici e feature flag.

## 8. Fase 2 — Porting del backend

### Componenti da riutilizzare

- modelli Pydantic;
- costruzione della message history;
- streaming SSE;
- limiti Pydantic AI;
- FastAPI;
- gestione errori;
- rate limiting;
- Logfire;
- health endpoint;
- entrypoint Vercel.

### Contratto API

```json
{
  "locale": "it",
  "messages": [
    {
      "role": "user",
      "content": "Quando si svolge la DevFest?"
    }
  ]
}
```

`locale` sarà limitato a `"it" | "en"`. Questo evita di dedurre la lingua da messaggi ambigui.

### Limiti iniziali

- massimo 12 messaggi;
- massimo 6 turni utente;
- massimo 1.200 caratteri per messaggio;
- body massimo 32 KB;
- massimo 5 tool call per run;
- massimo 500 token di output;
- risposta plain text;
- nessuna memoria server-side.

### Eventi SSE

```text
{"type":"delta","text":"..."}
{"type":"done"}
{"type":"error","message":"..."}
```

## 9. Fase 3 — Tool DevFest

La corrispondenza con i tool del portfolio sarà:

| Tool portfolio | Tool DevFest |
|---|---|
| `get_current_date` | `get_current_date` |
| `get_egon_profile` | `get_event_info` |
| `list_projects` | `list_sessions` |
| `get_project_details` | `get_session_details` |
| `list_talks` | `list_speakers` |
| `get_contact_channels` | `get_official_links` |
| `get_guide_info` | `get_guide_info` |

`get_venue_info` potrà essere aggiunto se `get_event_info` diventasse troppo voluminoso.

### Contratti funzionali

#### `get_current_date`

Restituisce data, giorno della settimana e timezone `Europe/Rome`.

#### `get_event_info`

Restituisce:

- data;
- orari;
- formato;
- tema;
- track;
- stato CFP;
- stato registrazione.

#### `list_sessions`

Filtri opzionali:

- topic;
- speaker;
- track.

Restituisce esclusivamente sessioni pubblicate.

#### `get_session_details`

Ricerca per ID o titolo e restituisce:

- titolo;
- abstract;
- speaker;
- orario;
- sala;
- livello;
- tag.

Se non esiste una corrispondenza univoca restituisce `found: false`.

#### `list_speakers`

Ricerca speaker pubblicati per nome, ruolo, azienda o topic.

#### `get_official_links`

Restituisce link ufficiali per:

- registrazione;
- CFP;
- venue;
- community;
- contatti.

#### `get_guide_info`

Restituisce identità, specie, personalità, ruolo e limitazioni della mascotte.

## 10. Fase 4 — Prompt della mascotte

Il prompt deve stabilire che la guida:

- è una lupetta originale di DevFest Roma;
- non parla a nome di Google;
- opera in sola lettura;
- usa i tool prima di affermare fatti sull'evento;
- non rivela dati non pubblicati;
- risponde nel locale ricevuto;
- non registra utenti e non invia messaggi;
- non modifica dati;
- non naviga sul web;
- ammette chiaramente quando non conosce una risposta;
- rimanda ai canali ufficiali;
- risponde normalmente in 2–5 frasi;
- produce plain text senza Markdown.

La personalità sarà calorosa, energica e orientata alla community. Non sarà copiata la battuta di
Gibby sul modello economico, perché poco adatta a un sito ufficiale.

## 11. Fase 5 — Porting della chat frontend

### Comportamenti da conservare

- overlay fisso;
- apertura e chiusura su click;
- focus automatico sul campo di testo;
- cronologia in memoria React;
- invio dell'intera conversazione;
- streaming incrementale;
- possibilità di fermare la risposta;
- limite di sei turni;
- eye tracking;
- stati visivi coordinati con la richiesta;
- `aria-live`;
- cleanup degli abort e dei timer.

### Segregazione CSS

Il componente non dovrà usare token o classi del portfolio.

Regole:

- tutti gli stili in `devfest-guide.module.css`;
- variabili CSS definite sotto `.guideRoot`;
- niente selettori globali;
- niente modifiche a `app/globals.css`, salvo necessità dimostrata;
- niente dipendenza da classi Tailwind specifiche del sito personale;
- icone SVG locali invece di una nuova libreria globale;
- `z-index` locale e documentato;
- supporto alle safe area mobile.

### Traduzioni

Namespace:

```text
devfestGuide.title
devfestGuide.intro
devfestGuide.placeholder
devfestGuide.thinking
devfestGuide.limitReached
devfestGuide.open
devfestGuide.close
devfestGuide.send
devfestGuide.stop
devfestGuide.errors.*
devfestGuide.privacy
```

Il cambio locale può azzerare la conversazione. Questa scelta mantiene il comportamento stateless
semplice ed evita una cronologia con lingue miste.

## 12. Fase 6 — Ridisegno come lupetta

Il contratto del componente rimane:

```ts
type GuideState =
  | "idle"
  | "hover"
  | "thinking"
  | "speaking"
  | "success"
  | "error";
```

### Direzione grafica

- lupetta originale e amichevole;
- orecchie triangolari;
- muso corto e non realistico;
- occhi leggibili ma non eccessivamente umanizzati;
- coda visibile;
- zampe semplificate;
- silhouette non aggressiva;
- maglia bianca DevFest;
- utilizzo di asset DevFest già presenti nel repository;
- accenti Google blu, rosso, giallo e verde.

### Stati animati

- `idle`: respirazione, blink e movimento lento della coda;
- `hover`: orecchie dritte e testa inclinata;
- `thinking`: sguardo laterale e indicatori colorati;
- `speaking`: bocca animata e leggero movimento della testa;
- `success`: coda più rapida e posa allegra;
- `error`: orecchie abbassate senza un'espressione inquietante.

### Accessibilità e movimento

- `prefers-reduced-motion` deve disabilitare tutte le animazioni non essenziali;
- ogni stato deve essere comprensibile anche in versione statica;
- l'SVG decorativo resta `aria-hidden`;
- il bottone launcher contiene label accessibili localizzate.

### Approvazione

La maglia e l'uso dei marchi devono essere approvati da un referente GDG/DevFest prima della
pubblicazione ufficiale.

## 13. Fase 7 — Collegamento frontend/backend

### Variabile frontend

```text
NEXT_PUBLIC_DEVFEST_GUIDE_API_URL
```

Valori:

```text
locale:
http://127.0.0.1:8000/api/guide

preview:
https://<preview-project>.vercel.app/api/guide

produzione:
https://guide-api.devfest2026.gdgromacitta.it/api/guide
```

Questa variabile non è un segreto.

### CORS

Il backend userà una allowlist esplicita:

```text
http://localhost:3000
https://devfest2026.gdgromacitta.it
```

Eventuali URL di preview saranno configurati separatamente o tramite una regola limitata.

CORS non costituisce autenticazione: l'endpoint rimane pubblico e deve essere protetto tramite
limiti applicativi e rate limiting.

### Service worker

Il service worker corrente esegue un semplice passthrough delle richieste. Non è necessario
aggiungere caching per lo stream della chat.

## 14. Fase 8 — Sicurezza, costi e privacy

### Variabili backend

```text
OPENAI_API_KEY
OPENAI_MODEL
GUIDE_ALLOWED_ORIGINS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
LOGFIRE_TOKEN
LOGFIRE_ENVIRONMENT
```

Le chiavi OpenAI, Upstash e Logfire devono esistere soltanto nel progetto backend.

### Rate limiting

Configurazione iniziale:

- 12 richieste ogni 10 minuti per IP;
- massimo 6 turni per sessione browser;
- Upstash obbligatorio in produzione;
- fallback in memoria ammesso soltanto in locale;
- timeout esplicito sulle dipendenze esterne;
- alert o limite di spesa giornaliero.

Il backend di produzione deve fallire in modo esplicito se manca una configurazione necessaria,
anziché avviarsi senza protezione.

### Logfire

Sono possibili due configurazioni:

1. `include_content=True`:
   - registra prompt, risposte e tool;
   - richiede disclosure privacy coerente;
   - richiede una retention definita.
2. `include_content=False`:
   - registra tempi, errori, token e nomi dei tool;
   - non registra il testo della conversazione.

Per il sito pubblico è raccomandato partire con `include_content=False`, salvo approvazione
esplicita della policy privacy.

La UI non deve dichiarare che i messaggi non vengono conservati se la telemetria ne registra il
contenuto.

## 15. Fase 9 — Deploy

### Preview autonoma

L'implementatore può:

1. creare il backend nel proprio team Vercel;
2. configurare le variabili sensibili;
3. distribuire una preview `*.vercel.app`;
4. testare il frontend locale contro tale preview;
5. allegare l'URL alla PR.

### Produzione ufficiale

Il percorso raccomandato è:

1. creare un progetto Vercel appartenente al team GDG;
2. collegarlo allo stesso repository;
3. impostare Root Directory su `services/devfest-guide-api`;
4. configurare ambiente Preview e Production;
5. configurare `guide-api.devfest2026.gdgromacitta.it`;
6. impostare il DNS;
7. inserire l'URL pubblico nel build GitHub Pages;
8. eseguire il merge approvato su `main`.

Non è raccomandato lasciare il backend ufficiale nel team Vercel personale: il sito dipenderebbe
da account, limiti di spesa e credenziali individuali.

### Rollback

1. Impostare `features.devfestGuide = false`.
2. Ricostruire il sito statico.
3. Verificare l'assenza del launcher.
4. Disabilitare separatamente il backend se non più utilizzato.

Il rollback non richiede modifiche alle pagine.

## 16. Fase 10 — Sviluppo locale

Script suggeriti:

```text
npm run dev
npm run dev:guide
npm run dev:all
npm run test:guide
```

`dev:all` avvia Next.js e Uvicorn.

Non verrà usata una rewrite Next.js per simulare `/api/guide`: il frontend locale chiamerà
direttamente FastAPI sulla porta 8000, esercitando CORS nello stesso modo della produzione.

## 17. Test

### Backend

- payload valido;
- ruoli alternati;
- ultimo messaggio obbligatoriamente utente;
- rifiuto dei messaggi `system`;
- locale limitato a `it` o `en`;
- limiti su messaggi, caratteri e body;
- tool con risultati verificati;
- esclusione dei record non pubblicati;
- risultato `found: false` per entità sconosciute;
- health endpoint;
- CORS sulle sole origini previste;
- `429` al superamento del limite;
- eventi SSE `delta`, `done`, `error`;
- test senza chiamate OpenAI reali.

### Frontend

- apertura e chiusura da mouse e tastiera;
- aggiornamento di `aria-expanded`;
- focus sul campo di testo;
- invio di cronologia e locale;
- rendering incrementale;
- interruzione con `AbortController`;
- limite di sei turni;
- errori localizzati;
- reset coerente al cambio locale;
- `aria-live`;
- reduced motion;
- assenza di overflow a 320 px;
- nessuna sovrapposizione con menu mobile e footer.

### Coerenza contenuti

- data dell'evento coerente;
- venue coerente;
- sessioni pubbliche con speaker esistenti;
- contenuti disabilitati non presenti nella knowledge base pubblica;
- link ufficiali validi;
- nessun placeholder pubblicato.

### Gate finali

```bash
npm run lint
npm run test
npm run build
uv run --project services/devfest-guide-api pytest
```

### Smoke test

- health backend;
- domanda italiana;
- domanda inglese;
- `get_event_info`;
- `get_venue_info` o venue dentro `get_event_info`;
- domanda non coperta;
- rate limit;
- stop dello stream;
- Chrome desktop;
- Safari mobile;
- viewport 320, 768 e desktop;
- verifica Logfire;
- verifica che `out/` continui a essere prodotto.

## 18. Strategia PR

Sequenza raccomandata:

1. `chore: scaffold isolated devfest guide api`
2. `feat: add read-only devfest guide tools`
3. `feat: port localized mascot chat shell`
4. `feat: redesign mascot as devfest wolf`
5. `chore: harden guide deployment and observability`

Se si preferisce una singola PR, mantenere comunque commit distinti secondo queste aree.

## 19. Stima

| Attività | Stima |
|---|---:|
| Audit e knowledge base | 0,5–1 giorno |
| Porting backend e tool | 1–1,5 giorni |
| Frontend, i18n e accessibilità | 1–1,5 giorni |
| Ridisegno e iterazioni lupetta | 1–2 giorni |
| Deploy, sicurezza e test end-to-end | 1–1,5 giorni |
| **Totale** | **5–7 giorni** |

La variabile principale è il numero di iterazioni grafiche e il tempo richiesto per approvazioni,
DNS e ownership del progetto Vercel.

## 20. Criteri di completamento

La feature è completata quando:

- la lupetta è disponibile su tutte le pagine italiane e inglesi;
- chat, streaming, stop e limite turni funzionano;
- i tool restituiscono soltanto dati pubblici verificati;
- nessun contenuto placeholder viene esposto;
- il frontend continua a essere esportabile staticamente;
- il backend è distribuibile indipendentemente;
- il codice della feature è confinato nei folder previsti;
- il rollback richiede una sola feature flag;
- tutti i gate automatici passano;
- privacy e branding sono stati approvati;
- il progetto Vercel di produzione appartiene al soggetto concordato con i maintainer.

## 21. Decisioni da chiudere prima della produzione

- Nome definitivo della lupetta.
- Logo esatto da mostrare sulla maglia.
- Knowledge base iniziale approvata.
- Inclusione o esclusione del contenuto chat da Logfire.
- Retention della telemetria.
- Team proprietario del progetto Vercel.
- Sottodominio definitivo dell'API.
- Referente con accesso DNS.
- Maintainer responsabile del merge.

## 22. Riferimenti

- Implementazione di partenza:
  `/Users/gamindo/Documents/Personal/egonferri_website`
- GitHub Pages:
  <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
- Vercel Python Runtime:
  <https://vercel.com/docs/functions/runtimes/python>
- FastAPI su Vercel:
  <https://vercel.com/docs/frameworks/backend/fastapi>
- Vercel monorepo:
  <https://vercel.com/docs/monorepos>
- Vercel per GitHub:
  <https://vercel.com/docs/git/vercel-for-github>
- FastAPI CORS:
  <https://fastapi.tiangolo.com/tutorial/cors/>
