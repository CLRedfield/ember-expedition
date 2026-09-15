"""Build the no-dependency standalone release; Python 3.8+ is sufficient."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="src/style.css">', '<style>\n' + (ROOT / 'src/style.css').read_text(encoding='utf-8') + '\n</style>')
for name in ('data', 'engine', 'art', 'ui'):
    html = html.replace(f'<script src="src/{name}.js"></script>', '<script>\n' + (ROOT / f'src/{name}.js').read_text(encoding='utf-8') + '\n</script>')
target = ROOT / '余烬远征_直接试玩.html'
target.write_text(html, encoding='utf-8')
print(f'Built {target.name} ({target.stat().st_size:,} bytes)')
