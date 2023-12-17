import * as z from "zod";

export const createRoomSchema = z.object({
  username: z
    .string()
    .min(2, "Username is too short")
    .max(20, "Username is too long"),
});

export type CreateRoomType = z.infer<typeof createRoomSchema>;
