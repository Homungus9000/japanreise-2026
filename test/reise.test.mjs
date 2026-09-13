import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {encryptPage} from '../scripts/protect.mjs';
async function decrypt(page,password){
 const bytes=Buffer.from(page.match(/const encryptedPage='([^']+)'/)[1],'base64');
 const material=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt:bytes.subarray(0,16),iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
 return new TextDecoder().decode(await webcrypto.subtle.decrypt({name:'AES-GCM',iv:bytes.subarray(16,28)},key,bytes.subarray(28)));
}
test('HTML bleibt verborgen; nur richtiges Passwort entschlüsselt vollständig',async()=>{
 const html='<h1>Vertraulicher Test: Grüße aus Japan</h1>';
 const encrypted=await encryptPage(html,'test-only-password');
 assert.ok(!encrypted.includes(html));assert.ok(!encrypted.includes('test-only-password'));
 assert.equal(await decrypt(encrypted,'test-only-password'),html);
 await assert.rejects(decrypt(encrypted,'incorrect-password'));
});
test('Jede Verschlüsselung verwendet neuen Salt und IV',async()=>{
 assert.notEqual(await encryptPage('<p>Test</p>','example'),await encryptPage('<p>Test</p>','example'));
});
