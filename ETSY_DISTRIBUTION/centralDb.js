// Centralized Database API Client
// This replaces IndexedDB with a centralized SQLite database accessed via REST API

const API_BASE = 'http://localhost:3001/api';

export const centralDb = {
  // Products
  async getAllProducts() {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    const data = await response.json();
    return data.success ? data.product : null;
  },

  async addProduct(product) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    return data.success;
  },

  async updateProduct(id, product) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    return data.success;
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
  },

  async bulkAddProducts(products) {
    const response = await fetch(`${API_BASE}/products/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    });
    const data = await response.json();
    return data.success;
  },

  // Movements
  async getAllMovements() {
    const response = await fetch(`${API_BASE}/movements`);
    const data = await response.json();
    return data.success ? data.movements : [];
  },

  async addMovement(movement) {
    const response = await fetch(`${API_BASE}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movement)
    });
    const data = await response.json();
    return data.success;
  },

  async deleteMovement(id) {
    const response = await fetch(`${API_BASE}/movements/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.success;
  },

  // Settings
  async getSetting(key) {
    const response = await fetch(`${API_BASE}/settings/${key}`);
    const data = await response.json();
    return data.success ? data.value : null;
  },

  async setSetting(key, value) {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    const data = await response.json();
    return data.success;
  },

  // Statistics
  async getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    const data = await response.json();
    return data.success ? data.stats : null;
  },

  // Export/Import
  async exportAll() {
    const response = await fetch(`${API_BASE}/export`);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async importAll(data) {
    const response = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    const result = await response.json();
    return result.success;
  },

  // Migration from IndexedDB
  async migrateFromIndexedDB(products, movements, settings) {
    const response = await fetch(`${API_BASE}/migrate-from-indexeddb`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products, movements, settings })
    });
    const data = await response.json();
    return data.success;
  }
};

// Compatibility layer - make it work like the old db.js
export const dbOps = {
  getAllProducts: () => centralDb.getAllProducts(),
  addProduct: (product) => centralDb.addProduct(product),
  updateProduct: (id, updates) => centralDb.updateProduct(id, updates),
  deleteProduct: (id) => centralDb.deleteProduct(id),
  bulkAddProducts: (products) => centralDb.bulkAddProducts(products),
  
  getAllMovements: () => centralDb.getAllMovements(),
  addMovement: (movement) => centralDb.addMovement(movement),
  deleteMovement: (id) => centralDb.deleteMovement(id),
  
  getSetting: (key) => centralDb.getSetting(key),
  setSetting: (key, value) => centralDb.setSetting(key, value),
};

// Migration helper
export async function migrateFromLocalIndexedDB() {
  try {
    // Try to get data from IndexedDB
    const Dexie = (await import('dexie')).default;
    const oldDb = new Dexie('InventoryTrackerDB');
    
    oldDb.version(5).stores({
      products: 'id, sku, name, category, barcode, brand, model, sourceWebsite, imageStatus',
      movements: 'id, productId, type, date',
      settings: 'key'
    });

    const products = await oldDb.products.toArray();
    const movements = await oldDb.movements.toArray();
    const settings = await oldDb.settings.toArray();

    if (products.length > 0 || movements.length > 0) {
      console.log(`🔄 Migrating ${products.length} products from IndexedDB to centralized database...`);
      
      const success = await centralDb.migrateFromIndexedDB(
        products,
        movements,
        settings.map(s => ({ key: s.key, value: s.value }))
      );

      if (success) {
        console.log('✅ Migration to centralized database complete!');
        console.log('💡 You can now use any browser and see the same data');
        
        // Mark migration as complete
        await centralDb.setSetting('migratedFromIndexedDB', true);
        
        return { success: true, count: products.length };
      }
    } else {
      console.log('ℹ️  No IndexedDB data to migrate');
      return { success: true, count: 0 };
    }
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
}

export default centralDb;
