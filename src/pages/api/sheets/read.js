import { getSheetsClient } from "@/lib/googleSheet";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME;
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SHEET_ID || !SHEET_NAME || !SHEET_RANGE) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const sheets = await getSheetsClient();

    // Get all rows from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!${SHEET_RANGE}`,
    });
    const rows = response.data.values || [];

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Read Error:', error);
    return res.status(500).json({ error: error });
  }
}