(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const C="https://psiweb-ipvtodvkeq-uc.a.run.app/api",A="/hub/data/catalog.json",E="/hub/";let h=null;const e={packages:[],selected:null,card:"",agentCard:"",readme:"",config:"",filters:{q:"",kind:"",resource:"",tag:""},activeTab:"readme",loading:!0,error:"",bundle:null,usingStatic:!1,uploadOpen:!1,uploadStatus:"",mutationBusy:!1,adminToken:localStorage.getItem("psiweb_admin_token")||""},L=document.querySelector("#app");function T(t){return`${C.replace(/\/+$/,"")}${t}`}function m(t=""){return`${E.replace(/\/+$/,"")}/${String(t).replace(/^\/+/,"")}`}async function f(t,n={}){if(String(n.method||"GET").toUpperCase()!=="GET")return w(t,n);let s=null;try{const i=await w(t,n);return e.usingStatic=!1,i}catch(i){s=i}try{const i=await q(t);return e.usingStatic=!0,i}catch{throw s}}async function w(t,n={}){const a=await fetch(T(t),n);if(!a.ok){const i=await a.text();throw new Error(z(i,a.statusText))}return(a.headers.get("content-type")||"").includes("application/json")?a.json():a.text()}async function P(){return h||(h=fetch(A).then(t=>{if(!t.ok)throw new Error("Static catalog unavailable");return t.json()}).then(t=>(e.bundle=t.bundle||null,t))),h}async function q(t){var g;const n=await P(),[a,s=""]=t.split("?");if(a==="/packages")return R(n.packages||[],new URLSearchParams(s));const i=a.match(/^\/packages\/([^/]+)\/([^/]+)(?:\/(.+))?$/);if(!i)throw new Error("Static route unavailable");const r=`${decodeURIComponent(i[1])}/${decodeURIComponent(i[2])}`,o=(g=n.details)==null?void 0:g[r];if(!o)throw new Error(`Package not found: ${r}`);const l=i[3]||"";if(!l)return o;if(l==="card")return o.card||"";if(l==="agent-card")return o.agent_card||"";if(l==="readme")return o.readme||"";if(l==="config-template")return o.config_template||"";if(l==="download")return m(o.download_url||"");throw new Error("Static route unavailable")}function R(t,n){const a=String(n.get("q")||"").trim().toLowerCase(),s=String(n.get("kind")||"").trim().toLowerCase(),i=String(n.get("tag")||"").trim().toLowerCase(),r=String(n.get("resource")||"").trim().toLowerCase();return t.filter(o=>!s||o.kind===s).filter(o=>!i||(o.tags||[]).some(l=>l.toLowerCase()===i)).filter(o=>!r||(o.resources||[]).some(l=>l.kind===r)).filter(o=>!a||U(o).includes(a)).sort((o,l)=>o.identifier.localeCompare(l.identifier))}function U(t){const n=[t.identifier,t.kind,t.description,t.summary,...t.tags||[]];return(t.resources||[]).forEach(a=>{n.push(a.kind,a.name,a.ref,a.description||"")}),n.join(" ").toLowerCase()}async function $(){e.loading=!0,e.error="",u();const t=new URLSearchParams;Object.entries(e.filters).forEach(([n,a])=>{a&&t.set(n,a)});try{if(e.packages=await f(`/packages?${t.toString()}`),!e.selected&&e.packages.length){await k(e.packages[0].identifier);return}e.selected&&!e.packages.some(n=>n.identifier===e.selected.identifier)&&(e.selected=null)}catch(n){e.error=n.message}finally{e.loading=!1,u()}}async function k(t){e.error="";const[n,a]=t.split("/");e.loading=!0,u();try{const s=`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}`,[i,r,o,l,g]=await Promise.all([f(s),f(`${s}/card`),f(`${s}/agent-card`),f(`${s}/readme`).catch(()=>""),f(`${s}/config-template`)]);e.selected=i,e.card=r,e.agentCard=o,e.readme=l,e.config=g}catch(s){e.error=s.message}finally{e.loading=!1,u()}}function u(){L.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${m()}" aria-label="PsiWeb home">
          <img src="${m("psi-mark.svg")}" alt="" />
          <span>PsiWeb</span>
        </a>
        <form class="search" data-action="search">
          <input name="q" type="search" placeholder="Search packages" value="${p(e.filters.q)}" />
          <button class="primary" type="submit">Search</button>
        </form>
        <nav class="top-actions" aria-label="Hub actions">
          ${e.bundle?`<a class="quiet-link" href="${m(e.bundle.url)}" download>Demo bundle</a>`:""}
          <a class="quiet-link" href="${m("docs")}">Docs</a>
          <button class="secondary" data-action="toggle-upload" type="button">${e.uploadOpen?"Close":"Upload"}</button>
        </nav>
      </header>

      ${e.uploadOpen?B():""}

      <main class="workspace">
        <aside class="results" aria-label="Package results">
          <form class="filters" data-action="filters">
            <div class="results-meta">
              <strong>${e.packages.length}</strong>
              <span>${e.packages.length===1?"package":"packages"}</span>
              <span class="source-pill">${e.usingStatic?"static":"live"}</span>
            </div>
            <label>
              <span>Kind</span>
              <select name="kind">
                ${d("","All kinds",e.filters.kind)}
                ${d("tactic","Tactic",e.filters.kind)}
                ${d("channel","Channel",e.filters.kind)}
                ${d("service","Service",e.filters.kind)}
                ${d("app","App",e.filters.kind)}
                ${d("mixed","Mixed",e.filters.kind)}
              </select>
            </label>
            <label>
              <span>Resource</span>
              <select name="resource">
                ${d("","All resources",e.filters.resource)}
                ${d("tactic","Tactics",e.filters.resource)}
                ${d("channel","Channels",e.filters.resource)}
                ${d("service","Services",e.filters.resource)}
                ${d("schema","Schemas",e.filters.resource)}
                ${d("run","Runs",e.filters.resource)}
              </select>
            </label>
            <label>
              <span>Tag</span>
              <input name="tag" type="search" placeholder="Any tag" value="${p(e.filters.tag)}" />
            </label>
            <button class="secondary full" type="submit">Apply filters</button>
          </form>
          ${e.loading?'<div class="status">Loading</div>':""}
          ${e.error?`<div class="status error">${c(e.error)}</div>`:""}
          <div class="result-list">
            ${e.packages.map(D).join("")||'<div class="empty">No packages</div>'}
          </div>
        </aside>
        <section class="detail" aria-label="Package detail">
          ${e.selected?O(e.selected):'<div class="empty large">Select a package</div>'}
        </section>
      </main>
    </div>
  `,F()}function B(){return`
    <form class="upload-panel" data-action="upload">
      <label>
        <span>Admin token</span>
        <input name="token" type="password" autocomplete="off" value="${p(e.adminToken)}" />
      </label>
      <label>
        <span>Package zip</span>
        <input name="file" type="file" accept=".zip,application/zip" />
      </label>
      <button class="primary" type="submit" ${e.mutationBusy?"disabled":""}>
        ${e.mutationBusy?"Uploading":"Upload"}
      </button>
      ${e.uploadStatus?`<output class="upload-status">${c(e.uploadStatus)}</output>`:""}
    </form>
  `}function D(t){var s;const n=((s=e.selected)==null?void 0:s.identifier)===t.identifier,a=(t.tags||[]).slice(0,3).map(i=>`<span>${c(i)}</span>`).join("");return`
    <button class="result ${n?"is-selected":""}" data-package="${p(t.identifier)}">
      <span class="result-main">
        <span class="result-title">${c(t.identifier)}</span>
        <span class="kind-pill">${c(t.kind||"package")}</span>
      </span>
      <span class="result-summary">${c(t.summary||t.description||"PSI package")}</span>
      <span class="badges">${a}</span>
      <span class="result-foot">${M(t)} resources</span>
    </button>
  `}function O(t){const n=Array.isArray(t.resources)?t.resources:[],a=[["readme","README"],["resources",`Resources ${n.length}`],["card","Card"],["config","Run Config"],["agent","Agent Card"],["files","Files"]];return`
    <div class="repo-head">
      <div class="repo-title">
        <span class="eyebrow">${c(t.kind||"package")}</span>
        <h1>${c(t.identifier)}</h1>
        <p>${c(t.summary||t.description||"")}</p>
      </div>
      <div class="commands">
        ${S(`psihub get ${t.identifier}`,"Get")}
        ${S(`psihub card ${t.identifier}`,"Card")}
        ${x(t)}
        ${e.adminToken?'<button class="danger" data-action="delete-package" type="button">Delete</button>':""}
      </div>
    </div>
    <div class="meta-row">
      <span>Version ${c(t.version||"unknown")}</span>
      <span>Primary ${c(t.primary||"none")}</span>
      <span>${n.length} resources</span>
      ${(t.tags||[]).slice(0,5).map(s=>`<span>${c(s)}</span>`).join("")}
    </div>
    <nav class="tabs" aria-label="Package sections">
      ${a.map(([s,i])=>`
        <button class="${e.activeTab===s?"is-active":""}" data-tab="${s}" type="button">
          ${c(i)}
        </button>
      `).join("")}
    </nav>
    <div class="panel">
      ${j(t)}
    </div>
  `}function j(t){const n=Array.isArray(t.resources)?t.resources:[];return e.activeTab==="resources"?`
      <div class="resource-table">
        <div class="resource-row heading">
          <span>Kind</span><span>Name</span><span>Ref</span><span>Description</span>
        </div>
        ${n.map(a=>`
          <div class="resource-row">
            <span>${c(a.kind)}</span>
            <span>${c(a.name)}</span>
            <code>${c(a.ref)}</code>
            <span>${c(a.description||"")}</span>
          </div>
        `).join("")||'<div class="table-empty">No resources declared</div>'}
      </div>
    `:e.activeTab==="config"?y(e.config||"# no local config template"):e.activeTab==="agent"?y(e.agentCard||"# no agent card"):e.activeTab==="card"?y(e.card||"# no package card"):e.activeTab==="files"?I(t):_(e.readme||"README not declared.")}function I(t){const n=Object.keys(t.files||{}).sort();return n.length?`
    <div class="file-list">
      ${n.map(a=>`
        <button class="file-row" data-file="${p(a)}" type="button">
          <code>${c(a)}</code>
          <span>${H((t.files[a]||"").length)}</span>
        </button>
      `).join("")}
    </div>
  `:'<div class="empty">No renderable text files in this package</div>'}function _(t){const n=t.split(/\r?\n/).slice(0,160);let a=!1;return`<article class="markdown">${n.map(s=>s.startsWith("```")?(a=!a,a?"<pre><code>":"</code></pre>"):a?`${c(s)}
`:s.startsWith("# ")?`<h2>${c(s.slice(2))}</h2>`:s.startsWith("## ")?`<h3>${c(s.slice(3))}</h3>`:s.startsWith("### ")?`<h4>${c(s.slice(4))}</h4>`:s.startsWith("- ")?`<p class="list-line">${c(s)}</p>`:s.trim()?`<p>${c(s)}</p>`:"<br />").join("")}${a?"</code></pre>":""}</article>`}function y(t){return`<pre><code>${c(t)}</code></pre>`}function S(t,n){return`<button class="copy" data-copy="${p(t)}" data-label="${p(n)}" type="button">${c(n)}</button>`}function x(t){const[n,a]=t.identifier.split("/"),s=T(`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}/download`),i=e.usingStatic&&t.download_url?m(t.download_url):s;return`<a class="download" href="${p(i)}" download>Download</a>`}function d(t,n,a){return`<option value="${p(t)}" ${a===t?"selected":""}>${c(n)}</option>`}function F(){var t,n,a,s,i;(t=document.querySelector("[data-action='search']"))==null||t.addEventListener("submit",r=>{r.preventDefault();const o=new FormData(r.currentTarget);e.filters.q=String(o.get("q")||"").trim(),e.selected=null,$()}),(n=document.querySelector("[data-action='filters']"))==null||n.addEventListener("submit",r=>{r.preventDefault();const o=new FormData(r.currentTarget);e.filters.kind=String(o.get("kind")||""),e.filters.resource=String(o.get("resource")||""),e.filters.tag=String(o.get("tag")||"").trim(),e.selected=null,$()}),(a=document.querySelector("[data-action='toggle-upload']"))==null||a.addEventListener("click",()=>{e.uploadOpen=!e.uploadOpen,e.uploadStatus="",u()}),(s=document.querySelector("[data-action='upload']"))==null||s.addEventListener("submit",N),(i=document.querySelector("[data-action='delete-package']"))==null||i.addEventListener("click",W),document.querySelectorAll("[data-package]").forEach(r=>{r.addEventListener("click",()=>k(r.dataset.package))}),document.querySelectorAll("[data-tab]").forEach(r=>{r.addEventListener("click",()=>{e.activeTab=r.dataset.tab,u()})}),document.querySelectorAll("[data-file]").forEach(r=>{r.addEventListener("click",()=>{var g,b,v;const o=r.dataset.file||"";e.activeTab="files";const l=((b=(g=e.selected)==null?void 0:g.files)==null?void 0:b[o])||"";(v=navigator.clipboard)==null||v.writeText(l),r.classList.add("is-copied"),setTimeout(()=>r.classList.remove("is-copied"),900)})}),document.querySelectorAll("[data-copy]").forEach(r=>{r.addEventListener("click",async()=>{var o;await((o=navigator.clipboard)==null?void 0:o.writeText(r.dataset.copy||"")),r.textContent="Copied",setTimeout(()=>{r.textContent=r.dataset.label||"Copy"},1200)})})}async function N(t){t.preventDefault();const n=new FormData(t.currentTarget),a=n.get("file"),s=String(n.get("token")||"").trim();if(!s){e.uploadStatus="Admin token required",u();return}if(!(a instanceof File)||!a.name){e.uploadStatus="Choose a package zip",u();return}e.adminToken=s,localStorage.setItem("psiweb_admin_token",s),e.mutationBusy=!0,e.uploadStatus="",u();const i=new FormData;i.set("file",a);try{const r=await f("/packages/upload",{method:"POST",headers:{authorization:`Bearer ${e.adminToken}`},body:i});e.uploadStatus=`Uploaded ${r.identifier}`,e.uploadOpen=!1,e.selected=null,await $(),await k(r.identifier)}catch(r){e.uploadStatus=r.message}finally{e.mutationBusy=!1,u()}}async function W(){if(!e.selected||!e.adminToken)return;const t=e.selected.identifier;if(!window.confirm(`Delete ${t}?`))return;const[n,a]=t.split("/");e.mutationBusy=!0,e.error="",u();try{await f(`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}`,{method:"DELETE",headers:{authorization:`Bearer ${e.adminToken}`}}),e.selected=null,await $()}catch(s){e.error=s.message}finally{e.mutationBusy=!1,u()}}function z(t,n){if(!t)return n;try{const a=JSON.parse(t);if(typeof a.detail=="string")return a.detail;if(Array.isArray(a.detail))return a.detail.map(s=>s.msg||String(s)).join("; ")}catch{return t}return t}function M(t){return Array.isArray(t.resources)?t.resources.length:0}function H(t){return t<1024?`${t} B`:`${Math.round(t/102.4)/10} KB`}function c(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function p(t){return c(t)}$();
