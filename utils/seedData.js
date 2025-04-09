const mongoose = require('mongoose');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

exports.seedAdmin = async () => {
    try {
        // Før vi legger til nye billetter og brukere, slett alle eksisterende billetter og brukere
        await Ticket.deleteMany({});
        await User.deleteMany({});

        // Opprett nye brukere og billetter som tidligere definert
        const existingAdmin = await User.findOne({ email: 'admin@helpdesk.com' });
        if (!existingAdmin) {
            // Create admin user
            const adminUser = new User({
                email: 'admin@helpdesk.com',
                password: 'Admin123!',
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user created successfully');
        }

        // Create support staff
        const firstLineUser = await User.findOne({ email: 'firstline@helpdesk.com' });
        if (!firstLineUser) {
            await User.create({
                email: 'firstline@helpdesk.com',
                password: 'Support123!',
                role: 'first-line'
            });
            console.log('First line support user created');
        }

        const secondLineUser = await User.findOne({ email: 'secondline@helpdesk.com' });
        if (!secondLineUser) {
            await User.create({
                email: 'secondline@helpdesk.com',
                password: 'Support123!',
                role: 'second-line'
            });
            console.log('Second line support user created');
        }

        // Create regular user
        const regularUser = await User.findOne({ email: 'user@example.com' });
        if (!regularUser) {
            await User.create({
                email: 'user@example.com',
                password: 'User123!',
                role: 'user'
            });
            console.log('Regular user created');
        }

        // Get all created users for reference
        const admin = await User.findOne({ email: 'admin@helpdesk.com' });
        const firstLine = await User.findOne({ email: 'firstline@helpdesk.com' });
        const secondLine = await User.findOne({ email: 'secondline@helpdesk.com' });
        const user = await User.findOne({ email: 'user@example.com' });

        // Create sample tickets
        const tickets = [
            {
                title: "Kan ikke logge inn på PC",
                description: "Når jeg prøver å logge inn på min arbeidsstasjon, får jeg en feilmelding som sier at passordet er utløpt. Jeg har forsøkt å starte maskinen på nytt, men problemet vedvarer. Jeg har også prøvd å bruke en annen datamaskin for å logge inn, men får samme feilmelding. Dette hindrer meg i å få tilgang til viktige filer og programmer som jeg trenger for å utføre jobben min.",
                category: "access",
                status: "resolved",
                priority: "high",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Har du prøvd å endre passordet via vår selvbetjeningsportal? Du kan finne den på password.company.com. Hvis du ikke har tilgang til portalen, kan vi hjelpe deg med å sette opp et nytt passord manuelt.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg var ikke klar over portalen. Kan du forklare hvordan jeg bruker den?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Selvfølgelig! Gå til password.company.com og logg inn med ditt brukernavn. Klikk deretter på 'Glemt passord' og følg instruksjonene for å tilbakestille passordet. Hvis du møter noen problemer, kan du gi oss beskjed, så kan vi veilede deg videre.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Takk for hjelpen! Jeg klarte å endre passordet via portalen, og nå fungerer alt som det skal.",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Nettverksproblemer i møterom",
                description: "Vi opplever svært ustabil internettforbindelse i møterom B3. Dette har vært et problem i flere dager og påvirker både videomøter og presentasjoner. Vi har prøvd å bytte til en annen WiFi-kanal, men det har ikke hjulpet. Problemet ser ut til å være spesifikt for dette møterommet, da andre rom fungerer fint. Dette skaper store utfordringer for teamet vårt, spesielt under viktige møter med eksterne partnere.",
                category: "network",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Kan du prøve å koble til et annet WiFi-nettverk og deretter tilbake til det opprinnelige? Dette kan noen ganger løse midlertidige tilkoblingsproblemer.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Vi har prøvd det, men problemet vedvarer. Hva annet kan vi gjøre?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Prøv å gjenopprette nettverksinnstillingene på enheten som brukes i møterommet. Dette kan gjøres ved å gå til 'Innstillinger' > 'Nettverk og Internett' > 'Tilbakestill nettverk'. Etterpå kan du koble til WiFi på nytt. Gi oss beskjed om dette hjelper.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det ser ut til å ha løst problemet! Tusen takk for hjelpen.",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Outlook synkroniserer ikke",
                description: "Outlook har sluttet å synkronisere e-poster siden i går ettermiddag. Jeg har prøvd å starte programmet på nytt, sjekket internettforbindelsen og til og med reinstallert programmet, men problemet vedvarer. Jeg bruker Outlook til å kommunisere med kunder og kolleger, så dette er et kritisk problem for meg. Jeg har også lagt merke til at kalenderen ikke oppdateres, noe som gjør det vanskelig å holde oversikt over møter.",
                category: "email",
                status: "open",
                priority: "medium",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Kan du sjekke om du har tilgang til Outlook på web (outlook.office.com)? Dette kan hjelpe oss med å avgjøre om problemet er lokalt på maskinen din eller serverrelatert.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Ja, jeg kan logge inn på webversjonen uten problemer. Hva bør jeg gjøre videre?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det kan være en feil i den lokale installasjonen av Outlook. Prøv å reparere installasjonen ved å gå til 'Kontrollpanel' > 'Programmer og funksjoner', høyreklikk på Outlook og velg 'Reparer'. Hvis dette ikke fungerer, kan vi veilede deg gjennom en manuell konfigurasjon av e-postkontoen din.",
                        author: firstLine._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Printer skriver ut blanke sider",
                description: "Skriveren på økonomiavdelingen skriver bare ut blanke sider, selv om tonernivået viser fullt. Vi har prøvd å bytte papir, starte skriveren på nytt og til og med reinstallere driverne, men ingenting ser ut til å fungere. Dette problemet har pågått i flere dager og påvirker vår evne til å skrive ut viktige dokumenter som fakturaer og rapporter.",
                category: "hardware",
                status: "resolved",
                priority: "medium",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Kan du åpne skriverens innstillinger og kjøre en rengjøringssyklus? Dette kan ofte løse problemer med utskriftskvalitet.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg har prøvd det, men det hjalp ikke. Hva annet kan jeg gjøre?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Prøv å fjerne tonerkassetten og riste den forsiktig for å fordele toneren jevnt. Sett den deretter tilbake og test utskrift igjen. Hvis problemet vedvarer, kan vi veilede deg gjennom en fullstendig tilbakestilling av skriveren.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det fungerte! Skriveren skriver ut som normalt nå. Tusen takk!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Kan ikke installere programvareoppdatering",
                description: "Jeg får feilmelding 0x80070057 når jeg prøver å installere den siste oppdateringen av regnskapssystemet. Jeg har prøvd å kjøre installasjonen som administrator, deaktivere antivirusprogrammet og til og med laste ned oppdateringen på nytt, men ingenting fungerer. Dette er kritisk, da oppdateringen inneholder viktige sikkerhetsfikser og nye funksjoner som vi trenger for å overholde regelverket.",
                category: "software",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Kan du prøve å kjøre oppdateringen i sikkerhetsmodus? For å gjøre dette, start maskinen på nytt, trykk F8 under oppstart, og velg 'Sikkerhetsmodus med nettverk'. Deretter kan du prøve å installere oppdateringen igjen.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg prøvde det, men får fortsatt samme feilmelding. Hva annet kan jeg gjøre?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Prøv å slette midlertidige filer ved å bruke Diskopprydding. Gå til 'Start' > 'Søk' > 'Diskopprydding', velg systemdisken og slett midlertidige filer. Etterpå kan du prøve oppdateringen på nytt. Gi oss beskjed om dette hjelper.",
                        author: secondLine._id,
                        createdAt: new Date()
                    }
                ]
            }
        ];

        // Insert tickets if they don't exist
        for (const ticket of tickets) {
            const existingTicket = await Ticket.findOne({ title: ticket.title });
            if (!existingTicket) {
                await Ticket.create(ticket);
                console.log(`Created ticket: ${ticket.title}`);
            }
        }

        console.log('Seed data completed successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}
