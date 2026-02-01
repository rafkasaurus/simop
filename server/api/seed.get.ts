import { auth } from "~~/server/utils/auth";
import { users } from "~~/server/database/schema";
import { eq } from "drizzle-orm";
import { useDrizzle } from "~~/server/utils/drizzle";


export default defineEventHandler(async (event) => {
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
});

