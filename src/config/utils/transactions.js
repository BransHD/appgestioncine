const getLatestTransactions = () => {
  return [
    { date: '2023-12-15', type: 'Ingreso', description: 'Salario', amount: 4500 },
    { date: '2023-12-14', type: 'Gasto', description: 'Supermercado', amount: 150 },
    { date: '2023-12-13', type: 'Gasto', description: 'Gasolina', amount: 45 },
    { date: '2023-12-12', type: 'Ingreso', description: 'Freelance', amount: 500 },
    { date: '2023-12-11', type: 'Gasto', description: 'Internet', amount: 60 }
  ];
};

module.exports = {
  getLatestTransactions
};