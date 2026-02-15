import * as z from "zod";

export const createRoomSchema = z.object({
  username: z
    .string()
    .min(2, "Username is too short")
    .max(20, "Username is too long"),
  password: z.string().max(50, "Password is too long").optional(),
});

export type CreateRoomType = z.infer<typeof createRoomSchema>;
