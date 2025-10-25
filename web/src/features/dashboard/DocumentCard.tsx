import type { Document } from "../types/types";

interface DocumentCardProps {
  doc: Document;
  onClick: () => void;
}

export function DocumentCard({ doc, onClick }: DocumentCardProps) {
  return (
    <div
      className="border-[1px] border-gray-300 p-4 rounded w-64 cursor-pointer hover:border-blue transition"
      onClick={() => {
        console.log("Clique detectado no card"); // 👈 Teste
        if (onClick) onClick(); 
      }}
    >
      <h3 className="font-semibold text-lg mb-2">{doc.formData.title}</h3>
      <p className="text-sm text-gray-600 capitalize">{doc.type}</p>
      <p className="text-xs text-gray-400">
          {doc.formData && "year" in doc.formData && doc.formData.year
            ? new Date(doc.formData.year).toLocaleDateString()
            : doc.formData && "date" in doc.formData && doc.formData.date
            ? new Date(doc.formData.date).toLocaleDateString()
            : "Sem data"}
        </p> 
    </div>
  );
}
