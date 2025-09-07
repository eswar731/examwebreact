// Auto-save functionality for exam attempts
class AutoSaveManager {
    constructor(saveInterval = 30000) { // 30 seconds default
        this.saveInterval = saveInterval;
        this.intervalId = null;
        this.lastSaveTime = null;
        this.data = {};
    }

    start(examId, userId) {
        this.examId = examId;
        this.userId = userId;
        this.storageKey = `autosave_${examId}_${userId}`;
        
        // Load any existing auto-saved data
        this.loadSavedData();
        
        // Start auto-save interval
        this.intervalId = setInterval(() => {
            this.save();
        }, this.saveInterval);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.save());
        
        // Save on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.save();
            }
        });
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    save() {
        const currentData = this.collectCurrentData();
        
        if (this.hasDataChanged(currentData)) {
            this.data = {
                ...currentData,
                timestamp: Date.now(),
                examId: this.examId,
                userId: this.userId
            };
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            this.lastSaveTime = Date.now();
            
            // Update UI
            this.updateSaveIndicator();
        }
    }

    collectCurrentData() {
        const data = {
            answers: {},
            currentQuestion: 1,
            timeSpent: 0
        };
        
        // Collect all answers
        const answerInputs = document.querySelectorAll('[data-question-id]');
        answerInputs.forEach(input => {
            const questionId = input.dataset.questionId;
            data.answers[questionId] = input.value;
        });
        
        // Get current question
        const currentQuestion = document.querySelector('.question.active');
        if (currentQuestion) {
            data.currentQuestion = parseInt(currentQuestion.dataset.questionId);
        }
        
        // Calculate time spent
        if (window.examStartTime) {
            data.timeSpent = Math.floor((Date.now() - window.examStartTime) / 1000);
        }
        
        return data;
    }

    hasDataChanged(newData) {
        if (!this.lastSaveTime) return true;
        
        const currentAnswers = JSON.stringify(newData.answers);
        const savedAnswers = JSON.stringify(this.data.answers || {});
        
        return currentAnswers !== savedAnswers;
    }

    loadSavedData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                this.data = JSON.parse(saved);
                this.restoreData();
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    restoreData() {
        if (!this.data.answers) return;
        
        // Restore answers
        Object.entries(this.data.answers).forEach(([questionId, answer]) => {
            const input = document.querySelector(`[data-question-id="${questionId}"]`);
            if (input) {
                input.value = answer;
            }
        });
        
        // Restore current question
        if (this.data.currentQuestion) {
            this.navigateToQuestion(this.data.currentQuestion);
        }
        
        // Update UI
        this.updateSaveIndicator();
    }

    navigateToQuestion(questionId) {
        // Implementation depends on your question navigation system
        const questions = document.querySelectorAll('.question');
        questions.forEach((q, index) => {
            q.classList.toggle('active', index + 1 === questionId);
        });
    }

    updateSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        if (indicator) {
            const time = this.lastSaveTime ? new Date(this.lastSaveTime).toLocaleTimeString() : 'Never';
            indicator.textContent = `Last saved: ${time}`;
            indicator.classList.add('saved');
            
            setTimeout(() => {
                indicator.classList.remove('saved');
            }, 2000);
        }
    }

    clearSavedData() {
        localStorage.removeItem(this.storageKey);
        this.data = {};
        this.lastSaveTime = null;
    }

    getResumeData() {
        return this.data;
    }
}

// Resume exam functionality
class ExamResumeManager {
    static checkForResume(examId, userId) {
        const storageKey = `autosave_${examId}_${userId}`;
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const timeSinceSave = Date.now() - data.timestamp;
                
                // Offer to resume if saved within last 24 hours
                if (timeSinceSave < 24 * 60 * 60 * 1000) {
                    return confirm(`You have an incomplete exam. Resume from where you left off?`);
                }
            } catch (error) {
                console.error('Error checking resume data:', error);
            }
        }
        
        return false;
    }
}

// Initialize auto-save for exam attempt page
if (window.location.pathname.includes('exam_attempt.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('examId') || 'default';
        const userId = localStorage.getItem('userId') || 'anonymous';
        
        // Check for resume
        if (ExamResumeManager.checkForResume(examId, userId)) {
            // Resume existing exam
            window.autoSaveManager = new AutoSaveManager();
            window.autoSaveManager.start(examId, userId);
        } else {
            // Start new exam
            window.autoSaveManager = new AutoSaveManager();
            window.autoSaveManager.start(examId, userId);
            window.examStartTime = Date.now();
            
            // Clear any old data
            window.autoSaveManager.clearSavedData();
        }
    });
}
