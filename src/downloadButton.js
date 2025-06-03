// components/DownloadReportButton.tsx
import React from 'react';

const DownloadReportButton = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch('https://d10e-2405-201-3039-2809-6c6c-2295-945c-fe0e.ngrok-free.app/api/report', {
        method: 'GET',
        credentials: 'include', // if you need to send cookies
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `registration-report-${Date.now()}.csv`;
      link.click();

      // Optional cleanup
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download Report
    </button>
  );
};

export default DownloadReportButton;
