const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');


const SECRET = process.env.JWT_SECRET || 'DEV_SECRET_CHANGE_ME';
const PORT = process.env.PORT || 4000;


const app = express();
app.use(cors());
app.use(bodyParser.json());


const adapter = new JSONFile('./data/db.json');
const db = new Low(adapter);


async function initDB(){
await db.read();
db.data = db.data || { users: [], entries: [] };
await db.write();
}
initDB();


function authMiddleware(req, res, next){
const auth = req.headers.authorization;
if(!auth) return res.status(401).json({ error: 'missing auth' });
const token = auth.replace('Bearer ', '');
try{
const payload = jwt.verify(token, SECRET);
req.user = payload;
next();
} catch(e){
return res.status(401).json({ error: 'invalid token' });
}
}


// register
app.post('/api/register', async (req, res) => {
const { name, email, password } = req.body;
if(!name || !password) return res.status(400).json({ error: 'name & password required' });
await db.read();
if(db.data.users.find(u => u.email === email)) return res.status(400).json({ error: 'email exists' });
const hash = await bcrypt.hash(password, 10);
const user = { id: nanoid(), name, email: email || null, passwordHash: hash, createdAt: Date.now() };
db.data.users.push(user);
await db.write();
const token = jwt.sign({ id: user.id, name: user.name }, SECRET);
res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});


// login
app.post('/api/login', async (req, res) => {
const { email, password } = req.body;
await db.read();
const user = db.data.users.find(u => u.email === email);
if(!user) return res.status(400).json({ error: 'invalid creds' });
const ok = await bcrypt.compare(password, user.passwordHash);
if(!ok) return res.status(400).json({ error: 'invalid creds' });
const token = jwt.sign({ id: user.id, name: user.name }, SECRET);
res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});


// get current user + members
app.get('/api/me', authMiddleware, async (req, res) => {
await db.read();
const users = db.data.users.map(u => ({ id: u.id, name: u.name, email: u.email }));
const me = users.find(u => u.id === req.user.id);
res.json({ me, users });
});


// add entry (expense or settlement)
app.post('/api/entries', authMiddleware, async (req, res) => {
const { title, items, amount, date, sharedWith, type } = req.body;
if(!title || !amount) return res.status(400).json({ error: 'title and amount required' });
await db.read();
const entry = {
id: nanoid(),
title,
items: items || null,
amount: Number(amount),
date: date || new Date().toISOString(),
buyerId: req.user.id,
app.listen(PORT, () => console.log('Server running on', PORT));
