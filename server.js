const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware (CORS ले PC र Mobile दुवैको Connection Allow गर्छ)
app.use(cors());
app.use(express.json());

// Frontend static files serve गर्ने
app.use(express.static(path.join(__dirname, '../frontend')));

// In-Memory Data Store (Transactions)
let transactions = [];

// 1. Login API Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // User ID: bigtiger | Pass: 5936
    if (username === 'bigtiger' && password === '5936') {
        return res.json({ success: true, message: 'Login successful' });
    }
    
    return res.status(401).json({ success: false, message: 'User ID वा Password मिलेन!' });
});

// 2. All Transactions Fetch गर्ने API
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

// 3. New Transaction थप्ने API
app.post('/api/transactions', (req, res) => {
    const { account, type, date, name, reason, amount } = req.body;

    if (!account || !type || !date || !amount) {
        return res.status(400).json({ error: 'Please fill required fields' });
    }

    const newTx = {
        id: Date.now(),
        account,
        type, // 'Credit' or 'Debit'
        date,
        name: name || '-',
        reason: reason || '-',
        amount: parseFloat(amount)
    };

    transactions.unshift(newTx);
    res.json({ success: true, transaction: newTx });
});

// Main Page Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Server Run गर्ने ('0.0.0.0' ले PC र Mobile दुवैबाट कनेक्ट हुन दिन्छ)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Server running on http://0.0.0.0:${PORT}`);
});