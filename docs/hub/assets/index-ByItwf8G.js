(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const L="/api",q="/hub/data/catalog.json",I="/hub/",_="/docs/",j="/docs/hub/",R=localStorage.getItem("psiweb_admin_token")||"";let v=null;const a={packages:[],selected:null,card:"",agentCard:"",readme:"",config:"",filters:{q:"",kind:"",resource:"",tag:""},activeTab:"readme",loading:!0,error:"",bundle:null,usingStatic:!1,uploadOpen:!1,uploadStatus:"",mutationBusy:!1,adminToken:localStorage.getItem("psihub_admin_token")||R},x=document.querySelector("#app");function A(e){return`${L.replace(/\/+$/,"")}${e}`}function y(e=""){return`${I.replace(/\/+$/,"")}/${String(e).replace(/^\/+/,"")}`}async function f(e,t={}){if(String(t.method||"GET").toUpperCase()!=="GET")return C(e,t);let i=null;try{const r=await C(e,t);return a.usingStatic=!1,r}catch(r){i=r}try{const r=await B(e);return a.usingStatic=!0,r}catch{throw i}}async function C(e,t={}){const n=await fetch(A(e),t);if(!n.ok){const r=await n.text();throw new Error(de(r,n.statusText))}return(n.headers.get("content-type")||"").includes("application/json")?n.json():n.text()}async function O(){return v||(v=fetch(q).then(e=>{if(!e.ok)throw new Error("Static catalog unavailable");return e.json()}).then(e=>(a.bundle=e.bundle||null,e))),v}async function B(e){var m;const t=await O(),[n,i=""]=e.split("?");if(n==="/packages")return U(t.packages||[],new URLSearchParams(i));const r=n.match(/^\/packages\/([^/]+)\/([^/]+)(?:\/(.+))?$/);if(!r)throw new Error("Static route unavailable");const s=`${decodeURIComponent(r[1])}/${decodeURIComponent(r[2])}`,o=(m=t.details)==null?void 0:m[s];if(!o)throw new Error(`Package not found: ${s}`);const l=r[3]||"";if(!l)return o;if(l==="card")return o.card||"";if(l==="agent-card")return o.agent_card||"";if(l==="readme")return o.readme||"";if(l==="config-template")return o.config_template||"";if(l==="download")return y(o.download_url||"");throw new Error("Static route unavailable")}function U(e,t){const n=String(t.get("q")||"").trim().toLowerCase(),i=String(t.get("kind")||"").trim().toLowerCase(),r=String(t.get("tag")||"").trim().toLowerCase(),s=String(t.get("resource")||"").trim().toLowerCase();return e.filter(o=>!i||o.kind===i).filter(o=>!r||(o.tags||[]).some(l=>l.toLowerCase()===r)).filter(o=>!s||(o.resources||[]).some(l=>l.kind===s)).filter(o=>!n||D(o).includes(n)).sort((o,l)=>o.identifier.localeCompare(l.identifier))}function D(e){const t=[e.identifier,e.kind,e.description,e.summary,...e.tags||[]];return(e.resources||[]).forEach(n=>{t.push(n.kind,n.name,n.ref,n.description||"")}),t.join(" ").toLowerCase()}async function g(){a.loading=!0,a.error="",u();const e=new URLSearchParams;Object.entries(a.filters).forEach(([t,n])=>{n&&e.set(t,n)});try{if(a.packages=await f(`/packages?${e.toString()}`),!a.selected&&a.packages.length){await w(a.packages[0].identifier,{scroll:!1});return}a.selected&&!a.packages.some(t=>t.identifier===a.selected.identifier)&&(a.selected=null)}catch(t){a.error=t.message}finally{a.loading=!1,u()}}async function w(e,{scroll:t=!0}={}){var r;a.error="";const[n,i]=e.split("/");a.loading=!0,u();try{const s=`/packages/${encodeURIComponent(n)}/${encodeURIComponent(i)}`,[o,l,m,h,$]=await Promise.all([f(s),f(`${s}/card`),f(`${s}/agent-card`),f(`${s}/readme`).catch(()=>""),f(`${s}/config-template`)]);a.selected=o,a.card=l,a.agentCard=m,a.readme=h,a.config=$}catch(s){a.error=s.message}finally{a.loading=!1,u(),t&&((r=document.querySelector("#repository"))==null||r.scrollIntoView({behavior:"smooth",block:"start"}))}}function u(){const e=re(a.packages);x.innerHTML=`
    <div class="shell">
      <header class="site-nav">
        <a href="/" class="home-mark" aria-label="Productive Superintelligence home">
          <span class="home-psi" aria-hidden="true">ψ</span>
        </a>
        <nav class="nav-links" aria-label="Primary">
          <a class="is-active" href="${y()}">Hub</a>
          <a href="/projects">Projects</a>
          <a href="${_}">Docs</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
        </nav>
      </header>

      ${a.uploadOpen?N():""}

      <main>
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <p class="label">PsiHub</p>
            <h1 id="hero-title">PSI package hub.</h1>
            <hr />
            <p class="section-copy">
              Discover, inspect, download, and compose PSI packages through a quiet package surface built for tactics, channels, services, and shells.
            </p>
            <form class="hero-search" data-action="search">
              <input name="q" type="search" placeholder="Search packages, schemas, services..." value="${d(a.filters.q)}" />
              <button class="primary" type="submit">Search</button>
            </form>
            <div class="link-row">
              <a class="text-link" href="#repository">Browse packages</a>
              <a class="text-link" href="${j}">Read docs</a>
              ${a.bundle?`<a class="text-link" href="${y(a.bundle.url)}" download>Demo bundle</a>`:""}
              <button class="text-link" data-action="toggle-upload" type="button">${a.uploadOpen?"Close upload":"Upload package"}</button>
            </div>
          </div>
          <div class="hero-board" aria-label="PsiHub package index">
            <p class="label">Index</p>
            <div class="board-tabs">
              ${T(e).map(t=>`
                <button class="${a.filters.kind===t.kind?"is-active":""}" data-kind="${d(t.kind)}" type="button">
                  <span>${t.icon}</span>${c(t.label)}
                </button>
              `).join("")}
            </div>
            <div class="board-list">
              ${ce(a.packages).map(F).join("")||'<div class="board-empty">No packages indexed</div>'}
            </div>
          </div>
        </section>

        <section class="category-strip" aria-label="Package categories">
          ${oe(e).map(H).join("")}
        </section>

        <section class="trending" aria-labelledby="trending-title">
          <div class="section-title">
            <p class="label">Packages</p>
            <h2 id="trending-title">Featured packages.</h2>
          </div>
          <div class="trend-grid">
            ${le(a.packages).map(z).join("")||'<div class="empty">No packages</div>'}
          </div>
        </section>

        <section class="workspace" id="repository" aria-label="Package repository browser">
          <aside class="results" aria-label="Package results">
            <form class="filters" data-action="filters">
              <div class="results-meta">
                <strong>${a.packages.length}</strong>
                <span>${a.packages.length===1?"package":"packages"}</span>
                <span class="source-pill">${a.usingStatic?"static":"live"}</span>
              </div>
              <label>
                <span>Kind</span>
                <select name="kind">
                  ${p("","All kinds",a.filters.kind)}
                  ${p("tactic","Tactics",a.filters.kind)}
                  ${p("channel","Channels",a.filters.kind)}
                  ${p("service","Services",a.filters.kind)}
                  ${p("app","Apps",a.filters.kind)}
                  ${p("mixed","Mixed",a.filters.kind)}
                </select>
              </label>
              <label>
                <span>Resource</span>
                <select name="resource">
                  ${p("","All resources",a.filters.resource)}
                  ${p("tactic","Tactics",a.filters.resource)}
                  ${p("channel","Channels",a.filters.resource)}
                  ${p("service","Services",a.filters.resource)}
                  ${p("schema","Schemas",a.filters.resource)}
                  ${p("run","Runs",a.filters.resource)}
                </select>
              </label>
              <label>
                <span>Tag</span>
                <input name="tag" type="search" placeholder="Any tag" value="${d(a.filters.tag)}" />
              </label>
              <button class="secondary full" type="submit">Apply filters</button>
            </form>
            ${a.loading?'<div class="status">Loading</div>':""}
            ${a.error?`<div class="status error">${c(a.error)}</div>`:""}
            <div class="result-list">
              ${a.packages.map(M).join("")||'<div class="empty">No packages</div>'}
            </div>
          </aside>
          <section class="detail" aria-label="Package detail">
            ${a.selected?W(a.selected):'<div class="empty large">Select a package</div>'}
          </section>
        </section>
      </main>
    </div>
  `,ne()}function N(){return`
    <form class="upload-panel" data-action="upload">
      <label>
        <span>Admin token</span>
        <input name="token" data-token-input type="password" autocomplete="off" value="${d(a.adminToken)}" />
      </label>
      <label>
        <span>Package zip</span>
        <input name="file" type="file" accept=".zip,application/zip" />
      </label>
      <button class="primary" type="submit" ${a.mutationBusy?"disabled":""}>
        ${a.mutationBusy?"Uploading":"Upload"}
      </button>
      ${a.uploadStatus?`<output class="upload-status">${c(a.uploadStatus)}</output>`:""}
    </form>
  `}function F(e){return`
    <button class="board-package" data-package="${d(e.identifier)}" type="button">
      <span class="repo-dot ${d(e.kind||"package")}"></span>
      <span class="board-main">
        <strong>${c(e.identifier)}</strong>
        <small>${c(e.summary||e.description||"PSI package")}</small>
      </span>
      <span>${k(e)}</span>
    </button>
  `}function H(e){return`
    <button class="category-card ${a.filters.kind===e.kind?"is-active":""}" data-kind="${d(e.kind)}" type="button">
      <span class="category-icon">${e.icon}</span>
      <strong>${c(e.label)}</strong>
      <small>${e.count} ${e.count===1?"package":"packages"}</small>
    </button>
  `}function z(e){const t=(e.tags||[]).slice(0,2).map(n=>`<span>${c(n)}</span>`).join("");return`
    <button class="trend-card" data-package="${d(e.identifier)}" type="button">
      <span class="trend-kind">${E(e.kind)} ${c(e.kind||"package")}</span>
      <strong>${c(e.identifier)}</strong>
      <p>${c(e.summary||e.description||"PSI package")}</p>
      <span class="trend-meta">
        <span>${k(e)} resources</span>
        <span>${c(e.version||"0.1.0")}</span>
      </span>
      <span class="badges">${t}</span>
    </button>
  `}function M(e){var i;const t=((i=a.selected)==null?void 0:i.identifier)===e.identifier,n=(e.tags||[]).slice(0,3).map(r=>`<span>${c(r)}</span>`).join("");return`
    <button class="result ${t?"is-selected":""}" data-package="${d(e.identifier)}" type="button">
      <span class="result-main">
        <span class="repo-dot ${d(e.kind||"package")}"></span>
        <span class="result-title">${c(e.identifier)}</span>
        <span class="kind-pill">${c(e.kind||"package")}</span>
      </span>
      <span class="result-summary">${c(e.summary||e.description||"PSI package")}</span>
      <span class="badges">${n}</span>
      <span class="result-foot">${k(e)} resources</span>
    </button>
  `}function W(e){const t=Array.isArray(e.resources)?e.resources:[],n=[["readme","README"],["resources",`Resources ${t.length}`],["card","Card"],["config","Run Config"],["agent","Agent Card"],["files","Files"]];return`
    <div class="repo-head">
      <div class="repo-title">
        <span class="eyebrow">${E(e.kind)} ${c(e.kind||"package")}</span>
        <h1>${c(e.identifier)}</h1>
        <p>${c(e.summary||e.description||"")}</p>
      </div>
      <div class="commands">
        ${S(`psihub get ${e.identifier}`,"Get")}
        ${S(`psihub card ${e.identifier}`,"Card")}
        ${te(e)}
        <button class="danger" data-action="delete-package" type="button">Delete</button>
      </div>
    </div>
    <div class="meta-row">
      <span>Version ${c(e.version||"unknown")}</span>
      <span>Primary ${c(e.primary||"none")}</span>
      <span>${t.length} resources</span>
      ${(e.tags||[]).slice(0,5).map(i=>`<span>${c(i)}</span>`).join("")}
    </div>
    ${G(e)}
    <nav class="tabs" aria-label="Package sections">
      ${n.map(([i,r])=>`
        <button class="${a.activeTab===i?"is-active":""}" data-tab="${i}" type="button">
          ${c(r)}
        </button>
      `).join("")}
    </nav>
    <div class="panel">
      ${Q(e)}
    </div>
  `}function G(e){const t=K(e);return`
    <section class="use-panel" aria-labelledby="use-package-title">
      <div class="use-heading">
        <div>
          <span class="eyebrow">Use this package</span>
          <h2 id="use-package-title">Run it as a FastAPI service</h2>
        </div>
        ${S(t.map(n=>n.command).join(`

`),"Copy all")}
      </div>
      <div class="use-steps">
        ${t.map((n,i)=>`
          <div class="use-step">
            <span>${i+1}</span>
            <strong>${c(n.label)}</strong>
            ${b(n.command)}
          </div>
        `).join("")}
      </div>
    </section>
  `}function K(e){const t=J(e),n=`${t}-${e.version||"package"}.zip`,i=Z(e),r=`packages/${t}`;return[{label:"Install",command:"python -m pip install prosi-psi-cli psihub lllm-core sssn aaax"},{label:"Download",command:[`mkdir -p "${r}"`,`curl -L "${P(e)}" -o "${n}"`,`unzip -q -o "${n}" -d "${r}"`].join(`
`)},{label:"Launch",command:`psi launch "${r}" --port ${i}`},{label:"Call",command:V(e,i)}]}function V(e,t){return Y(e)?`curl http://127.0.0.1:${t}/channels`:[`curl -X POST http://127.0.0.1:${t}/run \\`,"  -H 'content-type: application/json' \\",`  -d '{"input": {}}'`].join(`
`)}function J(e){const t=e.name||String(e.identifier||"package").split("/").pop();return String(t||"package").replace(/[^a-zA-Z0-9._-]+/g,"-")}function X(e){const t=String(e.primary||""),[n,i]=t.split("."),s={tactics:"tactic",services:"service",channels:"channel",snapshots:"snapshot",runs:"run"}[n];return!s||!i||!Array.isArray(e.resources)?null:e.resources.find(o=>o.kind===s&&o.name===i)||null}function Y(e){return String(e.primary||"").startsWith("channels.")||e.kind==="channel"}function Z(e){const t=X(e),n=Array.isArray(e.resources)?e.resources.find(s=>s.kind==="service"):null,r=((t==null?void 0:t.metadata)||(n==null?void 0:n.metadata)||{}).port;return Number.isInteger(r)&&r>0&&r<65536?r:8e3}function Q(e){const t=Array.isArray(e.resources)?e.resources:[];return a.activeTab==="resources"?`
      <div class="resource-table">
        <div class="resource-row heading">
          <span>Kind</span><span>Name</span><span>Ref</span><span>Description</span>
        </div>
        ${t.map(n=>`
          <div class="resource-row">
            <span>${c(n.kind)}</span>
            <span>${c(n.name)}</span>
            <code>${c(n.ref)}</code>
            <span>${c(n.description||"")}</span>
          </div>
        `).join("")||'<div class="table-empty">No resources declared</div>'}
      </div>
    `:a.activeTab==="config"?b(a.config||"# no local config template"):a.activeTab==="agent"?b(a.agentCard||"# no agent card"):a.activeTab==="card"?b(a.card||"# no package card"):a.activeTab==="files"?ee(e):ae(a.readme||"README not declared.")}function ee(e){const t=Object.keys(e.files||{}).sort();return t.length?`
    <div class="file-list">
      ${t.map(n=>`
        <button class="file-row" data-file="${d(n)}" type="button">
          <code>${c(n)}</code>
          <span>${ue((e.files[n]||"").length)}</span>
        </button>
      `).join("")}
    </div>
  `:'<div class="empty">No renderable text files in this package</div>'}function ae(e){const t=e.split(/\r?\n/).slice(0,160);let n=!1;return`<article class="markdown">${t.map(i=>i.startsWith("```")?(n=!n,n?"<pre><code>":"</code></pre>"):n?`${c(i)}
`:i.startsWith("# ")?`<h2>${c(i.slice(2))}</h2>`:i.startsWith("## ")?`<h3>${c(i.slice(3))}</h3>`:i.startsWith("### ")?`<h4>${c(i.slice(4))}</h4>`:i.startsWith("- ")?`<p class="list-line">${c(i)}</p>`:i.trim()?`<p>${c(i)}</p>`:"<br />").join("")}${n?"</code></pre>":""}</article>`}function b(e){return`<pre><code>${c(e)}</code></pre>`}function S(e,t){return`<button class="copy" data-copy="${d(e)}" data-label="${d(t)}" type="button">${c(t)}</button>`}function te(e){return`<a class="download" href="${d(P(e))}" download>Download</a>`}function P(e){const[t,n]=e.identifier.split("/"),i=A(`/packages/${encodeURIComponent(t)}/${encodeURIComponent(n)}/download`);return a.usingStatic&&e.download_url?y(e.download_url):i}function p(e,t,n){return`<option value="${d(e)}" ${n===e?"selected":""}>${c(t)}</option>`}function ne(){var e,t,n,i,r;document.querySelectorAll("[data-action='search']").forEach(s=>{s.addEventListener("submit",o=>{o.preventDefault();const l=new FormData(o.currentTarget);a.filters.q=String(l.get("q")||"").trim(),a.selected=null,g()})}),(e=document.querySelector("[data-action='filters']"))==null||e.addEventListener("submit",s=>{s.preventDefault();const o=new FormData(s.currentTarget);a.filters.kind=String(o.get("kind")||""),a.filters.resource=String(o.get("resource")||""),a.filters.tag=String(o.get("tag")||"").trim(),a.selected=null,g()}),document.querySelectorAll("[data-kind]").forEach(s=>{s.addEventListener("click",()=>{a.filters.kind=s.dataset.kind||"",a.selected=null,g()})}),(t=document.querySelector("[data-action='toggle-upload']"))==null||t.addEventListener("click",()=>{a.uploadOpen=!a.uploadOpen,a.uploadStatus="",u()}),(n=document.querySelector("[data-action='upload']"))==null||n.addEventListener("submit",se),(i=document.querySelector("[data-token-input]"))==null||i.addEventListener("input",s=>{a.adminToken=String(s.currentTarget.value||"").trim(),a.adminToken?(localStorage.setItem("psihub_admin_token",a.adminToken),localStorage.removeItem("psiweb_admin_token")):(localStorage.removeItem("psihub_admin_token"),localStorage.removeItem("psiweb_admin_token"))}),(r=document.querySelector("[data-action='delete-package']"))==null||r.addEventListener("click",ie),document.querySelectorAll("[data-package]").forEach(s=>{s.addEventListener("click",()=>w(s.dataset.package))}),document.querySelectorAll("[data-tab]").forEach(s=>{s.addEventListener("click",()=>{a.activeTab=s.dataset.tab,u()})}),document.querySelectorAll("[data-file]").forEach(s=>{s.addEventListener("click",()=>{var m,h,$;const o=s.dataset.file||"",l=((h=(m=a.selected)==null?void 0:m.files)==null?void 0:h[o])||"";($=navigator.clipboard)==null||$.writeText(l),s.classList.add("is-copied"),setTimeout(()=>s.classList.remove("is-copied"),900)})}),document.querySelectorAll("[data-copy]").forEach(s=>{s.addEventListener("click",async()=>{var o;await((o=navigator.clipboard)==null?void 0:o.writeText(s.dataset.copy||"")),s.textContent="Copied",setTimeout(()=>{s.textContent=s.dataset.label||"Copy"},1200)})})}async function se(e){e.preventDefault();const t=new FormData(e.currentTarget),n=t.get("file"),i=String(t.get("token")||"").trim();if(!i){a.uploadStatus="Admin token required",u();return}if(!(n instanceof File)||!n.name){a.uploadStatus="Choose a package zip",u();return}a.adminToken=i,localStorage.setItem("psihub_admin_token",i),localStorage.removeItem("psiweb_admin_token"),a.mutationBusy=!0,a.uploadStatus="",u();const r=new FormData;r.set("file",n);try{const s=await f("/packages/upload",{method:"POST",headers:{authorization:`Bearer ${a.adminToken}`},body:r});a.uploadStatus=`Uploaded ${s.identifier}`,a.uploadOpen=!1,a.selected=null,await g(),await w(s.identifier)}catch(s){a.uploadStatus=s.message}finally{a.mutationBusy=!1,u()}}async function ie(){if(!a.selected)return;if(!a.adminToken){a.uploadOpen=!0,a.uploadStatus="Admin token required",u();return}const e=a.selected.identifier;if(!window.confirm(`Delete ${e}?`))return;const[t,n]=e.split("/");a.mutationBusy=!0,a.error="",u();try{await f(`/packages/${encodeURIComponent(t)}/${encodeURIComponent(n)}`,{method:"DELETE",headers:{authorization:`Bearer ${a.adminToken}`}}),a.selected=null,await g()}catch(i){a.error=i.message}finally{a.mutationBusy=!1,u()}}function re(e){const t={total:e.length,tactic:0,channel:0,service:0,app:0,mixed:0};return e.forEach(n=>{const i=n.kind||"";Object.prototype.hasOwnProperty.call(t,i)&&(t[i]+=1)}),t}function T(e){return[{kind:"",label:"Main",icon:"ψ",count:e.total},{kind:"tactic",label:"Tactics",icon:"✦",count:e.tactic},{kind:"channel",label:"Channels",icon:"▤",count:e.channel},{kind:"service",label:"Services",icon:"◈",count:e.service},{kind:"app",label:"Apps",icon:"◼",count:e.app},{kind:"mixed",label:"Mixed",icon:"◇",count:e.mixed}]}function oe(e){return T(e).filter(t=>t.kind)}function ce(e){return e.slice(0,8)}function le(e){return[...e].sort((t,n)=>k(n)-k(t)||t.identifier.localeCompare(n.identifier)).slice(0,6)}function E(e){return{tactic:"✦",channel:"▤",service:"◈",app:"◼",mixed:"◇"}[e]||"ψ"}function de(e,t){if(!e)return t;try{const n=JSON.parse(e);if(typeof n.detail=="string")return n.detail;if(Array.isArray(n.detail))return n.detail.map(i=>i.msg||String(i)).join("; ")}catch{return e}return e}function k(e){return Array.isArray(e.resources)?e.resources.length:0}function ue(e){return e<1024?`${e} B`:`${Math.round(e/102.4)/10} KB`}function c(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function d(e){return c(e)}g();
