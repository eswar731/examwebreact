// Student Dashboard JavaScript

// Dummy data
const classes = [
    { id: 1, name: "Physics 12A", teacher: "Mr. Ram", subject: "Physics" },
    { id: 2, name: "Maths 10B", teacher: "Ms. Neha", subject: "Mathematics" },
    { id: 3, name: "Chemistry 11C", teacher: "Dr. Sharma", subject: "Chemistry" }
];

const upcomingExams = [
    { id: 1, name: "Unit Test 1", class: "Physics 12A", date: "2025-08-10", status: "Scheduled" },
    { id: 2, name: "Quiz - Algebra", class: "Maths 10B", date: "2025-08-12", status: "Open" },
    { id: 3, name: "Chemistry Lab", class: "Chemistry 11C", date: "2025-08-15", status: "Locked" }
];

const pastExams = [
    { id: 1, name: "Pre-Mid Physics", score: 82, date: "2025-07-28", result: "Passed" },
    { id: 2, name: "Algebra Quiz", score: 45, date: "2025-07-20", result: "Failed" },
    { id: 3, name: "Chemistry Test", score: 78, date: "2025-07-25", result: "Passed" }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupNavigation();
    renderPerformanceChart();
});

function initializeDashboard() {
    // Update stats
    document.getElementById('totalClasses').textContent = classes.length;
    document.getElementById('upcomingCount').textContent = upcomingExams.length;
    document.getElementById('completedCount').textContent = pastExams.length;
    
    // Calculate average score
    const avgScore = pastExams.reduce((sum, exam) => sum + exam.score, 0) / pastExams.length;
    document.getElementById('avgScore').textContent = Math.round(avgScore) + '%';
    
    // Render sections
    renderClasses();
    renderUpcomingExams();
    renderPastExams();
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
    
    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state">No classes joined yet</div>';
        return;
    }
    
    classes.forEach(classItem => {
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
                <p class="card-subtitle">Teacher: ${classItem.teacher}</p>
            </div>
            <span class="status-badge status-scheduled">${classItem.subject}</span>
        </div>
        <div class="card-actions">
            <button class="btn-small btn-danger" onclick="leaveClass(${classItem.id})">Leave Class</button>
        </div>
    `;
    return card;
}

function renderUpcomingExams() {
    const container = document.getElementById('upcomingExams');
    container.innerHTML = '';
    
    if (upcomingExams.length === 0) {
        container.innerHTML = '<div class="empty-state">No upcoming exams</div>';
        return;
    }
    
    upcomingExams.forEach(exam => {
        const card = createExamCard(exam, true);
        container.appendChild(card);
    });
}

function renderPastExams() {
    const container = document.getElementById('pastExams');
    container.innerHTML = '';
    
    if (pastExams.length === 0) {
        container.innerHTML = '<div class="empty-state">No past exams</div>';
        return;
    }
    
    pastExams.forEach(exam => {
        const card = createExamCard(exam, false);
        container.appendChild(card);
    });
}

function createExamCard(exam, isUpcoming) {
    const card = document.createElement('div');
    card.className = 'exam-card';
    
    if (isUpcoming) {
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${exam.name}</h3>
                    <p class="card-subtitle">${exam.class}</p>
                </div>
                <span class="status-badge status-${exam.status.toLowerCase()}">${exam.status}</span>
            </div>
            <p><strong>Date:</strong> ${exam.date}</p>
        `;
    } else {
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${exam.name}</h3>
                    <p class="card-subtitle">${exam.date}</p>
                </div>
                <span class="status-badge status-${exam.result.toLowerCase()}">${exam.result}</span>
            </div>
            <p><strong>Score:</strong> ${exam.score}%</p>
        `;
    }
    
    return card;
}

function renderPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scores = pastExams.map(exam => exam.score);
    const labels = pastExams.map(exam => exam.name);
    
    // Simple line chart using canvas
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw data points
    if (scores.length > 0) {
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const range = maxScore - minScore || 1;
        
        const stepX = (width - 2 * padding) / (scores.length - 1);
        const stepY = (height - 2 * padding) / range;
        
        ctx.beginPath();
        scores.forEach((score, index) => {
            const x = padding + index * stepX;
            const y = height - padding - ((score - minScore) * stepY);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#374151';
            ctx.fillText(score + '%', x - 10, y - 10);
        });
        
        ctx.strokeStyle = '#2563eb';
        ctx.stroke();
    }
}

function leaveClass(classId) {
    if (confirm('Are you sure you want to leave this class?')) {
        // In a real app, this would make an API call
        showToast('Left class successfully');
    }
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
