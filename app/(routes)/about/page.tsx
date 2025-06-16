'use client';

import React from 'react';
import { BackButton } from "@/components/BackButton";
import { AdBanner } from "@/components/AdBanner";
import Link from 'next/link';
import { Mail, MessageCircle, Globe } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          {/* 비행계획도구 섹션 소개 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-8 rounded-xl shadow border border-blue-200">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">비행 계획 도구</h1>
            <p className="text-base text-gray-700">
              비행 계획 도구는 조종사와 항공 훈련생이 보다 쉽고 정확하게 비행 계획을 수립할 수 있도록 돕는 웹 기반 어플리케이션입니다.<br />
              주요 기능은 TDH 계산기와 NOTAM 확인이며, 앞으로 다양한 비행 보조 기능이 추가될 예정입니다.
            </p>
        </div>

          {/* TDH 계산기 섹션 */}
          <div className="bg-white px-6 py-8 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">TDH 계산기란?</h2>
            <p className="text-gray-700 text-base mb-6">
              TDH 계산기는 Time(시간), Distance(거리), Heading(방위각)을 자동으로 계산해주는 도구입니다.
              조종사들이 비행 계획 시 수기로 계산하던 반복 작업을 간편하게 처리할 수 있도록 설계되었습니다.
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">사용법</h3>
              <ol className="list-decimal ml-5 space-y-1 text-gray-700 text-sm">
                <li>웨이포인트 이름을 입력하세요.</li>
                <li>MGRS 또는 위/경도 방식 중 좌표를 입력하세요.</li>
                <li>속도를 km/h 또는 노트(knots) 단위로 입력하세요.</li>
                <li>자동으로 거리, ETA, 방위각이 계산됩니다.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">주요 기능</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[ 
                  '군사좌표 / 위경도 지원',
                  '속도 기반 거리 및 ETA 계산',
                  '방위각(Heading) 자동 계산',
                  '지도 시각화 및 결과 테이블 제공' 
                ].map((item, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg shadow p-4 text-sm">{item}</div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">개발 배경</h3>
              <p className="text-gray-700 text-sm">
                항공기 조종 훈련 중 반복적인 수기 계산에서 오는 실수와 번거로움을 줄이고,
                직관적인 인터페이스를 통해 누구나 정확하게 비행 경로를 계획할 수 있도록 이 도구를 개발하게 되었습니다.
                  </p>
                </div>
              </div>

          {/* NOTAM 섹션 */}
          <div className="bg-blue-100 px-6 py-8 rounded-xl shadow border border-blue-200 text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">NOTAM 확인</h2>
            <p className="text-gray-700 text-sm">
              해당 기능은 현재 개발 중이며, 추후 업데이트될 예정입니다.<br />
              실시간 NOTAM 정보, 공역 시각화, AIP 팝업 기능이 포함될 예정입니다.
            </p>
            <p className="text-sm text-blue-600 mt-4 italic">Coming Soon...</p>
            </div>

            {/* Contact Us 섹션 */}
          <div className="bg-white px-6 py-8 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Contact Us</h2>
                <div className="space-y-4">
                  <Link 
                    href="mailto:morphlab.ai@gmail.com" 
                    className="block hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Email</h3>
                        <p className="text-sm text-gray-600">건의사항 및 버그신고</p>
                      </div>
                    </div>
                  </Link>
                  <Link 
                    href="https://open.kakao.com/o/sL3V89yh" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="bg-yellow-50 p-2 rounded-full">
                        <MessageCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">카카오톡 오픈채팅</h3>
                        <p className="text-sm text-gray-600">건의사항 및 버그신고</p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 p-3 opacity-50 rounded-lg">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Website</h3>
                      <p className="text-sm text-gray-600">준비중입니다</p>
                  </div>
                </div>
              </div>
            </div>

          {/* 개인정보 및 광고 안내 */}
          <div className="bg-blue-800 px-6 py-10 rounded-xl shadow text-white">
            <h2 className="text-xl font-semibold mb-4">개인정보 및 광고 안내</h2>
            <p className="text-sm leading-relaxed text-blue-100">
                  본 웹사이트는 쿠키를 사용하여 사용자 경험을 개선하며, Google AdSense 광고가 포함될 수 있습니다.<br />
                  자세한 내용은
              <a href="https://policies.google.com/technologies/ads?hl=ko" 
                    className="underline text-blue-300 ml-1" 
                target="_blank" rel="noreferrer">
                    Google 광고 개인정보처리방침
              </a>
                  을 참고하세요.
                </p>
          </div>

          {/* 광고 배너 */}
          <AdBanner className="mt-8" />
        </div>
      </main>
      <Navigation />
    </>
  );
} 