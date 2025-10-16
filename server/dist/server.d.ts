declare module "fastify" {
    interface FastifyInstance {
        auth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
export {};
