import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      select: { image_base64: true }
    });

    if (!product || !product.image_base64) {
      return new NextResponse("Not found", { status: 404 });
    }

    const match = product.image_base64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const buffer = Buffer.from(match[2], 'base64');
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=0, must-revalidate"
        }
      });
    }

    return new NextResponse(product.image_base64, {
      headers: { "Content-Type": "text/plain" }
    });
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
