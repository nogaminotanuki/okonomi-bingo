const assert=require('node:assert/strict');
const C=require('../core.js');
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
test('空カード',()=>assert.equal(C.lines(C.create()).length,0));
test('横・縦',()=>{let s=C.create();s.cells[0].forEach(c=>c.checked=true);assert.equal(C.lines(s).length,1);for(let r=1;r<5;r++)s.cells[r][0].checked=true;assert.equal(C.lines(s).length,2);});
test('左右の斜め',()=>{let s=C.create();for(let i=0;i<5;i++)s.cells[i][i].checked=true;assert.equal(C.lines(s).length,1);for(let i=0;i<5;i++)s.cells[i][4-i].checked=true;assert.equal(C.lines(s).length,2);});
test('長方形の判定',()=>{let s=C.create();s.rows=3;s.cols=4;for(let i=0;i<3;i++)s.cells[i][i].checked=true;assert.equal(C.lines(s).length,0);for(let c=0;c<4;c++)s.cells[0][c].checked=true;assert.equal(C.lines(s).length,1);});
test('全サイズの全列数',()=>{for(let rows=3;rows<=7;rows++)for(let cols=3;cols<=7;cols++){let s=C.create();s.rows=rows;s.cols=cols;s.cells.flat().forEach(c=>c.checked=true);assert.equal(C.lines(s).length,rows+cols+(rows===cols?2:0));}});
test('FREE・解除',()=>{let s=C.create();s.free=true;for(let c=0;c<5;c++)if(c!==2)s.cells[2][c].checked=true;assert.equal(C.lines(s).length,1);s.cells.flat().forEach(c=>c.checked=false);assert.equal(C.checked(s,2,2),true);assert.equal(C.lines(s).length,0);s.free=false;assert.equal(C.checked(s,2,2),false);});
test('復元と日本語・改行・隠れた内容',()=>{let s=C.create();s.cells[6][6]={text:'日本語\n長文',checked:true};s.rows=3;s.cols=3;let restored=C.restore(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);});
test('壊れた保存データ',()=>{assert.throws(()=>C.restore({version:1,rows:999,cols:3}));assert.throws(()=>C.restore({version:2}));});
console.log(count+' tests passed');
