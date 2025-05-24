import { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
// import jsPDF from "jspdf";
// import InputField from "./InputField";

// Função para gerar o PDF com as informações do formulário

export const CreateArticle = () => {
  const [documentCreated, setDocumentCreated] = useState(false);
  const [resumo, setResumo] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [newPalavraChave, setNewPalavraChave] = useState("");
  const [newReferencia, setNewReferencia] = useState("");

  const addPalavraChave = () => {
    if (newPalavraChave.trim() && palavrasChave.length < 5) {
      setPalavrasChave([...palavrasChave, newPalavraChave.trim()]);
      setNewPalavraChave(""); // Limpa o campo de entrada após adicionar
    }
  };

  const addReferencia = () => {
    if (newReferencia.trim()) {
      setReferencias([...referencias, newReferencia.trim()]);
      setNewReferencia(""); // Limpa o campo de entrada após adicionar
    }
  };

  const createDocument = async (values: any) => {
    // Converte o ano para uma data válida (ex: "2022" -> "2022-01-01")
    const formattedYear = values.year ? `${values.year}-01-01` : null;
  
    const payload = {
      type: "artigo",
      formData: {
        ...values,
        year: formattedYear, // substitui o valor original por uma data
      },
      resumo,
      palavrasChave,
      referencias,
    };
  
    console.log(payload);
  
    const response = await axios.post(
      "https://mentedeanne-production.up.railway.app/create-book",
      payload
    );
  
    if (response.status === 201) {
      setDocumentCreated(true);
      setTimeout(() => {
        setDocumentCreated(false);
      }, 3000);
    }
  };
  

  return (
    <div className="bg-custom-black p-5 rounded-lg w-full">
      <h1 className="text-text-dark text-4xl font-bold mb-4">
        Adicionar Artigo
      </h1>

      <Formik
        initialValues={{
          title: "",
          author: [""], // Inicializa 'author' como um array de strings
          placePublication: "",
          year: "",
          ISSN: "",
          linkAccess: "",
          pageCount: "",
          
        }}
        onSubmit={createDocument}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="flex-col gap-4 flex text-text-dark">
            <h2 className="text-text-dark text-xl font-bold mb-4">
              Informações do Artigo
            </h2>
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <Field
                name="title"
                placeholder="Título"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
                required
              />
              <Field
                name="author"
                placeholder="Autor (separe por vírgula)"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
                value={values.author.join(",")} // Garante que é uma string separada por vírgulas
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  const authors = e.target.value
                    .split(",")
                    .map((author) => author.trim());
                  setFieldValue("author", authors); // Atualiza o estado de 'author' como um array
                }}
                required
              />
              <Field
                name="placePublication"
                placeholder="Local de Publicação"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              
              <Field
                name="year"
                placeholder="Ano de Publicação"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="ISSN"
                placeholder="ISSN"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
                required
              />
              <Field
                name="linkAccess"
                placeholder="Link de Acesso"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
         
            </div>


            {/* Seção Resumo */}
            <section className="mt-4">
              <h2 className="text-xl font-bold">Resumo</h2>
          
         
              <textarea
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                placeholder={`Digite o resumo aqui...`}
                rows={10}
                className="w-full mt-2 p-2 border border-custom-gray rounded"
                required
              ></textarea>
            </section>

            {/* Seção Palavras-Chave */}
            <section className="mt-4">
              <h2 className="text-xl font-bold">Palavras-Chave (até 5)</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPalavraChave}
                  onChange={(e) => setNewPalavraChave(e.target.value)}
                  placeholder="Digite uma palavra-chave"
                  className="p-2 border border-custom-gray rounded"
                />
                <button
                  type="button"
                  onClick={addPalavraChave}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {palavrasChave.map((palavra, index) => (
                  <li key={index}>{palavra}</li>
                ))}
              </ul>
            </section>

            {/* Seção Referências */}
            <section className="mt-4">
              <h2 className="text-xl font-bold">
                Referências Bibliográficas e/ou de vídeos
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReferencia}
                  onChange={(e) => setNewReferencia(e.target.value)}
                  placeholder="Digite uma referência"
                  className="p-2 border border-custom-gray rounded"
                />
                <button
                  type="button"
                  onClick={addReferencia}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {referencias.map((ref, index) => (
                  <li key={index}>{ref}</li>
                ))}
              </ul>
            </section>

            {/* Botões de Ação */}
            <div className="mt-4 flex gap-4 p-2">
              <button
                type="submit"
                className="p-3 rounded w-[200px] h-[50px] bg-custom-purple text-white"
              >
                Criar Documento
              </button>
            </div>

            {documentCreated && (
              <div className="mt-4 p-3 bg-green-500 text-white rounded">
                Documento criado com sucesso!
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
