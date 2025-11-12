#!/usr/bin/env node

/**
 * Etsy Inventory Tracker - One-Click Launcher
 * Run this to start the entire application
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.clear();
console.log('\n' + '═'.repeat(70));
console.log('  🏪 ETSY INVENTORY TRACKER - Professional Edition');
console.log('═'.repeat(70) + '\n');

// Step 1: Run setup (creates database if needed)
console.log('🔧 Checking system configuration...');
const setup = spawn('node', ['setup.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

setup.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Setup failed. Please contact support.');
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  🚀 STARTING SERVICES');
  console.log('═'.repeat(70) + '\n');

  // Step 2: Start the application servers
  const app = spawn('npm', ['run', 'dev:all'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Step 3: Wait 3 seconds then open browser
  setTimeout(async () => {
    console.log('\n📱 Opening inventory system in your browser...\n');
    try {
      await open('http://localhost:5173');
      console.log('✨ Etsy Inventory Tracker is now running!\n');
      console.log('📖 Quick Tips:');
      console.log('   • Add products manually or use the Web Crawler');
      console.log('   • All data stays on YOUR computer');
      console.log('   • Press Ctrl+C to stop the system\n');
      console.log('🔒 Privacy: Nothing is uploaded to the cloud!\n');
    } catch (error) {
      console.log('ℹ️  Please open http://localhost:5173 in your browser\n');
    }
  }, 3000);

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down Etsy Inventory Tracker...');
    app.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    app.kill('SIGTERM');
    process.exit(0);
  });
});
