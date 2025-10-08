import{c as r,j as e,F as a}from"./index.js";import{C as t,P as l}from"./PageHeading.js";import{B as d}from"./button.js";import{T as h,a as m,b as x,c,d as s,e as j,f as o,g as f}from"./table.js";import{C as b,a as g,b as p}from"./checkbox.js";import"./attr.js";import"./use-field-context.js";/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],O=r("check",y);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],C=r("clock",u);/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],v=r("plus",k),i=[{id:1,name:"OOO Сатурн",inn:8700000887,contract:8763467887,confirmed:!0,active:!1},{id:2,name:"OOO Юпитер",inn:9500000700,contract:9522578700,confirmed:!0,active:!0},{id:3,name:"OOO Венера",inn:2300000654,contract:2300088654,confirmed:!0,active:!1},{id:4,name:"OOO Меркурий",inn:4400000688,contract:4400996688,confirmed:!0,active:!1},{id:5,name:"OOO Солнышко",inn:1200000890,contract:1234567890,confirmed:!1,active:!1},{id:6,name:"OOO Нептун",inn:7980000021,contract:987654321,confirmed:!1,active:!1}],w=()=>e.jsxs(t,{children:[e.jsxs(a,{direction:{base:"column",md:"row"},gap:"4",justify:"space-between",children:[e.jsx(l,{children:"Мои юр.лица"}),e.jsxs(d,{size:"sm",children:[e.jsx(v,{}),"Добавить юр.лицо"]})]}),e.jsx(h,{children:e.jsxs(m,{size:"sm",borderWidth:"1px",minW:"48rem",children:[e.jsx(x,{children:e.jsxs(c,{children:[e.jsx(s,{fontWeight:"semibold",bgColor:"gray.100",children:"Название"}),e.jsx(s,{fontWeight:"semibold",bgColor:"gray.100",children:"ИНН"}),e.jsx(s,{fontWeight:"semibold",bgColor:"gray.100",children:"Номер договора"}),e.jsx(s,{fontWeight:"semibold",bgColor:"gray.100",children:"Подтверждено"}),e.jsx(s,{fontWeight:"semibold",bgColor:"gray.100",children:"Активное сейчас"})]})}),e.jsx(j,{children:i.map(n=>e.jsxs(c,{children:[e.jsx(o,{children:n.name}),e.jsx(o,{children:n.inn}),e.jsx(o,{children:n.contract}),e.jsx(o,{children:n.confirmed?e.jsx(O,{size:20}):e.jsx(C,{size:20})}),e.jsx(o,{children:e.jsxs(b,{checked:n.active,readOnly:!0,children:[e.jsx(g,{}),e.jsx(p,{})]})})]},n.id))}),e.jsx(f,{children:e.jsx(c,{children:e.jsxs(o,{colSpan:5,fontWeight:"semibold",bgColor:"gray.100",children:["Итого: ",i.length," юр.лиц"]})})})]})})]});export{w as default};
