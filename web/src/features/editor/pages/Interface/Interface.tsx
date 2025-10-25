import React, { useState, useEffect, useRef, useCallback } from "react";
import type { DocumentType } from "../../../types/types";
import { documentFieldMap } from "../../../types/documentFieldMap";
import isEqual from "lodash.isequal";
import jsPDF from "jspdf";
import {
  AutoResizeTextarea,
  ChapterItem,
} from "./functions/AutoResizeTextarea";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface InterfaceProps {
  document: {
    id: string;
    type: DocumentType;
    formData: Record<string, any>;
    resumo?: string;
    palavrasChave?: string[];
    referencias?: string[];
    capitulos?: string[];
    status?: string;
  };
  onUpdate: (updatedDoc: any) => void;
}

export function Interface({ document, onUpdate }: InterfaceProps) {
  const fields = documentFieldMap[document.type] || [];
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // React Router hook

  // Estados separados para cada parte editável
  const [formData, setFormData] = useState<Record<string, any>>(
    document.formData || {}
  );
  const [palavrasChave, setPalavrasChave] = useState<string[]>(
    document.palavrasChave || []
  );
  const [referencias, setReferencias] = useState<string[]>(
    document.referencias || []
  );
  const [capitulos, setCapitulos] = useState<string[]>(
    document.capitulos || []
  );
  const [resumo, setResumo] = useState(document.resumo || "");

  useEffect(() => {
    setFormData(document.formData || {});
    setPalavrasChave(document.palavrasChave || []);
    setReferencias(document.referencias || []);
    setCapitulos(document.capitulos || []);
    setResumo(document.resumo || "");
  }, [document]);
  // Guardar os originais para comparação (no mount e quando documento muda)
  const originalDataRef = useRef({
    formData: {},
    palavrasChave: [] as string[],
    referencias: [] as string[],
    capitulos: [] as string[],
    resumo: "",
  });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const original = originalDataRef.current;

      // Converte tudo para JSON rápido — sem comparação profunda
      const currentString = JSON.stringify({
        formData,
        palavrasChave,
        referencias,
        capitulos,
        resumo,
      });
      const originalString = JSON.stringify(original);

      // Só atualiza se realmente mudou
      if (currentString !== originalString) {
        onUpdate({
          ...document,
          formData,
          palavrasChave,
          referencias,
          capitulos,
          resumo,
        });

        // Atualiza original
        originalDataRef.current = {
          formData,
          palavrasChave,
          referencias,
          capitulos,
          resumo,
        };
      }
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData, palavrasChave, referencias, capitulos, resumo]);

  // Debounce para evitar muitos updates, só atualiza se mudou de verdade
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const original = originalDataRef.current;
      if (
        !isEqual(formData, original.formData) ||
        !isEqual(palavrasChave, original.palavrasChave) ||
        !isEqual(referencias, original.referencias) ||
        !isEqual(capitulos, original.capitulos) ||
        resumo !== original.resumo
      ) {
        onUpdate({
          ...document,
          formData,
          palavrasChave,
          referencias,
          capitulos,
          resumo,
        });
        // Atualiza original para evitar update infinito
        originalDataRef.current = {
          formData,
          palavrasChave,
          referencias,
          capitulos,
          resumo,
        };
      }
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    formData,
    palavrasChave,
    referencias,
    capitulos,
    resumo,
    document,
    onUpdate,
  ]);

  // Função para manipular listas editáveis simples
  function handleListChange(
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  }
  function addListItem(
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setList((prev) => [...prev, ""]);
  }
  function removeListItem(
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  }
  const handleCommitChapter = useCallback(
    (idx: number, value: string) => {
      setCapitulos((prev) => {
        const next = [...prev];
        next[idx] = value;
        return next;
      });
    },
    [setCapitulos]
  );

  const handleRemoveChapter = useCallback(
    (idx: number) => {
      setCapitulos((prev) => prev.filter((_, i) => i !== idx));
    },
    [setCapitulos]
  );
  // Exportar para PDF com todas as infos
  function exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(document.type.toUpperCase(), 10, 20);

    doc.setFontSize(14);
    let y = 30;
    fields.forEach(({ label, name }) => {
      const value = formData[name] || "";
      doc.text(`${label}: ${value}`, 10, y);
      y += 10;
    });

    y += 5;
    doc.setFontSize(16);
    doc.text("Resumo:", 10, y);
    y += 10;
    doc.setFontSize(12);
    if (resumo) {
      const resumoLines = doc.splitTextToSize(resumo, 180);
      doc.text(resumoLines, 10, y);
      y += resumoLines.length * 10;
    } else {
      doc.text("-", 10, y);
      y += 10;
    }

    function printList(title: string, items: string[]) {
      if (items.length === 0) return;
      y += 10;
      doc.setFontSize(16);
      doc.text(title, 10, y);
      y += 10;
      doc.setFontSize(12);
      items.forEach((item) => {
        doc.text(`- ${item || "-"}`, 12, y);
        y += 10;
      });
    }

    printList("Palavras-chave:", palavrasChave);
    printList("Referências:", referencias);
    printList("Capítulos:", capitulos);

    doc.save(`${document.type}-${document.id}.pdf`);
  }

  return (
    <div className="min-h-screen bg-white max-w-4xl mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold select-none">
          {document.type.toUpperCase()}
        </h1>
        <button
          onClick={exportToPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
          title="Exportar como PDF"
          type="button"
        >
          Exportar PDF
        </button>
        <button
          onClick={async () => {
            if (
              !confirm(
                "Tem certeza que deseja excluir este documento? Esta ação é irreversível."
              )
            )
              return;

            try {
              await axios.delete(
                `${apiUrl}/document-delete/${document.id}`
              );
              // alert("Documento excluído com sucesso!");
              navigate("/dashboard");
              // Opcional: atualizar lista de documentos no parent
              onUpdate(null);
            } catch (err) {
              console.error("Erro ao excluir documento:", err);
              alert("Falha ao excluir documento");
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition"
          title="Excluir documento"
          type="button"
        >
          Excluir
        </button>
        <button
          onClick={async () => {
            navigate("/dashboard");
          }}
          className="text-black px-4 py-2 rounded shadow transition"
          type="button"
        >
          X
        </button>
      </div>

      <div className="space-y-8">
        {/* Campos principais */}
        {fields.map(({ label, name, type, required }) => (
          <div key={name} className="flex flex-col">
            <label className="text-gray-500 text-sm mb-1 select-none">
              {label}
              {required && " *"}
            </label>

            {type === "textarea" ? (
              <textarea
                value={formData[name]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [name]: e.target.value }))
                }
                placeholder={`Digite ${label.toLowerCase()}`}
                className="resize-none border-b border-gray-300 focus:border-blue outline-none text-lg p-1"
                rows={4}
              />
            ) : (
              <input
                type={type === "date" ? "date" : type}
                value={formData[name]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [name]: e.target.value }))
                }
                placeholder={`Digite ${label.toLowerCase()}`}
                className="border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
            )}
          </div>
        ))}

        {/* Resumo */}
        <div className=" mx-auto w-full">
          <label className="text-gray-500 text-sm select-none">Resumo</label>
          <AutoResizeTextarea
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            placeholder="Digite o resumo"
            className="border-none focus:ring-0 bg-transparent text-lg leading-relaxed"
          />
        </div>

        {/* Palavras-chave */}
        <div>
          <label className="text-gray-500 text-sm mb-1 select-none block">
            Palavras-chave
          </label>
          {palavrasChave.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange(
                    palavrasChave,
                    setPalavrasChave,
                    index,
                    e.target.value
                  )
                }
                placeholder="Palavra-chave"
                className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
              <button
                onClick={() =>
                  removeListItem(palavrasChave, setPalavrasChave, index)
                }
                className="text-red-500 font-bold px-2 hover:text-red-700 select-none"
                type="button"
                aria-label="Remover palavra-chave"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(setPalavrasChave)}
            className="text-blue-600 hover:underline select-none mt-1"
            type="button"
          >
            + Adicionar palavra-chave
          </button>
        </div>

        {/* Referências */}
        <div>
          <label className="text-gray-500 text-sm mb-1 select-none block">
            Referências
          </label>
          {referencias.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleListChange(
                    referencias,
                    setReferencias,
                    index,
                    e.target.value
                  )
                }
                placeholder="Referência"
                className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none text-lg p-1"
              />
              <button
                onClick={() =>
                  removeListItem(referencias, setReferencias, index)
                }
                className="text-red-500 font-bold px-2 hover:text-red-700 select-none"
                type="button"
                aria-label="Remover referência"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem(setReferencias)}
            className="text-blue-600 hover:underline select-none mt-1"
            type="button"
          >
            + Adicionar referência
          </button>
        </div>

        {/* Capítulos */}
        <div className="mx-auto w-full space-y-3">
          <label className="text-gray-500 text-sm mb-1 select-none block">
            Capitulos
          </label>
          {capitulos.map((item, index) => (
            <ChapterItem
              key={index} // OK usar index aqui porque ordem/control é local
              index={index}
              initialValue={item}
              onCommit={handleCommitChapter}
              onRemove={handleRemoveChapter}
            />
          ))}

          <button
            onClick={() => addListItem(setCapitulos)}
            className="text-blue-600 hover:underline select-none mt-2"
            type="button"
          >
            + Adicionar capítulo
          </button>
        </div>
      </div>
    </div>
  );
}
