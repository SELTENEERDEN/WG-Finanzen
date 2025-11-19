import React, { useEffect, useState } from 'react'
import { me, login, register, addEntry, listEntries, balances } from './api'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'


export default function App(){
const [user, setUser] = useState(null);
const [members, setMembers] = useState([]);
const [entries, setEntries] = useState([]);


useEffect(() => {
const token = localStorage.getItem('token');
if(token) fetchMe();
}, []);


async function fetchMe(){
try{
const data = await me();
setUser(data.me);
setMembers(data.users);
const e = await listEntries();
setEntries(e);
} catch(err){
console.error(err);
localStorage.removeItem('token');
}
}


if(!user) return (
<div className="auth-root">
<h1>WG-Finanzen</h1>
<div className="auth-grid">
<Login onLogin={(t,u)=>{ localStorage.setItem('token', t); fetchMe(); }} />
<Register onRegister={(t,u)=>{ localStorage.setItem('token', t); fetchMe(); }} />
</div>
</div>
)


return (
<Dashboard user
