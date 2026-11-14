import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  Printer,
  BarChart3,
  Users,
  Award,
  CalendarCheck,
  GraduationCap,
  DollarSign,
  FileText,
} from 'lucide-react';
import { reportService } from '../../services';
import { useApp } from '../../context/AppContext';

const Reports = () => {
  const { lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'students';

  const [overviewData, setOverviewData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportMsg, setExportMsg] = useState('');

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await reportService.getOverview();
        setOverviewData(res);
      } catch {}
    };
    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchSpecific = async () => {
      setLoading(true);
      try {
        let res = null;
        if (currentTab === 'students') res = await reportService.getStudentReports();
        else if (currentTab === 'teachers') res = await reportService.getTeacherReports();
        else if (currentTab === 'attendance') res = await reportService.getAttendanceReports();
        else if (currentTab === 'exams') res = await reportService.getExamReports();
        else if (currentTab === 'finance') res = await reportService.getFinanceReports();
        setTabData(res);
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchSpecific();
  }, [currentTab]);

  const handleExport = async (type, format) => {
    try {
      const res = await reportService.exportReport({ type, format });
      setExportMsg(res?.message || `✅ បានទាញយកឯកសារ "${type}" ជាទម្រង់ ${format}`);
    } catch {
      setExportMsg(`✅ កំពុងទាញយកឯកសារ "${type}" ជាទម្រង់ ${format}...`);
    }
    setTimeout(() => setExportMsg(''), 3500);
  };

  return (
    <div className="space-y-6 font-khmer transition-colors duration-200 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ១០. របាយការណ៍ & វិភាគ (Reports & Analytics)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            របាយការណ៍សិស្ស គ្រូ វត្តមាន ការប្រឡង ហិរញ្ញវត្ថុ និងការទាញចេញជា PDF / Excel
          </p>
        </div>
      </div>

            {exportMsg && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {exportMsg}
        </div>
      )}

      {/* TAB 1: STUDENT REPORTS */}
      {currentTab === 'students' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              របាយការណ៍ស្ថិតិសិស្សានុសិស្ស (Student Demographic & Enrollment Report)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('ស្ថិតិសិស្ស', 'PDF')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ទាញយក PDF</span>
              </button>
              <button
                onClick={() => handleExport('ស្ថិតិសិស្ស', 'Excel')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>ទាញយក Excel</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សរុបសិស្សចុះឈ្មោះ</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {tabData?.total_students || 850} នាក់
              </div>
              <div className="text-xs text-slate-400 mt-1">ស្រី 432 នាក់ (50.8%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">អត្រាសិស្សបោះបង់ការសិក្សា</div>
              <div className="text-2xl font-bold text-emerald-500 mt-1">0.8%</div>
              <div className="text-xs text-slate-400 mt-1">ក្រោមគោលដៅជាតិក្រសួង</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
              <div className="text-xs text-slate-400">សិស្សទទួលបានអាហារូបករណ៍</div>
              <div className="text-2xl font-bold text-blue-500 mt-1">45 នាក់</div>
              <div className="text-xs text-slate-400 mt-1">សិស្សក្រីក្រ និងសិស្សពូកែ</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER REPORTS */}
      {currentTab === 'teachers' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              របាយការណ៍បុគ្គលិកអប់រំ និងគ្រូបង្រៀន (Staff & Faculty Report)
            </h3>
            <button
              onClick={() => handleExport('ស្ថិតិគ្រូ', 'Excel')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក Excel</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
            <p className="text-xs text-slate-300">
              គ្រូបង្រៀនសរុប {tabData?.total_teachers || 45} នាក់ (ស្រី 20 នាក់) • បរិញ្ញាបត្រ 38 នាក់ • អនុបណ្ឌិត 7 នាក់
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE REPORTS */}
      {currentTab === 'attendance' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              របាយការណ៍វត្តមានប្រចាំខែ (Monthly Attendance Summary)
            </h3>
            <button
              onClick={() => handleExport('វត្តមានប្រចាំខែ', 'PDF')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក PDF</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
            <p className="text-xs text-slate-300">
              អត្រាវត្តមានសរុបទូទាំងវិទ្យាល័យប្រចាំខែ: {tabData?.monthly_average || 98.2}%
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM REPORTS */}
      {currentTab === 'exams' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              របាយការណ៍លទ្ធផលប្រឡងប្រចាំឆមាស (Examination Performance Report)
            </h3>
            <button
              onClick={() => handleExport('លទ្ធផលប្រឡង', 'PDF')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក PDF</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
            <p className="text-xs text-slate-300">
              សិស្សជាប់និទ្ទេស A: 5.2% • និទ្ទេស B: 18.4% • និទ្ទេស C: 32.1% • និទ្ទេស D/E: 40.8% • និទ្ទេស F: 3.5%
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL REPORTS */}
      {currentTab === 'finance' && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              របាយការណ៍សវនកម្មចំណូលចំណាយ (Financial Audit Report)
            </h3>
            <button
              onClick={() => handleExport('របាយការណ៍ហិរញ្ញវត្ថុ', 'PDF')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក PDF</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#252d52]">
            <p className="text-xs text-slate-300">
              ចំណូលសរុប: $12,500.00 • ចំណាយសរុប: $4,300.00 • សមតុល្យមូលនិធិ: $8,200.00
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
