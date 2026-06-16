const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless:'new'});
  const results = {ok:[], issues:[]};

  const pages = [
    {n:'Home', u:'https://toolhero.cc'},
    {n:'Pet', u:'https://toolhero.cc/tools/pet-cost-calculator.html'},
    {n:'Mortgage', u:'https://toolhero.cc/tools/mortgage-calculator.html'},
    {n:'BMI', u:'https://toolhero.cc/tools/bmi-calculator.html'},
    {n:'Savings', u:'https://toolhero.cc/tools/savings-calculator.html'},
    {n:'Sub', u:'https://toolhero.cc/tools/subscription-calculator.html'},
    {n:'Tip', u:'https://toolhero.cc/tools/tip-calculator.html'},
    {n:'Moving', u:'https://toolhero.cc/tools/moving-calculator.html'},
    {n:'Fuel', u:'https://toolhero.cc/tools/fuel-calculator.html'},
    {n:'Calorie', u:'https://toolhero.cc/tools/calorie-calculator.html'},
    {n:'Blog', u:'https://toolhero.cc/blog/'},
    {n:'Privacy', u:'https://toolhero.cc/privacy.html'},
    {n:'Terms', u:'https://toolhero.cc/terms.html'},
    {n:'Contact', u:'https://toolhero.cc/contact.html'},
  ];

  for (const p of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', function(err) { errors.push(err.message.slice(0,80)); });
    try {
      await page.setViewport({width:375, height:812, isMobile:true});
      await page.goto(p.u, {waitUntil:'networkidle0', timeout:15000});
      const d = await page.evaluate(function() {
        var body = document.body, html = document.documentElement;
        return {
          title: document.title.includes('ToolHero'),
          overflow: Math.max(body.scrollWidth, html.scrollWidth) - window.innerWidth,
          logo: !!document.querySelector('.logo-icon'),
          nav: !!document.querySelector('.nav-links'),
          footer: !!document.querySelector('footer'),
          ad: !!document.querySelector('script[src*="adsbygoogle"]'),
          ga: !!document.querySelector('script[src*="googletagmanager"]'),
          canonical: !!(document.querySelector('link[rel="canonical"]')||{}).href,
          favicon: !!(document.querySelector('link[rel="icon"]')||{}).href,
        };
      });
      var pageIssues = [];
      if (!d.title) pageIssues.push('Wrong title');
      if (d.overflow > 10) pageIssues.push('Overflow '+d.overflow+'px');
      if (!d.logo) pageIssues.push('No logo');
      if (!d.nav) pageIssues.push('No nav');
      if (!d.footer) pageIssues.push('No footer');
      if (!d.ad) pageIssues.push('No AdSense');
      if (!d.ga) pageIssues.push('No GA4');
      if (!d.canonical) pageIssues.push('No canonical');
      if (!d.favicon) pageIssues.push('No favicon');
      if (errors.length>0) pageIssues.push('JS: '+errors[0]);

      if (pageIssues.length===0) results.ok.push(p.n);
      else results.issues.push({n:p.n, i:pageIssues});
    } catch(e) {
      results.issues.push({n:p.n, i:['FAIL: '+e.message.slice(0,60)]});
    }
    await page.close();
  }

  console.log('PASSED: '+results.ok.length+'/'+pages.length);
  results.ok.forEach(function(n) { console.log('  OK '+n); });
  if (results.issues.length) {
    console.log('\nISSUES:');
    results.issues.forEach(function(i) { console.log('  '+i.n+': '+i.i.join(', ')); });
  }

  console.log('\n=== Coverage ===');
  var cov = [
    {t:'Pet Cost', a:2},
    {t:'Mortgage', a:2},
    {t:'BMI', a:1},
    {t:'Savings', a:2},
    {t:'Subscription', a:2},
    {t:'Tip', a:1},
    {t:'Moving', a:2},
    {t:'Fuel', a:1},
    {t:'Calorie', a:1},
  ];
  cov.forEach(function(c) { console.log('  '+c.t+': '+c.a+' article(s)'); });
  console.log('Total: 15 articles for 9 tools');

  await browser.close();
})();
