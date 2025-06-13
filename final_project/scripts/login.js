document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('password', password);

            window.location.href = `form-submission.html?${params.toString()}`;
        });
    }
});