// Class Creation JavaScript

// Dummy teacher classes storage
let teacherClasses = JSON.parse(localStorage.getItem('teacher_classes')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateClassCode();
    setupForm();
});

function generateClassCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('classCode').value = code;
}

function regenerateCode() {
    generateClassCode();
}

function setupForm() {
    const form = document.getElementById('createClassForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        createClass();
    });
}

function createClass() {
    const className = document.getElementById('className').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const description = document.getElementById('description').value.trim();
    const moderation = document.getElementById('moderation').checked;
    const classCode = document.getElementById('classCode').value;

    if (!className) {
        showError('Please enter a class name');
        return;
    }

    const newClass = {
        id: Date.now(),
        name: className,
        subject: subject,
        description: description,
        code: classCode,
        moderation: moderation,
        students: [],
        createdAt: new Date().toISOString()
    };

    teacherClasses.push(newClass);
    localStorage.setItem('teacher_classes', JSON.stringify(teacherClasses));

    showSuccess(newClass);
}

function showSuccess(newClass) {
    document.getElementById('createClassForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('generatedCode').textContent = newClass.code;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.marginTop = '1rem';
    
    const form = document.getElementById('createClassForm');
    form.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function goToDashboard() {
    window.location.href = 'teacher_dashboard.html';
}
