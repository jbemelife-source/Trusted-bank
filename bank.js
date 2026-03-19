// TrustBank - JavaScript Application

// ============================================
// DATA INITIALIZATION
// ============================================

// Initialize default data
const defaultUser = {
    name: "John Doe",
    username: "johndoe",
    accountNumber: "1234567890",
    pin: "1234",
    password: "password123"
};

const defaultAccounts = [
    {
        id: 1,
        type: "savings",
        name: "Savings Account",
        number: "1234567890",
        balance: 250000,
        currency: "NGN"
    },
    {
        id: 2,
        type: "current",
        name: "Current Account",
        number: "1234567891",
        balance: 150000,
        currency: "NGN"
    }
];

const defaultCards = [
    {
        id: 1,
        type: "debit",
        variant: "gold",
        number: "**** **** **** 4532",
        expiry: "12/27",
        cvv: "123",
        balance: 250000
    }
];

const defaultTransactions = [
    {
        id: 1,
        type: "debit",
        category: "transfer",
        description: "Transfer to John Smith",
        amount: 50000,
        accountNumber: "1234567890",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "completed"
    },
    {
        id: 2,
        type: "credit",
        category: "deposit",
        description: "Salary Deposit",
        amount: 150000,
        accountNumber: "1234567890",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "completed"
    },
    {
        id: 3,
        type: "debit",
        category: "bill",
        description: "Electricity Bill Payment",
        amount: 15000,
        accountNumber: "1234567890",
        date: new Date(Date.now() - 259200000).toISOString(),
        status: "completed"
    },
    {
        id: 4,
        type: "debit",
        category: "airtime",
        description: "MTN Airtime Purchase",
        amount: 2000,
        accountNumber: "1234567890",
        date: new Date(Date.now() - 345600000).toISOString(),
        status: "completed"
    },
    {
        id: 5,
        type: "credit",
        category: "transfer",
        description: "Transfer from Jane Doe",
        amount: 25000,
        accountNumber: "1234567890",
        date: new Date(Date.now() - 432000000).toISOString(),
        status: "completed"
    }
];

const defaultNotifications = [
    {
        id: 1,
        type: "success",
        title: "Transfer Successful",
        message: "Your transfer of ₦50,000 to John Smith was successful",
        time: new Date(Date.now() - 3600000).toISOString(),
        read: false
    },
    {
        id: 2,
        type: "info",
        title: "Bill Payment Reminder",
        message: "Your electricity bill is due in 3 days",
        time: new Date(Date.now() - 7200000).toISOString(),
        read: false
    },
    {
        id: 3,
        type: "warning",
        title: "Account Alert",
        message: "Suspicious activity detected on your account",
        time: new Date(Date.now() - 86400000).toISOString(),
        read: false
    }
];

// ============================================
// APP STATE
// ============================================

let appState = {
    isLoggedIn: false,
    user: null,
    accounts: [],
    cards: [],
    transactions: [],
    notifications: [],
    balanceVisible: true,
    currentPage: 'dashboard'
};

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

function loadAppData() {
    try {
        const userData = JSON.parse(localStorage.getItem('bankUser'));
        const accountsData = JSON.parse(localStorage.getItem('bankAccounts'));
        const cardsData = JSON.parse(localStorage.getItem('bankCards'));
        const transactionsData = JSON.parse(localStorage.getItem('bankTransactions'));
        const notificationsData = JSON.parse(localStorage.getItem('bankNotifications'));

        appState.user = userData || defaultUser;
        appState.accounts = accountsData || defaultAccounts;
        appState.cards = cardsData || defaultCards;
        appState.transactions = transactionsData || defaultTransactions;
        appState.notifications = notificationsData || defaultNotifications;

        // Save defaults if not exists
        if (!userData) localStorage.setItem('bankUser', JSON.stringify(defaultUser));
        if (!accountsData) localStorage.setItem('bankAccounts', JSON.stringify(defaultAccounts));
        if (!cardsData) localStorage.setItem('bankCards', JSON.stringify(defaultCards));
        if (!transactionsData) localStorage.setItem('bankTransactions', JSON.stringify(defaultTransactions));
        if (!notificationsData) localStorage.setItem('bankNotifications', JSON.stringify(defaultNotifications));
    } catch (e) {
        console.error('Error loading data:', e);
        appState.user = defaultUser;
        appState.accounts = defaultAccounts;
        appState.cards = defaultCards;
        appState.transactions = defaultTransactions;
        appState.notifications = defaultNotifications;
    }
}

function saveAppData() {
    localStorage.setItem('bankUser', JSON.stringify(appState.user));
    localStorage.setItem('bankAccounts', JSON.stringify(appState.accounts));
    localStorage.setItem('bankCards', JSON.stringify(appState.cards));
    localStorage.setItem('bankTransactions', JSON.stringify(appState.transactions));
    localStorage.setItem('bankNotifications', JSON.stringify(appState.notifications));
}

// ============================================
// AUTHENTICATION
// ============================================

function login(username, password) {
    if (username === appState.user.accountNumber || username === appState.user.username) {
        if (password === appState.user.password) {
            return { success: true, message: "Login successful" };
        }
        return { success: false, message: "Invalid password" };
    }
    return { success: false, message: "Invalid account number or username" };
}

function logout() {
    appState.isLoggedIn = false;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('bankingApp').classList.add('hidden');
    showToast('Logged out successfully');
}

function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = document.querySelector('.toggle-password i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showForgotPassword() {
    showToast('Please contact customer support to reset your password');
}

function showRegister() {
    showToast('Account registration is currently disabled. Please use demo credentials.');
}

// ============================================
// UI HELPERS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.classList.remove('hidden', 'success', 'error');
    toast.classList.add(type);
    toastMessage.textContent = message;

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function toggleBalance() {
    appState.balanceVisible = !appState.balanceVisible;
    const totalBalance = document.getElementById('totalBalance');
    const savingsBalance = document.getElementById('savingsBalance');
    const currentBalance = document.getElementById('currentBalance');
    const hiddenBalance = document.getElementById('hiddenBalance');
    const eyeIcon = document.getElementById('eyeIcon');

    if (appState.balanceVisible) {
        totalBalance.classList.remove('hidden');
        savingsBalance.classList.remove('hidden');
        currentBalance.classList.remove('hidden');
        hiddenBalance.classList.add('hidden');
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        totalBalance.classList.add('hidden');
        savingsBalance.classList.add('hidden');
        currentBalance.classList.add('hidden');
        hiddenBalance.classList.remove('hidden');
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        accounts: 'My Accounts',
        transfer: 'Transfer Money',
        bills: 'Bill Payments',
        airtime: 'Airtime & Data',
        cards: 'My Cards',
        loans: 'Loans',
        invest: 'Investments',
        history: 'Transaction History',
        settings: 'Settings'
    };

    document.getElementById('pageTitle').textContent = titles[pageName] || pageName;
    appState.currentPage = pageName;

    // Close sidebar on mobile
    if (window.innerWidth < 992) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

function showNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.toggle('hidden');
    panel.classList.toggle('show');
    renderNotifications();
}

function closeNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.add('hidden');
    panel.classList.remove('show');
}

function showProfileMenu() {
    showPage('settings');
}

// ============================================
// DASHBOARD RENDERING
// ============================================

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    document.getElementById('greeting').textContent = `${greeting}, ${appState.user.name.split(' ')[0]}`;
}

function updateUserInfo() {
    document.getElementById('userName').textContent = appState.user.name;
    document.getElementById('userAccount').textContent = appState.user.accountNumber;
    document.getElementById('userInitials').textContent = appState.user.name.split(' ').map(n => n[0]).join('');
}

function renderBalance() {
    const totalBalance = appState.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const savings = appState.accounts.find(a => a.type === 'savings');
    const current = appState.accounts.find(a => a.type === 'current');

    document.getElementById('totalBalance').textContent = `₦${totalBalance.toLocaleString()}`;
    document.getElementById('hiddenBalance').textContent = '••••••••';
    document.getElementById('savingsBalance').textContent = `₦${(savings?.balance || 0).toLocaleString()}`;
    document.getElementById('currentBalance').textContent = `₦${(current?.balance || 0).toLocaleString()}`;
}

function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const recentTransactions = appState.transactions.slice(0, 5);

    container.innerHTML = recentTransactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.type}">
                <i class="fas fa-${getTransactionIcon(t.category)}"></i>
            </div>
            <div class="transaction-info">
                <h4>${t.description}</h4>
                <p>${formatDate(t.date)}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount ${t.type}">${t.type === 'debit' ? '-' : '+'}₦${t.amount.toLocaleString()}</span>
                <span class="date">${formatTime(t.date)}</span>
            </div>
        </div>
    `).join('');
}

function renderAccountsList() {
    const container = document.getElementById('accountsList');

    container.innerHTML = appState.accounts.map(a => `
        <div class="account-card">
            <div class="account-icon">
                <i class="fas fa-${a.type === 'savings' ? 'piggy-bank' : 'wallet'}"></i>
            </div>
            <div class="account-details">
                <h4>${a.name}</h4>
                <p>${a.number}</p>
            </div>
            <div class="account-balance">
                <span class="balance">₦${a.balance.toLocaleString()}</span>
                <span class="number">Available</span>
            </div>
        </div>
    `).join('');
}

function renderFullAccountsList() {
    const container = document.getElementById('accountsGrid');

    container.innerHTML = appState.accounts.map(a => `
        <div class="account-card">
            <div class="account-icon">
                <i class="fas fa-${a.type === 'savings' ? 'piggy-bank' : a.type === 'fixed' ? 'certificate' : 'wallet'}"></i>
            </div>
            <div class="account-details">
                <h4>${a.name}</h4>
                <p>${a.number}</p>
            </div>
            <div class="account-balance">
                <span class="balance">₦${a.balance.toLocaleString()}</span>
                <span class="number">${a.currency}</span>
            </div>
        </div>
    `).join('');
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');

    container.innerHTML = appState.notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}">
            <div class="notification-icon ${n.type}">
                <i class="fas fa-${getNotificationIcon(n.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${n.title}</h4>
                <p>${n.message}</p>
                <span class="time">${getTimeAgo(n.time)}</span>
            </div>
        </div>
    `).join('');

    // Update badge
    const unreadCount = appState.notifications.filter(n => !n.read).length;
    document.getElementById('notifBadge').textContent = unreadCount;
    document.getElementById('notifBadge').style.display = unreadCount > 0 ? 'block' : 'none';
}

// ============================================
// TRANSFER FUNCTIONS
// ============================================

function populateTransferAccounts() {
    const fromSelect = document.getElementById('fromAccount');
    fromSelect.innerHTML = appState.accounts.map(a =>
        `<option value="${a.id}">${a.name} (₦${a.balance.toLocaleString()})</option>`
    ).join('');
}

function verifyBeneficiary() {
    const accountNumber = document.getElementById('beneficiaryAccount').value;

    if (accountNumber.length !== 10) {
        showToast('Please enter a valid 10-digit account number', 'error');
        return;
    }

    // Simulate beneficiary verification
    const beneficiaryNames = {
        '9876543210': 'Jane Smith',
        '5432109876': 'Mike Johnson',
        '1122334455': 'Sarah Williams'
    };

    const name = beneficiaryNames[accountNumber] || 'Unknown User';
    const bank = 'TrustBank';

    document.getElementById('beneficiaryName').textContent = name;
    document.getElementById('beneficiaryBank').textContent = bank;
    document.getElementById('beneficiaryInfo').classList.remove('hidden');
    showToast('Beneficiary verified successfully');
}

function handleTransfer(e) {
    e.preventDefault();

    const fromAccountId = parseInt(document.getElementById('fromAccount').value);
    const beneficiaryAccount = document.getElementById('beneficiaryAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const pin = document.getElementById('transferPin').value;
    const narration = document.getElementById('transferNarration').value;

    // Validation
    if (!beneficiaryAccount || beneficiaryAccount.length !== 10) {
        showToast('Please enter a valid account number', 'error');
        return;
    }

    if (!amount || amount < 100) {
        showToast('Minimum transfer amount is ₦100', 'error');
        return;
    }

    if (pin !== appState.user.pin) {
        showToast('Invalid transaction PIN', 'error');
        return;
    }

    const fromAccount = appState.accounts.find(a => a.id === fromAccountId);
    if (fromAccount.balance < amount) {
        showToast('Insufficient funds', 'error');
        return;
    }

    // Process transfer
    fromAccount.balance -= amount;

    const transaction = {
        id: Date.now(),
        type: 'debit',
        category: 'transfer',
        description: narration || `Transfer to ${beneficiaryAccount}`,
        amount: amount,
        accountNumber: beneficiaryAccount,
        date: new Date().toISOString(),
        status: 'completed'
    };

    appState.transactions.unshift(transaction);
    saveAppData();

    // Add notification
    appState.notifications.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Transfer Successful',
        message: `Your transfer of ₦${amount.toLocaleString()} was successful`,
        time: new Date().toISOString(),
        read: false
    });
    saveAppData();

    // Reset form
    document.getElementById('transferForm').reset();
    document.getElementById('beneficiaryInfo').classList.add('hidden');

    showToast('Transfer successful!');
    renderBalance();
    renderRecentTransactions();
    renderFullAccountsList();
    renderNotifications();
    updateTransferHistory();
}

function updateTransferHistory() {
    const container = document.getElementById('transferHistoryList');
    const transfers = appState.transactions.filter(t => t.category === 'transfer').slice(0, 5);

    container.innerHTML = transfers.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.type}">
                <i class="fas fa-exchange-alt"></i>
            </div>
            <div class="transaction-info">
                <h4>${t.description}</h4>
                <p>${formatDate(t.date)}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount ${t.type}">${t.type === 'debit' ? '-' : '+'}₦${t.amount.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// BILL PAYMENTS
// ============================================

function populateBillAccounts() {
    const select = document.getElementById('billAccount');
    select.innerHTML = appState.accounts.map(a =>
        `<option value="${a.id}">${a.name} (₦${a.balance.toLocaleString()})</option>`
    ).join('');
}

function showBillPayment(billType) {
    const modal = document.getElementById('billModal');
    const titles = {
        electricity: 'Pay Electricity Bill',
        water: 'Pay Water Bill',
        gas: 'Pay Gas Bill',
        dstv: 'Pay DSTV Subscription',
        gotv: 'Pay GOTV Subscription',
        startimes: 'Pay Startimes',
        internet: 'Pay Internet Bill',
        school: 'Pay School Fees',
        exam: 'Pay Exam Fees',
        car: 'Car Insurance',
        health: 'Health Insurance'
    };

    document.getElementById('billModalTitle').textContent = titles[billType] || 'Pay Bill';

    const meterLabels = {
        electricity: 'Meter Number',
        water: 'Meter Number',
        gas: 'Gas Meter Number',
        dstv: 'Smart Card Number',
        gotv: 'IUC Number',
        startimes: 'Smart Card Number',
        internet: 'Account Number',
        school: 'Student ID',
        exam: 'Exam Registration Number',
        car: 'Policy Number',
        health: 'Policy Number'
    };

    document.getElementById('meterLabel').textContent = meterLabels[billType] || 'Account Number';
    modal.classList.remove('hidden');
    populateBillAccounts();
}

function closeBillModal() {
    document.getElementById('billModal').classList.add('hidden');
    document.getElementById('billPaymentForm').reset();
}

function handleBillPayment(e) {
    e.preventDefault();

    const accountId = parseInt(document.getElementById('billAccount').value);
    const amount = parseFloat(document.getElementById('billAmount').value);
    const meterNumber = document.getElementById('meterNumber').value;
    const phone = document.getElementById('billPhone').value;

    if (!meterNumber) {
        showToast('Please enter required details', 'error');
        return;
    }

    if (!amount || amount < 100) {
        showToast('Minimum payment amount is ₦100', 'error');
        return;
    }

    const account = appState.accounts.find(a => a.id === accountId);
    if (account.balance < amount) {
        showToast('Insufficient funds', 'error');
        return;
    }

    // Process payment
    account.balance -= amount;

    const transaction = {
        id: Date.now(),
        type: 'debit',
        category: 'bill',
        description: `Bill Payment - ${meterNumber}`,
        amount: amount,
        accountNumber: meterNumber,
        date: new Date().toISOString(),
        status: 'completed'
    };

    appState.transactions.unshift(transaction);

    // Add notification
    appState.notifications.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Bill Payment Successful',
        message: `Your payment of ₦${amount.toLocaleString()} was successful`,
        time: new Date().toISOString(),
        read: false
    });

    saveAppData();
    closeBillModal();
    showToast('Payment successful!');
    renderBalance();
    renderRecentTransactions();
    renderFullAccountsList();
    renderNotifications();
}

// ============================================
// AIRTIME & DATA
// ============================================

function switchAirtimeTab(tab) {
    const airtimeGroup = document.getElementById('airtimeAmountGroup');
    const dataGroup = document.getElementById('dataPlanGroup');
    const buttons = document.querySelectorAll('.airtime-tabs button');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'airtime') {
        airtimeGroup.classList.remove('hidden');
        dataGroup.classList.add('hidden');
    } else {
        airtimeGroup.classList.add('hidden');
        dataGroup.classList.remove('hidden');
    }
}

function populateAirtimeAccounts() {
    const select = document.getElementById('airtimeAccount');
    select.innerHTML = appState.accounts.map(a =>
        `<option value="${a.id}">${a.name} (₦${a.balance.toLocaleString()})</option>`
    ).join('');
}

function handleAirtimePurchase(e) {
    e.preventDefault();

    const accountId = parseInt(document.getElementById('airtimeAccount').value);
    const phone = document.getElementById('airtimePhone').value;
    const network = document.querySelector('input[name="network"]:checked').value;

    // Check if data or airtime
    const dataPlanGroup = document.getElementById('dataPlanGroup');
    let amount;

    if (dataPlanGroup.classList.contains('hidden')) {
        amount = parseFloat(document.getElementById('airtimeAmount').value);
    } else {
        amount = parseFloat(document.getElementById('dataPlan').value);
    }

    if (!phone || phone.length < 11) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }

    if (!amount || amount < 50) {
        showToast('Minimum amount is ₦50', 'error');
        return;
    }

    const account = appState.accounts.find(a => a.id === accountId);
    if (account.balance < amount) {
        showToast('Insufficient funds', 'error');
        return;
    }

    // Process purchase
    account.balance -= amount;

    const isData = !dataPlanGroup.classList.contains('hidden');
    const transaction = {
        id: Date.now(),
        type: 'debit',
        category: isData ? 'data' : 'airtime',
        description: `${network.toUpperCase()} ${isData ? 'Data' : 'Airtime'} - ${phone}`,
        amount: amount,
        accountNumber: phone,
        date: new Date().toISOString(),
        status: 'completed'
    };

    appState.transactions.unshift(transaction);

    // Add notification
    appState.notifications.unshift({
        id: Date.now(),
        type: 'success',
        title: isData ? 'Data Purchase Successful' : 'Airtime Purchase Successful',
        message: `Your ${isData ? 'data' : 'airtime'} purchase of ₦${amount.toLocaleString()} was successful`,
        time: new Date().toISOString(),
        read: false
    });

    saveAppData();
    document.getElementById('airtimeForm').reset();
    showToast('Purchase successful!');
    renderBalance();
    renderRecentTransactions();
    renderFullAccountsList();
    renderNotifications();
    updateAirtimeHistory();
}

function updateAirtimeHistory() {
    const container = document.getElementById('airtimeHistoryList');
    const purchases = appState.transactions.filter(t => t.category === 'airtime' || t.category === 'data').slice(0, 5);

    container.innerHTML = purchases.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon debit">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="transaction-info">
                <h4>${t.description}</h4>
                <p>${formatDate(t.date)}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount debit">-₦${t.amount.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// CARDS MANAGEMENT
// ============================================

function renderCards() {
    const container = document.getElementById('cardsGrid');

    container.innerHTML = appState.cards.map(c => `
        <div class="debit-card">
            <div class="card-type">${c.variant.charAt(0).toUpperCase() + c.variant.slice(1)} ${c.type.charAt(0).toUpperCase() + c.type.slice(1)} Card</div>
            <div class="card-number">${c.number}</div>
            <div class="card-details">
                <div>
                    <span>Card Holder</span>
                    ${appState.user.name.toUpperCase()}
                </div>
                <div>
                    <span>Expires</span>
                    ${c.expiry}
                </div>
            </div>
        </div>
    `).join('');
}

function renderVirtualCards() {
    const container = document.getElementById('virtualCardsList');
    const virtualCards = appState.cards.filter(c => c.virtual);

    if (virtualCards.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 20px;">No virtual cards yet. Create one to get started!</p>';
        return;
    }

    container.innerHTML = virtualCards.map(c => `
        <div class="virtual-card">
            <div class="card-type">Virtual Card</div>
            <div class="card-number">${c.number}</div>
            <div class="card-details">
                <div>
                    <span>Expires</span>
                    ${c.expiry}
                </div>
            </div>
        </div>
    `).join('');
}

function showCardModal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('cardModal').classList.remove('hidden');
}

function createVirtualCard() {
    // Generate random card details
    const cardNumber = `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`;
    const expiryMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const expiryYear = String(2027 + Math.floor(Math.random() * 3));

    const newCard = {
        id: Date.now(),
        type: 'virtual',
        variant: 'virtual',
        number: cardNumber,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv: String(Math.floor(100 + Math.random() * 900)),
        balance: 0,
        virtual: true
    };

    appState.cards.push(newCard);
    saveAppData();
    renderCards();
    renderVirtualCards();
    showToast('Virtual card created successfully!');
}

function handleCardRequest(e) {
    e.preventDefault();

    const cardType = document.getElementById('cardType').value;
    const cardVariant = document.getElementById('cardVariant').value;
    const address = document.getElementById('deliveryAddress').value;

    // Generate new card
    const cardNumber = `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`;
    const expiryMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const expiryYear = String(2027 + Math.floor(Math.random() * 3));

    const newCard = {
        id: Date.now(),
        type: cardType,
        variant: cardVariant,
        number: cardNumber,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv: String(Math.floor(100 + Math.random() * 900)),
        balance: 0
    };

    appState.cards.push(newCard);
    saveAppData();

    closeModal('cardModal');
    renderCards();
    showToast('Card request submitted successfully! Your card will be delivered within 5-7 business days.');
}

// ============================================
// LOANS
// ============================================

function renderLoanSummary() {
    document.getElementById('activeLoansCount').textContent = '0';
    document.getElementById('totalOutstanding').textContent = '₦0.00';
    document.getElementById('nextPayment').textContent = '₦0.00';
    document.getElementById('creditScore').textContent = 'Excellent';
}

function applyLoan(loanType) {
    const titles = {
        quick: 'Quick Loan',
        home: 'Home Loan',
        education: 'Education Loan',
        car: 'Car Loan'
    };

    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('loanModal').classList.remove('hidden');
    document.querySelector('#loanModal .modal-header h3').textContent = `Apply for ${titles[loanType]}`;
}

function handleLoanApplication(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('loanAmount').value);
    const tenure = parseInt(document.getElementById('loanTenure').value);
    const purpose = document.getElementById('loanPurpose').value;

    if (!amount || amount < 10000) {
        showToast('Minimum loan amount is ₦10,000', 'error');
        return;
    }

    // Calculate interest (5% per month for quick, varies for others)
    const interestRate = 0.05;
    const interest = amount * interestRate * (tenure / 12);
    const totalRepayment = amount + interest;
    const monthlyPayment = totalRepayment / tenure;

    // Add notification
    appState.notifications.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Loan Application Received',
        message: `Your loan application of ₦${amount.toLocaleString()} is being processed. Monthly payment: ₦${monthlyPayment.toLocaleString()}`,
        time: new Date().toISOString(),
        read: false
    });

    saveAppData();
    closeModal('loanModal');
    showToast('Loan application submitted successfully! You will be notified once approved.');
    renderNotifications();
}

// ============================================
// INVESTMENTS
// ============================================

function renderInvestments() {
    document.getElementById('totalInvested').textContent = '₦0.00';
}

function invest(type) {
    const types = {
        savings: 'Savings Plus',
        fixed: 'Fixed Deposit',
        treasury: 'Treasury Bills',
        mutual: 'Mutual Funds'
    };

    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('investModal').classList.remove('hidden');
    document.getElementById('investType').value = type;
}

function handleInvestment(e) {
    e.preventDefault();

    const type = document.getElementById('investType').value;
    const amount = parseFloat(document.getElementById('investAmount').value);
    const tenure = parseInt(document.getElementById('investTenure').value);

    if (!amount || amount < 10000) {
        showToast('Minimum investment amount is ₦10,000', 'error');
        return;
    }

    // Calculate returns based on type
    const rates = {
        savings: 0.10,
        fixed: 0.12,
        treasury: 0.14,
        mutual: 0.18
    };

    const rate = rates[type];
    const returns = amount * rate * (tenure / 365);

    // Add notification
    appState.notifications.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Investment Confirmed',
        message: `Your ${tenure}-day investment of ₦${amount.toLocaleString()} has been confirmed. Expected returns: ₦${returns.toLocaleString()}`,
        time: new Date().toISOString(),
        read: false
    });

    saveAppData();
    closeModal('investModal');
    showToast('Investment successful! Track your returns in your dashboard.');
    renderNotifications();
}

// ============================================
// TRANSACTION HISTORY
// ============================================

function renderTransactionHistory() {
    const container = document.getElementById('transactionsFull');
    const filter = document.getElementById('historyFilter').value;

    let transactions = appState.transactions;

    if (filter !== 'all') {
        if (filter === 'debit') {
            transactions = transactions.filter(t => t.type === 'debit');
        } else if (filter === 'credit') {
            transactions = transactions.filter(t => t.type === 'credit');
        } else {
            transactions = transactions.filter(t => t.category === filter);
        }
    }

    container.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.type}">
                <i class="fas fa-${getTransactionIcon(t.category)}"></i>
            </div>
            <div class="transaction-info">
                <h4>${t.description}</h4>
                <p>${t.category.charAt(0).toUpperCase() + t.category.slice(1)} • ${formatDate(t.date)}</p>
            </div>
            <div class="transaction-amount">
                <span class="amount ${t.type}">${t.type === 'debit' ? '-' : '+'}₦${t.amount.toLocaleString()}</span>
                <span class="date">${formatTime(t.date)}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// SETTINGS
// ============================================

function showChangePin() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('changePinModal').classList.remove('hidden');
}

function handleChangePin(e) {
    e.preventDefault();

    const currentPin = document.getElementById('currentPin').value;
    const newPin = document.getElementById('newPin').value;
    const confirmPin = document.getElementById('confirmNewPin').value;

    if (currentPin !== appState.user.pin) {
        showToast('Current PIN is incorrect', 'error');
        return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
        showToast('PIN must be 4 digits', 'error');
        return;
    }

    if (newPin !== confirmPin) {
        showToast('PINs do not match', 'error');
        return;
    }

    appState.user.pin = newPin;
    saveAppData();
    closeModal('changePinModal');
    showToast('PIN changed successfully!');
}

function showProfileSettings() {
    showToast('Profile editing coming soon!');
}

function showChangePassword() {
    showToast('Password change feature coming soon!');
}

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

function openAccountModal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('accountModal').classList.remove('hidden');
}

function handleOpenAccount(e) {
    e.preventDefault();

    const accountType = document.getElementById('newAccountType').value;
    const initialDeposit = parseFloat(document.getElementById('initialDeposit').value);

    if (!initialDeposit || initialDeposit < 1000) {
        showToast('Minimum deposit is ₦1,000', 'error');
        return;
    }

    // Generate new account number
    const newAccountNumber = String(1000000000 + Math.floor(Math.random() * 9000000000));

    const newAccount = {
        id: Date.now(),
        type: accountType,
        name: accountType.charAt(0).toUpperCase() + accountType.slice(1) + ' Account',
        number: newAccountNumber,
        balance: initialDeposit,
        currency: 'NGN'
    };

    appState.accounts.push(newAccount);
    saveAppData();

    closeModal('accountModal');
    renderAccountsList();
    renderFullAccountsList();
    renderBalance();
    showToast(`New ${newAccount.name} opened successfully! Account: ${newAccountNumber}`);
}

// ============================================
// MODAL HELPERS
// ============================================

function closeModal(modalId) {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById(modalId).classList.add('hidden');

    // Reset forms
    const forms = document.querySelectorAll(`#${modalId} form`);
    forms.forEach(form => form.reset());
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getTransactionIcon(category) {
    const icons = {
        transfer: 'exchange-alt',
        bill: 'file-invoice-dollar',
        airtime: 'mobile-alt',
        data: 'wifi',
        deposit: 'arrow-down',
        withdrawal: 'arrow-up',
        payment: 'credit-card'
    };
    return icons[category] || 'wallet';
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        error: 'times-circle'
    };
    return icons[type] || 'bell';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Load data from localStorage
    loadAppData();

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const result = login(username, password);

        if (result.success) {
            appState.isLoggedIn = true;
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('bankingApp').classList.remove('hidden');

            // Initialize dashboard
            updateGreeting();
            updateUserInfo();
            renderBalance();
            renderRecentTransactions();
            renderAccountsList();
            renderFullAccountsList();
            renderCards();
            renderVirtualCards();
            renderLoanSummary();
            renderInvestments();
            renderTransactionHistory();
            renderNotifications();
            populateTransferAccounts();
            populateBillAccounts();
            populateAirtimeAccounts();
            updateTransferHistory();
            updateAirtimeHistory();

            showToast('Welcome back, ' + appState.user.name + '!');
        } else {
            showToast(result.message, 'error');
        }
    });

    // Navigation handlers
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                showPage(page);
            }
        });
    });

    // Transfer form
    document.getElementById('transferForm').addEventListener('submit', handleTransfer);

    // Transfer type change
    document.getElementById('transferType').addEventListener('change', function () {
        const scheduledDate = document.getElementById('scheduledDate');
        if (this.value === 'scheduled') {
            scheduledDate.classList.remove('hidden');
        } else {
            scheduledDate.classList.add('hidden');
        }
    });

    // Bill payment form
    document.getElementById('billPaymentForm').addEventListener('submit', handleBillPayment);

    // Airtime form
    document.getElementById('airtimeForm').addEventListener('submit', handleAirtimePurchase);

    // Card request form
    document.getElementById('requestCardForm').addEventListener('submit', handleCardRequest);

    // Loan form
    document.getElementById('loanForm').addEventListener('submit', handleLoanApplication);

    // Invest form
    document.getElementById('investForm').addEventListener('submit', handleInvestment);

    // Change PIN form
    document.getElementById('changePinForm').addEventListener('submit', handleChangePin);

    // Open account form
    document.getElementById('openAccountForm').addEventListener('submit', handleOpenAccount);

    // History filter
    document.getElementById('historyFilter').addEventListener('change', renderTransactionHistory);

    // Modal overlay click to close
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.add('hidden');
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.style.setProperty('--dark', '#ffffff');
            document.documentElement.style.setProperty('--light', '#1a1a2e');
        } else {
            document.documentElement.style.setProperty('--dark', '#1a1a2e');
            document.documentElement.style.setProperty('--light', '#f5f7fa');
        }
    });

    // Account number formatting
    document.getElementById('beneficiaryAccount').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
        document.getElementById('beneficiaryInfo').classList.add('hidden');
    });

    // Phone number formatting
    document.getElementById('airtimePhone').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 11);
    });

    document.getElementById('billPhone').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 11);
    });
});

// Make closeBillModal accessible globally
window.closeBillModal = closeBillModal;

// ============================================
// MOBILE FEATURES
// ============================================

// Mobile Navigation Update
function updateMobileNavigation(pageName) {
    const navItems = document.querySelectorAll('.mobile-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// Show Mobile Menu
function showMobileMenu() {
    document.getElementById('mobileMenuModal').classList.remove('hidden');
}

// Close Mobile Menu
function closeMobileMenu() {
    document.getElementById('mobileMenuModal').classList.add('hidden');
}

// Show QR Payment
function showQRPayment() {
    document.getElementById('qrModal').classList.remove('hidden');
}

// Close QR Payment
function closeQRPayment() {
    document.getElementById('qrModal').classList.add('hidden');
}

// Share QR Code
function shareQRCode() {
    if (navigator.share) {
        navigator.share({
            title: 'TrustBank Account',
            text: 'Scan this QR code to send me money: 1234567890',
            url: window.location.href
        }).then(() => {
            showToast('Shared successfully!');
        }).catch(() => {
            showToast('Could not share');
        });
    } else {
        showToast('Share not supported on this device');
    }
}

// Open Scanner
function openScanner() {
    showToast('Camera scanner will open in mobile app');
}

// Show USSD Page
function showUSSDPage() {
    document.getElementById('ussdModal').classList.remove('hidden');
}

// Close USSD Page
function closeUSSDPage() {
    document.getElementById('ussdModal').classList.add('hidden');
}

// Show Branch Locator
function showBranchLocator() {
    document.getElementById('branchModal').classList.remove('hidden');
}

// Close Branch Locator
function closeBranchLocator() {
    document.getElementById('branchModal').classList.add('hidden');
}

// Enable Biometric
function enableBiometric() {
    if (window.localStorage) {
        localStorage.setItem('biometricEnabled', 'true');
    }
    closeBiometric();
    showToast('Biometric login enabled!');
}

// Close Biometric Modal
function closeBiometric() {
    document.getElementById('biometricModal').classList.add('hidden');
}

// Show Quick Actions (FAB)
function showQuickActions() {
    document.getElementById('quickActionsModal').classList.remove('hidden');
}

// Close Quick Actions
function closeQuickActions() {
    document.getElementById('quickActionsModal').classList.add('hidden');
}

// Install App
function installApp() {
    showToast('Installing TrustBank App...');
    // In a real PWA, this would trigger the beforeinstallprompt event
}

// Dismiss Install Banner
function dismissInstall() {
    document.getElementById('installBanner').classList.add('hidden');
    localStorage.setItem('installDismissed', 'true');
}

// PWA Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }
}

// Detect Mobile Device
function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Show Install Banner on Mobile
function checkInstallBanner() {
    if (isMobile() && !localStorage.getItem('installDismissed')) {
        setTimeout(() => {
            document.getElementById('installBanner').classList.remove('hidden');
        }, 5000);
    }
}

// Touch Gesture Support
function initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - open sidebar
                if (appState.isLoggedIn && window.innerWidth > 768) {
                    document.getElementById('sidebar').classList.add('show');
                }
            } else {
                // Swipe right - close sidebar
                if (appState.isLoggedIn) {
                    document.getElementById('sidebar').classList.remove('show');
                }
            }
        }
    }
}

// Pull to Refresh
function initPullToRefresh() {
    let pullStartY = 0;
    let pullEndY = 0;
    const pullThreshold = 100;

    document.addEventListener('touchstart', e => {
        if (window.scrollY === 0) {
            pullStartY = e.changedTouches[0].screenY;
        }
    });

    document.addEventListener('touchmove', e => {
        if (pullStartY > 0 && window.scrollY === 0) {
            pullEndY = e.changedTouches[0].screenY;
            const diff = pullEndY - pullStartY;

            if (diff > pullThreshold) {
                // Show refresh indicator
                document.querySelector('.pull-to-refresh')?.classList.add('show');
            }
        }
    });

    document.addEventListener('touchend', e => {
        if (pullEndY - pullStartY > pullThreshold) {
            // Perform refresh
            setTimeout(() => {
                document.querySelector('.pull-to-refresh')?.classList.remove('show');
                renderBalance();
                renderRecentTransactions();
                showToast('Refreshed!');
            }, 1000);
        }
        pullStartY = 0;
        pullEndY = 0;
    });
}

// Keyboard Shortcuts for Mobile
function initMobileShortcuts() {
    // Double tap to go home
    let lastTap = 0;
    document.addEventListener('touchend', e => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected - go to dashboard
            if (appState.isLoggedIn) {
                showPage('dashboard');
            }
        }
        lastTap = currentTime;
    });
}

// Biometric Login Check
function checkBiometricLogin() {
    if (localStorage.getItem('biometricEnabled') === 'true' && isMobile()) {
        // Show biometric prompt
        setTimeout(() => {
            document.getElementById('biometricModal').classList.remove('hidden');
        }, 1000);
    }
}

// Update page function to also update mobile nav
const originalShowPage = showPage;
showPage = function (pageName) {
    originalShowPage(pageName);
    updateMobileNavigation(pageName);
};

// Extended Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile features
    if (isMobile()) {
        initTouchGestures();
        initPullToRefresh();
        initMobileShortcuts();
        checkInstallBanner();
        checkBiometricLogin();

        // Show FAB button on mobile
        document.getElementById('fabButton').classList.remove('hidden');

        // Add mobile class to body
        document.body.classList.add('is-mobile');
    }

    // Register service worker for PWA
    registerServiceWorker();

    // Hide sidebar on mobile by default
    if (window.innerWidth < 992) {
        document.getElementById('sidebar').classList.remove('show');
    }

    // Update mobile nav when page loads
    if (appState.isLoggedIn) {
        updateMobileNavigation(appState.currentPage);
    }
});

// Handle window resize
window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) {
        document.getElementById('sidebar').classList.remove('show');
    }

    // Toggle mobile nav visibility
    if (isMobile()) {
        document.getElementById('mobileBottomNav').style.display = 'flex';
        document.getElementById('fabButton').classList.remove('hidden');
    } else {
        document.getElementById('mobileBottomNav').style.display = 'none';
        document.getElementById('fabButton').classList.add('hidden');
    }
});

// Make all mobile functions globally accessible
window.showMobileMenu = showMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.showQRPayment = showQRPayment;
window.closeQRPayment = closeQRPayment;
window.shareQRCode = shareQRCode;
window.openScanner = openScanner;
window.showUSSDPage = showUSSDPage;
window.closeUSSDPage = closeUSSDPage;
window.showBranchLocator = showBranchLocator;
window.closeBranchLocator = closeBranchLocator;
window.enableBiometric = enableBiometric;
window.closeBiometric = closeBiometric;
window.showQuickActions = showQuickActions;
window.closeQuickActions = closeQuickActions;
window.installApp = installApp;
window.dismissInstall = dismissInstall;
