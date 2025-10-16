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
fastify.register(cors_1.default, { origin: "*" });
fastify.register(jwt_1.default, { secret: "sua_chave_secreta" });
const loginAccount = {
    email: "admin",
    pass: "admin",
};
fastify.decorate("auth", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield request.jwtVerify();
    }
    catch (error) {
        return reply.status(401).send({ error: "Token inválido ou não fornecido" });
    }
}));
fastify.post("/documents", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, formData, resumo, palavrasChave, referencias, capitulos, status, } = request.body;
    try {
        if (formData === null || formData === void 0 ? void 0 : formData.year) {
            const date = new Date(formData.year);
            if (!isNaN(date.getTime())) {
                formData.year = date;
            }
            else {
                delete formData.year;
            }
        }
        const document = yield prisma.document.create({
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
    }
    catch (error) {
        console.error("Erro ao criar documento:", error);
        return reply.status(500).send({
            error: "Erro interno ao criar o documento.",
            details: error.message,
        });
    }
}));
fastify.put("/document-change/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { formData, resumo, palavrasChave, referencias, capitulos, status } = request.body;
    console.log("Atualizando documento ID:", id, "com dados:", request.body);
    try {
        const updated = yield prisma.document.update({
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
    }
    catch (error) {
        console.error("Erro ao atualizar documento:", error);
        return reply
            .status(500)
            .send({ error: "Erro interno ao atualizar documento." });
    }
}));
fastify.post("/login", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pass } = request.body;
    if (email === loginAccount.email && pass === loginAccount.pass) {
        const token = fastify.jwt.sign({ email });
        return reply.status(200).send({ token });
    }
    else {
        return reply.status(401).send({ error: "E-mail ou senha inválidos!" });
    }
}));
fastify.delete("/document-delete/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    console.log("Tentando deletar documento com ID:", id);
    try {
        const deletedDocument = yield prisma.document.delete({
            where: { id },
        });
        return reply.status(200).send({
            message: "Documento deletado com sucesso!",
            document: deletedDocument,
        });
    }
    catch (error) {
        console.error("Erro ao deletar documento:", error);
        if (error.code === "P2025") {
            return reply.status(404).send({ error: "Documento não encontrado." });
        }
        return reply
            .status(500)
            .send({ error: "Erro interno ao deletar o documento." });
    }
}));
fastify.get("/document/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const doc = yield prisma.document.findUnique({
            where: { id },
        });
        if (!doc) {
            return reply.status(404).send({ error: "Documento não encontrado" });
        }
        return reply.send(doc);
    }
    catch (error) {
        console.error("Erro ao buscar documento:", error);
        return reply.status(500).send({ error: "Erro interno", details: error.message });
    }
}));
fastify.get("/documents", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const documents = yield prisma.document.findMany();
    return reply.send(documents);
}));
fastify.get("/profile", { preHandler: [fastify.auth] }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply.send({
        message: "Você acessou uma rota protegida!",
        user: request.user,
    });
}));
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
fastify.get("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply.send({ message: "Servidor ativo e rodando!" });
}));
start();
//# sourceMappingURL=server.js.map