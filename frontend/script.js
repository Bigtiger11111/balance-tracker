// पुरानो तलको कोड हटाउनुहोस्:
/*
function updateInternetSummary() {
    let totalCredit = 0;
    let totalDebit = 0;

    const rows = document.querySelectorAll("table tr");
    rows.forEach((row, index) => {
        if (index === 0) return; 
        
        const typeCell = row.cells[4]?.innerText.trim();
        const amountCell = row.cells[5]?.innerText.replace(/[^0-9.]/g, '');
        const amount = parseFloat(amountCell) || 0;

        if (typeCell === "Credit") {
            totalCredit += amount;
        } else if (typeCell === "Debit") {
            totalDebit += amount;
        }
    });

    document.getElementById("total-credit").innerText = "Rs. " + totalCredit.toLocaleString();
    document.getElementById("total-debit").innerText = "Rs. " + totalDebit.toLocaleString();
}

document.addEventListener("DOMContentLoaded", () => {
    updateInternetSummary();
});
*/