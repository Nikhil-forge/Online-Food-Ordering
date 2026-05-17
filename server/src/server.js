import app from './app.js';

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Food nutrition API running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${port} is already in use by another process!`);
    console.error(`👉 This usually means the server is already running in another terminal tab or VS Code window.`);
    console.error(`👉 Please close the other terminal or run "npx kill-port ${port}" to free it up.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});


