import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('user_favorites')
    .select('video_id, videos(*)')
    .eq('user_id', user.id)

  return NextResponse.json({ favorites: data })
}

export async function POST(req: NextRequest) {
  const { video_id } = await req.json()
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('user_favorites').insert({ user_id: user.id, video_id })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { video_id } = await req.json()
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('user_favorites').delete().match({ user_id: user.id, video_id })
  return NextResponse.json({ ok: true })
}
