"""
ToolHero Status Check — runs a full health check on all systems
Usage: python status-check.py
"""
import sys, os, json, urllib.request, ssl, datetime

print('=' * 60)
print('  ToolHero Status Check')
print(f'  {datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}')
print('=' * 60)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
ctx.set_ciphers('DEFAULT')

def check_url(url, label):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ToolHeroBot/1.0'})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        print(f'  [OK] {label} — HTTP {resp.status}')
        return True
    except Exception as e:
        print(f'  [FAIL] {label} — {e}')
        return False

def check_worker(path, label):
    return check_url(f'https://pinproxy.zhuyikun666.workers.dev{path}', label)

# 1. Site reachability
print('\n--- Site Reachability ---')
check_url('https://toolhero.cc/', 'Homepage')
check_url('https://toolhero.cc/tools/bmi-calculator.html', 'BMI Calculator')
check_url('https://toolhero.cc/tools/calorie-calculator.html', 'Calorie Calculator')

# 2. Worker proxy
print('\n--- Worker Proxy ---')
check_worker('/bmi', 'Worker: BMI')
check_worker('/calorie', 'Worker: Calorie')
check_worker('/home', 'Worker: Home')
check_worker('/glp1', 'Worker: GLP-1')

# 3. Sitemap
print('\n--- SEO ---')
check_url('https://toolhero.cc/sitemap.xml', 'Sitemap')

# 4. GitHub
print('\n--- GitHub ---')
check_url('https://github.com/Z1YiKK/usefultools', 'Repo')

# 5. Bitly links
print('\n--- Bitly Links ---')
bitlys = {
    'BMI': 'https://bit.ly/4aW7nCL',
    'Calorie': 'https://bit.ly/4eCyTGL',
    'BMI Blog': 'https://bit.ly/3Skvl4w',
    'GLP-1': 'https://bit.ly/4agd66d',
    'Home': 'https://bit.ly/3QUAK1B',
}
for name, url in bitlys.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'ToolHeroBot/1.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        status = '302' if resp.status == 200 else str(resp.status)
        print(f'  [OK] Bitly {name} — redirects')
    except Exception as e:
        print(f'  [WARN] Bitly {name} — {e}')

# Summary
print('\n' + '=' * 60)
print('  Status check complete.')
print('  AWIN: Login and check manually')
print('  Pinterest: Login and check manually')
print('  Bing: Login and check IndexNow status')
print('=' * 60)
