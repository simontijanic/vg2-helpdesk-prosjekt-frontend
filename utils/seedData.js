const mongoose = require('mongoose');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

exports.seedAdmin = async () => {
    try {
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
                description: "Får feilmelding om at passordet er utløpt når jeg prøver å logge inn på min arbeidsstasjon.",
                category: "access",
                status: "resolved",
                priority: "high",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Har du prøvd å endre passordet via vår selvbetjeningsportal?",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Nei, det har jeg ikke. Hvor finner jeg denne portalen?",
                        author: user._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Gå til password.company.com og følg instruksjonene. La meg vite om du trenger mer hjelp.",
                        author: firstLine._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Nettverksproblemer i møterom",
                description: "Vi opplever ustabil internettforbindelse i møterom B3. Dette påvirker videomøter.",
                category: "network",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Vi ser noen signalproblemer med WiFi-aksesspunktet i det området. En tekniker er på vei.",
                        author: secondLine._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Outlook synkroniserer ikke",
                description: "Outlook har ikke synkronisert e-poster siden i går. Har prøvd å starte programmet på nytt.",
                category: "email",
                status: "open",
                priority: "medium",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Kan du sjekke om du har tilgang til Outlook på web (outlook.office.com)?",
                        author: firstLine._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Printer skriver ut blanke sider",
                description: "Skriveren på økonomiavdelingen skriver bare ut blanke sider. Tonernivå viser fullt.",
                category: "hardware",
                status: "resolved",
                priority: "medium",
                creator: user._id,
                supportLevel: "first-line",
                comments: [
                    {
                        text: "Dette høres ut som en feil med trommelenheten. Jeg sender en tekniker.",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Tekniker har byttet trommelenhet. Er problemet løst nå?",
                        author: firstLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Ja, skriveren fungerer perfekt nå. Takk for hjelpen!",
                        author: user._id,
                        createdAt: new Date()
                    }
                ]
            },
            {
                title: "Kan ikke installere programvareoppdatering",
                description: "Får feilmelding 0x80070057 når jeg prøver å installere siste oppdatering av regnskapssystemet.",
                category: "software",
                status: "in-progress",
                priority: "high",
                creator: user._id,
                supportLevel: "second-line",
                comments: [
                    {
                        text: "Dette ser ut til å være en kjent feil med siste oppdatering. Har du prøvd å kjøre installasjonen som administrator?",
                        author: secondLine._id,
                        createdAt: new Date()
                    },
                    {
                        text: "Vi trenger å gjøre noen systemendringer for å løse dette. Kan jeg få fjerntilgang til maskinen din?",
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
