'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendWelcomeEmail } from "@/lib/mail";

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: "Email en wachtwoord zijn verplicht." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: "Dit e-mailadres is al in gebruik." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER"
      }
    });

    // Send welcome email
    await sendWelcomeEmail(email, name);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Er is een fout opgetreden bij de registratie." };
  }
}

export async function updateAddress(userId: string, formData: FormData) {
  try {
    const street = formData.get('street') as string;
    const houseNumber = formData.get('houseNumber') as string;
    const addition = formData.get('addition') as string;
    const city = formData.get('city') as string;
    const postalCode = formData.get('postalCode') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    
    // Billing
    const companyName = formData.get('companyName') as string;
    const vatNumber = formData.get('vatNumber') as string;

    await prisma.user.update({
      where: { id: userId },
      data: { 
        street, 
        houseNumber, 
        addition, 
        city, 
        postalCode, 
        phone, 
        country,
        companyName,
        vatNumber
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Address update error:", error);
    return { success: false, error: "Fout bij het bijwerken van adres." };
  }
}

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "Gebruiker niet gevonden." };

    const data: { name: string; password?: string } = { name };

    if (newPassword) {
      if (!currentPassword) return { success: false, error: "Huidig wachtwoord is vereist." };
      const isMatch = await bcrypt.compare(currentPassword, user.password!);
      if (!isMatch) return { success: false, error: "Huidig wachtwoord is onjuist." };
      data.password = await bcrypt.hash(newPassword, 12);
    }

    await prisma.user.update({
      where: { id: userId },
      data
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Fout bij het bijwerken van profiel." };
  }
}
