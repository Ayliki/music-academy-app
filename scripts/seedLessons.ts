import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

const lessonTemplates: { [key: string]: any[] } = {
    "понедельник": [
        { timeStart: "09:00", timeEnd: "09:45", lesson: "Сольфеджио", room: "Каб: желтый", instructor: "Преп: Роза Лукмановна", bgColor: "#FFC600" },
        { timeStart: "10:00", timeEnd: "10:45", lesson: "Хореография", room: "Каб: синий", instructor: "Преп: Алексей", bgColor: "#A3D2E2" },
    ],
    "вторник": [
        { timeStart: "10:00", timeEnd: "10:45", lesson: "Актерское мастерство", room: "Каб: оранжевый", instructor: "Преп: Роза Лукмановна", bgColor: "#F9B658" },
        { timeStart: "11:00", timeEnd: "11:45", lesson: "Вокал", room: "Каб: розовый", instructor: "Преп: Роза Лукмановна", bgColor: "#F4B2B2", actions: true },
    ],
    "среда": [
        { timeStart: "09:00", timeEnd: "09:45", lesson: "Фортепиано", room: "Каб: зеленый", instructor: "Преп: Иванов", bgColor: "#A7E8A3" },
        { timeStart: "10:00", timeEnd: "10:45", lesson: "Хореография", room: "Каб: синий", instructor: "Преп: Алексей", bgColor: "#A3D2E2" },
    ],
    "четверг": [
        { timeStart: "11:00", timeEnd: "11:45", lesson: "Сольфеджио", room: "Каб: желтый", instructor: "Преп: Роза Лукмановна", bgColor: "#FFC600" },
        { timeStart: "12:00", timeEnd: "12:45", lesson: "Вокал", room: "Каб: розовый", instructor: "Преп: Роза Лукмановна", bgColor: "#F4B2B2" },
    ],
    "пятница": [
        { timeStart: "09:00", timeEnd: "09:45", lesson: "Хореография", room: "Каб: синий", instructor: "Преп: Алексей", bgColor: "#A3D2E2" },
        { timeStart: "10:00", timeEnd: "10:45", lesson: "Актерское мастерство", room: "Каб: оранжевый", instructor: "Преп: Роза Лукмановна", bgColor: "#F9B658" },
    ],
};

const seedLessons = async () => {
    try {
        console.log("Seeding lessons for the next month...");
        const today = new Date();
        const batch = writeBatch(db);

        for (let i = 0; i < 30; i++) {
            const lessonDate = new Date(today);
            lessonDate.setDate(today.getDate() + i);

            const formattedDate = lessonDate.toISOString().split("T")[0];

            const dayLabel = lessonDate
                .toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })
                .replace(/[.,]/g, '')
                .trim();

            const weekdayLong = lessonDate
                .toLocaleDateString("ru-RU", { weekday: "long" })
                .toLowerCase();

            const lessonsForDay = lessonTemplates[weekdayLong];
            if (!lessonsForDay) continue;

            for (const lesson of lessonsForDay) {
                const lessonId = `${formattedDate}-${lesson.timeStart.replace(":", "")}`;
                const lessonRef = doc(collection(db, "lessons"), lessonId);
                batch.set(lessonRef, { ...lesson, date: formattedDate, dayLabel });
                console.log(`Prepared lesson for ${weekdayLong} on ${formattedDate}: ${lesson.lesson} at ${lesson.timeStart}`);
            }
        }
        await batch.commit();
        console.log("Lesson seeding completed!");
    } catch (error) {
        console.error("Error seeding lessons:", error);
    }
};

seedLessons();
