🚀 Запуск проекта (Expo)

## **1. Клонирование репозитория**
\`\`\`sh
git clone https://github.com/ваш-юзернейм/ваш-репозиторий.git
cd ваш-репозиторий
\`\`\`

## **2. Установка зависимостей**
Перед запуском убедитесь, что у вас установлен **Node.js** и **npm/yarn**.  
Затем установите зависимости:
\`\`\`sh
npm install
# или
yarn install
\`\`\`

## **3. Установка Expo CLI (если не установлен)**
\`\`\`sh
npm install -g expo-cli
\`\`\`

## **4. Настройка Firebase**
Создайте \`.env\` файл и добавьте ключи:
\`\`\`env
FIREBASE_API_KEY=ваш_ключ
FIREBASE_AUTH_DOMAIN=ваш_домен
FIREBASE_PROJECT_ID=ваш_айди
FIREBASE_STORAGE_BUCKET=ваш_бакет
FIREBASE_MESSAGING_SENDER_ID=ваш_айди
FIREBASE_APP_ID=ваш_айди
\`\`\`

## **5. Запуск на iOS**
📱 **Для запуска на телефоне:**  
1. Установите **Expo Go** из App Store  
2. Запустите проект одной из команд:
\`\`\`sh
expo start
# или
npm start
\`\`\`
3. Отсканируйте QR-код в **Expo Go**

🖥 **Для запуска в iOS-симуляторе (Mac + Xcode):**  
\`\`\`sh
expo start --ios
\`\`\`" > README.md
