(()=>{"use strict";class LightElementShell extends HTMLElement{static NonPrimitiveFlag="[le-non-primitive]";static _elementClass=null;static _attributesMapping=null;static _publicMethods=null;_element;constructor(){super(),this._element=new this.constructor._elementClass(this),this.#t(),this.attachShadow({mode:"open"}).append(this._element.getDom())}get element(){return this._element}get dom(){return this.shadowRoot.querySelector("body")}get innerHTML(){return this.dom.innerHTML}connectedCallback(){if(this._leDelayedDomMutations)for(;this._leDelayedDomMutations.length;)this._leDelayedDomMutations.shift().perform();this._element.performInit()}disconnectedCallback(){}adoptedCallback(){}attributeChangedCallback(t,e,s){const n=this.constructor._attributesMapping.get(t);s!=LightElementShell.NonPrimitiveFlag&&(this._element[n]=s),this._element.isInit()&&this._element.performChange(n)}#t(){for(let t of this.constructor._publicMethods||[])this[t]=this._element[t].bind(this._element)}}class Scope{static#e=1;#s;#n;#i;#r;#o;#a;constructor(t){this.#s=Scope.#e++,this.#n=new Set,this.#i=null,this.#r=new Map,this.#o=t,this.#a=new Map}getId(){return this.#s}addScope(t){this.#n.add(t),t.setParentScope(this)}removeScope(t){this.#n.remove(t)}setParentScope(t){this.#i=t}addMutation(t,e){this.#r.has(t)?this.#r.get(t).push(e):this.#r.set(t,[e]),e.perform()}addMutations(t,e){this.#r.has(t)?this.#r.get(t).push(...e):this.#r.set(t,e),e&&e.length&&e.forEach((t=>{t.perform()}))}setVariable(t,e){this.#a.set(t,e)}getVariables(){return Object.fromEntries(this.#a.entries())}#l(...t){const e=[];for(let t of this.#a.keys()){const s=this.#a.get(t);let n=JSON.stringify(s).replace(/"/g,'\\"');e.push(`const ${t} = JSON.parse("${n}");`)}return e.join("")+t}createStatement(...t){const e=t.pop()||"";return new Function(...t,this.#l(e)).bind(this.#o)}createGeneratorStatement(...t){const e=function*(){}.constructor,s=t.pop()||"";return new e(...t,this.#l(s)).bind(this.#o)}getDependenciesFromStatement(t){const e=[],s=[];for(let t of this.#a.keys()){const n=this.#a.get(t);let i=JSON.stringify(n).replace(/"/g,'\\"');s.push(`const ${t} = JSON.parse("${i}");`),e.push(t)}const n=s.join("")+t;return new Function(n).bind(new Proxy(this.#o,{get:(t,s)=>(e.push(`this.${s}`),t[s])}))(),e}createVariation(t,e){const s=new Scope(this.#o);return s.setVariable(t,e),this.addScope(s),s}update(t=null){if(null==t){for(let t of this.#r.keys())this.update(t);return}const e=this.#r.get(t);e&&e.length&&e.forEach((t=>{t.perform()})),this.#n.forEach((e=>{e.update(t)}))}}class DomMutation{_lightElement;_node;constructor(t,e){this._lightElement=t,this._node=e}perform(){}}class AttributeDomMutation extends DomMutation{_attribute;_statement;constructor(t,e,s,n){super(t,e),this._attribute=s,this._statement=n}perform(){if(this._node.tagName.includes("-")&&!this._node.isConnected&&customElements.get(this._node.tagName.toLowerCase()))return this._node._leDelayedDomMutations||(this._node._leDelayedDomMutations=[]),void this._node._leDelayedDomMutations.push(this);const t=this._statement.resolve();!0===t?this._node.setAttribute(this._attribute,""):!1===t?this._node.removeAttribute(this._attribute):this._node.setAttribute(this._attribute,t)}}class ForDomMutation extends DomMutation{_statement;_template;_tags;constructor(t,e,s){super(t,e),this._statement=s,this._template=e,this._node=document.createComment("*for"),this._template.replaceWith(this._node),this._tags=[]}perform(){this._tags.forEach((t=>{t.remove()})),this._tags.length=0;let t=this._node;for(let e of this._statement.resolve()){const s=this._template.cloneNode(!0),n=this._statement.getScope().createVariation(this._statement.getVariableName(),e);LightElement.processDomNode(n,this._lightElement,s,!1),s.setAttribute("for-generated",""),t.after(s),t=s,this._tags.push(s)}}}class IfDomMutation extends DomMutation{_statement;_hook;_template;#h;constructor(t,e,s){super(t,e),this._statement=s,this._template=e,this._node=document.createComment("*if"),this._template.replaceWith(this._node),this.#h=null}perform(){const t=this._statement.resolve();t&&!this.#h?(this.#h=this._template.cloneNode(!0),LightElement.processDomNode(this._statement.getScope(),this._lightElement,this.#h,!1),this._node.after(this.#h)):!t&&this.#h&&(this.#h.remove(),this.#h=null)}}class NoopDomMutation extends DomMutation{_statement;#c;constructor(t,e,s){super(t,e),this._statement=s,this.#c=!0}perform(){this.#c&&(this.#c=!1,this._statement.resolve(),LightElement.processDomNode(this._statement.getScope(),this._lightElement,this._node,!1))}}class TextContentDomMutation extends DomMutation{_statement;constructor(t,e,s){super(t,e),this._statement=s}perform(){this._node.textContent=`${this._statement.resolve()}`}}class Statement{static#e=1;#s;_target;_statement;_scope;constructor(t,e=null,s=null){this.#s=Statement.#e++,this._target=e,this._statement=t,this._scope=s}getId(){return this.#s}getScope(){return this._scope}resolve(){}}class ForStatement extends Statement{#m;#u;#d;constructor(t,e=null,s=null){super(t,e,s);const n=this.constructor.#p(t);this.#u=n.variable,this.#d=n.iterable,this.#m=s.createGeneratorStatement(`for (let ${this.#u} of ${this.#d} || []) { yield ${this.#u}; }`)}static#p(t){const e=t.match(/^\s*let\s+(?<variable>[a-zA-Z][a-zA-Z0-9_]*)\s+of\s+(?<iterable>[a-zA-Z][a-zA-Z0-9_\\?.\[\]\(\)\'\"]*)\s*$/);if(!e)throw new Error(`Invalid *for statement: "${t}".`);return{variable:e.groups.variable,iterable:e.groups.iterable}}getVariableName(){return this.#u}getDependencies(){return[this.#d]}*resolve(){for(let t of this.#m())yield t}}class ReturnStatement extends Statement{#m;constructor(t,e=null,s=null){super(t,e,s),this.#m=this._scope.createStatement(`return (${this._statement||null});`)}getDependencies(){return this._scope.getDependenciesFromStatement(this._statement)}resolve(){return this.#m()}}class LetStatement extends ReturnStatement{#g;constructor(t,e,s=null,n=null){super(e,s,n),this.#g=t}resolve(){return this._scope.setVariable(this.#g,super.resolve()),!0}}class lightelement_LightElement{static tagName=null;static css=null;static html=null;static#e=1;static _registered=!1;#s;#_;#f;#b;#N;#E;#S;constructor(t){this.#s=lightelement_LightElement.#e++,this.#f=!1,this.#_=t,this.#E=[],this.#S=null,this.constructor._registered&&(this.#N=new Scope(this),this.#b=this.#v())}getId(){return this.#s}getTagName(){return this.constructor.tagName}getCssTemplate(){return this.constructor.css||""}getHtmlTemplate(){return""|this.constructor.html}getDom(){return this.#b}getHost(){return this.#_}update(t=null){this.#N&&this.#N.update(t)}dispatchEvent(t){0!=t.eventPhase&&(t=new t.constructor(t.type,t)),this.#_.dispatchEvent(t)}performInit(){this.#f||(this.#f=!0,this.update(),this.onInit())}performChange(t){this.#E.push(t),this.#S||(this.#S=new Promise((async(t,e)=>{for(;this.#E.length;)await Promise.resolve(this.onChange(this.#E.shift()));this.#S=null,t()})))}isInit(){return this.#f}onInit(){}onDestroy(){}onChange(t){}static processDomNode(t,e,s,n=!0){if(![Node.TEXT_NODE,Node.ELEMENT_NODE].includes(s.nodeType))return null;let i=!0;if(s.nodeType==Node.TEXT_NODE){const n=/\{\{(?<statement>[^\}]*)\}\}/.exec(s.textContent);if(n){const i=s.textContent.indexOf(n[0]),r=i>0?s.splitText(i):s;r.length>n[0].length&&r.splitText(n[0].length);const o=new ReturnStatement(n[1].trim(),e,t),a=new TextContentDomMutation(e,r,o),l=o.getDependencies();l.length?l.forEach((e=>{t.addMutation(e,a)})):a.perform()}}else{let r=!1;const o=[];for(let t=0;t<s.attributes.length;t++){const e=s.attributes.item(t),i=e.name.match(/^(?<type>[\*\(\[])(?<name>[\w-]+)[\)\]]?$/);if(!i)continue;const a={attributeName:e.name,type:i.groups.type,name:i.groups.name,attributeValue:e.value};if("*"==a.type){if(r)throw new Error(`Element "${s.tagName}" has more than one *attribute. Only zero to one are allowed.`);r=!0,n="for"==a.name||n,o.unshift(a)}else o.push(a)}i=!(r&&n),o.forEach((({attributeName:n,type:r,name:o,attributeValue:a})=>{if(!i&&"*"!=r)return;let l=null,h=null;switch(r){case"*":if("if"==o)l=new ReturnStatement(a,e,t),h=new IfDomMutation(e,s,l);else if("for"==o)l=new ForStatement(a,e,t),h=new ForDomMutation(e,s,l);else if(o.startsWith("let-")){const n=o.substring(4);l=new LetStatement(n,a,e,t),h=new NoopDomMutation(e,s,l)}break;case"[":l=new ReturnStatement(a,e,t),h=new AttributeDomMutation(e,s,o,l);break;case"(":s.addEventListener(o,t.createStatement("event",a))}if(s.removeAttribute(n),l&&h){const e=l.getDependencies();e.length?e.forEach((e=>{t.addMutation(e,h)})):h.perform()}}))}if(i)for(let i of s.childNodes)i.nodeType==Node.ELEMENT_NODE&&i.hasAttribute("for-generated")||lightelement_LightElement.processDomNode(t,e,i,n)}#v(){const t=(new DOMParser).parseFromString(`<html><head></head><body><style type="text/css">html,body{padding:0;margin:0;}${this.constructor.css}</style>${this.constructor.html}</body></html>`,"text/html").documentElement.querySelector("body");return lightelement_LightElement.processDomNode(this.#N,this,t),t}static register(){const t=Reflect.ownKeys(new this),e=t.filter((t=>!t.match(/^[#_]/))),s=e.map((t=>{const e=t;return[t.toLowerCase(),e]})),n=e.map((t=>t.toLowerCase())),i=Object.getOwnPropertyNames(this.prototype).filter((t=>"constructor"!=t&&"function"==typeof this.prototype[t])),r=class extends(this){constructor(t){super(t);for(let e of t.constructor.observedClassMembers){const t=this;let s=t[e];Object.defineProperty(t,e,{get:()=>s,set(n){s=n,t.update(`this.${e}`)},enumerable:!0,configurable:!0})}}},o=class extends LightElementShell{static _elementClass=r;static _attributesMapping=new Map(s);static _publicMethods=i;static get observedClassMembers(){return t}static get observedAttributes(){return n}setAttribute(t,e){"object"==typeof e&&null!==e?(super.setAttribute(t,LightElementShell.NonPrimitiveFlag),this.attributeChangedCallback(t,null,e)):super.setAttribute(t,e)}};window.customElements.define(this.tagName,o),this._registered=!0}static async load(t){return import(t)}static nodeToString(t){if(t.nodeType==Node.TEXT_NODE)return`\`${t.textContent}\``;if(t.nodeType==Node.ELEMENT_NODE){let e=[t.nodeName.toLowerCase()];for(const s of t.attributes)e.push(`${s.name}="${s.value}"`);return`<${e.join(" ")}>`}return t.nodeType==Node.COMMENT_NODE?`\x3c!-- ${t.textContent} --\x3e`:`${t}`}}window.LightElement=lightelement_LightElement})();