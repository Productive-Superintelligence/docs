(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}})();const w="/api",y="/hub/data/catalog.json";let m=null;const t={packages:[],selected:null,card:"",agentCard:"",readme:"",config:"",filters:{q:"",kind:"",resource:"",tag:""},activeTab:"readme",loading:!0,error:"",bundle:null},S=document.querySelector("#app");function v(e){return`${w}${e}`}async function p(e,a={}){let r=null;try{const n=await fetch(v(e),a);if(!n.ok){const o=await n.text();throw new Error(o||n.statusText)}return(n.headers.get("content-type")||"").includes("application/json")?n.json():n.text()}catch(n){r=n}try{return await A(e)}catch{throw r}}async function C(){return m||(m=fetch(y).then(e=>{if(!e.ok)throw new Error("Static catalog unavailable");return e.json()}).then(e=>(t.bundle=e.bundle||null,e))),m}async function A(e){var g;const a=await C(),[r,n=""]=e.split("?");if(r==="/packages")return E(a.packages||[],new URLSearchParams(n));const s=r.match(/^\/packages\/([^/]+)\/([^/]+)(?:\/(.+))?$/);if(!s)throw new Error("Static route unavailable");const o=`${decodeURIComponent(s[1])}/${decodeURIComponent(s[2])}`,i=(g=a.details)==null?void 0:g[o];if(!i)throw new Error(`Package not found: ${o}`);const l=s[3]||"";if(!l)return i;if(l==="card")return i.card||"";if(l==="agent-card")return i.agent_card||"";if(l==="readme")return i.readme||"";if(l==="config-template")return i.config_template||"";if(l==="download")return`/hub/${i.download_url}`;throw new Error("Static route unavailable")}function E(e,a){const r=String(a.get("q")||"").trim().toLowerCase(),n=String(a.get("kind")||"").trim().toLowerCase(),s=String(a.get("tag")||"").trim().toLowerCase(),o=String(a.get("resource")||"").trim().toLowerCase();return e.filter(i=>!n||i.kind===n).filter(i=>!s||(i.tags||[]).some(l=>l.toLowerCase()===s)).filter(i=>!o||(i.resources||[]).some(l=>l.kind===o)).filter(i=>!r||L(i).includes(r)).sort((i,l)=>i.identifier.localeCompare(l.identifier))}function L(e){const a=[e.identifier,e.kind,e.description,e.summary,...e.tags||[]];return(e.resources||[]).forEach(r=>{a.push(r.kind,r.name,r.ref,r.description||"")}),a.join(" ").toLowerCase()}async function k(){t.loading=!0,t.error="",f();const e=new URLSearchParams;Object.entries(t.filters).forEach(([a,r])=>{r&&e.set(a,r)});try{if(t.packages=await p(`/packages?${e.toString()}`),!t.selected&&t.packages.length){await b(t.packages[0].identifier);return}}catch(a){t.error=a.message}finally{t.loading=!1,f()}}async function b(e){t.error="";const[a,r]=e.split("/");t.loading=!0,f();try{const n=`/packages/${encodeURIComponent(a)}/${encodeURIComponent(r)}`,[s,o,i,l,g]=await Promise.all([p(n),p(`${n}/card`),p(`${n}/agent-card`),p(`${n}/readme`).catch(()=>""),p(`${n}/config-template`)]);t.selected=s,t.card=o,t.agentCard=i,t.readme=l,t.config=g}catch(n){t.error=n.message}finally{t.loading=!1,f()}}function f(){S.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="/hub/" aria-label="PsiWeb home">
          <img src="/hub/psi-mark.svg" alt="" />
          <span>PsiWeb</span>
        </a>
        <form class="search" data-action="search">
          <input name="q" type="search" placeholder="Search packages" value="${u(t.filters.q)}" />
          <select name="kind" aria-label="Kind filter">
            ${d("","All kinds",t.filters.kind)}
            ${d("tactic","Tactic",t.filters.kind)}
            ${d("channel","Channel",t.filters.kind)}
            ${d("service","Service",t.filters.kind)}
            ${d("app","App",t.filters.kind)}
            ${d("mixed","Mixed",t.filters.kind)}
          </select>
          <select name="resource" aria-label="Resource filter">
            ${d("","All resources",t.filters.resource)}
            ${d("tactic","Tactics",t.filters.resource)}
            ${d("channel","Channels",t.filters.resource)}
            ${d("service","Services",t.filters.resource)}
            ${d("schema","Schemas",t.filters.resource)}
            ${d("run","Runs",t.filters.resource)}
          </select>
          <button type="submit">Search</button>
        </form>
        <div class="header-actions">
          ${t.bundle?`<a class="header-link" href="/hub/${u(t.bundle.url)}" download>Download demo</a>`:""}
          <a class="header-link" href="/hub/docs">Docs</a>
        </div>
      </header>

      <main class="workspace">
        <aside class="results" aria-label="Package results">
          <div class="results-meta">
            <strong>${t.packages.length}</strong>
            <span>${t.packages.length===1?"package":"packages"}</span>
          </div>
          ${t.loading?'<div class="status">Loading</div>':""}
          ${t.error?`<div class="status error">${c(t.error)}</div>`:""}
          <div class="result-list">
            ${t.packages.map(P).join("")||'<div class="empty">No packages</div>'}
          </div>
        </aside>
        <section class="detail" aria-label="Package detail">
          ${t.selected?T(t.selected):'<div class="empty large">Select a package</div>'}
        </section>
      </main>
    </div>
  `,x()}function P(e){var n;const a=((n=t.selected)==null?void 0:n.identifier)===e.identifier,r=(e.tags||[]).slice(0,3).map(s=>`<span>${c(s)}</span>`).join("");return`
    <button class="result ${a?"is-selected":""}" data-package="${u(e.identifier)}">
      <span class="result-title">${c(e.identifier)}</span>
      <span class="result-summary">${c(e.summary||e.description||"PSI package")}</span>
      <span class="badges">
        <span>${c(e.kind)}</span>
        ${r}
      </span>
    </button>
  `}function T(e){const a=[["readme","README"],["card","Card"],["resources","Resources"],["config","Run Config"],["agent","Agent Card"]];return`
    <div class="package-head">
      <div>
        <div class="eyebrow">${c(e.kind)} package</div>
        <h1>${c(e.identifier)}</h1>
        <p>${c(e.summary||e.description||"")}</p>
      </div>
      <div class="commands">
        ${$(`psihub get ${e.identifier}`,"Get")}
        ${$(`psihub card ${e.identifier}`,"Card")}
        ${j(e)}
      </div>
    </div>
    <div class="meta-row">
      <span>Version ${c(e.version)}</span>
      <span>Primary ${c(e.primary||"none")}</span>
      <span>${e.resources.length} resources</span>
    </div>
    <nav class="tabs" aria-label="Package sections">
      ${a.map(([r,n])=>`
        <button class="${t.activeTab===r?"is-active":""}" data-tab="${r}">
          ${n}
        </button>
      `).join("")}
    </nav>
    <div class="panel">
      ${R(e)}
    </div>
  `}function R(e){return t.activeTab==="resources"?`
      <div class="resource-table">
        <div class="resource-row heading">
          <span>Kind</span><span>Name</span><span>Ref</span><span>Description</span>
        </div>
        ${e.resources.map(a=>`
          <div class="resource-row">
            <span>${c(a.kind)}</span>
            <span>${c(a.name)}</span>
            <code>${c(a.ref)}</code>
            <span>${c(a.description||"")}</span>
          </div>
        `).join("")}
      </div>
    `:t.activeTab==="config"?h(t.config||"# no local config template"):t.activeTab==="agent"?h(t.agentCard||"# no agent card"):t.activeTab==="card"?h(t.card||"# no package card"):q(t.readme||"README not declared.")}function q(e){return`<article class="markdown">${e.split(/\r?\n/).slice(0,120).map(r=>r.startsWith("# ")?`<h2>${c(r.slice(2))}</h2>`:r.startsWith("## ")?`<h3>${c(r.slice(3))}</h3>`:r.startsWith("- ")?`<p class="list-line">${c(r)}</p>`:r.trim()?`<p>${c(r)}</p>`:"<br />").join("")}</article>`}function h(e){return`<pre><code>${c(e)}</code></pre>`}function $(e,a){return`<button class="copy" data-copy="${u(e)}" data-label="${u(a)}">${c(a)}</button>`}function j(e){const[a,r]=e.identifier.split("/"),n=e.download_url?`/hub/${e.download_url}`:v(`/packages/${encodeURIComponent(a)}/${encodeURIComponent(r)}/download`);return`<a class="download" href="${u(n)}" download>Download</a>`}function d(e,a,r){return`<option value="${u(e)}" ${r===e?"selected":""}>${c(a)}</option>`}function x(){var e;(e=document.querySelector("[data-action='search']"))==null||e.addEventListener("submit",a=>{a.preventDefault();const r=new FormData(a.currentTarget);t.filters.q=String(r.get("q")||"").trim(),t.filters.kind=String(r.get("kind")||""),t.filters.resource=String(r.get("resource")||""),t.selected=null,k()}),document.querySelectorAll("[data-package]").forEach(a=>{a.addEventListener("click",()=>b(a.dataset.package))}),document.querySelectorAll("[data-tab]").forEach(a=>{a.addEventListener("click",()=>{t.activeTab=a.dataset.tab,f()})}),document.querySelectorAll("[data-copy]").forEach(a=>{a.addEventListener("click",async()=>{var r;await((r=navigator.clipboard)==null?void 0:r.writeText(a.dataset.copy||"")),a.textContent="Copied",setTimeout(()=>{a.textContent=a.dataset.label||"Copy"},1200)})})}function c(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function u(e){return c(e)}k();
