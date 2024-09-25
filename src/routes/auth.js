require('dotenv').config()
const express = require('express');
const db = require('../db/database.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const { SECRET } = process.env;

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Checks if email is already registered
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao verificar o email.');
        }

        if (row) {
            return res.status(400).send('Email já cadastrado.');
        } else {
            db.run("INSERT INTO users (name, email, password, rank) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, 0], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao registrar usuário.');
                }
                return res.status(201).send('Usuário registrado com sucesso.');
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao realizar login.');
        }

        const hashedPassword = row.password;

        if (bcrypt.compareSync(password, hashedPassword)) {
            const token = jwt.sign({ id, rank }, SECRET, { expiresIn: '1h'});
            return res.status(200).json({ message: 'Login realizado com sucesso.', token });
        } else {
            return res.status(401).send('Senha incorreta.');
        }
    });
});

module.exports = router;