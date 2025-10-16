import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentCard } from "./DocumentCard";
import type { Document } from "../types/types";
import { useNavigate } from "react-router-dom";
export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;


  // Busca documentos na API
useEffect(() => {
  axios.get(`${apiUrl}/documents`).then((response) => {
    setDocuments(response.data);
    console.log(`${apiUrl}/documents`)
    setFilteredDocuments(response.data);
  });
}, []);




  // Filtra os documentos conforme busca
  useEffect(() => {
  const lowerSearch = searchTerm.toLowerCase();

  const filtered = documents.filter((doc) => {
    const titleMatch = (doc.formData?.title ?? "")
      .toLowerCase()
      .includes(lowerSearch);

    const keywordsMatch = (doc.palavrasChave ?? [])
      .some((kw) => kw.toLowerCase().includes(lowerSearch));

    return titleMatch || keywordsMatch;
  });

  setFilteredDocuments(filtered);
}, [searchTerm, documents]);

  // Tipos para criar documento (mesmo que no modal)
  const documentTypes = [
    { value: "livro", label: "Livro" },
    { value: "artigo", label: "Artigo" },
    { value: "document", label: "Monografia, TCC, etc." },
    { value: "palestra", label: "Palestra" },
    { value: "curso", label: "Curso" },
    { value: "legislação", label: "Legislação" },
  ];

  const handleCreateClick = () => {
    setShowModal(true);
  };
  const handleOpenDocument = (id: string) => {
    console.log("Clicou no documento com ID:", id); // 👈 Teste
    navigate(`/documentos/${id}`);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDocumentTypeSelect = (type: string) => {
    navigate(`/create/${type}`);
    console.log("Selecionou criar documento do tipo:", type);
    setShowModal(false);
  };

  return (
    <main>
      <div className="w-full h-16 shadow-gray-100 shadow-2xl flex items-center justify-around gap-4">
        <div>
          <h1 className="text-2xl">Mente de Anne Matos</h1>
        </div>
        <div className="w-1/3">
          <input
            type="search"
            className="w-full h-full bg-zinc-200 p-4 rounded-3xl text-1xl"
            placeholder="Buscar Documento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Novo Documento
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 px-8 py-6">
        <h1 className="text-2xl font-medium mb-6">Meus Documentos</h1>
        <div className="flex flex-wrap gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onClick={() => handleOpenDocument(doc.id)}
            />
          ))}
        </div>
      </div>

      {/* Modal para escolher o tipo do documento */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-100 bg-opacity-25 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">
              Selecione o tipo do documento
            </h2>
            <ul>
              {documentTypes.map((type) => (
                <li key={type.value}>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleDocumentTypeSelect(type.value)}
                  >
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleModalClose}
              className="mt-4 text-red-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
