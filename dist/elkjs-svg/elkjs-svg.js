var elksvg=(()=>{var b=Object.create,a=Object.defineProperty,C=Object.getPrototypeOf,E=Object.prototype.hasOwnProperty,L=Object.getOwnPropertyNames,$=Object.getOwnPropertyDescriptor;var I=t=>a(t,"__esModule",{value:!0});var g=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),T=(t,e)=>{for(var r in e)a(t,r,{get:e[r],enumerable:!0})},k=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of L(e))!E.call(t,i)&&i!=="default"&&a(t,i,{get:()=>e[i],enumerable:!(r=$(e,i))||r.enumerable});return t},_=t=>k(I(a(t!=null?b(C(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var y=g((w,d)=>{"use strict";var o=class{constructor(){this.INDENTATION=2}indent(e){return" ".repeat(this.INDENTATION*e)}},u=class extends o{constructor(e){super();this.content=this._stripCommonIndentation(e)}_stripCommonIndentation(e){var r=0,i=!0;for(let s of e)if(!(i&&s==`
`)){if(s==" ")r+=1;else if(s=="	")r+=this.INDENTATION;else break;i=!1}return e.split(`
`).filter(s=>s.trim()).map(s=>s.slice(r)).join(`
`)}render(e=0){return this.content.split(`
`).map(r=>this.indent(e)+r).join(`
`)}},p=class extends o{constructor(e){super();this.child=e}render(e=0){var r=[];return r.push(`${this.indent(e)}<![CDATA[
`),r.push(this.child.render(e+1)),r.push(`
${this.indent(e)}]]>`),r.join("")}},h=class extends o{constructor(e,r={},i=[]){super();this.tagName=e,this.attributes=r,this.children=i}render(e=0){var r=Object.keys(this.attributes).map(l=>`${l}="${this.attributes[l]}"`).join(" "),i=this.children.length,s=[];if(s.push(`${this.indent(e)}<${this.tagName}${r?" "+r:""}`),this.children.length!=0){s.push(">"),s.push(`
`);for(let l of this.children)s.push(`${l.render(e+1)}
`);s.push(this.indent(e)),s.push(`</${this.tagName}>`)}else s.push(" />");return s.join("")}};undefined===d&&console.log(new h("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:104,height:104},[new h("defs",{},[new h("style",{type:"text/css"},[new p(new u(`
              rect {
                opacity: 0.8;
                fill: #6094CC;
                stroke-width: 1;
                stroke: #222222;
              }

              rect.port {
                opacity: 1;
                fill: #326CB2;
              }
            `))])]),new h("g",{transform:"translate(0,0)"},[new h("polyline",{points:"42,27 62,27",id:"e1",class:"edge"}),new h("polyline",{points:"42,37 52,37 52,77 62,77",id:"e2",class:"edge"}),new h("rect",{id:"n1",class:"node",x:"12",y:"17",width:"30",height:"30"}),new h("rect",{id:"n2",class:"node",x:"62",y:"12",width:"30",height:"30"}),new h("rect",{id:"n3",class:"node",x:"62",y:"62",width:"30",height:"30"})])]).render());w=d.exports={Xml:h,Text:u,Cdata:p}});var m=g((x,v)=>{"use strict";var{Xml:n,Text:f,Cdata:A}=y();function c(){this._style=`
    rect {
      opacity: 0.8;
      fill: #6094CC;
      stroke-width: 1;
      stroke: #222222;
    }
    rect.port {
      opacity: 1;
      fill: #326CB2;
    }
    text {
      font-size: 10px;
      font-family: sans-serif;
      /* in elk's coordinates "hanging" would be the correct value" */
      dominant-baseline: hanging;
      text-align: left;
    }
    g.port > text {
      font-size: 8px;
    }
    polyline {
      fill: none;
      stroke: black;
      stroke-width: 1;
    }
    path {
      fill: none;
      stroke: black;
      stroke-width: 1;
    }
  `,this._defs=new n("marker",{id:"arrow",markerWidth:"10",markerHeight:"8",refX:"10",refY:"4",orient:"auto"},[new n("path",{d:"M0,7 L10,4 L0,1 L0,7",style:"fill: #000000;"})]),this.reset()}c.prototype={constructor:c,reset(){this._edgeRoutingStyle={__global:"POLYLINE"},this._parentIds={},this._edgeParents={}},init(t){this.reset(),this.registerParentIds(t),this.registerEdges(t)},isDescendant(t,e){for(var r=e.id;this._parentIds[r];)if(r=this._parentIds[r],r==t.id)return!0;return!1},getOption(t,e){if(!!t){if(t.id)return t.id;var r=e.substr(e.lastIndexOf(".")+1);if(t[r])return t[r]}},registerParentIds(t){if(this._edgeParents[t.id]=[],t.properties){var e=this.getOption(t.properties);e&&(this._edgeRoutingStyle[t.id]=e)}(t.children||[]).forEach(r=>{this._parentIds[r.id]=t.id,this.registerParentIds(r)})},registerEdges(t){(t.edges||[]).forEach(e=>{e.sources.forEach(r=>{e.targets.forEach(i=>{r.includes(":")&&(r=r.slice(0,r.indexOf(":"))),this.isDescendant(r,i)||(r=this._parentIds[r]),this._edgeParents[r].push(e)})})}),(t.children||[]).forEach(e=>this.registerEdges(e))},renderRoot(t,e="DEFAULT",r="DEFAULT"){var i=[],s=[];return(e!=null||r!=null)&&(e!=null&&s.push(this.svgCss(e=="DEFAULT"?this._style:e)),r!=null&&s.push(r=="DEFAULT"?this._defs:new f(r)),i.push(new n("defs",{},s))),i.push(this.renderGraph(t)),new n("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:t.width||100,height:t.height||100},i)},renderGraph(t){var e=[];for(let i of this._edgeParents[t.id])e.push(this.renderEdge(i,t)),i.labels&&e.push(this.renderLabels(i.labels));for(let i of t.children)e.push(this.renderRect(i)),(i.ports||i.labels)&&e.push(this.renderPortsAndLabels(i)),i.children!=null&&i.children.length>0&&e.push(this.renderGraph(i));var r={};return(t.x||t.y)&&(r.transform=`translate(${t.x||0},${t.y||0})`),new n("g",r,e)},renderPortsAndLabels(t){var e=[];for(let r of t.ports)e.push(this.renderRect(r)),r.labels&&e.push(this.renderPort(r));if(t.labels)for(let r of t.labels)e.push(this.renderLabel(r));return new n("g",{transform:`translate(${t.x||0},${t.y||0})`},e)},renderRect(t){return new n("rect",{...this.idClass(t,"node"),...this.posSize(t),...this.style(t),...this.attributes(t)})},renderPort(t){return new n("g",{...this.idClass(t,"port"),transform:`translate(${t.x||0},${t.y||0})`},this.renderLabels(t.labels))},renderEdge(t,e){var r=this.getBends(t.sections);return this._edgeRoutingStyle[e.id]=="SPLINES"||this._edgeRoutingStyle.__global=="SPLINES"?this.renderPath(t,r):this.renderPolyline(t,r)},renderPath(t,e){return new n("path",{d:this.bendsToSpline(e),...this.idClass(t,"edge"),...this.style(t),...this.attributes(t)})},renderPolyline(t,e){return new n("polyline",{points:this.bendsToPolyline(e),...this.idClass(t,"edge"),...this.style(t),...this.attributes(t)})},getBends(t){var e=[];return t&&t.length>0&&t.forEach(r=>{r.startPoint&&e.push(r.startPoint),r.bendPoints&&(e=e.concat(r.bendPoints)),r.endPoint&&e.push(r.endPoint)}),e},renderLabels(t){return(t||[]).map(e=>this.renderLabel(e))},renderLabel(t){return new n("text",{...this.idClass(t,"label"),...this.posSize(t),...this.style(t),...this.attributes(t)},[new f(t.text)])},bendsToPolyline(t){return t.map(e=>`${e.x},${e.y}`).join(" ")},bendsToSpline(t){if(!t.length)return"";let{x:e,y:r}=t[0];points=[`M${e} ${r}`];for(let s=1;s<t.length;s=s+3){var i=t.length-s;i==1?points.push(`L${t[s].x+" "+t[s].y}`):i==2?(points.push(`Q${t[s].x+" "+t[s].y}`),points.push(t[s+1].x+" "+t[s+1].y)):(points.push(`C${t[s].x+" "+t[s].y}`),points.push(t[s+1].x+" "+t[s+1].y),points.push(t[s+2].x+" "+t[s+2].y))}return points.join(" ")},svgCss(t){return t==""?"":new n("style",{type:"text/css"},[new A(new f(t))])},posSize(t){return{x:t.x||0,y:t.y||0,width:t.width||0,height:t.height||0}},idClass(t,e){var r=Array.isArray(t.class)?t.class.join(" "):t.class,i=[r,e].filter(l=>l).join(" "),s={};return t.id&&(s.id=t.id),i&&(s.class=i),s},style(t){return t.style?{style:t.style}:{}},attributes(t){return t.attributes},toSvg(t,e="DEFAULT",r="DEFAULT"){this.init(t);var i=this.renderRoot(t,e,r);return i.render()}};x=v.exports={Renderer:c}});var N={};T(N,{Renderer:()=>P.Renderer});var P=_(m());return N;})();
