'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { 
  User, Mail, Globe, Phone, Lock, Save, 
  CheckCircle2, AlertCircle, ShieldAlert, Loader2,
  Camera, LogOut, Calendar, UploadCloud
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  // --- Profile States ---
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('') // فیلد تاریخ تولد

  // --- Avatar States ---
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // --- Password States ---
  const [savingPassword, setSavingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // --- Messages ---
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

  // 1. Fetch User Data on Component Mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (user && !authError) {
        setUserId(user.id)
        setEmail(user.email || '')

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, country, phone, date_of_birth, avatar_url')
          .eq('id', user.id)
          .single()

        if (profileData && !profileError) {
          setFirstName(profileData.first_name || '')
          setLastName(profileData.last_name || '')
          setCountry(profileData.country || '')
          setPhone(profileData.phone || '')
          setDob(profileData.date_of_birth || '')
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url)
          }
        }
      } else {
        router.push('/user/login')
      }
      setLoading(false)
    }

    fetchUserData()
  }, [router])

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 2. Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setSavingProfile(true)
    setProfileMessage({ type: '', text: '' })

    try {
      let finalAvatarUrl = avatarPreview // در صورت عدم تغییر، لینک قبلی را نگه می‌دارد

      // اگر کاربر عکس جدیدی انتخاب کرده باشد، آن را در باکت avatars آپلود می‌کنیم
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true })

        if (uploadError) throw uploadError

        // گرفتن لینک پابلیک عکس پس از آپلود
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        
        finalAvatarUrl = publicUrl
      }

      // آپدیت اطلاعات در دیتابیس
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          country: country,
          phone: phone,
          date_of_birth: dob,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error

      setProfileMessage({ type: 'success', text: 'Profile & Avatar updated successfully!' })
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 4000)
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile.' })
    } finally {
      setSavingProfile(false)
    }
  }

  // 3. Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' })
      setSavingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      setSavingPassword(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000)
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to change password.' })
    } finally {
      setSavingPassword(false)
    }
  }

  // 4. Handle Logout
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/user/login')
    } catch (error) {
      console.error("Error logging out:", error)
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-bold text-lg animate-pulse">Loading profile data...</p>
        </div>
      </div>
    )
  }

  // ایجاد نام نمایشی یا عکس پیش‌فرض
  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User'
  const displayAvatar = avatarPreview || `https://ui-avatars.com/api/?name=${displayName}&background=ffffff&color=4f46e5&bold=true&size=128`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Page Header with Logo */}
        <div className="mb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-500 font-medium">Update your personal details and secure your account.</p>
          </div>
          <div className="w-40 h-auto bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm hidden md:block">
            <img src="/Logo.png" alt="Asan Spot" className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ========================================= */}
          {/* LEFT COLUMN: Personal Information         */}
          {/* ========================================= */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
              
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                
                {/* --- Header & Avatar Upload Section --- */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
                  <div className="relative group cursor-pointer">
                    <div className={`w-28 h-28 rounded-full border-4 border-slate-50 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.2)] flex items-center justify-center overflow-hidden bg-slate-100 transition-all duration-300 ${!avatarPreview ? 'border-dashed border-slate-300' : ''}`}>
                      <img 
                        src={displayAvatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute inset-1 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-center sm:text-left mt-2">
                    <h2 className="text-2xl font-extrabold text-slate-900">{displayName}</h2>
                    <p className="text-slate-500 font-medium mb-3">{email}</p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      <UploadCloud className="w-4 h-4" /> Click photo to upload
                    </div>
                  </div>
                </div>

                {profileMessage.text && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {profileMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {profileMessage.text}
                  </div>
                )}

                {/* Form Fields - Beautifully Redesigned */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth (NEW) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                      >
                        <option value="" disabled>Select Country</option>
                        <option value="UK">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="AF">Afghanistan</option>
                        <option value="AE">UAE</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        placeholder="+44 123 456 7890"
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-slate-400 font-normal ml-1">(Cannot be changed)</span></label>
                    <div className="relative opacity-70">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold cursor-not-allowed shadow-inner"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.6)] hover:shadow-[0_12px_25px_-6px_rgba(79,70,229,0.8)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {savingProfile ? 'Saving Changes...' : 'Save All Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* --- Log Out Section --- */}
            <div className="bg-white rounded-[2rem] p-8 border border-red-100 shadow-[0_10px_40px_-15px_rgba(239,68,68,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Account Access</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Securely log out of your current session.</p>
              </div>
              <button 
                onClick={handleLogout} 
                disabled={loggingOut}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 disabled:opacity-70 border border-red-100 hover:border-red-600 shadow-sm"
              >
                {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                {loggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>

          </div>

          {/* ========================================= */}
          {/* RIGHT COLUMN: Password & Security           */}
          {/* ========================================= */}
          <div className="w-full lg:w-1/3 space-y-8">
            
            {/* Password Form Box */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Security</h2>
                  <p className="text-slate-500 text-sm font-medium">Update your password.</p>
                </div>
              </div>

              {passwordMessage.text && (
                <div className={`p-4 mb-6 rounded-2xl flex items-center gap-3 font-bold text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-md disabled:opacity-70"
                  >
                    {savingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    {savingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}