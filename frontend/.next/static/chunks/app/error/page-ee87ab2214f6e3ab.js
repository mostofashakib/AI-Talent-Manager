(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[933],{7518:function(t,e,r){Promise.resolve().then(r.bind(r,9300))},9300:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return W}});var n=r(7437),a=r(2265),i=r(1994),o=r(921),s=r(801),l=r(3004),u=r(9913);let p=(0,r(2813).ZP)(),c=(0,r(2095).Z)(),h=p("div",{name:"MuiContainer",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:r}=t;return[e.root,e[`maxWidth${(0,l.Z)(String(r.maxWidth))}`],r.fixed&&e.fixed,r.disableGutters&&e.disableGutters]}}),d=t=>(0,u.Z)({props:t,name:"MuiContainer",defaultTheme:c}),m=(t,e)=>{let{classes:r,fixed:n,disableGutters:a,maxWidth:i}=t,u={root:["root",i&&`maxWidth${(0,l.Z)(String(i))}`,n&&"fixed",a&&"disableGutters"]};return(0,s.Z)(u,t=>(0,o.ZP)(e,t),r)};var g=r(5657),f=r(6210),x=r(4119);let y=function(t={}){let{createStyledComponent:e=h,useThemeProps:r=d,componentName:o="MuiContainer"}=t,s=e(({theme:t,ownerState:e})=>({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",...!e.disableGutters&&{paddingLeft:t.spacing(2),paddingRight:t.spacing(2),[t.breakpoints.up("sm")]:{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}}}),({theme:t,ownerState:e})=>e.fixed&&Object.keys(t.breakpoints.values).reduce((e,r)=>{let n=t.breakpoints.values[r];return 0!==n&&(e[t.breakpoints.up(r)]={maxWidth:`${n}${t.breakpoints.unit}`}),e},{}),({theme:t,ownerState:e})=>({..."xs"===e.maxWidth&&{[t.breakpoints.up("xs")]:{maxWidth:Math.max(t.breakpoints.values.xs,444)}},...e.maxWidth&&"xs"!==e.maxWidth&&{[t.breakpoints.up(e.maxWidth)]:{maxWidth:`${t.breakpoints.values[e.maxWidth]}${t.breakpoints.unit}`}}}));return a.forwardRef(function(t,e){let a=r(t),{className:l,component:u="div",disableGutters:p=!1,fixed:c=!1,maxWidth:h="lg",classes:d,...g}=a,f={...a,component:u,disableGutters:p,fixed:c,maxWidth:h},x=m(f,o);return(0,n.jsx)(s,{as:u,ownerState:f,className:(0,i.Z)(x.root,l),ref:e,...g})})}({createStyledComponent:(0,f.ZP)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:r}=t;return[e.root,e["maxWidth".concat((0,g.Z)(String(r.maxWidth)))],r.fixed&&e.fixed,r.disableGutters&&e.disableGutters]}}),useThemeProps:t=>(0,x.Z)({props:t,name:"MuiContainer"})});var v=r(5002),b=r(3445);let Z=(0,r(9205).Z)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);var k=r(9376),w=t=>{let{statusCode:e,message:r}=t,a=(0,k.useRouter)();return(0,n.jsxs)(y,{maxWidth:"sm",className:"min-h-screen flex flex-col justify-center items-center text-center",children:[(0,n.jsx)(Z,{size:64,className:"text-red-500 mb-4"}),(0,n.jsx)(v.Z,{variant:"h4",component:"h1",gutterBottom:!0,children:"Oops! Something went wrong."}),(0,n.jsx)(v.Z,{variant:"body1",gutterBottom:!0,children:e?"An error ".concat(e," occurred on server"):"An error occurred on client"}),(0,n.jsx)(v.Z,{variant:"body2",color:"textSecondary",paragraph:!0,children:r||"We're sorry for the inconvenience. Please try again later."}),(0,n.jsx)(b.Z,{variant:"contained",color:"primary",onClick:()=>a.push("/"),className:"mt-4",children:"Go back to home"})]})},W=()=>(0,n.jsx)(w,{statusCode:500,message:"An unexpected error occurred."})},5002:function(t,e,r){"use strict";r.d(e,{Z:function(){return Z}});var n=r(2265),a=r(1994),i=r(801),o=r(4740),s=r(6210),l=r(8475),u=r(6125),p=r(5657),c=r(3858),h=r(4143),d=r(921);function m(t){return(0,d.ZP)("MuiTypography",t)}(0,h.Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var g=r(7437);let f={primary:!0,secondary:!0,error:!0,info:!0,success:!0,warning:!0,textPrimary:!0,textSecondary:!0,textDisabled:!0},x=(0,o.u7)(),y=t=>{let{align:e,gutterBottom:r,noWrap:n,paragraph:a,variant:o,classes:s}=t,l={root:["root",o,"inherit"!==t.align&&"align".concat((0,p.Z)(e)),r&&"gutterBottom",n&&"noWrap",a&&"paragraph"]};return(0,i.Z)(l,m,s)},v=(0,s.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:r}=t;return[e.root,r.variant&&e[r.variant],"inherit"!==r.align&&e["align".concat((0,p.Z)(r.align))],r.noWrap&&e.noWrap,r.gutterBottom&&e.gutterBottom,r.paragraph&&e.paragraph]}})((0,l.Z)(t=>{var e;let{theme:r}=t;return{margin:0,variants:[{props:{variant:"inherit"},style:{font:"inherit",lineHeight:"inherit",letterSpacing:"inherit"}},...Object.entries(r.typography).filter(t=>{let[e,r]=t;return"inherit"!==e&&r&&"object"==typeof r}).map(t=>{let[e,r]=t;return{props:{variant:e},style:r}}),...Object.entries(r.palette).filter((0,c.Z)()).map(t=>{let[e]=t;return{props:{color:e},style:{color:(r.vars||r).palette[e].main}}}),...Object.entries((null===(e=r.palette)||void 0===e?void 0:e.text)||{}).filter(t=>{let[,e]=t;return"string"==typeof e}).map(t=>{let[e]=t;return{props:{color:"text".concat((0,p.Z)(e))},style:{color:(r.vars||r).palette.text[e]}}}),{props:t=>{let{ownerState:e}=t;return"inherit"!==e.align},style:{textAlign:"var(--Typography-textAlign)"}},{props:t=>{let{ownerState:e}=t;return e.noWrap},style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},{props:t=>{let{ownerState:e}=t;return e.gutterBottom},style:{marginBottom:"0.35em"}},{props:t=>{let{ownerState:e}=t;return e.paragraph},style:{marginBottom:16}}]}})),b={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"};var Z=n.forwardRef(function(t,e){let{color:r,...n}=(0,u.i)({props:t,name:"MuiTypography"}),i=!f[r],o=x({...n,...i&&{color:r}}),{align:s="inherit",className:l,component:p,gutterBottom:c=!1,noWrap:h=!1,paragraph:d=!1,variant:m="body1",variantMapping:Z=b,...k}=o,w={...o,align:s,color:r,className:l,component:p,gutterBottom:c,noWrap:h,paragraph:d,variant:m,variantMapping:Z},W=p||(d?"p":Z[m]||b[m])||"span",j=y(w);return(0,g.jsx)(v,{as:W,ref:e,className:(0,a.Z)(j.root,l),...k,ownerState:w,style:{..."inherit"!==s&&{"--Typography-textAlign":s},...k.style}})})},9205:function(t,e,r){"use strict";r.d(e,{Z:function(){return l}});var n=r(2265);let a=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];return e.filter((t,e,r)=>!!t&&r.indexOf(t)===e).join(" ")};var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,n.forwardRef)((t,e)=>{let{color:r="currentColor",size:a=24,strokeWidth:s=2,absoluteStrokeWidth:l,className:u="",children:p,iconNode:c,...h}=t;return(0,n.createElement)("svg",{ref:e,...o,width:a,height:a,stroke:r,strokeWidth:l?24*Number(s)/Number(a):s,className:i("lucide",u),...h},[...c.map(t=>{let[e,r]=t;return(0,n.createElement)(e,r)}),...Array.isArray(p)?p:[p]])}),l=(t,e)=>{let r=(0,n.forwardRef)((r,o)=>{let{className:l,...u}=r;return(0,n.createElement)(s,{ref:o,iconNode:e,className:i("lucide-".concat(a(t)),l),...u})});return r.displayName="".concat(t),r}},9376:function(t,e,r){"use strict";var n=r(5475);r.o(n,"useRouter")&&r.d(e,{useRouter:function(){return n.useRouter}})}},function(t){t.O(0,[669,971,117,744],function(){return t(t.s=7518)}),_N_E=t.O()}]);