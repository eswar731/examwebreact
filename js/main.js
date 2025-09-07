// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(String(phone));
}

function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(String(password));
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function startOtpTimer(button, countdownElement, duration = 60) {
    let timeLeft = duration;
    button.disabled = true;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            button.disabled = false;
            countdownElement.textContent = '00:00';
        }
        timeLeft--;
    }, 1000);
}

// Password Toggle
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearError();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            if (!email || !password || !role) {
                showError('Please fill in all fields');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Mock login success
            const mockToken = 'mock_jwt_token_' + Date.now();
            localStorage.setItem('token', mockToken);
            localStorage.setItem('role', role);
            
            // Redirect based on role
            if (role === 'student') {
                window.location.href = 'student_dashboard.html';
            } else if (role === 'teacher') {
                window.location.href = 'teacher_dashboard.html';
            }
        });
    }
    
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearError();
            
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const otp = document.getElementById('otp').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.querySelector('input[name="role"]:checked')?.value;
            const terms = document.getElementById('terms').checked;
            
            if (!email || !phone || !otp || !password || !confirmPassword || !role) {
                showError('Please fill in all fields');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (!validatePhone(phone)) {
                showError('Please enter a valid 10-digit phone number');
                return;
            }
            
            if (!validatePassword(password)) {
                showError('Password must be at least 8 characters with 1 number and 1 special character');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (!terms) {
                showError('Please agree to the terms and conditions');
                return;
            }
            
            // Mock signup success
            localStorage.setItem('role', role);
            window.location.href = 'otp_verify.html';
        });
    }
    
    // OTP Request Handler
    const requestOtpBtn = document.getElementById('requestOtpBtn');
    if (requestOtpBtn) {
        requestOtpBtn.addEventListener('click', requestOTP);
    }
    
    // OTP Verification Handler
    const otpVerifyForm = document.getElementById('otpVerifyForm');
    if (otpVerifyForm) {
        // Start timer on page load
        const resendBtn = document.getElementById('resendBtn');
        const timerElement = document.getElementById('timer');
        if (resendBtn && timerElement) {
            startOtpTimer(resendBtn, timerElement);
        }
        
        otpVerifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearError();
            
            const otp = document.getElementById('otp').value;
            
            if (!otp || otp.length !== 6) {
                showError('Please enter a valid 6-digit OTP');
                return;
            }
            
            // Mock OTP verification success
            const role = localStorage.getItem('role');
            if (role === 'student') {
                window.location.href = 'student_dashboard.html';
            } else if (role === 'teacher') {
                window.location.href = 'teacher_dashboard.html';
            }
        });
    }
});

// OTP Request Function
function requestOTP() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (!email || !validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!phone || !validatePhone(phone)) {
        showError('Please enter a valid 10-digit phone number');
        return;
    }
    
    const requestBtn = document.getElementById('requestOtpBtn');
    const otpInput = document.getElementById('otp');
    
    if (requestBtn && otpInput) {
        requestBtn.disabled = true;
        otpInput.disabled = false;
        
        // Start countdown
        let countdown = 60;
        const originalText = requestBtn.textContent;
        
        const timer = setInterval(() => {
            requestBtn.textContent = `Wait ${countdown}s`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(timer);
                requestBtn.textContent = originalText;
                requestBtn.disabled = false;
            }
        }, 1000);
        
        showSuccess('OTP sent to your email/phone');
    }
}

// Resend OTP Function
function resendOTP() {
    const resendBtn = document.getElementById('resendBtn');
    const timerElement = document.getElementById('timer');
    
    if (resendBtn && timerElement) {
        startOtpTimer(resendBtn, timerElement);
        showSuccess('New OTP sent to your email/phone');
    }
}

// Auto-select role from URL parameter
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    
    if (role && document.querySelector(`input[name="role"][value="${role}"]`)) {
        document.querySelector(`input[name="role"][value="${role}"]`).checked = true;
    }
});

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html') ||
            window.location.pathname.includes('otp_verify.html')) {
            if (role === 'student') {
                window.location.href = 'student_dashboard.html';
            } else if (role === 'teacher') {
                window.location.href = 'teacher_dashboard.html';
            }
        }
    }
}

// Run auth check on page load
checkAuth();
