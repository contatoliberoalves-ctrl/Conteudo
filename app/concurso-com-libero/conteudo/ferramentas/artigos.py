import re,html,sys
import os
D=os.environ.get("LEIS_DIR","/tmp/leis")+"/"
_c={}
def carrega(n):
    if n in _c: return _c[n]
    d=open(D+n+'.htm','rb').read().decode('utf-8','ignore')
    d=re.sub(r'(?is)<(script|style|s|strike|del)\b[^>]*>.*?</\1>',' ',d)
    d=re.sub(r'(?is)<em>\s*-.*?</em>',' ',d)
    t=html.unescape(re.sub(r'<[^>]+>',' ',d))
    t=re.sub(r'\s+',' ',t)
    t=re.sub(r'\((?:[^()]*?)(Reda[çc][ãa]o|[Ii]nclu[ií]d|Vide|[Aa]crescid|Revogad|[Vv]ig[êe]ncia|[Pp]romulga)[^()]*\)','',t)
    t=re.sub(r'(\d) º',r'\1º',t); t=re.sub(r'\s+',' ',t)
    _c[n]=t; return t
def art(n,num):
    t=carrega(n)
    m=re.search(r'(?:Art\. ?|Artigo )'+re.escape(num)+r'(?:º)?\.? ',t)
    if not m: return None
    s=m.start()
    nx=re.search(r' (?:Art\. ?|Artigo )\d',t[s+6:])
    return t[s:s+6+(nx.start() if nx else 2500)].strip()
if __name__=='__main__':
    for a in sys.argv[2:]: print('=====',a); print(art(sys.argv[1],a))
