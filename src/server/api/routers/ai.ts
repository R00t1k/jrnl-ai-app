import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: env.OPENAI_KEY });

export const aiRouter = createTRPCRouter({
  rateEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      /* ❶ جلب الملاحظة */
      const entry = await ctx.db.entry.findFirst({
        where: { id: input.id },
        select: { content: true },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Entry ${input.id} not found`,
        });
      }

      /* ❷ استدعاء Chat Completions (gpt‑4o‑mini) */
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sentiment‑analysis assistant. Reply with a single integer from 1 (negative) to 10 (positive). Do not add any other text.",
          },
          { role: "user", content: entry.content },
        ],
        max_tokens: 2, // يكفي رقم مكوَّن من خانة أو خانتين
      });

      /* ❸ استخراج وتحقّق من النتيجة */
      const raw = completion.choices?.[0]?.message?.content?.trim() ?? "";
      const rating = Number.parseInt(raw, 10);

      if (Number.isNaN(rating) || rating < 1 || rating > 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid rating returned from OpenAI: "${raw}"`,
        });
      }

      /* ❹ تحديث قاعدة البيانات */
      await ctx.db.entry.update({
        where: { id: input.id },
        data: { moodRating: rating },
      });

      return { rating }; // يُرجَع للفرونت إن احتجت عرضه مباشرةً
    }),
});
