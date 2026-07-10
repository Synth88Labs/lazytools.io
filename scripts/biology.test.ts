import { reverseComplement, translate, gcContent, meltingTemp, solveDilution, serialDilution, doublingTime, hardyWeinberg, punnett, ssMolecularWeight, ngToPmol, cleanSeq, transcribe } from '../src/lib/biology.ts';
import { chiSqCdf } from '../src/lib/stats.ts';
let pass=0, fail=0;
const approx=(a,b,e=1e-2)=>Math.abs(a-b)<=e;
function ok(name,cond){ if(cond){pass++;} else {fail++; console.log('FAIL:',name);} }

ok('cleanSeq strips FASTA', cleanSeq('>hdr\nATG\nCC')==='ATGCC');
ok('revcomp ATGC=GCAT', reverseComplement('ATGC')==='GCAT');
ok('revcomp RNA', reverseComplement('ATGC',true)==='GCAU');
ok('transcribe', transcribe('ATGC')==='AUGC');
const tr=translate('ATGTTTTAA'); ok('translate MF*', tr.protein==='MF*'&&tr.stops===1);
ok('gc 100%', approx(gcContent('GGCC').gcPct,100));
ok('gc 50%', approx(gcContent('ATGC').gcPct,50));
ok('Tm wallace short', meltingTemp('ATGC').tm===12);
ok('Tm long method', meltingTemp('ATGCATGCATGCATGCATGC').method.includes('Salt'));
ok('dilution solve V1', solveDilution(10,null,1,100)===10);
ok('dilution solve C2', solveDilution(10,5,null,100)===0.5);
const sd=serialDilution(100,10,3,1); ok('serial cumulative', sd[2].cumulativeFold===1000 && approx(sd[0].conc,10));
const dt=doublingTime(1,4,2); ok('doubling generations=2', approx(dt.generations,2)); ok('doubling td=1', approx(dt.td,1));
const hw=hardyWeinberg(298,489,213,chiSqCdf); ok('HW p freq', approx(hw.p,0.5425,1e-3)); ok('HW pValue in [0,1]', hw.pValue>=0&&hw.pValue<=1);
const pn=punnett('Aa','Aa'); ok('punnett Aa x Aa geno 1:2:1', pn.genoTally['AA']===1&&pn.genoTally['Aa']===2&&pn.genoTally['aa']===1);
ok('punnett pheno 3:1', pn.phenoTally['A']===3&&pn.phenoTally['aa']===1);
const dh=punnett('AaBb','AaBb'); ok('dihybrid 16 cells', dh.total===16);
ok('dihybrid 9:3:3:1', dh.phenoTally['AB']===9);
ok('ssMW positive', ssMolecularWeight('ATGCATGC')>2000);
ok('ngToPmol', approx(ngToPmol(660,6600),100));
console.log(`\nbiology.test: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
