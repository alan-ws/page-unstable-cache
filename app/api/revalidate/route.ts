import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// export const runtime = "edge";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  try {
    if (tag !== null) revalidateTag(tag);
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
