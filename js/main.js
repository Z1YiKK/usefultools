/**
 * UsefulTools - Main JavaScript
 * Search, Analytics tracking, Social sharing, Mobile menu
 */

(function() {
    'use strict';

    // ========== Mobile Menu Toggle ==========
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            menuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                menuBtn.textContent = '☰';
            });
        });
    }

    // ========== Tool Search ==========
    const searchInput = document.getElementById('toolSearch');
    const searchBtn = document.getElementById('searchBtn');

    function performSearch() {
        if (!searchInput) return;
        var query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        var toolMap = {
            'pet': '/tools/pet-cost-calculator.html',
            'dog': '/tools/pet-cost-calculator.html',
            'cat': '/tools/pet-cost-calculator.html',
            'puppy': '/tools/pet-cost-calculator.html',
            'animal': '/tools/pet-cost-calculator.html',
            'mortgage': '/tools/mortgage-calculator.html',
            'home': '/tools/mortgage-calculator.html',
            'loan': '/tools/mortgage-calculator.html',
            'payment': '/tools/mortgage-calculator.html',
            'bmi': '/tools/bmi-calculator.html',
            'weight': '/tools/bmi-calculator.html',
            'body': '/tools/bmi-calculator.html',
            'health': '/tools/bmi-calculator.html',
            'save': '/tools/savings-calculator.html',
            'saving': '/tools/savings-calculator.html',
            'money': '/tools/savings-calculator.html',
            'retire': '/tools/savings-calculator.html',
            'interest': '/tools/savings-calculator.html',
            'subscription': '/tools/subscription-calculator.html',
            'netflix': '/tools/subscription-calculator.html',
            'streaming': '/tools/subscription-calculator.html',
            'tip': '/tools/tip-calculator.html',
            'restaurant': '/tools/tip-calculator.html',
            'split': '/tools/tip-calculator.html',
            'bill': '/tools/tip-calculator.html',
            'move': '/tools/moving-calculator.html',
            'moving': '/tools/moving-calculator.html',
            'relocate': '/tools/moving-calculator.html',
            'fuel': '/tools/fuel-calculator.html',
            'gas': '/tools/fuel-calculator.html',
            'trip': '/tools/fuel-calculator.html',
            'drive': '/tools/fuel-calculator.html'
        };

        for (var key in toolMap) {
            if (query.indexOf(key) !== -1) {
                window.location.href = toolMap[key];
                return;
            }
        }

        // Scroll to tools section if no specific match
        var toolsSection = document.getElementById('tools');
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    // ========== Share Buttons ==========
    window.shareTool = function(title, url) {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function() {});
        } else {
            // Fallback: copy to clipboard
            var textarea = document.createElement('textarea');
            textarea.value = title + ' - ' + url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Link copied to clipboard!');
        }
    };

    // ========== Analytics Placeholder ==========
    // Replace with your Google Analytics ID when you set it up
    window.trackEvent = function(category, action, label) {
        // Google Analytics placeholder
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        // Log for debugging
        console.log('[Track]', category, action, label);
    };

    // Track tool usage
    document.querySelectorAll('.calc-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var toolName = document.title || 'Unknown Tool';
            window.trackEvent('Tool', 'Calculate', toolName);
        });
    });

    // Track outbound affiliate links
    document.querySelectorAll('.affiliate-link').forEach(function(link) {
        link.addEventListener('click', function() {
            window.trackEvent('Affiliate', 'Click', link.href);
        });
    });

    console.log('✅ UsefulTools ready');
})();
