const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

const DATABASE = path.join(__dirname, 'students.json');

app.use(cors());
app.use(express.json());

// Serve all files (HTML, CSS, JS) from the root folder
app.use(express.static(__dirname));

// Send index.html when someone visits the main URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API ROUTES ---

app.get('/list', (req, res) => {
    if (!fs.existsSync(DATABASE)) return res.json([]);
    const data = fs.readFileSync(DATABASE);
    res.json(JSON.parse(data));
});

app.post('/add', (req, res) => {
    const { name, password } = req.body;
    if (password !== "1234") return res.status(401).send("Wrong Password");
    
    let students = fs.existsSync(DATABASE) ? JSON.parse(fs.readFileSync(DATABASE)) : [];
    students.push({ name, time: new Date().toLocaleString() });
    fs.writeFileSync(DATABASE, JSON.stringify(students));
    res.send("Success");
});
app.delete('/delete/:index', (req, res) => {
    const adminPassword = req.headers['admin-secret'];

    // Security Check
    if (adminPassword !== "admin123") {
        return res.status(403).send("Forbidden");
    }

    let students = JSON.parse(fs.readFileSync(DATABASE));
    students.splice(req.params.index, 1);
    fs.writeFileSync(DATABASE, JSON.stringify(students));
    res.send("Ok");
});
});

app.delete('/clear', (req, res) => {
    if (req.headers['admin-secret'] !== "admin123") return res.status(403).send("Forbidden");
    fs.writeFileSync(DATABASE, JSON.stringify([]));
    res.send("Cleared");
});

// Use Render's port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));
