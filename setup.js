#!/usr/bin/env node

/**
 * Etsy Inventory Tracker - First Run Setup
 * Automatically configures the system on first launch
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🚀 Welcome to Etsy Inventory Tracker!');
console.log('═'.repeat(60));

// Check if this is first run
const setupCompleteFile = join(__dirname, '.setup-complete');
const isFirstRun = !existsSync(setupCompleteFile);

if (isFirstRun) {
  console.log('📦 First-time setup detected...\n');
  
  // Step 1: Create data directory
  console.log('1️⃣  Creating data directory...');
  const dataDir = join(__dirname, 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
    console.log('   ✅ Data directory created');
  } else {
    console.log('   ✅ Data directory exists');
  }

  // Step 2: Initialize database
  console.log('\n2️⃣  Initializing database...');
  const dbPath = join(dataDir, 'inventory.db');
  
  try {
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        costPrice REAL DEFAULT 0,
        salePrice REAL DEFAULT 0,
        supplier TEXT,
        location TEXT,
        reorderPoint INTEGER DEFAULT 10,
        minStock INTEGER DEFAULT 5,
        maxStock INTEGER DEFAULT 100,
        taxRate REAL DEFAULT 0.08,
        image TEXT,
        description TEXT,
        notes TEXT,
        brand TEXT,
        model TEXT,
        barcode TEXT,
        color TEXT,
        size TEXT,
        weight TEXT,
        sourceUrl TEXT,
        sourceWebsite TEXT,
        crawledDate TEXT,
        imageStatus TEXT,
        lastRestocked TEXT,
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_sourceWebsite ON products(sourceWebsite);
      CREATE INDEX IF NOT EXISTS idx_products_imageStatus ON products(imageStatus);

      CREATE TABLE IF NOT EXISTS movements (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        productName TEXT,
        productSku TEXT,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        notes TEXT,
        date TEXT NOT NULL,
        timestamp TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_movements_productId ON movements(productId);
      CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(date);
      CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Insert default settings
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('version', JSON.stringify('1.0.0'));
    insertSetting.run('setupDate', JSON.stringify(new Date().toISOString()));
    insertSetting.run('lowStockThreshold', JSON.stringify(10));
    insertSetting.run('currency', JSON.stringify('USD'));

    db.close();
    console.log('   ✅ Database initialized at:', dbPath);
  } catch (error) {
    console.error('   ❌ Database setup failed:', error.message);
    process.exit(1);
  }

  // Step 3: Create config file
  console.log('\n3️⃣  Creating configuration...');
  const configPath = join(__dirname, 'config.json');
  const config = {
    databasePath: join(dataDir, 'inventory.db'),
    serverPort: 3001,
    clientPort: 5173,
    autoStart: true,
    openBrowser: true,
    firstRun: false
  };
  
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('   ✅ Configuration saved');

  // Step 4: Mark setup as complete
  writeFileSync(setupCompleteFile, new Date().toISOString());
  
  console.log('\n═'.repeat(60));
  console.log('✨ Setup Complete! Your inventory system is ready to use.\n');
  console.log('📖 Quick Start Guide:');
  console.log('   • The app will open in your browser automatically');
  console.log('   • Add products manually or use the Web Crawler');
  console.log('   • Your data is stored locally in the "data" folder');
  console.log('   • Backup regularly by copying inventory.db\n');
  console.log('🔐 Privacy: All data stays on YOUR computer - nothing is uploaded!\n');
  
} else {
  console.log('✅ System already configured');
  console.log('📂 Database location:', join(__dirname, 'data', 'inventory.db'));
}

console.log('═'.repeat(60));
console.log('🚀 Starting Etsy Inventory Tracker...\n');

// Export for use by other modules
export const config = {
  dataDir: join(__dirname, 'data'),
  dbPath: join(__dirname, 'data', 'inventory.db'),
  isFirstRun
};
