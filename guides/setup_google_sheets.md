# How to Connect Formspree to Google Sheets

Since we are using **Formspree** to handle the form submissions, connecting to Google Sheets is done entirely through their dashboard. You do **not** need to change any code for this to work.

## Steps

1.  **Log in** to your [Formspree Dashboard](https://formspree.io/login).
2.  Click on the **Form** you created for this project (e.g., "TKM Project").
3.  Go to the **Integrations** tab (usually on the left sidebar or top menu).
4.  Find **Google Sheets** in the list of integration options and click **Connect**.
5.  **Authorize** Formspree to access your Google Drive/Sheets.
6.  You will be asked to either:
    *   **Create a new sheet**: Formspree will create a sheet named after your form.
    *   **Select an existing sheet**: You can choose a sheet you already made.
7.  **Test it**:
    *   Go back to your running app (localhost).
    *   Fill out the registration form and submit.
    *   Check the Google Sheet—the new row should appear instantly!

## Notes

*   **Sheet Names**: If you change the sheet name in Google Drive later, the link might break.
*   **Columns**: Formspree automatically adds columns matching your form's `name` fields (e.g., `studentName`, `email`, `phone`).
*   **Dual-Write**: We are also setting up **Firebase** to store this data permanently in your own database, so you will have two copies: one in Sheets (easy to view) and one in Firebase (for the App Dashboard).
