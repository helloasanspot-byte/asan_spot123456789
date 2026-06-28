import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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

  // دریافت اطلاعات کاربر فعال جهت بررسی وضعیت احراز هویت
  const { data: { user } } = await supabase.auth.getUser()
  const currentPath = request.nextUrl.pathname

  // 🟢 ۱. ریدایرکت مستقیم ورودی‌های اولیه سایت به صفحه دسته‌بندی‌ها
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  // لیست سفید: صفحاتی که بدون لاگین برای همه باز هستند
  const publicRoutes = ['/categories', '/about', '/contact']

  // 🟢 مجاز کردن صفحات داینامیک دسته‌بندی و صفحه تأیید پرداخت بدون لاگین
  const isDynamicCategoryRoute = currentPath.startsWith('/categories/')
  const isPaymentConfirmRoute = currentPath.startsWith('/payment-confirm')
  const isPublicRoute = publicRoutes.includes(currentPath) || isDynamicCategoryRoute || isPaymentConfirmRoute

  // مسیرهای مربوط به احراز هویت
  const isAuthRoute = currentPath === '/user/login' || currentPath === '/user/signup'

  // 🔒 سناریو اول: کاربر لاگین نکرده و می‌خواهد به صفحات خصوصی برود
  if (!user && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // 🔄 سناریو دوم: کاربر لاگین کرده یا تازه ساین‌آپ شده و می‌خواهد به صفحه لاگین/ثبت‌نام برود
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  // فیلتر کردن فایل‌های استاتیک، تصاویر و مسیرهای API از پردازش میدلویر
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}