/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecruitmentPost, Applicant, ApplicantStatus } from '../types';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  UserCheck, 
  ExternalLink, 
  Phone, 
  Search, 
  Trash2, 
  Eye, 
  Filter,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { exportToExcelFile, exportToCsvFile, STATUS_LABELS } from '../utils/excelExport';

interface DashboardProps {
  posts: RecruitmentPost[];
  applicants: Applicant[];
  selectedPostId: string | null;
  onSelectPostId: (postId: string | null) => void;
  onUpdateApplicantStatus: (applicantId: string, newStatus: ApplicantStatus) => void;
  onDeleteApplicant: (applicantId: string) => void;
  onOpenCreatePost: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  posts,
  applicants,
  selectedPostId,
  onSelectPostId,
  onUpdateApplicantStatus,
  onDeleteApplicant,
  onOpenCreatePost,
}) => {
  // 상태별 필터 (전체, 대기, 서류통과, 최종선발, 보류)
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicantStatus>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeDetailApplicant, setActiveDetailApplicant] = useState<Applicant | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // 현재 선택된 공고 객체
  const currentPost = posts.find((p) => p.id === selectedPostId);

  // 필터링 적용된 지원자 목록
  const filteredApplicants = applicants.filter((app) => {
    const matchesPost = !selectedPostId || app.postId === selectedPostId;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.department.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.appliedRole.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.phone.includes(searchKeyword);
    return matchesPost && matchesStatus && matchesSearch;
  });

  // 통계 계산
  const totalApplicants = applicants.length;
  const acceptedApplicants = applicants.filter((a) => a.status === 'ACCEPTED').length;
  const pendingApplicants = applicants.filter((a) => a.status === 'PENDING').length;
  const documentPassApplicants = applicants.filter((a) => a.status === 'DOCUMENT_PASS').length;

  // 선택된 특정 공고의 정원 달성도
  const currentPostAccepted = currentPost
    ? applicants.filter((a) => a.postId === currentPost.id && a.status === 'ACCEPTED').length
    : 0;
  const currentPostTarget = currentPost ? currentPost.targetCount : 0;
  const currentPostPercent = currentPostTarget > 0 ? Math.min(100, Math.round((currentPostAccepted / currentPostTarget) * 100)) : 0;

  // 클립보드 복사 알림 헬퍼
  const handleCopyPhone = (phone: string, name: string) => {
    navigator.clipboard.writeText(phone);
    setCopyFeedback(`${name}님의 연락처(${phone})가 복사되었습니다.`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // 엑셀 다운로드 실행
  const handleExcelExport = () => {
    const filename = currentPost 
      ? `팀매칭_${currentPost.title.slice(0, 15).replace(/\s+/g, '_')}`
      : '바이브캠퍼스_전체지원자명단';
    exportToExcelFile(filteredApplicants, filename);
  };

  // CSV 다운로드 실행
  const handleCsvExport = () => {
    const filename = currentPost 
      ? `팀매칭_${currentPost.title.slice(0, 15).replace(/\s+/g, '_')}`
      : '바이브캠퍼스_전체지원자명단';
    exportToCsvFile(filteredApplicants, filename);
  };

  return (
    <div className="space-y-6">
      {/* 알림 배너 */}
      {copyFeedback && (
        <div className="p-3 bg-[#eaf7ee] border border-[#b8e2c4] text-[#1c6434] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all">
          <ClipboardCheck className="w-4 h-4 text-[#2b8a3e]" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* 대시보드 상단 헤더 및 통계 카드 (Anti-Slop: 단일 레이어 경량 서피스) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#ebdcd0] rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-[#8c6b54]">전체 지원자</p>
          <p className="text-2xl font-extrabold text-[#4a2c16] mt-1 tabular-nums">
            {totalApplicants}명
          </p>
          <p className="text-[11px] text-[#a48874] mt-0.5">총 {posts.length}개 공고</p>
        </div>

        <div className="bg-white border border-[#ebdcd0] rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-[#8c6b54]">검토 대기</p>
          <p className="text-2xl font-extrabold text-[#d97706] mt-1 tabular-nums">
            {pendingApplicants}명
          </p>
          <p className="text-[11px] text-[#a48874] mt-0.5">서류 미검토</p>
        </div>

        <div className="bg-white border border-[#ebdcd0] rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-[#8c6b54]">서류 합격</p>
          <p className="text-2xl font-extrabold text-[#2563eb] mt-1 tabular-nums">
            {documentPassApplicants}명
          </p>
          <p className="text-[11px] text-[#a48874] mt-0.5">면접/사전미팅 진행</p>
        </div>

        <div className="bg-white border border-[#ebdcd0] rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-[#8c6b54]">최종 선발 (매칭완료)</p>
          <p className="text-2xl font-extrabold text-[#16a34a] mt-1 tabular-nums">
            {acceptedApplicants}명
          </p>
          <p className="text-[11px] text-[#a48874] mt-0.5">팀 빌딩 확정</p>
        </div>
      </div>

      {/* 선택된 공고의 팀 빌딩 정원 달성 게이지 (공고를 선택했을 때 표시) */}
      {currentPost && (
        <div className="bg-white border border-[#ebdcd0] rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-bold text-[#8c5e3c]">선택된 프로젝트 공고</span>
              <h2 className="text-base font-bold text-[#4a2c16]">{currentPost.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8c6b54]">팀원 충원 현황: </span>
              <span className="text-sm font-extrabold text-[#6b4226] tabular-nums">
                {currentPostAccepted} / {currentPostTarget}명 ({currentPostPercent}%)
              </span>
            </div>
          </div>

          {/* 게이지 바 */}
          <div className="w-full bg-[#f3eae1] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#6b4226] h-full transition-all duration-300"
              style={{ width: `${currentPostPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#8c6b54] mt-2">
            <span>목표 인원 {currentPostTarget}명</span>
            <span>
              {currentPostAccepted >= currentPostTarget ? (
                <span className="text-[#16a34a] font-bold">🎉 정원 충원 완료!</span>
              ) : (
                <span>{currentPostTarget - currentPostAccepted}명 추가 선발 가능</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* 필터 바 & 엑셀 다운로드 컨트롤 영역 */}
      <div className="bg-white border border-[#ebdcd0] rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* 공고 선택 드롭다운 */}
          <div className="flex-1 max-w-sm">
            <label htmlFor="select-post-filter" className="block text-xs font-semibold text-[#6b4226] mb-1">
              공고별 지원자 보기
            </label>
            <select
              id="select-post-filter"
              value={selectedPostId || ''}
              onChange={(e) => onSelectPostId(e.target.value ? e.target.value : null)}
              className="input-cafe text-xs sm:text-sm text-[#3e2718] bg-white cursor-pointer"
            >
              <option value="">모든 공고 지원자 전체 보기 ({applicants.length}명)</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}
                </option>
              ))}
            </select>
          </div>

          {/* 검색어 입력 */}
          <div className="flex-1 max-w-xs">
            <label htmlFor="search-applicant" className="block text-xs font-semibold text-[#6b4226] mb-1">
              지원자 검색
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9b7b64] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-applicant"
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="이름, 학과, 포지션, 전화번호..."
                className="input-cafe pl-9 text-xs sm:text-sm text-[#3e2718] placeholder:text-[#a88f7d]"
              />
            </div>
          </div>

          {/* 엑셀 / CSV 내보내기 버튼 그룹 (핵심 요구사항) */}
          <div className="flex items-end gap-2 pt-1 md:pt-0">
            <button
              onClick={handleExcelExport}
              disabled={filteredApplicants.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                filteredApplicants.length === 0
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#1e7145] hover:bg-[#165634] text-white active:scale-[0.98]'
              }`}
              title="현재 지원자 목록을 엑셀(.xlsx) 파일로 다운로드합니다"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>엑셀 다운로드 (.xlsx)</span>
            </button>

            <button
              onClick={handleCsvExport}
              disabled={filteredApplicants.length === 0}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border shadow-xs cursor-pointer whitespace-nowrap ${
                filteredApplicants.length === 0
                  ? 'bg-neutral-50 text-neutral-300 border-neutral-200 cursor-not-allowed'
                  : 'bg-[#faf6f0] hover:bg-[#ebdcd0] text-[#6b4226] border-[#d8c3b1]'
              }`}
              title="UTF-8 BOM 인코딩 CSV 파일로 다운로드합니다"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 저장</span>
            </button>
          </div>
        </div>

        {/* 상태별 탭 필터 (세그먼트 버튼) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#f4ebe1] overflow-x-auto scrollbar-none">
          {[
            { id: 'ALL', label: `전체 (${applicants.filter((a) => !selectedPostId || a.postId === selectedPostId).length})` },
            { id: 'PENDING', label: `대기중 (${applicants.filter((a) => (!selectedPostId || a.postId === selectedPostId) && a.status === 'PENDING').length})` },
            { id: 'DOCUMENT_PASS', label: `서류통과 (${applicants.filter((a) => (!selectedPostId || a.postId === selectedPostId) && a.status === 'DOCUMENT_PASS').length})` },
            { id: 'ACCEPTED', label: `최종선발 (${applicants.filter((a) => (!selectedPostId || a.postId === selectedPostId) && a.status === 'ACCEPTED').length})` },
            { id: 'REJECTED', label: `보류 (${applicants.filter((a) => (!selectedPostId || a.postId === selectedPostId) && a.status === 'REJECTED').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#6b4226] text-white shadow-2xs'
                  : 'bg-[#f4ebe1] text-[#6b4226] hover:bg-[#ebdcd0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 지원자 테이블 (고밀도 데이터 그리드, Tabular Numerals 적용) */}
      <div className="bg-white border border-[#ebdcd0] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3e2718]">
            <thead className="bg-[#f7efe7] text-[#6b4226] font-bold border-b border-[#ebdcd0]">
              <tr>
                <th className="py-3 px-3 w-12 text-center">번호</th>
                <th className="py-3 px-3">지원자 / 학과</th>
                <th className="py-3 px-3">지원 포지션</th>
                <th className="py-3 px-3">연락처</th>
                <th className="py-3 px-3">가능 시간</th>
                <th className="py-3 px-3">예상 분담금</th>
                <th className="py-3 px-3 text-center">매칭 상태</th>
                <th className="py-3 px-3 text-right">상태 변경 / 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5ece3]">
              {filteredApplicants.map((applicant, idx) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-[#faf6f1] transition-colors"
                >
                  <td className="py-3 px-3 text-center text-[#8c6b54] tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#4a2c16] flex items-center gap-1.5">
                      <span>{applicant.name}</span>
                      <button
                        onClick={() => setActiveDetailApplicant(applicant)}
                        className="text-[#8c5e3c] hover:text-[#4a2c16] p-0.5 rounded cursor-pointer"
                        title="지원서 상세 보기"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#8c6b54]">
                      {applicant.department} · {applicant.studentId}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#52311b]">
                    {applicant.appliedRole}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleCopyPhone(applicant.phone, applicant.name)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#6b4226] hover:underline cursor-pointer"
                      title="클릭 시 번호 복사"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{applicant.phone}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-[#664b38]">
                    {applicant.availableHours}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#6b4226] tabular-nums">
                    {applicant.estimatedFee.toLocaleString()}원
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${
                        applicant.status === 'ACCEPTED'
                          ? 'bg-[#eaf7ee] text-[#1e5e2e] border border-[#b8e2c4]'
                          : applicant.status === 'DOCUMENT_PASS'
                          ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]'
                          : applicant.status === 'PENDING'
                          ? 'bg-[#fffbeb] text-[#b45309] border border-[#fde68a]'
                          : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                      }`}
                    >
                      {STATUS_LABELS[applicant.status]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* 상태 변경 원클릭 버튼들 */}
                      {applicant.status !== 'DOCUMENT_PASS' && (
                        <button
                          onClick={() => onUpdateApplicantStatus(applicant.id, 'DOCUMENT_PASS')}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-[#eff6ff] text-[#1d4ed8] hover:bg-[#dbeafe] transition-colors cursor-pointer"
                          title="서류 통과로 변경"
                        >
                          서류통과
                        </button>
                      )}
                      {applicant.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => onUpdateApplicantStatus(applicant.id, 'ACCEPTED')}
                          className="px-2 py-1 text-[11px] font-bold rounded bg-[#eaf7ee] text-[#1e5e2e] hover:bg-[#cceed4] transition-colors cursor-pointer"
                          title="최종 선발(합격)로 변경"
                        >
                          선발확정
                        </button>
                      )}
                      {applicant.status !== 'REJECTED' && (
                        <button
                          onClick={() => onUpdateApplicantStatus(applicant.id, 'REJECTED')}
                          className="px-2 py-1 text-[11px] font-medium rounded bg-[#fef2f2] text-[#991b1b] hover:bg-[#fee2e2] transition-colors cursor-pointer"
                          title="보류/불합격으로 변경"
                        >
                          보류
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`${applicant.name}님의 지원서를 삭제하시겠습니까?`)) {
                            onDeleteApplicant(applicant.id);
                          }
                        }}
                        className="p-1 text-[#b58c75] hover:text-[#991b1b] transition-colors cursor-pointer"
                        title="지원서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 목록 상태 (Empty State) */}
        {filteredApplicants.length === 0 && (
          <div className="py-14 text-center">
            <Users className="w-8 h-8 text-[#caa792] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#6b4226]">해당 조건의 지원자가 없습니다.</p>
            <p className="text-xs text-[#8c6b54] mt-1">
              {applicants.length === 0 
                ? '공고에 첫 지원서가 등록되면 대시보드에서 실시간으로 확인하실 수 있습니다.'
                : '검색어나 상태 필터를 변경해보세요.'}
            </p>
          </div>
        )}
      </div>

      {/* 지원서 상세 보기 모달 */}
      {activeDetailApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#ebdcd0] rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-scaleIn">
            <button
              onClick={() => setActiveDetailApplicant(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#ebdcd0] text-[#6b4226] font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-[#f3eae1] pb-3 mb-4">
              <span className="text-xs font-semibold text-[#8c5e3c]">
                {activeDetailApplicant.postTitle}
              </span>
              <h3 className="text-lg font-bold text-[#4a2c16] mt-0.5">
                {activeDetailApplicant.name} 님의 지원서 상세
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-[#3e2718]">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#faf6f1] rounded-xl border border-[#ede1d5]">
                <div>
                  <span className="text-[#8c6b54] block">학과 / 학번</span>
                  <span className="font-semibold text-sm">{activeDetailApplicant.department} ({activeDetailApplicant.studentId})</span>
                </div>
                <div>
                  <span className="text-[#8c6b54] block">지원 역할</span>
                  <span className="font-bold text-[#6b4226] text-sm">{activeDetailApplicant.appliedRole}</span>
                </div>
                <div>
                  <span className="text-[#8c6b54] block">연락처</span>
                  <span className="font-mono font-medium">{activeDetailApplicant.phone}</span>
                </div>
                <div>
                  <span className="text-[#8c6b54] block">주당 활동 가능 시간</span>
                  <span className="font-medium">{activeDetailApplicant.availableHours}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#6b4226] block mb-1">선택 동의 옵션:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDetailApplicant.options.map((opt, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#f4ebe1] text-[#6b4226] rounded-md text-[11px]">
                      ✓ {opt}
                    </span>
                  ))}
                </div>
              </div>

              {activeDetailApplicant.portfolioUrl && (
                <div>
                  <span className="font-semibold text-[#6b4226] block mb-1">포트폴리오 링크:</span>
                  <a
                    href={activeDetailApplicant.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563eb] hover:underline flex items-center gap-1 font-mono break-all"
                  >
                    <span>{activeDetailApplicant.portfolioUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              <div>
                <span className="font-semibold text-[#6b4226] block mb-1">지원 동기 및 각오:</span>
                <p className="p-3 bg-[#fdfaf7] border border-[#ebdcd0] rounded-xl leading-relaxed whitespace-pre-wrap text-[#52311b]">
                  {activeDetailApplicant.notes || '기재된 내용이 없습니다.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f4ebe1]">
                <span className="text-[#8c6b54] text-[11px]">
                  지원 일시: {activeDetailApplicant.appliedAt}
                </span>
                <span className="font-bold text-[#6b4226] tabular-nums">
                  예상 회비: {activeDetailApplicant.estimatedFee.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 모달 하단 매칭 상태 변경 버튼 */}
            <div className="mt-5 pt-3 border-t border-[#f4ebe1] flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onUpdateApplicantStatus(activeDetailApplicant.id, 'DOCUMENT_PASS');
                  setActiveDetailApplicant({ ...activeDetailApplicant, status: 'DOCUMENT_PASS' });
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#eff6ff] text-[#1d4ed8] hover:bg-[#dbeafe] cursor-pointer"
              >
                서류합격 처리
              </button>
              <button
                onClick={() => {
                  onUpdateApplicantStatus(activeDetailApplicant.id, 'ACCEPTED');
                  setActiveDetailApplicant({ ...activeDetailApplicant, status: 'ACCEPTED' });
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#6b4226] hover:bg-[#7e4f30] text-white cursor-pointer"
              >
                최종선발(합격) 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
