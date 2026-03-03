import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Interface } from "./Interface";

export function InterfacePage() {
  const { id } = useParams<{ id: string }>();
  const [documento, setDocumento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchDocumento() {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/document/${id}`); // ajuste a URL da sua API
        setDocumento(res.data);
        console.log(res.data)
      } catch (err) {
        setError("Erro ao carregar o documento");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDocumento();
  }, [id]);

 async function handleUpdate(updatedDoc: any) {
  try {
    const res = await axios.put(`${apiUrl}/document-change/${id}`, updatedDoc);
    setDocumento(res.data); // <-- usa o documento retornado pelo banco
  } catch (err) {
    // alert("Erro ao salvar documento");
  }
}



  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Carregando documento...</p>
      </div>
    </div>
  );
}
  if (error) return <div>{error}</div>;
  if (!documento) return <div>Documento não encontrado</div>;

  return <Interface document={documento} onUpdate={handleUpdate} />;
}
