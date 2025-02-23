// Just a test server for development, not used by Vercel hosting
const { createServer } = require('http');
const portfinder = require('portfinder');

const DEFAULT_PORT = 3036;

// Ensure the test server is set up to use the correct controller
const controller = process.env.API || 'dom-simple';

const server = createServer(require(`../api/${controller}`));

portfinder.basePort = DEFAULT_PORT;
portfinder.getPort((err, port) => {
  if (err) {
    console.error('Error finding available port:', err);
    return;
  }
  server.listen(port, () => {
    console.log(`scraping-service:${controller} running on http://localhost:${port}, NODE_ENV: ${process.env.NODE_ENV}`);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
