import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tabName = searchParams.get('tab') || '23 ต.ค. 69';

  const sheetId = '17au0zI3Bk0Af56bL44y-Njp8YH4Lm77ICG-qiRSYii0';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;

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

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const text = await response.text();

    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!jsonMatch) {
      return NextResponse.json({ success: false, message: 'Invalid response format' }, { status: 500 });
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    const rows = jsonData.table?.rows || [];
    const matches: any[] = [];

    const isBoard = tabName.includes('หมากกระดาน');
    const isSwimOrAthletics = tabName.includes('ว่ายน้ำ') || tabName.includes('กรีฑา');

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row.c || !Array.isArray(row.c)) continue;

      if (isBoard) {
        // หมากกระดาน: เวลา (E), กีฬา (F), รุ่น (G), รอบ (K), ทีม H vs ทีม J, ผล (T)
        const timeStr = getCellValue(row.c[4]);    // Col E (index 4)
        const sport = getCellValue(row.c[5]);      // Col F (index 5)
        const category = getCellValue(row.c[6]);   // Col G (index 6)
        const team1 = getCellValue(row.c[7]);      // Col H (index 7)
        const team2 = getCellValue(row.c[9]);      // Col J (index 9)
        const roundStr = getCellValue(row.c[10]);  // Col K (index 10)
        const resultStr = getCellValue(row.c[19]); // Col T (index 19)

        if (!timeStr && !sport && !team1 && !team2) continue;
        if (sport.includes('กีฬา') || timeStr.includes('เวลา')) continue;

        matches.push({
          time: timeStr || '-',
          sport: sport || 'หมากกระดาน',
          category: category || '-',
          round: roundStr || '-',
          team1: team1 || '-',
          team2: team2 || '-',
          result: resultStr || '-'
        });

      } else if (isSwimOrAthletics) {
        // ว่ายน้ำ / กรีฑา: เวลา (E), กีฬา (G), รุ่น (H), รอบ (J), "มข." vs ทีม I, ผล (T)
        const timeStr = getCellValue(row.c[4]);    // Col E (index 4)
        const sport = getCellValue(row.c[6]);      // Col G (index 6)
        const category = getCellValue(row.c[7]);   // Col H (index 7)
        const team2 = getCellValue(row.c[8]);      // Col I (index 8)
        const roundStr = getCellValue(row.c[9]);   // Col J (index 9)
        const resultStr = getCellValue(row.c[19]); // Col T (index 19)

        if (!timeStr && !sport && !category && !team2) continue;
        if (sport.includes('กีฬา') || timeStr.includes('เวลา')) continue;

        matches.push({
          time: timeStr || '-',
          sport: sport || (tabName.includes('ว่ายน้ำ') ? 'ว่ายน้ำ' : 'กรีฑา'),
          category: category || '-',
          round: roundStr || '-',
          team1: 'มข.',
          team2: team2 || '-',
          result: resultStr || '-'
        });

      } else {
        // แท็บประจำวันปกติ: เวลา (D), กีฬา (A), รุ่น (F), รอบ (E), ทีม H vs ทีม J, ผล (S)
        const sport = getCellValue(row.c[0]);      // Col A (index 0)
        const timeStr = getCellValue(row.c[3]);    // Col D (index 3)
        const roundStr = getCellValue(row.c[4]);   // Col E (index 4)
        const category = getCellValue(row.c[5]);   // Col F (index 5)
        const team1 = getCellValue(row.c[7]);      // Col H (index 7)
        const team2 = getCellValue(row.c[9]);      // Col J (index 9)
        const resultStr = getCellValue(row.c[18]); // Col S (index 18)

        if (!timeStr && !sport && !team1 && !team2) continue;
        if (sport.includes('กีฬา') || timeStr.includes('เวลา')) continue;

        matches.push({
          time: timeStr || '-',
          sport: sport || '-',
          category: category || '-',
          round: roundStr || '-',
          team1: team1 || '-',
          team2: team2 || '-',
          result: resultStr || '-'
        });
      }
    }

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error('Error fetching match data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch match data' }, { status: 500 });
  }
}