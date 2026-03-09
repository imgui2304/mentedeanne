import { useState, useRef } from "react";
import axios from "axios";
import type { DocumentType } from "../../../types/types";
import { documentFieldMap } from "../../../types/documentFieldMap";
import { useNavigate } from "react-router-dom";
import { AutoResizeTextarea } from "../Interface/functions/AutoResizeTextarea";

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

  const [savingStatus, setSavingStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

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
      const newForm = {
        ...prev,
        formData: { ...prev.formData, [name]: value },
      };
      triggerDebounce(newForm);
      return newForm;
    });
  };

  // Função para atualizar arrays (palavrasChave e referencias)
  const updateArrayField = (
    fieldName: "palavrasChave" | "referencias",
    index: number,
    value: string,
  ) => {
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

  const removeArrayField = (
    fieldName: "palavrasChave" | "referencias",
    index: number,
  ) => {
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
        {
          id: prev.capitulos.length
            ? prev.capitulos[prev.capitulos.length - 1].id + 1
            : 1,
          resumo: "",
        },
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
    <div className="min-h-screen bg-white max-w-4xl mx-auto p-8 font-sans">
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="flex items-start mb-6 gap-4">
          <h1 className="text-3xl font-semibold flex-1">Novo {type}</h1>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-black px-4 py-2 rounded bg-gray-100 transition hover:cursor-pointer hover:bg-gray-200"
          >
            X
          </button>
        </div>

        {/* Campos principais */}
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-gray-500 text-sm mb-1 select-none">
              {field.label}
              {field.required && " *"}
            </label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                className="resize-none border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                className="border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
            )}
          </div>
        ))}

        {/* Palavras-chave */}
        <div>
          <label className="text-gray-500 text-sm mb-1 select-none block">
            Palavras-chave
          </label>

          {form.palavrasChave.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayField("palavrasChave", index, e.target.value)
                }
                placeholder="Palavra-chave"
                className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
              <button
                type="button"
                onClick={() => removeArrayField("palavrasChave", index)}
                className="text-red-500 font-bold px-2 hover:text-red-700 select-none"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayField("palavrasChave")}
            className="text-blue-600 hover:underline select-none mt-1"
          >
            + Adicionar palavra-chave
          </button>
        </div>

        {/* Referências */}
        <div>
          <label className="text-gray-500 text-sm mb-1 select-none block">
            Referências
          </label>

          {form.referencias.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateArrayField("referencias", index, e.target.value)
                }
                placeholder="Referência"
                className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
              <button
                type="button"
                onClick={() => removeArrayField("referencias", index)}
                className="text-red-500 font-bold px-2 hover:text-red-700 select-none"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayField("referencias")}
            className="text-blue-600 hover:underline select-none mt-1"
          >
            + Adicionar referência
          </button>
        </div>

      
        {/* Resumo */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-sm mb-1 select-none block">Resumo</label>
          <AutoResizeTextarea
            value={form.resumo}
            onChange={(e) => {
              const newForm = { ...form, resumo: e.target.value };
              setForm(newForm);
              triggerDebounce(newForm);
            }}
            className="resize-none border-b border-gray-300 focus:ring-0 bg-transparent text-lg leading-relaxed"
          />
        </div>
        {/* Capítulos */}
        {type === "livro" && (
          <div>
            <label className="text-gray-500 text-sm mb-1 select-none block">
              Capítulos
            </label>

            {form.capitulos.map((capitulo) => (
              <div
                key={capitulo.id}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="text"
                  value={capitulo.resumo}
                  onChange={(e) =>
                    updateCapitulo(
                      form.capitulos.findIndex((c) => c.id === capitulo.id),
                      e.target.value,
                    )
                  }
                  placeholder="Resumo do capítulo"
                  className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
                />
                <button
                  type="button"
                  onClick={() => removeCapitulo(capitulo.id)}
                  className="text-red-500 font-bold px-2 hover:text-red-700 select-none"
                >
                  &times;
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCapitulo}
              className="text-blue-600 hover:underline select-none mt-1"
            >
              + Adicionar capítulo
            </button>
          </div>
        )}

        {/* Status autosave */}
        <div className="mt-6 text-sm text-gray-400">
          {savingStatus === "saving" && "Salvando..."}
          {savingStatus === "saved" && "Salvo com sucesso!"}
          {savingStatus === "error" && "Erro ao salvar."}
        </div>
      </form>
    </div>
  );
}
