import Dexie from 'dexie';

// Initialize IndexedDB database
export const db = new Dexie('InventoryTrackerDB');

// Define database schema
// NOTE: Only indexed fields are listed here. All other fields are automatically stored.
db.version(1).stores({
  products: 'id, sku, name, category',
  movements: 'id, productId, type, date',
  settings: 'key'
});

// Version 2: Add image field as indexed
db.version(2).stores({
  products: 'id, sku, name, category',
  movements: 'id, productId, type, date',
  settings: 'key'
});

// Version 3: Add barcode, brand, model as indexed fields
db.version(3).stores({
  products: 'id, sku, name, category, barcode, brand, model',
  movements: 'id, productId, type, date',
  settings: 'key'
});

// Version 4: Simplified schema - only indexed fields (all other fields auto-stored)
db.version(4).stores({
  products: 'id, sku, name, category, barcode, brand, model',
  movements: 'id, productId, type, date',
  settings: 'key'
}).upgrade(async tx => {
  // Migration to ensure image field is preserved
  console.log('Upgrading database to version 4...');
  const products = await tx.table('products').toArray();
  console.log('Products in DB during upgrade:', products.length);
  if (products.length > 0) {
    console.log('Sample product during upgrade:', products[0]);
  }
});

// Version 5: Add sourceWebsite, crawledDate, imageStatus for better tracking
db.version(5).stores({
  products: 'id, sku, name, category, barcode, brand, model, sourceWebsite, imageStatus',
  movements: 'id, productId, type, date',
  settings: 'key'
}).upgrade(async tx => {
  console.log('🔄 Upgrading database to version 5 - adding source tracking...');
  const products = await tx.table('products').toArray();
  console.log(`📦 Migrating ${products.length} existing products...`);
  
  // Add new fields to existing products
  for (const product of products) {
    const updates = {};
    
    // Extract sourceWebsite from supplier or notes if not present
    if (!product.sourceWebsite) {
      if (product.supplier && product.supplier.includes('.')) {
        updates.sourceWebsite = product.supplier; // Already a domain
      } else if (product.notes && product.notes.includes('Imported from')) {
        const match = product.notes.match(/Imported from ([^\s]+)/);
        if (match) updates.sourceWebsite = match[1];
      } else {
        updates.sourceWebsite = 'unknown';
      }
    }
    
    // Set crawledDate from lastRestocked or current date
    if (!product.crawledDate) {
      updates.crawledDate = product.lastRestocked || new Date().toISOString().split('T')[0];
    }
    
    // Check image status
    if (!product.imageStatus) {
      if (!product.image || product.image === '') {
        updates.imageStatus = 'missing';
      } else if (product.image.startsWith('http')) {
        updates.imageStatus = 'unchecked'; // Will validate later
      } else {
        updates.imageStatus = 'invalid';
      }
    }
    
    // Update product if there are changes
    if (Object.keys(updates).length > 0) {
      await tx.table('products').update(product.id, updates);
    }
  }
  
  console.log('✅ Database migration to v5 complete!');
});

// Helper function to migrate data from localStorage to IndexedDB
export async function migrateFromLocalStorage() {
  try {
    // Check if migration already happened
    const migrationComplete = await db.settings.get('migrationComplete');
    if (migrationComplete) {
      console.log('Migration already completed');
      return { success: true, alreadyMigrated: true };
    }

    // Get data from localStorage
    const savedProducts = localStorage.getItem('inventoryProducts');
    const savedMovements = localStorage.getItem('inventoryMovements');
    const savedThreshold = localStorage.getItem('lowStockThreshold');

    let migratedCount = 0;

    // Migrate products
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        if (Array.isArray(products) && products.length > 0) {
          await db.products.bulkAdd(products);
          migratedCount += products.length;
          console.log(`Migrated ${products.length} products`);
        }
      } catch (e) {
        console.error('Error migrating products:', e);
      }
    }

    // Migrate movements
    if (savedMovements) {
      try {
        const movements = JSON.parse(savedMovements);
        if (Array.isArray(movements) && movements.length > 0) {
          await db.movements.bulkAdd(movements);
          console.log(`Migrated ${movements.length} movements`);
        }
      } catch (e) {
        console.error('Error migrating movements:', e);
      }
    }

    // Migrate settings
    if (savedThreshold) {
      await db.settings.put({ key: 'lowStockThreshold', value: parseInt(savedThreshold) });
    }

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      await db.settings.put({ key: 'hasSeenWelcome', value: hasSeenWelcome });
    }

    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      await db.settings.put({ key: 'hasSeenTutorial', value: hasSeenTutorial });
    }

    const lastBackupDate = localStorage.getItem('lastBackupDate');
    if (lastBackupDate) {
      await db.settings.put({ key: 'lastBackupDate', value: lastBackupDate });
    }

    const firstUseDate = localStorage.getItem('firstUseDate');
    if (firstUseDate) {
      await db.settings.put({ key: 'firstUseDate', value: firstUseDate });
    }

    // Mark migration as complete
    await db.settings.put({ key: 'migrationComplete', value: true });

    console.log(`✅ Migration complete! Migrated ${migratedCount} products from localStorage to IndexedDB`);
    
    return { 
      success: true, 
      alreadyMigrated: false,
      productsCount: migratedCount 
    };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
}

// Database operation helpers
export const dbOps = {
  // Products
  async getAllProducts() {
    return await db.products.toArray();
  },

  async addProduct(product) {
    return await db.products.add(product);
  },

  async updateProduct(id, updates) {
    return await db.products.update(id, updates);
  },

  async deleteProduct(id) {
    return await db.products.delete(id);
  },

  async getProduct(id) {
    return await db.products.get(id);
  },

  // Bulk operations for better performance
  async bulkAddProducts(products) {
    return await db.products.bulkAdd(products);
  },

  async bulkUpdateProducts(updates) {
    return await db.products.bulkPut(updates);
  },

  async bulkDeleteProducts(ids) {
    return await db.products.bulkDelete(ids);
  },

  // Movements
  async getAllMovements() {
    return await db.movements.toArray();
  },

  async addMovement(movement) {
    return await db.movements.add(movement);
  },

  async updateMovement(id, updates) {
    return await db.movements.update(id, updates);
  },

  async deleteMovement(id) {
    return await db.movements.delete(id);
  },

  async getMovementsByProductId(productId) {
    return await db.movements.where('productId').equals(productId).toArray();
  },

  // Settings
  async getSetting(key) {
    const setting = await db.settings.get(key);
    return setting ? setting.value : null;
  },

  async setSetting(key, value) {
    return await db.settings.put({ key, value });
  },

  // Clear all data (for demo mode reset, etc)
  async clearAllData() {
    await db.products.clear();
    await db.movements.clear();
    // Don't clear settings to preserve migration flag
  },

  // Export all data (for backup)
  async exportAllData() {
    const products = await db.products.toArray();
    const movements = await db.movements.toArray();
    const settings = await db.settings.toArray();
    
    return {
      products,
      movements,
      settings: settings.reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {}),
      exportDate: new Date().toISOString()
    };
  },

  // Import data (for restore)
  async importAllData(data) {
    if (data.products && Array.isArray(data.products)) {
      await db.products.clear();
      await db.products.bulkAdd(data.products);
    }
    if (data.movements && Array.isArray(data.movements)) {
      await db.movements.clear();
      await db.movements.bulkAdd(data.movements);
    }
    if (data.settings) {
      for (const [key, value] of Object.entries(data.settings)) {
        if (key !== 'migrationComplete') { // Don't import migration flag
          await db.settings.put({ key, value });
        }
      }
    }
  }
};

export default db;
