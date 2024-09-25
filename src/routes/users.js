const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', async (req, res) => {
    let users = [];
    db.each("SELECT * FROM users", function (err, row) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar usuário');
        }
        users.push(row);
    }, () => {
        return res.status(200).json(users);
    });
});

router.put('/', async (req, res) => {
    const { id, rank } = req.body;
    db.run("UPDATE users SET rank = ? WHERE id = ?", [rank, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao atualizar usuário');
        }
        return res.status(200).send('Usuário atualizado com sucesso');
    });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao deletar usuário');
        }
        return res.status(200).send('Usuário deletado com sucesso');
    });
});

module.exports = router;