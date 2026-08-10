import { NextResponse } from "next/server";
import {
  requireAnyPermission,
  authorizationStatus,
} from "@/src/lib/auth/authorize";
import { PERMISSIONS, WEBSITE_PERMISSIONS } from "@/src/config/permissions";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);
export async function POST(request: Request) {
  try {
    await requireAnyPermission([...WEBSITE_PERMISSIONS, PERMISSIONS.SCHOOL_SETTINGS_MANAGE]);
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size)
      return NextResponse.json(
        { error: "Please select a file." },
        { status: 400 },
      );
    if (!allowed.has(file.type))
      return NextResponse.json(
        { error: "Only PDF, Word, Excel, JPG and PNG files are allowed." },
        { status: 400 },
      );
    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json(
        { error: "File size cannot exceed 10 MB." },
        { status: 400 },
      );
    const extension = path
      .extname(file.name)
      .toLowerCase()
      .replace(/[^.a-z0-9]/g, "");
    const safeBase =
      path
        .basename(file.name, path.extname(file.name))
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "document";
    const fileName = `${safeBase}-${randomUUID().slice(0, 8)}${extension}`;
    const directory = path.join(process.cwd(), "public", "uploads", "website");
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, fileName),
      Buffer.from(await file.arrayBuffer()),
    );
    return NextResponse.json({
      url: `/uploads/website/${fileName}`,
      name: file.name,
    });
  } catch (error) {
    console.error("Website file upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "File upload failed." },
      { status: authorizationStatus(error) },
    );
  }
}
