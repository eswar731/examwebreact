// Class Join JavaScript

// Dummy teacher classes for testing
const teacherClasses = [
    { name: "Physics 12A", code: "XZ3P7A", subject: "Physics", teacher: "Mr. Ram", moderation: false },
    { name: "Maths 10B", code: "A1B2C3", subject: "Mathematics", teacher: "Ms. Neha", moderation: true },
    { name: "Chemistry 11C", code: "C3D4E5", subject: "Chemistry", teacher: "Dr. Sharma", moderation: false }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupForm();
    renderJoinedClasses();
});

function setupForm() {
    const form = document.getElementById('joinClassForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        joinClass();
    });
}

function joinClass() {
    const classCode = document.getElementById('classCode').value.trim().toUpperCase();
    const messageArea = document.getElementById('messageArea');
    
    if (!classCode) {
        showMessage('Please enter a class code', 'error');
        return;
    }
    
    if (classCode.length !== 6) {
        showMessage('Class code must be 6 characters', 'error');
        return;
    }
    
    const targetClass = teacherClasses.find(cls => cls.code === classCode);
    
    if (!targetClass) {
        showMessage('Invalid class code', 'error');
        return;
    }
    
    // Check if already joined
    const joinedClasses = getJoinedClasses();
    if (joinedClasses.some(cls => cls.code === classCode)) {
        showMessage('You are already in this class', 'info');
        return;
    }
    
    // Add to joined classes
    const newClass = {
        ...targetClass,
        status: targetClass.moderation ? 'Pending Approval' : 'Joined',
        joinedAt: new Date().toISOString()
    };
    
    joinedClasses.push(newClass);
    saveJoinedClasses(joinedClasses);
    
    showMessage(`Successfully joined ${targetClass.name}`, 'success');
    document.getElementById('classCode').value = '';
    renderJoinedClasses();
}

function getJoinedClasses() {
    return JSON.parse(localStorage.getItem('joined_classes')) || [];
}

function saveJoinedClasses(classes) {
    localStorage.setItem('joined_classes', JSON.stringify(classes));
}

function renderJoinedClasses() {
    const container = document.getElementById('joinedClassesContainer');
    const emptyState = document.getElementById('emptyState');
    const joinedClasses = getJoinedClasses();
    
    container.innerHTML = '';
    
    if (joinedClasses.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    joinedClasses.forEach(cls => {
        const card = createClassCard(cls);
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
                <p class="card-subtitle">${classItem.subject} • ${classItem.teacher}</p>
            </div>
            <span class="status-badge status-${classItem.status === 'Joined' ? 'passed' : 'scheduled'}">
                ${classItem.status}
            </span>
        </div>
        <div class="card-actions">
            <p><strong>Code:</strong> ${classItem.code}</p>
            <button class="btn-small btn-danger" onclick="leaveClass('${classItem.code}')">
                Leave Class
            </button>
        </div>
    `;
    return card;
}

function leaveClass(classCode) {
    if (confirm('Are you sure you want to leave this class?')) {
        const joinedClasses = getJoinedClasses();
        const updatedClasses = joinedClasses.filter(cls => cls.code !== classCode);
        saveJoinedClasses(updatedClasses);
        
        showMessage('Left class successfully', 'success');
        renderJoinedClasses();
    }
}

function showMessage(text, type) {
    const messageArea = document.getElementById('messageArea');
    messageArea.style.display = 'block';
    messageArea.textContent = text;
    messageArea.className = `message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
}
