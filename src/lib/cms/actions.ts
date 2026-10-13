"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  archiveBlog,
  publishBlog,
  unpublishBlog,
  duplicateBlog,
  bulkUpdateBlogStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  createTag,
  deleteTag,
  addMedia,
  deleteMedia,
  updateCMSSettings,
} from "./store";
import { verifyAdminCredentials, destroyAdminSession, requireAdminSession } from "./auth";
import { isSupabaseAdminConfigured, getSupabaseAdminClient } from "./supabase";
import { BlogStatus, CMSBlog, CMSSettings } from "./types";
import { sanitizeHtml } from "./sanitize";

// ==========================================
// AUTH ACTIONS
// ==========================================

export async function loginAdminAction(formData: FormData) {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  const result = await verifyAdminCredentials(email, password);
  return result;
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  return { success: true };
}

// ==========================================
// BLOG ACTIONS
// ==========================================

export async function saveBlogAction(blogData: Partial<CMSBlog>) {
  await requireAdminSession();

  // Sanitize HTML content to prevent Stored XSS attacks
  if (blogData.contentHtml) {
    blogData.contentHtml = sanitizeHtml(blogData.contentHtml);
  }
  if (blogData.slug) {
    blogData.slug = blogData.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  let savedBlog: CMSBlog | null = null;
  if (blogData.id) {
    savedBlog = await updateBlog(blogData.id, blogData);
  } else {
    savedBlog = await createBlog(blogData);
  }

  if (savedBlog) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${savedBlog.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/sitemap.xml");
  }

  return { success: Boolean(savedBlog), blog: savedBlog };
}

export async function publishBlogAction(id: string) {
  await requireAdminSession();
  const blog = await publishBlog(id);

  if (blog) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/sitemap.xml");
  }

  return { success: Boolean(blog), blog };
}

export async function unpublishBlogAction(id: string) {
  await requireAdminSession();
  const blog = await unpublishBlog(id);

  if (blog) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/sitemap.xml");
  }

  return { success: Boolean(blog), blog };
}

export async function archiveBlogAction(id: string) {
  await requireAdminSession();
  const blog = await archiveBlog(id);

  if (blog) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/sitemap.xml");
  }

  return { success: Boolean(blog), blog };
}

export async function duplicateBlogAction(id: string) {
  await requireAdminSession();
  const blog = await duplicateBlog(id);

  if (blog) {
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
  }

  return { success: Boolean(blog), blog };
}

export async function deleteBlogAction(id: string, permanent: boolean = false) {
  await requireAdminSession();
  const success = await deleteBlog(id, permanent);

  if (success) {
    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    revalidatePath("/sitemap.xml");
  }

  return { success };
}

export async function bulkBlogStatusAction(ids: string[], status: BlogStatus) {
  await requireAdminSession();
  const updatedCount = await bulkUpdateBlogStatus(ids, status);

  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap.xml");

  return { success: true, updatedCount };
}

// ==========================================
// CATEGORY ACTIONS
// ==========================================

export async function saveCategoryAction(name: string, description?: string, id?: string) {
  await requireAdminSession();
  let cat;
  if (id) {
    cat = await updateCategory(id, name, description);
  } else {
    cat = await createCategory(name, description);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return { success: Boolean(cat), category: cat };
}

export async function deleteCategoryAction(id: string) {
  await requireAdminSession();
  const success = await deleteCategory(id);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");

  return { success };
}

// ==========================================
// TAG ACTIONS
// ==========================================

export async function saveTagAction(name: string) {
  await requireAdminSession();
  const tag = await createTag(name);

  revalidatePath("/admin/tags");
  revalidatePath("/admin/blogs");

  return { success: Boolean(tag), tag };
}

export async function deleteTagAction(id: string) {
  await requireAdminSession();
  const success = await deleteTag(id);

  revalidatePath("/admin/tags");
  revalidatePath("/admin/blogs");

  return { success };
}

// ==========================================
// MEDIA UPLOAD ACTIONS
// ==========================================

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("file") as File;
  const altText = (formData.get("altText") as string) || "";

  if (!file || file.size === 0) {
    return { success: false, error: "No file provided for upload." };
  }

  // Validate mime type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Allowed formats: PNG, JPG, WEBP, SVG, GIF.",
    };
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File size exceeds 5MB limit." };
  }

  const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let finalUrl = "";

  // 1. Try Supabase Storage if configured
  if (isSupabaseAdminConfigured()) {
    try {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from("blog-media")
          .upload(safeFilename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("blog-media")
            .getPublicUrl(safeFilename);
          finalUrl = publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn("Supabase storage upload error, falling back to local storage:", err);
    }
  }

  // 2. Fallback to local uploads directory (Development only)
  if (!finalUrl) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error:
          "Production storage error: Supabase Storage is required for media uploads in production. Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(targetPath, buffer);
    finalUrl = `/uploads/${safeFilename}`;
  }

  const mediaItem = await addMedia({
    filename: safeFilename,
    url: finalUrl,
    altText: altText || file.name,
    size: file.size,
    mimeType: file.type,
  });

  revalidatePath("/admin/media");

  return { success: true, media: mediaItem };
}

export async function deleteMediaAction(id: string) {
  await requireAdminSession();
  const success = await deleteMedia(id);
  revalidatePath("/admin/media");
  return { success };
}

// ==========================================
// SETTINGS ACTIONS
// ==========================================

export async function updateSettingsAction(settings: Partial<CMSSettings>) {
  await requireAdminSession();
  const updated = await updateCMSSettings(settings);
  revalidatePath("/admin/settings");
  return { success: true, settings: updated };
}

export async function triggerRevalidationAction() {
  await requireAdminSession();
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  return { success: true, timestamp: new Date().toISOString() };
}
