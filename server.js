// Import the required modules
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');


// Initialize the Express app
const app = express();

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Sample in-memory storage for expenses
let expenses = [];

// 1. Add a new expense (POST /expenses)
// 1. Add a new expense (POST /expenses)
app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;
    
    if (!category || !amount || !date) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }
    
    // Fixing the ID issue: Increment the ID correctly
    const expense = { category, amount, date, id: expenses.length + 1 + (expenses[expenses.length - 1]?.id || 0) };
    expenses.push(expense);
    console.log(expenses); 
    res.status(201).json({ status: 'success', data: expense });
});


// 2. Get all expenses (GET /expenses)
app.get('/expenses', (req, res) => {
    res.json({ status: 'success', data: expenses });
});

// 3. Update an expense (PUT /expenses/:id)
app.put('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const { category, amount, date } = req.body;

    const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);

    if (expenseIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Expense not found' });
    }

    // Update the expense
    expenses[expenseIndex] = { id: expenseId, category, amount, date };
    res.status(200).json({ status: 'success', data: expenses[expenseIndex] });
});

// 4. Delete an expense (DELETE /expenses/:id)
app.delete('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);

    if (expenseIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Expense not found' });
    }

    // Delete the expense
    expenses.splice(expenseIndex, 1);
    res.status(200).json({ status: 'success', message: 'Expense deleted' });
});

// Sample route to check if server is working
app.get('/', (req, res) => {
    res.send('Hello, Expense Tracker API!');
});
// cron.schedule('0 0 * * *', () => {
//     let dailySummary = expenses.reduce((summary, expense) => {
//         // Group expenses by date and calculate total spending for that date
//         let date = expense.date;
//         if (!summary[date]) {
//             summary[date] = 0;
//         }
//         summary[date] += expense.amount;
//         return summary;
//     }, {});

//     console.log('Daily Summary:', dailySummary);
// });
// Import the cron module


// Schedule a job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Cron job executed at:', new Date());
});


// Set the server to listen on a port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// app.get('/expenses/analysis', (req, res) => {
//     let analysis = {};

//     // Loop through expenses to group by category
//     expenses.forEach(expense => {
//         if (analysis[expense.category]) {
//             analysis[expense.category] += expense.amount;
//         } else {
//             analysis[expense.category] = expense.amount;
//         }
//     });

//     res.json({
//         status: 'success',
//         data: analysis
//     });
// });

// 3. Analyze Spending (GET /expenses/analysis)
app.get('/expenses/analysis', (req, res) => {
    // Initialize an empty object to store the analysis by category
    let analysis = {};

    // Loop through all expenses and group them by category, summing the amounts
    expenses.forEach(expense => {
        if (analysis[expense.category]) {
            analysis[expense.category] += expense.amount;
        } else {
            analysis[expense.category] = expense.amount;
        }
    });

    // Send the analysis result back as a JSON response
    res.json({
        status: 'success',
        data: analysis
    });
});
