/**
 * @deprecated This endpoint is DEPRECATED and DANGEROUS!
 * Use POST /api/seed/init instead
 * 
 * ⚠️ CRITICAL WARNING: This file contains `await db.delete(pkptPrograms)`
 * which DELETES ALL EXISTING PROGRAMS before seeding!
 * 
 * This is extremely dangerous and should NEVER be used in production.
 * The file is kept for reference only and renamed to prevent accidental use.
 */

import { pkptPrograms, users } from "~~/server/database/schema";
import { useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    return {
        deprecated: true,
        dangerous: true,
        message: "This endpoint is deprecated and DANGEROUS! Please use POST /api/seed/init instead.",
        reason: "This endpoint deletes ALL existing programs before seeding, which can cause permanent data loss. Use the new init endpoint instead."
    };

    // Original DANGEROUS code (commented out):
    /*
    const db = useDrizzle();

    // 1. Get an admin user ID to assign as creator
    const adminUser = await db.query.users.findFirst();
    if (!adminUser) {
        return { message: "No users found. Please login/sign-up first." };
    }

    // 2. ⚠️ DANGER: Clear existing programs
    await db.delete(pkptPrograms);

    // Helper function to create dates in 2026
    const d = (month: number, day: number) => new Date(2026, month - 1, day).toISOString();

    // 3. Define 30 seed data for January - February 2026
    const seedData = [
        // ... program data
    ];

    // 4. Insert data
    await db.insert(pkptPrograms).values(seedData);

    return { 
        success: true, 
        count: seedData.length, 
        message: "30 Programs seeded successfully for January-February 2026",
        breakdown: {
            irban1: seedData.filter(p => p.irbanPj === 'irban1').length,
            irban2: seedData.filter(p => p.irbanPj === 'irban2').length,
            irban3: seedData.filter(p => p.irbanPj === 'irban3').length,
            irbansus: seedData.filter(p => p.irbanPj === 'irbansus').length,
            riksus: seedData.filter(p => p.jenisPengawasan === 'riksus').length,
            regular: seedData.filter(p => p.jenisPengawasan === 'regular').length,
            secret: seedData.filter(p => p.isSecret).length,
            published: seedData.filter(p => p.isPublished).length
        }
    };
    */
});
