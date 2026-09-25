# docx -> texto com tabelas preservadas (linhas "| a | b |")
import zipfile,re,sys
def txt(p): return ''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>',p)).strip()
def conv(path):
    x=zipfile.ZipFile(path).read('word/document.xml').decode()
    body=x[x.index('<w:body>'):]
    out=[]
    for m in re.finditer(r'<w:tbl>.*?</w:tbl>|<w:p[ >].*?</w:p>',body,re.S):
        b=m.group(0)
        if b.startswith('<w:tbl>'):
            for tr in re.findall(r'<w:tr[ >].*?</w:tr>',b,re.S):
                cells=[' / '.join(t for t in (txt(p) for p in re.findall(r'<w:p[ >].*?</w:p>',tc,re.S)) if t) for tc in re.findall(r'<w:tc>.*?</w:tc>',tr,re.S)]
                out.append('| '+' | '.join(cells)+' |')
        else:
            t=txt(b)
            if t: out.append(('**' if ('<w:b/>' in b and len(t)<100) else '')+('• ' if '<w:numPr>' in b else '')+t)
    return '\n'.join(out)
if __name__=='__main__':
    print(conv(sys.argv[1]))
