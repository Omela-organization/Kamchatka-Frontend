(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[156],{1814:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/LoginPage",function(){return n(2813)}])},2813:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return i}});var r=n(5893),s=n(7294),a=n(1163);async function o(e,t){let n=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})});if(!n.ok)throw Error("Ошибка входа");return n.json()}var i=()=>{let[e,t]=(0,s.useState)(""),[n,i]=(0,s.useState)(""),[u,c]=(0,s.useState)(""),l=(0,a.useRouter)(),d=async t=>{t.preventDefault();try{let t=await o(e,n);localStorage.setItem("accessToken",t.accessToken),l.push("/dashboard")}catch(e){c("Неверное имя пользователя или пароль"),console.error("Ошибка входа:",e)}};return(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{children:"Вход в систему"}),(0,r.jsxs)("form",{onSubmit:d,children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{htmlFor:"username",children:"Имя пользователя:"}),(0,r.jsx)("input",{type:"text",id:"username",value:e,onChange:e=>t(e.target.value),required:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{htmlFor:"password",children:"Пароль:"}),(0,r.jsx)("input",{type:"password",id:"password",value:n,onChange:e=>i(e.target.value),required:!0})]}),u&&(0,r.jsx)("p",{style:{color:"red"},children:u}),(0,r.jsx)("button",{type:"submit",children:"Войти"})]})]})}},1163:function(e,t,n){e.exports=n(6036)}},function(e){e.O(0,[888,774,179],function(){return e(e.s=1814)}),_N_E=e.O()}]);