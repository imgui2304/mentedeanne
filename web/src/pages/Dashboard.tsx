import { useEffect, useState } from "react";
import { CreateBookForm } from "../components/pages/interfaceCreate/CreateBookForm";
import axios from "axios";
import { CreateArticle } from "../components/pages/interfaceCreate/CreateArticle";
import { CreateDocuments } from "../components/pages/interfaceCreate/CreateDocuments";
import { CreateLecture } from "../components/pages/interfaceCreate/CreateLecture";
import { CreateCourse } from "../components/pages/interfaceCreate/CreateCourse";
import { CreateLegislation } from "../components/pages/interfaceCreate/CreateLegislation";
import { InterfaceLecture } from "../components/pages/interfaceForData/InterfaceLecture";
import { InterfaceBook } from "../components/pages/interfaceForData/InterfaceBook";
import { InterfaceArticle } from "../components/pages/interfaceForData/InterfaceArticle";
import { InterfaceDocument } from "../components/pages/interfaceForData/InterfaceDocument";
import { InterfaceCourse } from "../components/pages/interfaceForData/InterfaceCourse";
import { InterfaceLegislation } from "../components/pages/interfaceForData/InterfaceLegislation";

interface BaseDocument {
  id: string;
  type: string;
  palavrasChave?: string[];
  referencias?: string[];
  resumo?: string;
}

interface BookDocument extends BaseDocument {
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

interface LectureDocument extends BaseDocument {
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

interface ArticleDocument extends BaseDocument {
  type: "artigo";
  formData: {
    title: string;
    ISSN?: string;
    author?: string[];
    year?: string;
    linkAccess?: string;
  };
}
interface CourseDocument extends BaseDocument {
  type: "curso";
  formData: {
    title: string;
    institution: string;
    workload: string;
    year: string;
    linkAccess: string;
  };
  palavrasChave: string[];
  referencias: string[];
  resumo: string;
}

interface DocumentDocument extends BaseDocument {
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
  palavrasChave?: string[];
  referencias?: string[];
  resumo?: string;
}

interface LegislationDocument extends BaseDocument {
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
  palavrasChave: string[];
  referencias: string[] | undefined;
  resumo: string;
}

type Document =
  | BookDocument
  | LectureDocument
  | ArticleDocument
  | CourseDocument
  | DocumentDocument
  | LegislationDocument;

interface DocumentType {
  value: string;
  label: string;
}

export const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInterface, setShowInterface] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [selectedType, setSelectedType] = useState<string>("");
  const [searchDocument, setSearchDocument] = useState<string>("");
  const [indexDocument, setIndexDocument] = useState<number>(0);
  const [typeDocument, setTypeDocument] = useState<string>();
  const [selectedCreateType, setSelectedCreateType] = useState<string>("");

  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  const documentTypes: DocumentType[] = [
    { value: "livro", label: "Livro" },
    { value: "artigo", label: "Artigo" },
    { value: "document", label: "Monografia, TCC, etc." },
    { value: "palestra", label: "Palestra" },
    { value: "curso", label: "Curso" },
    { value: "legislação", label: "Legislação" },
  ];

  // Busca os documentos apenas uma vez ao montar
  useEffect(() => {
    axios.get("https://mentedeanne-production.up.railway.app/documents").then((response) => {
      setDocuments(response.data);
      setFilteredDocuments(response.data); // já popula os filtrados
    });
  }, []);

  // Sempre que searchDocument, selectedType ou documents mudarem, refiltra
  useEffect(() => {
    const filtered = documents.filter((document) => {
      const title = document.formData?.title || "";
      const keywords = document.palavrasChave?.join(" ") || "";
      const content = `${title} ${keywords}`.toLowerCase();

      const matchesText = content.includes(searchDocument.toLowerCase());
      const matchesType = !selectedType || document.type === selectedType;

      return matchesText && matchesType;
    });

    setFilteredDocuments(filtered);
  }, [searchDocument, selectedType, documents]);

  const selectDocument = (index: number) => {
    const selected = documents?.[index];

    if (!selected) {
      console.warn("Documento não encontrado no índice:", index);
      return;
    }

    const typeDocument = selected.type;

    setTypeDocument(typeDocument);
    setShowCreateForm(false);
    setShowInterface(true);
    setIndexDocument(index);
  };

  const handleTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // setSelectedType(event.target.value);
    setSelectedCreateType(event.target.value);

    setShowCreateForm(true);
    setShowInterface(false);
    // setSelectedDocument(null);
  };

  // RENDERIZAÇÃO
  return (
    <div className="flex">
      <div className="w-[300px] p-5 h-screen border-r-[0.01px] border-custom-gray flex flex-col justify-between gap-2 bg-zinc-50 fixed">
        <div className="flex flex-col gap-4 items-center">
          <input
            type="search"
            placeholder="Buscar"
            className="p-3 border-1 rounded-2xl outline-none"
            value={searchDocument}
            onChange={(e) => setSearchDocument(e.target.value)}
          />

          <select
            className="p-1 border-1 rounded-2xl outline-none w-full"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="livro">Livro</option>
            <option value="legislação">Legislação</option>
            <option value="curso">Curso</option>
            <option value="document">TCC / Monografia / Dissertação / Tese</option>
            <option value="palestra">Palestra</option>
            <option value="artigo">Artigo</option>
          </select>
        </div>

        <span className="text-custom-gray text-[14px]">Livros guardados</span>
        <div className="h-full flex flex-col gap-3 overflow-scroll">
          <div className="overflow-scroll flex flex-col gap-2 p-1">
            {filteredDocuments.map((document) => {
              // Pega o índice real no array original documents
              const originalIndex = documents.findIndex(
                (doc) => doc.id === document.id
              );

              return (
                <button
                  key={document.id}
                  className="bg-zinc-100 text-left rounded p-2"
                  onClick={() => selectDocument(originalIndex)}
                >
                  {document.formData.title || "Título indisponível"}
                </button>
              );
            })}
          </div>
        </div>

        <select
          onChange={handleTypeSelect}
          value={selectedCreateType}
          className="p-3 rounded-[5px] h-[50px] bg-custom-purple text-white text-center font-bold text-[14px]"
        >
          <option value="" disabled>
            Selecione o tipo de documento
          </option>
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>


      <main className="w-full h-screen bg-custom-dark flex ml-[300px]">
      {showCreateForm && selectedCreateType === "livro" && <CreateBookForm />}
{showCreateForm && selectedCreateType === "artigo" && <CreateArticle />}
{showCreateForm && selectedCreateType === "document" && <CreateDocuments />}
{showCreateForm && selectedCreateType === "palestra" && <CreateLecture />}
{showCreateForm && selectedCreateType === "curso" && <CreateCourse />}
{showCreateForm && selectedCreateType === "legislação" && <CreateLegislation />}


        {showInterface && typeDocument === "palestra" && (
          <InterfaceLecture
            formData={{
              ...documents[indexDocument].formData,
              date:
                (documents[indexDocument] as LectureDocument).formData.date ||
                "",
              event:
                (documents[indexDocument] as LectureDocument).formData.event ||
                "",
              institution:
                (documents[indexDocument] as LectureDocument).formData
                  .institution || "",
              linkAccess:
                (documents[indexDocument] as LectureDocument).formData
                  .linkAccess || "",
              speaker:
                (documents[indexDocument] as LectureDocument).formData
                  .speaker || "",
              workload:
                (documents[indexDocument] as LectureDocument).formData
                  .workload || "",
            }}
            palavrasChave={documents[indexDocument].palavrasChave || []}
            referencias={documents[indexDocument].referencias || []}
            resumo={documents[indexDocument].resumo || ""}
            type={documents[indexDocument].type || ""}
          />
        )}
        {showInterface && typeDocument === "livro" && (
          <InterfaceBook
            formData={{
              title:
                (documents[indexDocument] as BookDocument).formData.title || "",
              author:
                (documents[indexDocument] as BookDocument).formData.author ||
                "",
              publisher:
                (documents[indexDocument] as BookDocument).formData.publisher ||
                "",
              year:
                (documents[indexDocument] as BookDocument).formData.year || "",
              linkBook:
                (documents[indexDocument] as BookDocument).formData.linkBook ||
                "",
            }}
            palavrasChave={
              (documents[indexDocument] as BookDocument).palavrasChave || []
            }
            referencias={
              (documents[indexDocument] as BookDocument).referencias || []
            }
            resumo={(documents[indexDocument] as BookDocument).resumo || ""}
            capitulos={
              (documents[indexDocument] as BookDocument).capitulos || []
            }
            type={(documents[indexDocument] as BookDocument).type || ""}
          />
        )}
        {showInterface && typeDocument === "artigo" && (
          <InterfaceArticle
            formData={{
              title:
                (documents[indexDocument] as ArticleDocument).formData.title ||
                "",
              ISSN:
                (documents[indexDocument] as ArticleDocument).formData.ISSN ||
                "",
              author:
                (documents[indexDocument] as ArticleDocument).formData.author ||
                [],
              year:
                (documents[indexDocument] as ArticleDocument).formData.year ||
                "",
              linkAccess:
                (documents[indexDocument] as ArticleDocument).formData
                  .linkAccess || "",
            }}
            palavrasChave={
              (documents[indexDocument] as ArticleDocument).palavrasChave || []
            }
            referencias={
              (documents[indexDocument] as ArticleDocument).referencias || []
            }
            resumo={(documents[indexDocument] as ArticleDocument).resumo || ""}
            type={(documents[indexDocument] as ArticleDocument).type || ""}
          />
        )}

        {showInterface &&
          typeDocument === "document" && (
            <InterfaceDocument
              formData={{
                title:
                  (documents[indexDocument] as DocumentDocument).formData
                    .title || "",
                author:
                  (documents[indexDocument] as DocumentDocument).formData
                    .author || "",
                category:
                  (documents[indexDocument] as DocumentDocument).formData
                    .category || "",
                documentSummary:
                  (documents[indexDocument] as DocumentDocument).formData
                    .documentSummary || "",
                linkAccess:
                  (documents[indexDocument] as DocumentDocument).formData
                    .linkAccess || "",
                pageCount:
                  (documents[indexDocument] as DocumentDocument).formData
                    .pageCount || "",
                placePublication:
                  (documents[indexDocument] as DocumentDocument).formData
                    .placePublication || "",
                year:
                  (documents[indexDocument] as DocumentDocument).formData
                    .year || "",
              }}
              palavrasChave={
                (documents[indexDocument] as DocumentDocument).palavrasChave ||
                []
              }
              referencias={
                (documents[indexDocument] as DocumentDocument).referencias || []
              }
              resumo={
                (documents[indexDocument] as DocumentDocument).resumo || ""
              }
              type={(documents[indexDocument] as DocumentDocument).type || ""}
            />
          )}
        {showInterface && typeDocument === "curso" && (
          <InterfaceCourse
            formData={{
              title:
                (documents[indexDocument] as CourseDocument).formData.title ||
                "",
              institution:
                (documents[indexDocument] as CourseDocument).formData
                  .institution || "",
              workload:
                (documents[indexDocument] as CourseDocument).formData
                  .workload || "",
              year:
                (documents[indexDocument] as CourseDocument).formData.year ||
                "",
              linkAccess:
                (documents[indexDocument] as CourseDocument).formData
                  .linkAccess || "",
            }}
            palavrasChave={
              (documents[indexDocument] as CourseDocument).palavrasChave || []
            }
            referencias={
              (documents[indexDocument] as CourseDocument).referencias || []
            }
            resumo={(documents[indexDocument] as CourseDocument).resumo || ""}
            type={(documents[indexDocument] as CourseDocument).type || ""}
          />
        )}

        {showInterface && typeDocument === "legislação" && (
          <InterfaceLegislation
            formData={{
              title:
                (documents[indexDocument] as LegislationDocument).formData
                  .title || "",
              classification:
                (documents[indexDocument] as LegislationDocument).formData
                  .classification || "",
              linkAccess:
                (documents[indexDocument] as LegislationDocument).formData
                  .linkAccess || "",
              organ:
                (documents[indexDocument] as LegislationDocument).formData
                  .organ || "",
              purpose:
                (documents[indexDocument] as LegislationDocument).formData
                  .purpose || "",
              specification:
                (documents[indexDocument] as LegislationDocument).formData
                  .specification || "",
              year:
                (documents[indexDocument] as LegislationDocument).formData
                  .year || "",
            }}
            palavrasChave={
              (documents[indexDocument] as LegislationDocument).palavrasChave ||
              []
            }
            referencias={
              (documents[indexDocument] as LegislationDocument).referencias ||
              []
            }
            resumo={
              (documents[indexDocument] as LegislationDocument).resumo || ""
            }
            type={(documents[indexDocument] as LegislationDocument).type || ""}
          />
        )}
      </main>
    </div>
  );
};
