const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // เพิ่มการนำเข้า fetch สำหรับ Node.js

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send('<p>Please enter both username and password.</p>'); // ตรวจสอบข้อมูลที่กรอกก่อนส่ง
    }

    const requestBody = {
        UserName: username,
        PassWord: password
    };

    // เรียก API
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Application-Key": "", 
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.tu_status && data.displayname_th && data.displayname_en && data.email && data.department && data.faculty) {
            // ส่งข้อมูลกลับไปยัง client
            res.status(200).send(`
                <p><strong>Name (EN):</strong> ${data.displayname_en}</p>
                <p><strong>ชื่อ (ภาษาไทย):</strong> ${data.displayname_th}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Faculty:</strong> ${data.faculty}</p>
                <p><strong>Department:</strong> ${data.department}</p>
                <p><strong>StudentID:</strong> ${data.username}</p>
            `);
        } else {
            res.status(200).send(`<p>Login successful, but some information is missing from the response.</p>`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).send(`<p>An error occurred: ${error.message}</p>`);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
