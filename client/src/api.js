const API_BASE = 'http://localhost:4000/api';


export async function api(path, opts = {}){
const token = localStorage.getItem('token');
opts.headers = opts.headers || {};
opts.headers['Content-Type'] = 'application/json';
if(token) opts.headers['Authorization'] = `Bearer ${token}`;
const res = await fetch(API_BASE + path, opts);
const json = await res.json();
if(!res.ok) throw json;
return json;
}


export const register = (body) => api('/register', { method: 'POST', body: JSON.stringify(body) });
export const login = (body) => api('/login', { method: 'POST', body: JSON.stringify(body) });
export const me = () => api('/me');
export const addEntry = (body) => api('/entries', { method: 'POST', body: JSON.stringify(body) });
export const listEntries = () => api('/entries');
export const balances = () => api('/balances');
