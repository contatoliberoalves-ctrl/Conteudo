#!/usr/bin/env python3
"""Dá nota a um roteiro de vídeo curto em português: python3 score.py rascunho.txt

Uma frase falada por linha; a última linha é o CTA. Falha grave custa 15, aviso custa 5.
O ciclo do SKILL.md roda até o roteiro tirar 90+ sem nenhuma falha grave.
Adaptação do score_en.py (original em inglês) para pt-BR e para os perfis do Líbero.
Opções: --wps 3.5 (palavras faladas por segundo, padrão 3.5) e --json.
"""
import json, re, sys

HARD = [
    (r'—|–', 'travessão (ninguém fala travessão)'),
    (r';', 'ponto e vírgula'),
    (r'(?i)\bnão (?:é )?(?:só|apenas|somente)\b[^.!?]*\b(?:mas|como também)\b', '"não só X, mas Y"'),
    (r'(?i)\bnão (?:é|se trata de) [^.!?,]{1,40}[,.] ?(?:é|e sim|mas sim)\b', '"não é X, é Y"'),
    (r'(?i)vou te contar uma coisa|deixa isso entrar|letras miúdas|a verdade é que|nos dias de hoje|apertem os cintos|'
     r'imagina só|vale (?:ressaltar|destacar|lembrar) que|no fim das contas|sem mais delongas|seja você (?:um |uma )?\w+ ou', 'enchimento / rubrica de palco'),
    (r'(?i)\b(spoiler|plot twist)\s*:|é aqui que (?:fica|a coisa fica) interessante|e o melhor\?|sabe qual a melhor parte', 'suspense falso'),
    (r'(?i)\b(desvend\w*|mergulh\w* de cabeça|alavanc\w*|potencializ\w*|robust[oa]s?|de ponta|divisor de águas|revolucion[aá]ri\w*|'
     r'transformador\w*|empoder\w*|turbin\w*|próximo nível|sinergia|imersão|jornada)\b', 'palavra com cara de IA'),
    (r'(?i)\b(mina de ouro|pulo do gato|cereja do bolo|botão de pânico|receita de bolo|ovo de colombo)\b', 'metáfora de efeito'),
    (r'(?i)\b(?:eu )?test(?:ei|amos) (?:isso|essa|esse) e\b', '"testei isso e" (só se for VERDADE: confira a ficha de fatos)'),
]
NUM_WORDS = (r'um|uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|quinze|vinte|trinta|cinquenta|'
             r'cem|cento|mil|milhão|milhões|bilhão|metade|dobro|triplo')
NUM = r'\d|\b(?:' + NUM_WORDS + r')\b'
REHOOK = re.compile(r'(?i)(?:' + NUM + r')|\b(mas|só que|porém|aí|então|agora|depois|primeiro|segundo|terceiro|'
                    r'por último|finalmente|o pior|o mais|olha|repara|ou seja|cuidado|pegadinha|atenção)\b')
CTA = re.compile(r'(?i)\b(comenta|comente|segue|siga|me segue|link|assiste|assista|parte 2|salva|salve|manda|compartilha|inscreve|inscreva)')

def sentencas(t):
    return [s.strip() for s in re.split(r'(?<=[.?!])\s+|\n+', t) if s.strip()]

def tem_nome(frase):
    # palavra com maiúscula que não é a primeira da frase (STF, OAB, Lula, CF, Lex…) ou sigla
    palavras = frase.split()[1:]
    return any(re.match(r'^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+', p) for p in palavras) or bool(re.search(r'\b[A-Z]{2,}\b', frase))

def score(texto, wps=3.5):
    hard, soft = [], []
    n = len(texto.split()); secs = round(n / wps)
    if not 90 <= n <= 220: soft.append(f'tamanho {n} palavras ≈ {secs}s (mire em 100–200, 30–60 s)')
    S = sentencas(texto); gancho = S[0] if S else ''
    if len(gancho.split()) > 20: soft.append(f'gancho com {len(gancho.split())} palavras (mire em 20 ou menos)')
    if not re.search(NUM, gancho, re.I) and not tem_nome(gancho):
        soft.append('gancho sem número e sem nada com nome (artigo, STF, OAB, uma pessoa…)')
    for rx, motivo in HARD:
        if re.search(rx, texto): hard.append(motivo)
    uma = [s for s in S if len(s.split()) == 1]
    if len(uma) > 1: hard.append(f'{len(uma)} frases dramáticas de uma palavra: {uma[:3]}')
    longas = [s for s in S if len(s.split()) > 30]
    if longas: soft.append(f'{len(longas)} frase(s) com mais de 30 palavras, ex.: "{longas[0][:70]}…"')
    perg = [s for s in S[1:-1] if s.endswith('?')]
    if len(perg) > 1: soft.append(f'{len(perg)} perguntas retóricas no meio (só o gancho pergunta)')
    tres = [s for s in S if re.search(r'\b\w+, \w+ e \w+\b', s) and len(s.split()) < 12]
    if len(tres) > 1: soft.append('listas de três numa frase só (escolha a que importa)')
    # re-gancho mais ou menos a cada 8 s (~28 palavras): número, virada ou palavra de revelação
    gap = pior = 0
    for s in S[1:-1]:
        gap = 0 if REHOOK.search(s) else gap + len(s.split()); pior = max(pior, gap)
    lim = round(8 * wps)
    if pior > lim: soft.append(f'trecho de {pior} palavras (≈{round(pior / wps)}s) sem re-gancho (número, virada, "primeiro/segundo…")')
    fim = ' '.join(S[-2:])
    if not CTA.search(fim): soft.append('sem CTA claro no fim ("comenta PALAVRA", "me segue", "parte 2")')
    total = max(0, 100 - 15 * len(hard) - 5 * len(soft))
    return {'nota': total, 'graves': hard, 'avisos': soft, 'palavras': n, 'segundos': secs,
            'passou': not hard and total >= 90}

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser(description='Nota de roteiro de vídeo curto (pt-BR)')
    ap.add_argument('arquivo'); ap.add_argument('--wps', type=float, default=3.5); ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    r = score(open(a.arquivo, encoding='utf-8').read(), a.wps)
    if a.json:
        print(json.dumps(r, ensure_ascii=False)); sys.exit(0)
    print(f"NOTA {r['nota']}/100 · {r['palavras']} palavras ≈ {r['segundos']}s")
    for h in r['graves']: print('  GRAVE ', h)
    for s in r['avisos']: print('  aviso ', s)
    print('  PASSOU' if r['passou'] else '  REESCREVER')
