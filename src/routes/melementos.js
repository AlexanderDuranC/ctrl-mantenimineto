const express = require('express');
const router = express.Router();
const pool = require('../database');
const xl = require('excel4node');
const path = require('path');
const copia = require('../copiaDb');

router.get('/', async (req, res) => {
    const elementos = await pool.query('SELECT * FROM melementos ORDER BY fecha DESC');
    if (elementos.length > 0 ) {
        elementos.forEach(element => {
            const f = new Date(element.fecha);
            element.fecha = f.toLocaleDateString();
        });  
    }
    res.render('melement/all', { elementos, mante: "hola" });
});

router.get('/nuevo', (req, res) => {
    const f = new Date();
    const fecha = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);
    res.render('melement/add', { fecha, mante: "hola" });
});

router.post('/add', async (req, res) => {
    const { area, responsable, fecha, tipo, serie, marca, referencia, observaciones } = req.body;
    const elementoNuevo = {
        area, responsable, fecha,
        tipo, serie, marca, referencia,
        observaciones
    };

    await pool.query("INSERT INTO melementos SET ?", [elementoNuevo]);
    req.flash('success', 'Elemento guardado correctamente');

    await copia();
    
    res.redirect('/mantenimiento/elementos/');
});

router.get('/editar/:id', async (req, res) => {
    const elementos = await pool.query('SELECT * FROM melementos WHERE id = ?', req.params.id);
    elementos[0].fecha = elementos[0].fecha.getFullYear() + '-' + ('0' + (elementos[0].fecha.getMonth() + 1)).slice(-2) + '-' + ('0' + elementos[0].fecha.getDate()).slice(-2);
    res.render('melement/edit', { elementos: elementos[0], mante: "hola" });
});

router.post('/editar/:id', async (req, res) => {
    const id = req.params.id;
    const { area, responsable, fecha, tipo, serie, marca, referencia, observaciones } = req.body;
    const elementoNuevo = {
        area, responsable, fecha,
        tipo, serie, marca, referencia,
        observaciones
    };
    await pool.query('UPDATE melementos SET ? WHERE id = ?', [elementoNuevo, id]);
    req.flash('success', 'Elemento modificado correctamente');
    
    await copia();

    res.redirect('/mantenimiento/elementos/');
});

router.get('/eliminar/:id', async (req, res) => {
    await pool.query('DELETE FROM melementos WHERE id = ?', req.params.id);
    req.flash('success', 'Elemento eliminado correctamente');
    res.redirect('/mantenimiento/elementos/');
});

router.post('/buscar', async (req, res) => {
    const { valor, condicion } = req.body;
    const elementos = await pool.query('SELECT * FROM melementos WHERE ' + condicion + ' LIKE ?', ["%"+valor+"%"]);
    if (elementos.length > 0 ) {
        elementos.forEach(element => {
            const f = new Date(element.fecha);
            element.fecha = f.toLocaleDateString();
        });  
    }
    res.render('melement/all', { elementos, mante: "hola"});
});

router.get('/exportar', async (req, res) => {
    const elementos = await pool.query('SELECT * FROM melementos ORDER BY fecha ASC');
    var wb = new xl.Workbook();
    if (elementos.length > 0 ) {

        var ws = wb.addWorksheet('Mantenimiento Elementos');

        var cabecera = wb.createStyle({
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            font: {
                color: '#000000',
                size: 12
            },fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '8DB4E2'
            }
        });

    ws.cell(1, 1).string("AREA").style(cabecera);
    ws.cell(1, 2).string("RESPONSABLE").style(cabecera);
    ws.cell(1, 3).string("FECHA").style(cabecera);
    ws.cell(1, 4).string("TIPO").style(cabecera);
    ws.cell(1, 5).string("OBSERVACONES").style(cabecera);
    ws.cell(1, 6).string("SERIE").style(cabecera);
    ws.cell(1, 7).string("MARCA").style(cabecera);
    ws.cell(1, 8).string("REFERENCIA").style(cabecera);

    let i = 2;

        elementos.forEach(element => {
            const f = new Date(element.fecha);
            
            ws.cell(i, 1).string(element.area);
            ws.cell(i, 2).string(element.responsable);
            ws.cell(i, 3).date(f).style({numberFormat:'d-mmm'});
            ws.cell(i, 4).string(element.tipo);
            ws.cell(i, 5).string(element.observaciones);
            ws.cell(i, 6).string(element.serie);
            ws.cell(i, 7).string(element.marca);
            ws.cell(i, 8).string(element.referencia);
            i++;
        });  
    
        await copia();    

        const pathtExcel = path.join(__dirname, 'Excel', 'MantenimientoElementos.xlsx');

        wb.write(pathtExcel, (err, stats) => {
            if (err) {
                console.error(err);
            } else {
                function downloadFile() {
                    res.download(pathtExcel);
                }
                downloadFile();
                return false;
            }
        });
    } else {
        req.flash('errors', '¡Oops! No hay nada en la base de datos.');
        res.redirect('/mantenimiento/elementos/');
    }

});

module.exports = router;