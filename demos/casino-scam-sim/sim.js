/* sim.js — shared bridge for the 218/213 faithful-replica simulator.
   Injects the DEMO bar, keeps flags/chips in localStorage, rewires local actions.
   All data below is reconstructed from the real pages for TEACHING purposes. */
var SIM = {
  KEY: 'sim218_flags_v1',
  CHIPS: 'sim218_chips_v1',
  getFlags: function(){ try{ return JSON.parse(localStorage.getItem(SIM.KEY))||{}; }catch(e){ return {}; } },
  saveFlags: function(f){ localStorage.setItem(SIM.KEY, JSON.stringify(f)); },
  mark: function(id){
    var f = SIM.getFlags(); f[id]=true; SIM.saveFlags(f);
    SIM.renderFlags();
  },
  renderFlags: function(){
    var f = SIM.getFlags();
    var list = document.querySelectorAll('[data-flags]');
    for(var i=0;i<list.length;i++){
      var el = list[i], ids = el.getAttribute('data-flags').split('+');
      if(ids.indexOf('all')>-1)ids=['f1','f2','f3','f4','f5','f6','f7','f8'];
      for(var j=0;j<ids.length;j++){ if(f[ids[j]]) el.classList.add('seen'); }
    }
  },
  chips: function(){ var c=parseInt(localStorage.getItem(SIM.CHIPS),10); return isNaN(c)?10000:c; },
  saveChips: function(c){ localStorage.setItem(SIM.CHIPS, String(c)); },
  toast: function(msg){
    var t = document.getElementById('simToast');
    if(!t){ t=document.createElement('div'); t.id='simToast'; document.body.appendChild(t); }
    t.textContent=msg; t.style.display='block'; t.classList.add('show');
    clearTimeout(SIM.toast._t);
    SIM.toast._t=setTimeout(function(){ t.style.display='none'; },1800);
  },
  /* banner injection — call at end of body */
  init: function(){
    var b=document.createElement('div');
    b.id='simBanner';
    b.innerHTML = '<span class="sb-badge">⚠ 教學複刻 DEMO</span>' +
      '<span class="sb-txt">這頁是 <b>' + (SIM.pageName||'') + '</b> 的忠實複刻 —— 外觀一模一樣,但所有按鈕只連到本地模擬,不會真的連上賭場、不會下載任何東西、不收集任何資料。</span>' +
      '<a class="sb-link" href="index.html">🏠 首頁</a>';
    document.body.insertBefore(b, document.body.firstChild);
    if(!document.getElementById('simCss')){
      var c=document.createElement('link'); c.id='simCss'; c.rel='stylesheet';
      c.href='sim.css'; document.head.appendChild(c);
    }
    SIM.renderFlags();
    SIM.toast._t = 0;
  },
  /* hub: fill the 5 real line cells, wire the buttons locally */
  hub: function(){
    SIM.pageName='218yc.com 官方備用網址資訊站';
    var hosts=['www64539.218.com','www64539.218.com','www64539.218.com','www64539.218.com','www64539.218.com'];
    var ports=['9900','8866','9900','5569','7730'];
    for(var i=1;i<=5;i++){
      var u=document.getElementById('url'+i);
      if(u) u.textContent='https://'+hosts[i-1]+':'+ports[i-1];
      var m=document.getElementById('ms'+i);
      if(m) m.textContent=(10+Math.floor(Math.random()*25))+'ms';
      var cb=document.getElementById('click_url_'+i);
      if(cb){ cb.onclick=(function(idx){ return function(ev){ ev.preventDefault(); ev.stopPropagation(); SIM.lineClick(idx); }; })(i); }
      var cp=document.getElementById('copyButton'+i);
      if(cp){ cp.dataset.clipboardText='https://'+hosts[i-1]+':'+ports[i-1];
        cp.onclick=function(){ SIM.toast('已複製 (教學模式,本網址是虛構的)'); }; }
    }
    SIM.mark('f6');
  },
  lineClick: function(i){
    SIM.toast('模擬連線中 (真實網站會跳到 2182999.com:9900 的 App 啟動頁)…');
    SIM.mark('f6');
    setTimeout(function(){ window.location.href='app.html?from=line'+i; },900);
  },
  /* door (213) */
  door: function(){
    SIM.pageName='213.com → yy2iaikt.213001.cc 歡迎回家門戶';
    // H5 entries → lobby (they were # with SDK wiring)
    var h5 = document.querySelectorAll('.open-h5-1,.open-h5-2,.open-h5-3');
    for(var i=0;i<h5.length;i++){
      h5[i].onclick=function(ev){ ev.preventDefault(); SIM.mark('f1'); SIM.toast('網頁入口 (教學模式: 隨機網域池,見左側說明)'); setTimeout(function(){ window.location.href='app.html'; },700); };
    }
    // fake browsers → local install explainer
    SIM.renderPay();
    // kefu → local chat
    var svc=document.querySelectorAll('.fix-service, .svc-go');
    for(var j=0;j<svc.length;j++){
      svc[j].onclick=function(ev){ ev.preventDefault(); SIM.mark('f5'); window.location.href='chat.html'; };
    }
    // the copy-ID footer id (97 chat)
    var idt=document.querySelectorAll('[data-copy-id]');
    for(var k=0;k<idt.length;k++){
      idt[k].onclick=function(){ SIM.toast('97客服號已複製 (虛構)'); };
    }
    SIM.mark('f1'); SIM.mark('f5');
  },
  renderPay: function(){
    var rows=document.querySelectorAll('.pay-row, .browser li');
    for(var i=0;i<rows.length;i++){
      var go=rows[i].querySelector('.rec, a[onclick]');
      if(go){
        go.onclick=function(ev){ ev.preventDefault(); SIM.fakeBrowser(); };
      }
    }
  },
  fakeBrowser: function(){
    SIM.mark('f4');
    var d=document.createElement('div'); d.className='sim-modal';
    d.innerHTML='<div class="sim-modal-box"><h3>🖥 假瀏覽器下載 (教學演示)</h3><div class="sim-progress"><div id="simBar"></div></div>'+
      '<p class="sim-dim" id="simDlMsg">正在下載「專用瀏覽器」…</p></div>';
    document.body.appendChild(d);
    var bar=d.querySelector('#simBar'), w=0;
    var iv=setInterval(function(){
      w+=Math.random()*18+8;
      if(w>=100){
        clearInterval(iv);
        d.querySelector('#simDlMsg').innerHTML='<b style="color:#e5484d">安裝完成!</b><br><br>其實剛剛安裝的是:<br>❌ 鍵盤記錄器(偷密碼)<br>❌ 設備指紋(追蹤你)<br>❌ 簡訊讀取權限(偷驗證碼)<br><br><b>真實案例:</b> 213 網絡的 <b>213h5004–08.cc</b> 就是假瀏覽器下載站,分別冒充 Chrome / Firefox / 誇克 / 寰宇 / Opera。<br><br>本複刻沒有下載任何東西 ✅<br><br><button class="sim-btn" onclick="this.parentNode.parentNode.parentNode.remove()">知道了</button>';
      }
      bar.style.width=w+'%';
    },100);
  }
};