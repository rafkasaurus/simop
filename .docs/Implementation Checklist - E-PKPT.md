# **CHECKLIST IMPLEMENTASI E-PKPT (NUXT 4 EDITION)**

## **FASE 1: FONDASI & ARSITEKTUR DATA**
- [x] **Inisiasi Project**
  - [x] Setup Nuxt 4 (Base Project)
  - [x] Setup UI Framework (TailwindCSS + DaisyUI)
  - [x] Setup Icons (nuxt-icon)
  - [x] Init Git Repository
- [x] **Database & ORM Layer**
  - [x] Setup PostgreSQL Local (Port: 5433, User: postgres, Pass: root)
  - [x] Initialize Drizzle ORM
  - [x] Define Schema Database (`server/database/schema.ts`)
  - [x] Generate & Run Initial Migrations
  - [x] Setup Database Connection Utility (`server/utils/drizzle.ts`)
- [x] **Authentication Layer (Better Auth)**
  - [x] Install & Configure Better Auth
  - [x] Setup Auth Handler (`server/api/auth/[...auth].ts`)
  - [x] Define Auth Schema (User, Session, Account)
  - [x] Create Login Page Implementation

- [x] **Core API Development**
  - [x] Implement CRUD API for Programs
  - [x] Implement Auto-Numbering Logic (PKPT-[IRBAN]-[000])
  - [x] Implement Seed Script for Demo Data


## **FASE 2: ANTARMUKA ADMIN & MANAJEMEN**
- [x] **Layouting & Navigation**
  - [x] Create Admin Dashboard Layout (Sidebar & Navbar)
  - [x] Responsive Drawer Implementation
- [x] **Program Management**
  - [x] Datatable for Programs (List & Filters)
  - [x] Form Input Program (Create/Edit)
  - [x] Logic Field 'irbanPj' based on Role (Admin vs Operator)

- [ ] **Dashboard Overview**
  - [ ] Statistics Cards (Total, Pending, Selesai)
  - [ ] Quick Overview Charts (Optional)

## **FASE 3: TRANSPARANSI PUBLIK & INTEGRASI**
- [x] **Public Area**
  - [x] Landing Page /publik (Modern Design)
  - [x] Filter logic for 'isPublished' data
- [x] **Widget Integration**
  - [x] Create Clean Widget Page (/widget/running)
  - [x] Iframe Security Config (CORS & Frame Options)
  - [x] Testing Widget Embed in Static HTML


## **FASE 4: DOCKERIZATION & DEPLOYMENT**
- [x] **Containerization**
  - [x] Create `.dockerignore`
  - [x] Create Multi-stage Dockerfile (Nuxt Standalone)
- [ ] **Railway Deployment**
  - [ ] Setup Railway Project
  - [ ] Provision PostgreSQL Production
  - [ ] Configure Environment Variables (DATABASE_URL, BETTER_AUTH_SECRET)
  - [ ] Final Deployment & domain mapping
- [ ] **Quality Assurance**
  - [ ] Final UAT (Login, Input, Widget Check)
  - [ ] Performance Audit (Lighthouse)
  - [ ] Cleanup Code & Documentation Screenshot
