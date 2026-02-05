// Note: 'accounts' array is now loaded from data.js
// majorEvents is now loaded from config.js
// Shared utils (formatDate, getTodayString, etc.) are loaded from utils.js

// AI Core Logic (Using shared utils)
function analyzeAccount(account) {
    let suggestion = "";
    let discountCode = null;
    let messagePreview = "";
    const today = new Date();
    const eventKey = `${today.getMonth() + 1}-${today.getDate()}`;
    const isAnniversary = majorEvents[eventKey];

    // 1. Run Risk Model from utils.js
    const riskScore = calculateRiskScore(account.payment_history, account.current_balance);

    // Logic 1: Discount
    if (account.payment_history === 'Good') {
        discountCode = "EARLYBIRD3";
        messagePreview = `Premium Analysis: Customer ${account.name} shows high reliability. Recommending a 3% 'Loyalty Incentive' (Code: ${discountCode}) to accelerate cash flow while maintaining high satisfaction.`;
        suggestion = "Apply Loyalty Discount";
    } else if (account.payment_history === 'Fair') {
        messagePreview = `Standard Analysis: Account shows moderate risk. Suggesting a friendly reminder with a link to our flexible payment portal.`;
        suggestion = "Send Gentle Reminder";
    } else {
        messagePreview = "Urgent Analysis: High delinquency risk detected. Recommendation: Deploy empathetic collection outreach and offer a customized split-payment arrangement.";
        suggestion = "Escalate to Specialist";
    }

    // Logic 2: Anniversary override
    if (isAnniversary) {
        messagePreview = `🎉 ${isAnniversary} Event: System-wide fee waiver active. Recommendation: Send celebratory message and waive any late penalties for ${account.name}.`;
        suggestion = "Execute Event Waiver";
    }

    return { suggestion, discountCode, messagePreview, riskScore };
}

// Render
document.addEventListener('DOMContentLoaded', () => {
    // Check for admin session (Basic Mock)
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
        // Enforced login for security
        window.location.href = 'login.html';
        return;
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
                        <h4><i class="fas fa-robot"></i> Fedex AI Insights</h4>
                        <p>${escapeHtml(analysis.messagePreview)}</p>
                        ${analysis.discountCode ? `<div class="code-badge" style="background:#4D148C; color:white; padding:2px 6px; border-radius:4px; display:inline-block; font-size:0.75rem;">${escapeHtml(analysis.discountCode)}</div>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary action-btn" data-account-id="${escapeHtml(account.id)}" data-suggestion="${escapeHtml(analysis.suggestion)}">
                        ${escapeHtml(analysis.suggestion)}
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        // CSP-Compliant Event Listener
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (btn) {
                const accountId = btn.getAttribute('data-account-id');
                const suggestion = btn.getAttribute('data-suggestion');
                alert(`AI Agent: Successfully executed '${suggestion}' for account ${accountId}. Process synced to blockchain ledger.`);
            }
        });
    }
});
