import { createBrowserClient } from '@supabase/ssr'

// با استفاده از createBrowserClient سوپابیس به صورت خودکار کوکی‌ها را تنظیم می‌کند
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)