import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ۱. مدیریت کوکی‌های Supabase جهت حفظ وضعیت احراز هویت و امنیت کوکی‌ها
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const currentPath = request.nextUrl.pathname

  // 🟢 ۲. ریدایرکت مستقیم ورودی‌های اولیه سایت (/) به صفحه دسته‌بندی‌ها (/categories)
  // این مورد برای تجربه کاربری بهتر حفظ شده است.
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  // 🔴 ۳. حذف تمام شروط لاگین اجباری و ریدایرکت‌های مربوط به احراز هویت
  // دیگر هیچ ریدایرکتی برای مسیرهای خصوصی یا AuthRoutes وجود ندارد.
  // کاربران بدون لاگین می‌توانند به تمام صفحات دسترسی داشته باشند.
  // لاگین و ساین‌آپ کاملاً اختیاری است و میدلویر دخالتی در دسترسی ندارد.

  // اجازه دادن به تمام درخواست‌ها برای عبور
  return response
}

export const config = {
  // فیلتر کردن فایل‌های استاتیک، تصاویر و مسیرهای API از پردازش میدلویر
  // این تنظیمات عملکرد میدلویر را بهینه‌سازی می‌کند و نباید تغییر کند.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}