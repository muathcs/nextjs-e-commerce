import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      filePath: true,
      name: true,
    },
  });

  if (product == null) {
    return notFound();
  }

  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  //return file extension
  const extension = await product.filePath.split(".").pop();

  console.log("extension: ", extension);

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
