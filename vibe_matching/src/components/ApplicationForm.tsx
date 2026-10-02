/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { RecruitmentPost, Applicant } from '../types';
import { CheckCircle2, RotateCcw, Send, Sparkles, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface ApplicationFormProps {
  post: RecruitmentPost;
  onApplySuccess: (applicant: Applicant) => void;
  onClose?: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  post,
  onApplySuccess,
  onClose,
}) => {
  // 고유 ID 생성을 위한 useId
  const idPrefix = useId();

  // 1. 폼 상태 관리
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedRole, setSelectedRole] = useState(post.roles[0] || '');
  const [availableHours, setAvailableHours] = useState('주 6~10시간');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [notes, setNotes] = useState('');

  // 추가 옵션 (체크박스 목록)
  const [optionMeeting, setOptionMeeting] = useState(true); // 정기 모임 100% 필참
  const [optionLaptop, setOptionLaptop] = useState(true); // 개인 노트북 지참 가능
  const [optionSnack, setOptionSnack] = useState(false); // 스터디룸 카페 음료/다과비 분담 (+3,000원)
  const [optionCloud, setOptionCloud] = useState(false); // 실습 클라우드/교재비 분담 (+5,000원)

  // 피드백 및 유효성 검사 메시지
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  // 2. 실시간 예상 금액 계산 (기본 스터디 회비 + 선택 옵션 비용)
  const calculateTotalFee = (): number => {
    let fee = post.baseMonthlyFee;
    if (optionSnack) fee += 3000;
    if (optionCloud) fee += 5000;
    return fee;
  };

  const currentTotalFee = calculateTotalFee();

  // 3. 다시 작성 (초기화) 버튼 핸들러
  const handleReset = () => {
    setName('');
    setPhone('');
    setDepartment('');
    setStudentId('');
    setSelectedRole(post.roles[0] || '');
    setAvailableHours('주 6~10시간');
    setPortfolioUrl('');
    setNotes('');
    setOptionMeeting(true);
    setOptionLaptop(true);
    setOptionSnack(false);
    setOptionCloud(false);
    setErrorMessage(null);
    setConfirmationMessage(null);
  };

  // 4. 지원하기 제출 핸들러 (유효성 검사 및 확인 메시지)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 필수 유효성 검사: 이름 체크
    if (!name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      document.getElementById(`${idPrefix}-name`)?.focus();
      return;
    }

    // 전화번호 체크
    if (!phone.trim()) {
      setErrorMessage('전화번호를 입력해주세요.');
      document.getElementById(`${idPrefix}-phone`)?.focus();
      return;
    }

    // 학과 체크
    if (!department.trim()) {
      setErrorMessage('학과/전공을 입력해주세요.');
      document.getElementById(`${idPrefix}-dept`)?.focus();
      return;
    }

    // 음료/역할 선택 체크
    if (!selectedRole) {
      setErrorMessage('지원 포지션(역할)을 선택해주세요.');
      return;
    }

    // 선택된 옵션 목록 정리
    const selectedOptions: string[] = [];
    if (optionMeeting) selectedOptions.push('정기모임 100% 필참');
    if (optionLaptop) selectedOptions.push('노트북 지참 가능');
    if (optionSnack) selectedOptions.push('카페 음료/다과비 분담 (+3,000원)');
    if (optionCloud) selectedOptions.push('교재/클라우드 분담 (+5,000원)');

    // 새로운 지원자 객체 생성
    const newApplicant: Applicant = {
      id: `app-${Date.now()}`,
      postId: post.id,
      postTitle: post.title,
      name: name.trim(),
      phone: phone.trim(),
      department: department.trim(),
      studentId: studentId.trim() || '학년 미기재',
      appliedRole: selectedRole,
      availableHours,
      options: selectedOptions,
      notes: notes.trim() || '성실하게 참여하겠습니다!',
      portfolioUrl: portfolioUrl.trim(),
      status: 'PENDING',
      appliedAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      estimatedFee: currentTotalFee,
    };

    // 상위 컴포넌트에 전달 (로컬스토리지 및 대시보드 동기화)
    onApplySuccess(newApplicant);

    // 주문 확인 메시지 형식의 지원 접수 완료 안내
    const optionText = selectedOptions.length > 0 ? ` (${selectedOptions[0]}${selectedOptions.length > 1 ? ` 외 ${selectedOptions.length - 1}건` : ''})` : '';
    const successText = `${name}님, [${post.title.split(']')[0] || post.title}] ${selectedRole} 포지션${optionText}, 총 ${currentTotalFee.toLocaleString()}원 지원서가 성공적으로 접수되었습니다!`;
    
    setConfirmationMessage(successText);
  };

  return (
    <div className="w-full max-w-[520px] mx-auto bg-[#ffffff] border border-[#ebdcd0] rounded-2xl shadow-md p-6 sm:p-7 transition-all">
      {/* 폼 상단 헤더: 카페 & 스터디 감성 */}
      <div className="text-center mb-6 border-b border-[#f3eae1] pb-4">
        <div className="text-4xl mb-1.5" role="img" aria-label="coffee">☕</div>
        <h2 className="text-xl font-bold text-[#6b4226] tracking-tight">
          팀원 & 스터디원 지원 신청서
        </h2>
        <p className="text-xs text-[#8c6b54] mt-1 font-medium">
          {post.title}
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#faf4ee] text-[#8c5e3c] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>활동 방식: {post.meetingType}</span>
          <span className="text-[#d8c2b0]">·</span>
          <span>기간: {post.activityPeriod}</span>
        </div>
      </div>

      {/* 에러 알림 메시지 */}
      {errorMessage && (
        <div className="mb-5 p-3 rounded-lg bg-[#fdf2f2] border border-[#f8b4b4] text-[#9b1c1c] text-xs font-medium flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 주문/지원 확인 메시지 (프롬프트 요구사항: 연두색 배경, 초록 글씨, 둥근 모서리) */}
      {confirmationMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#eaf7ee] border border-[#b8e2c4] text-[#1c6434] text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#2b8a3e] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1e5e2e] text-sm">지원서 접수 완료!</p>
            <p className="mt-1">{confirmationMessage}</p>
            <p className="text-[11px] text-[#2f7543] mt-2">
              ※ 팀장({post.leaderName} / {post.leaderContact})이 검토 후 대시보드 상태를 업데이트합니다.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. 이름 (필수, text) */}
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="block text-xs font-semibold text-[#54331d] mb-1.5"
          >
            1. 이름 <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
            required
          />
        </div>

        {/* 2. 전화번호 (tel) */}
        <div>
          <label
            htmlFor={`${idPrefix}-phone`}
            className="block text-xs font-semibold text-[#54331d] mb-1.5"
          >
            2. 전화번호 <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
            className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
            required
          />
        </div>

        {/* 2-1. 학과/전공 및 학번 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${idPrefix}-dept`}
              className="block text-xs font-semibold text-[#54331d] mb-1.5"
            >
              3. 학과 / 전공 <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id={`${idPrefix}-dept`}
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="컴퓨터공학과"
              className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
              required
            />
          </div>
          <div>
            <label
              htmlFor={`${idPrefix}-sid`}
              className="block text-xs font-semibold text-[#54331d] mb-1.5"
            >
              학번 / 학년
            </label>
            <input
              id={`${idPrefix}-sid`}
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="2023학번 / 3학년"
              className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
            />
          </div>
        </div>

        {/* 3. 지원 포지션/음료 선택 (드롭다운) */}
        <div>
          <label
            htmlFor={`${idPrefix}-role`}
            className="block text-xs font-semibold text-[#54331d] mb-1.5"
          >
            4. 지원 역할 / 희망 포지션 <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            id={`${idPrefix}-role`}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input-cafe text-sm text-[#3e2718] bg-white cursor-pointer"
          >
            {post.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* 4. 주당 참여 가능 시간 (라디오 버튼, 가로 배치) */}
        <div>
          <label className="block text-xs font-semibold text-[#54331d] mb-1.5">
            5. 주당 활동 가능 시간 (라디오 선택)
          </label>
          <div className="flex flex-wrap items-center gap-4 py-1.5">
            {[
              { label: '주 3~5시간', value: '주 3~5시간' },
              { label: '주 6~10시간 (권장)', value: '주 6~10시간' },
              { label: '주 10시간 이상', value: '주 10시간 이상' },
            ].map((item) => (
              <label
                key={item.value}
                htmlFor={`${idPrefix}-hours-${item.value}`}
                className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer hover:text-[#6b4226]"
              >
                <input
                  id={`${idPrefix}-hours-${item.value}`}
                  type="radio"
                  name={`${idPrefix}-hours`}
                  value={item.value}
                  checked={availableHours === item.value}
                  onChange={(e) => setAvailableHours(e.target.value)}
                  className="accent-[#6b4226] w-4 h-4 cursor-pointer"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 5. 추가 옵션 (체크박스, 가로 배치) */}
        <div>
          <label className="block text-xs font-semibold text-[#54331d] mb-1.5">
            6. 추가 옵션 & 활동 조건 동의 (체크박스)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-1">
            <label
              htmlFor={`${idPrefix}-opt-laptop`}
              className="flex items-center gap-2 text-xs text-[#52311b] cursor-pointer"
            >
              <input
                id={`${idPrefix}-opt-laptop`}
                type="checkbox"
                checked={optionLaptop}
                onChange={(e) => setOptionLaptop(e.target.checked)}
                className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
              />
              <span>개인 노트북 지참 가능 (+0원)</span>
            </label>

            <label
              htmlFor={`${idPrefix}-opt-meeting`}
              className="flex items-center gap-2 text-xs text-[#52311b] cursor-pointer"
            >
              <input
                id={`${idPrefix}-opt-meeting`}
                type="checkbox"
                checked={optionMeeting}
                onChange={(e) => setOptionMeeting(e.target.checked)}
                className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
              />
              <span>정기 회의 필참 서약 (+0원)</span>
            </label>

            <label
              htmlFor={`${idPrefix}-opt-snack`}
              className="flex items-center gap-2 text-xs text-[#52311b] cursor-pointer"
            >
              <input
                id={`${idPrefix}-opt-snack`}
                type="checkbox"
                checked={optionSnack}
                onChange={(e) => setOptionSnack(e.target.checked)}
                className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
              />
              <span>카페 음료/다과비 분담 (+3,000원)</span>
            </label>

            <label
              htmlFor={`${idPrefix}-opt-cloud`}
              className="flex items-center gap-2 text-xs text-[#52311b] cursor-pointer"
            >
              <input
                id={`${idPrefix}-opt-cloud`}
                type="checkbox"
                checked={optionCloud}
                onChange={(e) => setOptionCloud(e.target.checked)}
                className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
              />
              <span>클라우드/교재비 지원 (+5,000원)</span>
            </label>
          </div>
        </div>

        {/* 7. 포트폴리오/노션 링크 */}
        <div>
          <label
            htmlFor={`${idPrefix}-portfolio`}
            className="block text-xs font-semibold text-[#54331d] mb-1.5"
          >
            7. 포트폴리오 / GitHub / 블로그 링크
          </label>
          <input
            id={`${idPrefix}-portfolio`}
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
          />
        </div>

        {/* 8. 요청사항 및 각오 (textarea) */}
        <div>
          <label
            htmlFor={`${idPrefix}-notes`}
            className="block text-xs font-semibold text-[#54331d] mb-1.5"
          >
            8. 지원 동기 및 각오 (요청사항)
          </label>
          <textarea
            id={`${idPrefix}-notes`}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="해당 스터디/프로젝트에 기여하고 싶은 점이나 다짐을 자유롭게 적어주세요."
            className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d] resize-none"
          />
        </div>

        {/* 실시간 예상 금액 표시 영역 (프롬프트 요구사항: 큰 글씨 24px, 갈색, 굵게, 가운데 정렬) */}
        <div className="py-4 my-2 text-center border-y border-[#ebdcd0] bg-[#faf6f0]/70 rounded-xl">
          <p className="text-xs font-medium text-[#8c6b54] mb-1">
            월 예상 스터디룸 및 활동 분담금 (실시간 계산)
          </p>
          <div className="text-[24px] font-extrabold text-[#6b4226] tracking-tight tabular-nums">
            예상 금액: {currentTotalFee.toLocaleString()}원
          </div>
          <p className="text-[11px] text-[#a48874] mt-0.5">
            기본 회비 {post.baseMonthlyFee.toLocaleString()}원 + 옵션 {((optionSnack ? 3000 : 0) + (optionCloud ? 5000 : 0)).toLocaleString()}원
          </p>
        </div>

        {/* 버튼 영역: 주문/지원하기 버튼 (갈색 배경 #6b4226, hover 시 약간 밝게) & 다시 작성 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="sm:col-span-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg border border-[#cbb3a1] bg-[#fbf8f5] text-[#6b4226] hover:bg-[#ede1d5] text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 작성</span>
          </button>

          <button
            type="submit"
            className="sm:col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#6b4226] hover:bg-[#7e4f30] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>지원서 제출하기</span>
          </button>
        </div>
      </form>
    </div>
  );
};
