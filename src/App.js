
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceiptNo, setSelectedReceiptNo] = useState('201');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch('/mockReceipts.json')
      .then(response => response.json())
      .then(data => setReceipts(data.receipts));
  }, []);

  useEffect(() => {
    if (selectedReceiptNo) {
      const receipt = receipts.find(r => r.receiptNo === selectedReceiptNo);
      setSelectedReceipt(receipt || null);
    }
  }, [selectedReceiptNo, receipts]);

  const handleReceiptNoChange = (event) => {
    setSelectedReceiptNo(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleDownloadPdf = () => {
    const input = document.getElementById('certificate');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        const fileName = `${selectedReceipt?.name || 'certificate'}.pdf`;
        pdf.save(fileName);
      });
  };

  return (
    <div className="App">
      <div id="certificate" className="certificate">
        <div className="certificate-header">
          <img src="photos/jtd.png" className="w-[70px] h-[70px] rounded-[50%]" alt="Logo" />
          <div className="header-text">
            <h1 className="certificate-title">Joining The Dots Foundation</h1>
            <p className="certificate-subtitle">
              Registered Office: 315/8, 1st 'H' Cross, Subbanna Garden, Vijayanagar, Bangalore - 560040
            </p>
            <h2 className="certificate-heading">80G CERTIFICATE</h2>
            <hr className="divider" />
          </div>
        </div>

        <div className="certificate-body">
          <div className="certificate-details">
            <p className="receipt-no">
              Receipt No: {isEditing ? (
                <input
                  type="text"
                  value={selectedReceiptNo}
                  onChange={handleReceiptNoChange}
                  onBlur={handleInputBlur}
                  className="receipt-input"
                />
              ) : (
                <span onClick={handleEditClick} className="receipt-number">{selectedReceipt?.receiptNo || ''}</span>
              )}
            </p>
            <p className="date">Date: <strong>{selectedReceipt?.date || ''}</strong></p>
          </div>

          <div className="thank-you">
            <p>Received with thanks from Mr./Mrs./Ms <strong>{selectedReceipt?.name || ''}</strong></p>
            <p>PAN: <strong>{selectedReceipt?.accountNumber || ''}</strong></p>
            <p>Address: <strong>{selectedReceipt?.address || ''}</strong></p>
          </div>

          <div className="payment-details">
            <p>A sum of INR <strong>{selectedReceipt?.amount || ''}</strong> /-</p>
            <p>By Cash / Bank transfer no. <strong>{selectedReceipt?.chequeNo || ''}</strong></p>
          </div>

          <div className="certificate-footer">
            <p>*Cheque payments are subject to realization</p>
            <p>This certificate is issued under Section 80G of the Income Tax Act.</p>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownloadPdf} 
        className='bg-pink-400 p-2 rounded-[10px] ml-5'
      >
        Download Pdf
      </button>
    </div>
  );
}

export default App;