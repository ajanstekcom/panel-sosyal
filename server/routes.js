import express from 'express';
import db from './database.js';
import { authenticate } from './auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const router = express.Router();

// --- CUSTOMERS ---

// Get all customers
router.get('/customers', authenticate, (req, res) => {
    db.all(`SELECT * FROM customers ORDER BY name ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

// Add/Update customer
router.post('/customers', authenticate, upload.single('photo'), (req, res) => {
    const { name, phone, tc_id, notes, id } = req.body;
    const photo_path = req.file ? `/uploads/${req.file.filename}` : req.body.photo_path;

    if (id) {
        // Update
        db.run(
            `UPDATE customers SET name = ?, phone = ?, tc_id = ?, photo_path = ?, notes = ? WHERE id = ?`,
            [name, phone, tc_id, photo_path, notes, id],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ success: true });
            }
        );
    } else {
        // Insert
        db.run(
            `INSERT INTO customers (name, phone, tc_id, photo_path, notes) VALUES (?, ?, ?, ?, ?)`,
            [name, phone, tc_id, photo_path, notes],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.status(201).json({ id: this.lastID, name, phone, tc_id, photo_path });
            }
        );
    }
});

// --- CALCULATIONS ---

// Save calculation
router.post('/calculations', authenticate, (req, res) => {
    const { customer_id, data, total_amount } = req.body;
    db.run(`INSERT INTO calculations (customer_id, data, total_amount) VALUES (?, ?, ?)`, [customer_id, JSON.stringify(data), total_amount], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

// Get customer calculations
router.get('/customers/:id/calculations', authenticate, (req, res) => {
    db.all(`SELECT * FROM calculations WHERE customer_id = ? ORDER BY created_at DESC`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows.map(r => ({ ...r, data: JSON.parse(r.data) })));
    });
});

// --- USER MANAGEMENT (Admin Only) ---

router.get('/users', authenticate, (req, res) => {
    // Check if requester is admin
    db.get('SELECT role FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        db.all('SELECT id, username, role FROM users', [], (err, rows) => {
            res.json(rows);
        });
    });
});
// Delete customer
router.delete('/customers/:id', authenticate, (req, res) => {
    db.get('SELECT role FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        });
    });
});

// User Deletion
router.delete('/users/:id', authenticate, (req, res) => {
    db.get('SELECT role FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        });
    });
});

router.put('/users/:id/password', authenticate, (req, res) => {
    db.get('SELECT role FROM users WHERE id = ?', [req.userId], async (err, user) => {
        if (user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password required' });

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id], function (err) {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ success: true });
        });
    });
});

export default router;
