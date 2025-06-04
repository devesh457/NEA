import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkProfileStatus(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        isProfileComplete: true,
        lastPostingConfirmedAt: true,
        posting: true,
        dateOfJoining: true,
        bloodGroup: true,
        dateOfBirth: true,
        employeeId: true,
        emergencyContactName: true,
        insuranceNomineeName: true
      }
    }) as any;

    if (!user) {
      return {
        needsProfileCompletion: true,
        needsMonthlyConfirmation: false,
        currentPosting: ''
      };
    }

    // Check if profile is complete
    const requiredFields = [
      user.dateOfJoining,
      user.bloodGroup,
      user.dateOfBirth,
      user.employeeId,
      user.emergencyContactName,
      user.insuranceNomineeName,
      user.posting
    ];

    const isProfileComplete = user.isProfileComplete && requiredFields.every(field => field !== null && field !== undefined);

    // Check if monthly confirmation is needed
    let needsMonthlyConfirmation = false;
    if (isProfileComplete && user.lastPostingConfirmedAt) {
      const lastConfirmation = new Date(user.lastPostingConfirmedAt);
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastConfirmationMonth = lastConfirmation.getMonth();
      const lastConfirmationYear = lastConfirmation.getFullYear();

      needsMonthlyConfirmation = (
        currentYear > lastConfirmationYear ||
        (currentYear === lastConfirmationYear && currentMonth > lastConfirmationMonth)
      );
    } else if (isProfileComplete && !user.lastPostingConfirmedAt) {
      needsMonthlyConfirmation = true;
    }

    return {
      needsProfileCompletion: !isProfileComplete,
      needsMonthlyConfirmation,
      currentPosting: user.posting || ''
    };

  } catch (error) {
    return {
      needsProfileCompletion: true,
      needsMonthlyConfirmation: false,
      currentPosting: ''
    };
  }
} 