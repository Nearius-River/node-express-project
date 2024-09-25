require('dotenv').config()
const express = require('express');
const db = require('../db/database.js');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { SECRET } = process.env;

function checkToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Sem Acesso: Token não providenciado');
    }

    const authReader = req.headers['authorization'];
    const token = authReader.split(' ')[1];

    try {
        jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(401).send('Sem Acesso: Token inválido');
    }
}

router.get('/user/:id', checkToken, (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao obter dados do usuário.');
        }

        if (!row) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const { name, email } = row;
        return res.status(200).json({ name, email });
    });
});

module.exports = router;