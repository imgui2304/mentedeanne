// server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// ------------------------
// Plugins
// ------------------------
fastify.register(cors, {
  origin: ["https://mentedeanne-2.onrender.com"], // front-end
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
// ------------------------
// Rotas
// ------------------------
fastify.get("/", async () => ({ message: "Servidor ativo e rodando!" }));

// Login simples (sem JWT)
const loginAccount = { email: "admin", pass: "admin" };
fastify.post("/login", async (request, reply) => {
  const { email, pass } = request.body as { email: string; pass: string };
  if (email === loginAccount.email && pass === loginAccount.pass) {
    return reply.send({ message: "Login bem-sucedido" });
  }
  return reply.status(401).send({ error: "E-mail ou senha inválidos!" });
});

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
    console.log("📥 BODY RECEBIDO:", request.body);

    const data = request.body as any;

    if (!data || typeof data !== "object") {
      console.error("Corpo da requisição inválido:", data);
      return reply.status(400).send({ error: "Body inválido" });
    }

    const doc = await prisma.document.create({ data });

    console.log("Documento criado com sucesso:", doc);
    return reply.status(201).send(doc);
  } catch (error: any) {
    console.error("Erro interno ao criar documento:", error);
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
// Start do servidor
// ------------------------
const start = async () => {
  try {
    await prisma.$connect();
    await fastify.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });
    console.log("Servidor rodando!");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
