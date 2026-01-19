// Get elements
const daysCounter = document.getElementById('daysCounter');
const startDateElement = document.getElementById('startDate');
const resetBtn = document.getElementById('resetBtn');
const messageElement = document.getElementById('message');
const modal = document.getElementById('cryingModal');
const modalClose = document.getElementById('modalClose');
const skipBtn = document.getElementById('skipBtn');
const confirmTearsBtn = document.getElementById('confirmTearsBtn');
const reasonsContainer = document.getElementById('reasonsContainer');
const customReasonInput = document.getElementById('customReasonInput');

// Storage keys
const STORAGE_KEY = 'cryingAppStartDate';
const CRYING_LOG_KEY = 'cryingLog';

// Funny work-related crying reasons (top 10)
const cryingReasons = [
    "Meeting that could've been an email",
    "Spent 3 hours debugging a missing semicolon",
    "Realized I was on mute the entire presentation",
    "Coffee machine was broken",
    "Received an 'As per my last email' response",
    "Found a bug in production on Friday at 4:55 PM",
    "Accidentally replied-all with a meme",
    "Boss said 'We need to talk' with no context",
    "Just existing in corporate America",
    "OTHER (Type your reason)"
];

let selectedReason = null;
let isCustomReason = false;

// Motivational messages based on days
const messages = {
    0: "EVERY JOURNEY STARTS WITH A SINGLE STEP! 🌱",
    1: "ONE DAY STRONG! YOU'RE AMAZING! 💪",
    3: "THREE DAYS! BUILDING MOMENTUM! 🚀",
    7: "A WHOLE WEEK! INCREDIBLE PROGRESS! 🌟",
    14: "TWO WEEKS! YOU'RE UNSTOPPABLE! 🔥",
    30: "A FULL MONTH! YOU'RE A WARRIOR! 👑",
    60: "TWO MONTHS! ABSOLUTELY PHENOMENAL! 🎯",
    90: "THREE MONTHS! YOU'RE A LEGEND! 🏆",
    180: "HALF A YEAR! EXTRAORDINARY ACHIEVEMENT! 🎊",
    365: "ONE YEAR! YOU'RE ABSOLUTELY INCREDIBLE! 🎉✨"
};

// Initialize app
function init() {
    updateCounter();
    setInterval(updateCounter, 60000); // Update every minute
    populateReasons();
    setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
    // Reset button opens modal
    resetBtn.addEventListener('click', openModal);
    
    // Modal close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Skip button
    skipBtn.addEventListener('click', () => {
        confirmReset(null);
    });
    
    // Confirm tears button
    confirmTearsBtn.addEventListener('click', () => {
        if (isCustomReason) {
            const customText = customReasonInput.value.trim();
            if (customText) {
                confirmReset(customText);
            } else {
                showCustomAlert('⚠️ PLEASE TYPE YOUR REASON OR SKIP! ⚠️');
            }
        } else if (selectedReason) {
            confirmReset(selectedReason);
        } else {
            showCustomAlert('⚠️ PLEASE SELECT A REASON OR SKIP! ⚠️');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to close modal
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Calculate days since start date
function calculateDays() {
    const startDate = localStorage.getItem(STORAGE_KEY);
    
    if (!startDate) {
        return null;
    }
    
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return { days: diffDays, startDate: start };
}

// Update counter display
function updateCounter() {
    const result = calculateDays();
    
    if (!result) {
        daysCounter.textContent = '0';
        startDateElement.textContent = 'START TRACKING YOUR JOURNEY';
        messageElement.querySelector('.message-text').textContent = messages[0];
        return;
    }
    
    daysCounter.textContent = result.days;
    startDateElement.textContent = `SINCE ${result.startDate.toLocaleDateString().toUpperCase()}`;
    updateMessage(result.days);
}

// Update motivational message based on days
function updateMessage(days) {
    let message = "KEEP GOING STRONG! YOU'RE DOING AMAZING! 💫";
    
    const milestones = Object.keys(messages).map(Number).sort((a, b) => b - a);
    
    for (let milestone of milestones) {
        if (days >= milestone) {
            message = messages[milestone];
            break;
        }
    }
    
    messageElement.querySelector('.message-text').textContent = message;
}

// Populate crying reasons in modal
function populateReasons() {
    reasonsContainer.innerHTML = '';
    
    cryingReasons.forEach((reason, index) => {
        const reasonDiv = document.createElement('div');
        reasonDiv.className = 'reason-item';
        reasonDiv.textContent = reason;
        reasonDiv.dataset.reason = reason;
        reasonDiv.dataset.index = index;
        
        reasonDiv.addEventListener('click', function() {
            // Remove selected class from all items
            document.querySelectorAll('.reason-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            this.classList.add('selected');
            
            // Check if "OTHER" was selected
            if (this.dataset.reason === "OTHER (Type your reason)") {
                customReasonInput.classList.add('active');
                customReasonInput.focus();
                isCustomReason = true;
                selectedReason = null;
            } else {
                customReasonInput.classList.remove('active');
                customReasonInput.value = '';
                isCustomReason = false;
                selectedReason = this.dataset.reason;
            }
        });
        
        reasonsContainer.appendChild(reasonDiv);
    });
}

// Open modal
function openModal() {
    modal.classList.add('active');
    selectedReason = null;
    isCustomReason = false;
    
    // Remove all selected states
    document.querySelectorAll('.reason-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Hide and clear custom input
    customReasonInput.classList.remove('active');
    customReasonInput.value = '';
    
    // Scroll to top of reasons
    reasonsContainer.scrollTop = 0;
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    selectedReason = null;
    isCustomReason = false;
}

// Confirm reset and log reason
async function confirmReset(reason) {
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Update the start date
    localStorage.setItem(STORAGE_KEY, timestamp);
    
    // Log the crying reason
    if (reason) {
        await logCryingReason(reason, timestamp);
    }
    
    // Close modal
    closeModal();
    
    // Update counter
    updateCounter();
    
    // Show confirmation
    if (reason) {
        showCustomAlert('😢 TEARS CONFIRMED & LOGGED! IT\'S OKAY, TOMORROW IS A NEW DAY! 💙');
    } else {
        showCustomAlert('😢 COUNTER RESET! IT\'S OKAY, TOMORROW IS A NEW DAY! 💙');
    }
}

// Log crying reason to server
async function logCryingReason(reason, timestamp) {
    try {
        // Send to server
        const response = await fetch('/api/log-crying', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason,
                timestamp: timestamp
            })
        });
        
        if (!response.ok) {
            console.error('Failed to log crying reason');
        }
        
        // Also keep a local backup in localStorage
        let log = [];
        const existingLog = localStorage.getItem(CRYING_LOG_KEY);
        if (existingLog) {
            try {
                log = JSON.parse(existingLog);
            } catch (e) {
                log = [];
            }
        }
        
        log.push({
            reason: reason,
            timestamp: timestamp,
            date: new Date(timestamp).toLocaleString()
        });
        
        localStorage.setItem(CRYING_LOG_KEY, JSON.stringify(log));
        
    } catch (error) {
        console.error('Error logging crying reason:', error);
        
        // Fallback to localStorage only if server is unavailable
        let log = [];
        const existingLog = localStorage.getItem(CRYING_LOG_KEY);
        if (existingLog) {
            try {
                log = JSON.parse(existingLog);
            } catch (e) {
                log = [];
            }
        }
        
        log.push({
            reason: reason,
            timestamp: timestamp,
            date: new Date(timestamp).toLocaleString()
        });
        
        localStorage.setItem(CRYING_LOG_KEY, JSON.stringify(log));
    }
}

// Custom alert function
function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6AB4E8, #4A90E2);
        border: 4px solid #87CEEB;
        border-radius: 20px;
        padding: 30px 40px;
        color: white;
        font-family: 'Orbitron', monospace;
        font-size: 1.2rem;
        font-weight: 700;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 0 40px rgba(74, 144, 226, 0.6);
        text-transform: uppercase;
        letter-spacing: 2px;
        max-width: 80%;
    `;
    alertBox.textContent = message;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(44, 62, 80, 0.8);
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.remove();
        overlay.remove();
    }, 2000);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
