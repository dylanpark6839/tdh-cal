"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, CloudSun, CloudLightning, MapPin, Search, Info } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { BackButton } from "@/components/BackButton";
import { Navigation } from "@/components/Navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AIRPORTS } from "@/app/(routes)/waypoints/data/airports";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { HelpFAB } from "@/components/ui/help-fab";

interface WeatherResult {
  metar?: any;
  taf?: any;
}

export default function WeatherLowPage() {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 공항 자동완성 필터링
  const [query, setQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const filteredAirports = useMemo(() => {
    if (!query) return AIRPORTS;
    const q = query.toLowerCase();
    return AIRPORTS.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q))
    );
  }, [query]);

  // 선택된 공항
  const [selectedAirport, setSelectedAirport] = useState<typeof AIRPORTS[0] | null>(null);

  // 검색 및 METAR/TAF 조회
  const handleAirportSearch = async (airport: typeof AIRPORTS[0] | null, manualQuery?: string) => {
    setSearching(true);
    setError(null);
    setLocation(null);
    setWeather(null);
    setSelectedAirport(airport);
    let code = "";
    if (airport) {
      code = airport.id; // ICAO 코드만 사용
    } else if (manualQuery) {
      // 사용자가 직접 입력한 값이 4자리 ICAO 코드일 때만 사용
      if (/^[A-Z]{4}$/.test(manualQuery.trim().toUpperCase())) {
        code = manualQuery.trim().toUpperCase();
      } else {
        setError("공항 코드는 4자리 영문(예: RKSI)만 입력 가능합니다.");
        setSearching(false);
        return;
      }
    }
    let locName = airport ? airport.name : manualQuery || "";
    let loc: { name: string; lat: number; lon: number } | null = null;
    if (airport) {
      loc = { name: airport.name, lat: airport.coordinates.lat, lon: airport.coordinates.lng };
    } else if (manualQuery) {
      // fallback to Nominatim
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualQuery)}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          loc = {
            name: data[0].display_name,
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
        } else {
          setError("위치 또는 공항 코드를 찾을 수 없습니다.");
          setSearching(false);
          return;
        }
      } catch (e) {
        setError("위치 검색 중 오류가 발생했습니다.");
        setSearching(false);
        return;
      }
    }
    if (!loc) {
      // 좌표가 없어도 ICAO 코드가 유효하면 kr-weather API로 시도
      if (/^[A-Z]{4}$/.test(code)) {
        setLocation({ name: code, lat: 0, lon: 0 }); // 임시 위치
      } else {
        setError("위치 또는 공항 코드를 찾을 수 없습니다.");
        setSearching(false);
        return;
      }
    }
    setLocation(loc);
    setLoading(true);
    try {
      const result: WeatherResult = {};
      // 1차: AVWX API
      const metarRes = await fetch(`/api/weather?type=metar&code=${encodeURIComponent(code)}`);
      const metarData = await metarRes.json();
      console.log('METAR API 응답:', metarData);
      let metarFinal = metarData;
      if (metarData.error || !metarData.raw) {
        // 2차: 국내 크롤링 Fallback
        const krRes = await fetch(`/api/kr-weather?icao=${encodeURIComponent(code)}`);
        const krData = await krRes.json();
        if (krData.metar) {
          metarFinal = { raw: krData.metar };
        } else {
          setError(`METAR 오류: ${metarData.error || '데이터 없음'}`);
          setLoading(false);
          setSearching(false);
          return;
        }
      }
      result.metar = metarFinal;

      // 1차: AVWX API
      const tafRes = await fetch(`/api/weather?type=taf&code=${encodeURIComponent(code)}`);
      const tafData = await tafRes.json();
      console.log('TAF API 응답:', tafData);
      let tafFinal = tafData;
      if (tafData.error || !tafData.raw) {
        // 2차: 국내 크롤링 Fallback
        const krRes = await fetch(`/api/kr-weather?icao=${encodeURIComponent(code)}`);
        const krData = await krRes.json();
        if (krData.taf) {
          tafFinal = { raw: krData.taf };
        } else {
          setError(`TAF 오류: ${tafData.error || '데이터 없음'}`);
          setLoading(false);
          setSearching(false);
          return;
        }
      }
      result.taf = tafFinal;
      setWeather(result);
      setQuery(""); // 검색 완료 후 자동완성 닫기
    } catch (e) {
      setError("기상 데이터 조회 중 오류가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // METAR/TAF 파싱 (간단 버전)
  function parseMetar(metar: any) {
    if (!metar || !metar.raw) return null;
    const raw = metar.raw;
    const time = metar.meta?.timestamp || "-";
    const wind = metar.wind_direction?.repr && metar.wind_speed?.repr ? `${metar.wind_direction.repr}° ${metar.wind_speed.repr}KT` : "-";
    const temp = metar.temperature?.repr !== undefined ? `${metar.temperature.repr}°C` : "-";
    const dew = metar.dewpoint?.repr !== undefined ? `${metar.dewpoint.repr}°C` : "-";
    const vis = metar.visibility?.repr ? `${metar.visibility.repr}` : "-";
    const alt_hpa = metar.altimeter?.value ? `${metar.altimeter.value} hPa` : "-";
    let alt_inhg = "-";
    if (metar.altimeter?.value) {
      const inhg = (metar.altimeter.value * 0.029529983071445).toFixed(2);
      alt_inhg = `${inhg} inHg`;
    }
    return { raw, time, wind, temp, dew, vis, alt_hpa, alt_inhg };
  }

  function parseTaf(taf: any) {
    if (!taf || !taf.raw) return null;
    const raw = taf.raw;
    const time = taf.meta?.timestamp || "-";
    return { raw, time };
  }

  const metarParsed = parseMetar(weather?.metar);
  const tafParsed = parseTaf(weather?.taf);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AdBanner />
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg -mx-4 px-4 py-3 md:-mx-6 md:px-6">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            METAR/TAF
          </h1>
        </div>
      </div>
      <div className="container mx-auto p-4 md:p-6 flex flex-col min-h-[calc(100vh-4rem)]">
        <Card className="p-6 border-none shadow-lg bg-white/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex flex-col gap-6 items-center mt-4">
              {/* 공항 자동완성/검색 */}
              <div className="w-full">
                <Input
                  className="w-full"
                  placeholder="공항 코드(RKSI), 공항명 또는 위치명 입력"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setTimeout(() => setInputFocused(false), 150)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const match = filteredAirports[0];
                      if (match) handleAirportSearch(match, query);
                      else handleAirportSearch(null, query);
                    }
                  }}
                  autoFocus
                />
                {(inputFocused || query) && filteredAirports.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
                    {filteredAirports.slice(0, 10).map((airport) => (
                      <div
                        key={airport.id}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                        onClick={() => {
                          setQuery(airport.id);
                          handleAirportSearch(airport);
                        }}
                      >
                        <span className="font-semibold">{airport.id}</span> {airport.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* 설명란 */}
              <div className="w-full flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
                <Info className="h-4 w-4" />
                METAR/TAF(공항 실황/예보) 정보를 조회합니다.
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
            {location && (
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{location?.name}</span>
              </div>
            )}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
              </div>
            )}
            {weather && (
              <Accordion type="multiple" className="mt-4">
                <AccordionItem value="metar">
                  <AccordionTrigger>
                    <CloudSun className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-semibold">METAR</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="p-4 mb-2">
                      <div className="mb-2 text-xs text-gray-500">관측시각: {metarParsed?.time}</div>
                      <Table>
                        <TableBody>
                          <TableRow><TableCell>풍향/풍속</TableCell><TableCell>{metarParsed?.wind}</TableCell></TableRow>
                          <TableRow><TableCell>온도</TableCell><TableCell>{metarParsed?.temp}</TableCell></TableRow>
                          <TableRow><TableCell>이슬점</TableCell><TableCell>{metarParsed?.dew}</TableCell></TableRow>
                          <TableRow><TableCell>시정</TableCell><TableCell>{metarParsed?.vis}</TableCell></TableRow>
                          <TableRow><TableCell>해면기압</TableCell><TableCell>{metarParsed?.alt_hpa} / {metarParsed?.alt_inhg}</TableCell></TableRow>
                        </TableBody>
                      </Table>
                      <div className="mt-2 text-xs text-gray-400">원문: {metarParsed?.raw}</div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="taf">
                  <AccordionTrigger>
                    <CloudLightning className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-semibold">TAF</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="p-4 mb-2">
                      <div className="mb-2 text-xs text-gray-500">예보시각: {tafParsed?.time}</div>
                      <div className="text-xs text-gray-400">원문: {tafParsed?.raw}</div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </Card>
      </div>
      <Navigation />
      <HelpFAB guide={
        <div>
          <b>기상확인 사용법</b>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>공항 코드(RKSI), 공항명, 위치명을 입력하면 자동완성 및 검색이 가능합니다.</li>
            <li>검색 후 METAR/TAF(실황/예보) 정보를 확인할 수 있습니다.</li>
            <li>국내 공항은 한글로도 검색 가능합니다.</li>
            <li>AVWX API 토큰이 없거나 데이터가 없으면 국내 크롤링 데이터로 Fallback됩니다.</li>
          </ul>
        </div>
      } />
    </div>
  );
} 