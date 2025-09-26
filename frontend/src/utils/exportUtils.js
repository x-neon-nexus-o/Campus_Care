import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import Papa from 'papaparse';
import { Document, Packer, Paragraph, ImageRun } from 'docx';
import autoTable from 'jspdf-autotable';

// Normalize CSS colors like "oklch(...)" to browser-supported rgb()/rgba() for html2canvas
const normalizeColorsInDocument = (doc) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    const toRgb = (value) => {
      try {
        ctx.fillStyle = '#000';
        ctx.fillStyle = value;
        return ctx.fillStyle;
      } catch (_) {
        return null;
      }
    };
    const elements = doc.querySelectorAll('*');
    elements.forEach((el) => {
      const style = doc.defaultView.getComputedStyle(el);
      // Color
      const color = style.color;
      if (color && color.includes('oklch')) {
        const rgb = toRgb(color);
        if (rgb) el.style.color = rgb;
      }
      // Background
      const bg = style.backgroundColor;
      if (bg && bg.includes('oklch')) {
        const rgb = toRgb(bg) || '#ffffff';
        el.style.backgroundColor = rgb;
      }
      // Border colors
      ['Top','Right','Bottom','Left'].forEach((side) => {
        const prop = `border${side}Color`;
        const val = style[prop];
        if (val && typeof val === 'string' && val.includes('oklch')) {
          const rgb = toRgb(val);
          if (rgb) el.style[prop] = rgb;
        }
      });
    });
  } catch (_) {
    // best-effort; ignore failures
  }
};

export const exportToCSV = (data, filename = 'complaints') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (elementId, filename = 'complaints-report') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }

  try {
    // Use html-to-image to avoid oklch parsing issues
    const dataUrl = await htmlToImage.toPng(element, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      style: { backgroundColor: '#ffffff' }
    });

    // Create an Image to read intrinsic dimensions
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 295;

    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportToImage = async (elementId, filename = 'complaints-report') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for Image export');
    return;
  }
  try {
    // Prefer html-to-image to avoid oklch parsing issues
    const dataUrl = await htmlToImage.toPng(element, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      style: { backgroundColor: '#ffffff' }
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
  } catch (error) {
    console.error('Error generating Image:', error);
  }
};

export const exportToDOCX = async (elementId, filename = 'complaints-report') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for DOCX export');
    return;
  }
  try {
    // Use html-to-image to avoid color parsing errors
    const dataUrl = await htmlToImage.toPng(element, {
      cacheBust: true,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      style: { backgroundColor: '#ffffff' }
    });

    const res = await fetch(dataUrl);
    const buffer = await res.arrayBuffer();

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: {
                    width: 1100,
                    height: 1500,
                  },
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.docx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating DOCX:', error);
  }
};

export const formatComplaintsForExport = (complaints) => {
  return complaints.map(complaint => ({
    'Complaint ID': complaint._id,
    'Subject': complaint.subject,
    'Category': complaint.category,
    'Department': complaint.department || 'Unassigned',
    'Status': complaint.status,
    'Urgency': complaint.urgency,
    'Assigned To': complaint.assignedTo || 'Unassigned',
    'Created At': new Date(complaint.createdAt).toLocaleString(),
    'Due Date': complaint.dueAt ? new Date(complaint.dueAt).toLocaleString() : 'Not Set',
    'SLA Hours': complaint.slaHours || 72,
    'Description': complaint.description,
    'Student ID': complaint.studentId || 'N/A',
    'Email': complaint.email || 'N/A',
    'Phone': complaint.phone || 'N/A',
    'Building': complaint.building || 'N/A',
    'Room': complaint.room || 'N/A'
  }));
};

export const exportStructuredPDF = async ({ complaints, kpis, filename = 'complaints-report' }) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 14;

    // Header
    doc.setFontSize(16);
    doc.text('Complaints Report', margin, 18);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleString(), 210 - margin, 18, { align: 'right' });

    // KPIs
    if (kpis) {
      doc.setFontSize(12);
      doc.text('Summary', margin, 28);
      doc.setFontSize(10);
      const lines = [
        `Total: ${kpis.total}`,
        `Assigned: ${kpis.assigned}`,
        `Unassigned: ${kpis.unassigned}`,
        `SLA Breaches: ${kpis.slaBreaches}`,
      ];
      lines.forEach((l, idx) => doc.text(l, margin, 36 + idx * 6));
    }

    // Table data
    const startY = kpis ? 36 + 4 * 6 + 6 : 30;
    const rows = (complaints || []).map((c) => [
      c._id,
      c.subject,
      c.category,
      c.department || 'Unassigned',
      c.status,
      c.urgency,
      c.priority || '-',
      (typeof c.assignedTo === 'string')
        ? c.assignedTo
        : (c.assignedTo?.email || c.assignedTo?.name || 'Unassigned'),
      c.dueAt ? new Date(c.dueAt).toLocaleDateString() : '-',
    ]);

    autoTable(doc, {
      head: [[
        'ID', 'Subject', 'Category', 'Department', 'Status', 'Urgency', 'Priority', 'Assigned To', 'Due'
      ]],
      body: rows,
      startY,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [25, 118, 210] },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 38 },
        2: { cellWidth: 22 },
        3: { cellWidth: 24 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18 },
        6: { cellWidth: 20 },
        7: { cellWidth: 24 },
        8: { cellWidth: 16 },
      },
      didDrawPage: () => {
        const str = `Page ${doc.internal.getNumberOfPages()}`;
        doc.setFontSize(8);
        doc.text(str, 210 - margin, 295 - 6, { align: 'right' });
      },
    });

    doc.save(`${filename}.pdf`);
  } catch (err) {
    console.error('Structured PDF export failed:', err);
  }
};
