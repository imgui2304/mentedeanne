import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";

// ---------- AutoResizeTextarea leve (usa rAF para reduzir layout thrash) ----------
export function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Ajusta altura sem forçar muitos layouts — via rAF
  const adjustHeight = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    // lê scrollHeight só após reset (força relayout mínimo)
    const h = el.scrollHeight;
    el.style.height = `${h}px`;
  };

  // Ajusta sempre que value muda, mas usando requestAnimationFrame
  useLayoutEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      adjustHeight();
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={`resize-none overflow-hidden bg-transparent focus:ring-0 outline-none w-full break-words leading-relaxed ${
        className ?? ""
      }`}
      style={{
        minHeight: "32px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
    />
  );
}

export const ChapterItem = memo(function ChapterItem({
  index,
  initialValue,
  onCommit,
  onRemove,
}: {
  index: number;
  initialValue: string;
  onCommit: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [localValue, setLocalValue] = useState(initialValue ?? "");
  const debounceRef = useRef<number | null>(null);

  // Atualiza valor local (rápido)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  // Envia update para o pai após 400ms sem digitar
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onCommit(index, localValue);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localValue, index, onCommit]);

  return (
    <div className="group relative text-lg w-full border-b border-gray-300 p-4 ">
      <AutoResizeTextarea
        value={localValue}
        onChange={handleChange}
        placeholder={`Escreva o conteúdo do capítulo ${index + 1}...`}
        className=""
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition"
      >
        ✕
      </button>
    </div>
  );
});
