import 'dotenv/config';
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import bcrypt from 'bcryptjs';

const app = new Hono();

app.post('/api/register', async (c) => {
    try {
        const { username, password } = await c.req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.insert(users)
        .values({ username, password: hashedPassword })
        .returning({ id: users.id, username: users.username });

        return c.json({ success: true, data: newUser[0] }, 201);
    } catch (error) {
        return c.json({ success: false, message: 'Registrasi gagal' }, 400);
    }
});

app.get('/', (c) => {
    return c.html('<h1>Tim Pengembang</h1><h2>Nama Kalian</h2>');
});

const port = 3000;
console.log('🚀 Server is running on http://localhost:${port}');
serve({ fetch: app.fetch, port });