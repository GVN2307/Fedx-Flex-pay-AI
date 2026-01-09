// Note: 'accounts' array is now loaded from data.js

// Configuration
const majorEvents = {
    "4-17": "Founders Day",
    "12-25": "Holiday Season"
};

// Utils
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function getTodayString() {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

// AI Core Logic (Frontend Version)
function calculateRiskScore(history, balance) {
    let score = 50;

    // History Factor
    if (history === 'Good') score -= 30;
    else if (history === 'Fair') score += 10;
    else if (history === 'Poor') score += 40;

    // Balance Factor
    if (balance > 1000) score += 20;
    else if (balance > 500) score += 10;

    return Math.max(0, Math.min(100, score));
}

function getRiskColor(score) {
    if (score < 30) return '#00cc66'; // Low Risk (Green)
    if (score < 70) return '#FF6600'; // Med Risk (Orange)
    return '#cc3300';                 // High Risk (Red)
}

function analyzeAccount(account) {
    let suggestion = "";
    let discountCode = null;
    let messagePreview = "";
    const today = new Date();
    const eventKey = `${today.getMonth() + 1}-${today.getDate()}`;
    const isAnniversary = majorEvents[eventKey];

    // 1. Run Risk Model
    const riskScore = calculateRiskScore(account.payment_history, account.current_balance);

    // Logic 1: Discount
    if (account.payment_history === 'Good') {
        discountCode = "EARLYBIRD3";
        messagePreview = `Offer 3% discount (Code: ${discountCode}) for early payment.`;
        suggestion = "Apply Incentive";
    } else {
        messagePreview = "Send standard empathetic payment reminder.";
        suggestion = "Send Reminder";
    }

    // Logic 2: Anniversary override
    if (isAnniversary) {
        messagePreview = `Happy ${isAnniversary}! Waive late fees as a gesture of goodwill.`;
        suggestion = "Waive Fees";
    }

    return { suggestion, discountCode, messagePreview, riskScore };
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (text == null) return text;
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Render
document.addEventListener('DOMContentLoaded', () => {
    // Check for admin session (Basic Mock)
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
        // Uncomment to enforce login
        // window.location.href = 'login.html'; 
    }

    // Set Date
    if (document.getElementById('currentDate')) {
        document.getElementById('currentDate').textContent = getTodayString();
    }

    const grid = document.getElementById('accountGrid');

    if (grid && typeof accounts !== 'undefined') {
        accounts.forEach(account => {
            const analysis = analyzeAccount(account);
            const historyClass = escapeHtml(account.payment_history.toLowerCase());

            const card = document.createElement('div');
            card.className = `account-card ${historyClass}`;

            card.innerHTML = `
                <div class="card-header">
                    <h3>${escapeHtml(account.name)} <span style="font-size:0.8rem; color:#888;">#${escapeHtml(account.id)}</span></h3>
                    <span class="badge ${historyClass}">${escapeHtml(account.payment_history)} History</span>
                </div>
                <div class="card-body">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; background:#f9f9f9; padding:8px; border-radius:6px;">
                        <span style="font-size:0.85rem; font-weight:600; color:#555;">AI Risk Score</span>
                        <div style="display:flex; align-items:center;">
                            <div style="width:100px; height:8px; background:#eee; border-radius:4px; margin-right:8px; overflow:hidden;">
                                <div style="width:${analysis.riskScore}%; height:100%; background:${getRiskColor(analysis.riskScore)};"></div>
                            </div>
                            <span style="font-weight:700; color:${getRiskColor(analysis.riskScore)}; font-size:0.9rem;">${analysis.riskScore}/100</span>
                        </div>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Balance Due:</span>
                        <span class="detail-value">$${account.current_balance.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Due Date:</span>
                        <span class="detail-value">${escapeHtml(formatDate(account.due_date))}</span>
                    </div>

                    <div class="ai-suggestion">
                        <h4><i class="fas fa-magic"></i> AI Recommendation</h4>
                        <p>${escapeHtml(analysis.messagePreview)}</p>
                        ${analysis.discountCode ? `<div class="code-badge" style="background:#4D148C; color:white; padding:2px 6px; border-radius:4px; display:inline-block; font-size:0.75rem;">${escapeHtml(analysis.discountCode)}</div>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="alert('Action Sent for ${escapeHtml(account.id)}')">
                        ${escapeHtml(analysis.suggestion)}
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });
    }
});
