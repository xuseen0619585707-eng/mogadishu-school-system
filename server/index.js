const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// ==========================================
// 1. MIDDLEWARE (MUST BE AT THE TOP)
// ==========================================
app.use(cors());
app.use(express.json()); // <--- This fixes your error!

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mogadishu_school'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database Successfully!');
});

// ==========================================
// 3. API ROUTES
// ==========================================

// --- Test Route ---
app.get('/', (req, res) => {
    res.json("Backend is running!");
});

// --- LOGIN ROUTE ---
app.post('/login', (req, res) => {
    const sql = `
        SELECT users.id, users.username, users.full_name, roles.role_name 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.username = ? AND users.password = ?
    `;
    
    // Safety check: Ensure req.body exists
    if (!req.body) return res.json({ status: "Error", message: "No data received" });

    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) return res.json({ error: "Database Error" });
        
        if (data.length > 0) {
            return res.json({ 
                status: "Success", 
                user: {
                    name: data[0].full_name,
                    role: data[0].role_name
                }
            });
        } else {
            return res.json({ status: "Failed", message: "Wrong username or password" });
        }
    });
});

// --- DASHBOARD STATS ---
app.get('/stats', (req, res) => {
    const sql1 = "SELECT COUNT(*) as total_students FROM students";
    const sql2 = "SELECT COUNT(*) as total_teachers FROM teachers";
    const sql3 = "SELECT SUM(amount) as total_revenue FROM fees WHERE status = 'Paid'";

    db.query(sql1, (err, students) => {
        if(err) return res.json(err);
        db.query(sql2, (err, teachers) => {
            if(err) return res.json(err);
            db.query(sql3, (err, revenue) => {
                if(err) return res.json(err);
                res.json({
                    students: students[0].total_students,
                    teachers: teachers[0].total_teachers,
                    revenue: revenue[0].total_revenue || 0
                });
            });
        });
    });
});

// --- GET ALL STUDENTS ---
app.get('/students', (req, res) => {
    const sql = "SELECT * FROM students ORDER BY id DESC";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: err.message });
        return res.json(data);
    });
});

// --- ADD NEW STUDENT ---
app.post('/students', (req, res) => {
    const sql = "INSERT INTO students (`full_name`, `dob`, `gender`, `class`, `phone`, `address`, `parent_id`) VALUES (?)";
    
    const values = [
        req.body.fullName,
        req.body.dob,
        req.body.gender,
        req.body.class,
        req.body.phone,
        req.body.address,
        null 
    ];

    db.query(sql, [values], (err, data) => {
        if(err) return res.json({ error: err.message });
        return res.json({ status: "Success", id: data.insertId });
    });
});

// ==========================================
// 4. START SERVER
// ==========================================
app.listen(8081, () => {
    console.log("-----------------------------------------");
    console.log("🚀 Backend Server running on Port 8081");
    console.log("-----------------------------------------");
});