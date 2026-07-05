import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod"; // Ensure zod is imported

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        mode: z.string(),
        chat: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
        emotionalStats: z.object({}).passthrough(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.conversation.create({
        data: {
          mode: input.mode == "SITUATIONAL" ? "SITUATIONAL" : "ZEN",
          userId: ctx.session.userId,
          emotionalStats: input.emotionalStats,
          chat: input.chat,
        },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.conversation.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.conversation.findMany({
      where: {
        userId: ctx.session.userId,
      },
    });
  }),
});
