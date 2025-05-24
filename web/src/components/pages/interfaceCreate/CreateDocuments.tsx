import { useState } from "react";
import { Formik, Field, Form } from "formik";
// import axios from "axios";
import axios from "axios";

export const CreateDocuments = () => {
  const [documentCreated, setDocumentCreated] = useState(false);
  const [resumo, setResumo] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [newPalavraChave, setNewPalavraChave] = useState("");
  const [newReferencia, setNewReferencia] = useState("");
  
  const addPalavraChave = () => {
    if (newPalavraChave.trim() && palavrasChave.length < 5) {
      setPalavrasChave([...palavrasChave, newPalavraChave.trim()]);
      setNewPalavraChave("");
    }
  };

  const addReferencia = () => {
    if (newReferencia.trim()) {
      setReferencias([...referencias, newReferencia.trim()]);
      setNewReferencia("");
    }
  };



const createDocument = async (values: any) => {
  const payload = {
    type: "document",
    formData: values,
    resumo,
    palavrasChave,
    referencias,
  };
  
  try {
    const response = await axios.post("https://mentedeanne-production.up.railway.app/create-book", payload);
    if (response.status === 201) {
      setDocumentCreated(true);
      setTimeout(() => {
        setDocumentCreated(false);
      }, 3000);
    }
  } catch (error) {
    console.error("Erro ao criar o documento:", error);
  }
};


  return (
    <div className="bg-custom-black p-5 rounded-lg w-full">
      <h1 className="text-text-dark text-4xl font-bold mb-4">Adicionar Artigo</h1>

      <Formik
        initialValues={{
          category: "",
          title: "",
          author: [""],
          placePublication: "",
          year: "",
          linkAccess: "",
          pageCount: "",
          documentSummary: "",
        }}
        onSubmit={createDocument}
      >
        {() => (
          <Form className="flex-col gap-4 flex text-text-dark">
            <h2 className="text-text-dark text-xl font-bold mb-4">Informações do Artigo</h2>
            <div className="grid grid-cols-2 gap-4 w-full h-full">
              <Field as="select" name="category" className="p-3 rounded bg-custom-black text-text-dark" required>
                <option value="">Selecione a Categoria</option>
                <option value="TCC">TCC</option>
                <option value="Monografia">Monografia</option>
                <option value="Dissertacao">Dissertação</option>

                <option value="Tese">Tese</option>
              </Field>
              <Field name="title" placeholder="Título" className="p-3 rounded bg-custom-black text-text-dark" required  />
              <Field name="author" placeholder="Autor(a)" className="p-3 rounded bg-custom-black text-text-dark" required />
              <Field name="placePublication" placeholder="Local de Publicação" className="p-3 rounded bg-custom-black text-text-dark" required />
              <Field name="year" placeholder="Ano" className="p-3 rounded bg-custom-black text-text-dark" />
              <Field name="linkAccess" placeholder="ORCID" className="p-3 rounded bg-custom-black text-text-dark" />
              <Field name="pageCount" placeholder="Quantidade de Páginas" className="p-3 rounded bg-custom-black text-text-dark" />
            </div>
            <h2 className="text-text-dark text-xl font-bold mt-4">Resumo</h2>
     
            <textarea
              name="documentSummary"
              placeholder="Digite o resumo aqui..."
              value={resumo}
              className="p-3 rounded bg-custom-black text-text-dark w-full h-40 border-1 "
              onChange={(e) => setResumo(e.target.value)}
            />
            <section className="mt-4">
              <h2 className="text-xl font-bold">Palavras-Chave (até 5)</h2>
              <div className="flex gap-2">
                <input type="text" value={newPalavraChave} onChange={(e) => setNewPalavraChave(e.target.value)} className="p-2 border border-custom-gray rounded" />
                <button type="button" onClick={addPalavraChave} className="p-2 bg-blue-500 text-white rounded">Adicionar</button>
              </div>
              <ul className="mt-2">{palavrasChave.map((palavra, index) => <li key={index}>{palavra}</li>)}</ul>
            </section>
            <section className="mt-4">
              <h2 className="text-xl font-bold">Referências Bibliográficas</h2>
              <div className="flex gap-2">
                <input type="text" value={newReferencia} onChange={(e) => setNewReferencia(e.target.value)} className="p-2 border border-custom-gray rounded" />
                <button type="button" onClick={addReferencia} className="p-2 bg-blue-500 text-white rounded">Adicionar</button>
              </div>
              <ul className="mt-2">{referencias.map((ref, index) => <li key={index}>{ref}</li>)}</ul>
            </section>
            <div className="mt-4 flex gap-4 p-2">
              <button type="submit" className="p-3 rounded w-[200px] h-[50px] bg-custom-purple text-white">Criar Documento</button>
            </div>
            {documentCreated && <div className="mt-4 p-3 bg-green-500 text-white rounded">Documento criado com sucesso!</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};