import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { dbOperations } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for bulk operations

// Try to import Puppeteer if available
let puppeteer;
try {
  puppeteer = await import('puppeteer');
  console.log('✅ Puppeteer available for JavaScript-rendered sites');
} catch (err) {
  console.log('⚠️  Puppeteer not installed - only static HTML sites supported');
  console.log('   Install with: npm install puppeteer');
}

// Smart product detection - finds products using multiple strategies with aggressive fallbacks
function findProducts($, url) {
  const products = [];
  const urlObj = new URL(url);
  
  console.log('🔍 Strategy 1: Searching for Schema.org structured data...');
  // Strategy 1: Schema.org structured data (most reliable)
  $('[itemtype*="Product"]').each((index, element) => {
    const $el = $(element);
    const product = {
      name: $el.find('[itemprop="name"]').first().text().trim(),
      price: extractPrice($el.find('[itemprop="price"]').first().text()),
      image: $el.find('[itemprop="image"]').first().attr('src') || $el.find('[itemprop="image"]').first().attr('content'),
      description: $el.find('[itemprop="description"]').first().text().trim(),
      sku: $el.find('[itemprop="sku"]').first().text().trim(),
      url: $el.find('a').first().attr('href')
    };
    if (product.name || product.image) products.push({ source: 'schema', ...product, index });
  });
  console.log(`   Found ${products.length} products via Schema.org`);
  
  console.log('🔍 Strategy 2: Searching for JSON-LD structured data...');
  // Strategy 2: JSON-LD structured data
  const jsonLdCount = products.length;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      const items = Array.isArray(data) ? data : [data];
      items.forEach((item, index) => {
        if (item['@type'] === 'Product' || item['@type']?.includes('Product')) {
          products.push({
            source: 'jsonld',
            name: item.name,
            price: extractPrice(item.offers?.price || item.offers?.lowPrice || item.price),
            image: item.image?.url || item.image || item.thumbnail,
            description: item.description,
            sku: item.sku || item.productID,
            url: item.url,
            index
          });
        }
      });
    } catch (e) { /* ignore invalid JSON */ }
  });
  console.log(`   Found ${products.length - jsonLdCount} products via JSON-LD`);
  
  console.log('🔍 Strategy 3: Pattern matching for common e-commerce structures...');
  const patternCount = products.length;
  
  // SUPER AGGRESSIVE selector list - try EVERYTHING
  const containerSelectors = [
    // Data attributes (highest priority)
    '[data-product-id]', '[data-product]', '[data-productid]', '[data-item-id]',
    '[data-testid*="product"]', '[data-component*="product"]',
    
    // Common product card classes
    '.product-card', '.product-item', '.product-tile', '.product-grid-item',
    '.product-box', '.product-container', '.product-wrapper',
    
    // Semantic HTML
    'article.product', 'li.product', 'div.product',
    
    // Case variations
    '[class*="ProductCard"]', '[class*="product-card"]', '[class*="productCard"]',
    '[class*="ProductItem"]', '[class*="product-item"]', '[class*="productItem"]',
    '[class*="ProductTile"]', '[class*="product-tile"]', '[class*="productTile"]',
    '[class*="ProductBox"]', '[class*="product-box"]',
    
    // Grid items (common in product listings)
    '.grid-item', '.grid__item', '[class*="grid-item"]', '[class*="gridItem"]',
    
    // List items with product links
    'li:has(a[href*="/product"])', 'li:has(a[href*="/products"])',
    'li:has(a[href*="/item"])', 'li:has(a[href*="/p/"])',
    
    // Direct product links (last resort - might be too broad)
    'a[href*="/product/"]', 'a[href*="/products/"]', 
    'a[href*="/item/"]', 'a[href*="/p/"]',
    
    // Common generic containers (very last resort)
    '.item', 'li.item', '[class*="Item"]',
    
    // Home Depot specific
    '[data-testid*="pod"]', '.product-pod', '[class*="product-pod"]',
    
    // More generic fallbacks
    '[class*="card"]', '[class*="tile"]'
  ];
  
  containerSelectors.forEach(selector => {
    try {
      $(selector).each((index, element) => {
        const $el = $(element);
        
        // Skip if already found via schema
        if ($el.is('[itemtype*="Product"]')) return;
        
        // Skip if element is too small (likely not a product card)
        const text = $el.text().trim();
        if (text.length < 10) return;
        
        // Find name - SUPER AGGRESSIVE search
        let name = '';
        const nameSelectors = [
          'h1', 'h2', 'h3', 'h4', 'h5',
          '[class*="title"]', '[class*="Title"]', '[class*="TITLE"]',
          '[class*="name"]', '[class*="Name"]', '[class*="NAME"]',
          '[data-testid*="title"]', '[data-testid*="name"]',
          'a[href*="/product"]', 'a[href*="/item"]',
          'span[class*="title"]', 'div[class*="title"]',
          'span[class*="name"]', 'div[class*="name"]'
        ];
        
        for (const ns of nameSelectors) {
          const text = $el.find(ns).first().text().trim();
          if (text && text.length > 3 && text.length < 300) {
            name = text;
            break;
          }
        }
        
        // If still no name, try getting text from first link
        if (!name) {
          const linkText = $el.find('a').first().text().trim();
          if (linkText && linkText.length > 3 && linkText.length < 300) {
            name = linkText;
          }
        }
        
        // Find price - SUPER AGGRESSIVE search
        let priceText = '';
        const priceSelectors = [
          '[class*="price"]', '[class*="Price"]', '[class*="PRICE"]',
          '[class*="cost"]', '[class*="Cost"]',
          '[class*="amount"]', '[class*="Amount"]',
          '[data-testid*="price"]', '[data-price]',
          'span:contains("$")', 'div:contains("$")'
        ];
        
        for (const ps of priceSelectors) {
          const text = $el.find(ps).first().text().trim();
          if (text && (text.includes('$') || text.match(/[\d,]+\.?\d{0,2}/))) {
            priceText = text;
            break;
          }
        }
        
        // If no price found, do a deep scan
        if (!priceText) {
          $el.find('*').each((i, el) => {
            const text = $(el).text().trim();
            const match = text.match(/\$\s*[\d,]+\.?\d{0,2}/);
            if (match && text.length < 100) {
              priceText = text;
              return false;
            }
          });
        }
        
        // Find image - ULTRA AGGRESSIVE search with 20+ possible sources
        let image = '';
        const imgEl = $el.find('img').first();
        if (imgEl.length) {
          image = imgEl.attr('src') || 
                  imgEl.attr('data-src') || 
                  imgEl.attr('data-lazy') ||
                  imgEl.attr('data-lazy-src') || 
                  imgEl.attr('data-original') ||
                  imgEl.attr('data-image') ||
                  imgEl.attr('data-img') ||
                  imgEl.attr('data-url') ||
                  imgEl.attr('data-lazy-image') ||
                  imgEl.attr('data-bg') ||
                  imgEl.attr('data-zoom-image') ||
                  imgEl.attr('data-hi-res-src') ||
                  imgEl.attr('data-fallback-src') ||
                  imgEl.attr('srcset')?.split(',')[0]?.split(' ')[0] ||
                  imgEl.attr('data-srcset')?.split(',')[0]?.split(' ')[0];
        }
        
        // Check for background images in style attribute
        if (!image) {
          const bgImage = $el.find('[style*="background-image"]').first();
          if (bgImage.length) {
            const style = bgImage.attr('style');
            const match = style?.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) image = match[1];
          }
        }
        
        // Fallback to Open Graph and Twitter Card meta tags (page-level)
        if (!image && index === 0) {
          const ogImage = $('meta[property="og:image"]').attr('content') ||
                         $('meta[name="og:image"]').attr('content') ||
                         $('meta[property="twitter:image"]').attr('content') ||
                         $('meta[name="twitter:image"]').attr('content');
          if (ogImage) image = ogImage;
        }
        
        // Find link
        const link = $el.find('a').first().attr('href') || ($el.is('a') ? $el.attr('href') : '');
        
        // Accept product if it has name OR (image AND price)
        if (name || (image && priceText)) {
          products.push({
            source: selector,
            name: name || '',
            price: extractPrice(priceText),
            image: image || '',
            description: '',
            sku: '',
            url: link,
            index
          });
        }
      });
    } catch (e) {
      console.log(`   Selector ${selector} failed: ${e.message}`);
    }
  });
  console.log(`   Found ${products.length - patternCount} products via pattern matching`);
  
  // Deduplicate products - include source in key to allow same product from different sources
  // Use URL hostname as source identifier
  const sourceHostname = new URL(url).hostname;
  const seen = new Set();
  const unique = [];
  products.forEach(p => {
    // Create unique key: source website + name + image
    const key = `${sourceHostname}:${p.name}:${p.image}`.toLowerCase();
    if (!seen.has(key) && (p.name || p.image)) {
      seen.add(key);
      unique.push({ ...p, sourceWebsite: sourceHostname });
    }
  });
  
  console.log(`✅ Total: ${products.length} raw products → ${unique.length} unique products from ${new Set(products.map(p => p.source)).size} different sources`);
  
  return unique;
}

// Detect platform from URL
function detectPlatform(url) {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('shopify') || urlLower.includes('.myshopify.')) return 'shopify';
  if (urlLower.includes('homedepot.com')) return 'homedepot';
  if (urlLower.includes('etsy.com')) return 'etsy';
  if (urlLower.includes('woocommerce')) return 'woocommerce';
  return 'generic';
}

// Extract price from text
function extractPrice(text) {
  if (!text) return 0;
  const priceMatch = text.replace(/[^0-9.,]/g, '').match(/[\d,]+\.?\d*/);
  return priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;
}

// Generate SKU from product name
function generateSKU(name, index) {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') || 'PROD';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}-${index.toString().padStart(3, '0')}`;
}

// Crawl using Puppeteer for JavaScript-rendered sites - SUPER FLEXIBLE VERSION
async function crawlWithPuppeteer(url, platform) {
  if (!puppeteer) {
    throw new Error('Puppeteer not available. Install with: npm install puppeteer');
  }

  console.log('🚀 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    console.log('🌐 Navigating to page (flexible timeout)...');
    try {
      // Try with networkidle2 first (less strict)
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 120000  // 2 minute timeout
      });
    } catch (err) {
      console.log('⚠️  Network timeout, trying with domcontentloaded...');
      // Fallback to domcontentloaded if networkidle fails
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
      } catch (err2) {
        console.log('⚠️  DOM timeout, trying minimal load...');
        // Last resort - just load without waiting
        await page.goto(url, { 
          waitUntil: 'load',
          timeout: 30000
        });
      }
    }
    
    console.log('⏳ Waiting for dynamic content (trying multiple strategies)...');
    
    // AGGRESSIVE selector list with more variations
    const commonSelectors = [
      '[itemtype*="Product"]',
      '[data-product-id]', '[data-product]', '[data-productid]', '[data-item-id]',
      '[data-testid*="product"]', '[data-testid*="pod"]',
      '.product-card', '.product-item', '.product-tile', '.product-pod', '.product-box',
      '.product', 'article.product', 'li.product',
      '[class*="ProductCard"]', '[class*="product-card"]', '[class*="productCard"]',
      '[class*="ProductItem"]', '[class*="product-item"]',
      '[class*="ProductTile"]', '[class*="product-tile"]',
      '[class*="product-pod"]', '[class*="ProductPod"]',
      'a[href*="/products/"]', 'a[href*="/product/"]',
      'a[href*="/item/"]', 'a[href*="/p/"]',
      '.grid-item', '[class*="grid-item"]',
      'img[alt*="product"]', 'img[alt*="Product"]'
    ];
    
    let selectorFound = false;
    let foundSelector = '';
    
    // Try each selector with patience
    for (const selector of commonSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        console.log(`✅ Found products using selector: ${selector}`);
        foundSelector = selector;
        selectorFound = true;
        break;
      } catch (err) {
        // Try next selector
      }
    }
    
    if (!selectorFound) {
      console.log('⚠️  No specific product selectors found immediately');
      console.log('⏳ Waiting 5 seconds for dynamic content to load...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('📜 Scrolling page aggressively to trigger lazy loading...');
    // SUPER AGGRESSIVE scrolling - multiple passes
    await page.evaluate(async () => {
      // Scroll down slowly
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
      
      // Scroll back to top
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 500));
      
      // Scroll down again (catches late-loading images)
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    console.log('⏳ Final wait for any remaining async content...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try one more time to find products after all that loading
    if (!selectorFound) {
      console.log('🔍 Re-checking for product selectors after page load...');
      for (const selector of commonSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 1000 });
          console.log(`✅ NOW found products using selector: ${selector}`);
          foundSelector = selector;
          selectorFound = true;
          break;
        } catch (err) {
          // Try next
        }
      }
    }
    
    console.log('✅ Page fully loaded and processed');
    
    // Get the rendered HTML
    const html = await page.content();
    console.log(`📄 HTML content length: ${html.length} chars`);
    
    // Quick sanity check
    const productCount = await page.evaluate((sel) => {
      if (!sel) return 0;
      return document.querySelectorAll(sel).length;
    }, foundSelector);
    console.log(`🎯 Puppeteer detected ~${productCount} potential product elements`);
    
    await browser.close();
    return html;
    
  } catch (error) {
    console.error('❌ Puppeteer error:', error.message);
    await browser.close();
    throw error;
  }
}

// Main crawl endpoint - ADAPTIVE with automatic fallbacks
app.post('/api/crawl', async (req, res) => {
  try {
    const { url, usePuppeteer } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`🕷️  STARTING CRAWL: ${url}`);
    console.log(`${'='.repeat(80)}\n`);
    
    const platform = detectPlatform(url);
    console.log(`🏷️  Platform detected: ${platform}`);

    let html;
    let crawlMethod = 'unknown';
    
    // Automatically detect if site needs JavaScript rendering
    const jsHeavySites = [
      'homedepot', 'lowes', 'amazon', 'walmart', 'target', 'bestbuy',
      'wayfair', 'overstock', 'alibaba', 'aliexpress', 'wish',
      'etsy', 'ebay', 'poshmark', 'mercari', 'shopify'
    ];
    
    const needsJs = jsHeavySites.some(site => url.toLowerCase().includes(site));
    const shouldUsePuppeteer = (usePuppeteer === true) || (usePuppeteer !== false && needsJs);
    
    // TRY PUPPETEER FIRST for JS-heavy sites
    if (shouldUsePuppeteer && puppeteer) {
      console.log('🎭 Attempting Puppeteer (JavaScript rendering)...');
      try {
        html = await crawlWithPuppeteer(url, platform);
        crawlMethod = 'puppeteer';
        console.log('✅ Puppeteer succeeded!');
      } catch (puppeteerError) {
        console.error('❌ Puppeteer failed:', puppeteerError.message);
        console.log('🔄 Falling back to axios (static HTML)...');
        // Fallback to axios if Puppeteer fails
        try {
          const response = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            },
            timeout: 30000,
            maxRedirects: 5
          });
          html = response.data;
          crawlMethod = 'axios-fallback';
          console.log('✅ Axios fallback succeeded!');
        } catch (axiosError) {
          console.error('❌ Axios also failed:', axiosError.message);
          throw new Error(`Both Puppeteer and axios failed. Puppeteer: ${puppeteerError.message}, Axios: ${axiosError.message}`);
        }
      }
    } else {
      // TRY AXIOS FIRST for static sites
      console.log('📄 Attempting axios (static HTML)...');
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 30000,
          maxRedirects: 5
        });
        html = response.data;
        crawlMethod = 'axios';
        console.log('✅ Axios succeeded!');
      } catch (axiosError) {
        console.error('❌ Axios failed:', axiosError.message);
        
        // Fallback to Puppeteer if axios fails and Puppeteer is available
        if (puppeteer) {
          console.log('🔄 Falling back to Puppeteer...');
          try {
            html = await crawlWithPuppeteer(url, platform);
            crawlMethod = 'puppeteer-fallback';
            console.log('✅ Puppeteer fallback succeeded!');
          } catch (puppeteerError) {
            console.error('❌ Puppeteer also failed:', puppeteerError.message);
            throw new Error(`Both axios and Puppeteer failed. Axios: ${axiosError.message}, Puppeteer: ${puppeteerError.message}`);
          }
        } else {
          throw axiosError;
        }
      }
    }

    console.log(`\n📊 Crawl method used: ${crawlMethod}`);
    console.log(`📄 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Use smart product detection
    console.log(`\n${'='.repeat(80)}`);
    console.log('🔍 ANALYZING PAGE STRUCTURE FOR PRODUCTS');
    console.log(`${'='.repeat(80)}\n`);
    
    const foundProducts = findProducts($, url);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`✅ EXTRACTION COMPLETE: Found ${foundProducts.length} products`);
    console.log(`${'='.repeat(80)}\n`);
    
    if (foundProducts.length === 0) {
      console.log('⚠️  WARNING: No products found!');
      console.log('💡 Tips:');
      console.log('   - Try the URL with a specific product category or search results page');
      console.log('   - Some sites require authentication or have anti-scraping protection');
      console.log('   - Check if the site loads properly in a regular browser');
    }
    
    // Convert to inventory format
    const products = foundProducts.map((product, index) => {
      const price = product.price || 0;
      
      // Make image URL absolute if relative
      let fullImageUrl = product.image || '';
      if (fullImageUrl) {
        if (fullImageUrl.startsWith('//')) {
          fullImageUrl = 'https:' + fullImageUrl;
        } else if (!fullImageUrl.startsWith('http')) {
          const urlObj = new URL(url);
          fullImageUrl = urlObj.origin + (fullImageUrl.startsWith('/') ? fullImageUrl : '/' + fullImageUrl);
        }
      }

      // Make product URL absolute if relative
      let fullProductUrl = product.url || '';
      if (fullProductUrl) {
        if (fullProductUrl.startsWith('//')) {
          fullProductUrl = 'https:' + fullProductUrl;
        } else if (!fullProductUrl.startsWith('http')) {
          const urlObj = new URL(url);
          fullProductUrl = urlObj.origin + (fullProductUrl.startsWith('/') ? fullProductUrl : '/' + fullProductUrl);
        }
      }
      
      return {
        id: `crawled-${Date.now()}-${index}`,
        sku: product.sku || generateSKU(product.name || 'PRODUCT', index),
        name: product.name || 'Unnamed Product',
        category: platform.charAt(0).toUpperCase() + platform.slice(1),
        quantity: 0,
        costPrice: price * 0.6, // Estimate 40% margin
        salePrice: price,
        supplier: new URL(url).hostname,
        location: 'To be assigned',
        reorderPoint: 10,
        minStock: 5,
        maxStock: 100,
        taxRate: 0.08,
        image: fullImageUrl,
        description: product.description || '',
        notes: `Imported from ${new URL(url).hostname} on ${new Date().toLocaleDateString()} via ${crawlMethod}`,
        brand: '',
        model: '',
        barcode: '',
        color: '',
        size: '',
        weight: '',
        sourceUrl: fullProductUrl,
        sourceWebsite: product.sourceWebsite || new URL(url).hostname,
        crawledDate: new Date().toISOString().split('T')[0],
        imageStatus: fullImageUrl ? 'unchecked' : 'missing',
        lastRestocked: new Date().toISOString().split('T')[0]
      };
    });

    console.log(`📦 Successfully processed ${products.length} products for import`);

    res.json({
      success: true,
      platform,
      products,
      totalFound: foundProducts.length,
      totalExtracted: products.length
    });

  } catch (error) {
    console.error('Crawl error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Image validation endpoint - checks if image URL is accessible and valid
app.post('/api/validate-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        status: 'missing',
        error: 'Image URL is required' 
      });
    }

    console.log(`🖼️  Validating image: ${imageUrl}`);

    // Check if URL is properly formatted
    try {
      new URL(imageUrl);
    } catch (e) {
      return res.json({
        success: false,
        status: 'invalid',
        error: 'Invalid URL format',
        imageUrl
      });
    }

    // Try to fetch image with timeout and retry
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 10000,
          maxRedirects: 5,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/*',
          },
          validateStatus: (status) => status < 500 // Accept any status < 500
        });

        // Check status code
        if (response.status === 404) {
          return res.json({
            success: false,
            status: 'not-found',
            error: '404 Not Found',
            imageUrl
          });
        }

        if (response.status === 403) {
          return res.json({
            success: false,
            status: 'forbidden',
            error: '403 Forbidden - Site may block hotlinking',
            imageUrl
          });
        }

        if (response.status >= 400) {
          return res.json({
            success: false,
            status: 'error',
            error: `HTTP ${response.status}`,
            imageUrl
          });
        }

        // Check content type
        const contentType = response.headers['content-type'] || '';
        if (!contentType.startsWith('image/')) {
          return res.json({
            success: false,
            status: 'invalid',
            error: `Not an image (content-type: ${contentType})`,
            imageUrl
          });
        }

        // Check file size (detect 1x1 placeholders - usually < 1KB)
        const size = response.data.length;
        if (size < 100) {
          return res.json({
            success: false,
            status: 'placeholder',
            error: `Image too small (${size} bytes) - likely a placeholder`,
            imageUrl
          });
        }

        // Success!
        return res.json({
          success: true,
          status: 'valid',
          imageUrl,
          contentType,
          size,
          message: `Valid image (${(size / 1024).toFixed(2)} KB)`
        });

      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts < maxAttempts) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    // All attempts failed
    return res.json({
      success: false,
      status: 'unreachable',
      error: lastError.code === 'ECONNABORTED' ? 'Timeout' : lastError.message,
      imageUrl,
      attempts: maxAttempts
    });

  } catch (error) {
    console.error('Image validation error:', error);
    res.status(500).json({
      success: false,
      status: 'error',
      error: error.message
    });
  }
});

// Batch image validation endpoint
app.post('/api/validate-images-batch', async (req, res) => {
  try {
    const { imageUrls } = req.body;
    
    if (!Array.isArray(imageUrls)) {
      return res.status(400).json({ error: 'imageUrls must be an array' });
    }

    console.log(`🖼️  Batch validating ${imageUrls.length} images...`);

    const results = [];
    
    // Validate in chunks of 5 to avoid overwhelming the server
    const chunkSize = 5;
    for (let i = 0; i < imageUrls.length; i += chunkSize) {
      const chunk = imageUrls.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (imageUrl) => {
          try {
            const response = await axios.post('http://localhost:3001/api/validate-image', 
              { imageUrl },
              { timeout: 15000 }
            );
            return response.data;
          } catch (error) {
            return {
              success: false,
              status: 'error',
              error: error.message,
              imageUrl
            };
          }
        })
      );
      results.push(...chunkResults);
    }

    const summary = {
      total: results.length,
      valid: results.filter(r => r.success).length,
      invalid: results.filter(r => !r.success).length,
      byStatus: {}
    };

    results.forEach(r => {
      summary.byStatus[r.status] = (summary.byStatus[r.status] || 0) + 1;
    });

    res.json({
      success: true,
      results,
      summary
    });

  } catch (error) {
    console.error('Batch validation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analyze endpoint - helps find selectors for a specific site
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing: ${url}`);
    
    // Use Puppeteer to get fully rendered page
    let html;
    if (puppeteer) {
      const platform = detectPlatform(url);
      html = await crawlWithPuppeteer(url, platform);
    } else {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 30000
      });
      html = response.data;
    }
    
    const $ = cheerio.load(html);
    
    // Find all elements that might be product containers
    const possibleContainers = {};
    
    // Look for common product-related classes and attributes
    $('[class*="product"], [data-product], article, li[class*="item"]').each((i, el) => {
      const classes = $(el).attr('class') || '';
      const dataAttrs = Object.keys(el.attribs).filter(attr => attr.startsWith('data-'));
      
      if (classes) {
        classes.split(/\s+/).forEach(cls => {
          if (cls.toLowerCase().includes('product') || cls.toLowerCase().includes('item') || cls.toLowerCase().includes('card')) {
            possibleContainers[`.${cls}`] = (possibleContainers[`.${cls}`] || 0) + 1;
          }
        });
      }
      
      dataAttrs.forEach(attr => {
        possibleContainers[`[${attr}]`] = (possibleContainers[`[${attr}]`] || 0) + 1;
      });
    });
    
    // Sort by frequency
    const sorted = Object.entries(possibleContainers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([selector, count]) => ({ selector, count }));
    
    res.json({
      success: true,
      url,
      htmlLength: html.length,
      suggestions: sorted,
      message: 'Try using these selectors as container selectors'
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// CENTRALIZED DATABASE API ENDPOINTS
// ============================================================================

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = dbOperations.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = dbOperations.getProductById(req.params.id);
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add product
app.post('/api/products', (req, res) => {
  try {
    const result = dbOperations.addProduct(req.body);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const result = dbOperations.updateProduct(req.params.id, req.body);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const result = dbOperations.deleteProduct(req.params.id);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk add products
app.post('/api/products/bulk', (req, res) => {
  try {
    const { products } = req.body;
    dbOperations.bulkAddProducts(products);
    res.json({ success: true, count: products.length });
  } catch (error) {
    console.error('Error bulk adding products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all movements
app.get('/api/movements', (req, res) => {
  try {
    const movements = dbOperations.getAllMovements();
    res.json({ success: true, movements });
  } catch (error) {
    console.error('Error fetching movements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add movement
app.post('/api/movements', (req, res) => {
  try {
    const result = dbOperations.addMovement(req.body);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error adding movement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete movement
app.delete('/api/movements/:id', (req, res) => {
  try {
    const result = dbOperations.deleteMovement(req.params.id);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting movement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get/Set settings
app.get('/api/settings/:key', (req, res) => {
  try {
    const value = dbOperations.getSetting(req.params.key);
    res.json({ success: true, value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    const result = dbOperations.setSetting(key, value);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error saving setting:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbOperations.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export all data
app.get('/api/export', (req, res) => {
  try {
    const data = dbOperations.exportAll();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import all data
app.post('/api/import', (req, res) => {
  try {
    const { data } = req.body;
    dbOperations.importAll(data);
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Migrate from IndexedDB (frontend will send its data)
app.post('/api/migrate-from-indexeddb', (req, res) => {
  try {
    const { products, movements, settings } = req.body;
    
    console.log(`📦 Migrating ${products?.length || 0} products from IndexedDB...`);
    
    if (products && products.length > 0) {
      dbOperations.bulkAddProducts(products);
    }
    
    if (movements && movements.length > 0) {
      for (const movement of movements) {
        dbOperations.addMovement(movement);
      }
    }
    
    if (settings && settings.length > 0) {
      for (const setting of settings) {
        dbOperations.setSetting(setting.key, setting.value);
      }
    }
    
    console.log(`✅ Migration complete!`);
    
    res.json({ 
      success: true, 
      message: `Migrated ${products?.length || 0} products, ${movements?.length || 0} movements` 
    });
  } catch (error) {
    console.error('Error migrating data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🕷️  Crawler server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to crawl websites!`);
  console.log(`💾 Centralized database API available`);
});
