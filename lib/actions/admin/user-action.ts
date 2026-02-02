"use server";

import { createUser } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/cookie";

export const handleCreateUser = async (data: FormData) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, message: "You must be logged in as admin to create a user." };
    }

    const response = await createUser(data, token);

    if (response.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: response.message || "User created successfully",
        data: response.data
      };
    }

    return {
      success: false,
      message: response.message || "Registration failed"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration action failed"
    };
  }
};
