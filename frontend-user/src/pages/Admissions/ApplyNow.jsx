import React from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MessageSquare,
  Send,
} from 'lucide-react';

const ApplyNow = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#1a1e4a] text-slate-800 dark:text-slate-100 rounded-2xl shadow-sm border border-slate-200 dark:border-[#2a3163] mt-6 transition-colors duration-300">
      {/* Header Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Apply Now
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
        សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីដាក់ពាក្យស្នើសុំចូលសិក្សាជាមួយស្ថាប័នរបស់យើង។
      </p>

      {/* Application Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ឈ្មោះពេញ (Full Name)
            </label>
            <input
              type="text"
              placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              អ៊ីមែល (Email Address)
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              លេខទូរស័ព្ទ (Phone Number)
            </label>
            <input
              type="tel"
              placeholder="012 345 678"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Major Selection */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ជំនាញដែលចង់សិក្សា (Major)
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
              <option value="">ជ្រើសរើសជំនាញ</option>
              <option value="it">វិទ្យាសាស្ត្រកុំព្យូទ័រ (Information Technology)</option>
              <option value="business">អភិបាលកិច្ច និងធុរកិច្ច (Business Administration)</option>
              <option value="english">អក្សរសាស្ត្រអង់គ្លេស (English Literature)</option>
              <option value="finance">ហិរញ្ញវត្ថុ និងធនាគារ (Finance & Banking)</option>
            </select>
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            មតិយោបល់ ឬសំណួរបន្ថែម (Additional Notes)
          </label>
          <textarea
            rows="4"
            placeholder="សរសេរព័ត៌មានលម្អិតបន្ថែមនៅទីនេះ..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors duration-300"
        >
          <Send className="w-4 h-4" />
          ដាក់ពាក្យស្នើសុំឥឡូវនេះ (Submit Application)
        </button>
      </form>
    </div>
  );
};

export default ApplyNow;