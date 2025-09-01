import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import ProtectedRoute from '../components/ProtectedRoute';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, ReferenceLine, Legend, Cell } from 'recharts';


// API Base URL configuration
const getApiBase = () => {
  // Check for environment variable first
  const envApiBase = import.meta.env.VITE_API_BASE;

  // If environment variable is set and doesn't look like a frontend URL, use it
  if (envApiBase && !envApiBase.includes('azurestaticapps.net')) {
    return envApiBase;
  }

  // Default to the Azure backend API
  return 'https://hospital-readmission-backend-api-e5fsevbxggfhdxbr.southindia-01.azurewebsites.net';
};

const API_BASE = getApiBase();

// Fallback API URLs in case the primary one fails
const FALLBACK_APIS = [
  'https://hospital-readmission-backend-api-e5fsevbxggfhdxbr.southindia-01.azurewebsites.net',
  'http://127.0.0.1:8000',
  'http://localhost:8000'
];

const DIAG_OPTIONS = [
  { value: '', label: 'Select diagnosis' },
  { value: 'Diabetes', label: 'Diabetes' },
  { value: 'Circulatory', label: 'Circulatory' },
  { value: 'Respiratory', label: 'Respiratory' },
  { value: 'Digestive', label: 'Digestive' },
  { value: 'Injury', label: 'Injury' },
  { value: 'Musculoskeletal', label: 'Musculoskeletal' },
  { value: 'Other', label: 'Other' }
];

const AGE_OPTIONS = [
  { value: '', label: 'Select age group' },
  { value: '[0-10)', label: '[0-10)' },
  { value: '[10-20)', label: '[10-20)' },
  { value: '[20-30)', label: '[20-30)' },
  { value: '[30-40)', label: '[30-40)' },
  { value: '[40-50)', label: '[40-50)' },
  { value: '[50-60)', label: '[50-60)' },
  { value: '[60-70)', label: '[60-70)' },
  { value: '[70-80)', label: '[70-80)' },
  { value: '[80-90)', label: '[80-90)' },
  { value: '[90-100)', label: '[90-100)' }
];

const SPECIALTY_OPTIONS = [
  { value: '', label: 'Select medical specialty' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'InternalMedicine', label: 'Internal Medicine' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Endocrinology', label: 'Endocrinology' },
  { value: 'Pulmonology', label: 'Pulmonology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Other', label: 'Other' }
];

// Helper function to calculate proper chart domain bounds
const calculateChartDomain = (data) => {
  if (!data || data.length === 0) return [-0.01, 0.01];
  
  const values = data.map(d => d.value).filter(v => Number.isFinite(v));
  if (values.length === 0) return [-0.01, 0.01];
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Handle very small ranges to prevent scaling issues
  if (Math.abs(range) < 0.001) {
    return [-0.005, 0.005];
  }
  
  // Add padding to prevent bars from touching the edges
  const padding = Math.max(range * 0.1, 0.001);
  
  return [min - padding, max + padding];
};

const DashboardPage = () => {
  const [user] = useAuthState(auth);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Toggle between input modes
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'manual'

  // Manual entry form state
  const [manual, setManual] = useState({
    patient_id: '',
    age: '',
    time_in_hospital: 1,
    n_lab_procedures: 0,
    n_procedures: 0,
    n_medications: 0,
    n_outpatient: 0,
    n_inpatient: 0,
    n_emergency: 0,
    medical_specialty: '',
    diag_1: '',
    diag_2: '',
    diag_3: '',
    glucose_test: '',
    A1Ctest: '',
    change: '',
    diabetes_med: ''
  });
  const [manualError, setManualError] = useState('');
  const [apiStatus, setApiStatus] = useState({ connected: false, endpoint: '', checking: true });

  const acceptedExtensions = useMemo(() => ['.xls', '.xlsx'], []);

  // Check API status on component mount
  React.useEffect(() => {
    const checkApiStatus = async () => {
      setApiStatus({ connected: false, endpoint: '', checking: true });

      const apiUrls = [API_BASE, ...FALLBACK_APIS.filter(url => url !== API_BASE)];

      for (const baseUrl of apiUrls) {
        try {
          const isHealthy = await checkApiHealth(baseUrl);
          if (isHealthy) {
            setApiStatus({ connected: true, endpoint: baseUrl, checking: false });
            return;
          }
        } catch (error) {
          console.error(`API status check failed for ${baseUrl}:`, error);
        }
      }

      setApiStatus({ connected: false, endpoint: '', checking: false });
    };

    checkApiStatus();
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const isExcelFile = (fileName) => {
    const lower = (fileName || '').toLowerCase();
    return acceptedExtensions.some((ext) => lower.endsWith(ext));
  };

  const readExcelToJson = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const sheetName = wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(ws, { defval: null });
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const mapRowToPatient = (row) => {
    // Try to map common variants to backend expected schema
    const get = (keys, fallback = null) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
        // case-insensitive fallback
        const foundKey = Object.keys(row).find((rk) => rk.toLowerCase() === String(k).toLowerCase());
        if (foundKey) return row[foundKey];
      }
      return fallback;
    };

    return {
      patient_id: get(['patient_id', 'patientid', 'id', 'patient_id']),
      age: get(['age']),
      medical_specialty: get(['medical_specialty', 'specialty', 'speciality']),
      n_outpatient: Number(get(['n_outpatient', 'outpatient_visits', 'n_out'], 0)) || 0,
      n_inpatient: Number(get(['n_inpatient', 'inpatient_visits', 'n_in'], 0)) || 0,
      n_emergency: Number(get(['n_emergency', 'emergency_visits', 'n_er'], 0)) || 0,
      n_procedures: Number(get(['n_procedures', 'procedures'], 0)) || 0,
      n_lab_procedures: Number(get(['n_lab_procedures', 'lab_procedures', 'labs'], 0)) || 0,
      n_medications: Number(get(['n_medications', 'medications', 'meds'], 0)) || 0,
      time_in_hospital: Number(get(['time_in_hospital', 'length_of_stay', 'los'], 1)) || 1,
      diag_1: get(['diag_1', 'diagnosis_1', 'primary_diag']),
      diag_2: get(['diag_2', 'diagnosis_2', 'secondary_diag']),
      diag_3: get(['diag_3', 'diagnosis_3', 'tertiary_diag'])
    };
  };

  const checkApiHealth = async (baseUrl) => {
    try {
      const res = await fetch(`${baseUrl}/health`);
      return res.ok;
    } catch (error) {
      console.error(`API health check failed for ${baseUrl}:`, error);
      return false;
    }
  };

  const callExplain = async (patient) => {
    // Prefer the endpoint discovered at startup; fall back only if needed
    const preferred = apiStatus?.endpoint && apiStatus.connected ? apiStatus.endpoint : API_BASE;
    const apiUrls = [preferred, ...FALLBACK_APIS.filter(url => url !== preferred)];

    for (const baseUrl of apiUrls) {
      try {
        // Remove patient_id from the payload sent to backend
        const { patient_id, ...patientDataForBackend } = patient;
        
        const res = await fetch(`${baseUrl}/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientDataForBackend)
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `HTTP ${res.status}: ${res.statusText}`);
        }

        const response = await res.json();
        // Add patient_id back to the response
        return { ...response, patient_id };
      } catch (error) {
        // Try next endpoint
        console.error(`POST /explain failed at ${baseUrl}:`, error);
        continue;
      }
    }

    throw new Error('All API endpoints failed for /explain.');
  };

  const processFile = useCallback(async (file) => {
    try {
      setUploadError('');
      setResults([]);
      setProcessing(true);
      if (!isExcelFile(file.name)) {
        setUploadError('Please upload an Excel file (.xls or .xlsx).');
        setProcessing(false);
        return;
      }
      const rows = await readExcelToJson(file);
      if (!rows || rows.length === 0) {
        setUploadError('No rows found in the uploaded file.');
        setProcessing(false);
        return;
      }
      const patients = rows.map(mapRowToPatient);
      setProgress({ done: 0, total: patients.length });

      const out = [];
      for (let i = 0; i < patients.length; i++) {
        try {
          const explanation = await callExplain(patients[i]);
          out.push({ index: i + 1, input: patients[i], ...explanation });
        } catch (err) {
          out.push({ index: i + 1, input: patients[i], error: String(err.message || err) });
        }
        setProgress({ done: i + 1, total: patients.length });
      }
      setResults(out);
      setSelectedIndex(0);
    } catch (e) {
      setUploadError(String(e.message || e));
    } finally {
      setProcessing(false);
    }
  }, []);

  const loadRandomSample = useCallback(async () => {
    setUploadError('');
    setProcessing(true);
    setResults([]);
    try {
      // Try to fetch a bundled sample list; fall back to a single synthetic row
      let samples = null;
      try {
        const r = await fetch('/assets/sample_patients.json');
        if (r.ok) {
          samples = await r.json();
        }
      } catch { }
      if (!samples || !Array.isArray(samples) || samples.length === 0) {
        samples = [
          {
            "patient_id": "P1226",
            "age": "[50-60)",
            "time_in_hospital": 3,
            "n_lab_procedures": 39,
            "n_procedures": 10,
            "n_medications": 79,
            "n_outpatient": 0,
            "n_inpatient": 10,
            "n_emergency": 9,
            "medical_specialty": "Other",
            "diag_1": "Respiratory",
            "diag_2": "Other",
            "diag_3": "Circulatory"
          }
        ];
      }
      const patient = samples[Math.floor(Math.random() * samples.length)];
      const explanation = await callExplain(patient);
      setResults([{ index: 1, input: patient, ...explanation }]);
      setSelectedIndex(0);
      setProgress({ done: 1, total: 1 });
    } catch (e) {
      setUploadError(String(e.message || e));
    } finally {
      setProcessing(false);
    }
  }, []);

  const exportResultsToXls = () => {
    if (!results || results.length === 0) return;
    const rows = results.map((r) => {
      const reasons = (r.reasons || []).join('\n');
      return {
        Index: r.index,
        'Patient ID': r.patient_id || '',
        Risk: r.risk_label || '',
        Probability: r.readmission_probability !== undefined ? Number(r.readmission_probability).toFixed(4) : '',
        Reasons: reasons,
        Error: r.error || ''
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Predictions');
    XLSX.writeFile(wb, 'readmission_predictions.xlsx');
  };

  const onManualChange = (e) => {
    const { name, value } = e.target;
    setManual((prev) => ({ ...prev, [name]: value }));
  };

  const submitManual = async () => {
    setManualError('');
    setProcessing(true);
    try {
      const payload = {
        patient_id: manual.patient_id || null,
        age: manual.age || null,
        medical_specialty: manual.medical_specialty || null,
        n_outpatient: Number(manual.n_outpatient) || 0,
        n_inpatient: Number(manual.n_inpatient) || 0,
        n_emergency: Number(manual.n_emergency) || 0,
        n_procedures: Number(manual.n_procedures) || 0,
        n_lab_procedures: Number(manual.n_lab_procedures) || 0,
        n_medications: Number(manual.n_medications) || 0,
        time_in_hospital: Number(manual.time_in_hospital) || 1,
        diag_1: manual.diag_1 || null,
        diag_2: manual.diag_2 || null,
        diag_3: manual.diag_3 || null,
        glucose_test: manual.glucose_test || null,
        A1Ctest: manual.A1Ctest || null,
        change: manual.change || null,
        diabetes_med: manual.diabetes_med || null
      };
      const explanation = await callExplain(payload);
      const newIndex = results.length + 1;
      const newRow = { index: newIndex, input: payload, ...explanation };
      setResults((prev) => [newRow, ...prev]);
      setSelectedIndex(0);
    } catch (e) {
      setManualError(String(e.message || e));
    } finally {
      setProcessing(false);
    }
  };

  const selectedResult = results[selectedIndex] || null;
  const chartData = useMemo(() => {
    if (!selectedResult || !selectedResult.top_contributions) return [];
    
    const items = selectedResult.top_contributions
      .filter(c => c && typeof c.shap_value === 'number' && Number.isFinite(c.shap_value))
      .map((c) => ({
        feature: c.feature ? c.feature.split('__').slice(-1)[0] : 'Unknown',
        value: parseFloat(c.shap_value) || 0,
        direction: c.shap_value >= 0 ? 'positive' : 'negative'
      }));
    
    // Sort by absolute impact descending
    items.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    
    // Ensure we have valid data for chart scaling
    if (items.length === 0) return [];
    
    return items;
  }, [selectedResult]);

  const colorFor = (v) => (v >= 0 ? '#ef4444' : '#10b981'); // red for +risk, green for -risk

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.email || 'User'}!</p>
              </div>
              <div className="flex items-center gap-2">
                {apiStatus.checking ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Checking API...</span>
                  </div>
                ) : apiStatus.connected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">API Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">API Disconnected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* API Status Warning */}
          {!apiStatus.checking && !apiStatus.connected && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">API Connection Issue</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>The backend API is currently unreachable. This may be due to:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Backend service is down or restarting</li>
                      <li>Network connectivity issues</li>
                      <li>Incorrect API endpoint configuration</li>
                    </ul>
                    <p className="mt-2">Please try again later or contact support if the issue persists.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploader */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Provide input</h2>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button type="button" onClick={() => setInputMode('upload')} className={`px-4 py-2 text-sm font-medium border ${inputMode === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} rounded-l-md hover:bg-blue-50`}>
                  Upload Excel
                </button>
                <button type="button" onClick={() => setInputMode('manual')} className={`px-4 py-2 text-sm font-medium border ${inputMode === 'manual' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} rounded-r-md hover:bg-blue-50`}>
                  Manual entry
                </button>
              </div>
            </div>

            {inputMode === 'upload' && (
              <>
                <div
                  className={`flex items-center justify-center w-full ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">XLS or XLSX</p>
                    </div>
                    <input id="dropzone-file" type="file" accept=".xls,.xlsx" className="hidden" ref={fileInputRef} onChange={onFileChange} />
                  </label>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={handleBrowseClick} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Browse</button>
                  <button onClick={loadRandomSample} className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800">Use random sample</button>
                  {processing && (
                    <span className="text-sm text-gray-600">Processing {progress.done}/{progress.total}...</span>
                  )}
                </div>
                {uploadError && <p className="text-red-600 mt-3">{uploadError}</p>}
              </>
            )}

            {inputMode === 'manual' && (
              <>
                {/* Manual Entry */}
                <div className="mt-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Enter patient manually</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* patient_id */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Patient ID</label>
                      <input name="patient_id" value={manual.patient_id} onChange={onManualChange} type="text" placeholder="e.g. P001" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* age */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Age group</label>
                      <select name="age" value={manual.age} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {AGE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* time_in_hospital */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Time in hospital (days)</label>
                      <input name="time_in_hospital" value={manual.time_in_hospital} onChange={onManualChange} type="number" min="1" placeholder="e.g. 3" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_lab_procedures */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Lab procedures</label>
                      <input name="n_lab_procedures" value={manual.n_lab_procedures} onChange={onManualChange} type="number" min="0" placeholder="e.g. 20" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_procedures */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Procedures</label>
                      <input name="n_procedures" value={manual.n_procedures} onChange={onManualChange} type="number" min="0" placeholder="e.g. 2" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_medications */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Medications</label>
                      <input name="n_medications" value={manual.n_medications} onChange={onManualChange} type="number" min="0" placeholder="e.g. 10" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_outpatient */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Outpatient visits</label>
                      <input name="n_outpatient" value={manual.n_outpatient} onChange={onManualChange} type="number" min="0" placeholder="e.g. 0" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_inpatient */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Inpatient visits</label>
                      <input name="n_inpatient" value={manual.n_inpatient} onChange={onManualChange} type="number" min="0" placeholder="e.g. 1" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* n_emergency */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Emergency visits</label>
                      <input name="n_emergency" value={manual.n_emergency} onChange={onManualChange} type="number" min="0" placeholder="e.g. 0" className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* medical_specialty */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Medical specialty</label>
                      <select name="medical_specialty" value={manual.medical_specialty} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {SPECIALTY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* diag_1 */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Diagnosis 1</label>
                      <select name="diag_1" value={manual.diag_1} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {DIAG_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* diag_2 */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Diagnosis 2</label>
                      <select name="diag_2" value={manual.diag_2} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {DIAG_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* diag_3 */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Diagnosis 3</label>
                      <select name="diag_3" value={manual.diag_3} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {DIAG_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* glucose_test */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Glucose test</label>
                      <select name="glucose_test" value={manual.glucose_test} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {/* A1Ctest */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">A1C test</label>
                      <select name="A1Ctest" value={manual.A1Ctest} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {/* change */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Medication change</label>
                      <select name="change" value={manual.change} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    {/* diabetes_med */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">On diabetes medication</label>
                      <select name="diabetes_med" value={manual.diabetes_med} onChange={onManualChange} className="px-3 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={submitManual} className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Predict</button>
                    {manualError && <span className="text-red-600 text-sm">{manualError}</span>}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Results</h2>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600 hidden md:block">Click a row to visualize contributions</div>
                  <button onClick={exportResultsToXls} className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Export as XLS</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasons</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((r, idx) => (
                      <tr key={r.index} onClick={() => setSelectedIndex(idx)} className={`cursor-pointer ${idx === selectedIndex ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-2 text-sm text-gray-700">{r.index}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{r.patient_id || '-'}</td>
                        <td className="px-4 py-2">
                          {r.error ? (
                            <span className="text-red-600 text-sm">Error</span>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${r.risk_label === 'High risk' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{r.risk_label || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">{r.readmission_probability !== undefined ? r.readmission_probability.toFixed(3) : '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {r.error ? (
                            <span className="text-red-600">{r.error}</span>
                          ) : (
                            <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-auto pr-3">
                              {(r.reasons || []).map((reason, rIdx) => (
                                <li key={rIdx}>{reason}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart */}
              {selectedResult && !selectedResult.error && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Feature contributions (SHAP)</h3>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#ef4444' }}></span> increases risk
                      <span className="inline-block w-3 h-3 rounded-sm ml-3" style={{ background: '#10b981' }}></span> decreases risk
                    </div>
                  </div>
                  <div className="w-full h-[500px]">
                    {/* Debug info for chart scaling */}
                    {chartData.length > 0 && (
                      <div className="text-xs text-gray-500 mb-2 text-center">
                        Chart range: {calculateChartDomain(chartData)[0].toFixed(6)} to {calculateChartDomain(chartData)[1].toFixed(6)}
                      </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          tickFormatter={(v) => (Number.isFinite(v) ? Number(v).toFixed(4) : v)} 
                          domain={calculateChartDomain(chartData)}
                          ticks={chartData.length > 0 ? [
                            calculateChartDomain(chartData)[0],
                            0,
                            calculateChartDomain(chartData)[1]
                          ] : []}
                        />
                        <YAxis type="category" dataKey="feature" width={180} />
                        <Tooltip formatter={(value, name) => [Number(value).toFixed(4), 'SHAP']} labelFormatter={(lbl) => `Feature: ${lbl}`} />
                        <ReferenceLine x={0} stroke="#94a3b8" />
                        <Legend />
                        <Bar dataKey="value" name="SHAP" radius={[0, 6, 6, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colorFor(entry.value)} />
                          ))}
                          <LabelList dataKey="value" position="right" formatter={(v) => Number(v).toFixed(4)} className="text-xs" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* About */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About this solution</h2>
            <p className="text-gray-800 mb-2 font-semibold">The problem</p>
            <p className="text-gray-700 mb-3">
              Unplanned hospital readmissions drive significant cost and indicate poorer patient outcomes. Clinicians need a reliable way, at or before discharge, to identify patients at high risk of coming back—and to understand why—so they can intervene early with targeted care plans.
            </p>
            <p className="text-gray-800 mb-2 font-semibold">Our solution</p>
            <p className="text-gray-700 mb-3">
              We built an explainable ML pipeline that predicts 30‑day readmission risk and surfaces the factors that most influenced each prediction. The backend (FastAPI) serves a stacked model and SHAP explanations; the frontend (Vite + React + Tailwind) lets users upload Excel files or enter a single patient, visualize feature contributions, and export results.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
              <li>Per‑patient risk label, probability, and ranked feature contributions (SHAP)</li>
              <li>Color‑coded contribution chart to quickly see what increased or decreased risk</li>
              <li>Batch processing via Excel and a modern manual‑entry form with validation</li>
            </ul>
            {/* GitHub button */}
            <a
              href={'https://github.com/Mohan-Balaji/hospital-readmission-prediction'}
              target="_blank"
              rel="noreferrer"
              className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
            >
              <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
              <div className="flex items-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
                  <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
                </svg>
                <span className="ml-1 text-white">Star on GitHub</span>
              </div>
              <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                <svg
                  className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                <span className="inline-block tabular-nums tracking-wider font-medium text-white">4</span>
              </div>
            </a>
          </div>
          {/* Stats Cards */}

        </div>
        

      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;

