"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const fastify = (0, fastify_1.default)({ logger: true });
// Configurar CORS para permitir requisições do frontend
fastify.register(cors_1.default, { origin: "*" });
// Configurar JWT
fastify.register(jwt_1.default, { secret: "sua_chave_secreta" }); // 🔑 Use uma chave forte!
// Credenciais fixas
const loginAccount = {
    email: "admin",
    pass: "admin",
};
// Middleware para proteger rotas autenticadas
fastify.decorate("auth", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield request.jwtVerify();
    }
    catch (error) {
        return reply.status(401).send({ error: "Token inválido ou não fornecido" });
    }
}));
fastify.post("/create-book", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, formData, resumo, palavrasChave, referencias, capitulos } = request.body;
    try {
        // Garante que o campo 'year' do formData seja convertido em Date
        if (formData.year && typeof formData.year === "string") {
            formData.year = new Date(formData.year);
        }
        const Document = yield prisma.document.create({
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
    }
    catch (error) {
        console.error("Erro ao criar o livro:", error);
        return reply.status(500).send({
            error: "Erro interno ao criar o livro.",
            details: error.message,
        });
    }
}));
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
fastify.post("/login", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pass } = request.body;
    // Verifica se as credenciais são válidas
    if (email === loginAccount.email && pass === loginAccount.pass) {
        const token = fastify.jwt.sign({ email });
        return reply.status(200).send({ token });
    }
    else {
        return reply.status(401).send({ error: "E-mail ou senha inválidos!" });
    }
}));
fastify.get("/documents", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const documents = yield prisma.document.findMany();
    return reply.send(documents);
}));
// 🔐 Rota protegida (apenas usuários logados podem acessar)
fastify.get("/profile", { preHandler: [fastify.auth] }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply.send({ message: "Você acessou uma rota protegida!", user: request.user });
}));
// Iniciar o servidor
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server running at http://localhost:3000");
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
