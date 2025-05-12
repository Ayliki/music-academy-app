import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

const teacherTemplates = [
    {
        name: "Иван Иванов",
        subject: "Пианино",
        photo: "teacher1.jpg",
    },
    {
        name: "Мария Петрова",
        subject: "Хореография",
        photo: "teacher2.jpg",
    },
    {
        name: "Алексей Смирнов",
        subject: "Сольфеджио",
        photo: "teacher3.jpg",
    },
    {
        name: "Елена Кузнецова",
        subject: "Вокал",
        photo: "teacher4.jpg",
    },
    {
        name: "Дмитрий Соколов",
        subject: "Гитара",
        photo: "teacher5.jpg",
    },
];

const seedTeachers = async () => {
    try {
        console.log("Seeding teachers...");
        const batch = writeBatch(db);
        const teachersCol = collection(db, "teachers");

        teacherTemplates.forEach((teacher, index) => {
            const teacherId = `teacher-${index + 1}`;
            const teacherRef = doc(teachersCol, teacherId);
            batch.set(teacherRef, teacher);
            console.log(`Prepared teacher: ${teacher.name} (${teacher.subject})`);
        });

        await batch.commit();
        console.log("Teacher seeding completed!");
    } catch (error) {
        console.error("Error seeding teachers:", error);
    }
};

seedTeachers();
