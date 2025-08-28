const monthlyData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    income: [3500, 3500, 4200, 3800, 4000, 4500, 4200, 4800, 4300, 4600, 4400, 5000],
    expenses: [2800, 2600, 3100, 2900, 3200, 3400, 3100, 3600, 3300, 3500, 3400, 3800]
};

const categoryData = {
    labels: ['Alimentos', 'Vivienda', 'Transporte', 'Entretenimiento', 'Salud', 'Educación'],
    data: [800, 1200, 400, 300, 500, 600],
    colors: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)'
    ]
};

const calculateTotals = () => {
    const currentMonth = new Date().getMonth();
    return {
        monthlyIncome: monthlyData.income[currentMonth],
        monthlyExpenses: monthlyData.expenses[currentMonth],
        balance: monthlyData.income[currentMonth] - monthlyData.expenses[currentMonth],
        yearlyIncome: monthlyData.income.reduce((a, b) => a + b, 0),
        yearlyExpenses: monthlyData.expenses.reduce((a, b) => a + b, 0),
        yearlyBalance: monthlyData.income.reduce((a, b) => a + b, 0) - monthlyData.expenses.reduce((a, b) => a + b, 0)
    };
};

module.exports = {
    monthlyData,
    categoryData,
    calculateTotals
};