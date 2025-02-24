import { useState } from "react";
import axios from "axios";

// import { createDocument } from "../functions/createBook";
interface DocumentData {
  title: string;
  photoDocument: string;
  DocumentDescription: string;
  DocumentInsight: string;
}

export const CreateBookForm = () => {
  const [title, setTitle] = useState("");
  const [photoDocument, setPhotoDocument] = useState("");
  const [DocumentDescription, setDocumentDescription] = useState("");
  const [DocumentInsight, setDocumentInsight] = useState("");
  const [documentCreated, setDocumentCreated] = useState(false);

  const createDocument = async (
    {
      title,
      photoDocument,
      DocumentDescription,
      DocumentInsight,
    }: DocumentData,
    e: any
  ) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/create-document", {
      photoDocument,
      title,
      DocumentDescription,
      DocumentInsight,
    });
    console.log(response.status);
    if (response.status == 201) {
      setDocumentCreated(true);

      // Após 3 segundos, esconder a mensagem de sucesso
      setTimeout(() => {
        setDocumentCreated(false);
      }, 3000); // A mensagem ficará visível por 3 segundos
    }

    return response.data;
  };

  return (
    <div className="bg-custom-black p-5 rounded-lg w-full">
      <h1 className="text-white text-xl font-bold mb-4">Adicionar Documento</h1>
      <form className="flex-col gap-4 flex text-white">
        <input
          type="file"
          className="text-white border-[0.01px]  border-custom-gray w-42 p-3 h-36 rounded-[5px]"
          placeholder="Foto do documento"
          onChange={(e) => setPhotoDocument(e.target.value)}
        />
        <h1 className="text-white text-xl font-bold mb-4">
          Informações do Documento
        </h1>

        <div className="grid grid-cols-2 gap-4 w-full h-full">
          <input
            type="text"
            className="text-white border-[0.01px]  border-custom-gray p-3 min-h-[40px] w-full rounded-[5px] outline-none resize-y"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="text-white border-[0.01px]  border-custom-gray p-3 min-h-[40px] w-full rounded-[5px] outline-none resize-y"
            placeholder="Descrição do documento"
            onChange={(e) => setDocumentDescription(e.target.value)}
          />
          <textarea
            className="text-white border-[0.01px] border-custom-gray p-3 min-h-[40px] w-full rounded-[5px] outline-none bg-custom-black resize-y"
            placeholder="O que você entendeu?"
            onChange={(e) => setDocumentInsight(e.target.value)}
          />
        </div>
        <button
          onClick={(e) =>
            createDocument(
              {
                title,
                photoDocument,
                DocumentDescription,
                DocumentInsight,
              },
              e
            )
          }
          className="p-3 rounded-[5px] w-[500px] h-[50px] bg-custom-purple text-white text-center font-bold hover:cursor-pointer"
        >
          Adicionar
        </button>

        {/* Mensagem de sucesso com animação fade */}
        {documentCreated && (
          <div
            className="bg-custom-purple bottom-4 right-4 absolute rounded-[5px] transition-opacity duration-500 opacity-100"
            style={{
              transition: "opacity 0.5s ease-out",
            }}
          >
            <h1 className="p-3">Documento criado com sucesso! Recarregue a página.</h1>
          </div>
        )}
      </form>
    </div>
  );
};
