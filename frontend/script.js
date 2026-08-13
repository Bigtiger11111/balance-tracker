// Render मा Live रहेको Backend URL
const BASE_URL = "https://my-balance-tracker.onrender.com";
const API_URL = `${BASE_URL}/api/transactions`;

// 1. Page Protection Check
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

// 2. Logout Function
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// 3. Login Process Handle गर्ने
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const res = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                alert(data.message || "Rong User ID / Password!");
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Network/Server Error! Server is not running please try again Later.");
        }
    });
}

// 4. API बाट Transactions ल्याउने
async function fetchTransactions() {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (err) {
        console.error("Backend server error:", err);
        return [];
    }
}

// 5. Balance हरू हिसाब गर्ने
function calculateBalances(transactions) {
    let totals = { "Esewa": 3.09, "Nic Asia": 0.52, "CTZ": 171.81, "Cash": 13230.00 };

    transactions.forEach(tx => {
        let val = tx.type === 'Credit' ? Number(tx.amount) : -Number(tx.amount);
        if (totals[tx.account] !== undefined) {
            totals[tx.account] += val;
        }
    });

    return totals;
}

// 🎯 Dynamic Number Counter Animation (0 देखि Target Value सम्म बढाउने)
function animateCounter(elementId, targetValue, duration = 1200) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let startValue = 0;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // EaseOutQuad Formula for smooth slowdown
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(easeProgress * (targetValue - startValue) + startValue);

        el.innerText = currentValue.toLocaleString('en-IN');

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.innerText = targetValue.toLocaleString('en-IN');
        }
    }

    window.requestAnimationFrame(step);
}

// 6. Dashboard Load गर्ने (Smooth Animations)
async function loadDashboard() {
    checkAuth(); // Protection Check

    const transactions = await fetchTransactions();
    const totals = calculateBalances(transactions);

    // Dynamic Counter Animations for Individual Accounts
    animateCounter('esewa-bal', totals["Esewa"]);
    animateCounter('nicasia-bal', totals["Nic Asia"]);
    animateCounter('ctz-bal', totals["CTZ"]);
    animateCounter('cash-bal', totals["Cash"]);

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    animateCounter('total-bal', grandTotal, 1500); // Grand total counter

    // 🎨 Animated 3D Pie Chart Render Logic
    if (document.getElementById('balanceChart')) {
        Highcharts.chart('balanceChart', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                backgroundColor: 'transparent'
            },
            title: { text: null },
            plotOptions: {
                pie: {
                    innerSize: 0,
                    depth: 40,
                    dataLabels: { enabled: false },
                    showInLegend: true,
                    animation: {
                        duration: 1600,
                        easing: 'easeOutBounce' // Smooth bounce animation on entrance
                    }
                }
            },
            legend: {
                itemStyle: { color: '#f8fafc', fontWeight: '600', fontSize: '13px' }
            },
            credits: { enabled: false },
            series: [{
                name: 'Balance',
                data: [
                    { name: 'Esewa', y: totals["Esewa"], color: '#10b981' },
                    { name: 'Nic Asia', y: totals["Nic Asia"], color: '#ef4444' },
                    { name: 'CTZ', y: totals["CTZ"], color: '#3b82f6' },
                    { name: 'Cash', y: totals["Cash"], color: '#6b7280' }
                ]
            }]
        });
    }
}

// 7. Transaction Submit गर्ने Logic (Transaction Page)
const txForm = document.getElementById('txForm');
if (txForm) {
    txForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            type: document.getElementById('type').value,
            account: document.getElementById('account').value,
            date: document.getElementById('date').value,
            name: document.getElementById('name').value,
            reason: document.getElementById('reason').value,
            amount: Number(document.getElementById('amount').value)
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Transaction Successful!");
                window.location.href = 'index.html';
            } else {
                alert("Failed to submit transaction");
            }
        } catch (err) {
            console.error("Submit Error:", err);
            alert("Server error! Backend चलिरहेको छ कि छैन चेक गर्नुहोस्।");
        }
    });
}

// 8. History Page Load गर्ने (History Page)
async function loadHistory() {
    checkAuth();
    const transactions = await fetchTransactions();
    const tbody = document.getElementById('historyBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    transactions.forEach(tx => {
        const tr = document.createElement('tr');
        const amt = Number(tx.amount) || 0;
        tr.innerHTML = `
            <td>${tx.account}</td>
            <td>${tx.date}</td>
            <td>${tx.name || '-'}</td>
            <td>${tx.reason || '-'}</td>
            <td>${tx.type}</td>
            <td style="color: ${tx.type === 'Credit' ? '#10b981' : '#ef4444'}; font-weight: bold;">Rs. ${amt.toLocaleString('en-IN')}</td>
        `;
        tbody.appendChild(tr);
    });
}