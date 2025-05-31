import React, { useState, useEffect, useRef } from "react";
import DownloadReportButton from "./downloadButton";
import { FiPlay, FiStopCircle } from 'react-icons/fi';
import { RiRestartFill } from "react-icons/ri";
import "./App.css";

export default function CsvAutomation() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState({});
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const stopRef = useRef(false);

  async function uploadToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("https://f5b1-2402-8100-2704-8b51-a8a1-98a1-b7ec-a662.ngrok-free.app/api/upload-csv", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (uploadData.success) {
      localStorage.setItem("uploadedBlobName", uploadData.blobName);
      fetchAndParseCSV(uploadData.blobName);
    }

 
  }
  const fetchAndParseCSV = async (blobName) => {
    const response = await fetch(`https://f5b1-2402-8100-2704-8b51-a8a1-98a1-b7ec-a662.ngrok-free.app/api/get-csv/${blobName}`);
    const text = await response.text();
  
    const lines = text.trim().split("\n");
    const parsedRows = lines.slice(1).map(line => {
      const [countryCodeRaw, phoneRaw, proxyRaw] = line.split(",");
      return {
        countryCode: countryCodeRaw?.trim() || "",
        phone: phoneRaw?.trim() || "",
        proxy: proxyRaw?.trim() || "",
      };
    }).filter(row => row.phone);
  
    setRows(parsedRows);
    const initialStatus = {};
    parsedRows.forEach(r => (initialStatus[r.phone] = "Pending"));
    setStatus(initialStatus);
    setCurrentIndex(0);
    setRunning(false);
    stopRef.current = false;
  };
  


  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadToBackend(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.trim().split("\n");
      const parsedRows = lines
        .slice(1)
        .map((line) => {
          const [countryCodeRaw, phoneRaw, proxyRaw] = line.split(",");
          return {
            countryCode: countryCodeRaw?.trim() || "",
            phone: phoneRaw?.trim() || "",
            proxy: proxyRaw?.trim() || "",
          };
        })
        .filter((row) => row.phone);
      setRows(parsedRows);
      const initialStatus = {};
      parsedRows.forEach((r) => (initialStatus[r.phone] = "Pending"));
      setStatus(initialStatus);
      setCurrentIndex(0);
      setRunning(false);
      stopRef.current = false;
    };
    reader.readAsText(file);
  }

  useEffect(() => {
    const blobName = localStorage.getItem("uploadedBlobName");
    if (blobName) {
      fetchAndParseCSV(blobName);
    }
  }, []);

  useEffect(() => {
    async function runAutomation() {
      for (let i = currentIndex; i < rows.length; i++) {
        if (stopRef.current) {
          setCurrentIndex(i);
          setRunning(false);
          break;
        }

        const row = rows[i];
        setStatus((s) => ({ ...s, [row.phone]: "Processing" }));

        try {
          const res = await fetch("https://f5b1-2402-8100-2704-8b51-a8a1-98a1-b7ec-a662.ngrok-free.app/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
          });
          const result = await res.json();
          await new Promise((r) => setTimeout(r, 3000));

          if (result.success) {
            setStatus((s) => ({ ...s, [row.phone]: "Success" }));
            await new Promise((r) => setTimeout(r, 4000));
          } else {
            setStatus((s) => ({ ...s, [row.phone]: "Failed" }));
          }
        } catch (err) {
          setStatus((s) => ({ ...s, [row.phone]: "Failed" }));
        }

        setCurrentIndex(i + 1);
      }

      setRunning(false);
    }

    if (running) {
      runAutomation();
    }
  }, [running]);

  function handleStop() {
    stopRef.current = true;
  }

  function handlePlay() {
    if (currentIndex >= rows.length) {
      setCurrentIndex(0);
    }
    stopRef.current = false;
    setRunning(true);
  }

  function handleRestart() {
    stopRef.current = false;
    setCurrentIndex(0);
    const resetStatus = {};
    rows.forEach((r) => (resetStatus[r.phone] = "Pending"));
    setStatus(resetStatus);
    setRunning(true);
  }

  useEffect(() => {
  // Dummy data sample
  const dummyRows = [
    { countryCode: "+1", phone: "1234567890", proxy: "proxy1" },
    { countryCode: "+44", phone: "9876543210", proxy: "proxy2" },
    { countryCode: "+91", phone: "5555555555", proxy: "proxy3" },
  ];

  const dummyStatus = {};
  dummyRows.forEach(r => (dummyStatus[r.phone] = "Pending"));

  setRows(dummyRows);
  setStatus(dummyStatus);
  setCurrentIndex(0);
  setRunning(false);
  stopRef.current = false;
}, []);


  return (
    <>
<h1
  style={{
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#FFF",           // bright yellow text
    backgroundColor: "#6A0DAD", // rich purple background
    padding: "1rem 2rem",
    textAlign: "center",
    margin: 0,
    letterSpacing: "1.5px",
    boxShadow: "0 2px 5px rgba(106, 13, 173, 0.7)", // purple shadow
    userSelect: "none",
  }}
>
  📄 CSV Phone Registration Automation
</h1>
    <div className="container">


      <DownloadReportButton />

      <label className="csv-upload-button">
        📤 Choose CSV File
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden-file-input"
          style={{ display: 'none' }}
          />
      </label>

      <div className="controls">
        <button onClick={handlePlay} disabled={running || rows.length === 0} className="icon-button">
          <FiPlay size={24} />
          <span>Play</span>
        </button>

        <button onClick={handleStop} disabled={!running} className="icon-button">
          <FiStopCircle size={24} />
          <span>Stop</span>
        </button>

        <button onClick={handleRestart} disabled={rows.length === 0} className="icon-button">
          <RiRestartFill size={24} />
          <span>Restart</span>
        </button>

      </div>

      <table>
        <thead>
          <tr>
            <th>Country Code</th>
            <th>Phone</th>
            <th>Proxy</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ countryCode, phone, proxy }, idx) => (
            <tr
            key={`${phone}-${idx}`}
            className={idx === currentIndex && running ? "active" : ""}
            >
              <td>{countryCode}</td>
              <td>{phone}</td>
              <td>{proxy}</td>
              <td className={`status-${status[phone]?.toLowerCase()}`}>
                {status[phone]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </>
  );
}
