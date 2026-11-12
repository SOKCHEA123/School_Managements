import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';

const Grades = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'batch';
  const [activeTab, setActiveTab] = useState(initialTab); // 'batch', 'list', 'lock'

  // Master Data
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  // Tab 1: Batch Input State
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('semester_1');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [classStudents, setClassStudents] = useState([]);
  const [scores, setScores] = useState({}); // { [student_id]: score }
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);
  const [batchMessage, setBatchMessage] = useState({ type: '', text: '' });

  // Tab 2: Grade List State
  const [gradesList, setGradesList] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Tab 3: Lock State
  const [lockYear, setLockYear] = useState('');
  const [lockMonth, setLockMonth] = useState('1');
  const [lockClass, setLockClass] = useState('');
  const [locking, setLocking] = useState(false);
  const [lockMessage, setLockMessage] = useState({ type: '', text: '' });

  // Fetch Master Data (Classrooms, Subjects, Academic Years)
  useEffect(() => {
    const fetchMasterData = async () => {
      setLoadingMaster(true);
      try {
        const [cRes, sRes, yRes] = await Promise.all([
          API.get('/admin/classrooms'),
          API.get('/admin/subjects'),
          API.get('/admin/academic-years'),
        ]);

        const cData = cRes.data || [];
        const sData = sRes.data || [];
        const yData = yRes.data || [];

        setClassrooms(cData);
        setSubjects(sData);
        setAcademicYears(yData);

        if (cData.length > 0) setSelectedClass(cData[0].id.toString());
        if (sData.length > 0) setSelectedSubject(sData[0].id.toString());
        if (yData.length > 0) {
          setSelectedYear(yData[0].id.toString());
          setLockYear(yData[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load master data', err);
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Students for Batch Input
  const handleLoadStudentsForBatch = async () => {
    if (!selectedClass) {
      setBatchMessage({ type: 'error', text: 'សូមជ្រើសរើសថ្នាក់រៀនជាមុនសិន!' });
      return;
    }
    setLoadingStudents(true);
    setBatchMessage({ type: '', text: '' });
    try {
      const res = await API.get('/admin/students', {
        params: { classroom_id: selectedClass }
      });
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setClassStudents(list);

      // Reset scores dictionary
      const initialScores = {};
      list.forEach((st) => {
        initialScores[st.id] = '';
      });
      setScores(initialScores);

      if (list.length === 0) {
        setBatchMessage({ type: 'info', text: 'មិនមានសិស្សក្នុងថ្នាក់រៀននេះទេ' });
      }
    } catch (err) {
      setBatchMessage({
        type: 'error',
        text: err.response?.data?.message || 'មិនអាចទាញយកបញ្ជីសិស្សបានទេ'
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle score change
  const handleScoreChange = (studentId, val) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: val,
    }));
  };

  // Submit Batch Grades
  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    if (classStudents.length === 0) {
      setBatchMessage({ type: 'error', text: 'មិនមានសិស្សដើម្បីបញ្ចូលពិន្ទុទេ!' });
      return;
    }

    const gradesPayload = [];
    for (const st of classStudents) {
      const scoreVal = scores[st.id];
      if (scoreVal === '' || scoreVal === undefined || scoreVal === null) {
        continue; // Skip unfilled
      }
      const num = parseFloat(scoreVal);
      if (isNaN(num) || num < 0 || num > 100) {
        setBatchMessage({
          type: 'error',
          text: `ពិន្ទុរបស់សិស្ស ${st.full_name_km || st.student_code} មិនត្រឹមត្រូវ (ត្រូវចន្លោះពី 0 ដល់ 100)`
        });
        return;
      }
      gradesPayload.push({
        student_id: st.id,
        score: num,
      });
    }

    if (gradesPayload.length === 0) {
      setBatchMessage({ type: 'error', text: 'សូមបញ្ចូលពិន្ទុយ៉ាងហោចណាស់សិស្សម្នាក់!' });
      return;
    }

    setSavingBatch(true);
    setBatchMessage({ type: '', text: '' });
    try {
      const res = await API.post('/admin/grades/batch', {
        classroom_id: parseInt(selectedClass, 10),
        subject_id: parseInt(selectedSubject, 10),
        academic_year_id: parseInt(selectedYear, 10),
        month: parseInt(selectedMonth, 10),
        semester: selectedSemester,
        grades: gradesPayload,
      });

      setBatchMessage({
        type: 'success',
        text: res.data?.message || `រក្សាទុកពិន្ទុសិស្ស ${gradesPayload.length} នាក់បានជោគជ័យ!`
      });
    } catch (err) {
      setBatchMessage({
        type: 'error',
        text: err.response?.data?.message || 'បរាជ័យក្នុងការរក្សាទុកពិន្ទុ'
      });
    } finally {
      setSavingBatch(false);
    }
  };

  // Fetch Grades List (Tab 2)
  const fetchGradesList = useCallback(async () => {
    setLoadingGrades(true);
    try {
      const params = {};
      if (filterClass) params.classroom_id = filterClass;
      if (filterSubject) params.subject_id = filterSubject;
      if (filterYear) params.academic_year_id = filterYear;
      if (filterMonth) params.month = filterMonth;

      const res = await API.get('/admin/grades', { params });
      const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setGradesList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGrades(false);
    }
  }, [filterClass, filterSubject, filterYear, filterMonth]);

  useEffect(() => {
    if (activeTab === 'list') {
      fetchGradesList();
    }
  }, [activeTab, fetchGradesList]);

  // Submit Lock Grades (Tab 3)
  const handleLockGrades = async (e) => {
    e.preventDefault();
    if (!window.confirm('តើអ្នកប្រាកដជាចង់ចាក់សោពិន្ទុសម្រាប់ខែនេះមែនទេ? នៅពេលចាក់សោរួច នឹងមិនអាចកែប្រែបានទៀតទេ។')) {
      return;
    }

    setLocking(true);
    setLockMessage({ type: '', text: '' });
    try {
      const payload = {
        academic_year_id: parseInt(lockYear, 10),
        month: parseInt(lockMonth, 10),
      };
      if (lockClass) payload.classroom_id = parseInt(lockClass, 10);

      const res = await API.post('/admin/grades/lock', payload);
      setLockMessage({
        type: 'success',
        text: res.data?.message || `ចាក់សោពិន្ទុជោគជ័យ! (${res.data?.locked_records || 0} កំណត់ត្រា)`
      });
    } catch (err) {
      setLockMessage({
        type: 'error',
        text: err.response?.data?.message || 'មិនអាចចាក់សោពិន្ទុបានទេ'
      });
    } finally {
      setLocking(false);
    }
  };

  const months = [
    { id: 1, name: 'មករា (January)' },
    { id: 2, name: 'កុម្ភៈ (February)' },
    { id: 3, name: 'មីនា (March)' },
    { id: 4, name: 'មេសា (April)' },
    { id: 5, name: 'ឧសភា (May)' },
    { id: 6, name: 'មិថុនា (June)' },
    { id: 7, name: 'កក្កដា (July)' },
    { id: 8, name: 'សីហា (August)' },
    { id: 9, name: 'កញ្ញា (September)' },
    { id: 10, name: 'តុលា (October)' },
    { id: 11, name: 'វិច្ឆិកា (November)' },
    { id: 12, name: 'ធ្នូ (December)' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          គ្រប់គ្រងពិន្ទុសិស្ស (Grades Management)
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          បញ្ចូលពិន្ទុតាមថ្នាក់ មើលបញ្ជីពិន្ទុ និងចាក់សោពិន្ទុប្រចាំខែ
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid #e5e7eb',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => setActiveTab('batch')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'batch' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'batch' ? '#2563eb' : '#6b7280',
            fontWeight: activeTab === 'batch' ? '600' : '500',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '-2px',
          }}
        >
          📝 បញ្ចូលពិន្ទុជាក្រុម (Batch Entry)
        </button>

        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'list' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'list' ? '#2563eb' : '#6b7280',
            fontWeight: activeTab === 'list' ? '600' : '500',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '-2px',
          }}
        >
          📋 បញ្ជីពិន្ទុ (View Grades)
        </button>

        <button
          onClick={() => setActiveTab('lock')}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'lock' ? '3px solid #dc2626' : '3px solid transparent',
            color: activeTab === 'lock' ? '#dc2626' : '#6b7280',
            fontWeight: activeTab === 'lock' ? '600' : '500',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '-2px',
          }}
        >
          🔒 ចាក់សោពិន្ទុ (Lock Grades)
        </button>
      </div>

      {/* Loading Master State */}
      {loadingMaster ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>
          កំពុងទាញយកទិន្នន័យចាំបាច់...
        </div>
      ) : (
        <>
          {/* TAB 1: BATCH GRADE INPUT */}
          {activeTab === 'batch' && (
            <div>
              {/* Filter / Selector Card */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                marginBottom: '24px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                  ជ្រើសរើសព័ត៌មានថ្នាក់ និងមុខវិជ្ជា
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  {/* Academic Year */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ឆ្នាំសិក្សា (Academic Year)
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {academicYears.map((y) => (
                        <option key={y.id} value={y.id}>{y.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Classroom */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ថ្នាក់រៀន (Classroom)
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      មុខវិជ្ជា (Subject)
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ឆមាស (Semester)
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      <option value="semester_1">ឆមាសទី ១ (Semester 1)</option>
                      <option value="semester_2">ឆមាសទី ២ (Semester 2)</option>
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ខែ (Month)
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {months.map((m) => (
                        <option key={m.id} value={m.id}>ខែ {m.id} - {m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleLoadStudentsForBatch}
                    disabled={loadingStudents}
                    style={{
                      padding: '9px 20px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: loadingStudents ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {loadingStudents ? 'កំពុងទាញយក...' : '📥 ទាញយកបញ្ជីសិស្សមកបញ្ចូលពិន្ទុ'}
                  </button>
                </div>
              </div>

              {/* Message Alerts */}
              {batchMessage.text && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  background: batchMessage.type === 'success' ? '#dcfce7' : batchMessage.type === 'error' ? '#fee2e2' : '#eff6ff',
                  color: batchMessage.type === 'success' ? '#166534' : batchMessage.type === 'error' ? '#991b1b' : '#1e40af',
                  border: `1px solid ${batchMessage.type === 'success' ? '#bbf7d0' : batchMessage.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
                }}>
                  {batchMessage.text}
                </div>
              )}

              {/* Students Table for Score Entry */}
              {classStudents.length > 0 && (
                <form onSubmit={handleSubmitBatch}>
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f9fafb',
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#111827' }}>
                        បញ្ជីសិស្សសរុប: {classStudents.length} នាក់
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        * ពិន្ទុអតិបរមា: 100
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', color: '#4b5563', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '12px 16px' }}>ល.រ</th>
                          <th style={{ padding: '12px 16px' }}>អត្តលេខ</th>
                          <th style={{ padding: '12px 16px' }}>ឈ្មោះខ្មែរ</th>
                          <th style={{ padding: '12px 16px' }}>ឈ្មោះឡាតាំង</th>
                          <th style={{ padding: '12px 16px' }}>ភេទ</th>
                          <th style={{ padding: '12px 16px', width: '160px' }}>ពិន្ទុ (Score 0-100)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map((st, idx) => (
                          <tr key={st.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '12px 16px', color: '#6b7280' }}>{idx + 1}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>
                              {st.student_code}
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1f2937' }}>
                              {st.full_name_km || '—'}
                            </td>
                            <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                              {st.full_name_en || '—'}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: st.gender === 'F' ? '#fce7f3' : '#dbeafe',
                                color: st.gender === 'F' ? '#be185d' : '#1d4ed8',
                              }}>
                                {st.gender === 'F' ? 'ស្រី (F)' : 'ប្រុស (M)'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0 - 100"
                                value={scores[st.id] !== undefined ? scores[st.id] : ''}
                                onChange={(e) => handleScoreChange(st.id, e.target.value)}
                                style={{
                                  width: '120px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #d1d5db',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#111827',
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        type="submit"
                        disabled={savingBatch}
                        style={{
                          padding: '10px 28px',
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: savingBatch ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {savingBatch ? 'កំពុងរក្សាទុក...' : '💾 រក្សាទុកពិន្ទុទាំងអស់ (Save All)'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: VIEW GRADES LIST */}
          {activeTab === 'list' && (
            <div>
              {/* Filter Bar */}
              <div style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '20px',
                alignItems: 'end',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                    ថ្នាក់រៀន
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="">-- គ្រប់ថ្នាក់ --</option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                    មុខវិជ្ជា
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="">-- គ្រប់មុខវិជ្ជា --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>
                    ខែ
                  </label>
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
                  >
                    <option value="">-- គ្រប់ខែ --</option>
                    {months.map((m) => (
                      <option key={m.id} value={m.id}>ខែ {m.id} - {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={fetchGradesList}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    🔍 ស្វែងរក
                  </button>
                </div>
              </div>

              {/* Table */}
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', color: '#4b5563', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px 16px' }}>ល.រ</th>
                      <th style={{ padding: '12px 16px' }}>អត្តលេខ</th>
                      <th style={{ padding: '12px 16px' }}>សិស្ស</th>
                      <th style={{ padding: '12px 16px' }}>មុខវិជ្ជា</th>
                      <th style={{ padding: '12px 16px' }}>ឆមាស</th>
                      <th style={{ padding: '12px 16px' }}>ខែ</th>
                      <th style={{ padding: '12px 16px' }}>ពិន្ទុ</th>
                      <th style={{ padding: '12px 16px' }}>ស្ថានភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingGrades ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                          កំពុងទាញយកទិន្នន័យ...
                        </td>
                      </tr>
                    ) : gradesList.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                          មិនទាន់មានទិន្នន័យពិន្ទុទេ
                        </td>
                      </tr>
                    ) : (
                      gradesList.map((g, idx) => (
                        <tr key={g.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 16px', color: '#6b7280' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                            {g.student?.student_code || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111827' }}>
                            {g.student?.full_name_km || g.student?.full_name_en || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#374151' }}>
                            {g.subject?.name || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                            {g.semester === 'semester_1' ? 'ឆមាសទី ១' : 'ឆមាសទី ២'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                            ខែ {g.month}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontWeight: 'bold',
                              fontSize: '15px',
                              color: g.score >= 50 ? '#16a34a' : '#dc2626',
                            }}>
                              {g.score}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {g.is_locked ? (
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#fee2e2',
                                color: '#991b1b',
                              }}>
                                🔒 ចាក់សោ
                              </span>
                            ) : (
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#dcfce7',
                                color: '#166534',
                              }}>
                                ✏️ អាចកែប្រែបាន
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LOCK GRADES */}
          {activeTab === 'lock' && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #fecaca',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    🔒
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#111827' }}>
                      ចាក់សោពិន្ទុប្រចាំខែ (Lock Monthly Grades)
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                      នៅពេលចាក់សោរួច គ្រូបង្រៀនមិនអាចកែប្រែពិន្ទុសម្រាប់កាលបរិច្ឆេទនេះបានឡើយ
                    </p>
                  </div>
                </div>

                {lockMessage.text && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    background: lockMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: lockMessage.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${lockMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    {lockMessage.text}
                  </div>
                )}

                <form onSubmit={handleLockGrades}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ឆ្នាំសិក្សា (Academic Year) *
                    </label>
                    <select
                      value={lockYear}
                      onChange={(e) => setLockYear(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {academicYears.map((y) => (
                        <option key={y.id} value={y.id}>{y.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ខែដែលត្រូវចាក់សោ (Month to Lock) *
                    </label>
                    <select
                      value={lockMonth}
                      onChange={(e) => setLockMonth(e.target.value)}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      {months.map((m) => (
                        <option key={m.id} value={m.id}>ខែ {m.id} - {m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      ថ្នាក់រៀនជាក់លាក់ (ទុកទំនេរប្រសិនបើចង់ចាក់សោគ្រប់ថ្នាក់)
                    </label>
                    <select
                      value={lockClass}
                      onChange={(e) => setLockClass(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
                    >
                      <option value="">-- ចាក់សោគ្រប់ថ្នាក់ក្នុងខែនេះ (All Classes) --</option>
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={locking}
                    style={{
                      width: '100%',
                      padding: '11px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: locking ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {locking ? 'កំពុងចាក់សោ...' : '🔒 បញ្ជាក់ការចាក់សោពិន្ទុ (Confirm Lock)'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Grades;
