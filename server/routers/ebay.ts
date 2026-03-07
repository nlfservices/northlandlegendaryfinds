import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { searchEbayListings, testEbayConnection } from "../ebay";

export const ebayRouter = router({
  /**
   * Search eBay for price comps on trading cards.
   * Returns active listing prices with low/avg/high summary.
   */
  searchComps: adminProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        grade: z.string().optional(),
        category: z.string().optional(),
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        sort: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return searchEbayListings({
        query: input.query,
        grade: input.grade || undefined,
        category: input.category || undefined,
        limit: input.limit,
        offset: input.offset,
        sort: input.sort || undefined,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
      });
    }),

  /**
   * Test the eBay API connection.
   * Returns whether sandbox or production is being used.
   */
  testConnection: adminProcedure.query(async () => {
    return testEbayConnection();
  }),
});
