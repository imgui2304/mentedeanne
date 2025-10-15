// types.ts

export interface BaseDocument {
  id: string;
  type: string;
  palavrasChave?: string[];
  referencias?: string[];
  resumo?: string;
}

export interface BookDocument extends BaseDocument {
  type: "livro";
  formData: {
    title: string;
    author: string;
    publisher: string;
    year: string;
    linkBook: string;
  };
  capitulos: { id: number; resumo: string }[];
}

export interface LectureDocument extends BaseDocument {
  type: "palestra";
  formData: {
    title: string;
    date?: string;
    event?: string;
    institution?: string;
    linkAccess?: string;
    speaker?: string;
    workload?: string;
  };
}

export interface ArticleDocument extends BaseDocument {
  type: "artigo";
  formData: {
    title: string;
    ISSN?: string;
    author?: string[];
    year?: string;
    linkAccess?: string;
  };
}

export interface CourseDocument extends BaseDocument {
  type: "curso";
  formData: {
    title: string;
    institution: string;
    workload: string;
    year: string;
    linkAccess: string;
  };
}

export interface DocumentDocument extends BaseDocument {
  type: "document";
  formData: {
    title: string;
    category: string;
    documentSummary: string;
    linkAccess: string;
    pageCount: string;
    placePublication: string;
    year: string;
    author: string;
  };
}

export interface LegislationDocument extends BaseDocument {
  type: "legislação";
  formData: {
    title: string;
    classification: string;
    linkAccess: string;
    organ: string;
    purpose: string;
    specification: string;
    year: string;
  };
}

export type Document =
  | BookDocument
  | LectureDocument
  | ArticleDocument
  | CourseDocument
  | DocumentDocument
  | LegislationDocument;

  
export type DocumentType =
  | "livro"
  | "palestra"
  | "artigo"
  | "curso"
  | "document"
  | "legislação";
