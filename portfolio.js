/* ── CURSOR ── */
const cur=document.getElementById('cur'),ring=document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=(mx-5)+'px';cur.style.top=(my-5)+'px';
});
(function animR(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;
  ring.style.left=(rx-17)+'px';ring.style.top=(ry-17)+'px';
  requestAnimationFrame(animR);})();
document.querySelectorAll('a,button,.proj-card,.skill-cat,.blog-card,.ccard').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='scale(2.2)';ring.style.transform='scale(1.6)'});
  el.addEventListener('mouseleave',()=>{cur.style.transform='';ring.style.transform=''});
});

/* ── NAVIGATION ── */
const pages=['home','about','skills','projects','blog','contact'];
const breadcrumbMap={home:'home',about:'about',skills:'skills',projects:'projects',blog:'blog',contact:'contact'};

function nav(page,el){
  pages.forEach(p=>{
    document.getElementById('page-'+p).classList.remove('active');
  });
  document.getElementById('page-'+page).classList.add('active');

  // sidebar
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const sideEl=document.querySelector('.nav-item[data-page="'+page+'"]');
  if(sideEl) sideEl.classList.add('active');

  // mobile nav
  document.querySelectorAll('.mob-nav-item').forEach(n=>n.classList.remove('active'));
  const mobEl=document.querySelector('.mob-nav-item[data-page="'+page+'"]');
  if(mobEl) mobEl.classList.add('active');

  // breadcrumb
  document.getElementById('breadcrumb').innerHTML='~ / <span>'+breadcrumbMap[page]+'</span>';

  // scroll to top
  window.scrollTo(0,0);
  document.querySelector('.main').scrollTo(0,0);

  // trigger reveal
  setTimeout(()=>triggerReveal(),100);

  // animate counters on home
  if(page==='home') setTimeout(()=>animCounters(),200);
}

/* ── SCROLL REVEAL ── */
function triggerReveal(){
  const els=document.querySelectorAll('.page.active .reveal:not(.in)');
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('in'),i*70);
        io.unobserve(e.target);
      }
    });
  },{threshold:.08});
  els.forEach(el=>io.observe(el));
}
window.addEventListener('load',()=>{triggerReveal();animCounters()});

/* ── COUNTER ── */
function animCounters(){
  document.querySelectorAll('.page.active .stat-n[data-count]').forEach(el=>{
    const target=+el.getAttribute('data-count');
    const suffix=target>1000?'k':'';
    const display=target>1000?target/1000:target;
    let n=0;const step=()=>{
      n+=display/40;
      if(n>=display){el.textContent=display+(suffix?suffix:'');return}
      el.textContent=Math.floor(n)+(suffix?suffix:'');
      requestAnimationFrame(step);
    };step();
  });
}

/* ── PROJECT FILTER ── */
function filterProj(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.proj-card').forEach(c=>{
    if(cat==='all'||c.dataset.cat===cat){
      c.style.display='flex';
    } else {
      c.style.display='none';
    }
  });
}

/* ── FORM ── */
function clearErr(id){
  const fg=document.getElementById(id);
  if(fg){fg.classList.remove('has-err');
    const inp=fg.querySelector('input,textarea,select');
    if(inp)inp.classList.remove('err');
  }
}

function updateChar(){
  const v=document.getElementById('msg').value;
  document.getElementById('charCount').textContent=v.length+' / 1000';
}

function setErr(id,msg){
  const fg=document.getElementById(id);
  if(!fg)return;
  fg.classList.add('has-err');
  const inp=fg.querySelector('input,textarea,select');
  if(inp)inp.classList.add('err');
  if(msg){const em=fg.querySelector('.err-msg');if(em)em.textContent=msg}
}

function handleSubmit(e){
  e.preventDefault();
  let ok=true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const ptype   = document.getElementById('ptype').value;
  const budget  = document.getElementById('budget').value;
  const subject = document.getElementById('subject').value.trim();
  const msg     = document.getElementById('msg').value.trim();
  const agree   = document.getElementById('agree').checked;

  // --- Validation ---
  if(!name || name.length<2){setErr('fg-name','Please enter your full name (min 2 characters).');ok=false}
  const emailRx=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRx.test(email)){setErr('fg-email','Please enter a valid email address.');ok=false}
  if(!ptype){setErr('fg-type','Please select a project type.');ok=false}
  if(!subject || subject.length<4){setErr('fg-subject','Please enter a subject (min 4 characters).');ok=false}
  if(!msg || msg.length<30){setErr('fg-msg','Please write at least 30 characters so I can understand your project.');ok=false}
  if(!agree){setErr('fg-agree','You must agree to continue.');ok=false}

  if(!ok) return;

  // --- Build the email body ---
  const body = 
    'Name: '         + name    + '\n' +
    'Email: '        + email   + '\n' +
    'Phone: '        + (phone || 'Not provided') + '\n' +
    'Project Type: ' + ptype   + '\n' +
    'Budget: '       + (budget || 'Not specified') + '\n\n' +
    'Message:\n'     + msg;

  // --- Open Gmail compose window ---
  const gmailURL = 
    'https://mail.google.com/mail/?view=cm&fs=1' +
    '&to=ibraheemkhalee.ckp@gmail.com' +
    '&su=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);

  window.open(gmailURL, '_blank');

  // --- Show success message ---
  document.getElementById('contactForm').style.display = 'none';
  const s = document.getElementById('formSuccess');
  s.innerHTML = '✅ Thanks for reaching out, <strong>' + name + '</strong>! I will get back to you at <strong>' + email + '</strong> within 24 hours.';
  s.classList.add('show');

  // --- Reset form (in background) ---
  document.getElementById('contactForm').reset();
}