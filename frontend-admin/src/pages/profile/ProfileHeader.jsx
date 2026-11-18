import React from 'react';
import { User, Mail, Camera, ShieldCheck, Building } from 'lucide-react';

const ProfileHeader = ({ profile, onAvatarClick }) => {
  const displayName = profile?.name || 'Admin';
  const displayRole = profile?.role || 'Administrator';
  const displayEmail = profile?.email || 'admin@example.com';
  const schoolName = profile?.school_name || 'វិទ្យាល័យ ហ៊ុន សែន ស្នួល';

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1a1e4a] border border-slate-200 dark:border-[#2a3163] shadow-sm overflow-hidden mb-6">
      {/* Cover */}
      <div className="h-28 sm:h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 relative">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Content */}
      <div className="px-5 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
          {/* Avatar + Info */}
          <div className="flex items-end gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl font-semibold ring-4 ring-white dark:ring-[#1a1e4a] shadow-md shadow-indigo-600/20 overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials || <User className="w-9 h-9" />}</span>
                )}
              </div>
              <button
                type="button"
                title="ប្តូររូបថត Profile"
                onClick={onAvatarClick}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-indigo-600 text-white border border-indigo-500 shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 pb-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  សកម្ម
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">{displayEmail}</span>
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-500/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              {displayRole}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-500/25">
              <Building className="w-3.5 h-3.5" />
              <span className="truncate max-w-[160px]">{schoolName}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;