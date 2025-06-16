import { NextRequest, NextResponse } from "next/server";

const AVWX_TOKEN = process.env.AVWX_API_TOKEN;
console.log('AVWX_API_TOKEN:', AVWX_TOKEN);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'metar' or 'taf'
  const code = searchParams.get("code");

  if (!type || !code) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  if (!AVWX_TOKEN) {
    return NextResponse.json({ error: "AVWX API 토큰이 설정되지 않았습니다." }, { status: 500 });
  }

  const url = `https://avwx.rest/api/${type}/${encodeURIComponent(code)}?token=${AVWX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `AVWX fetch failed: ${text}` }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
} 