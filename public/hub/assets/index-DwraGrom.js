(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const c of i)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(i){const c={};return i.integrity&&(c.integrity=i.integrity),i.referrerPolicy&&(c.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?c.credentials="include":i.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(i){if(i.ep)return;i.ep=!0;const c=a(i);fetch(i.href,c)}})();const A="https://psiweb-ipvtodvkeq-uc.a.run.app/api",E="/hub/data/catalog.json",L="/hub/";let h=null;const e={packages:[],selected:null,card:"",agentCard:"",readme:"",config:"",filters:{q:"",kind:"",resource:"",tag:""},activeTab:"readme",loading:!0,error:"",bundle:null,usingStatic:!1,uploadOpen:!1,uploadStatus:"",mutationBusy:!1,adminToken:localStorage.getItem("psiweb_admin_token")||""},q=document.querySelector("#app");function C(t){return`${A.replace(/\/+$/,"")}${t}`}function g(t=""){return`${L.replace(/\/+$/,"")}/${String(t).replace(/^\/+/,"")}`}async function f(t,n={}){if(String(n.method||"GET").toUpperCase()!=="GET")return S(t,n);let r=null;try{const i=await S(t,n);return e.usingStatic=!1,i}catch(i){r=i}try{const i=await R(t);return e.usingStatic=!0,i}catch{throw r}}async function S(t,n={}){const a=await fetch(C(t),n);if(!a.ok){const i=await a.text();throw new Error(M(i,a.statusText))}return(a.headers.get("content-type")||"").includes("application/json")?a.json():a.text()}async function P(){return h||(h=fetch(E).then(t=>{if(!t.ok)throw new Error("Static catalog unavailable");return t.json()}).then(t=>(e.bundle=t.bundle||null,t))),h}async function R(t){var m;const n=await P(),[a,r=""]=t.split("?");if(a==="/packages")return O(n.packages||[],new URLSearchParams(r));const i=a.match(/^\/packages\/([^/]+)\/([^/]+)(?:\/(.+))?$/);if(!i)throw new Error("Static route unavailable");const c=`${decodeURIComponent(i[1])}/${decodeURIComponent(i[2])}`,s=(m=n.details)==null?void 0:m[c];if(!s)throw new Error(`Package not found: ${c}`);const l=i[3]||"";if(!l)return s;if(l==="card")return s.card||"";if(l==="agent-card")return s.agent_card||"";if(l==="readme")return s.readme||"";if(l==="config-template")return s.config_template||"";if(l==="download")return g(s.download_url||"");throw new Error("Static route unavailable")}function O(t,n){const a=String(n.get("q")||"").trim().toLowerCase(),r=String(n.get("kind")||"").trim().toLowerCase(),i=String(n.get("tag")||"").trim().toLowerCase(),c=String(n.get("resource")||"").trim().toLowerCase();return t.filter(s=>!r||s.kind===r).filter(s=>!i||(s.tags||[]).some(l=>l.toLowerCase()===i)).filter(s=>!c||(s.resources||[]).some(l=>l.kind===c)).filter(s=>!a||U(s).includes(a)).sort((s,l)=>s.identifier.localeCompare(l.identifier))}function U(t){const n=[t.identifier,t.kind,t.description,t.summary,...t.tags||[]];return(t.resources||[]).forEach(a=>{n.push(a.kind,a.name,a.ref,a.description||"")}),n.join(" ").toLowerCase()}async function $(){e.loading=!0,e.error="",d();const t=new URLSearchParams;Object.entries(e.filters).forEach(([n,a])=>{a&&t.set(n,a)});try{if(e.packages=await f(`/packages?${t.toString()}`),!e.selected&&e.packages.length){await k(e.packages[0].identifier);return}e.selected&&!e.packages.some(n=>n.identifier===e.selected.identifier)&&(e.selected=null)}catch(n){e.error=n.message}finally{e.loading=!1,d()}}async function k(t){e.error="";const[n,a]=t.split("/");e.loading=!0,d();try{const r=`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}`,[i,c,s,l,m]=await Promise.all([f(r),f(`${r}/card`),f(`${r}/agent-card`),f(`${r}/readme`).catch(()=>""),f(`${r}/config-template`)]);e.selected=i,e.card=c,e.agentCard=s,e.readme=l,e.config=m}catch(r){e.error=r.message}finally{e.loading=!1,d()}}function d(){q.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${g()}" aria-label="PsiWeb home">
          <img src="${g("psi-mark.svg")}" alt="" />
          <span>PsiWeb</span>
        </a>
        <form class="search" data-action="search">
          <input name="q" type="search" placeholder="Search packages" value="${p(e.filters.q)}" />
          <button class="primary" type="submit">Search</button>
        </form>
        <nav class="top-actions" aria-label="Hub actions">
          ${e.bundle?`<a class="quiet-link" href="${g(e.bundle.url)}" download>Demo bundle</a>`:""}
          <a class="quiet-link" href="${g("docs")}">Docs</a>
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
                ${u("","All kinds",e.filters.kind)}
                ${u("tactic","Tactic",e.filters.kind)}
                ${u("channel","Channel",e.filters.kind)}
                ${u("service","Service",e.filters.kind)}
                ${u("app","App",e.filters.kind)}
                ${u("mixed","Mixed",e.filters.kind)}
              </select>
            </label>
            <label>
              <span>Resource</span>
              <select name="resource">
                ${u("","All resources",e.filters.resource)}
                ${u("tactic","Tactics",e.filters.resource)}
                ${u("channel","Channels",e.filters.resource)}
                ${u("service","Services",e.filters.resource)}
                ${u("schema","Schemas",e.filters.resource)}
                ${u("run","Runs",e.filters.resource)}
              </select>
            </label>
            <label>
              <span>Tag</span>
              <input name="tag" type="search" placeholder="Any tag" value="${p(e.filters.tag)}" />
            </label>
            <button class="secondary full" type="submit">Apply filters</button>
          </form>
          ${e.loading?'<div class="status">Loading</div>':""}
          ${e.error?`<div class="status error">${o(e.error)}</div>`:""}
          <div class="result-list">
            ${e.packages.map(D).join("")||'<div class="empty">No packages</div>'}
          </div>
        </aside>
        <section class="detail" aria-label="Package detail">
          ${e.selected?_(e.selected):'<div class="empty large">Select a package</div>'}
        </section>
      </main>
    </div>
  `,N()}function B(){return`
    <form class="upload-panel" data-action="upload">
      <label>
        <span>Admin token</span>
        <input name="token" data-token-input type="password" autocomplete="off" value="${p(e.adminToken)}" />
      </label>
      <label>
        <span>Package zip</span>
        <input name="file" type="file" accept=".zip,application/zip" />
      </label>
      <button class="primary" type="submit" ${e.mutationBusy?"disabled":""}>
        ${e.mutationBusy?"Uploading":"Upload"}
      </button>
      ${e.uploadStatus?`<output class="upload-status">${o(e.uploadStatus)}</output>`:""}
    </form>
  `}function D(t){var r;const n=((r=e.selected)==null?void 0:r.identifier)===t.identifier,a=(t.tags||[]).slice(0,3).map(i=>`<span>${o(i)}</span>`).join("");return`
    <button class="result ${n?"is-selected":""}" data-package="${p(t.identifier)}">
      <span class="result-main">
        <span class="result-title">${o(t.identifier)}</span>
        <span class="kind-pill">${o(t.kind||"package")}</span>
      </span>
      <span class="result-summary">${o(t.summary||t.description||"PSI package")}</span>
      <span class="badges">${a}</span>
      <span class="result-foot">${H(t)} resources</span>
    </button>
  `}function _(t){const n=Array.isArray(t.resources)?t.resources:[],a=[["readme","README"],["resources",`Resources ${n.length}`],["card","Card"],["config","Run Config"],["agent","Agent Card"],["files","Files"]];return`
    <div class="repo-head">
      <div class="repo-title">
        <span class="eyebrow">${o(t.kind||"package")}</span>
        <h1>${o(t.identifier)}</h1>
        <p>${o(t.summary||t.description||"")}</p>
      </div>
      <div class="commands">
        ${T(`psihub get ${t.identifier}`,"Get")}
        ${T(`psihub card ${t.identifier}`,"Card")}
        ${F(t)}
        <button class="danger" data-action="delete-package" type="button">Delete</button>
      </div>
    </div>
    <div class="meta-row">
      <span>Version ${o(t.version||"unknown")}</span>
      <span>Primary ${o(t.primary||"none")}</span>
      <span>${n.length} resources</span>
      ${(t.tags||[]).slice(0,5).map(r=>`<span>${o(r)}</span>`).join("")}
    </div>
    <nav class="tabs" aria-label="Package sections">
      ${a.map(([r,i])=>`
        <button class="${e.activeTab===r?"is-active":""}" data-tab="${r}" type="button">
          ${o(i)}
        </button>
      `).join("")}
    </nav>
    <div class="panel">
      ${I(t)}
    </div>
  `}function I(t){const n=Array.isArray(t.resources)?t.resources:[];return e.activeTab==="resources"?`
      <div class="resource-table">
        <div class="resource-row heading">
          <span>Kind</span><span>Name</span><span>Ref</span><span>Description</span>
        </div>
        ${n.map(a=>`
          <div class="resource-row">
            <span>${o(a.kind)}</span>
            <span>${o(a.name)}</span>
            <code>${o(a.ref)}</code>
            <span>${o(a.description||"")}</span>
          </div>
        `).join("")||'<div class="table-empty">No resources declared</div>'}
      </div>
    `:e.activeTab==="config"?y(e.config||"# no local config template"):e.activeTab==="agent"?y(e.agentCard||"# no agent card"):e.activeTab==="card"?y(e.card||"# no package card"):e.activeTab==="files"?j(t):x(e.readme||"README not declared.")}function j(t){const n=Object.keys(t.files||{}).sort();return n.length?`
    <div class="file-list">
      ${n.map(a=>`
        <button class="file-row" data-file="${p(a)}" type="button">
          <code>${o(a)}</code>
          <span>${G((t.files[a]||"").length)}</span>
        </button>
      `).join("")}
    </div>
  `:'<div class="empty">No renderable text files in this package</div>'}function x(t){const n=t.split(/\r?\n/).slice(0,160);let a=!1;return`<article class="markdown">${n.map(r=>r.startsWith("```")?(a=!a,a?"<pre><code>":"</code></pre>"):a?`${o(r)}
`:r.startsWith("# ")?`<h2>${o(r.slice(2))}</h2>`:r.startsWith("## ")?`<h3>${o(r.slice(3))}</h3>`:r.startsWith("### ")?`<h4>${o(r.slice(4))}</h4>`:r.startsWith("- ")?`<p class="list-line">${o(r)}</p>`:r.trim()?`<p>${o(r)}</p>`:"<br />").join("")}${a?"</code></pre>":""}</article>`}function y(t){return`<pre><code>${o(t)}</code></pre>`}function T(t,n){return`<button class="copy" data-copy="${p(t)}" data-label="${p(n)}" type="button">${o(n)}</button>`}function F(t){const[n,a]=t.identifier.split("/"),r=C(`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}/download`),i=e.usingStatic&&t.download_url?g(t.download_url):r;return`<a class="download" href="${p(i)}" download>Download</a>`}function u(t,n,a){return`<option value="${p(t)}" ${a===t?"selected":""}>${o(n)}</option>`}function N(){var t,n,a,r,i,c;(t=document.querySelector("[data-action='search']"))==null||t.addEventListener("submit",s=>{s.preventDefault();const l=new FormData(s.currentTarget);e.filters.q=String(l.get("q")||"").trim(),e.selected=null,$()}),(n=document.querySelector("[data-action='filters']"))==null||n.addEventListener("submit",s=>{s.preventDefault();const l=new FormData(s.currentTarget);e.filters.kind=String(l.get("kind")||""),e.filters.resource=String(l.get("resource")||""),e.filters.tag=String(l.get("tag")||"").trim(),e.selected=null,$()}),(a=document.querySelector("[data-action='toggle-upload']"))==null||a.addEventListener("click",()=>{e.uploadOpen=!e.uploadOpen,e.uploadStatus="",d()}),(r=document.querySelector("[data-action='upload']"))==null||r.addEventListener("submit",W),(i=document.querySelector("[data-token-input]"))==null||i.addEventListener("input",s=>{e.adminToken=String(s.currentTarget.value||"").trim(),e.adminToken?localStorage.setItem("psiweb_admin_token",e.adminToken):localStorage.removeItem("psiweb_admin_token")}),(c=document.querySelector("[data-action='delete-package']"))==null||c.addEventListener("click",z),document.querySelectorAll("[data-package]").forEach(s=>{s.addEventListener("click",()=>k(s.dataset.package))}),document.querySelectorAll("[data-tab]").forEach(s=>{s.addEventListener("click",()=>{e.activeTab=s.dataset.tab,d()})}),document.querySelectorAll("[data-file]").forEach(s=>{s.addEventListener("click",()=>{var b,v,w;const l=s.dataset.file||"";e.activeTab="files";const m=((v=(b=e.selected)==null?void 0:b.files)==null?void 0:v[l])||"";(w=navigator.clipboard)==null||w.writeText(m),s.classList.add("is-copied"),setTimeout(()=>s.classList.remove("is-copied"),900)})}),document.querySelectorAll("[data-copy]").forEach(s=>{s.addEventListener("click",async()=>{var l;await((l=navigator.clipboard)==null?void 0:l.writeText(s.dataset.copy||"")),s.textContent="Copied",setTimeout(()=>{s.textContent=s.dataset.label||"Copy"},1200)})})}async function W(t){t.preventDefault();const n=new FormData(t.currentTarget),a=n.get("file"),r=String(n.get("token")||"").trim();if(!r){e.uploadStatus="Admin token required",d();return}if(!(a instanceof File)||!a.name){e.uploadStatus="Choose a package zip",d();return}e.adminToken=r,localStorage.setItem("psiweb_admin_token",r),e.mutationBusy=!0,e.uploadStatus="",d();const i=new FormData;i.set("file",a);try{const c=await f("/packages/upload",{method:"POST",headers:{authorization:`Bearer ${e.adminToken}`},body:i});e.uploadStatus=`Uploaded ${c.identifier}`,e.uploadOpen=!1,e.selected=null,await $(),await k(c.identifier)}catch(c){e.uploadStatus=c.message}finally{e.mutationBusy=!1,d()}}async function z(){if(!e.selected)return;if(!e.adminToken){e.uploadOpen=!0,e.uploadStatus="Admin token required",d();return}const t=e.selected.identifier;if(!window.confirm(`Delete ${t}?`))return;const[n,a]=t.split("/");e.mutationBusy=!0,e.error="",d();try{await f(`/packages/${encodeURIComponent(n)}/${encodeURIComponent(a)}`,{method:"DELETE",headers:{authorization:`Bearer ${e.adminToken}`}}),e.selected=null,await $()}catch(r){e.error=r.message}finally{e.mutationBusy=!1,d()}}function M(t,n){if(!t)return n;try{const a=JSON.parse(t);if(typeof a.detail=="string")return a.detail;if(Array.isArray(a.detail))return a.detail.map(r=>r.msg||String(r)).join("; ")}catch{return t}return t}function H(t){return Array.isArray(t.resources)?t.resources.length:0}function G(t){return t<1024?`${t} B`:`${Math.round(t/102.4)/10} KB`}function o(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function p(t){return o(t)}$();
