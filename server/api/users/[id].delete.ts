import { auth } from "~~/server/utils/auth";
import { users } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const user = session.user as any;
    
    // Only admin can delete users
    if (user.role !== 'admin') {
        throw createError({ statusCode: 403, statusMessage: "Forbidden - Admin access required" });
    }

    const id = getRouterParam(event, 'id');
    
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: "User ID required" });
    }

    const db = useDrizzle();

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!existingUser) {
        throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (existingUser.id === user.id) {
        throw createError({ statusCode: 400, statusMessage: "Cannot delete yourself" });
    }

    // Prevent deleting the last admin
    if (existingUser.role === 'admin') {
        const adminCount = await db.query.users.findMany({
            where: eq(users.role, 'admin'),
        });
        if (adminCount.length <= 1) {
            throw createError({ statusCode: 400, statusMessage: "Cannot delete the only admin" });
        }
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    return { message: "User deleted successfully" };
});
