import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import InputField from "../../InputField";
import Sucess from "../../SucessMsg";

export const CreateBookForm = () => {
  const [documentCreated, setDocumentCreated] = useState<number>(0);
  const [resume, setResume] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [novaPalavraChave, setNovaPalavraChave] = useState("");
  const [novaReferencia, setNovaReferencia] = useState("");

  const [capitulos, setCapitulos] = useState<{ id: number; resumo: string }[]>([{ id: 1, resumo: "" }]);

  const formik = useFormik({
    initialValues: {
      title: "",
      DocumentDescription: "",
      DocumentInsight: "",
      author: "",
      placePublication: "",
      publisher: "",
      year: "",
      editionNumber: "",
      linkBook: "",

    },
    onSubmit: async (values) => {
      const payload = {
        type: "livro",
        formData: {...values},
        author: values.author.split(","),
        resumo: resume,
        palavrasChave,
        referencias,
        capitulos,
      };
        console.log(payload)    
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
    },
  });

  const addPalavraChave = () => {

    if (novaPalavraChave && !palavrasChave.includes(novaPalavraChave) && palavrasChave.length < 5) {
      setPalavrasChave([...palavrasChave, novaPalavraChave]);
    }
  };

  const addReferencia = () => {

    if (novaReferencia && !referencias.includes(novaReferencia)) {
      setReferencias([...referencias, novaReferencia]);
    }
  };

  const addCapitulo = () => {
    if (capitulos.length < 30) {
      setCapitulos([...capitulos, { id: capitulos.length + 1, resumo: "" }]);
    }
  };

  const handleCapituloChange = (id: number, value: string) => {
    setCapitulos(capitulos.map(capitulo => capitulo.id === id ? { ...capitulo, resumo: value } : capitulo));
  };

  return (
    <div className="bg-custom-black p-5 rounded-lg w-full">
      <h1 className="text-text-dark text-4xl font-bold mb-4">Adicionar Livro</h1>
      <form onSubmit={formik.handleSubmit} className="flex-col gap-4 flex text-text-dark">
        <h2 className="text-text-dark text-xl font-bold mb-4">Informações do Documento</h2>
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          <InputField type="text" placeholder="Título" {...formik.getFieldProps("title")}  />
          <InputField type="text" placeholder="Autor (separe por vírgula)" {...formik.getFieldProps("author")} />
          <InputField type="text" placeholder="Local de Publicação" {...formik.getFieldProps("placePublication")} />
          <InputField type="text" placeholder="Editora" {...formik.getFieldProps("publisher")} />
          <InputField type="text" placeholder="Ano de Publicação" {...formik.getFieldProps("year")} />
          <InputField type="text" placeholder="Número da Edição" {...formik.getFieldProps("editionNumber")} />
          <InputField type="text" placeholder="Link de Acesso" {...formik.getFieldProps("linkBook")} />
        </div>

        <textarea placeholder="Descrição do documento" {...formik.getFieldProps("DocumentDescription")} className="p-3 rounded-[5px] bg-custom-black text-text-dark" />
        <textarea placeholder="O que você entendeu?" {...formik.getFieldProps("DocumentInsight")} className="p-3 rounded-[5px] bg-custom-black text-text-dark" />

        <section className="mt-4">
          <h2 className="text-xl font-bold">Resumo</h2>
      
          <textarea placeholder="Digite o resumo aqui..." onChange={(e: any) => setResume(e.target.value)} rows={10} className="w-full mt-2 p-2 border border-custom-gray rounded"></textarea>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-bold">Palavras-Chave (até 5)</h2>
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setNovaPalavraChave(e.target.value)}
              placeholder="Digite uma palavra-chave"
              className="p-2 border border-custom-gray rounded"
            />
            <button type="button" onClick={addPalavraChave} className="text-white bg-custom-purple p-2 rounded">Adicionar</button>
          </div>
          <ul className="mt-2">{palavrasChave.map((palavra, index) => <li key={index}>{palavra}</li>)}</ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-bold">Referências</h2>
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setNovaReferencia(e.target.value)}
              placeholder="Digite uma referência"
              className="p-2 border border-custom-gray rounded"
            />
            <button type="button" onClick={addReferencia} className="text-white bg-custom-purple p-2 rounded">Adicionar</button>
          </div>
          <ul className="mt-2">{referencias.map((ref, index) => <li key={index}>{ref}</li>)}</ul>
        </section>

        <section className="mt-4">
          <h2 className="text-xl font-bold">Capítulos (máximo 30)</h2>
          <button type="button" onClick={addCapitulo} className="text-white bg-custom-purple p-2 rounded">Adicionar Capítulo</button>
          {capitulos.map((capitulo) => (
            <div key={capitulo.id} className="mt-2 border border-custom-gray p-2 rounded">
              <h3 className="font-bold">Capítulo {capitulo.id}</h3>
              <textarea
                placeholder="Insira o resumo do capítulo"
                rows={5}
                value={capitulo.resumo}
                onChange={(e) => handleCapituloChange(capitulo.id, e.target.value)}
                className="w-full mt-1 p-2 border border-custom-gray rounded"
              />
            </div>
          ))}
        </section>

        <div className="mt-4 flex gap-4 p-2">
          <button type="submit" className="p-3 rounded w-[200px] h-[50px] bg-custom-purple text-white font-bold">Adicionar Documento</button>
        </div>

        <Sucess sucess={documentCreated} />
      </form>
    </div>
  );
};
