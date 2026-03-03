import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentCard } from "./DocumentCard";
import type { Document } from "../types/types";
import { useNavigate } from "react-router-dom";
export function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Busca documentos na API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${apiUrl}/documents`);

        setDocuments(response.data);
        setFilteredDocuments(response.data);
      } catch (err) {
        setError("Servidor indisponível no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filtra os documentos conforme busca
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = documents.filter((doc) => {
      const titleMatch = (doc.formData?.title ?? "")
        .toLowerCase()
        .includes(lowerSearch);

      const keywordsMatch = (doc.palavrasChave ?? []).some((kw) =>
        kw.toLowerCase().includes(lowerSearch),
      );

      const referencesMatch = (doc.referencias ?? []).some((ref) =>
        ref.toLowerCase().includes(lowerSearch),
      );

      return titleMatch || keywordsMatch || referencesMatch;
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

  const groupedDocuments = filteredDocuments.reduce(
    (acc, doc) => {
      const type = doc.type || "outros";

      if (!acc[type]) {
        acc[type] = [];
      }
      // console.log(type)

      acc[type].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>,
  );

// Tela de carregamento, enquanto o servidor carrega
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Carregando documentos...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue text-white px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

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
          className="bg-blue text-white px-6 py-2 rounded-full font-semibold hover:bg-blue transition"
        >
          Novo Documento
        </button>
      </div>

      <div className="min-h-screen bg-gray-100 px-8 py-6">
        <h1 className="text-2xl font-medium mb-6">Meus Documentos</h1>
        {Object.entries(groupedDocuments).map(([type, docs]) => (
          <div key={type} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 capitalize">{type}</h2>

            <div className="flex flex-wrap gap-4">
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onClick={() => handleOpenDocument(doc.id)}
                />
              ))}
            </div>
          </div>
        ))}
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
                    className="w-full text-left p-2 hover:bg-blue  hover:text-white rounded"
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
