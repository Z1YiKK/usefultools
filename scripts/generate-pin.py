"""
Pin Image Generator for ToolHero
Usage: python generate-pin.py [bmi|calorie|mortgage|savings|pet|fuel|tip|moving|subscription]
Outputs: pin image + description text ready for Pinterest
"""
from PIL import Image, ImageDraw, ImageFont
import os, sys

# Config
W, H = 1000, 1500
OUT_DIR = 'F:/360MoveData/Users/Administrator/Desktop/图片设计'
FONT_BOLD = 'C:/Windows/Fonts/arialbd.ttf'
FONT_REG = 'C:/Windows/Fonts/segoeui.ttf'
FONT_SEMI = 'C:/Windows/Fonts/segoeuib.ttf'

# Pin definitions
PINS = {
    'bmi': {
        'title': 'Free BMI Calculator',
        'subtitle': 'Check Your Body Mass Index',
        'bullets': ['Healthy weight range', 'Age & gender context', 'Instant results'],
        'cta': 'Calculate Now',
        'worker_path': '/bmi',
        'color': (124, 58, 237),
        'keywords': '#BMIcalculator #healthtools #weightloss',
        'description': 'Instantly calculate your BMI with age and gender context. See your healthy weight range, weight category, and ponderal index. 100% free, no sign-up.',
        'board': 'Health & Fitness Tools',
        'tags': 'BMI, health tools, weight loss, fitness',
    },
    'calorie': {
        'title': 'Calorie Calculator',
        'subtitle': 'BMR, TDEE & Daily Targets',
        'bullets': ['Mifflin-St Jeor formula', 'Weight loss or gain goals', 'Macro breakdown'],
        'cta': 'Calculate Now',
        'worker_path': '/calorie',
        'color': (249, 115, 22),
        'keywords': '#caloriecalculator #nutrition #weightloss',
        'description': 'Find out exactly how many calories you need per day. Uses the Mifflin-St Jeor equation — the gold standard. Get BMR, TDEE, and personalized targets.',
        'board': 'Health & Fitness Tools',
        'tags': 'calorie calculator, nutrition, weight loss, diet',
    },
    'mortgage': {
        'title': 'Mortgage Calculator',
        'subtitle': 'Save Thousands in Interest',
        'bullets': ['Extra payment impact', 'Full amortization table', 'Years of savings'],
        'cta': 'Calculate Now',
        'worker_path': '/mortgage',
        'color': (14, 116, 144),
        'keywords': '#mortgagecalculator #personalfinance #moneytips',
        'description': 'See how extra payments can save you thousands and shave years off your mortgage. Free amortization schedule included.',
        'board': 'Finance Tools',
        'tags': 'mortgage, personal finance, home buying, money tips',
    },
    'savings': {
        'title': 'Savings Calculator',
        'subtitle': 'Compound Interest Growth',
        'bullets': ['Goal timeline', 'Monthly deposit plan', 'Interest projections'],
        'cta': 'Calculate Now',
        'worker_path': '/savings',
        'color': (5, 150, 105),
        'keywords': '#savingscalculator #compoundinterest #moneytips',
        'description': 'How long until you reach your goal? See compound interest growth, monthly deposits, and your target date. Free, no sign-up.',
        'board': 'Finance Tools',
        'tags': 'savings, compound interest, personal finance, money goals',
    },
    'pet': {
        'title': 'Pet Cost Calculator',
        'subtitle': 'Monthly & Lifetime Costs',
        'bullets': ['All pet types covered', 'Regional price data', 'Vet, food, insurance'],
        'cta': 'Calculate Now',
        'worker_path': '/pet',
        'color': (190, 24, 93),
        'keywords': '#petcost #dogowner #catowner #petcare',
        'description': 'How much does a dog, cat, or rabbit really cost? See monthly and lifetime costs including food, vet, insurance, and supplies.',
        'board': 'Pet Owners',
        'tags': 'pet costs, dog owner, cat owner, pet care, pet budget',
    },
}

def create_pin(pin_key):
    pin = PINS[pin_key]
    color = pin['color']

    # White bg
    img = Image.new('RGB', (W, H), '#FFFFFF')
    draw = ImageDraw.Draw(img)
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)

    # Large colored rounded rectangle
    od.rounded_rectangle([60, 180, W-60, 780], radius=40, fill=(*color, 255))
    # Gold accent bar
    od.rounded_rectangle([60, 180, W-60, 192], radius=6, fill=(251, 191, 36, 255))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img)

    # Fonts
    title_font = ImageFont.truetype(FONT_BOLD, 100)
    subtitle_font = ImageFont.truetype(FONT_BOLD, 60)
    body_font = ImageFont.truetype(FONT_SEMI, 48)
    small_font = ImageFont.truetype(FONT_REG, 38)
    btn_font = ImageFont.truetype(FONT_BOLD, 52)

    # Title inside colored block
    tw = title_font.getbbox(pin['title'])[2]
    draw.text(((W-tw)//2, 280), pin['title'], fill='white', font=title_font)

    sw = subtitle_font.getbbox(pin['subtitle'])[2]
    draw.text(((W-sw)//2, 400), pin['subtitle'], fill='#fbbf24', font=subtitle_font)

    # Separator
    for x in range(300, 701):
        img.putpixel((x, 500), (251, 191, 36))
        img.putpixel((x, 501), (251, 191, 36))
    draw = ImageDraw.Draw(img)

    # Bullets
    for i, bullet in enumerate(pin['bullets']):
        y = 550 + i * 80
        draw.text((200, y), '✓  ' + bullet, fill='#ddd6fe', font=body_font)

    # Below colored block - 3 feature columns
    features = [('Instant', 'Real-time results'), ('Free', 'No sign-up'), ('Private', 'Data stays on device')]
    for i, (feat, desc) in enumerate(features):
        x = 110 + i * 280
        draw.text((x, 860), feat, fill='#' + ''.join(f'{c:02x}' for c in color), font=body_font)
        draw.text((x, 920), desc, fill='#94a3b8', font=small_font)

    # CTA Button
    btn_w, btn_h = 520, 100
    btn_x = (W-btn_w)//2
    btn_y = 1060
    od.rounded_rectangle([btn_x, btn_y, btn_x+btn_w, btn_y+btn_h], radius=20, fill=(*color, 255))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img)

    btw = btn_font.getbbox(pin['cta'] + '  →')[2]
    draw.text(((W-btw)//2, btn_y+22), pin['cta'] + '  →', fill='white', font=btn_font)

    # Footer
    fw = small_font.getbbox('toolhero.cc')[2]
    draw.text(((W-fw)//2, H-60), 'toolhero.cc', fill='#cbd5e1', font=small_font)

    filename = f'{OUT_DIR}/pin-{pin_key}-auto.png'
    img.save(filename, 'PNG')

    # Output posting info
    worker_url = f'https://pinproxy.zhuyikun666.workers.dev{pin["worker_path"]}'

    print(f'''
=== {"="*50}
[PIN] {pin["title"]}
=== {"="*50}

Image: {filename}

Posting Info:
   Title:       {pin["title"]}
   Description: {pin["description"]} {pin["keywords"]}
   Link:        {worker_url}
   Board:       {pin["board"]}
   Tags:        {pin["tags"]}
   Alt Text:    {pin["title"]} Pinterest pin - purple gradient design, bold white text, calculator illustration, clean modern layout
''')
    return filename

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Available pins: ' + ', '.join(PINS.keys()))
        print('Usage: python generate-pin.py bmi')
        sys.exit(1)

    key = sys.argv[1].lower()
    if key not in PINS:
        print(f'Unknown pin: {key}. Available: {", ".join(PINS.keys())}')
        sys.exit(1)

    create_pin(key)
