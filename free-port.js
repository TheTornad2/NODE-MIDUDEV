const { rejects } = require('node:assert');
const { error } = require('node:console');
const { create } = require('node:domain');
const net = require('node:net');
const { resolve } = require('node:path');

function findAvailablePort(desiredPort) {
  return new promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(desiredPort, () => {
      const { port } = server.address();

      server.close(() => {
        resolve(port);
      });
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        findAvailablePort(desiredPort + 1).then((port) => resolve(port));
      } else {
        reject(error);
      }
    });
  });
}

module.exports = { findAvailablePort };
