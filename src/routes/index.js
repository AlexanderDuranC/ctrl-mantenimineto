const express = require('express');
const router = express.Router();
const copia = require('../copiaDb');


router.get('/', async (req, res) => {
    res.redirect('equipos/');
});


router.get('/copiaBd', async (req, res) => {
    await copia();
    req.flash('success', 'Copia realizada satisfactoriamente');
    res.redirect('equipos/');
});

module.exports = router;