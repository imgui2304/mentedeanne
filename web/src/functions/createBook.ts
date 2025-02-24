import axios from "axios";

interface DocumentData {
    title: string;
    photoDocument: string;
    DocumentDescription: string;
    DocumentInsight: string;
}

export const createDocument = async ({ title, photoDocument, DocumentDescription, DocumentInsight }: DocumentData) => {
    const response = await axios.post("http://localhost:3000/create-document", {
        title,
        photoDocument,
        DocumentDescription,
        DocumentInsight,
    })
    return response.data;

};
