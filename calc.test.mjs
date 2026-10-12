// node calc.test.mjs — 실패하면 에러로 멈춤
import assert from 'node:assert/strict';
import { calc } from './calc.js';

const w = 10320;
// 20시간: 주휴 4시간, 월 세전은 Claude 결과(1,076,229)와 같아야 함
let r = calc({ wage: w, hours: 20 });
assert.equal(r.holiday, 41280);
assert.equal(r.gross, 1076229);
// 14시간: 주휴 0, 1시간 모자람
r = calc({ wage: w, hours: 14 });
assert.equal(r.holiday, 0);
assert.equal(r.shortBy, 1);
// 15시간 경계: 주휴 3시간
assert.equal(calc({ wage: w, hours: 15 }).holiday, 30960);
// 50시간: 주휴는 8시간 상한, 연장가산은 5인 이상일 때만
r = calc({ wage: w, hours: 50 });
assert.equal(r.holiday, 82560);
assert.equal(r.extra, 0);
assert.equal(calc({ wage: w, hours: 50, overtime: true }).extra, 51600);
assert.ok(calc({ wage: w, hours: 53 }).overLegal);
// 공제
r = calc({ wage: w, hours: 20, deduct: 'freelance' });
assert.equal(r.net, r.gross - Math.round(r.gross * 0.033));
// 빈 입력
assert.equal(calc({ wage: '', hours: '' }).net, 0);
console.log('calc ok');
