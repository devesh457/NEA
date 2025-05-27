-- CreateTable
CREATE TABLE "GuestHouseBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guestHouse" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "roomType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestHouseBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuestHouseBooking" ADD CONSTRAINT "GuestHouseBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
