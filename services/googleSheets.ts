export interface SheetData {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Submits data to the Google Sheet via the Apps Script Web App.
 * @param data The form data to submit
 * @param type The type of submission ('student' or 'teacher')
 * @returns Promise that resolves to the result
 */
export const submitToGoogleSheets = async (data: SheetData, type: 'student' | 'teacher') => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

    if (!scriptUrl || scriptUrl === 'PLACEHOLDER_URL_HERE') {
        console.warn('Google Sheets URL is not configured. Skipping backup.');
        return { result: 'skipped', message: 'URL not configured' };
    }

    try {
        // Create URLSearchParams (more reliable for Apps Script)
        // Note: For complex data, sending JSON via text/plain body is better, 
        // but for simple key-value pairs, URLSearchParams works well with e.parameter
        const params = new URLSearchParams();
        params.append('type', type);

        // Add all data fields
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                params.append(key, String(data[key]));
            }
        });

        // Send POST request
        // Content-Type: application/x-www-form-urlencoded is automatically set by fetch when body is URLSearchParams
        await fetch(scriptUrl, {
            method: 'POST',
            body: params,
            mode: 'no-cors'
        });

        // Since mode is no-cors, we won't get a readable response content
        // We assume success if no network error occurred
        return { result: 'success' };
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return { result: 'error', error };
    }
};
