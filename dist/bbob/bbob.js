"use strict";var BBob=(()=>{var Ne=Object.create;var gt=Object.defineProperty;var Se=Object.getOwnPropertyDescriptor;var Oe=Object.getOwnPropertyNames;var be=Object.getPrototypeOf,Le=Object.prototype.hasOwnProperty;var _t=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),ye=(t,e)=>{for(var s in e)gt(t,s,{get:e[s],enumerable:!0})},Yt=(t,e,s,S)=>{if(e&&typeof e=="object"||typeof e=="function")for(let A of Oe(e))!Le.call(t,A)&&A!==s&&gt(t,A,{get:()=>e[A],enumerable:!(S=Se(e,A))||S.enumerable});return t};var Nt=(t,e,s)=>(s=t!=null?Ne(be(t)):{},Yt(e||!t||!t.__esModule?gt(s,"default",{value:t,enumerable:!0}):s,t)),me=t=>Yt(gt({},"__esModule",{value:!0}),t);var Ot=_t((St,jt)=>{(function(t,e){typeof St=="object"&&typeof jt<"u"?e(St):typeof define=="function"&&define.amd?define(["exports"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.BbobPluginHelper={}))})(St,function(t){"use strict";let e=`
`,s="	",S="\f",A="\r",m="=",l='"',Y=" ",C="[",u="]",O="/",f="\\",g=o=>typeof o=="object"&&!!o.tag,K=o=>typeof o=="string",Z=o=>o===e,F=(o,c,T)=>Object.keys(o).reduce(c,T),H=o=>g(o)?o.content.reduce((c,T)=>c+H(T),0):K(o)?o.length:0,b=(o,c)=>{o.content.push(c)},tt=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;").replace(/(javascript|data|vbscript):/gi,"$1%3A"),et=(o,c)=>{let T=typeof c,P={boolean:()=>c?`${o}`:"",number:()=>`${o}="${c}"`,string:()=>`${o}="${tt(c)}"`,object:()=>`${o}="${tt(JSON.stringify(c))}"`};return P[T]?P[T]():""},ut=o=>o==null?"":F(o,(c,T)=>[...c,et(T,o[T])],[""]).join(" "),At=o=>F(o,(c,T)=>o[T]===T?o[T]:null,null),Rt=(o,c)=>{let T=At(c);if(T){let P=et(o,T),rt={...c};delete rt[T];let ot=ut(rt);return`${P}${ot}`}return`${o}${ut(c)}`};class v{attr(c,T){return typeof T<"u"&&(this.attrs[c]=T),this.attrs[c]}append(c){return b(this,c)}get length(){return H(this)}toTagStart({openTag:c=C,closeTag:T=u}={}){let P=Rt(this.tag,this.attrs);return`${c}${P}${T}`}toTagEnd({openTag:c=C,closeTag:T=u}={}){return`${c}${O}${this.tag}${T}`}toTagNode(){return new v(this.tag.toLowerCase(),this.attrs,this.content)}toString({openTag:c=C,closeTag:T=u}={}){let P=this.content.length===0,rt=this.content.reduce((Ct,Et)=>Ct+Et.toString({openTag:c,closeTag:T}),""),ot=this.toTagStart({openTag:c,closeTag:T});return P?ot:`${ot}${rt}${this.toTagEnd({openTag:c,closeTag:T})}`}constructor(c,T,P){this.tag=c,this.attrs=T,this.content=Array.isArray(P)?P:[P]}}v.create=(o,c={},T=[])=>new v(o,c,T),v.isOf=(o,c)=>o.tag===c,t.BACKSLASH=f,t.CLOSE_BRAKET=u,t.EQ=m,t.F=S,t.N=e,t.OPEN_BRAKET=C,t.QUOTEMARK=l,t.R=A,t.SLASH=O,t.SPACE=Y,t.TAB=s,t.TagNode=v,t.appendToNode=b,t.attrValue=et,t.attrsToString=ut,t.escapeHTML=tt,t.getNodeLength=H,t.getUniqAttr=At,t.isEOL=Z,t.isStringNode=K,t.isTagNode=g})});var Qt=_t((bt,It)=>{(function(t,e){typeof bt=="object"&&typeof It<"u"?e(bt,Ot()):typeof define=="function"&&define.amd?define(["exports","@bbob/plugin-helper"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.BbobParser={},t.pluginHelper))})(bt,function(t,e){"use strict";let s="type",S="value",A="row",m="line",g=n=>n&&typeof n[S]<"u"?n[S]:"",K=n=>n&&n[m]||0,Z=n=>n&&n[A]||0,F=n=>n&&typeof n[s]<"u"?n[s]===5||n[s]===6||n[s]===1:!1,H=n=>n&&typeof n[s]<"u"?n[s]===2:!1,b=n=>g(n).charCodeAt(0)===e.SLASH.charCodeAt(0),tt=n=>!b(n),et=n=>n&&typeof n[s]<"u"?n[s]===3:!1,ut=n=>n&&typeof n[s]<"u"?n[s]===4:!1,At=n=>{let a=g(n);return b(n)?a.slice(1):a},Rt=n=>{let a=e.OPEN_BRAKET;return a+=g(n),a+=e.CLOSE_BRAKET,a};class v{isEmpty(){return isNaN(this[s])}isText(){return F(this)}isTag(){return H(this)}isAttrName(){return et(this)}isAttrValue(){return ut(this)}isStart(){return tt(this)}isEnd(){return b(this)}getName(){return At(this)}getValue(){return g(this)}getLine(){return K(this)}getColumn(){return Z(this)}toString(){return Rt(this)}constructor(a,E,M,j){this[s]=Number(a),this[S]=String(E),this[m]=Number(M),this[A]=Number(j)}}let o=1,c=2,T=3,P=4,rt=5,ot=6;function Ct(n,a){let E={pos:0,len:n.length},M=_=>{let{pos:L}=E,p=n.indexOf(_,L);return p>=0?n.substring(L,p):""},j=_=>n.indexOf(_,E.pos)>=0,I=()=>E.len>E.pos,Q=()=>E.pos===E.len,it=(_=1,L)=>{E.pos+=_,a&&a.onSkip&&!L&&a.onSkip()},x=()=>n.substring(E.pos),k=(_=0)=>n.substring(E.pos,E.pos+_),G=()=>n[E.pos],$=()=>{let _=E.pos-1;return typeof n[_]<"u"?n[_]:null},q=()=>{let _=E.pos+1;return _<=n.length-1?n[_]:null},B=(_,L)=>{let p=0;if(I())for(p=E.pos;I()&&_(G());)it(1,L);return n.substring(p,E.pos)};this.skip=it,this.hasNext=I,this.getCurr=G,this.getRest=x,this.getNext=q,this.getPrev=$,this.isLast=Q,this.includes=j,this.grabWhile=B,this.grabN=k,this.substrUntilChar=M}let Et=(n,a)=>new Ct(n,a),ne=(n,a)=>{for(;n.charAt(0)===a;)n=n.substring(1);for(;n.charAt(n.length-1)===a;)n=n.substring(0,n.length-1);return n},se=n=>n.replace(e.BACKSLASH+e.QUOTEMARK,e.QUOTEMARK);function re(n=[]){let a=n,E=()=>Array.isArray(a)&&a.length>0&&typeof a[a.length-1]<"u"?a[a.length-1]:null,M=()=>a.length?a.pop():!1,j=Q=>a.push(Q),I=()=>a;this.push=j,this.toArray=I,this.getLast=E,this.flushLast=M}let lt=(n=[])=>new re(n),oe="!",ie=(n,a,E=0,M=0)=>new v(n,a,E,M);function ce(n,a={}){let x=0,k=0,G=-1,$=0,q=0,B="",_=new Array(Math.floor(n.length)),L=a.openTag||e.OPEN_BRAKET,p=a.closeTag||e.CLOSE_BRAKET,dt=!!a.enableEscapeTags,z=a.contextFreeTags||[],Pt=a.onToken||(()=>{}),pt=[p,L,e.QUOTEMARK,e.BACKSLASH,e.SPACE,e.TAB,e.EQ,e.N,oe],Kt=[L,e.SPACE,e.TAB,e.N],Wt=[e.SPACE,e.TAB],wt=[e.EQ,e.SPACE,e.TAB],ft=i=>pt.indexOf(i)>=0,r=i=>i===e.N,d=i=>Wt.indexOf(i)>=0,N=i=>Kt.indexOf(i)===-1,J=i=>wt.indexOf(i)>=0,nt=i=>i===L||i===p||i===e.BACKSLASH,$t=i=>i===e.BACKSLASH,Bt=()=>{k++},Dt=i=>se(ne(i,e.QUOTEMARK)),Ut=(i,y)=>{B!==""&&y&&(B=""),B===""&&z.includes(i)&&(B=i)},h=Et(n,{onSkip:Bt});function W(i,y){let R=ie(i,y,x,k);Pt(R),G+=1,_[G]=R}function ae(i,y){if(q===1){let U=ht=>!(ht===e.EQ||d(ht)),st=i.grabWhile(U),ct=i.isLast(),at=i.getCurr()!==e.EQ;return i.skip(),ct||at?W(P,Dt(st)):W(T,st),ct?0:at?1:2}if(q===2){let U=!1,st=at=>{let ht=at===e.QUOTEMARK,le=i.getPrev(),Vt=i.getNext(),de=le===e.BACKSLASH,he=Vt===e.EQ,ge=d(at),_e=d(Vt);return U&&J(at)?!0:ht&&!de&&(U=!U,!U&&!(he||_e))?!1:y?!0:ge===!1},ct=i.grabWhile(st);return i.skip(),W(P,Dt(ct)),i.isLast()?0:1}let R=U=>!(U===e.EQ||d(U)||i.isLast()),D=i.grabWhile(R);return W(c,D),Ut(D),i.skip(),y?2:i.includes(e.EQ)?1:2}function Te(){let i=h.getCurr(),y=h.getNext();h.skip();let R=h.substrUntilChar(p),D=R.length===0||R.indexOf(L)>=0;if(ft(y)||D||h.isLast())return W(o,i),0;let X=R.indexOf(e.EQ)===-1,U=R[0]===e.SLASH;if(X||U){let st=h.grabWhile(ct=>ct!==p);return h.skip(),W(c,st),Ut(st,U),0}return 2}function ue(){let y=h.grabWhile(X=>X!==p,!0),R=Et(y,{onSkip:Bt}),D=R.includes(e.SPACE);for(q=0;R.hasNext();)q=ae(R,!D);return h.skip(),0}function fe(){if(r(h.getCurr()))return W(ot,h.getCurr()),h.skip(),k=0,x++,0;if(d(h.getCurr())){let y=h.grabWhile(d);return W(rt,y),0}if(h.getCurr()===L){if(B){let y=L.length+e.SLASH.length+B.length,R=`${L}${e.SLASH}${B}`;if(h.grabN(y)===R)return 1}else if(h.includes(p))return 1;return W(o,h.getCurr()),h.skip(),0}if(dt){if($t(h.getCurr())){let D=h.getCurr(),X=h.getNext();return h.skip(),nt(X)?(h.skip(),W(o,X),0):(W(o,D),0)}let y=D=>N(D)&&!$t(D),R=h.grabWhile(y);return W(o,R),0}let i=h.grabWhile(N);return W(o,i),0}function Ae(){for($=0;h.hasNext();)switch($){case 1:$=Te();break;case 2:$=ue();break;case 0:default:$=fe();break}return _.length=G+1,_}function Ee(i){let y=L+e.SLASH+i.getValue();return n.indexOf(y)>-1}return{tokenize:Ae,isTokenNested:Ee}}let Gt=(n,a={})=>{let E=a,M=E.openTag||e.OPEN_BRAKET,j=E.closeTag||e.CLOSE_BRAKET,I=(E.onlyAllowTags||[]).filter(Boolean).map(r=>r.toLowerCase()),Q=null,it=lt(),x=lt(),k=lt(),G=lt(),$=new Set,q=r=>{let d=r.getValue();return!$.has(d)&&Q.isTokenNested&&Q.isTokenNested(r)?($.add(d),!0):$.has(d)},B=r=>Boolean($.has(r)),_=r=>I.length?I.indexOf(r.toLowerCase())>=0:!0,L=()=>{k.flushLast()&&G.flushLast()},p=()=>{let r=x.getLast();return r&&Array.isArray(r.content)?r.content:it.toArray()},dt=(r,d=!0)=>{let N=p();Array.isArray(N)&&(N.push(r.toTagStart({openTag:M,closeTag:j})),r.content.length&&(r.content.forEach(J=>{N.push(J)}),d&&N.push(r.toTagEnd({openTag:M,closeTag:j}))))},z=r=>{let d=p();Array.isArray(d)&&(e.isTagNode(r)?_(r.tag)?d.push(r.toTagNode()):dt(r):d.push(r))},Pt=r=>{L();let d=e.TagNode.create(r.getValue()),N=q(r);k.push(d),N?x.push(d):z(d)},pt=r=>{L();let d=x.flushLast();if(d)z(d);else if(typeof E.onError=="function"){let N=r.getValue(),J=r.getLine(),nt=r.getColumn();E.onError({message:`Inconsistent tag '${N}' on line ${J} and column ${nt}`,tagName:N,lineNumber:J,columnNumber:nt})}},Kt=r=>{r.isStart()&&Pt(r),r.isEnd()&&pt(r)},Wt=r=>{let d=k.getLast(),N=r.getValue(),J=B(r);if(d)if(r.isAttrName())G.push(N),d.attr(G.getLast(),"");else if(r.isAttrValue()){let nt=G.getLast();nt?(d.attr(nt,N),G.flushLast()):d.attr(N,N)}else r.isText()?J?d.append(N):z(N):r.isTag()&&z(r.toString());else r.isText()?z(N):r.isTag()&&z(r.toString())},wt=r=>{r.isTag()?Kt(r):Wt(r)};Q=(a.createTokenizer?a.createTokenizer:ce)(n,{onToken:wt,openTag:M,closeTag:j,onlyAllowTags:E.onlyAllowTags,contextFreeTags:E.contextFreeTags,enableEscapeTags:E.enableEscapeTags}),Q.tokenize();let ft=x.flushLast();return ft&&B(ft.tag)&&dt(ft,!1),it.toArray()};Object.defineProperty(t,"TagNode",{enumerable:!0,get:function(){return e.TagNode}}),t.default=Gt,t.parse=Gt,Object.defineProperty(t,"__esModule",{value:!0})})});var kt=_t((Lt,xt)=>{(function(t,e){typeof Lt=="object"&&typeof xt<"u"?e(Lt,Qt()):typeof define=="function"&&define.amd?define(["exports","@bbob/parser"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.BbobCore={},t.parser))})(Lt,function(t,e){"use strict";let s=u=>typeof u=="object",S=u=>typeof u=="boolean";function A(u,O){let f=u;if(Array.isArray(f))for(let g=0;g<f.length;g++)f[g]=A(O(f[g]),O);else f&&s(f)&&f.content&&A(f.content,O);return f}function m(u,O){return typeof u!=typeof O?!1:!s(u)||u===null?u===O:Array.isArray(u)?u.every(f=>[].some.call(O,g=>m(f,g))):Object.keys(u).every(f=>{let g=O[f],K=u[f];return s(K)&&K!==null&&g!==null?m(K,g):S(K)?K!==(g===null):g===K})}function l(u,O){return Array.isArray(u)?A(this,f=>{for(let g=0;g<u.length;g++)if(m(u[g],f))return O(f);return f}):A(this,f=>m(u,f)?O(f):f)}function Y(u){return A(this,u)}function C(u){let O=typeof u=="function"?[u]:u||[],f={skipParse:!1};return{process(g,K){f=K||{};let Z=f.parser||e.parse,F=f.render,H=f.data||null;if(typeof Z!="function")throw new Error('"parser" is not a function, please pass to "process(input, { parser })" right function');let b=f.skipParse?g||[]:Z(g,f),tt=b;return b.messages=[],b.options=f,b.walk=Y,b.match=l,O.forEach(et=>{b=et(b,{parse:Z,render:F,iterate:A,match:l,data:H})||b}),{get html(){if(typeof F!="function")throw new Error('"render" function not defined, please pass to "process(input, { render })"');return F(b,b.options)},tree:b,raw:tt,messages:b.messages}}}}t.default=C,Object.defineProperty(t,"__esModule",{value:!0})})});var Xt=_t((mt,Jt)=>{(function(t,e){typeof mt=="object"&&typeof Jt<"u"?e(mt):typeof define=="function"&&define.amd?define(["exports"],e):(t=typeof globalThis<"u"?globalThis:t||self,e(t.BbobPreset={}))})(mt,function(t){"use strict";let e=A=>typeof A=="object"&&!!A.tag;function s(A,m,l,Y){m.walk(C=>e(C)&&A[C.tag]?A[C.tag](C,l,Y):C)}function S(A,m=s){let l=(Y={})=>{l.options=Object.assign(l.options||{},Y);let C=(u,O)=>m(A,u,O,l.options);return C.options=l.options,C};return l.extend=Y=>S(Y(A,l.options),m),l}t.createPreset=S,t.default=S,Object.defineProperty(t,"__esModule",{value:!0})})});var Ge={};ye(Ge,{bbobHTML:()=>zt,presetHTML5:()=>ee});var qt=Nt(kt()),Mt=Nt(Ot()),Re="/>",Ce="</",Ft="<",vt=">",Pe=(t,{stripTags:e=!1})=>{if(!t)return"";let s=typeof t;return s==="string"||s==="number"?t:s==="object"?e===!0?yt(t.content,{stripTags:e}):t.content===null?[Ft,t.tag,(0,Mt.attrsToString)(t.attrs),Re].join(""):[Ft,t.tag,(0,Mt.attrsToString)(t.attrs),vt,yt(t.content),Ce,t.tag,vt].join(""):Array.isArray(t)?yt(t,{stripTags:e}):""},yt=(t,{stripTags:e=!1}={})=>[].concat(t).reduce((s,S)=>s+Pe(S,{stripTags:e}),""),pe=(t,e,s)=>(0,qt.default)(e).process(t,{...s,render:yt}).html;var zt=pe;var te=Nt(Xt());var w=Nt(Ot()),Ke=(t,e)=>t[0]===e,Zt={color:t=>`color:${t};`,size:t=>`font-size:${t};`},We=t=>Object.keys(t).reduce((e,s)=>Zt[s]?e.concat(Zt[s](t[s])):e,[]).join(" "),we=t=>{let e=0,s=[],S=()=>w.TagNode.create("li"),A=l=>{s[e]=s[e]||l},m=l=>{s[e]&&s[e].content?s[e].content=s[e].content.concat(l):s[e]=s[e].concat(l)};return t.forEach(l=>{(0,w.isStringNode)(l)&&Ke(l,"*")?(s[e]&&e++,A(S()),m(l.substr(1))):(0,w.isTagNode)(l)&&w.TagNode.isOf(l,"*")?(s[e]&&e++,A(S())):(0,w.isTagNode)(s[e])?s[e]?m(l):A(l):(e++,A(l))}),[].concat(s)},Me=(t,e)=>(0,w.getUniqAttr)(t.attrs)?(0,w.getUniqAttr)(t.attrs):e(t.content),V=(t,e,s)=>({tag:t,attrs:e,content:s}),Tt=t=>({style:t}),Ht={b:t=>V("span",Tt("font-weight: bold;"),t.content),i:t=>V("span",Tt("font-style: italic;"),t.content),u:t=>V("span",Tt("text-decoration: underline;"),t.content),s:t=>V("span",Tt("text-decoration: line-through;"),t.content),url:(t,{render:e},s)=>V("a",{href:Me(t,e,s)},t.content),img:(t,{render:e})=>V("img",{src:e(t.content)},null),quote:t=>V("blockquote",{},[V("p",{},t.content)]),code:t=>V("pre",{},t.content),style:t=>V("span",Tt(We(t.attrs)),t.content),list:t=>{let e=(0,w.getUniqAttr)(t.attrs);return V(e?"ol":"ul",e?{type:e}:{},we(t.content))},color:t=>V("span",Tt(`color: ${(0,w.getUniqAttr)(t.attrs)};`),t.content)};var ee=(0,te.createPreset)(Ht);return me(Ge);})();