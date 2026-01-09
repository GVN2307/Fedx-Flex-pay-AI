// Configuration (Duplicated from script.js or shared if we made a config.js)
const majorEvents = {
    "4-17": "Founders Day",
    "12-25": "Holiday Season"
};

// Utils (Duplicated - in a real app would be shared)
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function getTodayString() {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

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
        messagePreview = `Great news! Because of your excellent history, you are eligible for a 3% discount (Code: ${discountCode}) if you pay now.`;
        suggestion = "Pay Now & Save";
    } else {
        messagePreview = "We noticed an outstanding balance. Please update your payment method or contact us for a flexible plan.";
        suggestion = "Update Payment";
    }

    if (isAnniversary) {
        messagePreview = `Happy ${isAnniversary}! As a gift, we are waiving any potential late fees today.`;
        suggestion = "View Account Status";
    }

    return { suggestion, discountCode, messagePreview };
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

document.addEventListener('DOMContentLoaded', () => {
    // Session Check
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('user');

    // In a real app we'd redirect if role !== 'user'. For demo, just check ID.
    if (!userId) {
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

    // Set Header - TextContent is safe from XSS
    document.getElementById('welcomeMsg').textContent = `Welcome, ${account.name}`;
    document.getElementById('currentDate').textContent = getTodayString();

    const analysis = analyzeAccount(account);
    const area = document.getElementById('memberCardArea');

    const historyClass = escapeHtml(account.payment_history.toLowerCase());

    area.innerHTML = `
        <div class="account-card ${historyClass}" style="background:white; padding:2rem; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); border-left: 5px solid ${historyClass === 'good' ? '#00cc66' : (historyClass === 'fair' ? '#FF6600' : '#cc3300')}">
            <div style="margin-bottom:1.5rem; border-bottom:1px solid #eee; padding-bottom:1rem;">
                <h3 style="font-size:1.5rem; color:#333;">Current Billing Status</h3>
                <span class="badge ${historyClass}" style="margin-top:5px; display:inline-block; font-size:0.9rem;">${escapeHtml(account.payment_history)} Standing</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <span style="color:#666;">Account ID:</span>
                <strong>${escapeHtml(account.id)}</strong>
            </div>
             <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <span style="color:#666;">Balance Due:</span>
                <strong style="font-size:1.2rem;">$${account.current_balance.toFixed(2)}</strong>
            </div>
             <div style="display:flex; justify-content:space-between; margin-bottom:2rem;">
                <span style="color:#666;">Due Date:</span>
                <strong>${escapeHtml(formatDate(account.due_date))}</strong>
            </div>

            <div class="ai-suggestion" style="background:${historyClass === 'good' ? '#f0fff4' : '#fff9f0'}; padding:1.5rem; border-radius:8px; border:1px dashed ${historyClass === 'good' ? '#00cc66' : '#FF6600'};">
                <h4 style="color:${historyClass === 'good' ? '#00cc66' : '#FF6600'}; margin-bottom:10px;"><i class="fas fa-envelope-open-text"></i> Message for You</h4>
                <p style="line-height:1.5;">${escapeHtml(analysis.messagePreview)}</p>
            </div>

            <button class="btn btn-primary" style="width:100%; margin-top:1.5rem; padding:15px; font-size:1rem;" onclick="alert('Proceeding to payment gateway...')">
                ${escapeHtml(analysis.suggestion)}
            </button>
        </div>
    `;

});
