# 🧩 Fullstack Next.js App with Google Sheets as a Database

This fullstack **Next.js** application uses the **Google Sheets API** as a lightweight and flexible database solution.

It supports **real-time updates** via **Server-Sent Events (SSE)** and integrates with a Google Sheet enhanced by **Google Apps Script** for extended functionality.

---

## 📊 Google Spreadsheet Integration

This [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1Jk4Lg1STkrI665Y8TZe_3sQzRExEuk4hl8bSJsNUEKQ/edit?usp=sharing) is powered by custom **Apps Script functions**, including:

- ✅ **Generate Dummy Data**  
  Quickly populate the sheet for testing by selecting `AI Tool > Generate Dummy Data` from the menu.

- 🔁 **Webhook on Edit**  
  An `onEdit` trigger sends a webhook to the app whenever the sheet is modified, enabling real-time updates via SSE.

---

## ⚠️ Important Notes

- The app requires a **Google Service Account** to authenticate and interact with the Google Sheets API.
- SSE might not work since Google Apps Script requires a **publicly accessible webhook URL**, use tool like **ngrok** to expose local url.
