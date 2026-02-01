/**
 * @deprecated This endpoint is DEPRECATED
 * Use POST /api/seed/init instead
 * 
 * This file creates users but WITHOUT proper password authentication,
 * making them unable to login. It's kept for reference only.
 */

import { auth } from "~~/server/utils/auth";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";
import { useDrizzle } from "~~/server/utils/drizzle";


export default defineEventHandler(async (event) => {
    return {
        deprecated: true,
        message: "This endpoint is deprecated. Please use POST /api/seed/init instead.",
        reason: "This creates users with better-auth which is the proper way to handle authentication."
    };
    
    // Original code (commented out):
    /*
    // Create Admin User
    try {
        const admin = await auth.api.signUpEmail({
            body: {
                email: "admin@simop.com",
                password: "password123",
                name: "Administrator",
                username: "admin",
            }
        });

        // Update role to admin
        const db = useDrizzle();
        await db.update(users)
            .set({ role: 'admin', irbanUnit: 'admin' })
            .where(eq(users.id, admin.user.id));

        return { message: "Seeded successfully", admin };
    } catch (e) {
        return { message: "Seeding failed or already seeded", error: e };
    }
    */
});
