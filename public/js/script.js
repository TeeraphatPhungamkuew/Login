function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
}

function submitLogin(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อกดปุ่ม
    console.log("submitLogin called");

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const message = document.getElementById('message'); // สำหรับแสดงข้อความสถานะ

    // ตรวจสอบว่าไม่ได้กรอกข้อมูลว่าง
    if (!username || !password) {
        message.innerHTML = 'Please enter both username and password.';
        return;
    }
    if (username.length !== 10) {
        errorMessage.textContent = 'Username must have 10 digits.';
        loginStatusBox.style.display = "none";
        return;
    } else {
        errorMessage.textContent = ""; 
    }
     // ส่งคำขอ POST ไปยัง API
     fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', { // สมมติว่า API ของคุณใช้ /api/auth
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU261b5f594e59fc70b4651d5cef8de5a1540e8dc3390c4bd087fc10d4cdefde78a0b05d11c07124995fad61418ec418c0'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json(); // สมมติว่า API ส่งข้อมูลกลับเป็น JSON
    })
    .then(data => {
        // ล็อกอินสำเร็จ
        message.innerHTML = 'Login Successful!';
        message.style.display = "block"; // แสดงข้อความ
        message.style.color = "green";  // เปลี่ยนสีข้อความเป็นเขียว
    })
    .catch(error => {
        // ล็อกอินล้มเหลว
        message.innerHTML = `Login failed: ${error.message}`;
        message.style.display = "block"; // แสดงข้อความ
        message.style.color = "red";  // เปลี่ยนสีข้อความเป็นแดง
    });
}
