import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get('icao');

  if (!icao) {
    return NextResponse.json(
      { message: '공항 ICAO 코드가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const apiUrl = 'https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do';

    const formData = new URLSearchParams();
    formData.append('reportType', 'Raw');
    formData.append('retrieveLocId', icao.toUpperCase());
    formData.append('actionType', 'notamRetrievalByICAOs');
    formData.append('submit', 'View NOTAMs');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('NOTAM 데이터를 불러오는데 실패했습니다.');
    }

    const text = await response.text();
    
    // NOTAM 텍스트 추출 및 정리
    const cleanHtml = text
      .replace(/<head>[\s\S]*?<\/head>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<!DOCTYPE[^>]*>/g, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // NOTAM 항목 분리 및 파싱
    const notamRegex = /([A-Z])\)([^(]*)/g;
    const notamItems = cleanHtml.split(/(?=\([A-Z]\))/g)
      .filter(item => item.trim().length > 0)
      .filter(item => !item.includes('-- end of menu line one'));

    if (notamItems.length === 0) {
      return NextResponse.json(
        { message: '해당 공항의 NOTAM 정보가 없습니다.' },
        { status: 404 }
      );
    }

    const notams = notamItems.map(notamText => {
      // NOTAM 번호 추출
      const notamNoMatch = notamText.match(/([A-Z][0-9]{4}\/[0-9]{2})/);
      const notamNo = notamNoMatch ? notamNoMatch[1] : '';

      // Q-코드 추출
      const qcodeMatch = notamText.match(/Q\)[^A-Z]*([A-Z]{5})/);
      const qcode = qcodeMatch ? qcodeMatch[1] : '';

      // 시간 정보 추출
      const timeMatch = notamText.match(/B\)\s*(\d{10})\s*C\)\s*(\d{10})?/);
      const startTime = timeMatch ? timeMatch[1] : '';
      const endTime = timeMatch ? (timeMatch[2] || 'PERM') : '';

      // 발행 시간 추출 (예: 25-06-01 00:41)
      const currentDate = new Date();
      const issueTime = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString().slice(2)} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

      return {
        text: notamText.trim(),
        issueTime,
        location: icao,
        notamNo,
        qcode,
        startTime: startTime ? `${startTime.slice(0, 2)}/${startTime.slice(2, 4)}/${startTime.slice(4, 6)} ${startTime.slice(6, 8)}:${startTime.slice(8, 10)}` : '',
        endTime: endTime === 'PERM' ? 'PERM' : endTime ? `${endTime.slice(0, 2)}/${endTime.slice(2, 4)}/${endTime.slice(4, 6)} ${endTime.slice(6, 8)}:${endTime.slice(8, 10)}` : '',
      };
    });

    return NextResponse.json({ notams });
  } catch (error) {
    console.error('NOTAM API Error:', error);
    return NextResponse.json(
      { message: 'NOTAM 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 