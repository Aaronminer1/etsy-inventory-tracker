import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, TrendingUp, AlertTriangle, Download, Edit2, Trash2, X, Search, BarChart3, PieChart, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, Calendar, Tag, MapPin, FileText, Printer, CheckSquare, Square, Upload, RefreshCw, Info, Undo2, Image, HelpCircle, ChevronRight, Shield, Cloud, Bell, BookOpen, Award, Target, CheckCircle, XCircle, TrendingDown, AlertCircle, Globe } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dbOps, migrateFromLocalIndexedDB } from './centralDb';
import WebsiteCrawler from './WebsiteCrawler';

const InventoryTracker = () => {
  const getSampleData = () => ({
    products: [
      { id: '1', sku: 'TOOL-M12-2450P', name: 'Milwaukee M12 Battery Pack (2-Pack)', category: 'Power Tools', quantity: 45, costPrice: 89.00, salePrice: 149.99, supplier: 'Milwaukee Tool', location: 'Warehouse A-1', reorderPoint: 15, minStock: 10, maxStock: 100, lastRestocked: '2025-10-15', taxRate: 0.08, 
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
        brand: 'Milwaukee', model: '48-59-2450P', barcode: '045242563456', 
        color: 'Red/Black', size: '12V 5.0Ah', weight: '2.8 lbs',
        description: 'M12 12V Lithium-Ion XC High Output 5.0 Ah Battery Pack (2-Pack) Starter Kit with Charger. Features REDLINK Intelligence for optimized performance and overload protection. Up to 2.5X more runtime than standard M12 batteries.',
        notes: 'Bestseller - Popular contractor item' 
      },
      { id: '2', sku: 'ELEC-002', name: 'USB-C Cable 6ft', category: 'Electronics', quantity: 8, costPrice: 3.25, salePrice: 9.99, supplier: 'TechSupply Co', location: 'Warehouse A-1', reorderPoint: 20, minStock: 15, maxStock: 150, lastRestocked: '2025-09-20', taxRate: 0.08, image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=100&h=100&fit=crop', notes: '', brand: 'Anker', color: 'Black', size: '6ft' },
      { id: '3', sku: 'ELEC-003', name: 'Bluetooth Speaker', category: 'Electronics', quantity: 22, costPrice: 28.00, salePrice: 59.99, supplier: 'Audio Direct', location: 'Warehouse A-2', reorderPoint: 10, minStock: 8, maxStock: 50, lastRestocked: '2025-10-25', taxRate: 0.08, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop', notes: '', brand: 'JBL', model: 'Flip 6', color: 'Blue' },
      { id: '4', sku: 'CLTH-001', name: 'Cotton T-Shirt', category: 'Clothing', quantity: 0, costPrice: 8.50, salePrice: 19.99, supplier: 'FashionHub', location: 'Warehouse B-1', reorderPoint: 25, minStock: 20, maxStock: 200, lastRestocked: '2025-08-10', taxRate: 0.06, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', notes: '', color: 'Navy Blue', size: 'Medium' },
      { id: '5', sku: 'CLTH-002', name: 'Denim Jeans', category: 'Clothing', quantity: 15, costPrice: 22.00, salePrice: 49.99, supplier: 'FashionHub', location: 'Warehouse B-1', reorderPoint: 12, minStock: 10, maxStock: 80, lastRestocked: '2025-10-30', taxRate: 0.06, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', notes: '', brand: "Levi's", size: '32x32', color: 'Dark Wash' },
      { id: '6', sku: 'HOME-001', name: 'Ceramic Mug', category: 'Home & Kitchen', quantity: 67, costPrice: 4.75, salePrice: 12.99, supplier: 'HomeGoods Plus', location: 'Warehouse C-1', reorderPoint: 30, minStock: 25, maxStock: 200, lastRestocked: '2025-11-01', taxRate: 0.08, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100&h=100&fit=crop', notes: 'Bestseller', size: '16oz', color: 'White' },
      { id: '7', sku: 'HOME-002', name: 'Cutting Board', category: 'Home & Kitchen', quantity: 5, costPrice: 15.00, salePrice: 34.99, supplier: 'HomeGoods Plus', location: 'Warehouse C-1', reorderPoint: 15, minStock: 10, maxStock: 60, lastRestocked: '2025-09-15', taxRate: 0.08, image: 'https://images.unsplash.com/photo-1594735153628-b67f9c60f7cc?w=100&h=100&fit=crop', notes: '', size: '18x12 inches', weight: '3.2 lbs' },
      { id: '8', sku: 'HOME-003', name: 'Glass Storage Set', category: 'Home & Kitchen', quantity: 31, costPrice: 18.50, salePrice: 39.99, supplier: 'KitchenPro', location: 'Warehouse C-2', reorderPoint: 20, minStock: 15, maxStock: 100, lastRestocked: '2025-10-20', taxRate: 0.08, image: 'https://images.unsplash.com/photo-1603399587513-136aa9398f2d?w=100&h=100&fit=crop', notes: '', description: '10-piece glass food storage container set with airtight lids' }
    ],
    movements: [
      { id: 'm1', productId: '2', productName: 'USB-C Cable', productSku: 'ELEC-002', type: 'out', quantity: 5, notes: 'Bulk order', date: '2025-11-06', timestamp: '2025-11-06T10:30:00Z' },
      { id: 'm2', productId: '6', productName: 'Ceramic Mug', productSku: 'HOME-001', type: 'in', quantity: 50, notes: 'Restock', date: '2025-11-01', timestamp: '2025-11-01T08:30:00Z' },
      { id: 'm3', productId: '4', productName: 'Cotton T-Shirt', productSku: 'CLTH-001', type: 'out', quantity: 12, notes: 'Retail sale', date: '2025-11-04', timestamp: '2025-11-04T09:15:00Z' }
    ]
  });

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMovement, setShowMovement] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingMovement, setEditingMovement] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSourceWebsite, setFilterSourceWebsite] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [currency, setCurrency] = useState('USD');
  
  // New features state
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showWebCrawler, setShowWebCrawler] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [imageLoading, setImageLoading] = useState(false);
  
  // New features state
  const [showMovementHistory, setShowMovementHistory] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState(null);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const currencySymbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': 'C$', 'AUD': 'A$',
    'JPY': '¥', 'CNY': '¥', 'INR': '₹', 'MXN': '$', 'BRL': 'R$'
  };

  const [productForm, setProductForm] = useState({
    sku: '', name: '', category: '', quantity: 0, costPrice: 0, salePrice: 0,
    supplier: '', location: '', reorderPoint: 10, minStock: 5, maxStock: 100, taxRate: 0.08,
    image: '', notes: '',
    // Enhanced fields (Home Depot inspired)
    description: '', // Long-form product description
    barcode: '', // UPC/EAN/Barcode
    brand: '', // Product brand/manufacturer
    model: '', // Model number
    color: '', // Product color
    size: '', // Size/dimensions
    weight: '', // Product weight
    specifications: [], // Array of {key: 'Voltage', value: '12V'}
    images: [], // Multiple images array
    tags: [], // Product tags for better search
    internalNotes: '', // Private notes not for display
    rating: 0 // Internal product rating (1-5 stars)
  });

  const [movementForm, setMovementForm] = useState({
    productId: '', type: 'in', quantity: 0, notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Initialize - migrate from IndexedDB to centralized database if needed
  useEffect(() => {
    const initializeData = async () => {
      try {
        // First, try to migrate any existing IndexedDB data to centralized database
        const migrationResult = await migrateFromLocalIndexedDB();
        
        if (migrationResult.success && migrationResult.count > 0) {
          console.log(`✅ Migrated ${migrationResult.count} products from IndexedDB to centralized database`);
          showToast(`Migrated ${migrationResult.count} products to centralized database! All browsers will now see the same data.`, 'success');
        }

        // Load data from centralized database
        const loadedProducts = await dbOps.getAllProducts();
        const loadedMovements = await dbOps.getAllMovements();
        const savedThreshold = await dbOps.getSetting('lowStockThreshold');
        const hasSeenWelcome = await dbOps.getSetting('hasSeenWelcome');
        const savedLastBackup = await dbOps.getSetting('lastBackupDate');
        const hasSeenTutorial = await dbOps.getSetting('hasSeenTutorial');
        const userStartedFresh = await dbOps.getSetting('userStartedFresh');

        if (loadedProducts && loadedProducts.length > 0) {
          // User has existing data
          console.log('📦 Loading products from centralized database:', loadedProducts.length);
          console.log('First product from DB:', loadedProducts[0]);
          console.log('First product image from DB:', loadedProducts[0]?.image);
          setProducts(loadedProducts);
          setMovements(loadedMovements || []);
          setIsDemoMode(false);
        } else if (userStartedFresh === 'true') {
          // User explicitly started fresh - don't load demo data
          setProducts([]);
          setMovements([]);
          setIsDemoMode(false);
        } else {
          // New user - show welcome or load demo
          if (!hasSeenWelcome) {
            setShowWelcome(true);
            await dbOps.setSetting('hasSeenWelcome', 'true');
          }
          loadDemoData();
        }

        if (savedThreshold) setLowStockThreshold(parseInt(savedThreshold));
        if (savedLastBackup) setLastBackupDate(new Date(savedLastBackup));

        // Show tutorial for new users after welcome
        if (!hasSeenTutorial && !hasSeenWelcome) {
          setTimeout(() => setShowTutorial(true), 1000);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        showToast('Error connecting to centralized database. Make sure the server is running.', 'error');
        loadDemoData();
      }
    };

    initializeData();
  }, []);

  // Save to centralized database when products change (NOT in demo mode)
  useEffect(() => {
    const saveProducts = async () => {
      if (!isDemoMode && products.length > 0) {
        try {
          console.log('💾 Saving products to centralized database:', products.length);
          if (products.length > 0) {
            console.log('First product being saved:', products[0]);
            console.log('First product image being saved:', products[0]?.image);
          }
          // Use bulk update to save all products
          await dbOps.bulkAddProducts(products);
          console.log('✅ Products saved to centralized database');
        } catch (error) {
          console.error('❌ Error saving products:', error);
          showToast('Error saving to database. Changes may not persist.', 'error');
        }
      }
    };
    saveProducts();
  }, [products, isDemoMode]);

  // Save to IndexedDB when movements change (NOT in demo mode)
  useEffect(() => {
    const saveMovements = async () => {
      if (!isDemoMode && movements.length > 0) {
        try {
          // Clear existing movements and add updated ones
          await db.movements.clear();
          await db.movements.bulkAdd(movements);
        } catch (error) {
          console.error('Error saving movements:', error);
        }
      }
    };
    saveMovements();
  }, [movements, isDemoMode]);

  // Save lowStockThreshold to IndexedDB
  useEffect(() => {
    const saveThreshold = async () => {
      await dbOps.setSetting('lowStockThreshold', lowStockThreshold);
    };
    saveThreshold();
  }, [lowStockThreshold]);

  // Check if backup reminder should be shown (every 7 days)
  useEffect(() => {
    if (isDemoMode || products.length === 0) return;
    
    const checkBackupReminder = async () => {
      if (!lastBackupDate) {
        // No backup ever - show after 3 days of usage
        const firstUse = await dbOps.getSetting('firstUseDate');
        if (!firstUse) {
          await dbOps.setSetting('firstUseDate', new Date().toISOString());
          return;
        }
        
        const daysSinceFirst = (new Date() - new Date(firstUse)) / (1000 * 60 * 60 * 24);
        if (daysSinceFirst >= 3) {
          setShowBackupReminder(true);
        }
      } else {
        // Has backup - remind every 7 days
        const daysSinceBackup = (new Date() - lastBackupDate) / (1000 * 60 * 60 * 24);
        if (daysSinceBackup >= 7) {
          setShowBackupReminder(true);
        }
      }
    };
    
    checkBackupReminder();
  }, [products, lastBackupDate, isDemoMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+N or Cmd+N for new product
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowAddProduct(true);
      }
      // Ctrl+M or Cmd+M for movement
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        setShowMovement(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowAddProduct(false);
        setShowMovement(false);
        setShowSettings(false);
        setShowTutorial(false);
        setShowBatchImport(false);
        setShowShoppingList(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const loadDemoData = async () => {
    // Demo mode: Load sample data into state only (never touches database)
    const demo = getSampleData();
    setProducts(demo.products);
    setMovements(demo.movements);
    setIsDemoMode(true);
    setUndoStack([]);
    showToast('Demo mode loaded - explore without affecting your real data', 'info');
  };

  const startFresh = async () => {
    if (confirm('⚠️ WARNING: This will PERMANENTLY delete all your inventory data!\n\nThis action cannot be undone. Are you absolutely sure?')) {
      // Double confirmation for safety
      if (confirm('Last chance! Click OK to permanently delete all data, or Cancel to keep your data.')) {
        await dbOps.clearAllData();
        setProducts([]);
        setMovements([]);
        setUndoStack([]);
        setIsDemoMode(false);
        setShowWelcome(false);
        await dbOps.setSetting('hasSeenWelcome', 'true');
        await dbOps.setSetting('userStartedFresh', 'true');
        showToast('All data permanently deleted. Starting fresh!', 'success');
      }
    }
  };

  const switchToRealMode = async () => {
    if (confirm('Switch to Real Mode?\n\nThis will save the current demo data as your starting inventory.')) {
      setIsDemoMode(false);
      // Save current demo data as starting point to IndexedDB
      await dbOps.clearAllData();
      await dbOps.bulkAddProducts(products);
      await db.movements.bulkAdd(movements);
      await dbOps.setSetting('userStartedFresh', 'true');
      showToast('Switched to real mode. Data saved!', 'success');
    }
  };

  const validateProduct = (formData) => {
    const errors = {};
    
    if (!formData.sku || formData.sku.trim() === '') {
      errors.sku = 'SKU is required';
    } else {
      // Check for duplicate SKU
      const duplicate = products.find(p => 
        p.sku.toLowerCase() === formData.sku.toLowerCase() && 
        p.id !== editingProduct?.id
      );
      if (duplicate) {
        errors.sku = 'SKU already exists';
      }
    }
    
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Product name is required';
    }
    
    if (parseFloat(formData.costPrice) < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }
    
    if (parseFloat(formData.salePrice) < 0) {
      errors.salePrice = 'Sale price cannot be negative';
    }
    
    if (parseFloat(formData.salePrice) < parseFloat(formData.costPrice)) {
      errors.salePrice = 'Sale price should be higher than cost price';
    }
    
    if (parseFloat(formData.quantity) < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    if (parseFloat(formData.reorderPoint) < 0) {
      errors.reorderPoint = 'Reorder point cannot be negative';
    }

    if (parseFloat(formData.maxStock) <= parseFloat(formData.reorderPoint)) {
      errors.maxStock = 'Max stock must be greater than reorder point';
    }
    
    return errors;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddProduct = () => {
    const errors = validateProduct(productForm);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    const newProduct = {
      ...productForm,
      id: editingProduct?.id || Date.now().toString(),
      quantity: parseFloat(productForm.quantity) || 0,
      costPrice: parseFloat(productForm.costPrice) || 0,
      salePrice: parseFloat(productForm.salePrice) || 0,
      reorderPoint: parseFloat(productForm.reorderPoint) || 10,
      minStock: parseFloat(productForm.minStock) || 5,
      maxStock: parseFloat(productForm.maxStock) || 100,
      taxRate: parseFloat(productForm.taxRate) || 0,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    if (editingProduct) {
      // Save to undo stack
      addToUndo('edit', editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      showToast('Product updated successfully!', 'success');
    } else {
      setProducts([...products, newProduct]);
      showToast('Product added successfully!', 'success');
    }

    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      sku: '', name: '', category: '', quantity: 0, costPrice: 0, salePrice: 0,
      supplier: '', location: '', reorderPoint: 10, minStock: 5, maxStock: 100, taxRate: 0.08,
      image: '', notes: '',
      // Enhanced fields
      description: '', barcode: '', brand: '', model: '', color: '', size: '', weight: '',
      specifications: [], images: [], tags: [], internalNotes: '', rating: 0
    });
    setValidationErrors({});
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  // Handle products imported from web crawler
  const handleCrawledProductsImport = async (crawledProducts) => {
    if (isDemoMode) {
      showToast('Please switch to Real Mode before importing products from a website', 'warning');
      return;
    }

    // Debug: Log first product to check image field
    console.log('Importing products from crawler:', crawledProducts.length);
    if (crawledProducts.length > 0) {
      console.log('First product:', crawledProducts[0]);
      console.log('First product image:', crawledProducts[0].image);
      console.log('First product sourceWebsite:', crawledProducts[0].sourceWebsite);
    }

    // Add all crawled products to the inventory with unique IDs
    const newProducts = crawledProducts.map(product => ({
      ...product,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sourceWebsite: product.sourceWebsite || product.supplier || 'unknown',
      crawledDate: product.crawledDate || new Date().toISOString().split('T')[0],
      imageStatus: product.imageStatus || (product.image ? 'unchecked' : 'missing')
    }));

    console.log('After mapping, first product:', newProducts[0]);
    console.log('After mapping, first product image:', newProducts[0]?.image);

    setProducts(prev => [...prev, ...newProducts]);
    showToast(`Successfully imported ${newProducts.length} products!`, 'success');
    
    // Optionally validate images in the background
    setTimeout(() => validateProductImages(newProducts), 2000);
  };

  // Validate product images
  const validateProductImages = async (productsToValidate = null) => {
    const targetProducts = productsToValidate || products.filter(p => p.imageStatus === 'unchecked' && p.image);
    
    if (targetProducts.length === 0) {
      showToast('No images to validate', 'info');
      return;
    }

    showToast(`Validating ${targetProducts.length} product images...`, 'info');

    try {
      const imageUrls = targetProducts.map(p => p.image);
      const response = await fetch('http://localhost:3001/api/validate-images-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update product imageStatus based on validation results
        const updatedProducts = products.map(product => {
          const result = data.results.find(r => r.imageUrl === product.image);
          if (result) {
            return { ...product, imageStatus: result.status };
          }
          return product;
        });

        setProducts(updatedProducts);
        
        showToast(
          `Image validation complete: ${data.summary.valid} valid, ${data.summary.invalid} issues found`,
          data.summary.valid > data.summary.invalid ? 'success' : 'warning'
        );
      }
    } catch (error) {
      console.error('Image validation error:', error);
      showToast('Failed to validate images. Is the crawler server running?', 'error');
    }
  };

  const handleMovement = () => {
    if (!movementForm.productId || !movementForm.quantity || movementForm.quantity <= 0) {
      showToast('Please select a product and enter a valid quantity', 'error');
      return;
    }

    const product = products.find(p => p.id === movementForm.productId);
    const qty = parseFloat(movementForm.quantity);
    
    // Calculate the net quantity change
    let quantityChange = 0;
    
    if (editingMovement) {
      // When editing, first reverse the old movement
      const oldQty = parseFloat(editingMovement.quantity);
      const oldChange = editingMovement.type === 'in' ? -oldQty : oldQty;
      // Then apply the new movement
      const newChange = movementForm.type === 'in' ? qty : -qty;
      quantityChange = oldChange + newChange;
    } else {
      // When creating new movement
      quantityChange = movementForm.type === 'in' ? qty : -qty;
    }
    
    const newQuantity = product.quantity + quantityChange;

    if (newQuantity < 0) {
      showToast(`Insufficient stock! Current: ${product.quantity}, Requested: ${Math.abs(quantityChange)}`, 'error');
      return;
    }

    // Save old state for undo
    addToUndo('movement', { product, quantity: product.quantity });

    setProducts(products.map(p => 
      p.id === movementForm.productId ? { 
        ...p, 
        quantity: newQuantity, 
        lastRestocked: movementForm.type === 'in' ? movementForm.date : p.lastRestocked 
      } : p
    ));

    const newMovement = {
      id: editingMovement?.id || Date.now().toString(),
      productId: movementForm.productId,
      productName: product.name,
      productSku: product.sku,
      type: movementForm.type,
      quantity: qty,
      notes: movementForm.notes,
      date: movementForm.date,
      timestamp: new Date().toISOString()
    };

    if (editingMovement) {
      setMovements(movements.map(m => m.id === editingMovement.id ? newMovement : m));
      showToast('Movement updated successfully!', 'success');
    } else {
      setMovements([newMovement, ...movements]);
      showToast('Movement recorded successfully!', 'success');
    }

    setMovementForm({
      productId: '', type: 'in', quantity: 0, notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowMovement(false);
    setEditingMovement(null);
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (confirm(`Delete ${product.name}? This will also remove all associated movements.`)) {
      addToUndo('delete', product);
      setProducts(products.filter(p => p.id !== id));
      setMovements(movements.filter(m => m.productId !== id));
      setSelectedProducts(selectedProducts.filter(sid => sid !== id));
      showToast('Product deleted successfully', 'success');
    }
  };

  const deleteMovement = (id) => {
    const movement = movements.find(m => m.id === id);
    if (confirm('Delete this movement? This will NOT adjust product quantities.')) {
      addToUndo('deleteMovement', movement);
      setMovements(movements.filter(m => m.id !== id));
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setValidationErrors({});
    setShowAddProduct(true);
  };

  const editMovement = (movement) => {
    setEditingMovement(movement);
    setMovementForm({
      productId: movement.productId,
      type: movement.type,
      quantity: movement.quantity,
      notes: movement.notes,
      date: movement.date
    });
    setShowMovement(true);
  };

  const addToUndo = (action, data) => {
    setUndoStack([...undoStack, { action, data, timestamp: Date.now() }]);
    // Keep only last 10 actions
    if (undoStack.length > 10) {
      setUndoStack(undoStack.slice(-10));
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    
    switch(lastAction.action) {
      case 'delete':
        setProducts([...products, lastAction.data]);
        break;
      case 'edit':
        setProducts(products.map(p => p.id === lastAction.data.id ? lastAction.data : p));
        break;
      // Add more undo cases as needed
    }
    
    setUndoStack(undoStack.slice(0, -1));
  };

  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(sid => sid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const bulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (confirm(`Delete ${selectedProducts.length} products?`)) {
      const deletedProducts = products.filter(p => selectedProducts.includes(p.id));
      addToUndo('bulkDelete', deletedProducts);
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setMovements(movements.filter(m => !selectedProducts.includes(m.productId)));
      setSelectedProducts([]);
    }
  };

  const exportToCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Quantity', 'Cost Price', 'Sale Price', 'Margin %', 'Tax Rate', 'Supplier', 'Location', 'Reorder Point'];
    const rows = products.map(p => [
      p.sku, p.name, p.category, p.quantity, p.costPrice, p.salePrice,
      (((p.salePrice - p.costPrice) / p.costPrice) * 100).toFixed(1),
      ((p.taxRate || 0) * 100).toFixed(0) + '%',
      p.supplier, p.location, p.reorderPoint
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    
    // Append to body, click, and cleanup
    document.body.appendChild(a);
    a.click();
    
    // Cleanup after a longer delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);
  };

  const generateShoppingList = () => {
    const needsReorder = products.filter(p => p.quantity <= p.reorderPoint);
    
    if (needsReorder.length === 0) {
      alert('No items need reordering at this time!');
      return;
    }
    
    const listContent = needsReorder.map(p => {
      const needed = p.maxStock - p.quantity;
      const estimatedCost = needed * p.costPrice;
      return `${p.name} (${p.sku})\n  Current: ${p.quantity} | Need: ${needed} units | Est. Cost: $${estimatedCost.toFixed(2)}\n  Supplier: ${p.supplier || 'N/A'}`;
    }).join('\n\n');
    
    const totalCost = needsReorder.reduce((sum, p) => {
      const needed = p.maxStock - p.quantity;
      return sum + (needed * p.costPrice);
    }, 0);
    
    const fullList = `SHOPPING LIST - ${new Date().toLocaleDateString()}\n` +
                     `Items to Reorder: ${needsReorder.length}\n` +
                     `Estimated Total Cost: $${totalCost.toFixed(2)}\n` +
                     `${'='.repeat(50)}\n\n` +
                     listContent;
    
    try {
      const blob = new Blob([fullList], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating shopping list:', error);
      alert('Error generating shopping list. Please try again.');
    }
  };

  const printReport = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Inventory Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #4CAF50; color: white; }');
    printWindow.document.write('.alert { background-color: #ffebee; }');
    printWindow.document.write('.low { background-color: #fff3e0; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(`<h1>Inventory Report - ${new Date().toLocaleDateString()}</h1>`);
    printWindow.document.write(`<p><strong>Total Products:</strong> ${totalProducts} | <strong>Total Units:</strong> ${totalUnits} | <strong>Total Value:</strong> $${totalValue.toFixed(2)}</p>`);
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>SKU</th><th>Name</th><th>Category</th><th>Stock</th><th>Value</th><th>Status</th></tr>');
    products.forEach(p => {
      const rowClass = p.quantity === 0 ? 'alert' : p.quantity <= p.reorderPoint ? 'low' : '';
      const status = p.quantity === 0 ? 'OUT OF STOCK' : p.quantity <= p.reorderPoint ? 'LOW STOCK' : 'OK';
      printWindow.document.write(`<tr class="${rowClass}"><td>${p.sku}</td><td>${p.name}</td><td>${p.category || '-'}</td><td>${p.quantity}</td><td>$${(p.quantity * p.costPrice).toFixed(2)}</td><td>${status}</td></tr>`);
    });
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const exportData = async () => {
    // Check if in demo mode
    if (isDemoMode) {
      showToast('Backup is not available in demo mode. Please save your demo data or add real products first.', 'warning');
      return;
    }

    try {
      const data = await dbOps.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.style.display = 'none';
      
      // Append to body, click, and cleanup
      document.body.appendChild(a);
      a.click();
      
      // Cleanup after a longer delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      // Track backup date
      const now = new Date();
      setLastBackupDate(now);
      await dbOps.setSetting('lastBackupDate', now.toISOString());
      setShowBackupReminder(false);
      
      showToast('Backup created successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to create backup', 'error');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products && data.movements) {
          if (confirm('This will replace all current data. Continue?')) {
            // Import to IndexedDB
            await dbOps.importAllData(data);
            
            // Reload data from IndexedDB
            const loadedProducts = await dbOps.getAllProducts();
            const loadedMovements = await dbOps.getAllMovements();
            
            setProducts(loadedProducts);
            setMovements(loadedMovements);
            if (data.settings && data.settings.lowStockThreshold) {
              setLowStockThreshold(data.settings.lowStockThreshold);
            }
            setIsDemoMode(false);
            alert('Data imported successfully!');
          }
        } else {
          alert('Invalid backup file format');
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Tutorial system
  const tutorialSteps = [
    {
      title: "Welcome to Inventory Tracker! 🎉",
      description: "Let's take a quick tour to help you get started. This will only take 2 minutes.",
      target: null,
      highlight: "dashboard"
    },
    {
      title: "Dashboard Overview",
      description: "Monitor your key metrics: total products, stock levels, value, and profit margins at a glance.",
      target: "dashboard",
      highlight: "dashboard"
    },
    {
      title: "Add Products",
      description: "Click 'Add Product' to create your inventory. Add SKU, name, pricing, images, and stock levels.",
      target: "addButton",
      highlight: "addButton"
    },
    {
      title: "Track Movements",
      description: "Record stock changes with the 'Movement' button. Track incoming and outgoing inventory.",
      target: "movementButton",
      highlight: "movementButton"
    },
    {
      title: "Stay Safe with Backups",
      description: "Your data is stored locally. Regular backups prevent data loss. Access backup in Settings.",
      target: "settingsButton",
      highlight: "settingsButton"
    },
    {
      title: "You're All Set!",
      description: "Start by adding your first product or exploring with demo data. Happy tracking!",
      target: null,
      highlight: null
    }
  ];

  const nextTutorialStep = async () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      await dbOps.setSetting('hasSeenTutorial', 'true');
    }
  };

  const skipTutorial = async () => {
    setShowTutorial(false);
    await dbOps.setSetting('hasSeenTutorial', 'true');
  };

  // Image file picker handler
  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB', 'error');
        return;
      }
      
      // Convert to base64 data URL for local storage
      setImageLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductForm({...productForm, image: event.target.result});
        setImageLoading(false);
        showToast('Image uploaded successfully!', 'success');
      };
      reader.onerror = () => {
        setImageLoading(false);
        showToast('Failed to load image', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle expanded product row
  const toggleExpandProduct = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // ===== NEW FEATURES =====
  
  // Movement History & Audit Trail
  const viewMovementHistory = (product) => {
    setSelectedProductHistory(product);
    setShowMovementHistory(true);
  };

  const getProductMovements = (productId) => {
    return movements
      .filter(m => m.productId === productId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Bulk Operations (additional functions)
  const bulkChangeCategory = (newCategory) => {
    if (selectedProducts.length === 0) {
      showToast('No products selected', 'error');
      return;
    }
    
    setProducts(products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, category: newCategory } : p
    ));
    showToast(`Category updated for ${selectedProducts.length} product(s)`, 'success');
    setSelectedProducts([]);
  };

  const bulkChangeSupplier = (newSupplier) => {
    if (selectedProducts.length === 0) {
      showToast('No products selected', 'error');
      return;
    }
    
    setProducts(products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, supplier: newSupplier } : p
    ));
    showToast(`Supplier updated for ${selectedProducts.length} product(s)`, 'success');
    setSelectedProducts([]);
  };

  // Calculations
  const formatCurrency = (amount) => {
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const potentialRevenue = products.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0);
  const potentialProfit = potentialRevenue - totalValue;
  const totalTaxLiability = products.reduce((sum, p) => sum + (p.quantity * p.salePrice * (p.taxRate || 0)), 0);
  const avgMargin = totalValue > 0 ? ((potentialProfit / totalValue) * 100) : 0;
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= p.reorderPoint);
  const outOfStock = products.filter(p => p.quantity === 0);
  const inStock = products.filter(p => p.quantity > p.reorderPoint);

  // Category analytics
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const sourceWebsites = [...new Set(products.map(p => p.sourceWebsite))].filter(Boolean).sort();
  const categoryData = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const value = catProducts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
    const revenue = catProducts.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0);
    const units = catProducts.reduce((sum, p) => sum + p.quantity, 0);
    return {
      name: cat,
      value: value,
      revenue: revenue,
      profit: revenue - value,
      count: catProducts.length,
      units: units
    };
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (p.sourceWebsite && p.sourceWebsite.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchesStatus = filterStatus === 'all' ||
                           (filterStatus === 'low' && p.quantity > 0 && p.quantity <= p.reorderPoint) ||
                           (filterStatus === 'out' && p.quantity === 0) ||
                           (filterStatus === 'in-stock' && p.quantity > p.reorderPoint);
      const matchesSource = filterSourceWebsite === 'all' || p.sourceWebsite === filterSourceWebsite;
      return matchesSearch && matchesCategory && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case 'name': aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break;
        case 'sku': aVal = a.sku; bVal = b.sku; break;
        case 'quantity': aVal = a.quantity; bVal = b.quantity; break;
        case 'value': aVal = a.quantity * a.costPrice; bVal = b.quantity * b.costPrice; break;
        case 'margin': aVal = (a.salePrice - a.costPrice) / a.costPrice; bVal = (b.salePrice - b.costPrice) / b.costPrice; break;
        default: aVal = a.name; bVal = b.name;
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // ===== CHART DATA PREPARATION =====
  
  // Top 5 products by value
  const topProductsByValue = products
    .map(p => ({
      name: p.name,
      value: p.quantity * p.costPrice,
      quantity: p.quantity
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Top 5 products by profit margin
  const topProductsByMargin = products
    .filter(p => p.costPrice > 0 && p.salePrice > 0)
    .map(p => ({
      name: p.name,
      margin: ((p.salePrice - p.costPrice) / p.costPrice) * 100,
      profit: (p.salePrice - p.costPrice) * p.quantity
    }))
    .filter(p => !isNaN(p.margin) && isFinite(p.margin))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  // Stock status distribution
  const stockStatusData = [
    { name: 'In Stock', value: inStock.length, color: '#10b981' },
    { name: 'Low Stock', value: lowStockItems.length, color: '#f59e0b' },
    { name: 'Out of Stock', value: outOfStock.length, color: '#ef4444' }
  ];

  // Category breakdown by value
  const categoryValueData = categoryData.map((cat, idx) => ({
    name: cat.name,
    value: cat.value,
    revenue: cat.revenue,
    units: cat.units,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Demo Mode Warning Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-2xl p-4 mb-4 text-white border-2 border-amber-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={28} className="animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg">🎮 Demo Mode Active - Your Real Data is Safe!</h3>
                  <p className="text-sm text-amber-50">
                    You're exploring with sample data. Changes here won't affect your saved inventory. 
                    Click "Switch to Real Mode" in Settings when ready to work with your actual data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 font-bold whitespace-nowrap"
              >
                Switch to Real Mode
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Enterprise Inventory System</h1>
              <p className="text-blue-100 text-lg flex items-center gap-2">
                Advanced Analytics • Real-Time Tracking
                {isDemoMode && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <Info size={14} />
                    DEMO MODE
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              {undoStack.length > 0 && (
                <button
                  onClick={undo}
                  className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 flex items-center gap-2 font-semibold shadow-lg"
                  title="Undo last action"
                >
                  <Undo2 size={20} />
                </button>
              )}
              <button
                onClick={() => setShowTutorial(true)}
                className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 flex items-center gap-2 font-semibold shadow-lg"
                title="Show tutorial"
              >
                <HelpCircle size={20} />
              </button>
              {lowStockItems.length > 0 && (
                <button
                  onClick={generateShoppingList}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 flex items-center gap-2 font-semibold shadow-lg animate-pulse"
                  title="Generate Shopping List"
                >
                  <ShoppingCart size={20} />
                  <span className="hidden md:inline">Reorder ({lowStockItems.length})</span>
                </button>
              )}
              <button
                onClick={printReport}
                className="px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 flex items-center gap-2 font-semibold shadow-lg"
                title="Print Report"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={() => setShowWebCrawler(true)}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 font-semibold shadow-lg"
                title="Import from Website"
              >
                <Globe size={20} />
                <span className="hidden md:inline">Web Import</span>
              </button>
              <button
                onClick={() => validateProductImages()}
                className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 flex items-center gap-2 font-semibold shadow-lg"
                title="Validate product images and fix broken links"
              >
                <Image size={20} />
                <span className="hidden md:inline">Check Images</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 flex items-center gap-2 font-semibold shadow-lg"
              >
                <Tag size={20} />
                Settings
              </button>
              <button
                onClick={() => setShowMovement(true)}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 flex items-center gap-2 font-semibold shadow-lg transition-all hover:scale-105"
              >
                <TrendingUp size={20} />
                Movement
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 flex items-center gap-2 font-semibold shadow-lg transition-all hover:scale-105"
              >
                <PlusCircle size={20} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Data Safety Warning Banner */}
        {!isDemoMode && products.length > 0 && (!lastBackupDate || (new Date() - lastBackupDate) / (1000 * 60 * 60 * 24) > 7) && (
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="text-amber-500 mt-0.5" size={24} />
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">Protect Your Inventory Data</h4>
                <p className="text-slate-300 text-sm mb-2">
                  Your data is stored locally. Create regular backups to prevent loss.
                  {lastBackupDate && ` Last backup: ${lastBackupDate.toLocaleDateString()}`}
                </p>
                <button
                  onClick={() => setShowBackupReminder(true)}
                  className="text-sm text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Download size={16} />
                  Backup Now
                </button>
              </div>
              <button
                onClick={() => {
                  const hideUntil = new Date();
                  hideUntil.setDate(hideUntil.getDate() + 1);
                  localStorage.setItem('hideBackupWarningUntil', hideUntil.toISOString());
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-slate-800 rounded-xl shadow-xl mb-6 border border-slate-700">
          <div className="flex">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'products', icon: Package, label: 'Products' },
              { id: 'movements', icon: TrendingUp, label: 'Movements' },
              { id: 'reports', icon: FileText, label: 'Reports' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Products', value: totalProducts, icon: Package, color: 'blue' },
                { label: 'Total Units', value: totalUnits, icon: ShoppingCart, color: 'emerald' },
                { label: 'Inventory Value', value: `$${totalValue.toFixed(0)}`, icon: DollarSign, color: 'purple' },
                { label: 'Potential Profit', value: `$${potentialProfit.toFixed(0)}`, icon: TrendingUp, color: 'amber' },
                { label: 'Avg Margin', value: `${avgMargin.toFixed(1)}%`, icon: BarChart3, color: 'cyan' }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div key={idx} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 bg-${kpi.color}-500/20 rounded-lg`}>
                        <Icon className={`text-${kpi.color}-400`} size={24} />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">{kpi.label}</p>
                    <p className="text-white text-2xl font-bold">{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Stock Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
                <h3 className="text-white text-lg font-bold mb-4">Stock Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg">
                    <span className="text-emerald-300 font-semibold">In Stock</span>
                    <span className="text-emerald-400 text-2xl font-bold">{inStock.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-900/20 border border-amber-700 rounded-lg">
                    <span className="text-amber-300 font-semibold">Low Stock</span>
                    <span className="text-amber-400 text-2xl font-bold">{lowStockItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <span className="text-red-300 font-semibold">Out of Stock</span>
                    <span className="text-red-400 text-2xl font-bold">{outOfStock.length}</span>
                  </div>
                </div>
                
                {/* View Charts Button */}
                <button
                  onClick={() => setShowCharts(true)}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 font-semibold shadow-lg"
                >
                  <BarChart3 size={20} />
                  View Analytics Charts
                </button>
              </div>

              {/* Alerts */}
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl lg:col-span-2">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-red-400" />
                  Critical Alerts
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {outOfStock.slice(0, 3).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-red-900/20 border border-red-700 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{p.name}</p>
                        <p className="text-red-300 text-sm">{p.sku}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">OUT</span>
                    </div>
                  ))}
                  {lowStockItems.slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{p.name}</p>
                        <p className="text-amber-300 text-sm">{p.quantity} left</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">LOW</span>
                    </div>
                  ))}
                  {outOfStock.length === 0 && lowStockItems.length === 0 && (
                    <p className="text-slate-400 text-center py-8">All stock levels optimal! 🎉</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                  value={filterSourceWebsite}
                  onChange={(e) => setFilterSourceWebsite(e.target.value)}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  title="Filter by source website"
                >
                  <option value="all">All Sources</option>
                  {sourceWebsites.map(source => (
                    <option key={source} value={source}>
                      {source || 'Unknown'}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="name">Sort by Name</option>
                  <option value="sku">Sort by SKU</option>
                  <option value="quantity">Sort by Quantity</option>
                  <option value="value">Sort by Value</option>
                  <option value="margin">Sort by Margin</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg hover:bg-slate-600"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              
              <div className="flex gap-3">
                {selectedProducts.length > 0 && (
                  <>
                    <button
                      onClick={bulkDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete ({selectedProducts.length})
                    </button>
                    <button
                      onClick={() => setShowBulkActions(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Bulk Edit ({selectedProducts.length})
                    </button>
                  </>
                )}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-4">
                        <button onClick={toggleSelectAll}>
                          {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? 
                            <CheckSquare className="text-blue-400" size={20} /> : 
                            <Square className="text-slate-400" size={20} />
                          }
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">SKU</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Stock</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Cost</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Price</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Margin</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const margin = ((p.salePrice - p.costPrice) / p.costPrice * 100);
                      const isSelected = selectedProducts.includes(p.id);
                      const isExpanded = expandedProductId === p.id;
                      return (
                        <React.Fragment key={p.id}>
                          <tr className={`border-t border-slate-700 hover:bg-slate-700/30 ${isSelected ? 'bg-blue-900/20' : ''} ${isExpanded ? 'bg-slate-700/50' : ''}`}>
                            <td className="px-4 py-4">
                              <button onClick={() => toggleSelectProduct(p.id)}>
                                {isSelected ? 
                                  <CheckSquare className="text-blue-400" size={20} /> : 
                                  <Square className="text-slate-400" size={20} />
                                }
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => toggleExpandProduct(p.id)}
                                className="relative group"
                                title="Click to view larger image"
                              >
                                {p.image ? (
                                  <>
                                    <img 
                                      src={p.image} 
                                      alt={p.name}
                                      className="w-12 h-12 object-cover rounded-lg border border-slate-600 cursor-pointer hover:border-blue-400 transition-colors"
                                      onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%23475569" width="48" height="48"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23cbd5e1" font-size="10">No Image</text></svg>'}
                                    />
                                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ChevronRight size={12} className={`text-white transform ${isExpanded ? 'rotate-90' : ''} transition-transform`} />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-12 h-12 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                                    <Image size={20} className="text-slate-500" />
                                  </div>
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-slate-300 font-mono text-sm">{p.sku}</td>
                            <td className="px-6 py-4">
                              <div className="text-white font-semibold">{p.name}</div>
                              {p.location && (
                                <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                                  <MapPin size={12} />
                                  {p.location}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {p.category && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
                                  {p.category}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-bold text-lg ${
                                p.quantity === 0 ? 'text-red-400' :
                                p.quantity <= p.reorderPoint ? 'text-amber-400' :
                                'text-emerald-400'
                              }`}>
                                {p.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-300">${p.costPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-white font-semibold">${p.salePrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-semibold ${margin > 100 ? 'text-emerald-400' : margin > 50 ? 'text-blue-400' : 'text-slate-400'}`}>
                                {margin.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => viewMovementHistory(p)}
                                  className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"
                                  title="View Movement History"
                                >
                                  <Calendar size={16} />
                                </button>
                                <button
                                  onClick={() => editProduct(p)}
                                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="border-t border-slate-700 bg-slate-700/30">
                              <td colSpan="10" className="px-6 py-6">
                                <div className="flex gap-6">
                                  {p.image ? (
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={p.image} 
                                        alt={p.name}
                                        className="w-64 h-64 object-cover rounded-lg border-2 border-slate-600 shadow-lg"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div className="hidden w-64 h-64 bg-slate-700 rounded-lg border-2 border-slate-600 items-center justify-center">
                                        <div className="text-center">
                                          <Image size={48} className="text-slate-500 mx-auto mb-2" />
                                          <p className="text-slate-400 text-sm">Image failed to load</p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex-shrink-0 w-64 h-64 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                                      <div className="text-center">
                                        <Image size={48} className="text-slate-500 mx-auto mb-2" />
                                        <p className="text-slate-400 text-sm">No image available</p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-semibold text-slate-400 mb-1">Product Details</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">SKU:</span>
                                          <span className="text-white font-mono">{p.sku}</span>
                                        </div>
                                        {p.brand && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Brand:</span>
                                            <span className="text-white font-semibold">{p.brand}</span>
                                          </div>
                                        )}
                                        {p.model && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Model:</span>
                                            <span className="text-white font-mono text-xs">{p.model}</span>
                                          </div>
                                        )}
                                        {p.barcode && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Barcode:</span>
                                            <span className="text-white font-mono text-xs">{p.barcode}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Supplier:</span>
                                          <span className="text-white">{p.supplier || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Location:</span>
                                          <span className="text-white">{p.location || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Last Restocked:</span>
                                          <span className="text-white">{p.lastRestocked || 'N/A'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-semibold text-slate-400 mb-1">Stock & Attributes</h3>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Current Stock:</span>
                                          <span className="text-emerald-400 font-bold">{p.quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-400">Reorder Point:</span>
                                          <span className="text-white">{p.reorderPoint}</span>
                                        </div>
                                        {p.color && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Color:</span>
                                            <span className="text-white">{p.color}</span>
                                          </div>
                                        )}
                                        {p.size && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Size:</span>
                                            <span className="text-white">{p.size}</span>
                                          </div>
                                        )}
                                        {p.weight && (
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Weight:</span>
                                            <span className="text-white">{p.weight}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {p.description && (
                                      <div className="col-span-2">
                                        <h3 className="text-sm font-semibold text-slate-400 mb-1">Description</h3>
                                        <p className="text-slate-300 text-sm bg-slate-800 rounded p-3 leading-relaxed">{p.description}</p>
                                      </div>
                                    )}
                                    {p.notes && (
                                      <div className="col-span-2">
                                        <h3 className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1">
                                          <Shield size={14} />
                                          Internal Notes
                                        </h3>
                                        <p className="text-white text-sm bg-slate-800 rounded p-3 border-l-2 border-amber-500">{p.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Movements Tab */}
        {activeTab === 'movements' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-400" />
                Movement History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">SKU</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Notes</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map(m => (
                    <tr key={m.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-slate-300">{m.date}</td>
                      <td className="px-6 py-4 text-white font-semibold">{m.productName}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-sm">{m.productSku}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 ${
                          m.type === 'in' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {m.type === 'in' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {m.type === 'in' ? 'In' : 'Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-xl font-bold ${m.type === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {m.type === 'in' ? '+' : '-'}{m.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{m.notes}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editMovement(m)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteMovement(m.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {movements.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No movements recorded</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Business Health Score */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Weekly Business Health</h2>
                  <p className="text-blue-100">Your performance snapshot & action items</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white">
                    {totalProducts > 0 && potentialProfit > 0 ? '💚' : totalProducts > 0 ? '💛' : '❤️'}
                  </div>
                  <div className="text-white text-sm mt-2">
                    {totalProducts > 0 && potentialProfit > 0 ? 'Healthy' : totalProducts > 0 ? 'Needs Attention' : 'Action Required'}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-emerald-500/50 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Cash in Inventory</span>
                  <TrendingUp className="text-emerald-400" size={20} />
                </div>
                <div className="text-2xl font-bold text-emerald-400">${totalValue.toFixed(0)}</div>
                <div className="text-xs text-slate-500 mt-1">{totalProducts} products</div>
              </div>

              <div className="bg-slate-800 border border-blue-500/50 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Potential Profit</span>
                  <DollarSign className="text-blue-400" size={20} />
                </div>
                <div className="text-2xl font-bold text-blue-400">${potentialProfit.toFixed(0)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {potentialProfit > 0 ? ((potentialProfit/totalValue)*100).toFixed(0) : 0}% margin
                </div>
              </div>

              <div className="bg-slate-800 border border-purple-500/50 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Avg Margin</span>
                  <BarChart3 className="text-purple-400" size={20} />
                </div>
                <div className="text-2xl font-bold text-purple-400">{avgMargin.toFixed(1)}%</div>
                <div className="text-xs text-slate-500 mt-1">
                  {avgMargin > 100 ? 'Excellent' : avgMargin > 50 ? 'Good' : 'Low'}
                </div>
              </div>

              <div className="bg-slate-800 border border-red-500/50 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Stock Alerts</span>
                  <AlertTriangle className="text-red-400" size={20} />
                </div>
                <div className="text-2xl font-bold text-red-400">{lowStockItems.length + outOfStock.length}</div>
                <div className="text-xs text-slate-500 mt-1">{outOfStock.length} out, {lowStockItems.length} low</div>
              </div>
            </div>

            {/* Top Performers & Problem Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Money Makers */}
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="text-yellow-400" size={24} />
                    Top 5 Money Makers
                  </h3>
                </div>
                <div className="space-y-3">
                  {products
                    .filter(p => p.quantity > 0)
                    .sort((a, b) => {
                      const profitA = (a.salePrice - a.costPrice) * a.quantity;
                      const profitB = (b.salePrice - b.costPrice) * b.quantity;
                      return profitB - profitA;
                    })
                    .slice(0, 5)
                    .map((product, idx) => {
                      const profit = (product.salePrice - product.costPrice) * product.quantity;
                      const margin = ((product.salePrice - product.costPrice) / product.costPrice * 100);
                      return (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              idx === 0 ? 'bg-yellow-500 text-black' : 
                              idx === 1 ? 'bg-slate-400 text-black' : 
                              idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-600 text-white'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{product.name}</div>
                              <div className="text-xs text-slate-400">{product.quantity} units • {margin.toFixed(0)}% margin</div>
                            </div>
                          </div>
                          <div className="text-emerald-400 font-bold">${profit.toFixed(0)}</div>
                        </div>
                      );
                    })}
                  {products.filter(p => p.quantity > 0).length === 0 && (
                    <div className="text-center text-slate-400 py-8">No products in stock</div>
                  )}
                </div>
              </div>

              {/* Problem Products */}
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertCircle className="text-red-400" size={24} />
                    Needs Attention
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* Out of Stock */}
                  {products
                    .filter(p => p.quantity === 0)
                    .slice(0, 3)
                    .map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <XCircle className="text-red-400" size={20} />
                          <div>
                            <div className="text-white font-semibold">{product.name}</div>
                            <div className="text-xs text-red-300">Out of Stock</div>
                          </div>
                        </div>
                        <div className="text-red-400 text-sm font-bold">REORDER</div>
                      </div>
                    ))}
                  
                  {/* Low Stock */}
                  {products
                    .filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 10))
                    .slice(0, 3 - products.filter(p => p.quantity === 0).length)
                    .map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="text-yellow-400" size={20} />
                          <div>
                            <div className="text-white font-semibold">{product.name}</div>
                            <div className="text-xs text-yellow-300">{product.quantity} left • Min: {product.minStock || 10}</div>
                          </div>
                        </div>
                        <div className="text-yellow-400 text-sm font-bold">LOW</div>
                      </div>
                    ))}

                  {/* Low Margin Products */}
                  {products
                    .filter(p => {
                      const margin = ((p.salePrice - p.costPrice) / p.costPrice * 100);
                      return margin < 30 && p.quantity > 0;
                    })
                    .slice(0, 3 - products.filter(p => p.quantity === 0 || (p.quantity > 0 && p.quantity <= (p.minStock || 10))).length)
                    .map(product => {
                      const margin = ((product.salePrice - product.costPrice) / product.costPrice * 100);
                      return (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingDown className="text-orange-400" size={20} />
                            <div>
                              <div className="text-white font-semibold">{product.name}</div>
                              <div className="text-xs text-orange-300">Low margin: {margin.toFixed(0)}%</div>
                            </div>
                          </div>
                          <div className="text-orange-400 text-sm font-bold">REVIEW</div>
                        </div>
                      );
                    })}

                  {products.filter(p => p.quantity === 0 || p.quantity <= (p.minStock || 10)).length === 0 && 
                   products.filter(p => ((p.salePrice - p.costPrice) / p.costPrice * 100) < 30).length === 0 && (
                    <div className="text-center text-slate-400 py-8 flex flex-col items-center gap-2">
                      <CheckCircle className="text-emerald-400" size={32} />
                      <div>All products healthy! 🎉</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Items & Recommendations */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-blue-400" size={24} />
                Smart Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Reorder Now */}
                {products.filter(p => p.quantity === 0 || p.quantity <= (p.reorderPoint || 15)).length > 0 && (
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="text-white" size={20} />
                      <span className="text-white font-bold">Reorder Priority</span>
                    </div>
                    <div className="text-blue-100 text-sm mb-2">
                      {products.filter(p => p.quantity === 0 || p.quantity <= (p.reorderPoint || 15)).length} products need restocking
                    </div>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-white"
                    >
                      View Products →
                    </button>
                  </div>
                )}

                {/* High ROI Products */}
                {products.filter(p => {
                  const margin = ((p.salePrice - p.costPrice) / p.costPrice * 100);
                  return margin > 100 && p.quantity > 0;
                }).length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-white" size={20} />
                      <span className="text-white font-bold">Stock Up Winners</span>
                    </div>
                    <div className="text-emerald-100 text-sm mb-2">
                      {products.filter(p => ((p.salePrice - p.costPrice) / p.costPrice * 100) > 100 && p.quantity > 0).length} high-margin products
                    </div>
                    <div className="text-xs text-emerald-200">
                      Focus on products with 100%+ margins
                    </div>
                  </div>
                )}

                {/* Profit Opportunity */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-white" size={20} />
                    <span className="text-white font-bold">Profit Potential</span>
                  </div>
                  <div className="text-purple-100 text-sm mb-2">
                    ${potentialProfit.toFixed(0)} if you sell all inventory
                  </div>
                  <div className="text-xs text-purple-200">
                    Current ROI: {totalValue > 0 ? ((potentialProfit/totalValue)*100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl">
                <h3 className="text-white text-2xl font-bold mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Total Products</span>
                    <span className="text-white text-xl font-bold">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Inventory Value</span>
                    <span className="text-emerald-400 text-xl font-bold">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Potential Revenue</span>
                    <span className="text-blue-400 text-xl font-bold">${potentialRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700">
                    <span className="text-slate-400">Potential Profit</span>
                    <span className="text-purple-400 text-xl font-bold">${potentialProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-400">Tax Liability</span>
                    <span className="text-red-400 text-xl font-bold">${totalTaxLiability.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl">
                <h3 className="text-white text-2xl font-bold mb-6">Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="units"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to Inventory Tracker! 🎉</h2>
            <p className="text-slate-300 mb-6">
              This system helps you track inventory, monitor stock levels, and analyze business performance. 
              You're currently viewing demo data to explore features.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Demo mode lets you explore without affecting real data</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Click "Start Fresh" in settings to begin with your own inventory</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-slate-300">All data is saved locally in your browser</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWelcome(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                Explore Demo
              </button>
              <button
                onClick={() => {
                  startFresh();
                  setShowWelcome(false);
                }}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 font-semibold"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-2xl font-bold text-white">Settings & Data Management</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                />
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Shield size={20} />
                  Data Management
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  {isDemoMode 
                    ? '🎮 You\'re in DEMO MODE - Changes are temporary and won\'t be saved'
                    : '✅ REAL MODE - All changes are automatically saved to your device'
                  }
                </p>
                <div className="space-y-3">
                  {isDemoMode && (
                    <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 mb-3">
                      <h5 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                        <Info size={16} />
                        Ready to start tracking your real inventory?
                      </h5>
                      <p className="text-blue-200 text-sm mb-3">
                        Click below to save the demo data as your starting point, or clear it to start fresh.
                      </p>
                      <button
                        onClick={() => {
                          switchToRealMode();
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-bold"
                      >
                        <Package size={20} />
                        Save Demo Data & Switch to Real Mode
                      </button>
                    </div>
                  )}
                  
                  {!isDemoMode && (
                    <div className="bg-emerald-900/30 border-2 border-emerald-500 rounded-lg p-3 mb-3">
                      <p className="text-emerald-200 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        <strong>Protected:</strong> Your data is saved and won't be lost on refresh
                      </p>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => {
                      if (isDemoMode) {
                        showToast('⚠️ Backup only works in Real Mode. Switch to Real Mode first, then backup your data.', 'warning');
                      }
                    }}
                    className={isDemoMode ? 'cursor-not-allowed' : ''}
                  >
                    <button
                      onClick={exportData}
                      disabled={isDemoMode}
                      className={`w-full px-4 py-3 ${
                        isDemoMode 
                          ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      } text-white rounded-lg flex items-center justify-center gap-2 font-semibold`}
                      title={isDemoMode ? 'Only available in Real Mode' : 'Download backup of all your data'}
                    >
                      <Download size={20} />
                      Backup All Data (JSON)
                      {isDemoMode && <span className="text-xs ml-2">🔒 Real Mode Only</span>}
                    </button>
                  </div>
                  <label className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 cursor-pointer font-semibold">
                    <Upload size={20} />
                    Restore from Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                  
                  <div className="border-t border-slate-600 pt-3 mt-3">
                    <p className="text-slate-400 text-xs mb-2">Exploration & Reset:</p>
                    <button
                      onClick={() => {
                        loadDemoData();
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 font-semibold mb-2"
                    >
                      <RefreshCw size={20} />
                      Load Demo Data (Explore Features)
                    </button>
                    <button
                      onClick={() => {
                        startFresh();
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 size={20} />
                      ⚠️ Permanently Delete All Real Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={resetProductForm} className="text-slate-400 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">SKU *</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.sku ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                    placeholder="PROD-001"
                  />
                  {validationErrors.sku && <p className="text-red-400 text-sm mt-1">{validationErrors.sku}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.name ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                    placeholder="Product name"
                  />
                  {validationErrors.name && <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.quantity ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                  />
                  {validationErrors.quantity && <p className="text-red-400 text-sm mt-1">{validationErrors.quantity}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Cost Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.costPrice}
                    onChange={(e) => setProductForm({...productForm, costPrice: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.costPrice ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                  />
                  {validationErrors.costPrice && <p className="text-red-400 text-sm mt-1">{validationErrors.costPrice}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Sale Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.salePrice}
                    onChange={(e) => setProductForm({...productForm, salePrice: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.salePrice ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                  />
                  {validationErrors.salePrice && <p className="text-red-400 text-sm mt-1">{validationErrors.salePrice}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.taxRate * 100}
                    onChange={(e) => setProductForm({...productForm, taxRate: parseFloat(e.target.value) / 100})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Min Stock</label>
                  <input
                    type="number"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({...productForm, minStock: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Reorder Point</label>
                  <input
                    type="number"
                    value={productForm.reorderPoint}
                    onChange={(e) => setProductForm({...productForm, reorderPoint: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.reorderPoint ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                  />
                  {validationErrors.reorderPoint && <p className="text-red-400 text-sm mt-1">{validationErrors.reorderPoint}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Max Stock</label>
                  <input
                    type="number"
                    value={productForm.maxStock}
                    onChange={(e) => setProductForm({...productForm, maxStock: e.target.value})}
                    className={`w-full px-4 py-3 bg-slate-700 border ${validationErrors.maxStock ? 'border-red-500' : 'border-slate-600'} text-white rounded-lg`}
                  />
                  {validationErrors.maxStock && <p className="text-red-400 text-sm mt-1">{validationErrors.maxStock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Supplier</label>
                  <input
                    type="text"
                    value={productForm.supplier}
                    onChange={(e) => setProductForm({...productForm, supplier: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={productForm.location}
                    onChange={(e) => setProductForm({...productForm, location: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Image size={16} />
                  Product Image
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    placeholder="https://example.com/product-image.jpg or upload file"
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  />
                  <label className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg cursor-pointer hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 font-semibold">
                    <Upload size={16} />
                    {imageLoading ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      className="hidden"
                      disabled={imageLoading}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Recommended: 400x400px square image, max 5MB. Supports JPG, PNG, GIF, WebP
                </p>
                {imageLoading && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing image...</span>
                  </div>
                )}
                {productForm.image && !imageLoading && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">Preview:</p>
                    <img 
                      src={productForm.image} 
                      alt="Product preview"
                      className="w-24 h-24 object-cover rounded-lg border border-slate-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p className="text-red-400 text-sm mt-1" style={{display: 'none'}}>
                      Failed to load image
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Product Details Section */}
              <div className="border-t border-slate-700 pt-4 mt-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Additional Product Details
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Barcode / UPC
                    </label>
                    <input
                      type="text"
                      value={productForm.barcode || ''}
                      onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg font-mono"
                      placeholder="123456789012"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      value={productForm.brand || ''}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                      placeholder="e.g., Milwaukee, DeWalt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Model Number
                    </label>
                    <input
                      type="text"
                      value={productForm.model || ''}
                      onChange={(e) => setProductForm({...productForm, model: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg font-mono"
                      placeholder="M12-2450P"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={productForm.color || ''}
                      onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                      placeholder="Red, Blue, Black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Size / Dimensions
                    </label>
                    <input
                      type="text"
                      value={productForm.size || ''}
                      onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                      placeholder="12V, Large, 10x5x3"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                    rows="3"
                    placeholder="Detailed product description for customers..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Internal Notes (Private)</label>
                <textarea
                  value={productForm.notes}
                  onChange={(e) => setProductForm({...productForm, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  rows="2"
                  placeholder="Private notes for internal use only..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={resetProductForm}
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {showMovement && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                {editingMovement ? 'Edit Movement' : 'Record Movement'}
              </h3>
              <button
                onClick={() => {
                  setShowMovement(false);
                  setEditingMovement(null);
                  setMovementForm({
                    productId: '', type: 'in', quantity: 0, notes: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Product *</label>
                <select
                  value={movementForm.productId}
                  onChange={(e) => setMovementForm({...movementForm, productId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Stock: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Type *</label>
                <select
                  value={movementForm.type}
                  onChange={(e) => setMovementForm({...movementForm, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="in">Stock In (Add)</option>
                  <option value="out">Stock Out (Remove)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({...movementForm, quantity: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={movementForm.date}
                  onChange={(e) => setMovementForm({...movementForm, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Notes</label>
                <textarea
                  value={movementForm.notes}
                  onChange={(e) => setMovementForm({...movementForm, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  rows="3"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowMovement(false);
                  setEditingMovement(null);
                  setMovementForm({
                    productId: '', type: 'in', quantity: 0, notes: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleMovement}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
              >
                {editingMovement ? 'Update' : 'Record'} Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Reminder Modal */}
      {showBackupReminder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border-2 border-amber-500 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                <Shield size={32} className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Backup Your Data</h3>
              <p className="text-slate-300 mb-6">
                {!lastBackupDate 
                  ? "You haven't backed up your inventory yet. Protect your data from loss!"
                  : `Last backup: ${lastBackupDate.toLocaleDateString()}. Time for a fresh backup!`
                }
              </p>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300 mb-2">
                  <strong className="text-amber-400">⚠️ Important:</strong> Your data is stored locally in your browser.
                </p>
                <ul className="text-xs text-slate-400 space-y-1 text-left">
                  <li>• Clearing browser data will delete everything</li>
                  <li>• Backups let you restore on any device</li>
                  <li>• We recommend weekly backups</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBackupReminder(false)}
                  className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Remind Later
                </button>
                <button
                  onClick={() => {
                    exportData();
                    setShowBackupReminder(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Backup Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-blue-500 rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-400" />
                  {tutorialSteps[tutorialStep].title}
                </h3>
                <button onClick={skipTutorial} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-300 text-lg mb-6">
                {tutorialSteps[tutorialStep].description}
              </p>
              <div className="flex items-center gap-2 mb-6">
                {tutorialSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx === tutorialStep ? 'bg-blue-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Step {tutorialStep + 1} of {tutorialSteps.length}
                </span>
                <div className="flex gap-3">
                  {tutorialStep > 0 && (
                    <button
                      onClick={() => setTutorialStep(tutorialStep - 1)}
                      className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={nextTutorialStep}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold flex items-center gap-2"
                  >
                    {tutorialStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Modal */}
      {showMovementHistory && selectedProductHistory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex justify-between items-center">
              <h3 className="text-white text-2xl font-bold">Movement History</h3>
              <button onClick={() => setShowMovementHistory(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-slate-700 p-4 rounded-lg mb-6">
                <h4 className="text-white text-xl font-bold">{selectedProductHistory.name}</h4>
                <p className="text-slate-300">SKU: {selectedProductHistory.sku}</p>
                <p className="text-slate-300">Current Stock: <span className="font-bold text-blue-400">{selectedProductHistory.quantity}</span></p>
              </div>
              
              {getProductMovements(selectedProductHistory.id).length > 0 ? (
                <div className="space-y-4">
                  <h5 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Calendar size={20} />
                    Movement Timeline
                  </h5>
                  {getProductMovements(selectedProductHistory.id).map((movement, idx) => (
                    <div key={movement.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {movement.type === 'in' ? <ArrowDownRight className="text-white" size={20} /> : <ArrowUpRight className="text-white" size={20} />}
                        </div>
                        {idx < getProductMovements(selectedProductHistory.id).length - 1 && (
                          <div className="w-0.5 h-16 bg-slate-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              movement.type === 'in' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {movement.type === 'in' ? 'STOCK IN' : 'STOCK OUT'}
                            </span>
                            <span className="ml-3 text-white font-bold text-lg">{movement.quantity} units</span>
                          </div>
                          <span className="text-slate-400 text-sm">{new Date(movement.timestamp).toLocaleString()}</span>
                        </div>
                        {movement.notes && (
                          <p className="text-slate-300 text-sm mt-2 flex items-start gap-2">
                            <FileText size={14} className="mt-0.5 flex-shrink-0" />
                            {movement.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No movement history for this product yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-700">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
              <h3 className="text-white text-2xl font-bold">Bulk Edit ({selectedProducts.length} products)</h3>
              <button onClick={() => setShowBulkActions(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Change Category</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      bulkChangeCategory(e.target.value);
                      setShowBulkActions(false);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                >
                  <option value="">Select new category...</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="_new">+ Add New Category</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Change Supplier</label>
                <input
                  type="text"
                  placeholder="Enter new supplier name..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      bulkChangeSupplier(e.target.value.trim());
                      setShowBulkActions(false);
                    }
                  }}
                />
                <p className="text-slate-400 text-sm mt-2">Press Enter to apply</p>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowBulkActions(false)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Modal */}
      {showCharts && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full my-8 border border-slate-700">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                <BarChart3 size={28} />
                Visual Analytics
              </h3>
              <button onClick={() => setShowCharts(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Top Products by Value */}
              <div className="bg-slate-700 p-6 rounded-xl">
                <h4 className="text-white text-xl font-bold mb-4">Top 5 Products by Inventory Value</h4>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProductsByValue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" name="Value ($)" />
                      <Bar dataKey="quantity" fill="#10b981" name="Quantity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top 5 products by profit margin */}
              <div className="bg-slate-700 p-6 rounded-xl">
                <h4 className="text-white text-xl font-bold mb-4">Top 5 Products by Profit Margin</h4>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProductsByMargin}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="margin" fill="#8b5cf6" name="Margin (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stock Status Pie Chart */}
              <div className="bg-slate-700 p-6 rounded-xl">
                <h4 className="text-white text-xl font-bold mb-4">Stock Status Distribution</h4>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={stockStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, value}) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stockStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-slate-700 p-6 rounded-xl">
                <h4 className="text-white text-xl font-bold mb-4">Category Breakdown by Value</h4>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryValueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" name="Cost Value ($)" />
                      <Bar dataKey="revenue" fill="#10b981" name="Potential Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-slide-up ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? (
            <CheckSquare size={20} className="text-white" />
          ) : (
            <AlertTriangle size={20} className="text-white" />
          )}
          <span className="text-white font-medium">{toast.message}</span>
        </div>
      )}

      {/* Website Crawler Modal */}
      {showWebCrawler && (
        <WebsiteCrawler
          onProductsImported={handleCrawledProductsImport}
          onClose={() => setShowWebCrawler(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default InventoryTracker;
