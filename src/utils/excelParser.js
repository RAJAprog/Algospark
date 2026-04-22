import * as XLSX from 'xlsx';

/**
 * Parses an Excel/CSV file and extracts student data.
 * @param {File} file - The file object from the input.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects.
 */
export const parseStudentExcel = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert sheet to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Normalization Logic: Map different headers to standard keys
                const processedData = jsonData.map(row => {
                    // Try to find an email field regardless of casing or spacing
                    const emailKey = Object.keys(row).find(key => 
                        /email|e-mail|mail|student email/i.test(key)
                    );
                    
                    // Try to find a registration/ID field
                    const regdKey = Object.keys(row).find(key => 
                        /reg|id|roll|number|registration/i.test(key)
                    );

                    return {
                        email: row[emailKey]?.toString().toLowerCase().trim() || null,
                        regdNo: row[regdKey]?.toString().trim() || null,
                        name: row.name || row.Name || row.NAME || null
                    };
                }).filter(student => student.email && student.email.includes('@')); // Only keep rows with valid emails

                resolve(processedData);
            } catch (error) {
                console.error("Excel Parser Error:", error);
                reject("Failed to parse the Excel file. Ensure it is a valid .xlsx or .csv file.");
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

/**
 * Logic to validate if the roster meets minimum requirements
 */
export const validateRosterData = (data) => {
    if (!data || data.length === 0) return { valid: false, message: "The file is empty." };
    
    const hasMissingEmails = data.some(item => !item.email);
    if (hasMissingEmails) return { valid: false, message: "Some rows are missing email addresses." };

    return { valid: true, message: "Roster validated successfully." };
};