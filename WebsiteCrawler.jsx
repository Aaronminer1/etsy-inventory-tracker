import React, { useState } from 'react';
import { Globe, Download, AlertCircle, CheckCircle, Loader, X, Link as LinkIcon, Package, Image as ImageIcon, DollarSign, Tag } from 'lucide-react';

const WebsiteCrawler = ({ onProductsImported, onClose, showToast }) => {
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [foundProducts, setFoundProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [crawlComplete, setCrawlComplete] = useState(false);
  const [crawlStats, setCrawlStats] = useState(null);
  const [errors, setErrors] = useState([]);

  // Common e-commerce product selectors for different platforms
  const platformSelectors = {
    shopify: {
      container: '.product-item, .grid-product__content, article.product',
      title: 'h3.product-title, .product-item__title, h2.product__title',
      price: '.price, .product-price, .money',
      image: 'img.product-image, .product-item__image img, .product__media img',
      description: '.product-description, .product-item__description',
      sku: '[data-product-sku], .product-sku',
      link: 'a.product-link, a.product-item__link'
    },
    woocommerce: {
      container: '.product, li.product, .woocommerce-LoopProduct-link',
      title: 'h2.woocommerce-loop-product__title, .product-title',
      price: '.price, .woocommerce-Price-amount',
      image: 'img.attachment-woocommerce_thumbnail, .wp-post-image',
      description: '.product-description, .woocommerce-product-details__short-description',
      sku: '.sku',
      link: 'a.woocommerce-LoopProduct-link'
    },
    etsy: {
      container: '[data-listing-id], .listing-link',
      title: 'h3.v2-listing-card__title, .listing-link-title',
      price: '.currency-value, .listing-price',
      image: 'img.listing-image, img[data-listing-card-listing-image]',
      description: '.listing-card-description',
      link: 'a.listing-link'
    },
    generic: {
      container: '[data-product], .product, article.product, .product-card, .product-item',
      title: 'h1, h2, h3, .product-name, .title, [itemprop="name"]',
      price: '[itemprop="price"], .price, .product-price, .cost, .amount',
      image: 'img[itemprop="image"], img.product-image, img[alt*="product"]',
      description: '[itemprop="description"], .description, .product-description, p.desc',
      sku: '[itemprop="sku"], .sku, .product-sku, [data-sku]',
      link: 'a[href*="product"], a.product-link'
    }
  };

  // Detect platform from URL
  const detectPlatform = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('shopify') || urlLower.includes('.myshopify.')) return 'shopify';
    if (urlLower.includes('etsy.com')) return 'etsy';
    if (urlLower.includes('woocommerce')) return 'woocommerce';
    return 'generic';
  };

  // Extract price from text
  const extractPrice = (text) => {
    if (!text) return 0;
    const priceMatch = text.replace(/[^0-9.,]/g, '').match(/[\d,]+\.?\d*/);
    return priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;
  };

  // Generate SKU from product name
  const generateSKU = (name, index) => {
    const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}-${index.toString().padStart(3, '0')}`;
  };

  // Crawl website using backend server
  const crawlWebsite = async () => {
    setCrawling(true);
    setCrawlComplete(false);
    setErrors([]);
    setFoundProducts([]);
    setProgress({ current: 0, total: 0, status: 'Initializing...' });

    try {
      // Validate URL
      const url = new URL(crawlUrl);
      setProgress({ current: 1, total: 4, status: 'Connecting to crawler server...' });

      // Use backend crawler server
      const response = await fetch('http://localhost:3001/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: crawlUrl })
      });

      setProgress({ current: 2, total: 4, status: 'Fetching and parsing website...' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to crawl website');
      }

      setProgress({ current: 3, total: 4, status: `Found ${data.totalExtracted} products...` });

      console.log('Crawl complete, products received:', data.products.length);
      if (data.products.length > 0) {
        console.log('First product from crawler:', data.products[0]);
        console.log('First product image:', data.products[0].image);
      }

      setFoundProducts(data.products);
      setSelectedProducts(data.products.map(p => p.id)); // Select all by default
      setCrawlStats({
        totalFound: data.totalFound,
        platform: data.platform,
        source: url.hostname,
        timestamp: new Date().toISOString()
      });

      setProgress({ current: 4, total: 4, status: 'Complete!' });
      setCrawlComplete(true);
      
      if (data.products.length > 0) {
        showToast(`Successfully found ${data.products.length} products!`, 'success');
      } else {
        showToast('No products found. Try a different URL or check the crawler server logs.', 'warning');
      }

    } catch (error) {
      console.error('Crawl error:', error);
      setErrors(prev => [...prev, error.message]);
      
      // Check if server is running
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setErrors(prev => [...prev, 'Crawler server not running. Start it with: npm run crawler']);
      }
      
      showToast(`Crawl failed: ${error.message}`, 'error');
      setProgress({ current: 0, total: 0, status: 'Failed' });
    } finally {
      setCrawling(false);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAll = () => {
    setSelectedProducts(foundProducts.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedProducts([]);
  };

  const importSelectedProducts = () => {
    const productsToImport = foundProducts.filter(p => selectedProducts.includes(p.id));
    onProductsImported(productsToImport);
    showToast(`Imported ${productsToImport.length} products successfully!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe size={28} className="text-blue-400" />
              Website Product Crawler
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Import products automatically from any e-commerce website
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!crawlComplete ? (
            <>
              {/* URL Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Website URL (Products Page or Store URL)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    placeholder="https://example.com/shop or https://mystore.etsy.com"
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                    disabled={crawling}
                  />
                  <button
                    onClick={crawlWebsite}
                    disabled={!crawlUrl || crawling}
                    className={`px-6 py-3 ${
                      crawling 
                        ? 'bg-slate-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } text-white rounded-lg font-semibold flex items-center gap-2`}
                  >
                    {crawling ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Crawling...
                      </>
                    ) : (
                      <>
                        <Globe size={20} />
                        Start Crawl
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Supported: Shopify, WooCommerce, Etsy, and most standard e-commerce sites
                </p>
              </div>

              {/* Platform Info */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  How It Works
                </h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Automatically detects platform (Shopify, WooCommerce, Etsy, etc.)</li>
                  <li>• Extracts product names, prices, images, and descriptions</li>
                  <li>• Generates unique SKUs for each product</li>
                  <li>• You can review and select which products to import</li>
                  <li>• Stock levels default to 0 (update manually after import)</li>
                </ul>
              </div>

              {/* Progress */}
              {crawling && (
                <div className="bg-slate-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader size={20} className="text-blue-400 animate-spin" />
                    <span className="text-white font-semibold">{progress.status}</span>
                  </div>
                  {progress.total > 0 && (
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <h4 className="text-red-300 font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Errors Encountered
                  </h4>
                  <ul className="text-red-200 text-sm space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Results Summary */}
              <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-emerald-300 font-bold flex items-center gap-2">
                      <CheckCircle size={20} />
                      Crawl Complete!
                    </h4>
                    <p className="text-emerald-200 text-sm mt-1">
                      Found {crawlStats.totalFound} products from {crawlStats.source} ({crawlStats.platform})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAll}
                      className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <Package size={18} />
                  Found Products ({selectedProducts.length} selected)
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {foundProducts.map((product) => (
                    <div 
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedProducts.includes(product.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-slate-500'
                          }`}>
                            {selectedProducts.includes(product.id) && (
                              <CheckCircle size={14} className="text-white" />
                            )}
                          </div>
                        </div>

                        {/* Image */}
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded border border-slate-600"
                            onError={(e) => {
                              console.error('Image failed to load:', product.image, e);
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => console.log('Image loaded successfully:', product.image)}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                            <ImageIcon size={24} className="text-slate-500" />
                            <span className="text-xs text-slate-500 absolute">No image</span>
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1">
                          <h5 className="text-white font-semibold mb-1">{product.name}</h5>
                          <div className="flex gap-4 text-sm">
                            <span className="text-slate-400">
                              <Tag size={12} className="inline mr-1" />
                              {product.sku}
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              <DollarSign size={12} className="inline" />
                              {product.salePrice.toFixed(2)}
                            </span>
                          </div>
                          {product.description && (
                            <p className="text-slate-400 text-xs mt-1 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {crawlComplete && (
          <div className="p-6 border-t border-slate-700 flex justify-between items-center bg-slate-800/50">
            <button
              onClick={() => {
                setCrawlComplete(false);
                setFoundProducts([]);
                setSelectedProducts([]);
              }}
              className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
            >
              Start New Crawl
            </button>
            <button
              onClick={importSelectedProducts}
              disabled={selectedProducts.length === 0}
              className={`px-6 py-3 ${
                selectedProducts.length === 0
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
              } text-white rounded-lg font-semibold flex items-center gap-2`}
            >
              <Download size={20} />
              Import {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteCrawler;
