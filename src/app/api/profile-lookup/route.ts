import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // اتصال به سوپابیس با کلید Service Role برای عبور امن از سد RLS در سمت سرور
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // دریافت فقط فیلدهای عمومی و غیرحساس برای نمایش در کامپوننت لاگین
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, avatar_url')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      profile: {
        name: data.first_name,
        avatar: data.avatar_url
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}