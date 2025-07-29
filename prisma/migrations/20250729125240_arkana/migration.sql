-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('DOWNPAYMENT', 'PAID');

-- CreateEnum
CREATE TYPE "FieldStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "type" VARCHAR(100),
    "hourly_rate" INTEGER NOT NULL,
    "status" "FieldStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "booking_name" VARCHAR(100),
    "phone" VARCHAR(100),
    "field_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "total_price" INTEGER NOT NULL,
    "booking_status" "BookingStatus" NOT NULL DEFAULT 'DOWNPAYMENT',

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
