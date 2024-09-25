const express = require('express');
const usersRoutes = require('./src/routes/users.js');
const authRoutes = require('./src/routes/auth.js');
const accountsRoutes = require('./src/routes/accounts.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/accounts', accountsRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});