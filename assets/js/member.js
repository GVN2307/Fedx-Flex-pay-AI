// majorEvents is now loaded from config.js
// Shared utils are loaded from utils.js

// Logic
function analyzeAccount(account) {
    let suggestion = "";
    let discountCode = null;
    let messagePreview = "";
    const today = new Date();
    const eventKey = `${today.getMonth() + 1}-${today.getDate()}`;
    const isAnniversary = majorEvents[eventKey];

    if (account.payment_history === 'Good') {
        discountCode = "EARLYBIRD3";
        messagePreview = `Hello ${account.name}! Our AI system has identified your account for a **Loyalty Advantage**. Because of your consistent 'Good' standing, you can unlock a 3% discount (Code: **${discountCode}**) by completing your payment today.`;
        suggestion = "Pay Now & Save 3%";
    } else if (account.payment_history === 'Fair') {
        messagePreview = `Greetings. We've detected an upcoming balance. To ensure uninterrupted service, we recommend clearing your balance or setting up an automated payment schedule today.`;
        suggestion = "Resolve Balance";
    } else {
        messagePreview = "Important Notification: Your account requires immediate attention. Our AI suggests setting up a flexible payment arrangement to bring your account back to good standing.";
        suggestion = "Setup Flexible Plan";
    }

    if (isAnniversary) {
        messagePreview = `✨ **Special Event: ${isAnniversary}** ✨ In celebration, FedEx is waiving all potential late fees for your account today. We appreciate your continued partnership.`;
        suggestion = "Claim Event Credit";
    }

    return { suggestion, discountCode, messagePreview };
}

document.addEventListener('DOMContentLoaded', () => {
    // Session Check
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('user');

    if (!userId || role !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    // Get Data
    const account = accounts.find(acc => acc.id === userId);

    if (!account) {
        alert("Account not found.");
        window.location.href = 'login.html';
        return;
    }

    // Set Header
    document.getElementById('welcomeMsg').textContent = `Welcome, ${account.name}`;
    document.getElementById('currentDate').textContent = getTodayString();

    const analysis = analyzeAccount(account);
    const area = document.getElementById('memberCardArea');

    const historyClass = escapeHtml(account.payment_history.toLowerCase());

    area.innerHTML = `
        <div class="account-card ${historyClass}">
            <div class="card-header">
                <h3>Current Billing Status</h3>
                <span class="badge ${historyClass}">${escapeHtml(account.payment_history)} Standing</span>
            </div>
            
            <div class="card-body">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; background:rgba(0,0,0,0.02); padding:1rem; border-radius:12px;">
                    <span style="font-size:0.85rem; font-weight:700; color:var(--text-light); text-transform:uppercase;">AI Stability Pulse</span>
                    <div style="display:flex; align-items:center;">
                        <div style="width:120px; height:8px; background:#e2e8f0; border-radius:10px; margin-right:12px; overflow:hidden;">
                            <div style="width:${analysis.riskScore || 0}%; height:100%; background:${getRiskColor(analysis.riskScore || 0)};"></div>
                        </div>
                        <span style="font-weight:800; color:${getRiskColor(analysis.riskScore || 0)}; font-size:1rem;">${analysis.riskScore || 0}%</span>
                    </div>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Exposure:</span>
                    <span class="detail-value" style="font-size:1.2rem;">$${account.current_balance.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Resolution Phase:</span>
                    <span class="detail-value">${escapeHtml(formatDate(account.due_date))}</span>
                </div>

                <div class="ai-suggestion" style="margin-top:2rem;">
                    <h4><i class="fas fa-envelope-open-text"></i> Personalized Insight</h4>
                    <p>${analysis.messagePreview}</p>
                </div>

                <button class="btn btn-primary action-btn" style="width:100%; margin-top:2rem; padding:18px;" data-suggestion="${escapeHtml(analysis.suggestion)}">
                    ${escapeHtml(analysis.suggestion)}
                </button>
            </div>
        </div>
    `;

    // CSP-Compliant Event Listener
    area.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (btn) {
            const suggestion = btn.getAttribute('data-suggestion');
            alert(`Redirecting to secure portal for: ${suggestion}...`);
        }
    });
});
