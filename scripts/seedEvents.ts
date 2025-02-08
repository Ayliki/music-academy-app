import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

const eventTemplates = [
    {
        title: "Симфония любви",
        date: "2025-02-15",
        image: "event1.png",
    },
    {
        title: "Спортивное шоу Алексея Немова «Легенды спорта. Монолог",
        date: "2025-03-05",
        image: "",
    },
    {
        title: "Выступление на НТВ “Наше поколение",
        date: "2025-04-10",
        image: "",
    },
];

const seedEvents = async () => {
    try {
        console.log("Seeding events...");
        const batch = writeBatch(db);
        const eventsCol = collection(db, "events");

        eventTemplates.forEach((event, index) => {
            const eventId = `event-${index + 1}`;
            const eventRef = doc(eventsCol, eventId);
            batch.set(eventRef, event);
            console.log(`Prepared event: ${event.title} on ${event.date}`);
        });

        await batch.commit();
        console.log("Events seeding completed!");
    } catch (error) {
        console.error("Error seeding events:", error);
    }
};

seedEvents();
