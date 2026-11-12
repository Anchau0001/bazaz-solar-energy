import React, { useState } from 'react';
import { Sale, BusinessSettings } from '../types/index.ts';
import { Printer, Download, CheckCircle, X, ShieldCheck, Phone, MapPin, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  sale: Sale;
  settings?: BusinessSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, settings, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [printed, setPrinted] = useState(false);

  const companyName = settings?.companyName || 'BAZAZ SOLAR ENERGY AND ELECTRICITY MATERIAL';
  const address = settings?.address || 'Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State, Nigeria';
  const phones = settings?.phones || ['09168655473', '08130675552'];

  const handlePrint = () => {
    setPrinted(true);
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200] // Standard 80mm thermal receipt roll or mini invoice
    });

    let y = 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('BAZAZ SOLAR ENERGY', 40, y, { align: 'center' });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Shop No. 7, Bazaz Plaza, Nagoyi, Zaria', 40, y, { align: 'center' });
    y += 4;
    doc.text(`Tel: ${phones.join(' / ')}`, 40, y, { align: 'center' });
    y += 5;
    doc.line(5, y, 75, y);
    y += 5;

    doc.setFontSize(8);
    doc.text(`Receipt: ${sale.transactionRef}`, 5, y);
    y += 4;
    doc.text(`Date: ${new Date(sale.date).toLocaleString('en-GB')}`, 5, y);
    y += 4;
    doc.text(`Staff: ${sale.staffName}`, 5, y);
    y += 4;
    doc.text(`Customer: ${sale.customerName}`, 5, y);
    y += 5;
    doc.line(5, y, 75, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Items', 5, y);
    doc.text('Total (NGN)', 75, y, { align: 'right' });
    y += 4;
    doc.setFont('helvetica', 'normal');

    sale.items.forEach(item => {
      doc.text(`${item.productName.slice(0, 24)}`, 5, y);
      y += 3.5;
      doc.text(`${item.quantity} x ₦${item.unitPrice.toLocaleString()}`, 5, y);
      doc.text(`₦${item.total.toLocaleString()}`, 75, y, { align: 'right' });
      y += 4.5;
    });

    doc.line(5, y, 75, y);
    y += 5;
    doc.text('Subtotal:', 5, y);
    doc.text(`₦${sale.subtotal.toLocaleString()}`, 75, y, { align: 'right' });
    y += 4;

    if (sale.discount > 0) {
      doc.text('Discount:', 5, y);
      doc.text(`-₦${sale.discount.toLocaleString()}`, 75, y, { align: 'right' });
      y += 4;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL PAID:', 5, y);
    doc.text(`₦${sale.totalAmount.toLocaleString()}`, 75, y, { align: 'right' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Payment: ${sale.paymentMethod} (${sale.paymentStatus.toUpperCase()})`, 5, y);
    y += 6;

    doc.line(5, y, 75, y);
    y += 5;
    doc.setFontSize(6.5);
    doc.text('Goods sold covered by manufacturer warranty.', 40, y, { align: 'center' });
    y += 3.5;
    doc.text('Thank you for choosing Bazaz Solar Energy!', 40, y, { align: 'center' });

    doc.save(`Bazaz-Receipt-${sale.transactionRef}.pdf`);
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Top Modal Controls */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition active:scale-95 border border-slate-700"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-xs sm:text-sm">Official Sales Receipt</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition"
            title="Close Receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-8 bg-white text-slate-800 font-sans print:p-0">
          {/* Header */}
          <div className="text-center pb-5 border-b border-dashed border-slate-300">
            <img
              src="/logo.png"
              alt="Bazaz Solar Energy Logo"
              className="w-16 h-16 mx-auto mb-2 object-contain rounded-full bg-white p-0.5 border border-emerald-600/30 shadow-xs"
            />
            <h2 className="text-lg font-extrabold text-emerald-950 uppercase tracking-tight">{companyName}</h2>
            <p className="text-xs text-amber-700 font-medium">Sales & Installation of Solar & Electrical Materials</p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mt-2">
              <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 mt-0.5">
              <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>{phones.join(' / ')}</span>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-y-2 text-xs py-4 border-b border-dashed border-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900">{sale.transactionRef}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Time</span>
              <span className="font-medium text-slate-800">{new Date(sale.date).toLocaleString('en-GB')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Customer</span>
              <span className="font-semibold text-slate-900">{sale.customerName}</span>
              {sale.customerPhone && sale.customerPhone !== 'N/A' && (
                <span className="text-slate-500 block text-[11px]">{sale.customerPhone}</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Issued By Staff</span>
              <span className="font-semibold text-emerald-800">{sale.staffName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4 border-b border-dashed border-slate-300">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Item / Description</span>
              <span className="text-right">Amount (₦)</span>
            </div>

            <div className="space-y-3">
              {sale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div className="max-w-[70%]">
                    <p className="font-semibold text-slate-800 leading-snug">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} x ₦{item.unitPrice.toLocaleString()} {item.productRef && `• ${item.productRef}`}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 text-right">₦{item.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-3 space-y-1.5 text-xs border-b border-dashed border-slate-300">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium">₦{sale.subtotal.toLocaleString()}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied:</span>
                <span>-₦{sale.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>VAT / Tax (Solar Zero-Rated):</span>
              <span>₦0</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span className="text-emerald-950 font-black">TOTAL AMOUNT:</span>
              <span className="text-emerald-800">₦{sale.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                {sale.paymentMethod}
              </span>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Genuine Verified Equipment • Warranty Valid</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              {settings?.receiptFooterMessage || 'Goods sold in good condition are covered under manufacturer warranty. For emergency engineering support, call 09168655473.'}
            </p>
            <p className="text-[10px] text-emerald-800 font-bold mt-1">
              "Reliable Solar Energy Solutions for a Brighter Tomorrow"
            </p>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3 no-print">
          {/* Status feedback after download or print */}
          {(downloaded || printed) && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2 text-xs text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {downloaded && printed
                  ? 'PDF downloaded and print dialog initiated!'
                  : downloaded
                  ? 'PDF Receipt downloaded successfully to your device!'
                  : 'Receipt sent to print queue!'}
              </span>
              <button
                onClick={onClose}
                className="font-bold text-emerald-800 hover:text-emerald-950 underline ml-2 shrink-0 flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back now
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Primary Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Back to Sales / Orders</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border font-semibold text-xs transition shadow-2xs ${
                  downloaded
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
                title="Download PDF copy of receipt"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>{downloaded ? 'Download Again' : 'Download PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-900/20 active:scale-95"
                title="Print thermal or standard receipt"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-2xs active:scale-95"
                title="Return"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

