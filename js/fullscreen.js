// Fullscreen Management and Anti-cheat Detection
class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
        this.exitCount = 0;
        this.maxExits = 3;
        this.onExitCallback = null;
    }

    async enterFullscreen() {
        try {
            const element = document.documentElement;
            
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            
            this.isFullscreen = true;
            this.setupExitDetection();
            return true;
        } catch (error) {
            console.error('Error entering fullscreen:', error);
            return false;
        }
    }

    setupExitDetection() {
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('msfullscreenchange', this.handleFullscreenChange.bind(this));
        
        // Tab visibility detection
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Copy/paste prevention
        this.preventCopyPaste();
    }

    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        
        if (!this.isFullscreen) {
            this.exitCount++;
            
            if (this.onExitCallback) {
                this.onExitCallback(this.exitCount);
            }
            
            if (this.exitCount >= this.maxExits) {
                this.handleMaxExitsReached();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.exitCount++;
            
            if (this.onExitCallback) {
                this.onExitCallback(this.exitCount);
            }
            
            if (this.exitCount >= this.maxExits) {
                this.handleMaxExitsReached();
            }
        }
    }

    preventCopyPaste() {
        // Prevent right-click context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent common keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Prevent Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, F12, Ctrl+Shift+I, Ctrl+U
            if (
                (e.ctrlKey && ['c', 'v', 'x', 'a', 'u'].includes(e.key)) ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I')
            ) {
                e.preventDefault();
            }
        });
        
        // Prevent text selection
        document.addEventListener('selectstart', (e) => e.preventDefault());
    }

    handleMaxExitsReached() {
        alert('Maximum number of exits reached. Exam will be auto-submitted.');
        
        // Auto-submit the exam
        if (window.examManager) {
            window.examManager.autoSubmit();
        }
    }

    setOnExitCallback(callback) {
        this.onExitCallback = callback;
    }

    getExitCount() {
        return this.exitCount;
    }

    resetExitCount() {
        this.exitCount = 0;
    }
}

// Initialize fullscreen for exam attempt page
if (window.location.pathname.includes('exam_attempt.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const fullscreenBtn = document.getElementById('startExamBtn');
        const manager = new FullscreenManager();
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', async function() {
                const success = await manager.enterFullscreen();
                if (success) {
                    // Start exam
                    window.examManager = new ExamManager(manager);
                }
            });
        }
    });
}

// Exam Manager class
class ExamManager {
    constructor(fullscreenManager) {
        this.fullscreenManager = fullscreenManager;
        this.startTime = Date.now();
        this.answers = {};
        
        fullscreenManager.setOnExitCallback((exitCount) => {
            this.handleExitAttempt(exitCount);
        });
    }

    handleExitAttempt(count) {
        const warning = document.getElementById('exitWarning');
        if (warning) {
            warning.textContent = `Warning: ${count}/${this.fullscreenManager.maxExits} exits used`;
            warning.style.display = 'block';
        }
    }

    autoSubmit() {
        // Collect all answers and submit
        this.submitExam(true);
    }

    submitExam(autoSubmitted = false) {
        const examData = {
            answers: this.answers,
            duration: Math.floor((Date.now() - this.startTime) / 1000),
            autoSubmitted: autoSubmitted,
            exitCount: this.fullscreenManager.getExitCount()
        };
        
        // Store in localStorage for demo
        localStorage.setItem('lastExamSubmission', JSON.stringify(examData));
        
        // Redirect to results
        window.location.href = 'exam_result_view.html';
    }
}
