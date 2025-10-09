// src/pages/api/student/upload.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import { withAuth, AuthenticatedRequest } from "@/libs/authGuard"

const prisma = new PrismaClient()

// ใช้ SERVICE_ROLE_KEY ของ Supabase ใน backend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export default withAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST")  res.status(405).end()

  try {
    const { base64 } = req.body as { base64?: string }
    if (!base64) return res.status(400).json({ error: "No image provided" })

    // ตรวจสอบจำนวนรูปที่นักเรียนอัปโหลดไปแล้ว
    const existingCount = await prisma.takePicture.count({
      where: { studentId: req.user.id }
    })
    if (existingCount >= 5) {
      return res.status(400).json({ error: "อัปโหลดได้สูงสุด 5 รูปต่อคน" })
    }

    // แปลง base64 เป็น buffer
    const matches = base64.match(/^data:(.+);base64,(.+)$/)
    if (!matches) return res.status(400).json({ error: "Invalid base64 format" })

    const mimeType = matches[1]
    const data = matches[2]
    const buffer = Buffer.from(data, "base64")

    const ext = mimeType.split("/")[1] ?? "jpg"
    const filename = `openhouse-${Date.now()}.${ext}`

    // upload ด้วย service role key (admin client)
    const { error: uploadError } = await supabaseAdmin.storage
      .from("images")
      .upload(filename, buffer, { cacheControl: "3600", upsert: false })

    if (uploadError) throw uploadError

    const publicUrl = supabaseAdmin.storage.from("images").getPublicUrl(filename).data?.publicUrl
    if (!publicUrl) throw new Error("Cannot get public URL")

    // บันทึกลง DB
    const uploaded = await prisma.takePicture.create({
      data: {
        studentId: req.user.id,
        image_url: publicUrl,
      },
    })

    res.status(200).json({ uploaded, publicUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
}, ["student"])
