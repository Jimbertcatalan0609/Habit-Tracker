const defaultHabits = [
    '💧 Drink 2L Water',
    '🏃‍♂️ 30min Exercise',
    '📖 Read 20 Pages',
    '🧘‍♀️ 10min Meditation',
    '✨ Make Bed'
];

// Load habits from localStorage
function loadHabits() {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
}

// Save habits to localStorage
function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Get current streak for a habit
function getStreak(habitName) {
    const today = new Date().toDateString();
    const habitData = JSON.parse(localStorage.getItem(`habit_${habitName}`) || '{}');
    
    if (habitData.lastCompleted === today) {
        return habitData.streak || 0;
    }
    return 0;
}

// Update habit completion
function updateHabit(habitName, checkbox) {
    const today = new Date().toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const habitData = JSON.parse(localStorage.getItem(`habit_${habitName}`) || '{}');
    
    if (checkbox.checked) {
        habitData.lastCompleted = today;
        habitData.streak = (habitData.lastCompleted === today && habitData.streak) ? habitData.streak + 1 : 1;
        habitData.resetTime = tomorrow.getTime();
    } else {
        // Reset streak if unchecked
        habitData.streak = 0;
    }
    
    localStorage.setItem(`habit_${habitName}`, JSON.stringify(habitData));
    renderHabits();
}

// Add new habit
function addHabit() {
    const input = document.getElementById('habitInput');
    const habitName = input.value.trim();
    
    if (habitName && !habits.some(h => h === habitName)) {
        habits.push(habitName);
        saveHabits(habits);
        input.value = '';
        renderHabits();
    }
}

// Delete habit
function deleteHabit(habitName) {
    const index = habits.indexOf(habitName);
    if (index > -1) {
        habits.splice(index, 1);
        localStorage.removeItem(`habit_${habitName}`);
        saveHabits(habits);
        renderHabits();
    }
}

// Render all habits
function renderHabits() {
    const grid = document.getElementById('habitsGrid');
    grid.innerHTML = '';

    habits.forEach((habitName, index) => {
        const streak = getStreak(habitName);
        const habitData = JSON.parse(localStorage.getItem(`habit_${habitName}`) || '{}');
        const today = new Date().toDateString();
        const isCompleted = habitData.lastCompleted === today;
        const resetTime = new Date(habitData.resetTime || 0);
        
        const card = document.createElement('div');
        card.className = 'habit-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const timeLeft = habitData.resetTime ? 
            Math.max(0, Math.floor((habitData.resetTime - Date.now()) / 1000 / 60 / 60)) : 24;
        
        card.innerHTML = `
            <div class="habit-header">
                <div class="habit-name">${habitName}</div>
                <button class="delete-btn" onclick="deleteHabit('${habitName.replace(/'/g, "\\'")}')">×</button>
            </div>
            
            <div class="streak-display">
                <div class="fire-icon">🔥</div>
                <div class="streak-count">${streak} Day Streak</div>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(streak * 10, 100)}%"></div>
                </div>
                <div class="progress-text">
                    ${streak > 0 ? `${streak * 10}% to mastery` : 'Start your streak!'}
                </div>
            </div>
            
            <input type="checkbox" class="habit-checkbox" id="habit_${index}" 
                   ${isCompleted ? 'checked' : ''} 
                   onchange="updateHabit('${habitName.replace(/'/g, "\\'")}', this)">
            <label for="habit_${index}"></label>
            
            ${isCompleted ? `<div class="reset-time">Resets in ${timeLeft}h</div>` : ''}
        `;
        
        grid.appendChild(card);
    });
}

// Initialize
let habits = loadHabits();

// Add default habits if none exist
if (habits.length === 0) {
    habits = [...defaultHabits];
    saveHabits(habits);
}

// Render initial habits
renderHabits();

// Add habit on Enter key
document.getElementById('habitInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addHabit();
    }
});

// Auto-save on page unload
window.addEventListener('beforeunload', () => {
    saveHabits(habits);
});