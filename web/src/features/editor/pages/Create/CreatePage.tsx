// CreatePage é o componente de página que lida com o routing, captura o parâmetro da URL (type) e decide qual formulário renderizar.

import { useParams } from "react-router-dom";
import type { DocumentType } from "../../../types/types"; // ["livro", "artigo", etc.]
import { BookCreateForm } from "./Create";

export function CreatePage() {
  const { type } = useParams();

  const documentTypes: DocumentType[] = [
    "livro", "artigo", "document", "curso", "legislação", "palestra"
  ];

  if (!type || !documentTypes.includes(type as DocumentType)) {
    return <p className="text-red-500">Tipo de documento inválido</p>;
  }

  return <BookCreateForm type={type as DocumentType} />;
}
