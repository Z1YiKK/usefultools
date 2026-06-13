import os

ROOT = 'F:/money-site'

fixes = [
    ('href="/"', 'href="./"', 'href="../"', 'href="../"'),
    ('href="/#tools"', 'href="./#tools"', 'href="../#tools"', 'href="../#tools"'),
    ('href="/blog/"', 'href="blog/"', 'href="../blog/"', 'href="./"'),
    ('href="/tools/pet-cost-calculator.html"', 'href="tools/pet-cost-calculator.html"', 'href="pet-cost-calculator.html"', 'href="../tools/pet-cost-calculator.html"'),
    ('href="/tools/mortgage-calculator.html"', 'href="tools/mortgage-calculator.html"', 'href="mortgage-calculator.html"', 'href="../tools/mortgage-calculator.html"'),
    ('href="/tools/bmi-calculator.html"', 'href="tools/bmi-calculator.html"', 'href="bmi-calculator.html"', 'href="../tools/bmi-calculator.html"'),
    ('href="/tools/savings-calculator.html"', 'href="tools/savings-calculator.html"', 'href="savings-calculator.html"', 'href="../tools/savings-calculator.html"'),
    ('href="/tools/subscription-calculator.html"', 'href="tools/subscription-calculator.html"', 'href="subscription-calculator.html"', 'href="../tools/subscription-calculator.html"'),
    ('href="/tools/tip-calculator.html"', 'href="tools/tip-calculator.html"', 'href="tip-calculator.html"', 'href="../tools/tip-calculator.html"'),
    ('href="/tools/moving-calculator.html"', 'href="tools/moving-calculator.html"', 'href="moving-calculator.html"', 'href="../tools/moving-calculator.html"'),
    ('href="/tools/fuel-calculator.html"', 'href="tools/fuel-calculator.html"', 'href="fuel-calculator.html"', 'href="../tools/fuel-calculator.html"'),
    ('href="/blog/pet-cost-guide.html"', 'href="blog/pet-cost-guide.html"', 'href="../blog/pet-cost-guide.html"', 'href="pet-cost-guide.html"'),
    ('href="/blog/mortgage-tips.html"', 'href="blog/mortgage-tips.html"', 'href="../blog/mortgage-tips.html"', 'href="mortgage-tips.html"'),
    ('href="/blog/bmi-guide.html"', 'href="blog/bmi-guide.html"', 'href="../blog/bmi-guide.html"', 'href="bmi-guide.html"'),
    ('href="/privacy.html"', 'href="privacy.html"', 'href="../privacy.html"', 'href="../privacy.html"'),
    ('href="/terms.html"', 'href="terms.html"', 'href="../terms.html"', 'href="../terms.html"'),
    ('href="/contact.html"', 'href="contact.html"', 'href="../contact.html"', 'href="../contact.html"'),
]

def get_col(filepath):
    rel = os.path.relpath(filepath, ROOT)
    if 'tools' in rel:
        return 1
    if 'blog' in rel:
        return 2
    return 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fn)
        col = get_col(fpath)

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False
        for pattern, repl_root, repl_tools, repl_blog in fixes:
            if col == 0:
                repl = repl_root
            elif col == 1:
                repl = repl_tools
            else:
                repl = repl_blog

            if pattern in content:
                content = content.replace(pattern, repl)
                changed = True

        if changed:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            rel = os.path.relpath(fpath, ROOT)
            print('[OK] ' + rel)

print('All paths fixed!')
