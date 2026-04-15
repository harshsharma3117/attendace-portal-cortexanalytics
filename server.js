const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

const DATABASE = path.join(__dirname, 'students.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. GET: Fetch the list
app.get('/list', (req, res) => {
    try {
        if (!fs.existsSync(DATABASE)) return res.json([]);
        const data = fs.readFileSync(DATABASE);
        res.json(JSON.parse(data));
    } catch (e) { res.json([]); }
});

// 2. POST: Add a person
app.post('/add', (req, res) => {
    const { name, password } = req.body;
    if (password !== "1234") return res.status(401).send("Wrong");
    
    let students = fs.existsSync(DATABASE) ? JSON.parse(fs.readFileSync(DATABASE)) : [];
    students.push({ name, time: new Date().toLocaleString() });
    fs.writeFileSync(DATABASE, JSON.stringify(students));
    res.send("Ok");
});

// 3. DELETE: Clear ONE record (ADMIN ONLY)
app.delete('/delete/:index', (req, res) => {
    const adminPassword = req.headers['admin-secret'];
    if (adminPassword !== "admin123") return res.status(403).send("No");

    if (fs.existsSync(DATABASE)) {
        let students = JSON.parse(fs.readFileSync(DATABASE));
        students.splice(req.params.index, 1);
        fs.writeFileSync(DATABASE, JSON.stringify(students));
        res.send("Ok");
    } else {
        res.status(404).send("File not found");
    }
});

// 4. DELETE: Clear ALL records (ADMIN ONLY)
app.delete('/clear', (req, res) => {
    const adminPassword = req.headers['admin-secret'];
    if (adminPassword !== "admin123") return res.status(403).send("No");

    fs.writeFileSync(DATABASE, JSON.stringify([]));
    res.send("Ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
