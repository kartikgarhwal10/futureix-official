import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getAllBlogsAdmin, updateBlog } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

function safeStringCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Validates the cron caller's secret token.
 * Prevents unauthorized or unauthenticated triggering of publishing workflows.
 */
function verifyCronAuthorization(request: NextRequest): boolean {
  const configuredSecret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (!configuredSecret) {
    if (isProd) {
      // In production, CRON_SECRET must be configured
      return false;
    }
  }

  const effectiveSecret = configuredSecret || "futureix-dev-cron-secret-2026";

  // Check Bearer authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (safeStringCompare(token, effectiveSecret)) return true;
  }

  // Check custom header (common in hosting platforms like Vercel)
  const cronHeader = request.headers.get("x-cron-secret");
  if (cronHeader && safeStringCompare(cronHeader.trim(), effectiveSecret)) {
    return true;
  }

  // Check query parameter
  const querySecret = request.nextUrl.searchParams.get("key");
  if (querySecret && safeStringCompare(querySecret.trim(), effectiveSecret)) {
    return true;
  }

  return false;
}

async function handleScheduledPublishing() {
  const allBlogs = await getAllBlogsAdmin(false);
  const now = new Date();

  // Find all blogs ready for automated publication
  const readyBlogs = allBlogs.filter((blog) => {
    if (blog.status !== "scheduled") return false;
    if (!blog.scheduledAt) return false;
    return new Date(blog.scheduledAt) <= now;
  });

  if (readyBlogs.length === 0) {
    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      processedCount: 0,
      message: "No scheduled posts currently due for publication.",
    });
  }

  const published = [];

  for (const blog of readyBlogs) {
    const updated = await updateBlog(blog.id, {
      status: "published",
      publishedAt: blog.scheduledAt || now.toISOString(),
      scheduledAt: null,
      updatedAt: now.toISOString(),
    });

    if (updated) {
      published.push({
        id: updated.id,
        slug: updated.slug,
        title: updated.title,
        publishedAt: updated.publishedAt,
      });

      // Invalidate relevant public and admin caches
      revalidatePath("/blog");
      revalidatePath(`/blog/${updated.slug}`);
      revalidatePath("/sitemap.xml");
      revalidatePath("/admin/blogs");
      revalidatePath("/admin/dashboard");
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    processedCount: published.length,
    published,
    message: `Successfully published ${published.length} scheduled article(s).`,
  });
}

export async function GET(request: NextRequest) {
  if (!verifyCronAuthorization(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized: Missing or invalid CRON_SECRET authentication header.",
      },
      { status: 401 }
    );
  }

  try {
    return await handleScheduledPublishing();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Scheduled publishing cron job error:", errorMsg);
    return NextResponse.json(
      { error: "Internal server error executing scheduled publishing", details: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!verifyCronAuthorization(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized: Missing or invalid CRON_SECRET authentication header.",
      },
      { status: 401 }
    );
  }

  try {
    return await handleScheduledPublishing();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Scheduled publishing cron job error:", errorMsg);
    return NextResponse.json(
      { error: "Internal server error executing scheduled publishing", details: errorMsg },
      { status: 500 }
    );
  }
}
