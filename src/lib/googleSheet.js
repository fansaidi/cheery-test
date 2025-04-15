import { google } from 'googleapis';
import path from 'path';
import { readFileSync } from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getSheetsClient() {

    const keyPath = path.join(process.cwd(), 'google-service-account.json');
    const keyFile = readFileSync(keyPath, 'utf-8');
    const credentials = JSON.parse(keyFile);

    const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: SCOPES,
    });

    await auth.authorize();

    return google.sheets({ version: 'v4', auth });
}
