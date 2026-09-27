import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateInvoiceTotals } from './serviceCatalog';
import { formatDate } from './formatCurrency';

/**
 * Generates and downloads a clean, professional vector PDF invoice/quotation.
 * @param {Object} invoice
 */
export async function generateInvoicePdf(invoice) {
  if (!invoice) {
    throw new Error('No invoice data available to generate PDF.');
  }

  const lineItems = invoice.lineItems || [];
  if (lineItems.length === 0) {
    throw new Error('Please add at least one service before generating a PDF.');
  }

  const totals = calculateInvoiceTotals(lineItems, invoice.taxRate || 0.18, invoice.discount || 0);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;

  // Primary brand colors
  const primaryColor = [2, 107, 201]; // #026bc9 (Brand Blue)
  const darkNavy = [15, 23, 42];      // #0f172a (Navy)
  const textGray = [100, 116, 139];   // #64748b
  const lightBg = [248, 250, 252];    // #f8fafc
  const borderColor = [226, 232, 240];// #e2e8f0

  // 1. Top Decorative Brand Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 4, 'F');

  currentY += 4;

  // 2. Company Brand & Document Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...darkNavy);
  doc.text('InvoiceLens ', margin, currentY + 6);

  const brandWidth = doc.getTextWidth('InvoiceLens ');
  doc.setTextColor(...primaryColor);
  doc.text('AI', margin + brandWidth, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  doc.text('Smart Natural Language Billing System', margin, currentY + 11);

  const isQuotation = (invoice.docType || '').toLowerCase().includes('quotation');

  // Document Title (QUOTATION / TAX INVOICE) on right
  const docTitle = (invoice.docType || (isQuotation ? 'OFFICIAL QUOTATION' : 'TAX INVOICE')).toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkNavy);
  doc.text(docTitle, pageWidth - margin, currentY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(invoice.invoiceNumber || (isQuotation ? 'QUO-2026-0042' : 'INV-2026-0042'), pageWidth - margin, currentY + 11, { align: 'right' });

  currentY += 20;

  // 3. Sender & Invoice Metadata Box
  doc.setDrawColor(...borderColor);
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 2, 2, 'FD');

  // Left column: Sender info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkNavy);
  doc.text(invoice.sender?.company || 'InvoiceLens AI Solutions', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text(invoice.sender?.address || 'Mumbai Innovation Hub, MH, India', margin + 4, currentY + 11);
  doc.text(invoice.sender?.email || 'billing@invoicelens.ai', margin + 4, currentY + 16);

  // Right column: Dates & Status
  const rightColX = pageWidth - margin - 4;
  doc.setFont('helvetica', 'bold');
  doc.text('Date Issued: ', rightColX - 35, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(invoice.issueDate || new Date()), rightColX, currentY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text(isQuotation ? 'Valid Until: ' : 'Payment Due: ', rightColX - 35, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(invoice.dueDate || new Date()), rightColX, currentY + 11, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Status: ', rightColX - 35, currentY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(invoice.status || 'Verified & Ready', rightColX, currentY + 16, { align: 'right' });

  currentY += 28;

  // 4. Billed To (Client Details Section)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text('BILLED TO (CLIENT DETAILS)', margin, currentY);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 1.5, margin + 40, currentY + 1.5);

  currentY += 6;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderColor);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkNavy);
  doc.text(invoice.client?.name || 'Rahul Sharma', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  doc.text(invoice.client?.company || 'ABC Technologies', margin + 4, currentY + 11);
  doc.text(invoice.client?.address || 'Noida, UP, India', margin + 4, currentY + 16);

  // Client contact on right
  doc.text(`Email: ${invoice.client?.email || 'contact@client.example.com'}`, rightColX, currentY + 6, { align: 'right' });
  doc.text(`Phone: ${invoice.client?.phone || '+91 98765 43210'}`, rightColX, currentY + 11, { align: 'right' });
  doc.text(`Currency: INR (Rs.)`, rightColX, currentY + 16, { align: 'right' });

  currentY += 28;

  // 5. Itemized Table of Services
  const tableData = totals.lineItems.map((item, index) => [
    String(index + 1).padStart(2, '0'),
    item.serviceName || item.description,
    item.billingType === 'monthly' ? 'Monthly Recurring' : 'One-time',
    String(item.quantity || 1),
    `Rs. ${item.unitPrice.toLocaleString('en-IN')}`,
    `Rs. ${(item.quantity * item.unitPrice).toLocaleString('en-IN')}`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Service Description', 'Type', 'Qty', 'Unit Rate', 'Amount']],
    body: tableData,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: darkNavy,
      cellPadding: 3,
      lineColor: borderColor,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [241, 245, 249], // #f1f5f9
      textColor: [71, 85, 105],   // #475569
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 12 },
      4: { halign: 'right', cellWidth: 26 },
      5: { halign: 'right', cellWidth: 28, fontStyle: 'bold' },
    },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Check if summary fits on page, else add page
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = margin;
  }

  // 6. Summary Totals Box (Right) & Notes (Left)
  const summaryBoxWidth = 75;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  // Left Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkNavy);
  doc.text('Terms & Instructions:', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  const termsText = doc.splitTextToSize(
    invoice.notes || '1. Quotation is valid for 14 days from issue.\n2. 50% advance upon project initiation.\n3. Recurring services billed on the 1st of each month.',
    summaryX - margin - 10
  );
  doc.text(termsText, margin, currentY + 5);

  // Right Totals Table
  const totalsRows = [];
  if (totals.oneTimeSubtotal > 0 && totals.recurringMonthlySubtotal > 0) {
    totalsRows.push(['One-Time Services:', `Rs. ${totals.oneTimeSubtotal.toLocaleString('en-IN')}`]);
    totalsRows.push(['Monthly Recurring:', `Rs. ${totals.recurringMonthlySubtotal.toLocaleString('en-IN')}/mo`]);
  }
  totalsRows.push(['Subtotal:', `Rs. ${totals.subtotal.toLocaleString('en-IN')}`]);
  totalsRows.push(['Estimated GST (18%):', `Rs. ${totals.taxAmount.toLocaleString('en-IN')}`]);
  if (totals.discount > 0) {
    totalsRows.push(['Discount:', `-Rs. ${totals.discount.toLocaleString('en-IN')}`]);
  }
  totalsRows.push(['GRAND TOTAL:', `Rs. ${totals.grandTotal.toLocaleString('en-IN')}`]);

  autoTable(doc, {
    startY: currentY - 2,
    body: totalsRows,
    margin: { left: summaryX, right: margin },
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: darkNavy,
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', textColor: textGray },
      1: { halign: 'right', fontStyle: 'bold', textColor: darkNavy },
    },
    didParseCell: (data) => {
      // Bold highlight for Grand Total row
      if (data.row.index === totalsRows.length - 1) {
        data.cell.styles.fontSize = 10;
        data.cell.styles.textColor = primaryColor;
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // 7. Footer
  const footerY = pageHeight - 10;
  doc.setDrawColor(...borderColor);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text('InvoiceLens AI — Built by Rajendra Patil for Kodnexus AI Build Battle', margin, footerY);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

  // Save PDF
  const filename = `InvoiceLens-${isQuotation ? 'Quotation' : 'Invoice'}-${invoice.invoiceNumber || (isQuotation ? 'QUO-001' : 'INV-001')}.pdf`;
  doc.save(filename);
  return filename;
}
