/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 지원자 상태 타입: 대기중, 서류통과, 최종선발, 반려
export type ApplicantStatus = 'PENDING' | 'DOCUMENT_PASS' | 'ACCEPTED' | 'REJECTED';

// 활동 방식: 대면, 비대면, 온/오프라인 혼합
export type MeetingType = '오프라인(카페/스터디룸)' | '온라인(Discord/Zoom)' | '혼합(블렌디드)';

// 프로젝트/스터디 카테고리
export type ProjectCategory = 
  | '개발/IT' 
  | '공모전/해커톤' 
  | '학점/전공스터디' 
  | '어학/자격증' 
  | '창업/사이드프로젝트';

// 모집 공고 데이터 인터페이스
export interface RecruitmentPost {
  id: string;
  title: string;
  category: ProjectCategory;
  leaderName: string;
  leaderContact: string;
  deadline: string;
  targetCount: number; // 모집 목표 인원
  roles: string[]; // 모집 포지션/역할 목록
  meetingType: MeetingType;
  activityPeriod: string; // 예: "8주 (방학 집중)"
  baseMonthlyFee: number; // 기본 스터디룸/재료 예상 비용
  description: string;
  requirements: string[]; // 필수 및 우대 조건
  createdAt: string;
}

// 지원서 데이터 인터페이스
export interface Applicant {
  id: string;
  postId: string;
  postTitle: string;
  name: string;
  phone: string;
  department: string;
  studentId: string;
  appliedRole: string;
  availableHours: string; // "주 3~5시간", "주 6~10시간", "주 10시간 이상"
  options: string[]; // 체크박스 선택 옵션
  notes: string; // 각오 및 요청사항
  portfolioUrl?: string; // 포트폴리오/깃허브/블로그 링크
  status: ApplicantStatus;
  appliedAt: string;
  estimatedFee: number; // 실시간 계산된 예상 참여 비용
}

// 카페 주문서 인터페이스 (참고 프롬프트 원형 스펙)
export interface CafeOrder {
  name: string;
  phone: string;
  beverage: string;
  beveragePrice: number;
  size: 'S' | 'M' | 'L';
  sizePrice: number;
  options: string[];
  optionsPrice: number;
  quantity: number;
  requests: string;
  totalPrice: number;
  orderedAt: string;
}
