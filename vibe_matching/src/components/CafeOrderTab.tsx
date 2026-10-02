/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { RotateCcw, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';

// 음료 메뉴 데이터
interface BeverageItem {
  id: string;
  name: string;
  price: number;
}

const BEVERAGES: BeverageItem[] = [
  { id: 'americano', name: '아메리카노', price: 3500 },
  { id: 'latte', name: '카페라떼', price: 4000 },
  { id: 'mocha', name: '카페모카', price: 4500 },
  { id: 'vanilla', name: '바닐라라떼', price: 4500 },
  { id: 'greentea', name: '녹차라떼', price: 4500 },
];

export const CafeOrderTab: React.FC = () => {
  const idPrefix = useId();

  // 1. 주문서 입력 상태 관리
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [beverageId, setBeverageId] = useState('latte'); // 기본값: 카페라떼
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M'); // 기본 선택: M사이즈
  const [optionShot, setOptionShot] = useState(true); // 샷 추가 (+500원)
  const [optionCream, setOptionCream] = useState(false); // 크림 추가 (+500원)
  const [optionSyrup, setOptionSyrup] = useState(false); // 시럽 추가 (+300원)
  const [optionDecaf, setOptionDecaf] = useState(false); // 디카페인 (+0원)
  const [quantity, setQuantity] = useState(1); // 기본값: 1, 최소 1, 최대 10
  const [requests, setRequests] = useState('');

  // 유효성 검사 및 주문 확인 메시지
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  // 2. 실시간 예상 금액 계산 (음료, 사이즈, 추가옵션, 수량이 바뀔 때마다 자동 계산)
  const selectedBeverage = BEVERAGES.find((b) => b.id === beverageId);
  const beveragePrice = selectedBeverage ? selectedBeverage.price : 0;

  // 사이즈 추가 금액: S +0원, M +500원, L +1,000원
  const sizePrice = size === 'M' ? 500 : size === 'L' ? 1000 : 0;

  // 추가 옵션 합산 금액
  let optionsPrice = 0;
  if (optionShot) optionsPrice += 500;
  if (optionCream) optionsPrice += 500;
  if (optionSyrup) optionsPrice += 300;
  if (optionDecaf) optionsPrice += 0;

  // 총 예상 금액 = (음료 기본가 + 사이즈 추가금 + 옵션 합계) * 수량
  const singleCupPrice = beveragePrice + sizePrice + optionsPrice;
  const totalPrice = singleCupPrice * quantity;

  // 3. 다시 작성 버튼: 모든 입력과 금액 초기화
  const handleReset = () => {
    setName('');
    setPhone('');
    setBeverageId('');
    setSize('M');
    setOptionShot(false);
    setOptionCream(false);
    setOptionSyrup(false);
    setOptionDecaf(false);
    setQuantity(1);
    setRequests('');
    setErrorMessage(null);
    setOrderConfirmation(null);
  };

  // 4. 주문하기 버튼 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 이름이 비어있으면 "이름을 입력해주세요" 알림
    if (!name.trim()) {
      setErrorMessage('이름을 입력해주세요');
      document.getElementById(`${idPrefix}-name`)?.focus();
      return;
    }

    // 음료를 선택하지 않았으면 "음료를 선택해주세요" 알림
    if (!beverageId || !selectedBeverage) {
      setErrorMessage('음료를 선택해주세요');
      document.getElementById(`${idPrefix}-beverage`)?.focus();
      return;
    }

    // 선택된 옵션 문자열 조립
    const optList: string[] = [];
    if (optionShot) optList.push('샷 추가');
    if (optionCream) optList.push('크림 추가');
    if (optionSyrup) optList.push('시럽 추가');
    if (optionDecaf) optList.push('디카페인');
    const optionsText = optList.length > 0 ? ` (${optList.join(', ')})` : '';

    // 주문 확인 메시지 생성:
    // "홍길동님, 카페라떼 M사이즈 (샷 추가) 1잔, 총 5,000원 주문이 접수되었습니다!"
    const successMsg = `${name.trim()}님, ${selectedBeverage.name} ${size}사이즈${optionsText} ${quantity}잔, 총 ${totalPrice.toLocaleString()}원 주문이 접수되었습니다!`;
    setOrderConfirmation(successMsg);
  };

  return (
    <div className="py-4">
      {/* 520px 최대 너비 및 가운데 정렬 */}
      <div className="w-full max-w-[520px] mx-auto bg-white border border-[#ebdcd0] rounded-2xl shadow-md p-6 sm:p-7">
        {/* 페이지 상단: 카페 로고, 카페 이름, 부제 */}
        <div className="text-center mb-6 border-b border-[#f3eae1] pb-4">
          <div className="text-5xl mb-2" role="img" aria-label="coffee cup">
            ☕
          </div>
          <h1 className="text-2xl font-bold text-[#6b4226] tracking-tight">
            바이브 카페
          </h1>
          <p className="text-xs text-[#8c6b54] mt-1 font-medium">
            당신의 하루에 바이브를 더하다
          </p>
        </div>

        {/* 에러 안내 메시지 */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-[#fdf2f2] border border-[#f8b4b4] text-[#9b1c1c] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 주문 확인 메시지: 연두색 배경(#eaf7ee), 초록 글씨(#1c6434), 둥근 모서리 */}
        {orderConfirmation && (
          <div className="mb-6 p-4 rounded-xl bg-[#eaf7ee] border border-[#b8e2c4] text-[#1c6434] text-xs sm:text-sm font-semibold leading-relaxed flex items-start gap-2.5 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#2b8a3e] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1e5e2e]">주문 접수 확인</p>
              <p className="mt-1">{orderConfirmation}</p>
            </div>
          </div>
        )}

        {/* 주문서 폼 */}
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
              placeholder="예: 홍길동"
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
              2. 전화번호
            </label>
            <input
              id={`${idPrefix}-phone`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d]"
            />
          </div>

          {/* 3. 음료 선택 (드롭다운) */}
          <div>
            <label
              htmlFor={`${idPrefix}-beverage`}
              className="block text-xs font-semibold text-[#54331d] mb-1.5"
            >
              3. 음료 선택 <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              id={`${idPrefix}-beverage`}
              value={beverageId}
              onChange={(e) => setBeverageId(e.target.value)}
              className="input-cafe text-sm text-[#3e2718] bg-white cursor-pointer"
            >
              <option value="">음료를 선택해주세요</option>
              {BEVERAGES.map((bev) => (
                <option key={bev.id} value={bev.id}>
                  {bev.name} {bev.price.toLocaleString()}원
                </option>
              ))}
            </select>
          </div>

          {/* 4. 사이즈 (라디오 버튼, 가로 배치) */}
          <div>
            <label className="block text-xs font-semibold text-[#54331d] mb-1.5">
              4. 사이즈 선택 (가로 배치)
            </label>
            <div className="flex items-center gap-5 py-1">
              {[
                { label: 'S +0원', value: 'S' },
                { label: 'M +500원', value: 'M' },
                { label: 'L +1,000원', value: 'L' },
              ].map((sz) => (
                <label
                  key={sz.value}
                  htmlFor={`${idPrefix}-size-${sz.value}`}
                  className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer hover:text-[#6b4226]"
                >
                  <input
                    id={`${idPrefix}-size-${sz.value}`}
                    type="radio"
                    name={`${idPrefix}-size`}
                    value={sz.value}
                    checked={size === sz.value}
                    onChange={() => setSize(sz.value as 'S' | 'M' | 'L')}
                    className="accent-[#6b4226] w-4 h-4 cursor-pointer"
                  />
                  <span>{sz.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. 추가 옵션 (체크박스, 가로 배치) */}
          <div>
            <label className="block text-xs font-semibold text-[#54331d] mb-1.5">
              5. 추가 옵션 (가로 배치)
            </label>
            <div className="flex flex-wrap items-center gap-4 py-1">
              <label
                htmlFor={`${idPrefix}-opt-shot`}
                className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer"
              >
                <input
                  id={`${idPrefix}-opt-shot`}
                  type="checkbox"
                  checked={optionShot}
                  onChange={(e) => setOptionShot(e.target.checked)}
                  className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
                />
                <span>샷 추가 +500원</span>
              </label>

              <label
                htmlFor={`${idPrefix}-opt-cream`}
                className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer"
              >
                <input
                  id={`${idPrefix}-opt-cream`}
                  type="checkbox"
                  checked={optionCream}
                  onChange={(e) => setOptionCream(e.target.checked)}
                  className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
                />
                <span>크림 추가 +500원</span>
              </label>

              <label
                htmlFor={`${idPrefix}-opt-syrup`}
                className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer"
              >
                <input
                  id={`${idPrefix}-opt-syrup`}
                  type="checkbox"
                  checked={optionSyrup}
                  onChange={(e) => setOptionSyrup(e.target.checked)}
                  className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
                />
                <span>시럽 추가 +300원</span>
              </label>

              <label
                htmlFor={`${idPrefix}-opt-decaf`}
                className="flex items-center gap-1.5 text-xs text-[#52311b] cursor-pointer"
              >
                <input
                  id={`${idPrefix}-opt-decaf`}
                  type="checkbox"
                  checked={optionDecaf}
                  onChange={(e) => setOptionDecaf(e.target.checked)}
                  className="accent-[#6b4226] w-4 h-4 rounded cursor-pointer"
                />
                <span>디카페인 +0원</span>
              </label>
            </div>
          </div>

          {/* 6. 수량 (number 타입, 최소 1, 최대 10, 기본값 1) */}
          <div>
            <label
              htmlFor={`${idPrefix}-qty`}
              className="block text-xs font-semibold text-[#54331d] mb-1.5"
            >
              6. 수량 (최소 1, 최대 10)
            </label>
            <input
              id={`${idPrefix}-qty`}
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(10, Math.max(1, val)));
              }}
              className="input-cafe text-sm text-[#3e2718] font-mono tabular-nums w-32"
            />
          </div>

          {/* 7. 요청사항 (textarea) */}
          <div>
            <label
              htmlFor={`${idPrefix}-requests`}
              className="block text-xs font-semibold text-[#54331d] mb-1.5"
            >
              7. 요청사항
            </label>
            <textarea
              id={`${idPrefix}-requests`}
              rows={3}
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              placeholder="예: 얼음 적게 넣어주세요, 일회용 컵 대신 다회용 컵 부탁드려요."
              className="input-cafe text-sm text-[#3e2718] placeholder:text-[#b49e8d] resize-none"
            />
          </div>

          {/* 실시간 예상 금액 표시 영역: 큰 글씨(24px), 갈색(#6b4226), 굵게, 가운데 정렬 */}
          <div className="py-4 my-2 text-center border-y border-[#ebdcd0] bg-[#faf6f0]/70 rounded-xl">
            <div className="text-[24px] font-extrabold text-[#6b4226] tracking-tight tabular-nums">
              예상 금액: {totalPrice.toLocaleString()}원
            </div>
            <p className="text-[11px] text-[#8c6b54] mt-0.5">
              (음료 {beveragePrice.toLocaleString()}원 + 사이즈 {sizePrice.toLocaleString()}원 + 옵션 {optionsPrice.toLocaleString()}원) × {quantity}잔
            </p>
          </div>

          {/* 8. 주문하기 버튼 & 9. 다시 작성 버튼 */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="col-span-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-lg border border-[#cbb3a1] bg-[#fbf8f5] text-[#6b4226] hover:bg-[#ede1d5] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 작성</span>
            </button>

            <button
              type="submit"
              className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#6b4226] hover:bg-[#7e4f30] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
            >
              <Coffee className="w-4 h-4" />
              <span>주문하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
