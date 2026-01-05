const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/users.routes');

// ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
const logFile = path.join(logsDir, 'requests.txt');
if (!fs.existsSync(logsDir)) {
  try { fs.mkdirSync(logsDir); } catch (e) { console.error('Failed to create logs dir', e); }
}

// Logging Middleware (includes browser, device and IP detection)
app.use((req, res, next) => {
  const ua = req.get('User-Agent') || '';
  let browser = 'unknown';
  if (/Chrome/.test(ua) && !/Edg\/|OPR\/|Chromium/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';

  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : (req.ip || (req.connection && req.connection.remoteAddress)) || 'unknown';

  let device = 'Desktop';
  if (/Mobi|Android|iPhone|Mobile/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
  else if (/bot|crawler|spider|crawling/i.test(ua)) device = 'Bot';

  const timestamp = new Date().toISOString();
  const uaSingle = ua.replace(/\s+/g, ' ').trim();
  const line = `${timestamp} ${req.method} ${req.url} - ${browser} - ${device} - ${ip} - ${uaSingle}\n`;

  // console for quick dev feedback
  console.log(line.trim());

  // append to log file (async)
  fs.appendFile(logFile, line, (err) => {
    if (err) console.error('Failed to write access log:', err);
  });

  next();
});

// JSON Body Parser
app.use(express.json());

// Serve static frontend
app.use(express.static('public'));

// Mount Routes
app.use('/users', userRoutes);

module.exports = app;
