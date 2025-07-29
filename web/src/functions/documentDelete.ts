import axios from "axios"

export const documentDelete = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:3000/document-delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar o documento:", error);
    throw error;
  }
};
