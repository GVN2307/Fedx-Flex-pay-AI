# FedEx Flex-Pay AI 🚚💸

**An Intelligent Billing Agent designed to optimize the "Cost to Collect" while increasing "Customer Lifetime Value".**


## 🚀 Overview

**FedEx Flex-Pay AI** transforms the traditional billing process from a transactional demand into a relationship-building opportunity. By leveraging a **Risk Scoring Model** and contextual signals (like anniversaries or payment history), specifically targeted at reducing churn and improving collection rates without human intervention.

### Key Value Proposition
- **📉 Reduce Cost to Collect**: Automated, empathetic AI agents handle low-to-mid risk accounts, saving agent time for critical cases.
- **📈 Increase CLV**: "Anniversary Forgiveness" and "Good Faith Discounts" turn friction points into loyalty moments.

---

## 🧠 The AI Model & Pipeline

The system operates on a 4-stage pipeline defined in [ARCHITECTURE.md](ARCHITECTURE.md).

1.  **Ingestion**: Parses `input_data.json` for account lifecycle data.
2.  **Risk Scoring (0-100)**:
    - **Low Risk (<30)**: Eligible for "Early Bird" discounts.
    - **High Risk (>70)**: Flagged for empathetic but firm reminders.
    - *Formula*: `Base(50) + HistoryFactor + BalanceFactor`
3.  **Decision Engine**: Selects the optimal retention strategy (Waiver vs. Discount vs. Reminder).
4.  **Presentation**: Delivers the tailored message via the Admin Dashboard or Member Portal.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.9+ (Logic, Risk Model, Text Generation)
- **Frontend**: HTML5, CSS3 (FedEx Brand Identity), Vanilla JS
- **Data**: JSON (No SQL DB required for this prototype)
- **Security**: XSS-Hardened Frontend, Input Validation

---

## 📂 Project Structure

```bash
├── assets/
│   ├── css/style.css       # FedEx Brand Styling
│   ├── js/script.js        # Admin Dashboard Logic (Risk Viz)
│   ├── js/member.js        # Member Portal Logic
│   ├── js/auth.js          # Mock Authentication
│   └── js/data.js          # Shared Account Data
├── backend/
│   ├── flex_pay.py         # Core Python AI Logic
│   ├── tests.py            # Unit Tests for Risk/Discounts
│   └── input_data.json     # Seed Data
├── index.html              # Admin Dashboard (Main View)
├── login.html              # Login Screen (Entry Point)
├── member.html             # Member Portal (User View)
└── ARCHITECTURE.md         # Detailed System Design
```

---

## 📥 Installation & Setup

To run this project locally, follow these simple steps:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/GVN2307/Fedx-Flex-pay-AI.git
    cd Fedx-Flex-pay-AI
    ```

2.  **No Dependencies Required**
    - The project uses standard Python (3.x) and vanilla HTML/JS. No `pip install` or `npm install` needed!

---

## 🚦 How to Run

### 1. Web Interface (Recommended)
Open `login.html` in any modern web browser.

**Logins:**
- **Manager View**:
    - Username: `admin`
    - Password: `admin`
    - *View*: Overall Business Impact, Risk Analysis of all accounts.
- **Member View**:
    - Username: `A001` (or `A002`, `A003`...)
    - Password: `password`
    - *View*: Personalized offer specific to that customer.

### 2. Backend Logic (CLI)
To test the Python message generation engine directly:

```bash
cd backend
python flex_pay.py
```

### 3. Run Tests
Verify the Risk Model and Discount Logic:

```bash
cd backend
python tests.py
```

---

## 🔒 Security

This application has been audited for:
- **XSS (Cross-Site Scripting)**: All user inputs and data rendering are sanitized using `escapeHtml()`.
- **Injection Attacks**: Data is handled via structured JSON parsing, mitigating SQLi risks.

---

## 📜 License

This project is a prototype developed for the FedEx Flex-Pay AI initiative.
