// Shared Utility Functions

/**
 * Formats a date string into a readable format.
 * @param {string} date - Date string
 * @returns {string} - Formatted date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

/**
 * Returns today's date as a long string.
 * @returns {string} - Formatted today's date
 */
function getTodayString() {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

/**
 * Calculates a risk score (0-100) based on payment history and balance.
 * Consistent with backend logic.
 * @param {string} history - 'Good', 'Fair', or 'Poor'
 * @param {number} balance - Current balance
 * @returns {number} - Risk score
 */
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

/**
 * Returns the color code for a given risk score.
 * @param {number} score - Risk score (0-100)
 * @returns {string} - HEX color
 */
function getRiskColor(score) {
    if (score < 30) return '#00cc66'; // Low Risk (Green)
    if (score < 70) return '#FF6600'; // Med Risk (Orange)
    return '#cc3300';                 // High Risk (Red)
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text - Raw text
 * @returns {string} - Escaped HTML
 */
function escapeHtml(text) {
    if (text == null) return text;
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
