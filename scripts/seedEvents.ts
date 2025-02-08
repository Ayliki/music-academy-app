import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

const eventTemplates = [
    {
        title: "Концерт классической музыки",
        date: "2025-02-15",
        image: "event1.png",
        description: "Насладитесь прекрасной классической музыкой.",
        location: "Большой зал, Москва",
    },
    {
        title: "Фестиваль современного искусства",
        date: "2025-03-05",
        image: "",
        description: "Откройте для себя работы современных художников.",
        location: "Центральная галерея, Санкт-Петербург",
    },
    {
        title: "Выставка фотографий природы",
        date: "2025-04-10",
        image: "",
        description: "Увидьте красоту природы в фотографиях.",
        location: "Выставочный зал, Казань",
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
