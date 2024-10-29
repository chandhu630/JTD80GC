import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceiptNo, setSelectedReceiptNo] = useState('201');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    setCurrentDate(formattedDate);
  }, []);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedReceipt({
      ...selectedReceipt,
      [name]: value,
    });
  };

  const handleSignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleDownloadPdf = () => {
    // Validation for all the fields
    if (!selectedReceiptNo || 
        !selectedReceipt?.name || 
        !selectedReceipt?.accountNumber || 
        !selectedReceipt?.address || 
        !selectedReceipt?.amount || 
        !selectedReceipt?.chequeNo || 
        !signature) {
      alert('Please fill out all the required fields before downloading the PDF.');
      return; 
    }

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
        <div className="certificate-content">
          <div className="certificate-header flex items-center gap-5">
            <img src="photos/jtdlogo.png" alt="Logo" className="w-[70px] h-[70px]" />
            <div className="header-text flex-grow text-center">
              <h1 className="certificate-title text-xl font-bold">Joining The Dots Foundation</h1>
              <p className="certificate-subtitle text-sm">
                Registered Office: 315/8, 1st 'H' Cross, Subbanna Garden, Vijayanagar, Bangalore - 560040
              </p>
              <h2 className="certificate-heading text-lg font-semibold mt-2 text-pink-500">80G CERTIFICATE</h2>
              <hr className="divider mt-2" />
            </div>
          </div>
          <div className="certificate-body">
            <div className="certificate-details">
              <p className="receipt-no">
                Receipt No: 
                <input
                  type="text"
                  value={selectedReceiptNo}
                  onChange={handleReceiptNoChange}
                  className="receipt-input"
                  required
                />
              </p>
              <p className="date">Date: <strong>{currentDate}</strong></p>
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

            <div className="certificate-signature mt-5 text-right">
              <p className='pb-2'>Signature of the Provider</p>
              <input
                type="text"
                value={signature}
                onChange={handleSignatureChange}
                placeholder="Enter your signature"
                className="signature-input"
                required
              />
            </div>

            <div className="certificate-footer">
              <p>*Cheque payments are subject to realization</p>
              <p>This certificate is issued under Section 80G of the Income Tax Act.</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownloadPdf} 
        className='bg-gray-300 p-2 w-[93px] text-[14px] hover:w-[150px] rounded-[10px] transition-all duration-300 ease-in-out overflow-hidden flex items-center mb-[500px] mr-[100px]'
      >
        <img src='photos/dnl.png' alt='Download Logo' className='w-[15px] h-[15px]' />
        <span className='ml-2 whitespace-nowrap'>Download Pdf</span>
      </button>
    </div>
  );
}

export default App;
