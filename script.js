// 1. Mark Attendance Function
async function markAttendance() {
    const nameInput = document.getElementById('employeeName'); 
    const passInput = document.getElementById('passCode');
    
    const name = nameInput.value;
    const password = passInput.value;
    
    if(!name || !password) return alert("Fill all fields");

    // REMOVED localhost:3000 - Using relative path '/add'
    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    });

    if (response.status === 401) alert("Wrong Password");
    else { 
        nameInput.value = ""; 
        passInput.value = ""; 
        nameInput.focus(); 
        loadList(); 
    }
}

// 2. Load and Count Function
async function loadList() {
    // REMOVED localhost:3000 - Using relative path '/list'
    const response = await fetch('/list');
    const data = await response.json();
    const listDiv = document.getElementById('attendanceList');
    const countSpan = document.getElementById('presenceCount'); 
    
    if(countSpan) countSpan.innerText = `${data.length} Present`;

    listDiv.innerHTML = data.map((item, index) => `
        <div class="log-item">
            <div class="log-info">
                <b>${item.name}</b>
                <small>${item.time}</small>
            </div>
            <div class="actions">
                <span class="status-badge">PRESENT</span>
                <button class="del-btn" onclick="deleteEntry(${index})">Delete</button>
            </div>
        </div>
    `).reverse().join('');
}

// 3. Delete Function
async function deleteEntry(index) {
    // 1. Ask for password
    const password = prompt("Enter Admin Password to delete this record:");
    if (!password) return;

    // 2. Send request with the secret header
    const response = await fetch(`/delete/${index}`, { 
        method: 'DELETE',
        headers: {
            'admin-secret': password
        }
    });

    if (response.ok) {
        loadList(); // Refresh the list
    } else {
        alert("Access Denied: Invalid Admin Password.");
    }
}

// 4. Search/Filter Function
function filterList() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const records = document.querySelectorAll('.log-item');
    records.forEach(r => {
        const name = r.querySelector('b').innerText.toLowerCase();
        r.style.display = name.includes(query) ? "flex" : "none";
    });
}

// 5. Dark Mode Toggle
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 6. Startup Logic
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
loadList();

// 7. Admin Clear All Function
async function clearAll() {
    const password = prompt("Enter Admin Password to clear all records:");
    if (!password) return;

    // REMOVED localhost:3000
    const response = await fetch('/clear', { 
        method: 'DELETE',
        headers: {
            'admin-secret': password
        }
    });

    if (response.ok) {
        alert("System Reset: All records cleared.");
        loadList(); 
    } else {
        alert("Access Denied: Invalid Admin Password.");
    }
}
