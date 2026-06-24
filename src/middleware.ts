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

  // تایید امنیت سمت سرور با گرفتن اطلاعات کاربر فعال
  const { data: { user } } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname

  // 🟢 لیست سفید: صفحاتی که بدون لاگین برای همه باز هستند
  const publicRoutes = ['/', '/services', '/about', '/contact']
  
  // مسیرهای مربوط به احراز هویت
  const isAuthRoute = currentPath === '/user/login' || currentPath === '/user/signup'

  // 🔒 سناریو اول: کاربر لاگین نکرده و می‌خواهد به صفحه‌ای غیر از صفحات مجاز برود
  if (!user && !publicRoutes.includes(currentPath) && !isAuthRoute) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // 🔄 سناریو دوم: کاربر لاگین کرده ولی می‌خواهد دوباره به صفحه لاگین یا ثبت‌نام برود
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  // 🟢 این رگکس پیشرفته باعث می‌شود میدلویر روی تمام صفحات سایت اعمال شود، 
  // اما فایل‌های استاتیک، تصاویر (مثل Logo.png و hesab.jpeg) و روت‌های API را فیلتر نکند تا سایت کرش نکند.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}