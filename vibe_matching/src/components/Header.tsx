/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, FileText, PlusCircle, Coffee, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'posts' | 'dashboard' | 'create' | 'cafe';
  setActiveTab: (tab: 'posts' | 'dashboard' | 'create' | 'cafe') => void;
  applicantCount: number;
  postCount: number;
  onOpenCreate: () => void;
  onQuickExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  applicantCount,
  postCount,
  onOpenCreate,
  onQuickExport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e2d4c7] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: 브랜드 타이틀 (단일 텍스트 워드마크) */}
        <button
          onClick={() => setActiveTab('posts')}
          className="flex items-center gap-2 text-left group transition-transform hover:scale-[1.01]"
        >
          <span className="text-2xl" role="img" aria-label="coffee cup">☕</span>
          <div>
            <div className="text-lg font-bold text-[#6b4226] tracking-tight group-hover:text-[#52311b] flex items-center gap-1.5">
              <span>바이브 캠퍼스</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ebdcd0] text-[#6b4226]">팀 & 스터디</span>
            </div>
            <p className="text-[11px] text-[#8c6b54] hidden sm:block">
              당신의 하루에 바이브를 더하다 · 대학생 팀 매칭 시스템
            </p>
          </div>
        </button>

        {/* Zone 2: 내비게이션 탭 (싱글 라인 텍스트 탭) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-[#6b4226] text-white shadow-sm'
                : 'text-[#6b4226] hover:bg-[#efe4da]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>모집 공고 & 지원</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative ${
              activeTab === 'dashboard'
                ? 'bg-[#6b4226] text-white shadow-sm'
                : 'text-[#6b4226] hover:bg-[#efe4da]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>매칭 현황 대시보드</span>
            {applicantCount > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'dashboard' ? 'bg-[#ebdcd0] text-[#6b4226]' : 'bg-[#6b4226] text-white'
              }`}>
                {applicantCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cafe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'cafe'
                ? 'bg-[#6b4226] text-white shadow-sm'
                : 'text-[#6b4226] hover:bg-[#efe4da]'
            }`}
            title="원작 바이브 카페 음료 주문서"
          >
            <Coffee className="w-4 h-4" />
            <span className="hidden md:inline">바이브</span> 카페 주문
          </button>
        </nav>

        {/* Zone 3: 주요 액션 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickExport}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6b4226] bg-[#f0e5dc] hover:bg-[#e4d4c8] border border-[#d6c4b5] rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            title="지원 현황 엑셀 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span>엑셀 다운로드</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#6b4226] hover:bg-[#7e4f30] rounded-lg transition-colors shadow-sm whitespace-nowrap active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">모집 공고</span> 등록
          </button>
        </div>
      </div>
    </header>
  );
};
