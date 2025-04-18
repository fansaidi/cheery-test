import { useEffect, useState } from "react";

export default function Home() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchSheetData() {
      const res = await fetch("/api/sheets/read");
      const json = await res.json();
      setRows(json.data || []); // Initial load
    }

    fetchSheetData();

    const eventSource = new EventSource("/api/webhook");

    eventSource.onopen = (event) => {
      console.log("SSE connection opened:", event);
    }

    eventSource.onmessage = (event) => {
      console.debug('Incoming event:', event);
      const newRow = JSON.parse(event.data);
      console.debug('Parsed new row:', newRow);

      if (newRow.row && Array.isArray(newRow.row)) {
        setRows((prev) => [...prev, newRow.row]); // Append new row
      } else {
        console.error('Invalid row structure:', newRow);
      }
    };

    eventSource.addEventListener("updated", (event) => {
      console.debug("Received 'updated' event:", event);
      const newRow = JSON.parse(event.data);

      if (newRow.row && Array.isArray(newRow.row)) {
        setRows((prev) => [...prev, newRow.row]); // append new row
      } else {
        console.error("Invalid row structure:", newRow);
      }
    });

    eventSource.onerror = (err) => {
      if (err.eventPhase === EventSource.CLOSED) {
        console.log("Connection was closed");
      } else {
        console.error("SSE error", err);
      }
    };

    return () => eventSource.close();
  }, []);

  if (!rows.length) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Google Sheet Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {rows[0].map((header, idx) => (
                <th key={idx} className="px-4 py-2 text-left font-bold text-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 hover:text-black">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
