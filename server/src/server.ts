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

// Configurar CORS para permitir requisições do frontend
fastify.register(cors, { origin: "*" });

// Configurar JWT
fastify.register(jwt, { secret: "sua_chave_secreta" }); // 🔑 Use uma chave forte!

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

fastify.post("/create-book", async (request, reply) => {
  const { type, formData, resumo, palavrasChave, referencias, capitulos } = request.body as {
    type: string;
    formData: any;
    resumo: string;
    palavrasChave: [];
    referencias: [];
    capitulos: [];
  };

  try {
    // Garante que o campo 'year' do formData seja convertido em Date
    if (formData.year && typeof formData.year === "string") {
      formData.year = new Date(formData.year);
    }

    const Document = await prisma.document.create({
      data: {
        type,
        formData,
        resumo,
        palavrasChave,
        referencias,
        capitulos,
      },
    });

    return reply.status(201).send(Document);
  } catch (error: any) {
    console.error("Erro ao criar o livro:", error);
    return reply.status(500).send({
      error: "Erro interno ao criar o livro.",
      details: error.message,
    });
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
fastify.get("/documents", async (request, reply) => {
  const documents = await prisma.document.findMany();
  return reply.send(documents);

})
// 🔐 Rota protegida (apenas usuários logados podem acessar)
fastify.get("/profile", { preHandler: [fastify.auth] }, async (request, reply) => {
  return reply.send({ message: "Você acessou uma rota protegida!", user: request.user });
});

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
fastify.get('/', async (request, reply) => {
  return reply.send({ message: "Servidor ativo e rodando!" });
});

start();
