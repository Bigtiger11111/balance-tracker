const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = path.join(__dirname, 'data.json');

// data.json फाइल छैन भने नयाँ खाली फाइल बनाउने
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// JSON फाइलबाट Data पढ्ने Helper Function
const readData = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
};

// JSON फाइलमा Data लेख्ने Helper Function
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Root URL Message
app.get('/', (req, res) => {
    res.send("Backend Server is Running Successfully!");
});

// 🔑 LOGIN API (तपाईंको नयाँ ID र Password)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'bigtiger' && password === '5936') {
        res.json({ success: true, message: "Login Successful!" });
    } else {
        res.status(401).json({ success: false, message: "Wrong User ID / Password!" });
    }
});

// GET API - Fetch Transactions
app.get('/api/transactions', (req, res) => {
    try {
        const transactions = readData();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to read data" });
    }
});

// POST API - Add New Transaction
app.post('/api/transactions', (req, res) => {
    try {
        const transactions = readData();
        const newTx = { id: Date.now(), ...req.body };
        transactions.unshift(newTx);
        writeData(transactions);
        res.status(201).json(newTx);
    } catch (err) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

// DELETE API - Delete Transaction
app.delete('/api/transactions/:id', (req, res) => {
    try {
        let transactions = readData();
        transactions = transactions.filter(tx => tx.id != req.params.id);
        writeData(transactions);
        res.json({ message: "Transaction Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete data" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));