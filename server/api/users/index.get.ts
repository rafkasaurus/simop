import { auth } from "~~/server/utils/auth";
import { users } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const user = session.user as any;
    
    // Only admin can list all users
    if (user.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: "Forbidden - Admin access required" });
    }

    const db = useDrizzle();
    
    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return allUsers;
});
