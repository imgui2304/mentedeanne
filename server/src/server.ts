// server.ts
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// ------------------------
// 1️⃣ Variáveis de ambiente
// ------------------------
const JWT_SECRET = process.env.JWT_SECRET || "meuSegredoSuperForte";

// ------------------------
// 2️⃣ Plugins
// ------------------------
fastify.register(cors, {
  origin: ["https://mentedeanne-2.onrender.com"], // seu frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.register(jwt, {
  secret: JWT_SECRET,
  sign: { expiresIn: "1h" },
});

// ------------------------
// 3️⃣ Middleware auth
// ------------------------
fastify.decorate(
  "auth",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.status(401).send({ error: "Token inválido ou não fornecido" });
    }
  }
);

// ------------------------
// 4️⃣ Credenciais fixas
// ------------------------
const loginAccount = { email: "admin", pass: "admin" };

// ------------------------
// 5️⃣ Rotas
// ------------------------

// Healthcheck
fastify.get("/", async () => ({ message: "Servidor ativo e rodando!" }));

// Login
fastify.post("/login", async (request, reply) => {
  const { email, pass } = request.body as { email: string; pass: string };

  if (email === loginAccount.email && pass === loginAccount.pass) {
    const token = fastify.jwt.sign({ email });
    return reply.send({ token });
  }

  return reply.status(401).send({ error: "E-mail ou senha inválidos!" });
});

// Exemplo de rota protegida


// CRUD de documentos
fastify.get("/documents", async () => prisma.document.findMany());

fastify.get("/document/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return reply.status(404).send({ error: "Documento não encontrado" });
  return doc;
});

fastify.post("/documents", async (request, reply) => {
  try {
    const data = request.body as any;
    const doc = await prisma.document.create({ data });
    return reply.status(201).send(doc);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.put("/document-change/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const data = request.body as any;
  try {
    const updated = await prisma.document.update({ where: { id }, data });
    return updated;
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

fastify.delete("/document-delete/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const deleted = await prisma.document.delete({ where: { id } });
    return { message: "Documento deletado", document: deleted };
  } catch (error: any) {
    if (error.code === "P2025")
      return reply.status(404).send({ error: "Documento não encontrado" });
    return reply.status(500).send({ error: error.message });
  }
});

// ------------------------
// 6️⃣ Start do servidor
// ------------------------
const start = async () => {
  try {
    await prisma.$connect(); // conecta ao banco antes de subir
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log("Servidor rodando!");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
