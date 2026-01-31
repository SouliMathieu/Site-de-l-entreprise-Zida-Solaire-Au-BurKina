-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'ORANGE_MONEY', 'MOOV_MONEY', 'WAVE', 'TELECEL_MONEY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "InstallationType" AS ENUM ('SOLAR', 'ELECTRICAL', 'PLUMBING', 'OTHER');

-- CreateEnum
CREATE TYPE "InstallationStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Ouagadougou',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "compareAtPrice" DECIMAL(12,2),
    "costPrice" DECIMAL(12,2),
    "sku" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "categoryId" TEXT NOT NULL,
    "images" JSONB NOT NULL DEFAULT '[]',
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "warranty" TEXT,
    "weight" DECIMAL(8,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "deliveryFee" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryCity" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerNotes" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installation_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerAddress" TEXT NOT NULL,
    "installationType" "InstallationType" NOT NULL,
    "description" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "preferredTime" TEXT,
    "images" JSONB NOT NULL DEFAULT '[]',
    "status" "InstallationStatus" NOT NULL DEFAULT 'NEW',
    "estimatedCost" DECIMAL(12,2),
    "assignedTechnicianId" TEXT,
    "technicianNotes" TEXT,
    "appointmentDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'ZIDA SOLAIRE',
    "siteDescription" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "address" TEXT,
    "openingHours" JSONB NOT NULL DEFAULT '{}',
    "deliveryFeeOuagadougou" DECIMAL(8,2) NOT NULL DEFAULT 2000,
    "deliveryFeeOtherCities" DECIMAL(8,2) NOT NULL DEFAULT 5000,
    "freeDeliveryThreshold" DECIMAL(12,2) NOT NULL DEFAULT 50000,
    "banners" JSONB NOT NULL DEFAULT '[]',
    "socialMedia" JSONB NOT NULL DEFAULT '{}',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_isFeatured_idx" ON "products"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "installation_requests_requestNumber_key" ON "installation_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "installation_requests_status_idx" ON "installation_requests"("status");

-- CreateIndex
CREATE INDEX "installation_requests_requestNumber_idx" ON "installation_requests"("requestNumber");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation_requests" ADD CONSTRAINT "installation_requests_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
