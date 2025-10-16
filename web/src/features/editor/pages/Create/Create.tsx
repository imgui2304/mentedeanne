import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { DocumentType } from "../../../types/types";
import { documentFieldMap } from "../../../types/documentFieldMap";

interface Props {
  type: DocumentType;
}

export function BookCreateForm({ type }: Props) {
  const fields = documentFieldMap[type];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [resumo, setResumo] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [capitulos, setCapitulos] = useState<{ id: number; resumo: string }[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL;

  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Ref para armazenar timeout do debounce
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Função para fazer autosave
  const autosave = async () => {
    setSavingStatus("saving");
    try {
      const authorsArray = formData.author
        ? formData.author.split(",").map((a) => a.trim())
        : [];

      const payload = {
        type,
        formData,
        author: authorsArray,
        resumo,
        palavrasChave,
        referencias,
        capitulos,
      };

      await axios.post(`${apiUrl}/documents`, payload);
      setSavingStatus("saved");

      // Após 2s volta para "idle"
      setTimeout(() => setSavingStatus("idle"), 2000);
    } catch (error) {
      setSavingStatus("error");
      console.error("Erro ao salvar documento:", error);
    }
  };

  // Sempre que algum dado mudar, dispara debounce para autosave
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      autosave();
    }, 1000);

    // Cleanup
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [formData, resumo, palavrasChave, referencias, capitulos]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4 p-4" onSubmit={e => e.preventDefault()}>
      <h1 className="text-2xl font-semibold">Novo {type}</h1>

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="font-medium">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="p-2 border rounded"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="p-2 border rounded"
            />
          )}
        </div>
      ))}

      {/* Palavras-chave */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Palavras-chave</label>
        {palavrasChave.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newArr = [...palavrasChave];
                newArr[index] = e.target.value;
                setPalavrasChave(newArr);
              }}
              className="p-2 border rounded flex-grow"
            />
            <button
              type="button"
              onClick={() => {
                setPalavrasChave((prev) => prev.filter((_, i) => i !== index));
              }}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPalavrasChave((prev) => [...prev, ""])}
          className="mt-1 text-blue-600"
        >
          + Adicionar palavra-chave
        </button>
      </div>

      {/* Referências */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Referências</label>
        {referencias.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newArr = [...referencias];
                newArr[index] = e.target.value;
                setReferencias(newArr);
              }}
              className="p-2 border rounded flex-grow"
            />
            <button
              type="button"
              onClick={() => {
                setReferencias((prev) => prev.filter((_, i) => i !== index));
              }}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setReferencias((prev) => [...prev, ""])}
          className="mt-1 text-blue-600"
        >
          + Adicionar referência
        </button>
      </div>

      {/* Resumo */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Resumo</label>
        <textarea
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Capítulos */}
      {type === "livro" && (
        <div className="flex flex-col gap-1">
          <label className="font-medium">Capítulos</label>
          {capitulos.map((capitulo, index) => (
            <div key={capitulo.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={capitulo.resumo}
                onChange={(e) => {
                  const newCapitulos = [...capitulos];
                  newCapitulos[index].resumo = e.target.value;
                  setCapitulos(newCapitulos);
                }}
                placeholder="Resumo do capítulo"
                className="p-2 border rounded flex-grow"
              />
              <button
                type="button"
                onClick={() => {
                  setCapitulos((prev) => prev.filter((c) => c.id !== capitulo.id));
                }}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setCapitulos((prev) => [
                ...prev,
                {
                  id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
                  resumo: "",
                },
              ])
            }
            className="mt-1 text-blue-600"
          >
            + Adicionar capítulo
          </button>
        </div>
      )}

      {/* Status do autosave */}
      <div className="mt-4 text-sm text-gray-500">
        {savingStatus === "saving" && "Salvando..."}
        {savingStatus === "saved" && "Salvo com sucesso!"}
        {savingStatus === "error" && "Erro ao salvar."}
      </div>

      {/* Removi o botão submit pois o autosave cuida do salvamento */}
    </form>
  );
}
