'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const marqueeText = "📣 ยินดีต้อนรับสู่ศูนย์ประสานงาน Press Center KKUDS | โปรดตรวจสอบตารางการใช้ยานพาหนะและรายงานผลการแข่งขันประจำวันได้ที่นี่";

  const vehicleScheduleDays = [
    { day: 'DAY 0', date: '23 October 2026', vehicleTab: '23/10/2026' },
    { day: 'DAY 1', date: '24 October 2026', vehicleTab: '24/10/2026' },
    { day: 'DAY 2', date: '25 October 2026', vehicleTab: '25/10/2026' },
    { day: 'DAY 3', date: '26 October 2026', vehicleTab: '26/10/2026' },
    { day: 'DAY 4', date: '27 October 2026', vehicleTab: '27/10/2026' },
    { day: 'DAY 5', date: '28 October 2026', vehicleTab: '28/10/2026' },
    { day: 'DAY 6', date: '29 October 2026', vehicleTab: '29/10/2026' },
    { day: 'DAY 7', date: '30 October 2026', vehicleTab: '30/10/2026' },
  ];

  const matchScheduleTabs = [
    { label: '23 ต.ค. 69 (รวมประจำวัน)', tabName: '23 ต.ค. 69' },
    { label: '24 ต.ค. 69 (รวมประจำวัน)', tabName: '24 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 24 ต.ค. 69', tabName: 'หมากกระดาน 24 ต.ค. 69' },
    { label: '25 ต.ค. 69 (รวมประจำวัน)', tabName: '25 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 25 ต.ค. 69', tabName: 'หมากกระดาน 25 ต.ค. 69' },
    { label: '🏊 ว่ายน้ำ 25 ต.ค. 69', tabName: 'ว่ายน้ำ 25 ต.ค. 69' },
    { label: '26 ต.ค. 69 (รวมประจำวัน)', tabName: '26 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 26 ต.ค. 69', tabName: 'หมากกระดาน 26 ต.ค. 69' },
    { label: '🏊 ว่ายน้ำ 26 ต.ค. 69', tabName: 'ว่ายน้ำ 26 ต.ค. 69' },
    { label: '27 ต.ค. 69 (รวมประจำวัน)', tabName: '27 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 27 ต.ค. 69', tabName: 'หมากกระดาน 27 ต.ค. 69' },
    { label: '🏃 กรีฑา 27 ต.ค. 69', tabName: 'กรีฑา 27 ต.ค. 69' },
    { label: '28 ต.ค. 69 (รวมประจำวัน)', tabName: '28 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 28 ต.ค. 69', tabName: 'หมากกระดาน 28 ต.ค. 69' },
    { label: '🏃 กรีฑา 28 ต.ค. 69', tabName: 'กรีฑา 28 ต.ค. 69' },
    { label: '29 ต.ค. 69 (รวมประจำวัน)', tabName: '29 ต.ค. 69' },
    { label: '♟️ หมากกระดาน 29 ต.ค. 69', tabName: 'หมากกระดาน 29 ต.ค. 69' },
    { label: '🏃 กรีฑา 29 ต.ค. 69', tabName: 'กรีฑา 29 ต.ค. 69' },
    { label: '30 ต.ค. 69 (รวมประจำวัน)', tabName: '30 ต.ค. 69' },
  ];

  const [currentVehicleDayIdx, setCurrentVehicleDayIdx] = useState(0);
  const [currentMatchTabIdx, setCurrentMatchTabIdx] = useState(0);
  const [isFullscreenVehicle, setIsFullscreenVehicle] = useState(false);
  const [isFullscreenMatch, setIsFullscreenMatch] = useState(false);
  
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [parsedVehicleRows, setParsedVehicleRows] = useState<any[]>([]);

  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [parsedMatches, setParsedMatches] = useState<any[]>([]);

  const currentVehicleDay = vehicleScheduleDays[currentVehicleDayIdx];
  const currentMatchTab = matchScheduleTabs[currentMatchTabIdx];

  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const month = today.getMonth();

    let initialIdx = 0;
    if (month === 9 && dayOfMonth >= 23 && dayOfMonth <= 30) {
      initialIdx = dayOfMonth - 23;
    }
    
    setCurrentVehicleDayIdx(initialIdx);
    fetchVehicleData(vehicleScheduleDays[initialIdx].vehicleTab);

    const defaultMatchTabName = `${dayOfMonth >= 23 && dayOfMonth <= 30 ? dayOfMonth : 23} ต.ค. 69`;
    const foundMatchIdx = matchScheduleTabs.findIndex(t => t.tabName === defaultMatchTabName);
    const targetMatchIdx = foundMatchIdx !== -1 ? foundMatchIdx : 0;
    
    setCurrentMatchTabIdx(targetMatchIdx);
    fetchMatchData(matchScheduleTabs[targetMatchIdx].tabName);
  }, []);

  const handleVehicleDayChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < vehicleScheduleDays.length) {
      setCurrentVehicleDayIdx(newIndex);
      fetchVehicleData(vehicleScheduleDays[newIndex].vehicleTab);
    }
  };

  const handleMatchTabChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < matchScheduleTabs.length) {
      setCurrentMatchTabIdx(newIndex);
      fetchMatchData(matchScheduleTabs[newIndex].tabName);
    }
  };

  const fetchVehicleData = async (sheetTab: string) => {
    setIsLoadingVehicles(true);
    try {
      const res = await fetch(`/api/vehicles?tab=${encodeURIComponent(sheetTab)}`);
      const json = await res.json();
      if (json.success && json.tableData?.rows) {
        parseExactVehicleRows(json.tableData.rows);
      } else {
        setParsedVehicleRows([]);
      }
    } catch (err) {
      console.error("Failed to fetch vehicle data", err);
      setParsedVehicleRows([]);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const fetchMatchData = async (sheetTab: string) => {
    setIsLoadingMatches(true);
    try {
      const res = await fetch(`/api/matches?tab=${encodeURIComponent(sheetTab)}`);
      const json = await res.json();
      if (json.success && json.matches) {
        setParsedMatches(json.matches);
      } else {
        setParsedMatches([]);
      }
    } catch (err) {
      console.error("Failed to fetch match data", err);
      setParsedMatches([]);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const getCellValue = (cell: any) => {
    if (!cell) return '';
    if (cell.v !== null && cell.v !== undefined && String(cell.v).trim() !== '') {
      return String(cell.v).trim();
    }
    if (cell.f !== null && cell.f !== undefined && String(cell.f).trim() !== '') {
      return String(cell.f).trim();
    }
    return '';
  };

  const parseExactVehicleRows = (rows: any[]) => {
    let currentZone = '';
    const resultRows: any[] = [];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row.c || !Array.isArray(row.c)) continue;

      const zoneVal = getCellValue(row.c[0]);
      if (zoneVal && !zoneVal.includes('พื้นที่')) {
        currentZone = zoneVal;
      }

      const vehicleVal = getCellValue(row.c[1]);
      if (!vehicleVal || vehicleVal.includes('ยานพาหนะ') || vehicleVal.includes('ตาราง')) {
        continue;
      }

      const rawSlots = new Array(25).fill('');
      for (let i = 0; i < 25; i++) {
        rawSlots[i] = getCellValue(row.c[i + 2]);
      }

      const mergedCells: any[] = [];
      let i = 0;
      while (i < 25) {
        const text = rawSlots[i];
        if (text !== '') {
          let span = 1;
          while (i + span < 25 && rawSlots[i + span] === '') {
            span++;
          }
          mergedCells.push({ text, span });
          i += span;
        } else {
          mergedCells.push({ text: '', span: 1 });
          i++;
        }
      }

      resultRows.push({
        zone: currentZone,
        name: vehicleVal,
        cells: mergedCells
      });
    }

    setParsedVehicleRows(resultRows);
  };

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const getWorkColorStyle = (text: string) => {
    if (!text) return '';
    const cleanKey = text
      .replace(/\(ไปส่ง-รับกลับ\)|\(ไปส่ง\)|\(รับกลับ\)/g, '')
      .replace(/\d+\s*คน/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();

    const colorPairs = [
      'bg-rose-100 text-rose-900 border-rose-300',
      'bg-purple-100 text-purple-900 border-purple-300',
      'bg-amber-100 text-amber-900 border-amber-300',
      'bg-emerald-100 text-emerald-900 border-emerald-300',
      'bg-sky-100 text-sky-900 border-sky-300',
      'bg-indigo-100 text-indigo-900 border-indigo-300',
      'bg-teal-100 text-teal-900 border-teal-300',
      'bg-orange-100 text-orange-900 border-orange-300',
      'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
      'bg-lime-100 text-lime-900 border-lime-300',
    ];

    let hash = 0;
    for (let i = 0; i < cleanKey.length; i++) {
      hash = cleanKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPairs.length;
    return colorPairs[index];
  };

  const RenderMatchTable = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`bg-white rounded-xl shadow-sm border-2 border-slate-300 overflow-hidden flex flex-col ${isModal ? 'h-full' : 'h-full'}`}>
      <div className="bg-purple-900 text-white px-3 py-2.5 sm:px-4 sm:py-3 flex flex-wrap justify-between items-center gap-2 border-b border-purple-950 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight">โปรแกรมการแข่งขัน</h3>
            <p className="text-[11px] text-purple-200 font-medium">({currentMatchTab.tabName})</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-purple-950/60 p-1 rounded-lg border border-purple-700/50">
          <button
            onClick={() => handleMatchTabChange(currentMatchTabIdx - 1)}
            disabled={currentMatchTabIdx === 0}
            className="bg-white hover:bg-purple-100 disabled:opacity-40 text-purple-900 font-bold text-xs px-2 py-1 rounded transition shadow-sm"
          >
            ◀ <span className="hidden sm:inline">ก่อนหน้า</span>
          </button>

          <select
            value={currentMatchTabIdx}
            onChange={(e) => handleMatchTabChange(Number(e.target.value))}
            className="bg-white text-purple-900 font-bold text-xs px-2 py-1 rounded border border-purple-300 cursor-pointer focus:outline-none"
          >
            {matchScheduleTabs.map((t, idx) => (
              <option key={idx} value={idx}>
                {t.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleMatchTabChange(currentMatchTabIdx + 1)}
            disabled={currentMatchTabIdx === matchScheduleTabs.length - 1}
            className="bg-white hover:bg-purple-100 disabled:opacity-40 text-purple-900 font-bold text-xs px-2 py-1 rounded transition shadow-sm"
          >
            <span className="hidden sm:inline">ถัดไป</span> ▶
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMatchData(currentMatchTab.tabName)}
            className="bg-white/20 hover:bg-white/30 text-white text-xs px-2.5 py-1.5 rounded-lg border border-purple-400/50 font-semibold flex items-center gap-1 transition shadow-sm"
            title="รีเฟรชข้อมูลการแข่งขัน"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">{isLoadingMatches ? 'โหลด...' : 'รีเฟรช'}</span>
          </button>

          <button 
            onClick={() => setIsFullscreenMatch(!isModal)}
            className="bg-amber-400 hover:bg-amber-500 text-purple-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
          >
            {isModal ? (
              <><span>✕</span><span>ย่อขนาด</span></>
            ) : (
              <><span>⛶</span><span>ขยายเต็มจอ</span></>
            )}
          </button>
        </div>
      </div>

      <div className={`overflow-auto flex-1 bg-slate-50 ${isModal ? 'max-h-[80vh]' : 'max-h-[260px]'}`}>
        {isLoadingMatches ? (
          <div className="p-10 text-center text-purple-900 font-bold text-xs md:text-sm">
            ⏳ กำลังดึงตารางการแข่งขัน ({currentMatchTab.tabName})...
          </div>
        ) : parsedMatches.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-semibold text-xs md:text-sm">
            ⚠️ ไม่พบข้อมูลโปรแกรมการแข่งขัน {currentMatchTab.tabName}
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead className="bg-purple-100 text-purple-950 sticky top-0 z-10 font-bold border-b border-purple-200">
              <tr>
                <th className="p-2.5 w-20 text-center">เวลา</th>
                <th className="p-2.5 w-28">กีฬา</th>
                <th className="p-2.5 w-24">รุ่น</th>
                <th className="p-2.5 w-20">รอบ</th>
                <th className="p-2.5 text-center">แมตช์การแข่งขัน</th>
                <th className="p-2.5 w-24 text-center">ผล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {parsedMatches.map((m, idx) => (
                <tr key={idx} className="hover:bg-purple-50/50 transition">
                  <td className="p-2.5 font-bold text-purple-900 text-center whitespace-nowrap bg-purple-50/30">
                    {m.time}
                  </td>
                  <td className="p-2.5 font-bold text-slate-800">{m.sport}</td>
                  <td className="p-2.5 text-slate-600">{m.category}</td>
                  <td className="p-2.5 text-slate-600">{m.round}</td>
                  <td className="p-2.5 text-center font-medium">
                    <span className="text-slate-800 font-semibold">{m.team1}</span>
                    <span className="mx-2 text-rose-600 font-bold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">vs</span>
                    <span className="text-slate-800 font-semibold">{m.team2}</span>
                  </td>
                  <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/40">
                    {m.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const RenderVehicleTable = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden ${isModal ? 'h-full flex flex-col' : 'h-full flex flex-col justify-between'}`}>
      <div className="bg-amber-300 text-slate-900 px-3 py-2.5 sm:px-4 sm:py-3 flex flex-wrap justify-between items-center gap-2 border-b border-amber-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚐</span>
          <div>
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-900 leading-tight">ตารางการใช้รถประจำวัน</h3>
            <p className="text-[11px] text-slate-700 font-semibold">({currentVehicleDay.vehicleTab}) • Live Google Sheets</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-400/60 p-1 rounded-lg border border-amber-500/40">
          <button
            onClick={() => handleVehicleDayChange(currentVehicleDayIdx - 1)}
            disabled={currentVehicleDayIdx === 0}
            className="bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-900 font-bold text-xs px-2 py-1 rounded transition shadow-sm"
          >
            ◀ <span className="hidden sm:inline">ก่อนหน้า</span>
          </button>

          <select
            value={currentVehicleDayIdx}
            onChange={(e) => handleVehicleDayChange(Number(e.target.value))}
            className="bg-white text-slate-900 font-bold text-xs px-2 py-1 rounded border border-amber-500/40 cursor-pointer focus:outline-none"
          >
            {vehicleScheduleDays.map((d, idx) => (
              <option key={idx} value={idx}>
                {d.day} ({d.vehicleTab})
              </option>
            ))}
          </select>

          <button
            onClick={() => handleVehicleDayChange(currentVehicleDayIdx + 1)}
            disabled={currentVehicleDayIdx === vehicleScheduleDays.length - 1}
            className="bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-900 font-bold text-xs px-2 py-1 rounded transition shadow-sm"
          >
            <span className="hidden sm:inline">ถัดไป</span> ▶
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchVehicleData(currentVehicleDay.vehicleTab)}
            className="bg-white/90 hover:bg-white text-slate-900 text-xs px-2.5 py-1.5 rounded-lg border border-amber-400/60 font-semibold flex items-center gap-1 transition shadow-sm"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">{isLoadingVehicles ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
          </button>

          <button 
            onClick={() => setIsFullscreenVehicle(!isModal)}
            className="bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
          >
            {isModal ? (
              <><span>✕</span><span>ย่อขนาด</span></>
            ) : (
              <><span>⛶</span><span>ขยายเต็มจอ</span></>
            )}
          </button>
        </div>
      </div>

      <div className={`overflow-auto relative bg-slate-900 ${isModal ? 'flex-1 max-h-[80vh]' : 'flex-1 min-h-[300px] max-h-[360px]'}`}>
        {isLoadingVehicles ? (
          <div className="p-12 text-center text-amber-200 font-bold text-sm">
            ⏳ กำลังดึงข้อมูลตารางการใช้รถ ({currentVehicleDay.vehicleTab}) จาก Google Sheets...
          </div>
        ) : parsedVehicleRows.length === 0 ? (
          <div className="p-12 text-center text-slate-300 font-semibold text-sm">
            ⚠️ ไม่พบข้อมูลการใช้รถประจำวัน {currentVehicleDay.vehicleTab}
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[1400px] table-fixed">
            <thead className="bg-slate-800 text-slate-300 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="p-2 w-14 sticky left-0 z-30 bg-slate-800 border-r border-b border-slate-700 font-bold text-amber-300 text-center">
                  พื้นที่
                </th>
                <th className="p-2 w-36 sticky left-[56px] z-30 bg-slate-800 border-r border-b border-slate-700 font-bold text-white">
                  ยานพาหนะ
                </th>
                {timeSlots.map((slot, idx) => (
                  <th key={idx} className="p-2 text-center w-24 border-r border-b border-slate-700/60 font-medium">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-white text-slate-800">
              {parsedVehicleRows.map((v, vIdx) => (
                <tr key={vIdx} className="hover:bg-slate-50">
                  <td className="p-1.5 w-14 sticky left-0 z-10 bg-slate-100 border-r border-slate-300 text-center font-bold text-slate-700 shadow-sm">
                    {v.zone ? (
                      <span className={`px-1 py-0.5 rounded text-[9px] ${v.zone.includes('พะเยา') ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                        {v.zone}
                      </span>
                    ) : null}
                  </td>
                  <td className="p-2 w-36 sticky left-[56px] z-10 bg-slate-50 border-r border-slate-200 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">🚐</span>
                      <p className="font-bold text-[11px] text-slate-900 whitespace-pre-line leading-tight">{v.name}</p>
                    </div>
                  </td>
                  {(v.cells || []).map((cell: any, cIdx: number) => {
                    if (cell && cell.text) {
                      return (
                        <td key={cIdx} colSpan={cell.span || 1} className="p-1 border-r border-slate-200 text-center align-middle">
                          <div className={`p-1.5 rounded font-semibold text-[10px] leading-tight border shadow-sm whitespace-pre-line h-full flex items-center justify-center ${getWorkColorStyle(cell.text)}`}>
                            {cell.text}
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={cIdx} className="p-1 border-r border-slate-100 text-center align-middle">
                        <span className="text-slate-300">•</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <style jsx global>{`
        @keyframes dayGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.4), 0 0 30px rgba(168, 85, 247, 0.2);
            border-color: #f59e0b;
          }
          50% {
            box-shadow: 0 0 25px rgba(245, 158, 11, 0.8), 0 0 45px rgba(168, 85, 247, 0.5);
            border-color: #a855f7;
          }
        }
        .glowing-day-card {
          animation: dayGlow 2.5s infinite ease-in-out;
        }
      `}</style>

      <header className="w-full bg-[#42037b] shadow-md border-b-4 border-amber-400 overflow-hidden relative">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#ffe97a] -z-0"></div>
        <div className="max-w-6xl mx-auto flex items-center justify-center relative z-10">
          <img 
            src="https://itals.kku.ac.th/ups/myfile/6ada8cd023a69.png" 
            alt="Press Center KKUDS Banner" 
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full p-3 md:p-5 space-y-4 flex-1">
        <section className="bg-white border-2 border-slate-300 rounded-xl p-3 shadow-sm overflow-hidden flex items-center">
          <span className="bg-purple-900 text-white text-xs font-bold px-3 py-1 rounded-md shrink-0 mr-3">
            ประกาศ
          </span>
          <div className="whitespace-nowrap overflow-hidden w-full">
            <p className="inline-block animate-marquee text-sm font-semibold text-slate-700">
              {marqueeText}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 order-1 space-y-3">
            <div className="bg-gradient-to-b from-white to-amber-50/50 border-2 rounded-xl p-5 text-center shadow-md glowing-day-card transition">
              <span className="inline-block bg-amber-400 text-purple-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 shadow-sm">
                MATCHDAY TODAY
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-purple-950 tracking-tight drop-shadow-sm">
                {currentVehicleDay.day}
              </h2>
              <p className="text-sm font-extrabold text-amber-800 mt-1">
                {currentVehicleDay.date}
              </p>
            </div>

            <div className="hidden md:block space-y-3">
              <a 
                href="https://docs.google.com/spreadsheets/d/17au0zI3Bk0Af56bL44y-Njp8YH4Lm77ICG-qiRSYii0/edit?gid=1480633138#gid=1480633138"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl p-4 text-center font-bold text-base text-slate-800 shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>📅</span>
                <span>โปรแกรม/ผลการแข่งขันทั้งหมด</span>
              </a>

              <a 
                href="https://www.facebook.com/SatitSamakkeeSatitkku"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl p-3.5 text-center font-bold text-base text-slate-800 shadow-sm transition flex items-center justify-center gap-2"
              >
                <img 
                  src="https://itals.kku.ac.th/ups/myfile/6adc2aad6b056.png" 
                  alt="Facebook Logo" 
                  className="w-6 h-6 object-contain"
                />
                <span>facebook เพจ ทีม มข.</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-8 order-2">
            <RenderMatchTable isModal={false} />
          </div>

          <div className="block md:hidden order-3 space-y-3 col-span-1">
            <a 
              href="https://docs.google.com/spreadsheets/d/17au0zI3Bk0Af56bL44y-Njp8YH4Lm77ICG-qiRSYii0/edit?gid=1480633138#gid=1480633138"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl p-3.5 text-center font-bold text-base text-slate-800 shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>📅</span>
              <span>โปรแกรม/ผลการแข่งขันทั้งหมด</span>
            </a>

            <a 
              href="https://www.facebook.com/SatitSamakkeeSatitkku"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-center font-bold text-base text-slate-800 shadow-sm transition flex items-center justify-center gap-2"
            >
              <img 
                src="https://itals.kku.ac.th/ups/myfile/6adc2aad6b056.png" 
                alt="Facebook Logo" 
                className="w-6 h-6 object-contain"
              />
              <span>facebook เพจ ทีม มข.</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          <div className="md:col-span-8 h-full">
            <RenderVehicleTable isModal={false} />
          </div>

          <div className="md:col-span-4 flex flex-col justify-between gap-3 h-full">
            <a 
              href="https://forms.gle/hYKgXMYfxctbPj7b6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-amber-50/40 border-2 border-amber-400 rounded-xl px-3 py-2 text-center font-bold text-lg md:text-xl text-slate-900 shadow-sm transition flex items-center justify-center gap-2 min-h-[60px]"
            >
              <span className="text-xl">🎫</span>
              <span className="whitespace-nowrap">ขอใช้รถ (พะเยา)</span>
            </a>

            <a 
              href="https://forms.gle/iYcGnD5MYy7iwjay6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-amber-50/40 border-2 border-amber-400 rounded-xl px-3 py-2 text-center font-bold text-lg md:text-xl text-slate-900 shadow-sm transition flex items-center justify-center gap-2 min-h-[60px]"
            >
              <span className="text-xl">🚐</span>
              <span className="whitespace-nowrap">ขอใช้รถ (เชียงราย)</span>
            </a>

            <a 
              href="https://itals.kku.ac.th/mk/site/dbff0b744c29eaa0.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-amber-50/40 border-2 border-amber-400 rounded-xl px-3 py-2 text-center font-bold text-lg md:text-xl text-slate-900 shadow-sm transition flex items-center justify-center gap-2 min-h-[60px]"
            >
              <span className="text-xl">🔍</span>
              <span className="whitespace-nowrap">ค้นหาสนามแข่ง</span>
            </a>

            <a 
              href="https://forms.gle/F2Qod7hv1MJx5cG19" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-white hover:bg-amber-50/40 border-2 border-amber-400 rounded-xl px-2 py-2 text-center font-bold text-[13px] sm:text-sm md:text-[15px] lg:text-base text-slate-900 shadow-sm transition flex items-center justify-center gap-1.5 min-h-[60px]"
            >
              <span className="text-lg">🛫</span>
              <span className="whitespace-nowrap">แจ้งความประสงค์เดินทางกลับ</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <a 
            href="https://satitkku.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-900 hover:bg-purple-950 text-white rounded-xl p-5 shadow-md flex items-center justify-center gap-3 transition active:scale-[0.99] min-h-[85px]"
          >
            <div className="text-3xl">🏢</div>
            <span className="text-lg md:text-xl font-bold">ข้อมูลที่พัก</span>
          </a>

          <a 
            href="https://kku.world/kkuds-kml-medical" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-5 shadow-md flex items-center justify-center gap-3 transition active:scale-[0.99] min-h-[85px]"
          >
            <div className="text-3xl">🚑</div>
            <span className="text-base md:text-lg font-bold text-left leading-tight">
              บันทึก / รายงาน<br />การปฐมพยาบาล
            </span>
          </a>

          <a 
            href="https://kku.world/security-kkuds-49" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-amber-300 hover:bg-amber-400 text-slate-900 rounded-xl p-5 shadow-md flex items-center justify-center gap-3 transition active:scale-[0.99] min-h-[85px]"
          >
            <div className="text-3xl">📋</div>
            <span className="text-sm md:text-base font-bold text-left leading-tight">
              แจ้งรายงานพฤติกรรม /<br />ขออนุญาตเข้าที่พักหลังเวลา
            </span>
          </a>
        </div>
      </div>

      {isFullscreenMatch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-7xl h-full max-h-[90vh]">
            <RenderMatchTable isModal={true} />
          </div>
        </div>
      )}

      {isFullscreenVehicle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-7xl h-full max-h-[90vh]">
            <RenderVehicleTable isModal={true} />
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 mt-8 p-6 text-center text-slate-500 font-medium text-sm">
        Press Center KKUDS © 2026 Powered by Drunken Master
      </footer>
    </div>
  );
}