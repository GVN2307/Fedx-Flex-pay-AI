// AI Logic Constants
const AI_Persona_Prefix = "[Flex-Pay AI]";

/**
 * Premium AI Analysis Engine
 * Calculates risk vectors and generates empathetic billing strategies.
 */
function analyzeAccount(account) {
    const riskScore = calculateRiskScore(account.payment_history, account.current_balance);
    let suggestion = "";
    let discountCode = null;
    let messagePreview = "";

    const today = new Date();
    const eventKey = `${today.getMonth() + 1}-${today.getDate()}`;
    const isAnniversary = typeof majorEvents !== 'undefined' ? majorEvents[eventKey] : null;

    if (account.payment_history === 'Good') {
        discountCode = "FLEX-PREMIUM-5";
        messagePreview = `Strategic Insight: Your stellar payment history has unlocked a 5% optimization credit. Apply ${discountCode} to maximize your liquidity today.`;
        suggestion = "Apply 5% Credit";
    } else if (account.payment_history === 'Fair') {
        messagePreview = `Operational Alert: We've detected minor friction in your payment cycle. Initiating a 'Soft-Landing' resolution to maintain your standing.`;
        suggestion = "Schedule Resolution";
    } else {
        messagePreview = `Critical Priority: Account stability is below threshold. Our AI recommends shifting to a 'Resilience-Focused' flexible payment architecture.`;
        suggestion = "Initiate Recovery Plan";
    }

    if (isAnniversary) {
        messagePreview = `✨ [System Anniversary Sync] ${isAnniversary} detected. Deploying a specialized 'Loyalty Waiver' for your account today.`;
        suggestion = "Claim Event Waiver";
    }

    return { suggestion, discountCode, messagePreview, riskScore };
}

// Render Main Dashboard or Accounts Table
document.addEventListener('DOMContentLoaded', () => {
    // Check for admin session
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Set Common Elements
    if (document.getElementById('currentDate')) {
        document.getElementById('currentDate').textContent = getTodayString();
    }

    const grid = document.getElementById('accountGrid');
    const tableBody = document.getElementById('accountsTableBody');

    // Dashboard Grid Rendering
    if (grid && typeof accounts !== 'undefined') {
        const priorityAccounts = accounts.filter(acc => acc.current_balance > 0).slice(0, 6);
        priorityAccounts.forEach(account => {
            const card = createAccountCard(account);
            grid.appendChild(card);
        });
    }

    // Accounts Page Table Rendering
    if (tableBody && typeof accounts !== 'undefined') {
        renderAccountsTable(accounts);

        // Search and Filter Listeners
        const searchInput = document.getElementById('accountSearch');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput && statusFilter) {
            const updateView = () => {
                const query = searchInput.value.toLowerCase();
                const status = statusFilter.value;

                const filtered = accounts.filter(acc => {
                    const matchesSearch = acc.name.toLowerCase().includes(query) || acc.id.toLowerCase().includes(query);
                    const matchesStatus = status === 'all' || acc.payment_history.toLowerCase() === status;
                    return matchesSearch && matchesStatus;
                });

                renderAccountsTable(filtered);
            };

            searchInput.addEventListener('input', updateView);
            statusFilter.addEventListener('change', updateView);
        }
    }

    // Global Event Listener for Action Buttons (CSP Compliant)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (btn) {
            const accountId = btn.getAttribute('data-account-id');
            const suggestion = btn.getAttribute('data-suggestion');
            alert(`${AI_Persona_Prefix} Successfully deployed '${suggestion}' for account ${accountId}. Transaction record updated in secure ledger.`);
        }
    });
});

function createAccountCard(account) {
    const analysis = analyzeAccount(account);
    const historyClass = escapeHtml(account.payment_history.toLowerCase());
    const card = document.createElement('div');
    card.className = `account-card ${historyClass}`;

    card.innerHTML = `
        <div class="card-header">
            <h3>${escapeHtml(account.name)} <span style="font-size:0.75rem; color:#888;">#${escapeHtml(account.id)}</span></h3>
            <span class="badge ${historyClass}">${escapeHtml(account.payment_history)} History</span>
        </div>
        <div class="card-body">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; background:rgba(0,0,0,0.02); padding:10px; border-radius:8px;">
                <span style="font-size:0.8rem; font-weight:700; color:var(--text-light); text-transform:uppercase;">AI Risk Vector</span>
                <div style="display:flex; align-items:center;">
                    <div style="width:80px; height:6px; background:#e2e8f0; border-radius:10px; margin-right:8px; overflow:hidden;">
                        <div style="width:${analysis.riskScore}%; height:100%; background:${getRiskColor(analysis.riskScore)};"></div>
                    </div>
                    <span style="font-weight:800; color:${getRiskColor(analysis.riskScore)}; font-size:0.85rem;">${analysis.riskScore}/100</span>
                </div>
            </div>

            <div class="detail-row">
                <span class="detail-label">Exposure:</span>
                <span class="detail-value">$${account.current_balance.toFixed(2)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Resolution Phase:</span>
                <span class="detail-value">${escapeHtml(formatDate(account.due_date))}</span>
            </div>

            <div class="ai-suggestion">
                <h4><i class="fas fa-brain"></i> Insight</h4>
                <p>${escapeHtml(analysis.messagePreview)}</p>
                ${analysis.discountCode ? `<div class="code-badge" style="background:var(--fedex-purple); color:white; padding:4px 8px; border-radius:100px; display:inline-block; font-size:0.7rem; font-weight:700;">${escapeHtml(analysis.discountCode)}</div>` : ''}
            </div>
        </div>
        <div class="card-actions">
            <button class="btn btn-primary action-btn" data-account-id="${escapeHtml(account.id)}" data-suggestion="${escapeHtml(analysis.suggestion)}">
                ${escapeHtml(analysis.suggestion)}
            </button>
        </div>
    `;
    return card;
}

function renderAccountsTable(data) {
    const tableBody = document.getElementById('accountsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = "";
    data.forEach(account => {
        const analysis = analyzeAccount(account);
        const historyClass = escapeHtml(account.payment_history.toLowerCase());
        const row = document.createElement('tr');

        row.innerHTML = `
            <td style="font-weight:700;">${escapeHtml(account.name)}</td>
            <td><code>${escapeHtml(account.id)}</code></td>
            <td><span class="badge ${historyClass}">${escapeHtml(account.payment_history)}</span></td>
            <td style="font-weight:600;">$${account.current_balance.toFixed(2)}</td>
            <td>${escapeHtml(formatDate(account.due_date))}</td>
            <td style="font-style:italic; font-size:0.85rem; color:var(--text-light); max-width:250px;">${escapeHtml(analysis.suggestion)}</td>
            <td>
                <button class="btn btn-primary action-btn" style="padding: 6px 12px; font-size: 0.75rem;" data-account-id="${escapeHtml(account.id)}" data-suggestion="${escapeHtml(analysis.suggestion)}">
                    Apply AI Advice
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
