import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const icao = searchParams.get("icao");
  if (!icao) {
    return NextResponse.json({ error: "Missing ICAO code" }, { status: 400 });
  }

  try {
    // AMO METAR/TAF 조회 페이지 (국내공항)
    const url = `https://global.amo.go.kr/observation/metar.do`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch AMO page" }, { status: 500 });
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    let metar = null;
    let taf = null;
    $("table tbody tr").each((_, el) => {
      const tds = $(el).find("td");
      let found = false;
      tds.each((i, td) => {
        const code = $(td).text().trim();
        if (code.toUpperCase() === icao.toUpperCase()) {
          found = true;
        }
      });
      if (found) {
        // METAR/TAF는 마지막 2개 셀에 있다고 가정, 없으면 빈 문자열
        metar = $(tds[tds.length - 2]).text().trim() || null;
        taf = $(tds[tds.length - 1]).text().trim() || null;
      }
    });

    if (!metar && !taf) {
      return NextResponse.json({ error: "No data found for this ICAO code" }, { status: 404 });
    }
    return NextResponse.json({ icao, metar, taf });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
} 