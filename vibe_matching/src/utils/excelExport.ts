/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Applicant, ApplicantStatus } from '../types';

// 지원 상태 한글 라벨 변환 맵
export const STATUS_LABELS: Record<ApplicantStatus, string> = {
  PENDING: '서류접수 (대기)',
  DOCUMENT_PASS: '서류합격 (면접예정)',
  ACCEPTED: '최종선발 (합격)',
  REJECTED: '선발보류 (불합격)',
};

/**
 * 지원자 목록 데이터를 엑셀 친화적 행 배열로 변환하는 함수
 */
export const formatApplicantsForExcel = (applicants: Applicant[]) => {
  return applicants.map((app, index) => ({
    '번호': index + 1,
    '지원공고명': app.postTitle,
    '지원자명': app.name,
    '학과/전공': app.department,
    '학번/학년': app.studentId,
    '전화번호': app.phone,
    '지원 포지션': app.appliedRole,
    '주당 참여 가능시간': app.availableHours,
    '선택 옵션/역할조건': app.options.join(', '),
    '예상 분담 회비': `${app.estimatedFee.toLocaleString()}원`,
    '현재 매칭 상태': STATUS_LABELS[app.status] || app.status,
    '포트폴리오 링크': app.portfolioUrl || '없음',
    '지원동기 및 요청사항': app.notes,
    '지원일시': app.appliedAt,
  }));
};

/**
 * 엑셀(.xlsx) 파일 생성 및 즉시 다운로드 함수
 */
export const exportToExcelFile = (applicants: Applicant[], filenamePrefix = '대학생_팀매칭_지원현황') => {
  if (!applicants || applicants.length === 0) {
    alert('다운로드할 지원자 데이터가 없습니다.');
    return;
  }

  // 1. 데이터 포맷팅
  const data = formatApplicantsForExcel(applicants);

  // 2. 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3. 열 너비(col width) 최적화
  const colWidths = [
    { wch: 6 },  // 번호
    { wch: 28 }, // 지원공고명
    { wch: 12 }, // 지원자명
    { wch: 18 }, // 학과/전공
    { wch: 12 }, // 학번/학년
    { wch: 16 }, // 전화번호
    { wch: 16 }, // 지원 포지션
    { wch: 18 }, // 참여가능시간
    { wch: 25 }, // 선택 옵션
    { wch: 14 }, // 예상 분담 회비
    { wch: 18 }, // 매칭 상태
    { wch: 30 }, // 포트폴리오
    { wch: 35 }, // 지원동기
    { wch: 20 }, // 지원일시
  ];
  worksheet['!cols'] = colWidths;

  // 4. 워크북 생성 및 시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '지원자명단');

  // 5. 파일 다운로드 실행 (날짜 붙임)
  const dateStr = new Date().toISOString().slice(0, 10);
  const finalFilename = `${filenamePrefix}_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, finalFilename);
};

/**
 * UTF-8 BOM 기반 CSV 다운로드 함수 (한국어 엑셀 더블클릭 시 100% 한글 안 깨짐 보장)
 */
export const exportToCsvFile = (applicants: Applicant[], filenamePrefix = '대학생_팀매칭_지원현황') => {
  if (!applicants || applicants.length === 0) {
    alert('다운로드할 지원자 데이터가 없습니다.');
    return;
  }

  const data = formatApplicantsForExcel(applicants);
  const headers = Object.keys(data[0]);

  // CSV 행 조합 (쉼표 및 따옴표 이스케이프 처리)
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = String((row as any)[header] ?? '').replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',')
    ),
  ];

  // UTF-8 BOM (\uFEFF) 추가하여 엑셀에서 깨짐 없이 열리도록 처리
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
