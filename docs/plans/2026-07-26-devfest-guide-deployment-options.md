# Opzioni di deploy per la guida AI DevFest

**Data di valutazione:** 26 luglio 2026  
**Repository:** `gdgromacitta/dev-fest-2026`  
**Visibilità verificata:** pubblico  
**Stato:** documento decisionale, nessun deploy incluso

## Sintesi

Il sito può continuare a essere pubblicato gratuitamente su GitHub Pages. Non è
necessario spostare il frontend né duplicare l'intero repository.

La parte che GitHub Pages non può eseguire è il servizio Python/FastAPI della
guida AI. GitHub Pages pubblica file statici HTML, CSS e JavaScript, mentre il
backend deve:

- eseguire Python;
- conservare `OPENAI_API_KEY`, `LOGFIRE_TOKEN` e gli altri segreti lato server;
- applicare CORS, rate limiting e limiti di utilizzo;
- effettuare chiamate a OpenAI senza esporre la chiave nel browser.

L'architettura meno invasiva è quindi:

```text
GitHub Pages
frontend Next.js statico
        |
        | HTTPS
        v
servizio esterno
API Python/FastAPI della guida
        |
        +-- OpenAI
        +-- Upstash
        +-- Logfire
```

La scelta da fare con i maintainer riguarda solamente dove ospitare il servizio
esterno e chi ne possiede account, segreti e fatturazione.

## Raccomandazione breve

Ordine consigliato:

1. **Mantenere il frontend su GitHub Pages in ogni caso.**
2. Se il GDG ha già un team Vercel Pro, oppure accetta il costo minimo del piano,
   usare **Vercel Pro intestato al GDG**.
3. Se si vuole ridurre il costo fisso e il GDG può gestire un progetto Google
   Cloud, usare **Cloud Run con scale-to-zero**.
4. Se si vuole la soluzione più semplice con un costo contenuto e prevedibile,
   valutare **Railway**.
5. Usare un account personale o Render Free solo per una preview temporanea,
   non come deploy ufficiale dell'evento.
6. Evitare di duplicare il repository in un account personale, salvo ultima
   risorsa: non elimina i problemi di ownership e introduce sincronizzazione e
   bus factor.

## Situazione tecnica già presente

Il codice è già separato in modo adatto a un deploy disaccoppiato:

- frontend statico: `src/features/devfest-guide`;
- API FastAPI: `services/devfest-guide-api`;
- configurazione Vercel dell'API:
  `services/devfest-guide-api/vercel.json`;
- workflow GitHub Pages: `.github/workflows/nextjs.yml`;
- guida operativa esistente: [`docs/deploy.md`](../deploy.md).

Il frontend utilizza già due variabili pubbliche di build:

```text
NEXT_PUBLIC_DEVFEST_GUIDE_ENABLED=true
NEXT_PUBLIC_DEVFEST_GUIDE_API_URL=https://<dominio-api>/api/guide
```

Il backend richiede invece segreti server-side:

```text
OPENAI_API_KEY
OPENAI_MODEL
GUIDE_ALLOWED_ORIGINS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
LOGFIRE_TOKEN
LOGFIRE_ENVIRONMENT
```

Questa separazione consente di cambiare provider del backend senza modificare
l'architettura del sito o il componente della mascotte.

## Cosa significa davvero il caso Vercel

Il repository è pubblico e appartiene all'organizzazione GitHub
`gdgromacitta`. Questo porta a tre considerazioni distinte.

### Prezzo

Al 26 luglio 2026:

- Vercel Hobby costa `$0/mese`, ma è dichiarato per uso personale e non
  commerciale;
- Vercel Pro parte da `$20/mese`;
- Pro comprende `$20` di credito mensile per l'utilizzo;
- il prezzo base comprende un deploying seat;
- ogni ulteriore membro con permessi di deploy costa `$20/mese`;
- i viewer non aggiungono il costo di un deploying seat.

Quindi “repository di organizzazione” non significa automaticamente “un costo
per ogni repository”. Se il GDG possiede già un team Pro, il progetto potrebbe
rientrare nel team e nel credito già pagato. Bisogna verificare il piano
effettivo e il numero di persone che devono poter fare deploy.

### Collegamento al repository GitHub

Per importare direttamente in Vercel un repository posseduto da
un'organizzazione GitHub bisogna essere:

- owner dell'organizzazione; oppure
- member dell'organizzazione con accesso al repository.

Un **outside collaborator**, anche se può contribuire al repository, non può
importarlo o collegarlo direttamente tramite l'integrazione Vercel-GitHub.

Questo non blocca il progetto, ma richiede una di queste azioni:

1. un maintainer/member collega il repository al progetto Vercel;
2. un maintainer crea il progetto e concede i permessi necessari;
3. il deploy viene eseguito da GitHub Actions tramite Vercel CLI e segreti
   configurati dai maintainer.

### Limiti del piano Hobby

Il divieto esplicito di Vercel riguarda i repository **privati** posseduti da
organizzazioni GitHub: non possono essere distribuiti in un team Hobby. Il
repository DevFest è pubblico, quindi quel divieto specifico non si applica.

Restano però due problemi:

- Hobby è destinato a progetti personali e non commerciali;
- sotto Hobby, per i deploy collegati a Git, l'autore del commit deve
  corrispondere al proprietario del team Hobby.

Per un sito ufficiale del GDG, con più contributori e segreti di produzione, un
account Hobby personale è quindi una soluzione fragile anche quando
tecnicamente possibile.

## Matrice delle opzioni

| Opzione | Costo base indicativo | Complessità | Ownership corretta | Cold start | Valutazione |
| --- | ---: | --- | --- | --- | --- |
| GitHub Pages + Vercel Pro | `$20/mese` se non esiste già un team Pro | Bassa | Ottima se il team è del GDG | Contenuto | Prima scelta se il costo è accettabile |
| GitHub Pages + Cloud Run | Spesso `$0` a basso traffico, poi consumo | Media | Ottima se il progetto GCP è del GDG | Possibile con scale-to-zero | Prima alternativa cost-conscious |
| GitHub Pages + Railway | `$5/mese` Hobby con `$5` di utilizzo incluso | Bassa/media | Buona con workspace condiviso | Dipende dalla configurazione | Alternativa semplice ed economica |
| GitHub Pages + Render Free | `$0` | Bassa | Discreta | Circa un minuto dopo inattività | Solo preview e test |
| GitHub Pages + Fly.io | A consumo, piccole VM da pochi dollari/mese | Media/alta | Buona con organizzazione dedicata | Configurabile | Valida, ma più operativa |
| Mirror personale + Vercel Hobby | `$0` nominale | Media | Scarsa | Contenuto | Sconsigliata per produzione |
| Solo GitHub Pages, senza AI generativa | `$0` | Media modifica prodotto | Ottima | Nessuno | Fallback se non si può mantenere un backend |
| Spostare tutto su Vercel | Da `$20/mese` per uso di team | Media | Ottima su team GDG | Contenuto | Possibile, ma oggi non necessario |

I prezzi dei provider possono cambiare e vanno riconfermati al momento
dell'attivazione. I costi OpenAI, Upstash, Logfire, dominio e traffico eccedente
non sono compresi nelle cifre della tabella.

## Opzione A — GitHub Pages + Vercel Pro

### Come funzionerebbe

- Il sito resta su GitHub Pages.
- Si crea un progetto Vercel separato.
- La Root Directory del progetto è `services/devfest-guide-api`.
- Vercel distribuisce solamente il servizio Python.
- Il dominio Vercel dell'API viene impostato in
  `NEXT_PUBLIC_DEVFEST_GUIDE_API_URL`.

### Vantaggi

- Il codice è già predisposto con `vercel.json`.
- Minimo lavoro di adattamento.
- Deploy e rollback semplici.
- Preview per le modifiche al backend.
- Segreti e log gestiti dal provider.
- Il frontend rimane indipendente e gratuito.

### Svantaggi

- Piano Pro da `$20/mese` se il GDG non ne possiede già uno.
- Possibili costi per ulteriori deploying seat.
- Serve un maintainer/member GitHub per collegare direttamente il repository.
- Il costo dell'API OpenAI rimane separato.

### Passi di attivazione

1. Verificare se esiste già un team Vercel Pro del GDG.
2. Identificare un owner del team e un responsabile della fatturazione.
3. Fare collegare `gdgromacitta/dev-fest-2026` da un member/owner GitHub.
4. Creare un progetto con Root Directory
   `services/devfest-guide-api`.
5. Configurare i segreti server-side in Preview e Production.
6. Impostare `GUIDE_ALLOWED_ORIGINS` con l'origine esatta del sito.
7. Distribuire l'API e verificare `/api/guide/health`.
8. Configurare nel repository GitHub:

   ```text
   NEXT_PUBLIC_DEVFEST_GUIDE_ENABLED=true
   NEXT_PUBLIC_DEVFEST_GUIDE_API_URL=https://<api-vercel>/api/guide
   ```

9. Rieseguire il workflow GitHub Pages.
10. Provare una conversazione italiana e una inglese.

### Variante: GitHub Actions + Vercel CLI

Se l'organizzazione non vuole installare o autorizzare la GitHub App di Vercel,
un workflow può eseguire Vercel CLI soltanto sulla directory dell'API.

Servirebbero questi GitHub Secrets:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Questa variante evita il collegamento automatico Vercel-GitHub, ma **non**
aggira piano, pricing o ownership del progetto Vercel. Un maintainer deve
comunque approvare il workflow e configurare i secrets.

## Opzione B — GitHub Pages + Google Cloud Run

### Come funzionerebbe

L'API FastAPI viene inserita in un container e pubblicata su Cloud Run. Il
servizio può avere zero istanze minime, avviandosi quando arriva una richiesta.

Il frontend continua a chiamare:

```text
https://<servizio-cloud-run>/api/guide
```

### Costi

Con fatturazione request-based, il free tier mensile include attualmente:

- 180.000 vCPU-second;
- 360.000 GiB-second di memoria;
- 2 milioni di richieste.

Per il traffico limitato di un evento il costo infrastrutturale potrebbe quindi
rimanere a zero o molto basso, ma:

- serve un billing account Google Cloud;
- il free tier è aggregato per billing account;
- regione, egress e utilizzo effettivo incidono sul costo;
- OpenAI e gli altri servizi restano separati.

### Vantaggi

- Nessun canone fisso necessario per il solo servizio.
- Ownership chiara se progetto e billing sono del GDG.
- Buona affinità con un'organizzazione Google Developer Group.
- Limiti, IAM, Secret Manager e log centralizzabili.
- Scala a zero quando non viene usato.

### Svantaggi

- Occorre aggiungere configurazione container o source deploy.
- Setup IAM e billing più articolato di Vercel.
- Possibile cold start dopo inattività.
- È necessario decidere chi amministra progetto GCP e carta/billing.

### Lavoro tecnico necessario

1. Aggiungere un `Dockerfile` isolato in `services/devfest-guide-api`.
2. Far ascoltare l'app sulla porta fornita da `PORT`.
3. Creare un progetto GCP intestato al GDG.
4. Abilitare Cloud Run, Artifact Registry e Cloud Build.
5. Archiviare le credenziali in Secret Manager.
6. Distribuire in una regione europea, per esempio Milano o Belgio.
7. Impostare minimum instances a `0` e un limite massimo prudente.
8. Configurare dominio, CORS, alert di budget e quote.
9. Aggiornare le due variabili GitHub Pages.

## Opzione C — GitHub Pages + Railway

### Come funzionerebbe

Railway costruisce ed esegue il servizio Python dalla directory
`services/devfest-guide-api`. Il frontend resta su GitHub Pages.

### Costi

Al 26 luglio 2026:

- Free: `$0/mese` con `$1` di risorse, adatto a esperimenti;
- Hobby: `$5/mese` con `$5` di consumo incluso;
- Pro: `$20/mese`, pensato per team e produzione.

Se l'utilizzo Hobby resta entro `$5`, il totale mensile rimane `$5`; oltre la
soglia si paga la differenza. Per collaborazione e ownership di team va
valutato Pro.

### Vantaggi

- Setup più semplice di Cloud Run.
- Costo minimo inferiore a Vercel Pro.
- Deploy Git e variabili ambiente integrati.
- Adatto a FastAPI senza ristrutturare il frontend.

### Svantaggi

- Hobby è presentato come piano per progetti personali.
- Per una vera gestione di team potrebbe servire Pro.
- Costi a consumo oltre il credito incluso.
- Un altro provider e un altro pannello da amministrare.

## Opzione D — GitHub Pages + Render Free

### Utilizzo consigliato

È adatto per creare rapidamente una preview condivisibile mentre il gruppo
decide la soluzione definitiva.

### Limiti rilevanti

- Il servizio gratuito va in sleep dopo 15 minuti senza traffico.
- La prima richiesta successiva può richiedere circa un minuto.
- Render indica esplicitamente che le istanze gratuite non sono destinate alla
  produzione.

Per una demo concordata si può “svegliare” il servizio prima dell'inizio. Per
una mascotte che deve rispondere immediatamente ai partecipanti durante
l'evento, il cold start rende il piano gratuito poco adatto.

## Opzione E — Mirror privato/personale + Vercel Hobby

L'idea sarebbe:

1. duplicare o sincronizzare il codice in un repository personale;
2. collegare il repository personale a un account Vercel Hobby;
3. distribuire da lì l'API o tutto il sito.

### Perché non è la soluzione consigliata

- I segreti di produzione dipenderebbero da un account personale.
- Un'altra persona potrebbe non riuscire a distribuire i propri commit sotto
  Hobby.
- Si crea un secondo repository da sincronizzare.
- Issue, PR, Actions e cronologia possono divergere.
- Il passaggio di consegne dopo l'evento diventa più difficile.
- Hobby rimane vincolato a uso personale/non commerciale.
- Un repository privato personale risolve il vincolo tecnico sul repository
  privato di organizzazione, ma non quello di governance.

Può essere usato come ambiente di preview temporaneo, purché non venga
considerato il deploy ufficiale e non diventi l'unica copia operativa.

## Opzione F — Solo GitHub Pages

GitHub Pages da solo non può eseguire FastAPI. Non è inoltre sicuro chiamare
OpenAI direttamente dal JavaScript del browser: la chiave API diventerebbe
pubblica.

Per avere davvero zero backend bisogna cambiare il comportamento della guida:

- sostituire la chat generativa con ricerca locale nel JSON della DevFest;
- proporre domande predefinite e risposte deterministiche;
- mantenere mascotte, animazioni e pannello;
- rimuovere OpenAI, Logfire e rate limiting server-side.

Questa opzione offre costo zero e massima semplicità, ma non è più la stessa
esperienza conversazionale. Può essere un buon fallback offline o di emergenza.

## Opzione G — Spostare frontend e backend su Vercel

È tecnicamente possibile collegare più progetti Vercel allo stesso repository:
uno per il frontend e uno per `services/devfest-guide-api`.

Non è però necessario adesso:

- il frontend è già compatibile con GitHub Pages;
- GitHub Pages è gratuito;
- spostarlo aumenta il perimetro della migrazione;
- separare i due deploy mantiene il backend segregato;
- un problema dell'API non impedisce di pubblicare il sito statico.

Il trasferimento completo ha senso solo se il gruppo vuole centralizzare anche
dominio, preview del frontend, analytics e CI/CD su Vercel.

## Costi che esistono con qualunque provider

Il costo del runtime Python potrebbe essere inferiore al costo dei servizi
utilizzati dalla chat. Vanno stimati separatamente:

- token OpenAI per conversazione;
- limiti e consumo Upstash;
- ingestione e retention Logfire;
- dominio o sottodominio;
- egress di rete;
- traffico anomalo o abuso;
- tempo di gestione degli account;
- eventuale supporto durante l'evento.

Contromisure consigliate:

- modello OpenAI esplicito e budgettato;
- limite di richieste per IP/sessione;
- limite massimo di token e durata;
- hard spending limit o alert quando disponibili;
- feature flag per spegnere rapidamente la guida;
- nessun contenuto della chat nei log per impostazione predefinita;
- endpoint health separato;
- owner e backup owner documentati.

## Decisione da prendere con i maintainer

Queste domande permettono di chiudere la scelta in una riunione breve:

1. Esiste già un team Vercel Pro intestato al GDG?
2. Il suo costo base è già sostenuto da qualcuno?
3. Quante persone devono poter effettuare deploy, e quante devono solo vedere
   il progetto?
4. Chi può collegare il repository GitHub dell'organizzazione?
5. Chi sarà owner di segreti, billing e dominio?
6. Il gruppo accetta un costo fisso di `$20/mese`?
7. In alternativa, può creare un progetto Google Cloud con billing e almeno
   due amministratori?
8. Quante conversazioni si stimano prima e durante l'evento?
9. Qual è il budget massimo mensile complessivo, OpenAI incluso?
10. Serve una preview immediata oppure si può configurare direttamente
    l'ambiente definitivo?

## Proposta operativa

### Scenario 1 — Vercel già disponibile

Scegliere Vercel Pro del GDG e distribuire solo
`services/devfest-guide-api`. È il percorso più rapido perché la configurazione
è già presente nel repository.

### Scenario 2 — Nessun Vercel e priorità al costo

Creare un progetto Google Cloud del GDG e usare Cloud Run a consumo con
scale-to-zero, alert di budget e limite massimo di istanze.

### Scenario 3 — Serve una demo prima della decisione

Creare una preview temporanea su un account personale o Render Free, senza
considerarla produzione. Dopo l'approvazione trasferire il servizio e ricreare
i segreti nell'account ufficiale.

### Scenario 4 — Nessuno può assumersi backend e billing

Mantenere la guida disabilitata oppure realizzare il fallback statico locale.
Non inserire mai la chiave OpenAI nel frontend.

## Dipendenze dai maintainer

Anche se lo sviluppo tecnico può essere completato da un contributor, il deploy
ufficiale richiede almeno una persona con permessi adeguati per:

- approvare e unire workflow o configurazioni;
- collegare il repository a Vercel, se si usa l'integrazione Git;
- creare GitHub Actions Secrets e repository variables;
- decidere ownership e fatturazione;
- autorizzare dominio e CORS di produzione;
- approvare privacy, logging e budget OpenAI.

Quindi un non-maintainer può preparare codice, documentazione, test e preview,
ma non dovrebbe intestarsi da solo l'infrastruttura ufficiale.

## Piano di rollout comune

Indipendentemente dal provider:

1. Creare il servizio nell'account ufficiale.
2. Configurare i segreti senza copiarli nel repository.
3. Limitare CORS al dominio GitHub Pages e all'eventuale dominio ufficiale.
4. Distribuire prima in preview/staging.
5. Verificare:
   - endpoint health;
   - streaming della risposta;
   - una conversazione italiana;
   - una conversazione inglese;
   - rate limit;
   - log senza contenuto sensibile;
   - comportamento dopo inattività.
6. Configurare budget alert e limite di spesa.
7. Impostare URL e feature flag nelle repository variables.
8. Ridistribuire GitHub Pages.
9. Effettuare uno smoke test dal dominio pubblico reale.
10. Documentare owner, backup owner e procedura per spegnere la guida.

## Rollback

Il rollback è semplice perché il sito e l'API sono separati:

1. impostare `NEXT_PUBLIC_DEVFEST_GUIDE_ENABLED=false`;
2. rieseguire il workflow GitHub Pages;
3. lasciare il resto del sito operativo;
4. correggere o cambiare provider del backend senza intervenire sulle pagine
   pubbliche;
5. riabilitare la guida soltanto dopo gli smoke test.

## Fonti ufficiali

- [GitHub Pages: hosting statico](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Vercel: piani e prezzi](https://vercel.com/pricing)
- [Vercel: piano Hobby](https://vercel.com/docs/plans/hobby)
- [Vercel: piano Pro](https://vercel.com/docs/plans/pro-plan)
- [Vercel: deploy da repository Git](https://vercel.com/docs/git)
- [Vercel: permessi dell'integrazione GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel: progetti e monorepo](https://vercel.com/docs/projects)
- [Google Cloud Run: prezzi e free tier](https://cloud.google.com/run/pricing)
- [Google Cloud Run: panoramica e scale-to-zero](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Railway: prezzi](https://docs.railway.com/pricing)
- [Render: limiti dei servizi gratuiti](https://render.com/docs/free)
- [Fly.io: prezzi](https://fly.io/docs/about/pricing/)

