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

// Neo punk motivational messages based on days
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
    
    // Add random glitch effects
    setInterval(randomGlitch, 5000);
    
    // Populate crying reasons in modal
    populateReasons();
    
    // Set up modal event listeners
    setupModalListeners();
}

// Random glitch effect on counter
function randomGlitch() {
    if (Math.random() > 0.7) {
        daysCounter.style.animation = 'none';
        setTimeout(() => {
            daysCounter.style.animation = 'numberPulse 2s ease-in-out infinite, glitch 0.3s';
            setTimeout(() => {
                daysCounter.style.animation = 'numberPulse 2s ease-in-out infinite';
            }, 300);
        }, 10);
    }
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
        startDateElement.textContent = 'CLICK "I CRIED TODAY" TO START TRACKING';
        messageElement.querySelector('.message-text').textContent = messages[0];
        return;
    }
    
    daysCounter.textContent = result.days;
    startDateElement.textContent = `SINCE ${result.startDate.toLocaleDateString().toUpperCase()}`;
    
    // Update motivational message
    updateMessage(result.days);
}

// Update motivational message based on days
function updateMessage(days) {
    let message = "KEEP GOING STRONG! YOU'RE DOING AMAZING! 💫";
    
    // Find the closest message for the current day count
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
            selectedReason = this.dataset.reason;
        });
        
        reasonsContainer.appendChild(reasonDiv);
    });
}

// Setup modal event listeners
function setupModalListeners() {
    // Close modal when clicking X
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Skip button
// Populate crying reasons in modal
function populateReasons() {
    reasonsContainer.innerHTML = '';
    
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
}   // Scroll to top of reasons
    reasonsContainer.scrollTop = 0;
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    selectedReason = null;
}

// Reset counter with modal
function resetCounter() {
    openModal();
}

// Confirm reset and log reason
function confirmReset(reason) {
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Update the start date
    localStorage.setItem(STORAGE_KEY, timestamp);
    
    // Log the crying reason
    if (reason) {
        logCryingReason(reason, timestamp);
    }
    
    // Close modal
    closeModal();
    
    // Update counter
    updateCounter();
    
    // Animate the reset with glitch effect
    daysCounter.style.animation = 'glitch 0.5s';
    setTimeout(() => {
        daysCounter.style.animation = 'numberPulse 2s ease-in-out infinite';
    }, 500);
    
    // Flash effect on container
    const container = document.querySelector('.container');
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'containerFloat 3s ease-in-out infinite';
    }, 10);
    
    // Show confirmation
    if (reason) {
        showCustomAlert('😢 TEARS CONFIRMED & LOGGED! IT\'S OKAY, TOMORROW IS A NEW DAY! 💙');
    } else {
        showCustomAlert('😢 COUNTER RESET! IT\'S OKAY, TOMORROW IS A NEW DAY! 💙');
    }
}

// Log crying reason to server (stored privately on your server)
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
        
        // Also keep a local backup in localStorage for offline mode
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

// Export crying log to Excel (CSV format) - Only exports local backup
// Admin can download full data from server at /api/admin/download-csv
function exportToExcel() {
    const log = localStorage.getItem(CRYING_LOG_KEY);
    if (!log) {
        // If no local data, redirect to admin endpoint
        showCustomAlert('📊 ADMIN: DOWNLOAD FULL DATA FROM /api/admin/download-csv');
        return;
    }
    
    try {
        const data = JSON.parse(log);
        
        // Create CSV content
        let csvContent = "Date,Time,Reason\n";
        
        data.forEach(entry => {
            const date = new Date(entry.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            const reason = `"${entry.reason.replace(/"/g, '""')}"`;
            csvContent += `${dateStr},${timeStr},${reason}\n`;
        });
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `crying_log_local_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error('Error exporting to Excel:', e);
    }
}

// Reset counter (old function - now opens modal instead)
// Reset counter (old function - now opens modal instead)
function oldResetCounter() {
    // Create custom confirmation with styling
    const confirmed = confirm('⚠️ RESET COUNTER? ⚠️\n\nIT\'S OKAY - TOMORROW IS A NEW DAY! 💙');
    
    if (confirmed) {
        const now = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, now);
        updateCounter();
        
        // Animate the reset with glitch effect
        daysCounter.style.animation = 'glitch 0.5s';
        setTimeout(() => {
            daysCounter.style.animation = 'numberPulse 2s ease-in-out infinite';
        }, 500);
        
        // Flash effect on container
        const container = document.querySelector('.container');
        container.style.animation = 'none';
        setTimeout(() => {
            container.style.animation = 'containerFloat 3s ease-in-out infinite';
        }, 10);
    }
}

// Share progress with cyberpunk flair
function shareProgress() {
    const result = calculateDays();
    
    if (!result) {
        showCustomAlert('⚠️ START TRACKING FIRST! ⚠️');
        return;
    }
    
    const shareText = `🌸 I'VE GONE ${result.days} DAYS WITHOUT CRYING! 💪✨\n\n#DaysWithoutCrying #NeoPunkVibes`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'DAYS WITHOUT CRYING',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            if (err.name !== 'AbortError') {
                copyToClipboard(shareText);
            }
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(shareText);
    }
}

// Copy to clipboard with custom notification
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCustomAlert('✅ PROGRESS COPIED TO CLIPBOARD! 📋');
    }).catch(() => {
        showCustomAlert(text);
    });
}

// Custom alert function for neo punk theme
function showCustomAlert(message) {
    // Create temporary alert overlay
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--baby-pink) 0%, var(--hot-pink) 100%);
        border: 4px solid var(--neon-pink);
        padding: 30px 40px;
        color: white;
        font-family: 'Orbitron', monospace;
        font-size: 1.2rem;
        font-weight: 700;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 0 40px var(--neon-pink), 8px 8px 0 var(--dark-pink);
        animation: glitch 0.3s;
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
        background: rgba(0, 0, 0, 0.8);
// Event listeners
resetBtn.addEventListener('click', resetCounter);
    document.body.appendChild(overlay);
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.remove();
        overlay.remove();
    }, 2000);
}

// Event listeners
resetBtn.addEventListener('click', resetCounter);
shareBtn.addEventListener('click', shareProgress);

// Add hover sound effects (optional - visual feedback)
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
// Add keyboard shortcuts for neo punk experience
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset (open modal)
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey && !customReasonInput.classList.contains('active')) {
        resetCounter();
    }
    // Press 'Escape' to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});     shareProgress();
    }
    // Press 'Escape' to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    // Press 'E' to export crying log manually
    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
        exportToExcel();
        showCustomAlert('📊 CRYING LOG EXPORTED TO EXCEL! 📋');
    }
});
