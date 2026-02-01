import { pgTable, text, timestamp, boolean, serial, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email"),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    role: text("role"), // 'admin', 'operator'
    irbanUnit: text("irban_unit"), // 'irban1', 'irban2', etc
});

export const sessions = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => users.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

export const pkptPrograms = pgTable('pkpt_program', {
    id: serial('id').primaryKey(),
    kodeProgram: text('kode_program').unique().notNull(),
    namaKegiatan: text('nama_kegiatan').notNull(),
    irbanPj: text('irban_pj').notNull(), // 'irban1', 'irban2', etc
    objekPengawasan: text('objek_pengawasan').notNull(),
    jenisPengawasan: text('jenis_pengawasan').notNull(), // 'regular', 'riksus'
    tglMulai: date('tgl_mulai').notNull(),
    tglSelesai: date('tgl_selesai').notNull(),
    status: text('status').notNull(), // 'perencanaan', 'pelaksanaan', 'selesai'
    progresPersen: integer('progres_persen').default(0),
    isPublished: boolean('is_published').default(true),
    isSecret: boolean('is_secret').default(false), // true = Riksus rahasia, tidak tampil di publik

    createdById: text('created_by_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
