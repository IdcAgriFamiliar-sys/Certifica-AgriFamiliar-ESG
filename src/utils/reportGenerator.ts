import { jsPDF } from "jspdf";

export const generateReport = (title: string, data: any[], columns: string[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(22, 163, 74); // Green-600
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(title, 105, 13, { align: 'center' });

    // Date
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 10, 28);

    let y = 40;
    const lineHeight = 10;
    const pageHeight = 290;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 6, 190, 8, 'F');
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");

    let x = 12;
    columns.forEach(col => {
        doc.text(col, x, y);
        x += 45; // Approximate column width
    });

    y += lineHeight;
    doc.setFont("helvetica", "normal");

    // Rows
    data.forEach((item, index) => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }

        // Zebra striping
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(10, y - 6, 190, 8, 'F');
        }

        let rowX = 12;
        // We assume data values match column order and are pre-formatted strings
        Object.values(item).forEach((val: any) => {
            const text = String(val).substring(0, 25); // Truncate if too long
            doc.text(text, rowX, y);
            rowX += 45;
        });

        y += lineHeight;
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${totalPages}`, 105, 290, { align: 'center' });
    }

    doc.save(`relatorio_${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};
