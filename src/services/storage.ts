import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export const uploadFiles = async (files: FileList | File[] | null, basePath: string): Promise<string[]> => {
    if (!files || (files instanceof FileList && files.length === 0) || (Array.isArray(files) && files.length === 0)) return [];

    const fileArray = files instanceof FileList ? Array.from(files) : files;
    console.log(`Uploading ${fileArray.length} files to ${basePath}...`);

    const uploadPromises = fileArray.map(async (file) => {
        try {
            console.log(`Uploading file: ${file.name}`);
            const url = await uploadFile(file, basePath);
            console.log(`File uploaded: ${file.name}`);
            return url;
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            throw error;
        }
    });
    return Promise.all(uploadPromises);
};
