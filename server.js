const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. 🟢 MongoDB Atlas Connection (Tapaiko Connection String Added)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://bigtiger2055_db_user:loe0YBKPbMCfI1MP@bigtiger11111.gnegteg.mongodb.net/balance_tracker?retryWrites=true&w=majority&appName=bigtiger11111";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 2. Transaction Database Schema (Model)
const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    account: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, default: '-' },
    reason: { type: String, default: '-' },
    amount: { type: Number, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// Root URL Check
app.get('/', (req, res) => {
    res.send("Backend Server is Running Successfully with MongoDB Atlas!");
});

// 3. 🔑 LOGIN API (Username: bigtiger / Password: 5936)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'bigtiger' && password === '5936') {
        return res.json({ success: true, message: "Login Successful!" });
    } else {
        return res.status(401).json({ success: false, message: "Wrong User ID / Password!" });
    }
});

// 4. GET API - Fetch All Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// 5. POST API - Add New Transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { type, account, date, name, reason, amount } = req.body;

        const newTx = new Transaction({
            type,
            account,
            date,
            name,
            reason,
            amount: Number(amount)
        });

        await newTx.save();
        res.status(201).json(newTx);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save transaction" });
    }
});

// 6. DELETE API - Delete Transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction Deleted Successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});