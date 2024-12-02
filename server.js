
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');


const app = express();


app.use(bodyParser.json());


let expenses = [];

app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;
    
    if (!category || !amount || !date) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }
    
  
    const expense = { category, amount, date, id: expenses.length + 1 + (expenses[expenses.length - 1]?.id || 0) };
    expenses.push(expense);
    console.log(expenses); 
    res.status(201).json({ status: 'success', data: expense });
});


app.get('/expenses', (req, res) => {
    res.json({ status: 'success', data: expenses });
});


app.put('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const { category, amount, date } = req.body;

    const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);

    if (expenseIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Expense not found' });
    }

    expenses[expenseIndex] = { id: expenseId, category, amount, date };
    res.status(200).json({ status: 'success', data: expenses[expenseIndex] });
});


app.delete('/expenses/:id', (req, res) => {
    const expenseId = parseInt(req.params.id);
    const expenseIndex = expenses.findIndex(exp => exp.id === expenseId);

    if (expenseIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Expense not found' });
    }

 
    expenses.splice(expenseIndex, 1);
    res.status(200).json({ status: 'success', message: 'Expense deleted' });
});

app.get('/', (req, res) => {
    res.send('Hello, Expense Tracker API!');
});

cron.schedule('* * * * *', () => {
    console.log('Cron job executed at:', new Date());
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get('/expenses/analysis', (req, res) => {
   
    let analysis = {};

   
    expenses.forEach(expense => {
        if (analysis[expense.category]) {
            analysis[expense.category] += expense.amount;
        } else {
            analysis[expense.category] = expense.amount;
        }
    });

    res.json({
        status: 'success',
        data: analysis
    });
});
