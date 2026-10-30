// Reels: click a cover to play the video if one exists at data-video.
document.querySelectorAll('.reel[data-video]').forEach(function(el){
  el.addEventListener('click',function(){
    if(el.querySelector('video'))return;
    var v=document.createElement('video');
    v.src=el.getAttribute('data-video');v.controls=true;v.autoplay=true;v.playsInline=true;v.preload='metadata';
    var cover=Array.prototype.slice.call(el.children);
    v.addEventListener('error',function(){v.remove();cover.forEach(function(c){c.style.display='';});});
    cover.forEach(function(c){c.style.display='none';});
    el.appendChild(v);
  });
});
// Close the menu dropdown after choosing an in-page link.
document.querySelectorAll('details nav a').forEach(function(a){
  a.addEventListener('click',function(){var d=a.closest('details');if(d)d.removeAttribute('open');});
});
// Contact form: posts to the form service if data-endpoint is set, otherwise opens an email draft.
document.querySelectorAll('form.brief').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var q=function(n){var el=f.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
    var needs=Array.prototype.map.call(f.querySelectorAll('input[name="need"]:checked'),function(i){return i.value;});
    var data={name:q('name'),brand:q('brand'),needs:needs.join(', '),message:q('message')};
    var status=f.querySelector('.brief-status');
    if(!data.name||!data.message){if(status)status.textContent='Add your name and a short message first.';return;}
    var ep=f.getAttribute('data-endpoint');
    var wa='https://wa.me/201509929285?text='+encodeURIComponent('Hi Duo Labs! New brief.\nName: '+data.name+'\nBrand: '+data.brand+'\nNeeds: '+data.needs+'\n\n'+data.message);
    var go=function(){f.reset();if(status)status.textContent='Opening WhatsApp. Tap send and we are on it.';location.href=wa;};
    if(ep){
      if(status)status.textContent='Sending...';
      fetch(ep,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)}).then(go).catch(go);
    }else{go();}
  });
});
// Phone layout uses m- prefixed ids; send cross-page hash links to the visible copy.
(function(){
  function go(){
    var h=location.hash.slice(1);if(!h||h.indexOf('m-')===0)return;
    if(window.matchMedia('(max-width:767px)').matches){
      var el=document.getElementById('m-'+h);
      if(el)setTimeout(function(){el.scrollIntoView();},0);
    }
  }
  window.addEventListener('load',go);window.addEventListener('hashchange',go);
})();
// Light / dark switch. Follows the device until the visitor picks one.
(function(){
  var root=document.documentElement,btn=document.querySelector('.tt');if(!btn)return;
  function current(){var t=root.getAttribute('data-theme');if(t)return t;return window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
  btn.addEventListener('click',function(){
    var next=current()==='light'?'dark':'light';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });
})();
