const express = require('express');
const router = express.Router();
const pool = require('../database');
const xl = require('excel4node');
const path = require('path');
const copia = require('../copiaDb');

router.get('/', async (req, res) => {
    const equipos = await pool.query('SELECT * FROM mequipos ORDER BY fecha DESC');
    if (equipos.length > 0 ) {
        equipos.forEach(element => {
            const f = new Date(element.fecha);
            element.fecha = f.toLocaleDateString();
        });  
    }
    res.render('mequip/all', { equipos, equip: "hola" });
});

router.get('/nuevo', (req, res) => {
    const f = new Date();
    const fecha = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);
    res.render('mequip/add', { fecha, equip: "hola" });
});

router.post('/add', async (req, res) => {
    const { area, responsable, fecha, falla_inconveniente, serie, marca, referencia, sistema_operativo, id_sistema_operativo, procesador, disco_duro, ram, office, id_office, licenciado, ip, observaciones } = req.body;
    let l;

    if (licenciado) {
        l = 'Si';
    } else {
        l = 'No';
    }

    const equipoNuevo = {
        area, responsable, falla_inconveniente,
        serie, marca, referencia,
        sistema_operativo, id_sistema_operativo,
        office, id_office,
        licenciado: l,
        procesador, disco_duro,
        ram, ip, observaciones, fecha
    };

    await pool.query('INSERT INTO mequipos SET ?', [equipoNuevo]);
    req.flash('success', 'Equipo guardado correctamente');

    await copia();

    res.redirect('/mantenimiento/equipos/');
});

router.get('/editar/:id', async (req, res) => {
    const  id = req.params.id;
    const equipo = await pool.query('SELECT * FROM mequipos WHERE id = ?', [id]);
    equipo[0].fecha = equipo[0].fecha.getFullYear() + '-' + ('0' + (equipo[0].fecha.getMonth() + 1)).slice(-2) + '-' + ('0' + equipo[0].fecha.getDate()).slice(-2);
    res.render('mequip/edit', {equipo: equipo[0], equip: "hola" });
});

router.post('/editar/:id', async (req, res) => {
    const id = req.params.id;
    const { area, responsable, fecha, falla_inconveniente, serie, marca, referencia, sistema_operativo, id_sistema_operativo, procesador, disco_duro, ram, office, id_office, licenciado, ip, observaciones } = req.body;
    let l;

    if (licenciado) {
        l = 'Si';
    } else {
        l = 'No';
    }

    const equipoNuevo = {
        area, responsable, falla_inconveniente,
        serie, marca, referencia,
        sistema_operativo, id_sistema_operativo,
        office, id_office,
        licenciado: l,
        procesador, disco_duro,
        ram, ip, observaciones, fecha
    };
    await pool.query('UPDATE mequipos SET ? WHERE id = ?', [equipoNuevo, id]);
    req.flash('success', 'Equipo modificado correctamente');
    
    await copia();

    res.redirect('/mantenimiento/equipos/');
});

router.get('/eliminar/:id', async (req, res) => {
    await pool.query('DELETE FROM mequipos WHERE id = ?', req.params.id);
    req.flash('success', 'Equipo eliminado correctamente');
    res.redirect('/mantenimiento/equipos/');
});

router.post('/buscar', async (req, res) => {
    const { valor, condicion } = req.body;
    const equipos = await pool.query('SELECT * FROM mequipos WHERE ' + condicion + ' LIKE ?', ["%"+valor+"%"]);if (equipos.length > 0 ) {
        equipos.forEach(element => {
            const f = new Date(element.fecha);
            element.fecha = f.toLocaleDateString();
        });  
    }
    res.render('mequip/all', { equipos, mante: "hola", equip: "hola" });
});

router.get('/exportar', async (req, res) => {
    const equipos = await pool.query('SELECT * FROM mequipos ORDER BY fecha ASC');
    var wb = new xl.Workbook();
    if (equipos.length > 0) {

        var ws = wb.addWorksheet('Mantenimiento Equipos');

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

        ws.cell(1, 1).string("FECHA").style(cabecera);
        ws.cell(1, 2).string("AREA").style(cabecera);
        ws.cell(1, 3).string("RESPONSABLE").style(cabecera);
        ws.cell(1, 4).string("FALLA / INCONVENIENTE").style(cabecera);
        ws.cell(1, 5).string("SERIE").style(cabecera);
        ws.cell(1, 6).string("MARCA").style(cabecera);
        ws.cell(1, 7).string("REFERENCIA").style(cabecera);
        ws.cell(1, 8).string("SISTEMA OPERATIVO").style(cabecera);
        ws.cell(1, 9).string("ID S.O.").style(cabecera);
        ws.cell(1, 10).string("LICENCIADO").style(cabecera);
        ws.cell(1, 11).string("PROCESADOR").style(cabecera);
        ws.cell(1, 12).string("DISCO DURO").style(cabecera);
        ws.cell(1, 13).string("RAM").style(cabecera);
        ws.cell(1, 14).string("OFFICE").style(cabecera);
        ws.cell(1, 15).string("ID OFFICE").style(cabecera);
        ws.cell(1, 16).string("LICENCIADO").style(cabecera);
        ws.cell(1, 17).string("IP").style(cabecera);
        ws.cell(1, 18).string("OBSERVACIONES").style(cabecera);

        let i = 2;

        equipos.forEach(element => {
            const f = new Date(element.fecha);

            ws.cell(i, 1).date(f).style({numberFormat:'d-mmm'});
            ws.cell(i, 2).string(element.area);
            ws.cell(i, 3).string(element.responsable);
            ws.cell(i, 4).string(element.falla_inconveniente);
            ws.cell(i, 5).string(element.serie);
            ws.cell(i, 6).string(element.marca);
            ws.cell(i, 7).string(element.referencia);
            ws.cell(i, 8).string(element.sistema_operativo);
            ws.cell(i, 9).string(element.id_sistema_operativo);
            ws.cell(i, 10).string(element.licenciado);
            ws.cell(i, 11).string(element.procesador);
            ws.cell(i, 12).string(element.disco_duro);
            ws.cell(i, 13).string(element.ram);
            ws.cell(i, 14).string(element.office);
            ws.cell(i, 15).string(element.id_office);
            ws.cell(i, 16).string(element.licenciado);
            ws.cell(i, 17).string(element.ip);
            ws.cell(i, 18).string(element.observaciones);

            i++;

        });
    
        await copia();    

        const pathtExcel = path.join(__dirname, 'Excel', 'MantenimientoEquipos.xlsx');

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
        res.redirect('/mantenimiento/equipos/');
    }

});

module.exports = router;