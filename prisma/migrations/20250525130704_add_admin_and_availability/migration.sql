-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "GuestHouseAvailability" (
    "id" TEXT NOT NULL,
    "guestHouse" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "totalRooms" INTEGER NOT NULL DEFAULT 1,
    "availableRooms" INTEGER NOT NULL DEFAULT 1,
    "pricePerNight" DECIMAL(10,2) NOT NULL,
    "amenities" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestHouseAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestHouseAvailability_guestHouse_roomType_key" ON "GuestHouseAvailability"("guestHouse", "roomType");
