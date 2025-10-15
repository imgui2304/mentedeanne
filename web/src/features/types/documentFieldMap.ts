import type { DocumentType } from "./types";

export interface DocumentField {
  label: string;
  name: string;
  type: "text" | "textarea" | "number" | "date" | "url";
  required?: boolean;
}

export const documentFieldMap: Record<DocumentType, DocumentField[]> = {
  livro: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Data", name: "date", type: "date" },
    { label: "Autor", name: "author", type: "text" },
    { label: "Editora", name: "publisher", type: "text" },
    
    { label: "Link do Livro", name: "linkBook", type: "url" },
  ],
  artigo: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Data", name: "date", type: "date" },

    { label: "Autores", name: "author", type: "text" },
    { label: "ISSN", name: "ISSN", type: "text" },
    
    { label: "Link", name: "linkAccess", type: "url" },
  ],
  curso: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Data", name: "date", type: "date" },

    { label: "Instituição", name: "institution", type: "text" },
    { label: "Carga Horária", name: "workload", type: "text" },
    
    { label: "Link de Acesso", name: "linkAccess", type: "url" },
  ],
  legislação: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Classificação", name: "classification", type: "text" },
    { label: "Data", name: "date", type: "date" },

    { label: "Órgão", name: "organ", type: "text" },
    { label: "Finalidade", name: "purpose", type: "textarea" },
    { label: "Especificação", name: "specification", type: "textarea" },
    
    { label: "Link de Acesso", name: "linkAccess", type: "url" },
  ],
  palestra: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Data", name: "date", type: "date" },
    { label: "Evento", name: "event", type: "text" },
    { label: "Instituição", name: "institution", type: "text" },
    { label: "Palestrante", name: "speaker", type: "text" },
    { label: "Carga Horária", name: "workload", type: "text" },
    { label: "Link de Acesso", name: "linkAccess", type: "url" },
  ],
  document: [
    { label: "Título", name: "title", type: "text", required: true },
    { label: "Data", name: "date", type: "date" },

    { label: "Categoria", name: "category", type: "text" },
    { label: "Autor", name: "author", type: "text" },
    { label: "Resumo", name: "documentSummary", type: "textarea" },
    
    { label: "Páginas", name: "pageCount", type: "text" },
    { label: "Local", name: "placePublication", type: "text" },
    { label: "Link", name: "linkAccess", type: "url" },
  ],
};
