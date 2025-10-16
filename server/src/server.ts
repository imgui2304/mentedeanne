import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Extend FastifyInstance to include the 'auth' property
declare module "fastify" {
  interface FastifyInstance {
    auth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}


const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: "https://mentedeanne-2.onrender.com", // ou '*' para qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});


// Credenciais fixas
const loginAccount = {
  email: "admin",
  pass: "admin",
};

// Middleware para proteger rotas autenticadas
fastify.decorate("auth", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ error: "Token inválido ou não fornecido" });
  }
});

fastify.post("/documents", async (request, reply) => {
  const {
    type,
    formData,
    resumo,
    palavrasChave,
    referencias,
    capitulos,
    status,
  } = request.body as {
    type: string;
    formData: any;
    resumo?: string;
    palavrasChave?: [];
    referencias?: [];
    capitulos?: [];
    status?: string;
  };

  try {
    // Converte o campo year (se existir)
    if (formData?.year) {
      const date = new Date(formData.year);
      if (!isNaN(date.getTime())) {
        formData.year = date;
      } else {
        // Remova o campo ou trate como quiser
        delete formData.year;
      }
    }

    // Cria o documento (rascunho ou finalizado)
    const document = await prisma.document.create({
      data: {
        type,
        formData,
        resumo,
        palavrasChave: palavrasChave || [],
        referencias,
        capitulos,
      },
    });

    return reply.status(201).send(document);
  } catch (error: any) {
    console.error("Erro ao criar documento:", error);
    return reply.status(500).send({
      error: "Erro interno ao criar o documento.",
      details: error.message,
    });
  }
});

fastify.put("/document-change/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { formData, resumo, palavrasChave, referencias, capitulos, status } =
    request.body as any;
    console.log("Atualizando documento ID:", id, "com dados:", request.body);

  try {
    const updated = await prisma.document.update({
      where: { id },
      data: {
        formData,
        resumo,
        palavrasChave,
        referencias,
        capitulos,
      
      },
    });

    return reply.status(200).send(updated);
  } catch (error: any) {
    console.error("Erro ao atualizar documento:", error);
    return reply
      .status(500)
      .send({ error: "Erro interno ao atualizar documento." });
  }
});

//   fastify.post("/create", async (request, reply) => {
//     console.log("Attempting to create user...");

//     try {
//         const user = await prisma.user.create({
//             data: {
//                 login: "admin",
//                 password: "admin"
//             }
//         });

//         console.log("User created:", user);
//         return reply.status(201).send(user);

//     } catch (error) {
//         console.error("Error creating user:", error);
//         return reply.status(500).send({ error: "Error creating user." });
//     }
// });
fastify.post("/login", async (request, reply) => {
  const { email, pass } = request.body as { email: string; pass: string };

  // Verifica se as credenciais são válidas
  if (email === loginAccount.email && pass === loginAccount.pass) {
    const token = fastify.jwt.sign({ email });

    return reply.status(200).send({ token });
  } else {
    return reply.status(401).send({ error: "E-mail ou senha inválidos!" });
  }
});
fastify.delete("/document-delete/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  console.log("Tentando deletar documento com ID:", id);

  try {
    const deletedDocument = await prisma.document.delete({
      where: { id },
    });

    return reply.status(200).send({
      message: "Documento deletado com sucesso!",
      document: deletedDocument,
    });
  } catch (error: any) {
    console.error("Erro ao deletar documento:", error);

    if (error.code === "P2025") {
      return reply.status(404).send({ error: "Documento não encontrado." });
    }

    return reply
      .status(500)
      .send({ error: "Erro interno ao deletar o documento." });
  }
});

fastify.get("/document/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const doc = await prisma.document.findUnique({
      where: { id },
    });
    if (!doc) {
      return reply.status(404).send({ error: "Documento não encontrado" });
    }
    return reply.send(doc);
  } catch (error: any) {
    console.error("Erro ao buscar documento:", error);
    return reply.status(500).send({ error: "Erro interno", details: error.message });
  }
});
fastify.get("/documents", async (request, reply) => {
  const documents = await prisma.document.findMany();
  return reply.send(documents);
});
// 🔐 Rota protegida (apenas usuários logados podem acessar)
fastify.get(
  "/profile",
  { preHandler: [fastify.auth] },
  async (request, reply) => {
    return reply.send({
      message: "Você acessou uma rota protegida!",
      user: request.user,
    });
  }
);

// Iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });

    console.log("Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
fastify.get("/", async (request, reply) => {
  return reply.send({ message: "Servidor ativo e rodando!" });
});

start();
