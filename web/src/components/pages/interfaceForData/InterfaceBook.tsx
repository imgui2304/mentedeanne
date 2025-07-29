import { documentDelete } from "../../../functions/documentDelete";
import { generateBookPDF } from "../../../functions/generatePDF"; // Importe a função de geração de PDF

interface Chapter {
  id: number;
  resumo: string;
}

interface BookProps {
  formData: {
    title: string;
    author: string;
    publisher: string;
    year: string;
    linkBook: string;
  };
  palavrasChave: string[];
  referencias: string[];
  resumo: string;
  id:string;
  capitulos: Chapter[];
  type: string;
}

export const InterfaceBook = ({
  formData,
  palavrasChave,
  referencias,
  resumo,
  id,
  capitulos,
  type,
}: BookProps) => {
  // Função para baixar o PDF
  const handleDownloadPDF = async () => {
    const bookData = {
      formData,
      palavrasChave,
      referencias,
      resumo,
      capitulos,
      type,
    };

    const pdfBytes = await generateBookPDF(bookData);

    // Criar um link para download do PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.title}.pdf`;
    link.click();
  };

  return (
    <main className="flex flex-col items-center justify-start w-full min-h-screen p-6 pt-16 overflow-y-auto">
      <h1 className="text-3xl font-bold">{formData.title}</h1>

      {/* Exibição das informações do livro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-6 w-full max-w-6xl">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Autor</h2>
          <p>{formData.author}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Tipo de Documento</h2>
          <p>{type}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Editora</h2>
          <p>{formData.publisher}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Ano</h2>
          <p>{formData.year}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="font-semibold">Link do Livro</h2>
          <a
            href={formData.linkBook}
            className="text-blue-600 underline break-all"
          >
            {formData.linkBook}
          </a>
        </div>
      </div>

      {/* Botão para gerar o PDF */}
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
            {palavrasChave.map((palavra, idx) => (
              <li key={idx}>{palavra}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-xl mb-2">Referências</h2>
          <ul className="list-disc list-inside pl-4">
            {referencias.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-xl mb-2">Capítulos</h2>
          <ul className="space-y-2">
            {capitulos.map((cap, idx) => (
              <li key={cap.id} className="bg-gray-50 p-3 rounded-md shadow">
                <strong>Capítulo {idx + 1}:</strong> {cap.resumo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};
