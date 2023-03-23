var Service = require('node-windows').Service;

var svc = new Service({
    name: 'ctrlMantenimiento',
    description: 'Control de mantenimientos sistemas',
    script: './src/index.js'
});

svc.on('install', function() {
    svc.start();
});

svc.install();