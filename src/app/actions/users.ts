'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function deleteUser(userId: string) {
  try {
    const admin = await requireAdmin();

    if (admin.id === userId) {
      return { success: false, error: "Kendi hesabınızı silemezsiniz." };
    }

    // Check if user has orders
    const orderCount = await prisma.order.count({
      where: { userId }
    });

    if (orderCount > 0) {
      return { 
        success: false, 
        error: "Kullanıcı silinemedi çünkü mevcut siparişleri var. Önce siparişleri silmeli veya kullanıcıyı arşivlemelisiniz." 
      };
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("User deletion error:", error);
    return { success: false, error: "Kullanıcı silinirken bir hata oluştu." };
  }
}
