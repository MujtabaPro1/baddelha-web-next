'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, ChevronRight, AlertCircle, Pencil, X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '../../services/profileService';

interface UserDetails {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const { language } = useLanguage();
  const router = useRouter();
  const isAr = language === 'ar';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(isAr ? 'يرجى تسجيل الدخول أولاً' : 'Please login to view your profile.');
      setLoading(false);
      return;
    }
  
    getUserProfile();
  }, []);

  const getUserProfile = ()=> {
      getProfile()
      .then((res: any) => {
        const profile = res;
        console.log(profile);
        setUser(profile);
        setForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
        });
      })
      .catch(() => {
        setError(isAr ? 'خطأ في تحميل البيانات' : 'Failed to load profile data.');
      })
      .finally(() => setLoading(false));
  }


  const handleEdit = () => {
    setSaveError(null);
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await updateProfile(form);
      const updated = res.data;
      setUser((prev) => ({ ...prev, ...updated }));
      setEditing(false);
      getUserProfile();
    } catch {
      setSaveError(isAr ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayPhone = user?.phone ? user.phone.replace(/^\+966/, '') : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-8 mt-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8 mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 mt-6 sm:mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isAr ? 'الملف الشخصي' : 'My Profile'}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            {isAr ? 'معلومات حسابك الشخصي' : 'Your account information'}
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              {isAr ? 'تسجيل الدخول' : 'Go to Login'}
            </button>
          </div>
        ) : user ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Avatar / Header */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 px-6 py-8 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-orange-500 text-2xl font-bold">
                {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-orange-100 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Edit Form */}
            {editing ? (
              <div className="px-6 py-5 space-y-4">
                {saveError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {saveError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {isAr ? 'الاسم الأول' : 'First Name'}
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {isAr ? 'اسم العائلة' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-60 transition"
                  >
                    <Check className="h-4 w-4" />
                    {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-md disabled:opacity-60 transition"
                  >
                    <X className="h-4 w-4" />
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Details */}
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center px-6 py-4 gap-4">
                    <div className="h-9 w-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isAr ? 'الاسم الكامل' : 'Full Name'}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center px-6 py-4 gap-4">
                    <div className="h-9 w-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
                      <p className="text-sm font-medium text-gray-900">{user.email || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center px-6 py-4 gap-4">
                    <div className="h-9 w-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{isAr ? 'رقم الهاتف' : 'Phone'}</p>
                      <p className="text-sm font-medium text-gray-900 ltr" dir="ltr">
                        {displayPhone ? `+966 ${displayPhone}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 px-6 py-4 space-y-1">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-orange-500 transition"
                  >
                    <span>{isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push('/appointments')}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-orange-500 transition"
                  >
                    <span>{isAr ? 'مواعيدي' : 'My Appointments'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfilePage;
