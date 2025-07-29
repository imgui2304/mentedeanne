import { documentDelete } from "../../../functions/documentDelete";
import { generateBookPDF } from "../../../functions/generatePDF";

interface DataLegislationProps {
    type: string;
    id: string;
    formData: {
      title: string;
      classification: string;
      linkAccess: string;
      organ: string;
      purpose: string;
      specification: string;
      year: string;
    };
    palavrasChave?: string[];
    referencias?: string[];
    resumo?: string;
  }
  
  export const InterfaceLegislation = ({
    formData,
    palavrasChave,
    referencias,
    resumo,
    type,
    id
  }: DataLegislationProps) => {
      const handleDownloadPDF = async () => {
        const bookData = {
          formData,
          palavrasChave,
          referencias,
          resumo,
        //   capitulos,
          type,
        };
    
        const pdfBytes = await generateBookPDF(bookData);
    
        // Criar um link para download do PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${formData.title}.pdf`;
        link.click();
      };
    return (
      <main className="flex flex-col items-center justify-center w-full min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="font-semibold">Classificação</h2>
            <p>{formData.classification.length === 0 ? "Sem classificação" : formData.classification}</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="font-semibold">Órgão</h2>
            <p>{formData.organ}</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="font-semibold">Ano de Publicação</h2>
            <p>{formData.year}</p>
          </div>
  
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="font-semibold">Acesso</h2>
            <a href={formData.linkAccess} className="text-blue-600 underline break-all">
              {formData.linkAccess}
            </a>
          </div>
        </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="mt-6 px-6 py-3 border-[1px] border-black text-black rounded-lg hover:text-white hover:bg-black hover:cursor-pointer transition-colors"
              >
                Baixar PDF
              </button>
              <button
                onClick={() => documentDelete(id)}
                className="mt-6 px-6 text-white bg-red-500 rounded-lg shadow-mg py-3 hover:cursor-pointer hover:border-[1px] hover:border-black hover:bg-transparent border transition-colors hover:text-black"
              >
                Apagar Documento{" "}
              </button>
            </div>
        <div className="w-full max-w-6xl mt-8">
          <h2 className="font-semibold text-xl mb-2">Resumo</h2>
          <p className="bg-gray-100 p-4 rounded-lg">{resumo}</p>
  
          <div className="mt-6">
            <h2 className="font-semibold text-xl mb-2">Palavras-chave</h2>
            <ul className="list-disc list-inside pl-4">
              {palavrasChave!.map((palavra, idx) => (
                <li key={idx}>{palavra}</li>
              ))}
            </ul>
          </div>
  
          <div className="mt-6">
            <h2 className="font-semibold text-xl mb-2">Referências</h2>
            <ul className="list-disc list-inside pl-4">
              {referencias!.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    );
  };
  