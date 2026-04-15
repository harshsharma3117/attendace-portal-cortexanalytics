const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

const DATABASE = 'students.json';

app.use(cors());
app.use(express.json());

// 1. GET: Fetch the list
app.get('/list', (req, res) => {
    if (!fs.existsSync(DATABASE)) return res.json([]);
    const data = fs.readFileSync(DATABASE);
    res.json(JSON.parse(data));
});

// 2. POST: Add a person
app.post('/add', (req, res) => {
    const { name, password } = req.body;
    if (password !== "1234") return res.status(401).send("Wrong Password");

    let students = [];
    if (fs.existsSync(DATABASE)) {
        students = JSON.parse(fs.readFileSync(DATABASE));
    }

    students.push({ name, time: new Date().toLocaleString() });
    fs.writeFileSync(DATABASE, JSON.stringify(students));
    res.send("Attendance Marked Successfully");
});

// 3. DELETE: Clear ONE record
app.delete('/delete/:index', (req, res) => {
    const index = req.params.index;
    if (!fs.existsSync(DATABASE)) return res.status(404).send();

    let students = JSON.parse(fs.readFileSync(DATABASE));
    students.splice(index, 1);
    fs.writeFileSync(DATABASE, JSON.stringify(students));
    res.send("Deleted");
});

// 4. DELETE: Clear ALL records (This is what was missing/hidden)
app.delete('/clear', (req, res) => {
    // Check for a secret password in the request headers
    const adminPassword = req.headers['admin-secret'];

    if (adminPassword !== "admin123") {
        console.log("Unauthorized attempt to clear database!");
        return res.status(403).send("Forbidden: Admin access only");
    }

    fs.writeFileSync(DATABASE, JSON.stringify([]));
    console.log("Database cleared by Admin.");
    res.send("Database Cleared");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));