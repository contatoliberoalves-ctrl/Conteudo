// Robô do canal de promoções: recebe as atualizações do Telegram (webhook).
// - /start CÓDIGO no privado faz de você o administrador (uma vez só).
// - Adicionar o robô como administrador de um canal conecta esse canal.
// - Link de oferta no privado vira post com os botões Publicar, WhatsApp e Descartar.
import { type Config, evento, gravarConfig, lerConfig, numeroOuNulo, segredoWebhook, sql } from "../_shared/db.ts";
import { FONTES } from "../_shared/fontes/index.ts";
import { html, type Oferta } from "../_shared/formatar.ts";
import { lojaDoLink, prepararLinkAmazon } from "../_shared/loja.ts";
import { lerOfertaManual } from "../_shared/oferta_manual.ts";
import { lerPagina } from "../_shared/pagina.ts";
import {
  buscarPostagem,
  criarPostagem,
  descartarPostagem,
  explicarPostagem,
  ofertaDe,
  publicarPostagem,
} from "../_shared/postagens.ts";
import { igual, mensagem } from "../_shared/seguranca.ts";
import {
  COMANDOS,
  enviarOferta,
  ErroTelegram,
  garantirWebhook,
  responder,
  semToken,
  tecladoDescartada,
  tecladoPublicada,
  tecladoRevisao,
  temToken,
  tg,
} from "../_shared/telegram.ts";

type Usuario = { id: number; first_name?: string; username?: string };
type Chat = { id: number; type: string; title?: string; username?: string };
type Entidade = { type: string; offset: number; length: number; url?: string };
type Mensagem = {
  message_id: number;
  from?: Usuario;
  chat: Chat;
  text?: string;
  caption?: string;
  photo?: { file_id: string }[];
  entities?: Entidade[];
  caption_entities?: Entidade[];
};
type Callback = { id: string; from: Usuario; message?: { message_id: number; chat: Chat }; data?: string };
type MembroChat = {
  chat: Chat;
  from: Usuario;
  new_chat_member: { status: string; can_post_messages?: boolean };
};
type Update = { update_id: number; message?: Mensagem; callback_query?: Callback; my_chat_member?: MembroChat };
type CanalSalvo = { id: number; titulo: string; usuario: string | null; tipo: string; por: number };

export const AJUDA = `<b>Como usar</b>
• Mande aqui o link de uma oferta, se quiser com foto e texto, por exemplo:
<code>Fone JBL Tune 520BT
https://amzn.to/xxxx
de 399,90 por 199,90
cupom JBL10</code>
Eu monto o post e mostro antes. Aí é só tocar em <b>Publicar no canal</b>.
• <b>Mandar no WhatsApp</b> abre o WhatsApp com a mensagem pronta: você escolhe o grupo e envia.
• Shopee e AliExpress: eu procuro ofertas sozinho a cada 5 minutos (quando as chaves de afiliado estiverem configuradas).

<b>Comandos</b>
/status: situação do robô
/revisao: as ofertas que eu achar vêm para você aprovar (padrão)
/automatico: eu publico sozinho as ofertas que achar
/pausar e /retomar: param e voltam as ofertas automáticas
/desconto 35: muda o desconto mínimo
/buscas: lista o que eu procuro (/addbusca e /delbusca mudam a lista)
/teste: mostra um exemplo de post`;

const vistos = new Set<number>();

export async function tratarRequisicao(req: Request): Promise<Response> {
  if (req.method === "GET") return await paginaSituacao();
  if (req.method !== "POST") return new Response("Método não permitido", { status: 405 });
  const recebido = req.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!igual(recebido, await segredoWebhook())) return new Response("Não autorizado", { status: 401 });
  if (!temToken()) return new Response("ok");
  let u: Update;
  try {
    u = await req.json();
  } catch {
    return new Response("ok");
  }
  // O Telegram reenvia se demorarmos: a mesma atualização não é tratada duas vezes.
  if (vistos.has(u.update_id)) return new Response("ok");
  if (vistos.size > 1000) vistos.clear();
  vistos.add(u.update_id);
  try {
    const cfg = await lerConfig();
    if (u.message) await tratarMensagem(u.message, cfg);
    else if (u.callback_query) await tratarBotao(u.callback_query, cfg);
    else if (u.my_chat_member) await tratarCanal(u.my_chat_member, cfg);
  } catch (e) {
    await evento("erro_bot", { erro: semToken(mensagem(e)).slice(0, 500) });
  }
  // Sempre 200: um erro nosso não deve fazer o Telegram repetir a mesma mensagem.
  return new Response("ok");
}

async function paginaSituacao(): Promise<Response> {
  const linhas = ["Canal de promoções · robô do Telegram", ""];
  if (!temToken()) {
    linhas.push(
      "❌ Falta o token do robô.",
      "Crie o robô com o @BotFather no Telegram e guarde o token como segredo TELEGRAM_BOT_TOKEN",
      "em Supabase → Edge Functions → Secrets. Depois abra esta página de novo.",
    );
  } else {
    try {
      const w = await garantirWebhook();
      linhas.push(`✅ Token configurado: robô @${w.usuario}`);
      linhas.push(w.mudou ? "✅ Webhook registrado agora" : "✅ Webhook já estava registrado");
      if (w.ultimoErro) linhas.push(`⚠️ Último erro informado pelo Telegram: ${w.ultimoErro}`);
      linhas.push("", `Próximo passo: abra https://t.me/${w.usuario} e mande /start seguido do seu código de ativação.`);
    } catch (e) {
      linhas.push(`❌ Não consegui falar com o Telegram: ${semToken(mensagem(e))}`);
    }
  }
  return new Response(linhas.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}

async function tratarMensagem(m: Mensagem, cfg: Config) {
  if (m.chat.type !== "private" || !m.from) return;
  const admin = numeroOuNulo(cfg.admin_id);
  const texto = (m.text ?? m.caption ?? "").trim();
  if (admin == null || m.from.id !== admin) {
    if (/^\/start\b/i.test(texto)) await reivindicar(m, texto, cfg);
    return;
  }
  const cmd = texto.match(/^\/([a-z_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/i);
  if (cmd) return await comando(cmd[1].toLowerCase(), (cmd[2] ?? "").trim(), m.chat.id, cfg);
  await receberOferta(m, texto, cfg);
}

async function reivindicar(m: Mensagem, texto: string, cfg: Config) {
  const de = m.from!;
  if (cfg.admin_id != null) return; // já tem dono: estranhos são ignorados
  const codigo = texto.split(/\s+/)[1] ?? "";
  if (!codigo) {
    return await responder(m.chat.id, "Este robô é particular. Se ele é seu, mande /start seguido do código de ativação.");
  }
  const [{ n }] = await sql()`
    select count(*)::int as n from promo.eventos
    where tipo = 'codigo_errado' and em > now() - interval '1 day' and detalhe->>'usuario' = ${String(de.id)}`;
  if (n >= 5) return;
  if (!igual(codigo.toUpperCase(), String(cfg.codigo_admin ?? "").toUpperCase())) {
    await evento("codigo_errado", { usuario: String(de.id) });
    return await responder(m.chat.id, "Código inválido.");
  }
  const [ok] = await sql()`
    update promo.config set valor = ${JSON.stringify(de.id)}::text::jsonb, atualizado_em = now()
    where chave = 'admin_id' and valor = 'null'::jsonb returning chave`;
  if (!ok) return;
  await gravarConfig("admin_nome", de.first_name ?? de.username ?? "");
  await evento("admin_definido", { usuario: String(de.id) });
  await tg("setMyCommands", { commands: COMANDOS, scope: { type: "chat", chat_id: de.id } }).catch(() => {});
  let canal = "\n\nAgora crie o seu canal (ou grupo) no Telegram e adicione este robô como <b>administrador</b>, com permissão para publicar mensagens.";
  const pendente = cfg.canal_pendente as CanalSalvo | null;
  if (pendente && pendente.por === de.id) {
    await conectarCanal(pendente);
    canal = `\n\n✅ Canal <b>${html(pendente.titulo)}</b> conectado.`;
  }
  await responder(m.chat.id, `🎉 Pronto${de.first_name ? `, ${html(de.first_name)}` : ""}! Você é o administrador deste robô.${canal}\n\n${AJUDA}`);
}

async function comando(nome: string, arg: string, chat: number, cfg: Config) {
  switch (nome) {
    case "start":
    case "ajuda":
    case "help":
      return await responder(chat, AJUDA);
    case "status":
      return await responder(chat, await situacao(cfg));
    case "pausar":
      await gravarConfig("pausado", true);
      return await responder(chat, "⏸️ Pausado. Continuo acompanhando os preços, mas não mando nem publico ofertas automáticas. /retomar para voltar.");
    case "retomar":
      await gravarConfig("pausado", false);
      return await responder(chat, "▶️ De volta às ofertas automáticas.");
    case "revisao":
      await gravarConfig("modo", "revisao");
      return await responder(chat, "👀 Modo revisão: as ofertas que eu achar vêm para cá e só vão para o canal quando você tocar em Publicar.");
    case "automatico": {
      await gravarConfig("modo", "automatico");
      const aviso = cfg.canal_id == null ? "\n\n⚠️ Ainda não há canal conectado: até lá, as ofertas continuam vindo para você aprovar." : "";
      return await responder(chat, `🤖 Modo automático: eu publico sozinho as ofertas que passarem nos filtros e te aviso aqui, com o botão do WhatsApp.${aviso}`);
    }
    case "desconto": {
      const n = Number(arg.replace(/[%\s]/g, ""));
      if (!Number.isInteger(n) || n < 5 || n > 90) return await responder(chat, "Use um número de 5 a 90. Exemplo: /desconto 35");
      await gravarConfig("desconto_minimo", n);
      await gravarConfig("desconto_minimo_sem_historico", Math.min(90, n + 10));
      return await responder(chat, `✅ Desconto mínimo: ${n}% (${Math.min(90, n + 10)}% para produtos que eu ainda não conheço).`);
    }
    case "buscas": {
      const lista = buscas(cfg);
      return await responder(chat, lista.length
        ? `🔎 <b>O que eu procuro</b> (${lista.length}):\n${lista.map(html).join(" · ")}\n\n/addbusca termo para incluir, /delbusca termo para tirar.`
        : "A lista de buscas está vazia. Use /addbusca termo.");
    }
    case "addbusca": {
      const termo = arg.replace(/\s+/g, " ").trim().toLowerCase();
      if (termo.length < 2 || termo.length > 60) return await responder(chat, "Exemplo: /addbusca air fryer");
      const lista = buscas(cfg);
      if (!lista.includes(termo)) lista.push(termo);
      await gravarConfig("buscas", lista.slice(-200));
      return await responder(chat, `✅ Vou procurar também: <b>${html(termo)}</b>`);
    }
    case "delbusca": {
      const termo = arg.replace(/\s+/g, " ").trim().toLowerCase();
      const lista = buscas(cfg);
      if (!lista.includes(termo)) return await responder(chat, "Esse termo não está na lista. Veja em /buscas");
      await gravarConfig("buscas", lista.filter((t) => t !== termo));
      return await responder(chat, `🗑️ Não procuro mais: <b>${html(termo)}</b>`);
    }
    case "teste": {
      const exemplo: Oferta = {
        loja: "shopee",
        titulo: "Fone de Ouvido Bluetooth TWS com Cancelamento de Ruído (exemplo)",
        link: "https://shopee.com.br/",
        preco: 89.9,
        precoDe: 199.9,
        cupom: "EXEMPLO10",
        pix: true,
        detalhes: ["R$ 10 OFF acima de R$ 79"],
      };
      await responder(chat, "Assim os posts aparecem no canal (este é só um exemplo, não foi publicado):");
      return await enviarOferta(chat, exemplo, [[{ text: "🛒 Ver oferta", url: exemplo.link }]]);
    }
    default:
      return await responder(chat, "Não conheço esse comando. Veja /ajuda");
  }
}

const buscas = (cfg: Config): string[] => (Array.isArray(cfg.buscas) ? cfg.buscas.map(String).filter(Boolean) : []);

const hora = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(d);

async function situacao(cfg: Config): Promise<string> {
  const [n] = await sql()`
    select
      (select count(*) from promo.postagens where status = 'publicada'
         and publicado_em >= (date_trunc('day', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'))::int as hoje,
      (select count(*) from promo.postagens where status = 'pendente' and criado_em > now() - interval '1 day')::int as pendentes,
      (select count(*) from promo.produtos)::int as produtos,
      (select max(em) from promo.eventos where tipo = 'ciclo') as ultimo_ciclo`;
  const s = cfg.silencio as { inicio: number; fim: number } | null;
  const fontes = FONTES.map((f) => `${f.nome} ${f.ativa() ? "✅" : "❌ (faltam as chaves)"}`).join(" · ");
  const linhas = [
    "📊 <b>Situação do robô</b>",
    `Modo: ${cfg.modo === "automatico" ? "automático (publico sozinho)" : "revisão (você aprova)"}${cfg.pausado === true ? " · ⏸️ pausado" : ""}`,
    `Canal: ${cfg.canal_id != null ? `<b>${html(String(cfg.canal_titulo ?? cfg.canal_id))}</b>` : "nenhum ainda (adicione o robô como administrador do canal)"}`,
    `Busca automática: ${fontes}`,
    `Amazon: ${Deno.env.get("AMAZON_TAG")?.trim() ? "etiqueta de associado configurada ✅" : "sem etiqueta (AMAZON_TAG) ❌"}`,
    `Desconto mínimo: ${cfg.desconto_minimo}% (${cfg.desconto_minimo_sem_historico}% sem histórico de preço)`,
  ];
  if (s) linhas.push(`Silêncio: das ${s.inicio}h às ${s.fim}h`);
  linhas.push(
    "",
    `Hoje: ${n.hoje} publicadas · ${n.pendentes} esperando você`,
    `Produtos acompanhados: ${n.produtos}${n.ultimo_ciclo ? ` · última busca às ${hora(new Date(n.ultimo_ciclo))}` : ""}`,
  );
  return linhas.join("\n");
}

async function receberOferta(m: Mensagem, texto: string, cfg: Config) {
  // Mensagens encaminhadas de outros canais costumam esconder o link num texto clicável.
  const ents = m.entities ?? m.caption_entities ?? [];
  const escondidos = ents.filter((e) => e.type === "text_link" && e.url).map((e) => e.url!);
  const foto = m.photo?.length ? m.photo[m.photo.length - 1].file_id : null;
  const lida = lerOfertaManual([texto, ...escondidos].join("\n"), { imagem: foto });
  if (!lida) {
    return await responder(m.chat.id, "Não achei nenhum link nessa mensagem. Mande o link da oferta (pode vir junto com o nome, o preço e o cupom). /ajuda");
  }
  const { faltaTitulo, ...oferta } = lida;
  oferta.link = prepararLinkAmazon(oferta.link, Deno.env.get("AMAZON_TAG"));
  let semNome = faltaTitulo;
  if (faltaTitulo || !oferta.imagem || oferta.preco == null || oferta.loja === "outra") {
    const p = await lerPagina(oferta.link);
    if (p) {
      if (oferta.loja === "outra") oferta.loja = lojaDoLink(p.urlFinal);
      if (faltaTitulo && p.titulo) {
        oferta.titulo = p.titulo;
        semNome = false;
      }
      if (!oferta.imagem && p.imagem) oferta.imagem = p.imagem;
      if (oferta.preco == null && p.preco != null && (oferta.precoDe == null || p.preco < oferta.precoDe)) oferta.preco = p.preco;
    }
  }
  // Sem o nome do produto o post fica sem graça: melhor pedir os dados do que publicar "Oferta Mercado Livre".
  if (semNome) {
    return await responder(m.chat.id, [
      "⚠️ Não consegui ler o produto nesse link: a loja não deixa robôs abrirem a página.",
      "",
      "Mande de novo com o nome, o preço e uma foto, por exemplo:",
      "<code>Fone JBL Tune 520BT\nde 399,90 por 199,90\ncupom JBL10\nhttps://meli.la/xxxx</code>",
      "",
      "Ou encaminhe para cá o post da oferta (com a foto) e eu monto no padrão do canal.",
    ].join("\n"));
  }
  const id = await criarPostagem(oferta, "manual", null);
  await enviarOferta(m.chat.id, oferta, tecladoRevisao(id, oferta, false));
  if (cfg.canal_id == null) {
    await responder(m.chat.id, "ℹ️ Ainda não há canal conectado: adicione o robô como administrador do seu canal para o botão Publicar funcionar.");
  }
}

async function tratarBotao(cb: Callback, cfg: Config) {
  const responderBotao = (text?: string, alerta = false) =>
    tg("answerCallbackQuery", { callback_query_id: cb.id, ...(text ? { text, show_alert: alerta } : {}) });
  const admin = numeroOuNulo(cfg.admin_id);
  if (admin == null || cb.from.id !== admin) return await responderBotao("Só o administrador usa estes botões.");
  const [acao, idTexto] = (cb.data ?? "").split(":");
  const id = Number(idTexto);
  if (!Number.isInteger(id) || id <= 0) return await responderBotao();
  const msg = cb.message;
  const trocarBotoes = (inline_keyboard: unknown) =>
    msg
      ? tg("editMessageReplyMarkup", { chat_id: msg.chat.id, message_id: msg.message_id, reply_markup: { inline_keyboard } })
        .catch(() => {})
      : Promise.resolve();

  if (acao === "pub") {
    try {
      const r = await publicarPostagem(id, cfg);
      if (!r.ok) {
        if (r.motivo === "sem_canal") {
          return await responderBotao("Conecte um canal antes: adicione o robô como administrador do seu canal.", true);
        }
        const p = await buscarPostagem(id);
        return await responderBotao(p?.status === "descartada" ? "Essa oferta foi descartada." : "Essa oferta já foi publicada.");
      }
      await trocarBotoes(tecladoPublicada(ofertaDe(r.postagem), r.link));
      return await responderBotao("✅ Publicada no canal!");
    } catch (e) {
      await evento("erro_publicar", { id, erro: semToken(mensagem(e)).slice(0, 500) });
      const motivo = e instanceof ErroTelegram ? e.descricao : "erro inesperado";
      return await responderBotao(`Não consegui publicar: ${motivo}`.slice(0, 200), true);
    }
  }
  if (acao === "desc") {
    const p = await descartarPostagem(id);
    if (p) await trocarBotoes(tecladoDescartada(ofertaDe(p)));
    return await responderBotao(p ? "🗑️ Descartada" : "Essa oferta já tinha sido tratada.");
  }
  if (acao === "info") return await responderBotao(await explicarPostagem(id), true);
  return await responderBotao();
}

async function conectarCanal(c: CanalSalvo) {
  await gravarConfig("canal_id", c.id);
  await gravarConfig("canal_titulo", c.titulo);
  await gravarConfig("canal_usuario", c.usuario);
  await gravarConfig("canal_tipo", c.tipo);
  await gravarConfig("canal_pendente", null);
  await evento("canal_conectado", { id: c.id, titulo: c.titulo });
}

async function tratarCanal(m: MembroChat, cfg: Config) {
  const chat = m.chat;
  if (chat.type === "private") return;
  const status = m.new_chat_member.status;
  const admin = numeroOuNulo(cfg.admin_id);
  const ehCanal = chat.type === "channel";
  const podePostar = ehCanal
    ? status === "administrator" && m.new_chat_member.can_post_messages !== false
    : status === "administrator" || status === "member";
  const c: CanalSalvo = {
    id: chat.id,
    titulo: chat.title ?? String(chat.id),
    usuario: chat.username ?? null,
    tipo: chat.type,
    por: m.from.id,
  };

  if (podePostar) {
    if (admin == null) {
      // Adicionado antes do /start: guarda e conecta quando essa mesma pessoa ativar o robô.
      await gravarConfig("canal_pendente", c);
      return;
    }
    if (m.from.id !== admin) {
      await evento("canal_ignorado", { id: chat.id, titulo: chat.title, por: String(m.from.id) });
      if (!ehCanal) await tg("leaveChat", { chat_id: chat.id }).catch(() => {});
      return;
    }
    const trocou = cfg.canal_id != null && Number(cfg.canal_id) !== chat.id;
    await conectarCanal(c);
    return await responder(
      admin,
      `✅ ${ehCanal ? "Canal" : "Grupo"} <b>${html(c.titulo)}</b> conectado. As ofertas publicadas vão para lá.` +
        (trocou ? `\n(Substituiu <b>${html(String(cfg.canal_titulo ?? cfg.canal_id))}</b>.)` : ""),
    );
  }

  if (ehCanal && status === "administrator" && m.from.id === admin) {
    return await responder(admin, `⚠️ No canal <b>${html(c.titulo)}</b>, falta me dar a permissão de <b>publicar mensagens</b>.`);
  }
  if (cfg.canal_id != null && Number(cfg.canal_id) === chat.id) {
    await gravarConfig("canal_id", null);
    await evento("canal_perdido", { id: chat.id, status });
    if (admin != null) {
      await responder(admin, `⚠️ Perdi o acesso a <b>${html(c.titulo)}</b>. Para voltar a publicar, adicione o robô de novo como administrador.`);
    }
  }
}
