// Sample leads data
const leadsData = [
  {
    id: 1,
    name: "Bob's Pool Service",
    website: "bobspoolservice.com",
    url: "https://bobspoolservice.com",
    industry: "Pool Services",
    location: "Weymouth, MA",
    status: "new",
    outdated: true,
    score: 85,
    screenshot: "https://via.placeholder.com/400x300/1e293b/6366f1?text=Outdated+Site",
    contact: {
      email: "bob@bobspoolservice.com",
      phone: "(781) 555-0100"
    },
    improvements: [
      "No mobile responsiveness",
      "Missing SSL certificate",
      "Outdated design (2012)",
      "No contact form",
      "Slow loading speed"
    ]
  },
  {
    id: 2,
    name: "Cape Cod Pools",
    website: "capecodpools.net",
    url: "https://capecodpools.net",
    industry: "Pool Services",
    location: "Cape Cod, MA",
    status: "contacted",
    outdated: true,
    score: 72,
    screenshot: "https://via.placeholder.com/400x300/1e293b/6366f1?text=Old+Site",
    contact: {
      email: "info@capecodpools.net",
      phone: "(508) 555-0200"
    },
    improvements: [
      "Flash elements (deprecated)",
      "Broken image links",
      "No social media links",
      "Poor SEO optimization",
      "Not mobile friendly"
    ]
  },
  {
    id: 3,
    name: "Premier Pool Care",
    website: "premierpoolcare.com",
    url: "https://premierpoolcare.com",
    industry: "Pool Maintenance",
    location: "Quincy, MA",
    status: "demo",
    outdated: true,
    score: 90,
    screenshot: "https://via.placeholder.com/400x300/1e293b/6366f1?text=Needs+Redesign",
    contact: {
      email: "contact@premierpoolcare.com",
      phone: "(617) 555-0300"
    },
    improvements: [
      "Dated design",
      "Missing call-to-action",
      "No online booking",
      "Poor color contrast",
      "Cluttered layout"
    ]
  },
  {
    id: 4,
    name: "Blue Water Pools",
    website: "bluewaterpoolsma.com",
    url: "https://bluewaterpoolsma.com",
    industry: "Pool Installation",
    location: "Braintree, MA",
    status: "new",
    outdated: true,
    score: 68,
    screenshot: "https://via.placeholder.com/400x300/1e293b/6366f1?text=Very+Old",
    contact: {
      email: "blue@bluewaterpoolsma.com",
      phone: "(781) 555-0400"
    },
    improvements: [
      "Table-based layout",
      "No responsive design",
      "Missing meta descriptions",
      "No Google Analytics",
      "Broken contact form"
    ]
  },
  {
    id: 5,
    name: "Crystal Clear Pools",
    website: "crystalclearpools.com",
    url: "https://crystalclearpools.com",
    industry: "Pool Cleaning",
    location: "Hingham, MA",
    status: "new",
    outdated: false,
    score: 45,
    screenshot: "https://via.placeholder.com/400x300/1e293b/6366f1?text=Decent+Site",
    contact: {
      email: "info@crystalclearpools.com",
      phone: "(781) 555-0500"
    },
    improvements: [
      "Could use refresh",
      "Add blog section",
      "Better images",
      "Social proof section"
    ]
  }
];

// App state
let currentView = 'dashboard';
let selectedLead = null;
let selectedTemplate = 'modern';
let selectedColor = '#0a3cd1';

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const filterBtns = document.querySelectorAll('.filter-btn');
const leadsGrid = document.getElementById('leadsGrid');
const hotLeadsContainer = document.getElementById('hotLeads');
const modal = document.getElementById('leadModal');
const leadSelect = document.getElementById('leadSelect');

// Initialize
function init() {
  setupNavigation();
  setupFilters();
  renderLeads();
  renderHotLeads();
  setupBuilder();
  setupModal();
  setupEmailTemplates();
}

// Navigation
function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      switchView(view);
      
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchView(viewName) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(`${viewName}-view`).classList.add('active');
  currentView = viewName;
}

// Filters
function setupFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLeads(btn.dataset.filter);
    });
  });
}

// Render leads
function renderLeads(filter = 'all') {
  const filtered = filter === 'all' 
    ? leadsData 
    : leadsData.filter(l => l.status === filter);
  
  leadsGrid.innerHTML = filtered.map(lead => `
    <div class="lead-card" onclick="openLeadModal(${lead.id})">
      <div class="lead-screenshot">
        <img src="${lead.screenshot}" alt="${lead.name}">
      </div>
      <div class="lead-info">
        <h3 class="lead-name">${lead.name}</h3>
        <span class="lead-url">${lead.website}</span>
        <div class="lead-meta">
          <span>${lead.industry}</span>
          <span class="status-badge status-${lead.status}">${lead.status}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Render hot leads (top 3)
function renderHotLeads() {
  const hot = leadsData.filter(l => l.status === 'new' && l.score > 80).slice(0, 3);
  
  hotLeadsContainer.innerHTML = hot.map(lead => `
    <div class="lead-card" onclick="openLeadModal(${lead.id})" style="margin-bottom: 1rem;">
      <div class="lead-screenshot" style="height: 120px;">
        <img src="${lead.screenshot}" alt="${lead.name}">
      </div>
      <div class="lead-info" style="padding: 1rem;">
        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${lead.name}</h4>
        <span style="color: var(--ink-muted); font-size: 0.85rem;">${lead.website}</span>
      </div>
    </div>
  `).join('');
}

// Modal
function setupModal() {
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function openLeadModal(id) {
  selectedLead = leadsData.find(l => l.id === id);
  if (!selectedLead) return;
  
  document.getElementById('modalLeadName').textContent = selectedLead.name;
  document.getElementById('modalScreenshot').src = selectedLead.screenshot;
  document.getElementById('modalWebsite').textContent = selectedLead.website;
  document.getElementById('modalWebsite').href = selectedLead.url;
  document.getElementById('modalIndustry').textContent = selectedLead.industry;
  document.getElementById('modalLocation').textContent = selectedLead.location;
  document.getElementById('modalStatus').textContent = selectedLead.status;
  document.getElementById('modalStatus').className = `status-badge status-${selectedLead.status}`;
  
  const improvementsList = document.getElementById('modalImprovements');
  improvementsList.innerHTML = selectedLead.improvements.map(i => `<li>${i}</li>`).join('');
  
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  selectedLead = null;
}

function archiveLead() {
  if (!selectedLead) return;
  selectedLead.status = 'archived';
  closeModal();
  renderLeads();
  alert('Lead archived');
}

function buildDemoSite() {
  if (!selectedLead) return;
  closeModal();
  switchView('builder');
  
  navItems.forEach(n => n.classList.remove('active'));
  document.querySelector('[data-view="builder"]').classList.add('active');
  
  leadSelect.value = selectedLead.id;
}

// Builder
function setupBuilder() {
  // Populate lead select
  leadSelect.innerHTML = `
    <option value="">Choose a lead...</option>
    ${leadsData.filter(l => l.status !== 'archived').map(l => 
      `<option value="${l.id}">${l.name}</option>`
    ).join('')}
  `;
  
  // Template selection
  document.querySelectorAll('.template-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedTemplate = opt.dataset.template;
    });
  });
  
  // Color selection
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedColor = opt.dataset.color;
    });
  });
  
  // Build button
  document.getElementById('buildSiteBtn').addEventListener('click', () => {
    const leadId = leadSelect.value;
    if (!leadId) {
      alert('Please select a lead first');
      return;
    }
    
    const lead = leadsData.find(l => l.id === parseInt(leadId));
    alert(`Building demo site for ${lead.name} with ${selectedTemplate} template...\n\n(In real app, this would generate a new site)`);
    
    lead.status = 'demo';
    renderLeads();
  });
}

// Email Templates
function setupEmailTemplates() {
  window.useTemplate = function(type) {
    const templates = {
      initial: {
        subject: "Quick question about your website",
        body: `Hi [Name],\n\nI came across your website at [Website] and noticed it could use a modern refresh. I'm Nico from Nico Sites, and we help businesses like yours get a professional, mobile-friendly website that actually converts visitors into customers.\n\nI'd love to build you a FREE demo site - no obligation, just a sneak peek of what your business could look like with a modern web presence.\n\nWould you be interested in seeing what we can do?\n\nBest,\nNico`
      },
      demo: {
        subject: "Your demo website is ready!",
        body: `Hi [Name],\n\nGreat news! I've built a demo website for your business. You can check it out here: [Demo URL]\n\nThis is just a starting point - we can customize colors, content, images, and anything else you'd like.\n\nLet me know what you think!\n\nBest,\nNico`
      },
      followup: {
        subject: "Following up on your website",
        body: `Hi [Name],\n\nJust following up on my previous email about your website. I built a quick demo to show you what's possible: [Demo URL]\n\nNo pressure at all - just wanted to make sure you saw it.\n\nBest,\nNico`
      }
    };
    
    const template = templates[type];
    document.getElementById('emailSubject').value = template.subject;
    document.getElementById('emailBody').value = template.body;
  };
}

// Scrape button
document.getElementById('scrapeBtn').addEventListener('click', () => {
  alert('Scraping Google for outdated websites...\n\n(In production, this would search for pool service websites with poor scores)');
});

// Image Scraping Functions
async function scrapeWebsite(url) {
  console.log(`Scraping ${url} for images and brand data...`);
  
  try {
    // Fetch the website
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const html = await response.text();
    
    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract all images
    const images = [];
    const imgElements = doc.querySelectorAll('img');
    
    imgElements.forEach(img => {
      let src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src) {
        // Convert relative URLs to absolute
        if (src.startsWith('//')) {
          src = 'https:' + src;
        } else if (src.startsWith('/')) {
          const urlObj = new URL(url);
          src = urlObj.origin + src;
        } else if (!src.startsWith('http')) {
          const urlObj = new URL(url);
          src = urlObj.origin + '/' + src;
        }
        
        if (!src.includes('placeholder') && !src.includes('icon')) {
          images.push({
            src: src,
            alt: img.getAttribute('alt') || '',
            width: img.getAttribute('width'),
            height: img.getAttribute('height')
          });
        }
      }
    });
    
    // Extract brand colors
    const colors = extractBrandColors(doc, url);
    
    // Extract logo
    const logo = findLogo(doc, url);
    
    return {
      images: images.slice(0, 20), // Limit to 20 images
      colors: colors,
      logo: logo,
      title: doc.title || '',
      meta: extractMetaData(doc)
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
}

function extractBrandColors(doc, baseUrl) {
  const colors = new Set();
  
  // Get colors from inline styles
  const allElements = doc.querySelectorAll('*');
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style) {
      const colorMatches = style.match(/color:\s*([^;]+)/gi);
      const bgMatches = style.match(/background[^:]*:\s*([^;]+)/gi);
      
      if (colorMatches) {
        colorMatches.forEach(c => {
          const color = c.replace(/color:\s*/, '').trim();
          if (isValidColor(color)) colors.add(color);
        });
      }
    }
  });
  
  // Get colors from computed styles (in real browser)
  // For now, use common patterns
  const header = doc.querySelector('header, .header, #header');
  const nav = doc.querySelector('nav, .nav, #nav, .navbar');
  
  return Array.from(colors).slice(0, 5);
}

function findLogo(doc, baseUrl) {
  // Look for logo in common places
  const logoSelectors = [
    'img[alt*="logo" i]',
    'img[src*="logo" i]',
    '.logo img',
    '#logo img',
    'header img:first-child',
    'nav img:first-child'
  ];
  
  for (const selector of logoSelectors) {
    const logo = doc.querySelector(selector);
    if (logo) {
      let src = logo.getAttribute('src');
      if (src) {
        if (src.startsWith('//')) src = 'https:' + src;
        else if (src.startsWith('/')) {
          const urlObj = new URL(baseUrl);
          src = urlObj.origin + src;
        }
        return src;
      }
    }
  }
  
  return null;
}

function extractMetaData(doc) {
  const meta = {};
  
  const description = doc.querySelector('meta[name="description"]');
  if (description) meta.description = description.getAttribute('content');
  
  const keywords = doc.querySelector('meta[name="keywords"]');
  if (keywords) meta.keywords = keywords.getAttribute('content');
  
  return meta;
}

function isValidColor(color) {
  // Filter out transparent, white, black
  const invalidColors = ['transparent', 'white', '#fff', '#ffffff', 'black', '#000', '#000000'];
  return !invalidColors.includes(color.toLowerCase());
}

// Download images function
async function downloadImages(leadId) {
  const lead = leadsData.find(l => l.id === leadId);
  if (!lead || !lead.scrapedData) {
    alert('No scraped data available. Please scrape the website first.');
    return;
  }
  
  const images = lead.scrapedData.images;
  if (!images || images.length === 0) {
    alert('No images found on this website.');
    return;
  }
  
  console.log(`Downloading ${images.length} images for ${lead.name}...`);
  
  // In a real app, this would download to server/storage
  // For now, we'll store URLs and display them
  lead.downloadedImages = images;
  
  // Show success message
  alert(`Found ${images.length} images. Ready to use in new site design.`);
  
  return images;
}

// Enhanced lead modal with scraped data
function openLeadModal(id) {
  selectedLead = leadsData.find(l => l.id === id);
  if (!selectedLead) return;
  
  // If no scraped data, scrape now
  if (!selectedLead.scrapedData) {
    scrapeWebsite(selectedLead.url).then(data => {
      selectedLead.scrapedData = data;
      renderLeadModal();
    });
  } else {
    renderLeadModal();
  }
}

function renderLeadModal() {
  if (!selectedLead) return;
  
  const data = selectedLead.scrapedData || {};
  
  document.getElementById('modalLeadName').textContent = selectedLead.name;
  document.getElementById('modalScreenshot').src = selectedLead.screenshot;
  document.getElementById('modalWebsite').textContent = selectedLead.website;
  document.getElementById('modalWebsite').href = selectedLead.url;
  document.getElementById('modalIndustry').textContent = selectedLead.industry;
  document.getElementById('modalLocation').textContent = selectedLead.location;
  document.getElementById('modalStatus').textContent = selectedLead.status;
  document.getElementById('modalStatus').className = `status-badge status-${selectedLead.status}`;
  
  // Add scraped data to modal
  const improvementsList = document.getElementById('modalImprovements');
  let improvementsHTML = selectedLead.improvements.map(i => `<li>${i}</li>`).join('');
  
  // Add brand colors if available
  if (data.colors && data.colors.length > 0) {
    improvementsHTML += `<li style="margin-top: 1rem; font-weight: 600;">Brand Colors Detected:</li>`;
    improvementsHTML += `<li style="display: flex; gap: 0.5rem; flex-wrap: wrap;">`;
    data.colors.forEach(color => {
      improvementsHTML += `<span style="display: inline-block; width: 30px; height: 30px; background: ${color}; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2);"></span>`;
    });
    improvementsHTML += `</li>`;
  }
  
  // Add image count
  if (data.images) {
    improvementsHTML += `<li style="margin-top: 0.5rem;">${data.images.length} images found for download</li>`;
  }
  
  improvementsList.innerHTML = improvementsHTML;
  
  modal.classList.add('active');
}

// Update scrape button functionality
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const urls = [
    'https://www.goulartpools.com/',
    'https://www.swimsportsinc.com/',
    // Add more pool service URLs here
  ];
  
  alert('Scraping websites for leads...');
  
  for (const url of urls) {
    const data = await scrapeWebsite(url);
    if (data) {
      console.log(`Scraped ${url}:`, data);
      // In production, this would add to leads database
    }
  }
  
  alert('Scraping complete! Check console for results.');
});

// Mobile menu toggle
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileClose = document.getElementById('mobileClose');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('mobile-open');
    });
  }
  
  if (mobileClose && sidebar) {
    mobileClose.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  }
  
  // Close menu when clicking a nav item on mobile
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });
}

// Initialize app
init();
setupMobileMenu();
