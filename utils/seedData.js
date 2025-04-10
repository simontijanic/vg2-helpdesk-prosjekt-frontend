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

        // Create support staff - Førstelinje og andrelinje
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

        // Hent opprettede brukere til referanse
        const admin = await User.findOne({ email: 'admin@helpdesk.com' });
        const firstLine = await User.findOne({ email: 'firstline@helpdesk.com' });
        const secondLine = await User.findOne({ email: 'secondline@helpdesk.com' });
        const user = await User.findOne({ email: 'user@example.com' });

        // Opprett sample tickets med mer detaljerte beskrivelser og samtaler
        const tickets = [
            {
                title: "problemer med jævla Word dokuemnterrr!!!",
                description: "når jeg forsøker å åpne et viktig word dokument så  får jeg en feilmelding om at filen er skadet eller utilgjengelig. jeg har allerede prøvd å åpne filen på andre datamaskiner og kopiere den til en annen lagringsenhet men det jævla  problemet vedvarer. Dette dokumentet er drit viktig for meg og for utarbeidelsen av rapporter til kunder og interne møter jeg skal ha!!",
                category: "software",
                status: "open",
                priority: "high",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Hei! Har du forsøkt å bruke 'Åpne og reparer'-funksjonen i Word? Dette kan ofte redde skadde dokumenter. Pass også på at dokumentet ikke er låst av en annen prosess.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "jeg er ganske fortvilet akkurat nå. Jeg leter gjennom alle menyene men finner ikke noe jalla ting som heter 'Åpne og reparer'. Er det en skjult funksjon eller har jeg helt oversett den?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "For å finne funksjonen, åpne Word og klikk på 'Fil' -> 'Åpne'. Velg dokumentet, og deretter klikker du på pilen ved siden av 'Åpne'-knappen. Der burde du se alternativet 'Åpne og reparer'. Har du fått til dette?",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg prøvde metoden din men dokumentet returnerer fremdeles en feilmelding. er så pissed fordi rapporten min haster og jeg føler at teknologien svikter meg når jeg trenger den mest!",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg forstår frustrasjonen din. Som et neste steg anbefaler jeg å se etter en tidligere lagret versjon av dokumentet hvis du benytter OneDrive eller en annen skylagringstjeneste. Alternativt kan vi undersøke tredjepartsverktøy som kan reparere filen direkte.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "helvete, det tenkte jeg ikke på! jeg fant faktisk en tidligere versjon i OneDrive selv om den ikke er oppdater er det bedre enn ingenting! Jeg er lettet selv om jeg fortsatt lurer på hva som gikk galt. Takk for den hjelpen G!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "PC-skjermen blir bare blå",
                description: "Hver gang jeg starter PC-en, opplever jeg en blåskjerm med feilkode 0x0000008E, noe som fører til at jeg mister arbeid. Feilen oppstår nesten umiddelbart etter BIOS-opplasting og jeg mistenker at det kan være noe fysisk med pc-en min.",
                category: "hardware",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Hei, blåskjerm-feil kan ofte skyldes driverkonflikter eller maskinvarefeil. Har du nylig installert noen nye drivere eller oppdateringer?",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Ja, jeg oppdaterte grafikkdriverne forrige uke, men nå plutselig så får jeg de problemene. Jeg er skikkelig irritert siden jeg må arbeide og bruke pc-en til viktig greier!!",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Forståelig nok. Jeg foreslår at du ruller tilbake den siste driveroppdateringen for grafikkortet. I tillegg kan du sjekke systemlogger for å se om det dukker opp ytterligere informasjon om feilkoden.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg prøvde å rulle tilbake driverne, men feilen dukker opp sporadisk selv etterpå. Nå frykter jeg at det kan være en fysisk feil med maskinvaren.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Da anbefaler jeg at du kjører en diagnostisk test på både minne og harddisk. Start med en minnetest og deretter en sjekk for eventuelle dårlige sektorer på harddisken. Dette vil hjelpe oss med å fastslå hvor problemet ligger.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Etter å ha kjørt en minnetest, fant jeg ingen feil med RAM, men noen dårlige sektorer ble oppdaget på harddisken. Jeg har tatt backup, men situasjonen har fått meg til å føle meg veldig bekymret.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det er lurt at du tok backup. Dårlige sektorer kan tyde på at harddisken snart svikter fullstendig. Jeg anbefaler at du vurderer å bytte ut harddisken og reinstallere systemet for å sikre stabil drift.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Takk for den grundige veiledningen. Jeg er fortsatt litt stressa, men nå har jeg en klar plan framover og føler meg tryggere på hvordan jeg skal håndtere situasjonen.",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            
            {
                title: "glemt passord til yt-kontoen drittkjip",
                description: "jeg har glemt passordet til youtube kontoen min og får ikkje mail med instruksjoner. det er skikkelig dritt, men æ orker ikkje den greia med å nullstilla, eg fikser det sjøl om alle sier at eg må."
                ,
                category: "access",
                status: "open",
                priority: "medium",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Hei, har du sjekket spam- eller søppelpostmappen for e-posten med instruksjoner om passordgjenoppretting?",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Ey, hvem ass sjekker sånt? Det er jo bare kjedelige mailar og æ diggar berre youtube og alt annet, ikke sånn at æ skal stresse med sånt pølse.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "For å være sikker anbefaler jeg likevel at du sjekker både spam- og søppelpostmappen. Noen ganger havner passordgjenopprettingsmeldinger der, selv om det kan virke unødvendig.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Haha, æ har sjekka alt og spam, søppel, alt det der. Æ orker ikkje sånn kjedelig trøbbel. Æ vet jo alt, ass, eg er liksom for kul til å la sånt stoppe meg.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Dersom du fortsatt ikke mottar e-posten, vil jeg anbefale at du går direkte til YouTube sin kontogjenopprettingsside og fyller ut all nødvendig informasjon for å tilbakestille passordet.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Kontogjenopprettingsside? Sleng det med, ass! Æ har det jo helt under kontroll. Det er bare for folk som ikkje fikser ting sjøl. Jeg fikser det, jeg er tross alt på topp!",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Husk at om du senere skulle ønske litt veiledning, står vi klare til å hjelpe. Vi er her for å sikre at du får den assistansen du trenger.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Alright, får se om jeg fikser det på min måte. Jeg viser jo at jeg er kul, men skal vel sjekka det hvis det virkelig blir nødvendig. Peace!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            

            {
                title: "Internett fungerer ikke i hjemmekontoret",
                description: "Internettforbindelsen i hjemmekontoret mitt har vært ekstremt ustabil de siste dagene. Jeg opplever hyppige frakoblinger og lav hastighet, noe som forstyrrer både videomøter og tilgang til nødvendige servere. Til tross for at jeg har startet ruteren på nytt og sjekket kablene, fortsetter problemene.",
                category: "network",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Hei, kan du sjekke om andre enheter i hjemmet også har problemer med internett? Det kan hjelpe oss med å identifisere om feilen ligger i ruterens konfigurasjon eller om leverandøren har større problemer.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg har testet med PC, mobil og nettbrett og alle opplever samme tilkoblingsproblemer. Jeg blir virkelig frustrert, for jeg trenger en stabil forbindelse til jobbmøter og viktige oppgaver.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "La oss prøve en full fabrikktilbakestilling på ruteren. Hent frem rutermanualen og følg instruksjonene for en full reset, og sett opp nettverket på nytt etterpå.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg fulgte manualen steg for steg og det var en tidkrevende prosess, men etter oppsettet virker forbindelsen litt bedre. Likevel er det fortsatt en uunngåelig følelse av at noe ikke er helt riktig.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det er bra du ser en forbedring, men hvis problemer fortsetter, anbefaler jeg at du kontakter internettleverandøren for en grundigere sjekk. Vi kan også bistå med feilsøking om nødvendig.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg skal ta kontakt med leverandøren og håper virkelig på en varig løsning. Takk for oppfølgingen og selv om irritasjonen er stor nå, setter jeg pris på hjelpen din!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Problemer med VPN",
                description: "Etter en nylig oppdatering av sikkerhetsinnstillingene på min maskin, klarer jeg ikke å etablere en stabil VPN-tilkobling til firmaets nettverk. Tilkoblingen faller ut etter kort tid, og jeg får feilmeldinger om uautoriserte tilganger. Dette hindrer meg i å jobbe eksternt mens jeg er på reise, og det haster at jeg får en løsning.",
                category: "access",
                status: "open",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Hei, VPN-problemer etter systemoppdateringer kan skyldes endringer i konfigurasjonen. Har du forsøkt å starte maskinen på nytt og dobbeltsjekke alle nettverksinnstillingene dine?",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg har startet maskinen på nytt flere ganger og kontrollert innstillingene og likevel fortsetter feilen. Jeg får til og med en melding om at tilkoblingen blir blokkert, og jeg begynner å bli veldig stressa siden viktige møter nærmer seg.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det er forståelig at du føler press. La oss prøve å slette den gamle VPN-konfigurasjonen fullstendig og opprette en ny profil. Dette kan ofte fjerne gamle feilkonfigurasjoner som forårsaker slike blokkeringer.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg slettet den gamle profilen og opprettet en helt ny, men feilmeldingene vedvarer til en viss grad. Det virker også som om serveren til firmaet har problemer med å godkjenne tilkoblingen.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Prøv å midlertidig deaktivere brannmuren din for å sjekke om den hindrer VPN-tilkoblingen. Dette er kun for å teste teorien og husk å aktivere den igjen etterpå!",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Jeg deaktiverte brannmuren for en kort test, og tilkoblingen ble noe mer stabil. Jeg føler en viss lettelse, men bekymrer meg fortsatt for sikkerheten på lang sikt.",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Bra at det hjalp noe. Når du føler deg trygg nok, vil vi bistå med å konfigurere brannmurreglene på nytt slik at du både har en sikker og stabil VPN-tilkobling.",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Det høres ut som en god plan. Jeg setter stor pris på den detaljerte oppfølgingen og tålmodigheten deres og takk for at dere hjelper meg gjennom denne krevende prosessen!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            }
        ];
        

        // Sett inn tickets dersom de ikke allerede eksisterer
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
