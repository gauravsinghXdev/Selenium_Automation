// components/DownloadReportButton.tsx
import React from 'react';

const DownloadReportButton = () => {
  const backendUrl = process.env.BACKEND_URL
  const handleDownload = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/report`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
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
