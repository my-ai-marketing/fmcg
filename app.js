const DEFAULT_FX=95.9355;let fx=DEFAULT_FX;
function signParts(n){return{sign:n<0?'-':'',value:Math.abs(Number(n))}}
function formatINR(n,plain=false){const{sign,value}=signParts(n);if(plain||value<100000){const d=value<100?2:0;return sign+'₹'+value.toLocaleString('en-IN',{maximumFractionDigits:d})}if(value>=10000000)return sign+'₹'+(value/10000000).toFixed(value>=100000000?1:2)+' cr';return sign+'₹'+(value/100000).toFixed(value>=1000000?1:2)+' lakh'}
function formatUSD(n,plain=false){const{sign,value}=signParts(n);if(plain||value<1000)return sign+'$'+value.toLocaleString('en-US',{minimumFractionDigits:value<100?2:0,maximumFractionDigits:2});if(value>=1000000)return sign+'$'+(value/1000000).toFixed(value>=10000000?1:2)+'M';return sign+'$'+(value/1000).toFixed(value>=100000?1:2)+'K'}
function moneyMarkup(a,b){return '<span class="money-inr">'+a+'</span><small class="money-usd">/ '+b+'</small>'}
function dualFromINR(n,plain=false){return moneyMarkup(formatINR(n,plain),formatUSD(Number(n)/fx,plain))}
function dualRange(low,high,plain=false){const a=formatINR(low,plain)+'–'+formatINR(high,plain).replace(/^₹/,'');const b=formatUSD(low/fx,plain)+'–'+formatUSD(high/fx,plain).replace(/^\$/,'');return moneyMarkup(a,b)}
function renderMoney(){document.querySelectorAll('.money').forEach(el=>{const plain=el.dataset.plain==='1';if(el.dataset.low!==undefined&&el.dataset.high!==undefined)el.innerHTML=dualRange(Number(el.dataset.low),Number(el.dataset.high),plain);else if(el.dataset.inr!==undefined)el.innerHTML=dualFromINR(Number(el.dataset.inr),plain)});['fxHero','fxSide'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=fx.toFixed(2)})}
function toggleMenu(force){const open=typeof force==='boolean'?force:!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);document.querySelector('.menu-btn')?.setAttribute('aria-expanded',String(open))}
function togglePresent(){document.body.classList.toggle('presentation')}
window.toggleMenu=toggleMenu;window.togglePresent=togglePresent;
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.nav a')];
if('IntersectionObserver'in window){const o=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+v.target.id))},{rootMargin:'-20% 0px -65% 0px',threshold:[0,.15,.35]});sections.forEach(s=>o.observe(s))}
const fxInput=document.getElementById('fxRate');if(fxInput){fxInput.value=DEFAULT_FX.toFixed(2);fxInput.addEventListener('input',()=>{const n=Number(fxInput.value);if(Number.isFinite(n)&&n>0){fx=n;renderMoney()}})}
renderMoney();