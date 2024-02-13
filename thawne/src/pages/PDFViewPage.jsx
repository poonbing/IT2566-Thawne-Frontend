import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewPage = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [url, setUrl] = useState(null);
  const location = useLocation();
  const pdfUrl = location.state?.url;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setUrl(blobUrl);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    if (pdfUrl) {
      fetchData();
    }
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div>
      <div className="controls">
        <button onClick={prevPage} disabled={pageNumber === 1}>
          Prev
        </button>
        <button onClick={nextPage} disabled={pageNumber === numPages}>
          Next
        </button>
      </div>

      {url && (
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onContextMenu={(e) => e.preventDefault()}
          size="A4"
          className="pdf-container"
        >
          <Page pageNumber={pageNumber} />
        </Document>
      )}
    </div>
  );
};

export default PDFViewPage;
