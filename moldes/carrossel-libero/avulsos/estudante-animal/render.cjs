// Gera saida/01.png… a partir de pagina.html. Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
(async()=>{const l={};if(process.env.CHROMIUM_PATH)l.executablePath=process.env.CHROMIUM_PATH;if(process.env.RENDER_PROXY)Object.assign(l,{proxy:{server:process.env.RENDER_PROXY},args:['--ignore-certificate-errors']});
const b=await chromium.launch(l);const p=await b.newPage({viewport:{width:1080,height:1350}});const e=[];p.on('pageerror',x=>e.push(x.message));
await p.goto('file://'+path.join(__dirname,'pagina.html'));await p.waitForSelector('body[data-pronto]');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const out=path.join(__dirname,'saida');fs.mkdirSync(out,{recursive:true});const ss=await p.$$('.s');
for(let i=0;i<ss.length;i++){const parte=i<12?1:2,n=i%12+1;fs.mkdirSync(path.join(out,'parte-'+parte),{recursive:true});await ss[i].screenshot({path:path.join(out,'parte-'+parte,String(n).padStart(2,'0')+'.png')});}
console.log(ss.length,'slides',e);await b.close()})();
