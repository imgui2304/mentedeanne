import { useState, useRef } from "react";
import axios from "axios";
import type { DocumentType } from "../../../types/types";
import { documentFieldMap } from "../../../types/documentFieldMap";
import { useNavigate } from "react-router-dom";

interface Props {
  type: DocumentType;
}

export function BookCreateForm({ type }: Props) {
  const fields = documentFieldMap[type];
  const apiUrl = import.meta.env.VITE_API_URL;

  // Formulário unificado
  const [form, setForm] = useState({
    formData: {} as Record<string, string>,
    resumo: "",
    palavrasChave: [] as string[],
    referencias: [] as string[],
    capitulos: [] as { id: number; resumo: string }[],
  });

  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // ID do documento criado
  const [documentId, setDocumentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Função de autosave
  const saveDocument = async (data: typeof form) => {
    setSavingStatus("saving");
    try {
      const authorsArray = data.formData.author
        ? data.formData.author.split(",").map((a) => a.trim())
        : [];

      let response;

      if (!documentId) {
        // Criar documento
        response = await axios.post(`${apiUrl}/documents`, {
          type,
          ...data,
          author: authorsArray,
        });
        setDocumentId(response.data.id);
      } else {
        // Atualizar documento existente
        await axios.put(`${apiUrl}/document-change/${documentId}`, {
          ...data,
          author: authorsArray,
        });
      }

      setSavingStatus("saved");
      setTimeout(() => setSavingStatus("idle"), 2000);
    } catch (err) {
      console.error("Erro ao salvar documento:", err);
      setSavingStatus("error");
    }
  };

  // Função genérica para atualizar campo simples
  const handleChange = (name: string, value: string) => {
    setForm((prev) => {
      const newForm = { ...prev, formData: { ...prev.formData, [name]: value } };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  // Função para atualizar arrays (palavrasChave e referencias)
  const updateArrayField = (fieldName: "palavrasChave" | "referencias", index: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev[fieldName]];
      arr[index] = value;
      const newForm = { ...prev, [fieldName]: arr };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  const addArrayField = (fieldName: "palavrasChave" | "referencias") => {
    setForm((prev) => {
      const newForm = { ...prev, [fieldName]: [...prev[fieldName], ""] };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  const removeArrayField = (fieldName: "palavrasChave" | "referencias", index: number) => {
    setForm((prev) => {
      const arr = prev[fieldName].filter((_, i) => i !== index);
      const newForm = { ...prev, [fieldName]: arr };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  // Funções para capítulos
  const updateCapitulo = (index: number, value: string) => {
    setForm((prev) => {
      const newCapitulos = [...prev.capitulos];
      newCapitulos[index].resumo = value;
      const newForm = { ...prev, capitulos: newCapitulos };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  const addCapitulo = () => {
    setForm((prev) => {
      const newCapitulos = [
        ...prev.capitulos,
        { id: prev.capitulos.length ? prev.capitulos[prev.capitulos.length - 1].id + 1 : 1, resumo: "" },
      ];
      const newForm = { ...prev, capitulos: newCapitulos };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  const removeCapitulo = (id: number) => {
    setForm((prev) => {
      const newCapitulos = prev.capitulos.filter((c) => c.id !== id);
      const newForm = { ...prev, capitulos: newCapitulos };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  // Função de debounce
  const triggerDebounce = (newForm: typeof form) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => saveDocument(newForm), 1000);
  };

  return (
    <form className="space-y-4 p-4" onSubmit={(e) => e.preventDefault()}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Novo {type}</h1>
      <h1 className="text-2xl font-semibold hover:cursor-pointer" onClick={() => navigate("/dashboard")}>X</h1>
      </div>
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
        {form.palavrasChave.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayField("palavrasChave", index, e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <button type="button" onClick={() => removeArrayField("palavrasChave", index)} className="text-red-500 font-bold">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("palavrasChave")} className="mt-1 text-blue-600">
          + Adicionar palavra-chave
        </button>
      </div>

      {/* Referências */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Referências</label>
        {form.referencias.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayField("referencias", index, e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <button type="button" onClick={() => removeArrayField("referencias", index)} className="text-red-500 font-bold">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("referencias")} className="mt-1 text-blue-600">
          + Adicionar referência
        </button>
      </div>

      {/* Resumo */}
      <div className="flex flex-col gap-1">
        <label className="font-medium">Resumo</label>
        <textarea
          value={form.resumo}
          onChange={(e) => {
            const newForm = { ...form, resumo: e.target.value };
            setForm(newForm);
            triggerDebounce(newForm);
          }}
          className="p-2 border rounded"
        />
      </div>

      {/* Capítulos */}
      {type === "livro" && (
        <div className="flex flex-col gap-1">
          <label className="font-medium">Capítulos</label>
          {form.capitulos.map((capitulo) => (
            <div key={capitulo.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={capitulo.resumo}
                onChange={(e) => updateCapitulo(form.capitulos.findIndex(c => c.id === capitulo.id), e.target.value)}
                placeholder="Resumo do capítulo"
                className="p-2 border rounded flex-grow"
              />
              <button type="button" onClick={() => removeCapitulo(capitulo.id)} className="text-red-500 font-bold">
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addCapitulo} className="mt-1 text-blue-600">
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
    </form>
  );
}
