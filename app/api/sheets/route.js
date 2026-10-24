import { NextResponse } from 'next/server';

export async function GET() {
  // ⚠️ อย่าลืมเปลี่ยนตรงนี้เป็น Spreadsheet ID จาก Google Sheets ของคุณ
  const SPREADSHEET_ID = '1ipdiTUiLwVkirNXsbiP_4JQjIQ1rq81esGyBt0kA64k'; 
  const SHEET_NAME = 'Sheet1';
  
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    
    const jsonText = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonText);

    const rows = data.table.rows.map((row) => ({
      id: row.c[0]?.v || '',
      title: row.c[1]?.v || '',
      time: row.c[2]?.v || '',
      status: row.c[3]?.v || '',
      score: row.c[4]?.v || '',
    }));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}