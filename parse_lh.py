import json, re, sys
html = open(r'c:\Users\Athos\ADS\Meus Projetos\desafio\localhost_5173-20260901T111839.html', 'r', encoding='utf-8').read()
match = re.search(r'window\.__LIGHTHOUSE_JSON__ = (\{.*?\});</script>', html, re.DOTALL)
if match:
    data = json.loads(match.group(1))
    print('Scores:')
    for cat in data['categories'].values():
        print(f"{cat['title']}: {cat['score'] * 100 if cat.get('score') else 0}")
    print('\nFailed Audits:')
    for audit_id, audit in data['audits'].items():
        if audit.get('score') is not None and audit['score'] < 1 and audit.get('scoreDisplayMode') != 'notApplicable' and audit.get('scoreDisplayMode') != 'informative':
            print(f"- {audit['title']} (Score: {audit['score']}): {audit.get('description', '').split('.')[0]}")
else:
    print('Could not find Lighthouse JSON data')
