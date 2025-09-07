// OTP Timer and Validation System
class OTPTimer {
    constructor(duration = 60) {
        this.duration = duration;
        this.remaining = duration;
        this.interval = null;
        this.isActive = false;
    }

    start(callback) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.remaining = this.duration;
        
        this.interval = setInterval(() => {
            this.remaining--;
            callback(this.remaining);
            
            if (this.remaining <= 0) {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.isActive = false;
        }
    }

    reset() {
        this.stop();
        this.remaining = this.duration;
    }

    getFormattedTime() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// OTP Validation
class OTPValidator {
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static validateOTP(input, expected) {
        return input === expected && input.length === 6;
    }

    static formatOTP(input) {
        return input.replace(/\D/g, '').slice(0, 6);
    }
}

// Usage in pages
function initializeOTPTimer(buttonId, displayId, duration = 60) {
    const button = document.getElementById(buttonId);
    const display = document.getElementById(displayId);
    const timer = new OTPTimer(duration);

    button.addEventListener('click', function() {
        if (!timer.isActive) {
            button.disabled = true;
            button.textContent = 'Sending...';
            
            // Simulate OTP sending
            setTimeout(() => {
                const otp = OTPValidator.generateOTP();
                localStorage.setItem('currentOTP', otp);
                console.log('OTP sent:', otp); // In real app, send via SMS/email
                
                timer.start((remaining) => {
                    display.textContent = `Resend OTP (${timer.getFormattedTime()})`;
                    
                    if (remaining <= 0) {
                        button.disabled = false;
                        button.textContent = 'Resend OTP';
                        display.textContent = '';
                    }
                });
                
                button.textContent = 'OTP Sent';
            }, 1000);
        }
    });
}

// Initialize on OTP verification page
if (window.location.pathname.includes('otp_verify.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeOTPTimer('resendOTP', 'timerDisplay');
    });
}
