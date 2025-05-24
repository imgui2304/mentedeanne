import { PDFDocument, rgb } from 'pdf-lib';

export async function generateBookPDF(bookData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { height } = page.getSize();
  let yPosition = height - 50;

  const drawText = (text: string) => {
    page.drawText(text, {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  };

  // Título sempre existe
  drawText(`Título: ${bookData.formData.title || '-'}`);

  // Agora, conforme o tipo, desenhar informações específicas
  switch (bookData.type) {
    case 'livro':
      drawText(`Autor: ${bookData.formData.author || '-'}`);
      drawText(`Editora: ${bookData.formData.publisher || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      drawText(`Link do Livro: ${bookData.formData.linkBook || '-'}`);
      break;

    case 'curso':
      drawText(`Instituição: ${bookData.formData.institution || '-'}`);
      drawText(`Carga Horária: ${bookData.formData.workload || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      drawText(`Link de Acesso: ${bookData.formData.linkAccess || '-'}`);
      break;

    case 'legislação':
      drawText(`Classificação: ${bookData.formData.classification || '-'}`);
      drawText(`Órgão: ${bookData.formData.organ || '-'}`);
      drawText(`Objetivo: ${bookData.formData.purpose || '-'}`);
      drawText(`Especificação: ${bookData.formData.specification || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      break;

    case 'palestra':
      drawText(`Evento: ${bookData.formData.event || '-'}`);
      drawText(`Palestrante: ${bookData.formData.speaker || '-'}`);
      drawText(`Instituição: ${bookData.formData.institution || '-'}`);
      drawText(`Carga Horária: ${bookData.formData.workload || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      break;

    case 'artigo':
      drawText(`Autor(es): ${(bookData.formData.author || []).join(', ') || '-'}`);
      drawText(`Local de Publicação: ${bookData.formData.placePublication || '-'}`);
      drawText(`ISSN: ${bookData.formData.ISSN || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      break;

    case 'tcc, monografia, dissertacao, tese':
      drawText(`Autor: ${bookData.formData.author || '-'}`);
      drawText(`Categoria: ${bookData.formData.category || '-'}`);
      drawText(`Número de Páginas: ${bookData.formData.pageCount || '-'}`);
      drawText(`Local de Publicação: ${bookData.formData.placePublication || '-'}`);
      drawText(`Ano: ${bookData.formData.year || '-'}`);
      drawText(`Link de Acesso: ${bookData.formData.linkAccess || '-'}`);
      break;

    default:
      drawText('Tipo de documento não reconhecido.');
  }

  // Informações comuns
  if (bookData.resumo) {
    drawText(`Resumo: ${bookData.resumo}`);
  }

  if (bookData.palavrasChave?.length > 0) {
    drawText(`Palavras-chave: ${bookData.palavrasChave.join(', ')}`);
  }

  if (bookData.referencias?.length > 0) {
    drawText(`Referências:`);
    bookData.referencias.forEach((ref: string, index: number) => {
      drawText(`${index + 1}. ${ref}`);
    });
  }

  if (bookData.capitulos?.length > 0) {
    drawText(`Capítulos:`);
    bookData.capitulos.forEach((cap: any, index: number) => {
      drawText(`Capítulo ${index + 1}: ${cap.resumo}`);
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
