import { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";

export const CreateCourse = () => {
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
    const payload = {
      type: "curso",
      formData: {...values},
      resumo,
      palavrasChave,
      referencias,
    };
    console.log(payload)
    const response = await axios.post(
      "http://localhost:3000/create-book",
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
      <h1 className="text-text-dark text-4xl font-bold mb-4">Cadastrar Curso</h1>

      <Formik
        initialValues={{
          title: "",
          institution: "",
          year: "",
          workload: "",
          linkAccess: "",
          resumo: "",
        }}
        onSubmit={createDocument}
      >
        {() => (
          <Form className="flex-col gap-4 flex text-text-dark">
            <h2 className="text-text-dark text-xl font-bold mb-4">Informações do Curso</h2>
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <Field
                name="title"
                placeholder="Título"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="institution"
                placeholder="Instituição"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="year"
                placeholder="Ano"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="workload"
                placeholder="Carga Horária"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              <Field
                name="linkAccess"
                placeholder="Link de Acesso (ex: Plataforma)"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
            </div>

            <textarea
              name="documentSummary"
              placeholder="Resumo do Curso (máximo de 4 páginas)"
              onChange={(e) => setResumo(e.target.value)}
            //   value={values.resumo}
              className="p-3 rounded-[5px] bg-custom-black text-text-dark"
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
