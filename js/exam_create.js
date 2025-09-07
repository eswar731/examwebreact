// Exam Creation System
let currentStep = 1;
let questions = [];
let questionIdCounter = 1;

// Navigation functions
function nextStep() {
    if (currentStep < 3) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep++;
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        if (currentStep === 3) {
            generatePreview();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

// Question management
function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `question-${questionIdCounter}`;
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <h3>Question ${questions.length + 1}</h3>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeQuestion(${questionIdCounter})">Remove</button>
        </div>
        
        <div class="form-group">
            <label>Question Type</label>
            <select onchange="updateQuestionType(${questionIdCounter}, this.value)">
                <option value="mcq">Multiple Choice</option>
                <option value="fill">Fill in the Blanks</option>
                <option value="short">Short Answer</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Question Text *</label>
            <textarea required placeholder="Enter your question" rows="3"></textarea>
        </div>
        
        <div class="form-group">
            <label>Points *</label>
            <input type="number" min="1" max="100" value="1" required>
        </div>
        
        <div class="options-container" id="options-${questionIdCounter}">
            <!-- Options will be added here for MCQ -->
        </div>
    `;
    
    container.appendChild(questionDiv);
    questions.push({
        id: questionIdCounter,
        type: 'mcq',
        text: '',
        points: 1,
        options: []
    });
    
    updateQuestionType(questionIdCounter, 'mcq');
    questionIdCounter++;
}

function removeQuestion(id) {
    const questionDiv = document.getElementById(`question-${id}`);
    if (questionDiv) {
        questionDiv.remove();
        questions = questions.filter(q => q.id !== id);
    }
}

function updateQuestionType(questionId, type) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.type = type;
        
        const optionsContainer = document.getElementById(`options-${questionId}`);
        if (type === 'mcq') {
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>Options (Mark correct answer)</label>
                    <div class="option-input">
                        <input type="radio" name="correct-${questionId}" value="0" checked>
                        <input type="text" placeholder="Option 1" required>
                    </div>
                    <div class="option-input">
                        <input type="radio" name="correct-${questionId}" value="1">
                        <input type="text" placeholder="Option 2" required>
                    </div>
                    <button type="button" onclick="addOption(${questionId})">+ Add Option</button>
                </div>
            `;
        } else {
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>Correct Answer</label>
                    <input type="text" placeholder="Enter correct answer" required>
                </div>
            `;
        }
    }
}

function addOption(questionId) {
    const container = document.querySelector(`#options-${questionId} .form-group`);
    const optionCount = container.querySelectorAll('.option-input').length;
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-input';
    optionDiv.innerHTML = `
        <input type="radio" name="correct-${questionId}" value="${optionCount}">
        <input type="text" placeholder="Option ${optionCount + 1}" required>
    `;
    
    container.insertBefore(optionDiv, container.lastElementChild);
}

// Preview generation
function generatePreview() {
    const examName = document.getElementById('examName').value;
    const examDate = document.getElementById('examDate').value;
    const examDuration = document.getElementById('examDuration').value;
    
    const preview = document.getElementById('examPreview');
    preview.innerHTML = `
        <div class="preview-section">
            <h3>Exam Details</h3>
            <p><strong>Name:</strong> ${examName}</p>
            <p><strong>Date:</strong> ${examDate}</p>
            <p><strong>Duration:</strong> ${examDuration} minutes</p>
            <p><strong>Total Questions:</strong> ${questions.length}</p>
            <p><strong>Total Points:</strong> ${calculateTotalPoints()}</p>
        </div>
        
        <div class="preview-section">
            <h3>Questions Preview</h3>
            ${questions.map((q, index) => `
                <div class="preview-question">
                    <h4>Question ${index + 1} (${q.points} points)</h4>
                    <p>[Question text will be entered by user]</p>
                </div>
            `).join('')}
        </div>
    `;
}

function calculateTotalPoints() {
    return questions.reduce((sum, q) => sum + q.points, 0);
}

// Form submission
document.getElementById('examCreateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const examData = {
        name: document.getElementById('examName').value,
        date: document.getElementById('examDate').value,
        duration: parseInt(document.getElementById('examDuration').value),
        accessCode: document.getElementById('accessCode').value,
        randomize: document.getElementById('randomizeQuestions').checked,
        showResults: document.getElementById('showResults').checked,
        questions: questions
    };
    
    // Store in localStorage for demo purposes
    const existingExams = JSON.parse(localStorage.getItem('exams') || '[]');
    examData.id = Date.now();
    existingExams.push(examData);
    localStorage.setItem('exams', JSON.stringify(existingExams));
    
    alert('Exam created successfully!');
    window.location.href = 'teacher_dashboard.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add first question by default
    addQuestion();
});
