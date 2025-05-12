import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "../services/firebaseConfig";


const uploadImageAsync = async (uri: string) => {
    const blob = await uriToBlob(uri);
    console.log(blob);
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    console.log(filename);
    const storageRef = ref(storage, `images/${filename}`);
    console.log(storageRef);

    const metadata = {
        contentType: 'image/jpeg',
    };


    const snapshot = await uploadBytes(storageRef, blob, metadata);
    // Получаем ссылку для доступа к изображению
    return await getDownloadURL(snapshot.ref);
};

const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    return await response.blob();
};

export {uploadImageAsync};