import * as z from "zod";

export const isValidUUID = (value: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const joinRoomSchema = z.object({
  username: z
    .string()
    .min(2, "Username is too short")
    .max(20, "Username is too long"),
  roomId: z.string().refine((value) => isValidUUID(value), {
    message: "Invalid roomId",
  }),
  password: z.string().max(50).optional(),
});

export type JoinRoomType = z.infer<typeof joinRoomSchema>;
