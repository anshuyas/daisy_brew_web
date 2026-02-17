"use server";

import { createUser } from "@/lib/api/admin/user";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const CreateUserAction = async (formData: FormData) => {
  try {
    const cookieStore = cookies() as unknown as { 
      get: (name: string) => { value?: string } | undefined; 
    };
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "You must be logged in as admin" };
    }

    const response = await createUser(formData, token);

    if (response.success) {
      revalidatePath("/admin/users");
      return { success: true, message: response.message || "User created successfully" };
    }

    return { success: false, message: response.message || "Failed to create user" };
  } catch (err: any) {
    return { success: false, message: err.message || "Server error" };
  }
};
