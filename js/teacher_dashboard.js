// Teacher Dashboard JavaScript

// Dummy data
const teacherClasses = [
    {
        id: 1,
        name: "Physics 12A",
        subject: "Physics",
        students: 35,
        exams: [
            { name: "Test 1", date: "2025-08-10", attempts: 30, status: "Open" },
            { name: "Quiz 2", date: "2025-07-20", attempts: 35, status: "Completed" }
        ]
    },
    {
        id: 2,
        name: "Maths 10B",
        subject: "Mathematics",
        students: 28,
        exams: [
            { name: "Midterm", date: "2025-08-05", attempts: 25, status: "Open" }
        ]
    }
];

const leaderboard = [
    { name: "Anjali", score: 92, exam: "Physics Test 1" },
    { name: "Ravi", score: 89, exam: "Physics Test 1" },
    { name: "Priya", score: 86, exam: "Physics Test 1" }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupNavigation();
    renderActivityChart();
    renderLeaderboard();
});

function initializeDashboard() {
    // Update stats
    document.getElementById('totalClasses').textContent = teacherClasses.length;
    document.getElementById('totalStudents').textContent = teacherClasses.reduce((sum, cls) => sum + cls.students, 0);
    document.getElementById('activeExams').textContent = teacherClasses.reduce((sum, cls) => 
        sum + cls.exams.filter(exam => exam.status === 'Open').length, 0);
    document.getElementById('completedExams').textContent = teacherClasses.reduce((sum, cls) => 
        sum + cls.exams.filter(exam => exam.status === 'Completed').length, 0);
    
    // Render sections
    renderClasses();
    renderExamsAccordion();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function renderClasses() {
    const container = document.getElementById('classesContainer');
    container.innerHTML = '';
    
    if (teacherClasses.length === 0) {
        container.innerHTML = '<div class="empty-state">No classes created yet</div>';
        return;
    }
    
    teacherClasses.forEach(classItem => {
        const card = createClassCard(classItem);
        container.appendChild(card);
    });
}

function createClassCard(classItem) {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-title">${classItem.name}</h3>
                <p class="card-subtitle">${classItem.subject} • ${classItem.students} students</p>
            </div>
            <span class="status-badge status-scheduled">${classItem.exams.length} exams</span>
        </div>
        <div class="card-actions">
            <button class="btn-small btn-secondary" onclick="manageClass(${classItem.id})">Manage</button>
            <button class="btn-small btn-danger" onclick="deleteClass(${classItem.id})">Delete</button>
        </div>
    `;
    return card;
}

function renderExamsAccordion() {
    const container = document.getElementById('examsAccordion');
    container.innerHTML = '';
    
    if (teacherClasses.length === 0) {
        container.innerHTML = '<div class="empty-state">No classes with exams</div>';
        return;
    }
    
    teacherClasses.forEach(classItem => {
        const accordionItem = createAccordionItem(classItem);
        container.appendChild(accordionItem);
    });
}

function createAccordionItem(classItem) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `
        <div>
            <h3>${classItem.name}</h3>
            <p>${classItem.exams.length} exams • ${classItem.students} students</p>
        </div>
        <span class="accordion-toggle">▼</span>
    `;
    
    const content = document.createElement('div');
    content.className = 'accordion-content';
    
    if (classItem.exams.length > 0) {
        const examsList = document.createElement('div');
        examsList.className = 'exams-list';
        
        classItem.exams.forEach(exam => {
            const examItem = document.createElement('div');
            examItem.className = 'exam-item';
            examItem.innerHTML = `
                <div class="exam-info">
                    <h4>${exam.name}</h4>
                    <p>Date: ${exam.date} • Attempts: ${exam.attempts}</p>
                    <span class="status-badge status-${exam.status.toLowerCase()}">${exam.status}</span>
                </div>
                <div class="exam-actions">
                    <button class="btn-small btn-secondary" onclick="viewResults('${exam.name}')">View Results</button>
                    <button class="btn-small btn-secondary" onclick="editExam('${exam.name}')">Edit</button>
                </div>
            `;
            examsList.appendChild(examItem);
        });
        
        content.appendChild(examsList);
    } else {
        content.innerHTML = '<p>No exams in this class</p>';
    }
    
    header.addEventListener('click', function() {
        content.classList.toggle('active');
        const toggle = this.querySelector('.accordion-toggle');
        toggle.textContent = content.classList.contains('active') ? '▲' : '▼';
    });
    
    item.appendChild(header);
    item.appendChild(content);
    
    return item;
}

function renderLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No leaderboard data</td></tr>';
        return;
    }
    
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}%</td>
            <td>${entry.exam}</td>
        `;
        tbody.appendChild(row);
    });
}

function renderActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = [45, 10]; // Attempted vs Missed
    const labels = ['Attempted', 'Missed'];
    
    // Simple bar chart using canvas
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const barWidth = (width - 2 * padding) / data.length - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    
    // Draw bars
    const maxValue = Math.max(...data);
    const barHeight = height - 2 * padding;
    
    data.forEach((value, index) => {
        const x = padding + index * (barWidth + 20);
        const barHeightActual = (value / maxValue) * barHeight;
        const y = height - padding - barHeightActual;
        
        // Draw bar
        ctx.fillStyle = index === 0 ? '#10b981' : '#ef4444';
        ctx.fillRect(x, y, barWidth, barHeightActual);
        
        // Draw label
        ctx.fillStyle = '#374151';
        ctx.fillText(labels[index], x, height - padding + 15);
        ctx.fillText(value, x + barWidth/2 - 10, y - 5);
    });
}

function manageClass(classId) {
    showToast(`Managing class ${classId}`);
}

function deleteClass(classId) {
    if (confirm('Are you sure you want to delete this class?')) {
        showToast(`Class ${classId} deleted`);
    }
}

function viewResults(examName) {
    showToast(`Viewing results for ${examName}`);
}

function editExam(examName) {
    showToast(`Editing ${examName}`);
}

function createNewClass() {
    showToast('Redirecting to create new class...');
    // In real app: window.location.href = 'class_create.html';
}

function createNewExam() {
    showToast('Redirecting to create new exam...');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}
