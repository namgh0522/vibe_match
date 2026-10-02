/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RecruitmentPost, Applicant, ApplicantStatus } from './types';
import { INITIAL_POSTS, INITIAL_APPLICANTS } from './data/mockData';
import { Header } from './components/Header';
import { RecruitmentList } from './components/RecruitmentList';
import { Dashboard } from './components/Dashboard';
import { CreatePostModal } from './components/CreatePostModal';
import { CafeOrderTab } from './components/CafeOrderTab';
import { exportToExcelFile } from './utils/excelExport';
import { CheckCircle2, Heart, Sparkles, BookOpen, Coffee } from 'lucide-react';

export default function App() {
  // 로컬 스토리지 키 정의
  const STORAGE_POSTS_KEY = 'vibe_campus_recruitment_posts_v1';
  const STORAGE_APPLICANTS_KEY = 'vibe_campus_applicants_v1';

  // 1. 공고 목록 상태 (로컬 스토리지 연동)
  const [posts, setPosts] = useState<RecruitmentPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('공고 로드 오류:', e);
    }
    return INITIAL_POSTS;
  });

  // 2. 지원자 목록 상태 (로컬 스토리지 연동)
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPLICANTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('지원자 로드 오류:', e);
    }
    return INITIAL_APPLICANTS;
  });

  // 3. 네비게이션 탭 상태 ('posts' | 'dashboard' | 'create' | 'cafe')
  const [activeTab, setActiveTab] = useState<'posts' | 'dashboard' | 'create' | 'cafe'>('posts');

  // 4. 대시보드에서 특정 공고 포커스 상태
  const [dashboardSelectedPostId, setDashboardSelectedPostId] = useState<string | null>(null);

  // 5. 공고 등록 모달 열림 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 6. 전역 토스트 알림 메시지 상태
  const [globalToast, setGlobalToast] = useState<{ message: string; sub?: string } | null>(null);

  // 상태 변경 시 로컬스토리지 동기화
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('공고 저장 실패:', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(applicants));
    } catch (e) {
      console.error('지원자 저장 실패:', e);
    }
  }, [applicants]);

  // 토스트 타이머
  const showToast = (message: string, sub?: string) => {
    setGlobalToast({ message, sub });
    setTimeout(() => {
      setGlobalToast(null);
    }, 4500);
  };

  // 지원서 제출 성공 핸들러
  const handleApplySuccess = (newApplicant: Applicant) => {
    setApplicants((prev) => [newApplicant, ...prev]);
    showToast(
      `${newApplicant.name}님의 지원서가 접수되었습니다!`,
      `[${newApplicant.postTitle}] ${newApplicant.appliedRole} 포지션`
    );
  };

  // 새 공고 생성 핸들러
  const handlePostCreated = (newPost: RecruitmentPost) => {
    setPosts((prev) => [newPost, ...prev]);
    showToast(`'${newPost.title}' 공고가 등록되었습니다!`, '모집 목록에서 즉시 확인할 수 있습니다.');
    setActiveTab('posts');
  };

  // 지원자 상태 업데이트 핸들러 (대기중 -> 서류통과 -> 최종선발 -> 보류)
  const handleUpdateApplicantStatus = (applicantId: string, newStatus: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );
  };

  // 지원자 삭제 핸들러
  const handleDeleteApplicant = (applicantId: string) => {
    setApplicants((prev) => prev.filter((app) => app.id !== applicantId));
    showToast('지원서가 성공적으로 삭제되었습니다.');
  };

  // 공고 카드에서 특정 공고 지원 현황 관리로 이동
  const handleSelectPostToManage = (postId: string) => {
    setDashboardSelectedPostId(postId);
    setActiveTab('dashboard');
  };

  // 헤더 빠른 엑셀 다운로드 핸들러
  const handleQuickExport = () => {
    exportToExcelFile(applicants, '바이브캠퍼스_전체지원자명단');
    showToast('지원 현황 엑셀(.xlsx) 파일이 다운로드되었습니다.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] text-[#3e2718]">
      {/* 글로벌 상단 헤더 */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applicantCount={applicants.length}
        postCount={posts.length}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onQuickExport={handleQuickExport}
      />

      {/* 전역 토스트 알림창 */}
      {globalToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 bg-[#6b4226] text-white rounded-xl shadow-xl border border-[#8f5a36] animate-bounce-subtle flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#88d49e] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold leading-tight">{globalToast.message}</p>
            {globalToast.sub && (
              <p className="text-[11px] text-[#ebdcd0] mt-0.5 leading-snug">{globalToast.sub}</p>
            )}
          </div>
        </div>
      )}

      {/* 본문 메인 컨테이너 (1200px 안정적 너비) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 탭 1: 모집 공고 탐색 및 지원서 작성 폼 */}
        {activeTab === 'posts' && (
          <RecruitmentList
            posts={posts}
            applicants={applicants}
            onApplySuccess={handleApplySuccess}
            onSelectPostToManage={handleSelectPostToManage}
          />
        )}

        {/* 탭 2: 팀 매칭 관리 대시보드 & 엑셀 다운로드 시스템 */}
        {activeTab === 'dashboard' && (
          <Dashboard
            posts={posts}
            applicants={applicants}
            selectedPostId={dashboardSelectedPostId}
            onSelectPostId={setDashboardSelectedPostId}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            onDeleteApplicant={handleDeleteApplicant}
            onOpenCreatePost={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* 탭 3: 원작 바이브 카페 음료 주문서 (참고 프롬프트 원형 완벽 구현) */}
        {activeTab === 'cafe' && <CafeOrderTab />}
      </main>

      {/* 공고 등록 모달 */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* 푸터 영역: 군더더기 없는 단정한 캠퍼스 푸터 */}
      <footer className="mt-16 border-t border-[#e2d4c7] bg-[#f5ede3] py-8 text-xs text-[#8c6b54]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">☕</span>
            <span className="font-bold text-[#6b4226]">바이브 캠퍼스 (VIBE Campus)</span>
            <span>·</span>
            <span>대학생 팀 프로젝트 & 스터디원 모집 매칭 최적화 시스템</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>실시간 회비/비용 계산기</span>
            <span>·</span>
            <span>엑셀(.xlsx) 명단 다운로드</span>
            <span>·</span>
            <span>© 2026 VIBE Campus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
