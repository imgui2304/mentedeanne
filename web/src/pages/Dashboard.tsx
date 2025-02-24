import { useEffect, useState } from "react";
// import { ButtonBook } from "../components/ButtonBook";
import { CreateBookForm } from "../components/CreateBookForm";
import axios from "axios";

export const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null); // Novo estado para o documento selecionado

  useEffect(() => {
    axios.get("http://localhost:3000/documents").then((response) => {
      setDocuments(response.data);
      console.log(response.data);
    });
  }, []);

  const handleDocumentClick = (documentId: string) => {
    const selectedDoc = documents.find((doc: any) => doc.id === documentId);
    setShowCreateForm(false)

    setSelectedDocument(selectedDoc);
  };

  const handleAddBookClick = () => {
    setShowCreateForm(true);
    
    setSelectedDocument(null); // Limpa o documento selecionado ao adicionar um livro
  };

  return (
    <div className="flex bg-custom-dark">
    <div className="w-[300px] p-5 h-screen border-r-[0.01px] border-custom-gray flex flex-col justify-between gap-2">
        <span className="text-custom-gray text-[14px]">Livros guardados</span>
        <div className="h-full flex flex-col gap-3">
          {documents.map((document: any) => (
            <button
              className="text-center overflow-hidden flex flex-col items-start w-full max-h-[50px] bg-custom-black text-white p-3 rounded-[5px] hover:cursor-pointer"
              id={document.id}
              onClick={() => handleDocumentClick(document.id)}
            >
              {document.title}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddBookClick} // Modificado para a função que limpa o documento selecionado
          className="p-3 rounded-[5px] h-[50px] bg-custom-purple text-white text-center font-bold hover:cursor-pointer"
        >
          Adicionar livro
        </button>
      </div>
    <main className="w-full h-screen bg-custom-dark flex">
      {/* Menu lateral */}
      

      {/* Formulário de criação de livro */}
      <div className="flex-1 p-5">
        {showCreateForm && <CreateBookForm />}

        {/* Exibindo o conteúdo do documento selecionado */}
        {selectedDocument && (
          <div className="w-full overflow-scroll bg-custom-black text-white p-5 rounded-lg shadow-lg flex flex-col gap-4">
            <h2 className="text-4xl font-bold mb-4 overflow-hidden">
              {selectedDocument.title}
            </h2>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Descrição</h1>
              <p className="text-lg">
                {selectedDocument.DocumentDescription}
              </p>{" "}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Pontos destacados</h1>
              <p>{selectedDocument.DocumentInsight}</p>
            </div>
          </div>
        )}
      </div>
    </main>
    </div>
  );
};
