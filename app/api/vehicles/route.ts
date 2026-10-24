import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tabName = searchParams.get('tab') || '23/10/2026';
  
  const SPREADSHEET_ID = '1h8GgyDDqJM6i4Xj_iUQDV-JDN5kVnasYruweCwkG3Mo';
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    
    const jsonText = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonText);

    return NextResponse.json({ success: true, tableData: data.table });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}