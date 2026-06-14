/**
 * ToolHero - Main JavaScript
 * Search autocomplete, Contact modal, Analytics, Mobile menu
 */
(function() {
    'use strict';

    // ========== Mobile Menu ==========
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            menuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
        });
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                menuBtn.textContent = '☰';
            });
        });
    }

    // ========== Search Autocomplete ==========
    var tools = [
        { name: 'Pet Cost Calculator', kw: ['pet','dog','cat','puppy','kitten','animal','puppy cost','dog cost','cat cost'], url: 'tools/pet-cost-calculator.html', icon: '🐾' },
        { name: 'Mortgage Payoff Calculator', kw: ['mortgage','home','loan','payment','house','refinance','pay off','amortization'], url: 'tools/mortgage-calculator.html', icon: '🏠' },
        { name: 'BMI Calculator', kw: ['bmi','weight','body','health','obese','overweight','fitness'], url: 'tools/bmi-calculator.html', icon: '💪' },
        { name: 'Savings Goal Calculator', kw: ['save','saving','money','retire','invest','interest','compound','goal','financial'], url: 'tools/savings-calculator.html', icon: '💰' },
        { name: 'Subscription Cost Analyzer', kw: ['subscription','netflix','spotify','streaming','recurring','monthly bill','membership'], url: 'tools/subscription-calculator.html', icon: '📊' },
        { name: 'Tip & Split Calculator', kw: ['tip','restaurant','split','bill','dining','gratuity','service charge'], url: 'tools/tip-calculator.html', icon: '🍽️' },
        { name: 'Moving Cost Estimator', kw: ['move','moving','relocate','relocation','moving company','packing'], url: 'tools/moving-calculator.html', icon: '📦' },
        { name: 'Fuel Cost Calculator', kw: ['fuel','gas','trip','drive','mpg','mileage','road trip','commute'], url: 'tools/fuel-calculator.html', icon: '⛽' }
    ];

    var searchInput = document.getElementById('toolSearch');
    var searchBtn = document.getElementById('searchBtn');
    var dropdown = null;

    function createDropdown() {
        var el = document.createElement('div');
        el.className = 'search-dropdown';
        el.id = 'searchDropdown';
        if (searchInput && searchInput.parentNode) {
            searchInput.parentNode.appendChild(el);
        }
        return el;
    }

    function showSuggestions(query) {
        if (!dropdown) dropdown = createDropdown();
        if (!dropdown) return;
        query = query.toLowerCase().trim();
        if (!query) { dropdown.style.display = 'none'; return; }

        var matches = [];
        tools.forEach(function(tool) {
            var matchScore = 0;
            tool.kw.forEach(function(kw) {
                if (kw === query) matchScore = 3;
                else if (kw.indexOf(query) === 0) matchScore = Math.max(matchScore, 2);
                else if (kw.indexOf(query) > 0) matchScore = Math.max(matchScore, 1);
                if (tool.name.toLowerCase().indexOf(query) >= 0) matchScore = Math.max(matchScore, 2);
            });
            if (matchScore > 0) {
                matches.push({ tool: tool, score: matchScore });
            }
        });

        matches.sort(function(a, b) { return b.score - a.score; });
        matches = matches.slice(0, 5);

        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        var html = '';
        matches.forEach(function(m) {
            html += '<a href="' + m.tool.url + '" class="dropdown-item">';
            html += '<span class="dropdown-icon">' + m.tool.icon + '</span>';
            html += '<span>' + m.tool.name + '</span>';
            html += '</a>';
        });

        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
    }

    function navigateSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) return false;

        for (var i = 0; i < tools.length; i++) {
            for (var j = 0; j < tools[i].kw.length; j++) {
                if (tools[i].kw[j] === query || tools[i].name.toLowerCase() === query) {
                    window.location.href = tools[i].url;
                    return true;
                }
            }
        }
        // Fuzzy: just pick the first partial match
        for (var i = 0; i < tools.length; i++) {
            for (var j = 0; j < tools[i].kw.length; j++) {
                if (tools[i].kw[j].indexOf(query) >= 0 || query.indexOf(tools[i].kw[j]) >= 0) {
                    window.location.href = tools[i].url;
                    return true;
                }
            }
        }
        return false;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            showSuggestions(this.value);
        });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var q = this.value.trim();
                if (q && !navigateSearch(q)) {
                    var toolsSection = document.getElementById('tools');
                    if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
                }
                if (dropdown) dropdown.style.display = 'none';
            }
        });
        searchInput.addEventListener('blur', function() {
            setTimeout(function() {
                if (dropdown) dropdown.style.display = 'none';
            }, 200);
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            var q = searchInput ? searchInput.value.trim() : '';
            if (q && !navigateSearch(q)) {
                var toolsSection = document.getElementById('tools');
                if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========== Contact Modal ==========
    function initContactModal() {
        var modalHTML = '<div id="contactModal" class="modal-overlay" style="display:none;">' +
            '<div class="modal-box">' +
                '<button class="modal-close" onclick="document.getElementById(\'contactModal\').style.display=\'none\'">&times;</button>' +
                '<div class="modal-icon">📧</div>' +
                '<h3>Get in Touch</h3>' +
                '<p>Have a business inquiry, partnership idea, or want to advertise on ToolHero?</p>' +
                '<div class="modal-email-box">' +
                    '<input type="text" id="modalEmail" value="toolhero@163.com" readonly>' +
                    '<button class="modal-copy-btn" onclick="copyEmail()">Copy</button>' +
                '</div>' +
                '<p class="modal-sub">Click Copy above, then paste into your email client. We reply within 24 hours.</p>' +
            '</div>' +
        '</div>';
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    window.copyEmail = function() {
        var inp = document.getElementById('modalEmail');
        inp.select();
        document.execCommand('copy');
        var btn = document.querySelector('.modal-copy-btn');
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#10b981';
        setTimeout(function() {
            btn.textContent = orig;
            btn.style.background = '';
        }, 1500);
    };

    // Open modal from any contact button
    window.openContactModal = function() {
        var modal = document.getElementById('contactModal');
        if (!modal) { initContactModal(); modal = document.getElementById('contactModal'); }
        modal.style.display = 'flex';
        trackEvent('Contact', 'Open', 'Modal');
    };

    // Close modals on overlay click
    document.addEventListener('click', function(e) {
        if (e.target.id === 'contactModal' || e.target.id === 'feedbackModal') {
            e.target.style.display = 'none';
        }
    });

    initContactModal();

    // ========== Feedback Modal ==========
    function initFeedbackModal() {
        var html = '<div id="feedbackModal" class="modal-overlay" style="display:none;">' +
            '<div class="modal-box" style="max-width:480px;">' +
                '<button class="modal-close" onclick="document.getElementById(\'feedbackModal\').style.display=\'none\'">&times;</button>' +
                '<div class="modal-icon">🐛</div>' +
                '<h3>Report a Bug or Suggest a Tool</h3>' +
                '<div class="feedback-form" style="text-align:left;" id="fbFormInner">' +
                    '<div class="form-group"><label for="fbModalType">What\'s this about?</label>' +
                    '<select id="fbModalType"><option value="Bug Report">🐛 Bug Report</option><option value="Tool Suggestion">💡 Tool Suggestion</option><option value="Improvement">🔧 Improvement Idea</option><option value="Other">📝 Other Feedback</option></select></div>' +
                    '<div class="form-group"><label for="fbModalMsg">Your Message <span style="color:#ef4444;">(Required)</span></label>' +
                    '<textarea id="fbModalMsg" style="min-height:100px;" placeholder="Describe the issue or suggest a tool..." required></textarea></div>' +
                    '<div class="form-group"><label for="fbModalContact">Your Contact <span style="color:#94a3b8;">(Optional — email or other, so we can reply)</span></label>' +
                    '<input type="text" id="fbModalContact" placeholder="e.g. your@email.com or @username">' +
                    '<span class="input-hint">Leave blank if you don\'t need a reply.</span></div>' +
                    '<button class="submit-btn" id="fbSubmitBtn" onclick="submitFeedbackModal()" style="width:100%;">Send Feedback →</button>' +
                '</div>' +
                '<div class="form-success" id="fbSuccess" style="display:none;margin-top:16px;"><strong>✅ Sent! Thank you.</strong><br>We read every message and will reply within 48 hours if you left contact info.</div>' +
                '<div id="fbError" style="display:none;margin-top:16px;color:#ef4444;font-size:0.9rem;">⚠️ Failed to send. Please email us directly at <strong>toolhero@163.com</strong></div>' +
            '</div>' +
        '</div>';
        document.body.insertAdjacentHTML('beforeend', html);
    }

    window.submitFeedbackModal = function() {
        var msg = document.getElementById('fbModalMsg').value.trim();
        if (!msg) { alert('Please enter a message before submitting.'); return; }

        var type = document.getElementById('fbModalType').value;
        var contact = document.getElementById('fbModalContact').value.trim();
        var btn = document.getElementById('fbSubmitBtn');
        var origText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Build request body
        var body = 'Type: ' + type + '\n';
        body += 'Message: ' + msg + '\n';
        if (contact) body += 'Contact: ' + contact + '\n';
        body += 'Page: ' + window.location.href + '\n';
        body += 'Time: ' + new Date().toISOString() + '\n';

        // Try FormSubmit.co (free, no account needed)
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://formsubmit.co/ajax/toolhero@163.com', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = function() {
            btn.textContent = origText;
            btn.disabled = false;
            if (xhr.status === 200) {
                document.getElementById('fbFormInner').style.display = 'none';
                document.getElementById('fbSuccess').style.display = 'block';
                document.getElementById('fbModalMsg').value = '';
                document.getElementById('fbModalContact').value = '';
                trackEvent('Feedback', 'Submit', type);
            } else {
                document.getElementById('fbError').style.display = 'block';
                trackEvent('Feedback', 'Error', type);
            }
        };
        xhr.onerror = function() {
            btn.textContent = origText;
            btn.disabled = false;
            document.getElementById('fbError').style.display = 'block';
        };
        xhr.send(JSON.stringify({
            type: type,
            message: msg,
            contact: contact,
            _subject: '[ToolHero Feedback] ' + type,
            _captcha: 'false'
        }));
    };

    window.openFeedbackModal = function() {
        var modal = document.getElementById('feedbackModal');
        if (!modal) { initFeedbackModal(); modal = document.getElementById('feedbackModal'); }
        // Reset form state
        var inner = document.getElementById('fbFormInner');
        var success = document.getElementById('fbSuccess');
        var err = document.getElementById('fbError');
        if (inner) inner.style.display = 'block';
        if (success) success.style.display = 'none';
        if (err) err.style.display = 'none';
        document.getElementById('fbModalMsg').value = '';
        document.getElementById('fbModalContact').value = '';
        modal.style.display = 'flex';
        trackEvent('Feedback', 'Open', 'Modal');
    };

    initFeedbackModal();

    // ========== Share ==========
    window.shareTool = function(title, url) {
        if (navigator.share) {
            navigator.share({ title: title, url: url }).catch(function() {});
        } else {
            var ta = document.createElement('textarea');
            ta.value = title + ' - ' + url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            alert('Link copied!');
        }
    };

    // ========== Analytics ==========
    window.trackEvent = function(category, action, label) {
        if (typeof gtag === 'function') {
            gtag('event', action, { event_category: category, event_label: label });
        }
    };

    document.querySelectorAll('.calc-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            trackEvent('Tool', 'Calculate', document.title || 'Unknown');
        });
    });
    document.querySelectorAll('.affiliate-link').forEach(function(link) {
        link.addEventListener('click', function() {
            trackEvent('Affiliate', 'Click', link.href);
        });
    });

    // Make contact buttons work
    document.querySelectorAll('.contact-trigger').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            openContactModal();
        });
    });

    console.log('ToolHero ready');
})();
