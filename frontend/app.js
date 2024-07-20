document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalSpending = document.getElementById('total-spending');
    const categoryChartCtx = document.getElementById('category-chart').getContext('2d');
    const timeChartCtx = document.getElementById('time-chart').getContext('2d');
    const navToggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const navExpenseTracker = document.getElementById('nav-expense-tracker');
    const navCharts = document.getElementById('nav-charts');
    const navRecurringExpenses = document.getElementById('nav-recurring-expenses');
    const navBudgeting = document.getElementById('nav-budgeting');
    const expenseSection = document.getElementById('expense-section');
    const chartsSection = document.getElementById('charts-section');
    const recurringExpensesSection = document.getElementById('recurring-expenses-section');
    const budgetingSection = document.getElementById('budgeting-section');
    const textElement = document.getElementById('typing-text');

    // Data
    let expenses = [];
    let totalExpenseAmount = 0;

    // Functions
    function showSection(section) {
        // Hide all sections
        [expenseSection, chartsSection, recurringExpensesSection, budgetingSection].forEach(sec => {
            sec.style.display = 'none';
        });
        // Show the selected section
        section.style.display = 'block';
    }

    function addExpense() {
        const date = document.getElementById('expense-date').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value;
        const currency = document.getElementById('expense-currency').value;

        if (!date || isNaN(amount) || !category) {
            alert('Please fill out all required fields.');
            return;
        }

        const expense = { date, amount, category, description, currency };
        expenses.push(expense);
        totalExpenseAmount += amount;

        updateExpenseList();
        updateTotalSpending();
        updateCharts();
    }

    function updateExpenseList() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.date} - ${expense.category}: ${expense.currency} ${expense.amount.toFixed(2)} - ${expense.description}`;
            expenseList.appendChild(li);
        });
    }

    function updateTotalSpending() {
        totalSpending.textContent = `${expenses[0]?.currency || '₹'} ${totalExpenseAmount.toFixed(2)}`;
    }

    function updateCharts() {
        const categoryData = {};
        const timeData = {};

        expenses.forEach(expense => {
            categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;

            const date = new Date(expense.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            timeData[monthYear] = (timeData[monthYear] || 0) + expense.amount;
        });

        const categoryLabels = Object.keys(categoryData);
        const categoryAmounts = Object.values(categoryData);
        const timeLabels = Object.keys(timeData);
        const timeAmounts = Object.values(timeData);

        new Chart(categoryChartCtx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryAmounts,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4CAF50'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

        new Chart(timeChartCtx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Spending Over Time',
                    data: timeAmounts,
                    fill: false,
                    borderColor: '#4BC0C0',
                    backgroundColor: '#4BC0C0',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount'
                        }
                    }
                }
            }
        });
    }

    function typeText() {
        const text = textElement.textContent;
        textElement.textContent = ''; // Clear initial text

        let index = 0;
        function type() {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50); // Adjust typing speed here
            }
        }
        type(); // Start typing effect
    }

    // Event Listeners
    navToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    navExpenseTracker.addEventListener('click', function() {
        showSection(expenseSection);
    });

    navCharts.addEventListener('click', function() {
        showSection(chartsSection);
    });

    navRecurringExpenses.addEventListener('click', function() {
        showSection(recurringExpensesSection);
    });

    navBudgeting.addEventListener('click', function() {
        showSection(budgetingSection);
    });

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addExpense();
    });

    typeText(); // Initialize typing effect
});
