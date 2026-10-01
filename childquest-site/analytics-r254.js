(function(){
  'use strict';
  const MEASUREMENT_ID='G-LD8W9E7LJY';
  const currentScript=document.currentScript;
  const mode=currentScript?.dataset.mode||'page';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  if(!document.querySelector('script[data-arg-ga-loader]')){
    const loader=document.createElement('script');
    loader.async=true;
    loader.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(MEASUREMENT_ID);
    loader.dataset.argGaLoader='true';
    document.head.appendChild(loader);
  }
  window.gtag('js',new Date());
  window.gtag('config',MEASUREMENT_ID,{send_page_view:false});
  let lastKey='';
  let lastLocation=document.referrer||'';
  function currentPath(){return location.pathname+location.search+(location.hash||'');}
  function trackPageView(options={}){
    const pageTitle=String(options.pageTitle||document.title||'孩子回家');
    const pagePath=String(options.pagePath||currentPath());
    const pageLocation=String(options.pageLocation||location.origin+pagePath);
    const key=pageTitle+'|'+pageLocation;
    if(key===lastKey)return false;
    const params={page_title:pageTitle,page_location:pageLocation,page_path:pagePath};
    if(lastLocation&&lastLocation!==pageLocation)params.page_referrer=lastLocation;
    window.gtag('event','page_view',params);
    lastKey=key;
    lastLocation=pageLocation;
    return true;
  }
  function trackEvent(eventName,params={},options={}){
    const name=String(eventName||'');
    if(!/^[a-z][a-z0-9_]{0,39}$/.test(name))return false;
    const clean={};
    Object.entries(params||{}).forEach(([key,value])=>{
      if(!/^[a-z][a-z0-9_]{0,39}$/.test(key))return;
      if(typeof value==='string'){
        const trimmed=value.trim();
        if(trimmed)clean[key]=trimmed.slice(0,100);
      }else if(typeof value==='number'&&Number.isFinite(value))clean[key]=value;
      else if(typeof value==='boolean')clean[key]=value;
    });
    if(typeof options.event_callback==='function')clean.event_callback=options.event_callback;
    if(typeof options.event_timeout==='number'&&Number.isFinite(options.event_timeout))clean.event_timeout=Math.max(0,Math.min(2000,options.event_timeout));
    window.gtag('event',name,clean);
    return true;
  }
  window.ARGAnalytics=Object.freeze({measurementId:MEASUREMENT_ID,trackPageView,trackEvent});
  if(mode!=='spa'){
    const send=()=>trackPageView();
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',send,{once:true});
    else send();
  }
})();
