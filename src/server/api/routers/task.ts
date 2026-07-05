import { get } from "http";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getCompletedTask: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    return ctx.db.task.findMany({
      where: {
        userId: userId,
        accepted: true,
        dateCompleted: {
          not: null,
        },
      },
      orderBy: {
        dateAssigned: "desc",
      },
    });
  }),
  getUncompletedTask: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;
    return ctx.db.task.findMany({
      where: {
        userId: userId,
        accepted: true,
        dateCompleted: {
          equals: null,
        },
      },
      orderBy: {
        dateAssigned: "desc",
      },
    });
  }),
  acceptTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          accepted: true,
          dateAssigned: new Date(),
        },
      });
    }),
  completeTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (transaction) => {
        await transaction.user.update({
          where: {
            id: ctx.session.userId,
          },
          data: {
            points: {
              increment: 1,
            },
          },
        });
        return await transaction.task.update({
          where: {
            id: input.id,
          },
          data: {
            // accepted: true,
            dateCompleted: new Date(),
          },
        });
      });
    }),
  unCompleteTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (transaction) => {
        await transaction.user.update({
          where: {
            id: ctx.session.userId,
          },
          data: {
            points: {
              decrement: 1,
            },
          },
        });
        return await transaction.task.update({
          where: {
            id: input.id,
          },
          data: {
            // accepted: true,
            dateCompleted: null,
          },
        });
      });
    }),
});
