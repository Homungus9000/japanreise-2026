import {webcrypto} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const iterations=600000;
export async function encryptPage(html,password) {
 const salt=webcrypto.getRandomValues(new Uint8Array(16));
 const iv=webcrypto.getRandomValues(new Uint8Array(12));
 const material=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt']);
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(html));
 const payload=Buffer.concat([salt,iv,Buffer.from(ciphertext)]).toString('base64');
 return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive"><meta name="theme-color" content="#f6f3ed"><title>Japanreise 2026 · Familienzugang</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;background:#f6f3ed;color:#263b3a;font:17px/1.6 system-ui,-apple-system,sans-serif;padding:24px}main{width:100%;max-width:440px;background:#fffefa;border:1px solid #dedfd5;border-radius:20px;padding:36px;box-shadow:0 8px 40px #273a3510}.eyebrow{font-size:12px;letter-spacing:.17em;color:#a34e37;font-weight:750;text-transform:uppercase}h1{font:normal 40px/1.2 Georgia,serif;letter-spacing:-.035em;margin:15px 0}p{color:#596c66;font-size:15px}label{display:block;margin-top:25px;font-size:14px;font-weight:650}input,button{width:100%;font:inherit;border-radius:9px;padding:13px 15px}input{margin:7px 0 16px;border:1px solid #afc0b5;background:white;color:#263b3a}button{background:#355e51;color:white;border:0;cursor:pointer;font-weight:650}button:disabled{opacity:.65}input:focus-visible,button:focus-visible{outline:3px solid #b35439;outline-offset:3px}#message{min-height:24px;margin-bottom:0;color:#913b29}noscript{color:#913b29}@media(max-width:400px){main{padding:25px}h1{font-size:35px}}</style></head>
<body><main><div class="eyebrow">Unser Familienplan</div><h1>Japanreise 2026</h1><p>Unser Reiseplan ist mit einem Passwort geschützt.</p><form id="unlock-form"><label for="password">Passwort</label><input id="password" type="password" autocomplete="current-password" required aria-describedby="message"><button type="submit">Reiseplan öffnen</button><p id="message" role="status" aria-live="polite"></p></form><noscript>Bitte JavaScript aktivieren, um den Reiseplan zu öffnen.</noscript></main>
<script>
'use strict';
const encryptedPage='${payload}';
const form=document.getElementById('unlock-form');
const field=document.getElementById('password');
const button=form.querySelector('button');
const message=document.getElementById('message');
form.addEventListener('submit',async(event)=>{
 event.preventDefault();
 if(!globalThis.crypto?.subtle){message.textContent='Bitte die Seite über HTTPS in einem aktuellen Browser öffnen.';return;}
 button.disabled=true;message.textContent='Reiseplan wird geöffnet …';
 try{
  const bytes=Uint8Array.from(atob(encryptedPage),c=>c.charCodeAt(0));
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(field.value),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes.slice(0,16),iterations:${iterations},hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(16,28)},key,bytes.slice(28));
  field.value='';
  const html=new TextDecoder().decode(plain);
  document.open();document.write(html);document.close();
 }catch{
  message.textContent='Das Passwort stimmt nicht. Bitte erneut versuchen.';
  field.value='';field.focus();button.disabled=false;
 }
});
</script></body></html>`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const input=process.argv[2];
 if(!input)throw new Error('HTML-Quelldatei als Argument angeben; Passwort über Standardeingabe.');
 const password=readFileSync(0,'utf8').replace(/\r?\n$/,'');
 if(!password)throw new Error('Passwort fehlt.');
 const source=readFileSync(input,'utf8');
 if(source.includes('const encryptedPage='))throw new Error('Quelle ist bereits verschlüsselt.');
 writeFileSync(new URL('../index.html',import.meta.url),await encryptPage(source,password));
 console.log('Passwortgeschützte index.html erstellt.');
}
