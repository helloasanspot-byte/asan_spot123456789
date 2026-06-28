import Image from 'next/image'
import { ArrowRight, BadgeCheck, Clock3, Mail, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'

type PageProps = {
  params: Promise<{ id: string }>
}

function formatServiceName(id: string) {
  return decodeURIComponent(id).replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const serviceName = formatServiceName(id)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2ff_100%)] px-4 py-8 md:px-8 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
                <Sparkles className="h-4 w-4" />
                سریع، مطمئن و حرفه‌ای
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Order {serviceName} with confidence and speed
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  AsanSpot offers a smooth and reliable path to get premium AI and digital services with fast support, simple steps, and a modern experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/17575055153" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-0.5">
                  Start Now
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="mailto:hello.asanspot@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: '24/7 Support', icon: Clock3, text: 'Always ready to help' },
                  { title: 'High Security', icon: ShieldCheck, text: 'Your information stays protected' },
                  { title: 'Quality Guarantee', icon: BadgeCheck, text: 'Professional experience every time' },
                ].map(({ title, text, icon: Icon }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <Icon className="mb-2 h-5 w-5 text-sky-600" />
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-sky-500/20 via-fuchsia-500/20 to-amber-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                      <Image src="/Logo.png" alt="آسان اسپات" width={44} height={44} className="rounded-xl object-contain" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">AsanSpot</p>
                      <p className="font-semibold">Smart and fast service</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
                    Premium
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Why customers choose us</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-100">
                    <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Fast response when you need it</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Simple process with no confusion</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Professional support and reliable guidance</li>
                  </ul>
                </div>

                <div className="mt-4 rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4 text-sm text-sky-100">
                  <p className="font-semibold">Start your {serviceName} order today.</p>
                  <p className="mt-1 text-sky-200">Our team is ready to make the experience smooth and impressive.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Fast WhatsApp', value: '+1 (757) 505-5153', icon: MessageCircle, href: 'https://wa.me/17575055153', color: 'from-emerald-500 to-green-600' },
            { title: 'Instagram', value: '@asan_spot', icon: Mail, href: 'https://www.instagram.com/asan_spot?utm_source=qr', color: 'from-pink-500 to-rose-600' },
            { title: 'Email', value: 'hello.asanspot@gmail.com', icon: Mail, href: 'mailto:hello.asanspot@gmail.com', color: 'from-sky-500 to-indigo-600' },
          ].map(({ title, value, icon: Icon, href, color }) => (
            <a key={title} href={href} className={`group rounded-[24px] border border-white/70 bg-gradient-to-br ${color} p-[1px] shadow-lg transition-transform hover:-translate-y-1`}>
              <div className="rounded-[23px] bg-white/95 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
                <p className="mt-1 font-bold text-slate-900">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}