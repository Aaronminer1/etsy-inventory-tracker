import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read config, fallback to default path
let DB_PATH;
const configPath = join(__dirname, 'config.json');

if (existsSync(configPath)) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    DB_PATH = config.databasePath;
    console.log(`📂 Using configured database: ${DB_PATH}`);
  } catch (error) {
    console.warn('⚠️  Could not read config, using default path');
    DB_PATH = join(__dirname, 'data', 'inventory.db');
  }
} else {
  // First run - use default path in data folder
  DB_PATH = join(__dirname, 'data', 'inventory.db');
}

const db = new Database(DB_PATH);

console.log(`� Centralized database: ${DB_PATH}`);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const initDatabase = () => {
  // Products table
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
    )
  `);

  // Create indexes for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_sourceWebsite ON products(sourceWebsite);
    CREATE INDEX IF NOT EXISTS idx_products_imageStatus ON products(imageStatus);
  `);

  // Movements table
  db.exec(`
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
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_movements_productId ON movements(productId);
    CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(date);
    CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  console.log('✅ Database tables initialized');
};

initDatabase();

// Database operations
export const dbOperations = {
  // Products
  getAllProducts: () => {
    const stmt = db.prepare('SELECT * FROM products ORDER BY name');
    return stmt.all();
  },

  getProductById: (id) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
  },

  addProduct: (product) => {
    const stmt = db.prepare(`
      INSERT INTO products (
        id, sku, name, category, quantity, costPrice, salePrice, supplier, location,
        reorderPoint, minStock, maxStock, taxRate, image, description, notes,
        brand, model, barcode, color, size, weight, sourceUrl, sourceWebsite,
        crawledDate, imageStatus, lastRestocked
      ) VALUES (
        @id, @sku, @name, @category, @quantity, @costPrice, @salePrice, @supplier, @location,
        @reorderPoint, @minStock, @maxStock, @taxRate, @image, @description, @notes,
        @brand, @model, @barcode, @color, @size, @weight, @sourceUrl, @sourceWebsite,
        @crawledDate, @imageStatus, @lastRestocked
      )
    `);
    return stmt.run(product);
  },

  updateProduct: (id, product) => {
    const stmt = db.prepare(`
      UPDATE products SET
        sku = @sku,
        name = @name,
        category = @category,
        quantity = @quantity,
        costPrice = @costPrice,
        salePrice = @salePrice,
        supplier = @supplier,
        location = @location,
        reorderPoint = @reorderPoint,
        minStock = @minStock,
        maxStock = @maxStock,
        taxRate = @taxRate,
        image = @image,
        description = @description,
        notes = @notes,
        brand = @brand,
        model = @model,
        barcode = @barcode,
        color = @color,
        size = @size,
        weight = @weight,
        sourceUrl = @sourceUrl,
        sourceWebsite = @sourceWebsite,
        imageStatus = @imageStatus,
        lastRestocked = @lastRestocked,
        updatedAt = datetime('now')
      WHERE id = @id
    `);
    return stmt.run({ id, ...product });
  },

  deleteProduct: (id) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
  },

  bulkAddProducts: (products) => {
    const insert = db.prepare(`
      INSERT OR REPLACE INTO products (
        id, sku, name, category, quantity, costPrice, salePrice, supplier, location,
        reorderPoint, minStock, maxStock, taxRate, image, description, notes,
        brand, model, barcode, color, size, weight, sourceUrl, sourceWebsite,
        crawledDate, imageStatus, lastRestocked
      ) VALUES (
        @id, @sku, @name, @category, @quantity, @costPrice, @salePrice, @supplier, @location,
        @reorderPoint, @minStock, @maxStock, @taxRate, @image, @description, @notes,
        @brand, @model, @barcode, @color, @size, @weight, @sourceUrl, @sourceWebsite,
        @crawledDate, @imageStatus, @lastRestocked
      )
    `);

    const insertMany = db.transaction((products) => {
      for (const product of products) {
        // Ensure ALL fields have defaults - handles old IndexedDB data
        const productData = {
          id: product.id,
          sku: product.sku || '',
          name: product.name || 'Unnamed Product',
          category: product.category || '',
          quantity: product.quantity || 0,
          costPrice: product.costPrice || 0,
          salePrice: product.salePrice || 0,
          supplier: product.supplier || '',
          location: product.location || '',
          reorderPoint: product.reorderPoint || 10,
          minStock: product.minStock || 5,
          maxStock: product.maxStock || 100,
          taxRate: product.taxRate || 0.08,
          image: product.image || '',
          description: product.description || '',
          notes: product.notes || '',
          brand: product.brand || '',
          model: product.model || '',
          barcode: product.barcode || '',
          color: product.color || '',
          size: product.size || '',
          weight: product.weight || '',
          sourceUrl: product.sourceUrl || '',
          sourceWebsite: product.sourceWebsite || product.supplier || 'unknown',
          crawledDate: product.crawledDate || product.lastRestocked || new Date().toISOString().split('T')[0],
          imageStatus: product.imageStatus || (product.image && product.image !== '' ? 'unchecked' : 'missing'),
          lastRestocked: product.lastRestocked || new Date().toISOString().split('T')[0]
        };
        insert.run(productData);
      }
    });

    return insertMany(products);
  },

  // Movements
  getAllMovements: () => {
    const stmt = db.prepare('SELECT * FROM movements ORDER BY timestamp DESC');
    return stmt.all();
  },

  addMovement: (movement) => {
    const stmt = db.prepare(`
      INSERT INTO movements (id, productId, productName, productSku, type, quantity, notes, date, timestamp)
      VALUES (@id, @productId, @productName, @productSku, @type, @quantity, @notes, @date, @timestamp)
    `);
    return stmt.run(movement);
  },

  deleteMovement: (id) => {
    const stmt = db.prepare('DELETE FROM movements WHERE id = ?');
    return stmt.run(id);
  },

  // Settings
  getSetting: (key) => {
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const result = stmt.get(key);
    return result ? JSON.parse(result.value) : null;
  },

  setSetting: (key, value) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `);
    return stmt.run(key, JSON.stringify(value));
  },

  // Statistics
  getStats: () => {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalUnits = db.prepare('SELECT SUM(quantity) as total FROM products').get().total || 0;
    const totalValue = db.prepare('SELECT SUM(quantity * costPrice) as value FROM products').get().value || 0;
    const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE quantity > 0 AND quantity <= reorderPoint').get().count;
    const outOfStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE quantity = 0').get().count;
    
    return {
      totalProducts,
      totalUnits,
      totalValue,
      lowStock,
      outOfStock
    };
  },

  // Backup & Restore
  exportAll: () => {
    return {
      products: dbOperations.getAllProducts(),
      movements: dbOperations.getAllMovements(),
      settings: db.prepare('SELECT * FROM settings').all(),
      exportedAt: new Date().toISOString()
    };
  },

  importAll: (data) => {
    const importTransaction = db.transaction(() => {
      // Clear existing data
      db.prepare('DELETE FROM movements').run();
      db.prepare('DELETE FROM products').run();
      db.prepare('DELETE FROM settings').run();

      // Import products
      if (data.products && data.products.length > 0) {
        dbOperations.bulkAddProducts(data.products);
      }

      // Import movements
      if (data.movements && data.movements.length > 0) {
        const insertMovement = db.prepare(`
          INSERT INTO movements (id, productId, productName, productSku, type, quantity, notes, date, timestamp)
          VALUES (@id, @productId, @productName, @productSku, @type, @quantity, @notes, @date, @timestamp)
        `);
        for (const movement of data.movements) {
          insertMovement.run(movement);
        }
      }

      // Import settings
      if (data.settings && data.settings.length > 0) {
        const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
        for (const setting of data.settings) {
          insertSetting.run(setting.key, setting.value);
        }
      }
    });

    importTransaction();
  }
};

export default db;
