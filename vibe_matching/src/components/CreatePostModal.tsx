/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { RecruitmentPost, ProjectCategory, MeetingType } from '../types';
import { PlusCircle, RotateCcw, X, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: RecruitmentPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const idPrefix = useId();

  // 1. 폼 상태 정의
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('개발/IT');
  const [leaderName, setLeaderName] = useState('');
  const [leaderContact, setLeaderContact] = useState('');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [targetCount, setTargetCount] = useState<number>(4);
  const [rolesInput, setRolesInput] = useState('프론트엔드, 백엔드, 디자이너');
  const [meetingType, setMeetingType] = useState<MeetingType>('혼합(블렌디드)');
  const [activityPeriod, setActivityPeriod] = useState('8주');
  const [baseMonthlyFee, setBaseMonthlyFee] = useState<number>(10000);
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('주 1회 정기회의 참석, 성실한 소통');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 2. 폼 초기화 핸들러
  const handleReset = () => {
    setTitle('');
    setCategory('개발/IT');
    setLeaderName('');
    setLeaderContact('');
    setDeadline('2026-10-31');
    setTargetCount(4);
    setRolesInput('프론트엔드, 백엔드, 디자이너');
    setMeetingType('혼합(블렌디드)');
    setActivityPeriod('8주');
    setBaseMonthlyFee(10000);
    setDescription('');
    setRequirementsInput('주 1회 정기회의 참석, 성실한 소통');
    setErrorMessage(null);
  };

  // 3. 등록 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('공고 제목을 입력해주세요.');
      return;
    }
    if (!leaderName.trim()) {
      setErrorMessage('팀장(작성자) 이름을 입력해주세요.');
      return;
    }
    if (!leaderContact.trim()) {
      setErrorMessage('팀장 연락처를 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('공고 상세 설명을 입력해주세요.');
      return;
    }

    // 쉼표로 분리된 포지션 및 필수 조건 가공
    const roles = rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const requirements = requirementsInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const newPost: RecruitmentPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      category,
      leaderName: leaderName.trim(),
      leaderContact: leaderContact.trim(),
      deadline,
      targetCount: Math.max(1, targetCount),
      roles: roles.length > 0 ? roles : ['팀원'],
      meetingType,
      activityPeriod: activityPeriod.trim() || '협의 후 결정',
      baseMonthlyFee: Math.max(0, baseMonthlyFee),
      description: description.trim(),
      requirements: requirements.length > 0 ? requirements : ['성실한 참여'],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onPostCreated(newPost);
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-[560px] bg-white border border-[#ebdcd0] rounded-2xl shadow-xl p-6 sm:p-7 my-6">
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f4ebe1] hover:bg-[#e4d4c6] text-[#6b4226] font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 상단 타이틀 */}
        <div className="text-center border-b border-[#f3eae1] pb-4 mb-5">
          <div className="text-3xl mb-1" role="img" aria-label="post">✍️</div>
          <h2 className="text-lg sm:text-xl font-bold text-[#6b4226]">
            새로운 스터디 / 팀 프로젝트 모집 공고
          </h2>
          <p className="text-xs text-[#8c6b54] mt-1 font-medium">
            원하는 인재와 활동 조건을 작성하여 멋진 팀을 빌딩해보세요
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-[#fdf2f2] border border-[#f8b4b4] text-[#9b1c1c] text-xs font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. 공고 제목 */}
          <div>
            <label htmlFor={`${idPrefix}-title`} className="block font-semibold text-[#54331d] mb-1">
              공고 제목 <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id={`${idPrefix}-title`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: [해커톤] 2026 하계 대학생 AI 서비스 개발팀 팀원 모집"
              className="input-cafe text-xs sm:text-sm text-[#3e2718]"
              required
            />
          </div>

          {/* 2. 카테고리 & 활동 방식 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${idPrefix}-category`} className="block font-semibold text-[#54331d] mb-1">
                카테고리 선택
              </label>
              <select
                id={`${idPrefix}-category`}
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="input-cafe text-xs sm:text-sm text-[#3e2718] bg-white cursor-pointer"
              >
                <option value="개발/IT">개발/IT</option>
                <option value="공모전/해커톤">공모전/해커톤</option>
                <option value="학점/전공스터디">학점/전공스터디</option>
                <option value="어학/자격증">어학/자격증</option>
                <option value="창업/사이드프로젝트">창업/사이드프로젝트</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${idPrefix}-meeting`} className="block font-semibold text-[#54331d] mb-1">
                모임 진행 방식
              </label>
              <select
                id={`${idPrefix}-meeting`}
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                className="input-cafe text-xs sm:text-sm text-[#3e2718] bg-white cursor-pointer"
              >
                <option value="혼합(블렌디드)">혼합(블렌디드 온/오프)</option>
                <option value="오프라인(카페/스터디룸)">오프라인(카페/스터디룸)</option>
                <option value="온라인(Discord/Zoom)">온라인(Discord/Zoom)</option>
              </select>
            </div>
          </div>

          {/* 3. 팀장 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${idPrefix}-leader`} className="block font-semibold text-[#54331d] mb-1">
                팀장 이름 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id={`${idPrefix}-leader`}
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="김민준"
                className="input-cafe text-xs sm:text-sm text-[#3e2718]"
                required
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-contact`} className="block font-semibold text-[#54331d] mb-1">
                팀장 연락처 <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id={`${idPrefix}-contact`}
                type="tel"
                value={leaderContact}
                onChange={(e) => setLeaderContact(e.target.value)}
                placeholder="010-1234-5678"
                className="input-cafe text-xs sm:text-sm text-[#3e2718]"
                required
              />
            </div>
          </div>

          {/* 4. 모집 인원, 마감일, 활동 기간 */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label htmlFor={`${idPrefix}-target`} className="block font-semibold text-[#54331d] mb-1">
                목표 인원(명)
              </label>
              <input
                id={`${idPrefix}-target`}
                type="number"
                min="1"
                max="20"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="input-cafe text-xs sm:text-sm text-[#3e2718]"
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-period`} className="block font-semibold text-[#54331d] mb-1">
                활동 기간
              </label>
              <input
                id={`${idPrefix}-period`}
                type="text"
                value={activityPeriod}
                onChange={(e) => setActivityPeriod(e.target.value)}
                placeholder="예: 8주"
                className="input-cafe text-xs sm:text-sm text-[#3e2718]"
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-deadline`} className="block font-semibold text-[#54331d] mb-1">
                모집 마감일
              </label>
              <input
                id={`${idPrefix}-deadline`}
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-cafe text-xs text-[#3e2718]"
              />
            </div>
          </div>

          {/* 5. 모집 포지션 */}
          <div>
            <label htmlFor={`${idPrefix}-roles`} className="block font-semibold text-[#54331d] mb-1">
              모집 포지션 (쉼표로 구분)
            </label>
            <input
              id={`${idPrefix}-roles`}
              type="text"
              value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="프론트엔드 (React), 백엔드 (Node/Spring), UI/UX 디자이너"
              className="input-cafe text-xs sm:text-sm text-[#3e2718]"
            />
          </div>

          {/* 6. 월 예상 회비 (실시간 콤마 표기) */}
          <div>
            <label htmlFor={`${idPrefix}-fee`} className="block font-semibold text-[#54331d] mb-1">
              월 예상 스터디룸 및 활동 분담금 (원 단위)
            </label>
            <input
              id={`${idPrefix}-fee`}
              type="number"
              step="1000"
              min="0"
              value={baseMonthlyFee}
              onChange={(e) => setBaseMonthlyFee(parseInt(e.target.value) || 0)}
              className="input-cafe text-xs sm:text-sm text-[#3e2718] font-mono"
            />
            <p className="text-[11px] text-[#8c6b54] mt-1">
              💡 실시간 환산 금액: <strong>{baseMonthlyFee.toLocaleString()}원</strong> (지원서 폼에서 자동 계산됩니다)
            </p>
          </div>

          {/* 7. 상세 설명 */}
          <div>
            <label htmlFor={`${idPrefix}-desc`} className="block font-semibold text-[#54331d] mb-1">
              프로젝트 / 스터디 상세 소개 <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              id={`${idPrefix}-desc`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="목표, 진행 방식, 사용할 기술 스택 등을 자세히 설명해주세요."
              className="input-cafe text-xs sm:text-sm text-[#3e2718] resize-none"
              required
            />
          </div>

          {/* 8. 우대 및 지원 조건 */}
          <div>
            <label htmlFor={`${idPrefix}-reqs`} className="block font-semibold text-[#54331d] mb-1">
              우대 및 필수 조건 (쉼표로 구분)
            </label>
            <input
              id={`${idPrefix}-reqs`}
              type="text"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="Git 협업 경험, 주당 최소 6시간 확보 가능자"
              className="input-cafe text-xs sm:text-sm text-[#3e2718]"
            />
          </div>

          {/* 모달 하단 버튼 */}
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#f4ebe1]">
            <button
              type="button"
              onClick={handleReset}
              className="col-span-1 py-2.5 px-3 rounded-lg border border-[#cbb3a1] bg-[#fbf8f5] text-[#6b4226] hover:bg-[#ede1d5] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
            <button
              type="submit"
              className="col-span-2 py-2.5 px-4 rounded-lg bg-[#6b4226] hover:bg-[#7e4f30] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>모집 공고 등록 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
