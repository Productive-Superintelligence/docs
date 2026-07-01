(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const P="https://psiweb-ipvtodvkeq-uc.a.run.app/api",L="/hub/data/catalog.json",q="/hub/",_=localStorage.getItem("psiweb_admin_token")||"";let y=null;const t={packages:[],selected:null,card:"",agentCard:"",readme:"",config:"",filters:{q:"",kind:"",resource:"",tag:""},activeTab:"readme",loading:!0,error:"",bundle:null,usingStatic:!1,uploadOpen:!1,uploadStatus:"",mutationBusy:!1,adminToken:localStorage.getItem("psihub_admin_token")||_},I=document.querySelector("#app");function C(e){return`${P.replace(/\/+$/,"")}${e}`}function f(e=""){return`${q.replace(/\/+$/,"")}/${String(e).replace(/^\/+/,"")}`}async function g(e,a={}){if(String(a.method||"GET").toUpperCase()!=="GET")return w(e,a);let i=null;try{const r=await w(e,a);return t.usingStatic=!1,r}catch(r){i=r}try{const r=await R(e);return t.usingStatic=!0,r}catch{throw i}}async function w(e,a={}){const n=await fetch(C(e),a);if(!n.ok){const r=await n.text();throw new Error(ee(r,n.statusText))}return(n.headers.get("content-type")||"").includes("application/json")?n.json():n.text()}async function j(){return y||(y=fetch(L).then(e=>{if(!e.ok)throw new Error("Static catalog unavailable");return e.json()}).then(e=>(t.bundle=e.bundle||null,e))),y}async function R(e){var m;const a=await j(),[n,i=""]=e.split("?");if(n==="/packages")return O(a.packages||[],new URLSearchParams(i));const r=n.match(/^\/packages\/([^/]+)\/([^/]+)(?:\/(.+))?$/);if(!r)throw new Error("Static route unavailable");const s=`${decodeURIComponent(r[1])}/${decodeURIComponent(r[2])}`,c=(m=a.details)==null?void 0:m[s];if(!c)throw new Error(`Package not found: ${s}`);const l=r[3]||"";if(!l)return c;if(l==="card")return c.card||"";if(l==="agent-card")return c.agent_card||"";if(l==="readme")return c.readme||"";if(l==="config-template")return c.config_template||"";if(l==="download")return f(c.download_url||"");throw new Error("Static route unavailable")}function O(e,a){const n=String(a.get("q")||"").trim().toLowerCase(),i=String(a.get("kind")||"").trim().toLowerCase(),r=String(a.get("tag")||"").trim().toLowerCase(),s=String(a.get("resource")||"").trim().toLowerCase();return e.filter(c=>!i||c.kind===i).filter(c=>!r||(c.tags||[]).some(l=>l.toLowerCase()===r)).filter(c=>!s||(c.resources||[]).some(l=>l.kind===s)).filter(c=>!n||B(c).includes(n)).sort((c,l)=>c.identifier.localeCompare(l.identifier))}function B(e){const a=[e.identifier,e.kind,e.description,e.summary,...e.tags||[]];return(e.resources||[]).forEach(n=>{a.push(n.kind,n.name,n.ref,n.description||"")}),a.join(" ").toLowerCase()}async function k(){t.loading=!0,t.error="",u();const e=new URLSearchParams;Object.entries(t.filters).forEach(([a,n])=>{n&&e.set(a,n)});try{if(t.packages=await g(`/packages?${e.toString()}`),!t.selected&&t.packages.length){await S(t.packages[0].identifier,{scroll:!1});return}t.selected&&!t.packages.some(a=>a.identifier===t.selected.identifier)&&(t.selected=null)}catch(a){t.error=a.message}finally{t.loading=!1,u()}}async function S(e,{scroll:a=!0}={}){var r;t.error="";const[n,i]=e.split("/");t.loading=!0,u();try{const s=`/packages/${encodeURIComponent(n)}/${encodeURIComponent(i)}`,[c,l,m,h,b]=await Promise.all([g(s),g(`${s}/card`),g(`${s}/agent-card`),g(`${s}/readme`).catch(()=>""),g(`${s}/config-template`)]);t.selected=c,t.card=l,t.agentCard=m,t.readme=h,t.config=b}catch(s){t.error=s.message}finally{t.loading=!1,u(),a&&((r=document.querySelector("#repository"))==null||r.scrollIntoView({behavior:"smooth",block:"start"}))}}function u(){const e=Y(t.packages);I.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${f()}" aria-label="PsiHub home">
          <img src="${f("psi-mark.svg")}" alt="" />
          <span>PsiHub</span>
        </a>
        <form class="nav-search" data-action="search">
          <input name="q" type="search" placeholder="Search packages, tactics, channels..." value="${d(t.filters.q)}" />
        </form>
        <nav class="top-actions" aria-label="Hub actions">
          <button class="nav-link" data-kind="" type="button">Packages</button>
          <a class="nav-link" href="${f("docs")}">Docs</a>
          <button class="join-button" data-action="toggle-upload" type="button">${t.uploadOpen?"Close":"Upload"}</button>
        </nav>
      </header>

      ${t.uploadOpen?x():""}

      <main>
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <img class="hero-mark" src="${f("psi-mark.svg")}" alt="" />
            <p class="hero-kicker">PsiHub</p>
            <h1 id="hero-title">The PSI package community for composable agents.</h1>
            <form class="hero-search" data-action="search">
              <input name="q" type="search" placeholder="Search packages, schemas, services..." value="${d(t.filters.q)}" />
              <button class="primary" type="submit">Search</button>
            </form>
            <div class="hero-actions">
              <a class="pill-link" href="#repository">Browse packages</a>
              <a class="pill-link" href="${f("docs")}">Read docs</a>
              ${t.bundle?`<a class="pill-link" href="${f(t.bundle.url)}" download>Demo bundle</a>`:""}
            </div>
          </div>
          <div class="hero-board" aria-label="PsiHub package preview">
            <div class="board-tabs">
              ${A(e).map(a=>`
                <button class="${t.filters.kind===a.kind?"is-active":""}" data-kind="${d(a.kind)}" type="button">
                  <span>${a.icon}</span>${o(a.label)}
                </button>
              `).join("")}
            </div>
            <div class="board-list">
              ${X(t.packages).map(U).join("")||'<div class="board-empty">No packages indexed</div>'}
            </div>
          </div>
        </section>

        <section class="category-strip" aria-label="Package categories">
          ${Q(e).map(D).join("")}
        </section>

        <section class="trending" aria-labelledby="trending-title">
          <div class="section-title">
            <span></span>
            <h2 id="trending-title">Trending in PsiHub</h2>
            <span></span>
          </div>
          <div class="trend-grid">
            ${Z(t.packages).map(N).join("")||'<div class="empty">No packages</div>'}
          </div>
        </section>

        <section class="workspace" id="repository" aria-label="Package repository browser">
          <aside class="results" aria-label="Package results">
            <form class="filters" data-action="filters">
              <div class="results-meta">
                <strong>${t.packages.length}</strong>
                <span>${t.packages.length===1?"package":"packages"}</span>
                <span class="source-pill">${t.usingStatic?"static":"live"}</span>
              </div>
              <label>
                <span>Kind</span>
                <select name="kind">
                  ${p("","All kinds",t.filters.kind)}
                  ${p("tactic","Tactics",t.filters.kind)}
                  ${p("channel","Channels",t.filters.kind)}
                  ${p("service","Services",t.filters.kind)}
                  ${p("app","Apps",t.filters.kind)}
                  ${p("mixed","Mixed",t.filters.kind)}
                </select>
              </label>
              <label>
                <span>Resource</span>
                <select name="resource">
                  ${p("","All resources",t.filters.resource)}
                  ${p("tactic","Tactics",t.filters.resource)}
                  ${p("channel","Channels",t.filters.resource)}
                  ${p("service","Services",t.filters.resource)}
                  ${p("schema","Schemas",t.filters.resource)}
                  ${p("run","Runs",t.filters.resource)}
                </select>
              </label>
              <label>
                <span>Tag</span>
                <input name="tag" type="search" placeholder="Any tag" value="${d(t.filters.tag)}" />
              </label>
              <button class="secondary full" type="submit">Apply filters</button>
            </form>
            ${t.loading?'<div class="status">Loading</div>':""}
            ${t.error?`<div class="status error">${o(t.error)}</div>`:""}
            <div class="result-list">
              ${t.packages.map(H).join("")||'<div class="empty">No packages</div>'}
            </div>
          </aside>
          <section class="detail" aria-label="Package detail">
            ${t.selected?F(t.selected):'<div class="empty large">Select a package</div>'}
          </section>
        </section>
      </main>
    </div>
  `,W()}function x(){return`
    <form class="upload-panel" data-action="upload">
      <label>
        <span>Admin token</span>
        <input name="token" data-token-input type="password" autocomplete="off" value="${d(t.adminToken)}" />
      </label>
      <label>
        <span>Package zip</span>
        <input name="file" type="file" accept=".zip,application/zip" />
      </label>
      <button class="primary" type="submit" ${t.mutationBusy?"disabled":""}>
        ${t.mutationBusy?"Uploading":"Upload"}
      </button>
      ${t.uploadStatus?`<output class="upload-status">${o(t.uploadStatus)}</output>`:""}
    </form>
  `}function U(e){return`
    <button class="board-package" data-package="${d(e.identifier)}" type="button">
      <span class="repo-dot ${d(e.kind||"package")}"></span>
      <span class="board-main">
        <strong>${o(e.identifier)}</strong>
        <small>${o(e.summary||e.description||"PSI package")}</small>
      </span>
      <span>${$(e)}</span>
    </button>
  `}function D(e){return`
    <button class="category-card ${t.filters.kind===e.kind?"is-active":""}" data-kind="${d(e.kind)}" type="button">
      <span class="category-icon">${e.icon}</span>
      <strong>${o(e.label)}</strong>
      <small>${e.count} ${e.count===1?"package":"packages"}</small>
    </button>
  `}function N(e){const a=(e.tags||[]).slice(0,2).map(n=>`<span>${o(n)}</span>`).join("");return`
    <button class="trend-card" data-package="${d(e.identifier)}" type="button">
      <span class="trend-kind">${E(e.kind)} ${o(e.kind||"package")}</span>
      <strong>${o(e.identifier)}</strong>
      <p>${o(e.summary||e.description||"PSI package")}</p>
      <span class="trend-meta">
        <span>${$(e)} resources</span>
        <span>${o(e.version||"0.1.0")}</span>
      </span>
      <span class="badges">${a}</span>
    </button>
  `}function H(e){var i;const a=((i=t.selected)==null?void 0:i.identifier)===e.identifier,n=(e.tags||[]).slice(0,3).map(r=>`<span>${o(r)}</span>`).join("");return`
    <button class="result ${a?"is-selected":""}" data-package="${d(e.identifier)}" type="button">
      <span class="result-main">
        <span class="repo-dot ${d(e.kind||"package")}"></span>
        <span class="result-title">${o(e.identifier)}</span>
        <span class="kind-pill">${o(e.kind||"package")}</span>
      </span>
      <span class="result-summary">${o(e.summary||e.description||"PSI package")}</span>
      <span class="badges">${n}</span>
      <span class="result-foot">${$(e)} resources</span>
    </button>
  `}function F(e){const a=Array.isArray(e.resources)?e.resources:[],n=[["readme","README"],["resources",`Resources ${a.length}`],["card","Card"],["config","Run Config"],["agent","Agent Card"],["files","Files"]];return`
    <div class="repo-head">
      <div class="repo-title">
        <span class="eyebrow">${E(e.kind)} ${o(e.kind||"package")}</span>
        <h1>${o(e.identifier)}</h1>
        <p>${o(e.summary||e.description||"")}</p>
      </div>
      <div class="commands">
        ${T(`psihub get ${e.identifier}`,"Get")}
        ${T(`psihub card ${e.identifier}`,"Card")}
        ${K(e)}
        <button class="danger" data-action="delete-package" type="button">Delete</button>
      </div>
    </div>
    <div class="meta-row">
      <span>Version ${o(e.version||"unknown")}</span>
      <span>Primary ${o(e.primary||"none")}</span>
      <span>${a.length} resources</span>
      ${(e.tags||[]).slice(0,5).map(i=>`<span>${o(i)}</span>`).join("")}
    </div>
    <nav class="tabs" aria-label="Package sections">
      ${n.map(([i,r])=>`
        <button class="${t.activeTab===i?"is-active":""}" data-tab="${i}" type="button">
          ${o(r)}
        </button>
      `).join("")}
    </nav>
    <div class="panel">
      ${M(e)}
    </div>
  `}function M(e){const a=Array.isArray(e.resources)?e.resources:[];return t.activeTab==="resources"?`
      <div class="resource-table">
        <div class="resource-row heading">
          <span>Kind</span><span>Name</span><span>Ref</span><span>Description</span>
        </div>
        ${a.map(n=>`
          <div class="resource-row">
            <span>${o(n.kind)}</span>
            <span>${o(n.name)}</span>
            <code>${o(n.ref)}</code>
            <span>${o(n.description||"")}</span>
          </div>
        `).join("")||'<div class="table-empty">No resources declared</div>'}
      </div>
    `:t.activeTab==="config"?v(t.config||"# no local config template"):t.activeTab==="agent"?v(t.agentCard||"# no agent card"):t.activeTab==="card"?v(t.card||"# no package card"):t.activeTab==="files"?z(e):G(t.readme||"README not declared.")}function z(e){const a=Object.keys(e.files||{}).sort();return a.length?`
    <div class="file-list">
      ${a.map(n=>`
        <button class="file-row" data-file="${d(n)}" type="button">
          <code>${o(n)}</code>
          <span>${te((e.files[n]||"").length)}</span>
        </button>
      `).join("")}
    </div>
  `:'<div class="empty">No renderable text files in this package</div>'}function G(e){const a=e.split(/\r?\n/).slice(0,160);let n=!1;return`<article class="markdown">${a.map(i=>i.startsWith("```")?(n=!n,n?"<pre><code>":"</code></pre>"):n?`${o(i)}
`:i.startsWith("# ")?`<h2>${o(i.slice(2))}</h2>`:i.startsWith("## ")?`<h3>${o(i.slice(3))}</h3>`:i.startsWith("### ")?`<h4>${o(i.slice(4))}</h4>`:i.startsWith("- ")?`<p class="list-line">${o(i)}</p>`:i.trim()?`<p>${o(i)}</p>`:"<br />").join("")}${n?"</code></pre>":""}</article>`}function v(e){return`<pre><code>${o(e)}</code></pre>`}function T(e,a){return`<button class="copy" data-copy="${d(e)}" data-label="${d(a)}" type="button">${o(a)}</button>`}function K(e){const[a,n]=e.identifier.split("/"),i=C(`/packages/${encodeURIComponent(a)}/${encodeURIComponent(n)}/download`),r=t.usingStatic&&e.download_url?f(e.download_url):i;return`<a class="download" href="${d(r)}" download>Download</a>`}function p(e,a,n){return`<option value="${d(e)}" ${n===e?"selected":""}>${o(a)}</option>`}function W(){var e,a,n,i,r;document.querySelectorAll("[data-action='search']").forEach(s=>{s.addEventListener("submit",c=>{c.preventDefault();const l=new FormData(c.currentTarget);t.filters.q=String(l.get("q")||"").trim(),t.selected=null,k()})}),(e=document.querySelector("[data-action='filters']"))==null||e.addEventListener("submit",s=>{s.preventDefault();const c=new FormData(s.currentTarget);t.filters.kind=String(c.get("kind")||""),t.filters.resource=String(c.get("resource")||""),t.filters.tag=String(c.get("tag")||"").trim(),t.selected=null,k()}),document.querySelectorAll("[data-kind]").forEach(s=>{s.addEventListener("click",()=>{t.filters.kind=s.dataset.kind||"",t.selected=null,k()})}),(a=document.querySelector("[data-action='toggle-upload']"))==null||a.addEventListener("click",()=>{t.uploadOpen=!t.uploadOpen,t.uploadStatus="",u()}),(n=document.querySelector("[data-action='upload']"))==null||n.addEventListener("submit",V),(i=document.querySelector("[data-token-input]"))==null||i.addEventListener("input",s=>{t.adminToken=String(s.currentTarget.value||"").trim(),t.adminToken?(localStorage.setItem("psihub_admin_token",t.adminToken),localStorage.removeItem("psiweb_admin_token")):(localStorage.removeItem("psihub_admin_token"),localStorage.removeItem("psiweb_admin_token"))}),(r=document.querySelector("[data-action='delete-package']"))==null||r.addEventListener("click",J),document.querySelectorAll("[data-package]").forEach(s=>{s.addEventListener("click",()=>S(s.dataset.package))}),document.querySelectorAll("[data-tab]").forEach(s=>{s.addEventListener("click",()=>{t.activeTab=s.dataset.tab,u()})}),document.querySelectorAll("[data-file]").forEach(s=>{s.addEventListener("click",()=>{var m,h,b;const c=s.dataset.file||"",l=((h=(m=t.selected)==null?void 0:m.files)==null?void 0:h[c])||"";(b=navigator.clipboard)==null||b.writeText(l),s.classList.add("is-copied"),setTimeout(()=>s.classList.remove("is-copied"),900)})}),document.querySelectorAll("[data-copy]").forEach(s=>{s.addEventListener("click",async()=>{var c;await((c=navigator.clipboard)==null?void 0:c.writeText(s.dataset.copy||"")),s.textContent="Copied",setTimeout(()=>{s.textContent=s.dataset.label||"Copy"},1200)})})}async function V(e){e.preventDefault();const a=new FormData(e.currentTarget),n=a.get("file"),i=String(a.get("token")||"").trim();if(!i){t.uploadStatus="Admin token required",u();return}if(!(n instanceof File)||!n.name){t.uploadStatus="Choose a package zip",u();return}t.adminToken=i,localStorage.setItem("psihub_admin_token",i),localStorage.removeItem("psiweb_admin_token"),t.mutationBusy=!0,t.uploadStatus="",u();const r=new FormData;r.set("file",n);try{const s=await g("/packages/upload",{method:"POST",headers:{authorization:`Bearer ${t.adminToken}`},body:r});t.uploadStatus=`Uploaded ${s.identifier}`,t.uploadOpen=!1,t.selected=null,await k(),await S(s.identifier)}catch(s){t.uploadStatus=s.message}finally{t.mutationBusy=!1,u()}}async function J(){if(!t.selected)return;if(!t.adminToken){t.uploadOpen=!0,t.uploadStatus="Admin token required",u();return}const e=t.selected.identifier;if(!window.confirm(`Delete ${e}?`))return;const[a,n]=e.split("/");t.mutationBusy=!0,t.error="",u();try{await g(`/packages/${encodeURIComponent(a)}/${encodeURIComponent(n)}`,{method:"DELETE",headers:{authorization:`Bearer ${t.adminToken}`}}),t.selected=null,await k()}catch(i){t.error=i.message}finally{t.mutationBusy=!1,u()}}function Y(e){const a={total:e.length,tactic:0,channel:0,service:0,app:0,mixed:0};return e.forEach(n=>{const i=n.kind||"";Object.prototype.hasOwnProperty.call(a,i)&&(a[i]+=1)}),a}function A(e){return[{kind:"",label:"Main",icon:"ψ",count:e.total},{kind:"tactic",label:"Tactics",icon:"✦",count:e.tactic},{kind:"channel",label:"Channels",icon:"▤",count:e.channel},{kind:"service",label:"Services",icon:"◈",count:e.service},{kind:"app",label:"Apps",icon:"◼",count:e.app},{kind:"mixed",label:"Mixed",icon:"◇",count:e.mixed}]}function Q(e){return A(e).filter(a=>a.kind)}function X(e){return e.slice(0,8)}function Z(e){return[...e].sort((a,n)=>$(n)-$(a)||a.identifier.localeCompare(n.identifier)).slice(0,6)}function E(e){return{tactic:"✦",channel:"▤",service:"◈",app:"◼",mixed:"◇"}[e]||"ψ"}function ee(e,a){if(!e)return a;try{const n=JSON.parse(e);if(typeof n.detail=="string")return n.detail;if(Array.isArray(n.detail))return n.detail.map(i=>i.msg||String(i)).join("; ")}catch{return e}return e}function $(e){return Array.isArray(e.resources)?e.resources.length:0}function te(e){return e<1024?`${e} B`:`${Math.round(e/102.4)/10} KB`}function o(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function d(e){return o(e)}k();
