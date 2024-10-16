document.getElementById('analyze-btn').addEventListener('click', async function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload an Excel file");
        return;
    }

    console.log("File selected:", file.name);

    // Only support Excel files for now
    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'xlsx') {
        console.log("Processing Excel file...");
        const excelData = await readExcelFile(file);
        console.log("Excel data:", excelData);
        displayAnalysis(excelData);
    } else {
        alert('Unsupported file type! Please upload an Excel file.');
    }
});

async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                resolve(JSON.stringify(jsonData)); // Send as string for analysis
            } catch (error) {
                console.error("Error reading Excel file:", error);
                reject(error);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

function displayAnalysis(data) {
    document.getElementById('analysis-output').textContent = data;
}
