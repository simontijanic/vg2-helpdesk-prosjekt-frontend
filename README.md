# Helpdesk System

Dette prosjektet er et helpdesk-system inspirert av Spiceworks, utviklet for å håndtere brukerstøtte, feilmeldinger og teknisk administrasjon. Systemet gir brukere mulighet til å sende inn henvendelser (tickets), mens administratorer kan følge opp, svare og lukke saker.

## Funksjonalitet
- **Autentisering og roller**:
  - Innlogging for brukere og administratorer.
  - Registrering av nye brukere.
  - Roller: bruker og admin.
- **Ticketsystem**:
  - Opprettelse av support-henvendelser (tickets).
  - Mulighet for å legge inn beskrivelse og kategori.
  - Brukere kan se egne henvendelser og svar.
  - Administratorer kan se alle henvendelser.
- **Statushåndtering**:
  - Administratorer kan endre status på tickets: "Åpen", "Under arbeid", "Løst".
  - Administratorer kan endre prioritet på tickets.
  - Brukere kan følge med på statusen til sine egne tickets.
- **Frontend**:
  - Brukervennlig og responsivt design.
  - Eget dashbord for brukere og administratorer.
- **Backend**:
  - Node.js/Express API med RESTful endepunkter.
  - MVC-struktur for god kodeorganisering.
  - Sikkerhet: hashing av passord, JWT, httpOnly-cookies og rutebegrensning.
- **Bonus**:
  - Kommentarsystem for dialog mellom bruker og admin.
  - Historikk for oppdateringer i hver sak.

---

## Teknologier
- **Frontend**: EJS, Bootstrap.
- **Backend**: Node.js, Express.
- **Database**: MongoDB.
- **Autentisering**: JWT (JSON Web Tokens).
- **Sikkerhet**: Hashing av passord (bcrypt), httpOnly-cookies.

---

## Endepunkter

### **Autentisering**
| Metode | Endepunkt       | Beskrivelse                          |
|--------|-----------------|--------------------------------------|
| GET    | `/login`        | Viser innloggingssiden.             |
| POST   | `/login`        | Logger inn brukeren.                |
| GET    | `/register`     | Viser registreringssiden.           |
| POST   | `/register`     | Registrerer en ny bruker.           |
| GET    | `/logout`       | Logger ut brukeren.                 |

---

### **Ticketsystem**
| Metode | Endepunkt                  | Beskrivelse                                      |
|--------|----------------------------|--------------------------------------------------|
| GET    | `/tickets`                 | Viser alle tickets for brukeren.                |
| GET    | `/tickets/create`          | Viser skjema for å opprette en ny ticket.       |
| POST   | `/tickets/create`          | Oppretter en ny ticket.                         |
| GET    | `/tickets/:id`             | Viser detaljer for en spesifikk ticket.         |
| POST   | `/tickets/:id/comments`    | Legger til en kommentar på en ticket.           |
| POST   | `/tickets/:id/resolve`     | Marker en ticket som løst.                      |

---

### **Admin-funksjoner**
| Metode | Endepunkt                  | Beskrivelse                                      |
|--------|----------------------------|--------------------------------------------------|
| GET    | `/dashboard`               | Viser admin-dashbordet med oversikt over tickets.|
| POST   | `/tickets/:id/status`      | Oppdaterer status på en ticket.                 |
| POST   | `/tickets/:id/priority`    | Oppdaterer prioritet på en ticket.              |

---

## Filstruktur
```
├── controllers
│   ├── authController.js       # Håndterer autentisering.
│   ├── dashboardController.js  # Håndterer admin-dashbordet.
│   ├── ticketController.js     # Håndterer tickets.
│   └── databaseController.js   # Kobler til MongoDB.
├── models
│   ├── userModel.js            # Brukermodell.
│   └── ticketModel.js          # Ticketmodell.
├── routes
│   ├── authRoutes.js           # Ruter for autentisering.
│   ├── dashboardRoutes.js      # Ruter for admin-dashbordet.
│   └── ticketRoutes.js         # Ruter for tickets.
├── views
│   ├── auth                   # EJS-filer for innlogging og registrering.
│   ├── dashboard              # EJS-filer for admin-dashbordet.
│   ├── tickets                # EJS-filer for tickets.
│   └── layouts                # Layout-filer.
├── public
│   ├── css                    # CSS-filer.
│   ├── js                     # JavaScript-filer.
├── utils
│   └── seedData.js            # Script for å opprette en admin-bruker.
├── .env                        # Miljøvariabler.
├── .gitignore                  # Ignorerte filer.
├── index.js                    # Hovedfil for serveren.
├── package.json                # Avhengigheter og scripts.
```

---

## Oppsett

### 1. Installer avhengigheter
```bash
npm install
```

### 2. Konfigurer miljøvariabler
Opprett en `.env`-fil med følgende innhold:
```
MONGODB_URI=<din-mongodb-uri>
JWT_SECRET=<din-jwt-secret>
```

### 3. Start serveren
```bash
npm start
```

### 4. Seed admin-bruker (valgfritt)
Fjern kommentaren fra `seedData.seedAdmin()` i `index.js` for å opprette en admin-bruker:
```javascript
seedData.seedAdmin();
```
Standard admin-bruker:
- **E-post**: `admin@helpdesk.com`
- **Passord**: `Admin123!`

---

## Sikkerhet
- **Passord**: Hashes med bcrypt før lagring.
- **Autentisering**: JWT med httpOnly-cookies.
- **Rutebegrensning**: Middleware for å beskytte admin-ruter.
- **Validering**: Skjemaer valideres før innsending.

---

## Bonusfunksjoner
- **Kommentarsystem**: Brukere og administratorer kan legge til kommentarer på tickets.
- **Historikk**: Oversikt over alle oppdateringer på en ticket.

---
