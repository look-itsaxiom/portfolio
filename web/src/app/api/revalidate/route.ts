import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { secret, paths } = await req.json()

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ error: "paths array required" }, { status: 400 })
  }

  for (const p of paths) {
    revalidatePath(p)
  }

  return NextResponse.json({ revalidated: true, paths })
}
