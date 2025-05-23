import { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";

export const CreateLegislation = () => {
  const [documentCreated, setDocumentCreated] = useState(false);
  const [resumo, setResumo] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [newPalavraChave, setNewPalavraChave] = useState("");

  const addPalavraChave = () => {
    if (newPalavraChave.trim() && palavrasChave.length < 5) {
      setPalavrasChave([...palavrasChave, newPalavraChave.trim()]);
      setNewPalavraChave(""); // Limpa o campo de entrada após adicionar
    }
  };

  const createDocument = async (values: any) => {
    const payload = {
      type: "legislação",
      formData: values,
      resumo,
      palavrasChave,
    };
    console.log(payload);
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
      <h1 className="text-text-dark text-4xl font-bold mb-4">
        Cadastrar Legislação
      </h1>

      <Formik
        initialValues={{
          title: "",
          classification: "",
          specification: "",
          purpose: "",
          organ: "",
          year: "",
          linkAccess: "",
        }}
        onSubmit={createDocument}
      >
        {() => (
          <Form className="flex-col gap-4 flex text-text-dark">
            <h2 className="text-text-dark text-xl font-bold mb-4">
              Informações da Legislação
            </h2>
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              {/* Classificação */}
              <div>
                <label className="text-text-dark font-bold">
                  Classificação
                </label>
                <Field
                  as="select"
                  name="classification"
                  className="p-3 rounded-[5px] bg-custom-black text-text-dark w-full"
                >
                  <option value="">Selecione a categoria</option>
                  <option value="Decreto">Decreto</option>
                  <option value="Lei">Lei</option>
                  <option value="Instrução Normativa">
                    Instrução Normativa
                  </option>
                  <option value="Resolução">Resolução</option>
                  <option value="Portaria">Portaria</option>
                </Field>
              </div>
              <Field
                name="title"
                placeholder="Digite o Título"
                className="p-2 rounded-[5px] bg-custom-black text-text-dark"
              />
              {/* Especificação */}

              <Field
                name="specification"
                placeholder="Especificação da Numeração e Data da Aprovação"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              {/* Finalidade */}
              <Field
                name="purpose"
                placeholder="Finalidade"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              {/* Orgão */}
              <Field
                name="organ"
                placeholder="Órgão"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              {/* Ano */}
              <Field
                name="year"
                placeholder="Ano"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
              {/* Link de Acesso */}
              <Field
                name="linkAccess"
                placeholder="Link de Acesso"
                className="p-3 rounded-[5px] bg-custom-black text-text-dark"
              />
            </div>

            {/* Resumo */}
            <textarea
              name="resumo"
              placeholder="Resumo (máximo de 1 página)"
              value={resumo}
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
