/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecruitmentPost, ProjectCategory, Applicant } from '../types';
import { Search, Calendar, Users, MapPin, CheckCircle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { ApplicationForm } from './ApplicationForm';

interface RecruitmentListProps {
  posts: RecruitmentPost[];
  applicants: Applicant[];
  onApplySuccess: (applicant: Applicant) => void;
  onSelectPostToManage: (postId: string) => void;
}

export const RecruitmentList: React.FC<RecruitmentListProps> = ({
  posts,
  applicants,
  onApplySuccess,
  onSelectPostToManage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeApplyingPost, setActiveApplyingPost] = useState<RecruitmentPost | null>(null);

  // 카테고리 목록
  const categories = ['전체', '개발/IT', '공모전/해커톤', '학점/전공스터디', '어학/자격증', '창업/사이드프로젝트'];

  // 필터링된 공고 목록
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchesQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // 해당 공고의 확정(합격) 인원 계산
  const getAcceptedCount = (postId: string) => {
    return applicants.filter((a) => a.postId === postId && a.status === 'ACCEPTED').length;
  };

  // 해당 공고의 총 지원자 수 계산
  const getTotalApplicantCount = (postId: string) => {
    return applicants.filter((a) => a.postId === postId).length;
  };

  return (
    <div className="space-y-8">
      {/* 상단 배너: 따뜻한 카페 라운지 소개 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f5ede3] via-[#f7f0e7] to-[#ede1d5] border border-[#e2d3c5] p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8c5e3c] mb-2 uppercase tracking-wider">
            <span>☕ 바이브 스터디 & 팀빌딩 라운지</span>
            <span>·</span>
            <span>2026 캠퍼스 매칭 시즌</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4a2c16] tracking-tight leading-tight">
            당신의 열정에 바이브를 더할<br />
            최고의 팀원과 스터디 메이트를 만나보세요
          </h1>
          <p className="text-sm text-[#7a5840] mt-2 leading-relaxed">
            전공 공부부터 공모전, 해커톤, 사이드 프로젝트까지. 
            원하는 공고를 확인하고 즉시 지원서를 제출하세요.
          </p>
        </div>

        {/* 배경 은은한 커피잔 모티브 장식 */}
        <div className="absolute right-4 -bottom-4 text-[120px] opacity-10 select-none pointer-events-none">
          ☕
        </div>
      </div>

      {/* 검색 및 카테고리 필터 컨트롤 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* 검색 입력창 */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="search-posts" className="sr-only">공고 검색</label>
          <Search className="w-4 h-4 text-[#9b7b64] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-posts"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="공고 제목, 포지션(React, 디자인 등) 검색..."
            className="input-cafe pl-10 text-xs sm:text-sm text-[#3e2718] placeholder:text-[#a88f7d]"
          />
        </div>

        {/* 카테고리 탭 (인터랙티브 세그먼트 컨트롤) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6b4226] text-white shadow-xs'
                  : 'bg-[#f4ebe1] text-[#6b4226] hover:bg-[#ebdcd0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 공고 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => {
          const accepted = getAcceptedCount(post.id);
          const totalApps = getTotalApplicantCount(post.id);
          const isFull = accepted >= post.targetCount;

          return (
            <div
              key={post.id}
              className="bg-white border border-[#ebdcd0] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* 메타데이터: 카테고리 & 마감일 (안티슬롭 제로필 원칙: 심플 텍스트 구분자) */}
                <div className="flex items-center justify-between text-xs text-[#8c6b54] mb-2 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#6b4226]">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>팀장: {post.leaderName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8c5e3c]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>마감일 {post.deadline}</span>
                  </div>
                </div>

                {/* 공고 제목 */}
                <h3 className="text-base sm:text-lg font-bold text-[#3e2718] leading-snug line-clamp-2 mb-2">
                  {post.title}
                </h3>

                {/* 본문 설명 */}
                <p className="text-xs sm:text-sm text-[#664b38] line-clamp-2 leading-relaxed mb-4">
                  {post.description}
                </p>

                {/* 주요 속성 배지 목록 */}
                <div className="space-y-2 py-3 border-y border-[#f5ece4] text-xs text-[#52311b]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c6b54]">활동 방식:</span>
                    <span className="font-semibold">{post.meetingType} ({post.activityPeriod})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c6b54]">모집 현황:</span>
                    <span className="font-semibold tabular-nums">
                      선발 확정 <strong className="text-[#6b4226]">{accepted}</strong> / {post.targetCount}명
                      <span className="text-[#a48874] ml-1.5 font-normal">(누적 지원 {totalApps}명)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c6b54]">월 예상 회비:</span>
                    <span className="font-bold text-[#6b4226] tabular-nums">
                      {post.baseMonthlyFee.toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* 모집 포지션 */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-[#8c6b54] mb-1.5">모집 포지션:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.roles.map((role) => (
                      <span
                        key={role}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#faf4ee] border border-[#ede0d4] text-[#52311b]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 버튼 액션 바 */}
              <div className="mt-5 pt-3 border-t border-[#f7efe7] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPostToManage(post.id)}
                  className="text-xs font-semibold text-[#6b4226] hover:text-[#422510] hover:underline transition-colors cursor-pointer py-1.5"
                >
                  지원 현황 관리 ({totalApps}명)
                </button>

                <button
                  onClick={() => setActiveApplyingPost(post)}
                  disabled={isFull}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    isFull
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#6b4226] hover:bg-[#7e4f30] text-white shadow-xs active:scale-[0.98]'
                  }`}
                >
                  <span>{isFull ? '모집 마감' : '지원서 작성하기'}</span>
                  {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#ebdcd0] rounded-2xl p-6">
          <p className="text-3xl mb-2">☕</p>
          <p className="text-base font-bold text-[#6b4226]">검색 결과와 일치하는 모집 공고가 없습니다.</p>
          <p className="text-xs text-[#8c6b54] mt-1">다른 검색어나 카테고리를 선택해보세요.</p>
        </div>
      )}

      {/* 지원서 작성 모달 (520px 최대 너비 & 중앙 정렬) */}
      {activeApplyingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-[540px] my-6">
            <button
              onClick={() => setActiveApplyingPost(null)}
              className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#e4d4c6] text-[#6b4226] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              aria-label="닫기"
            >
              ✕
            </button>
            <ApplicationForm
              post={activeApplyingPost}
              onApplySuccess={(newApp) => {
                onApplySuccess(newApp);
              }}
              onClose={() => setActiveApplyingPost(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
