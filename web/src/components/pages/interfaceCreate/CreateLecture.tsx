import { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import Sucess from "../../SucessMsg";

export const CreateLecture = () => {
  const [documentCreated, setDocumentCreated] = useState<number>(0);
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
    const payload = {
      type: "palestra",
      formData: values,
      resumo,
      palavrasChave,
      referencias,
    };

    try {
      await axios.post(
        "https://mentedeanne-production.up.railway.app/create-book",
        payload
      );
     
        setDocumentCreated(1);
        setTimeout(() => setDocumentCreated(0), 3000);
      
    } catch (error) {
      setDocumentCreated(2);
      setTimeout(() => setDocumentCreated(0), 3000);
    }
   
  };

  return (
    <div className="bg-custom-black p-5 rounded-lg w-full">
      <h1 className="text-text-dark text-4xl font-bold mb-4">Adicionar Palestra</h1>

      <Formik
        initialValues={{
          title: "",
          speaker: "",
          event: "",
          institution: "",
          date: "",
          workload: "",
          linkAccess: "",
    
        }}
        onSubmit={createDocument}
      >
        {() => (
          <Form className="flex-col gap-4 flex text-text-dark">
            <h2 className="text-text-dark text-xl font-bold mb-4">Informações da Palestra</h2>
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <Field
                name="title"
                placeholder="Título"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              required

              />
              <Field
                name="speaker"
                placeholder="Palestrante"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              required

              />
              <Field
                name="event"
                placeholder="Evento"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              required

              />
              <Field
                name="institution"
                placeholder="Instituição"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              required

              />
              <Field
                name="date"
                placeholder="Data/Mês/Ano"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="workload"
                placeholder="Carga Horária"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="linkAccess"
                placeholder="Link de Acesso (ex: YouTube)"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
            </div>

            <textarea
              
              placeholder="Resumo da Palestra (máximo de 3 páginas)"
            
              className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              onChange={(e) => setResumo(e.target.value)}
            />

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
                Indicações de Referências Bibliográficas e/ou de vídeos
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

            <Sucess sucess={documentCreated} />

          </Form>
        )}
      </Formik>
    </div>
  );
};
