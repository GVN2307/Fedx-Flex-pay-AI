document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Admin Logic
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('role', 'admin');
                localStorage.setItem('user', 'admin');
                window.location.href = 'index.html';
                return;
            }

            // User Logic (Check against mocked data)
            // Assuming 'password' is the generic password for demo
            const userAccount = accounts.find(acc => acc.id === username);

            if (userAccount && password === 'password') {
                localStorage.setItem('role', 'user');
                localStorage.setItem('user', userAccount.id);
                window.location.href = `member.html?id=${userAccount.id}`;
                return;
            }

            // Failed Login
            errorMsg.style.display = 'block';
        });
    }

    // Logout Helper
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});
