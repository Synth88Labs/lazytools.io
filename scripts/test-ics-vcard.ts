import { buildIcs, escapeIcsText, foldLine } from '../src/lib/ics.ts';
import { parseVcards, vcardsToCsv, csvToVcards } from '../src/lib/vcard.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---------- ICS ----------
ok('ics escape ; , \\ newline', escapeIcsText('a;b,c\\d\ne') === 'a\\;b\\,c\\\\d\\ne');
const longLine = 'SUMMARY:' + 'x'.repeat(120);
const folded = foldLine(longLine);
ok('fold long line adds CRLF+space', folded.includes('\r\n ') && folded.split('\r\n').every((l) => l.length <= 76));

const ics = buildIcs({
  title: 'Team; Sync, v2', start: '2024-06-01T09:30', end: '2024-06-01T10:30',
  location: 'Room 4', description: 'Line1\nLine2', recurrence: 'weekly', count: 5,
  uid: 'abc', dtstamp: '20240101T000000Z',
});
ok('ics has VCALENDAR/VEVENT', ics.includes('BEGIN:VCALENDAR') && ics.includes('BEGIN:VEVENT') && ics.includes('END:VCALENDAR'));
ok('ics DTSTART formatted', ics.includes('DTSTART:20240601T093000'));
ok('ics DTEND formatted', ics.includes('DTEND:20240601T103000'));
ok('ics SUMMARY escaped', ics.includes('SUMMARY:Team\\; Sync\\, v2'));
ok('ics DESCRIPTION newline escaped', ics.includes('DESCRIPTION:Line1\\nLine2'));
ok('ics RRULE weekly count', ics.includes('RRULE:FREQ=WEEKLY;COUNT=5'));
ok('ics uses CRLF', ics.includes('\r\n'));
ok('ics UID/DTSTAMP', ics.includes('UID:abc') && ics.includes('DTSTAMP:20240101T000000Z'));

// all-day: DTEND is exclusive (next day)
const allday = buildIcs({ title: 'Holiday', start: '2024-12-25', allDay: true, uid: 'h', dtstamp: '20240101T000000Z' });
ok('ics all-day DATE start', allday.includes('DTSTART;VALUE=DATE:20241225'));
ok('ics all-day DTEND exclusive (+1 day)', allday.includes('DTEND;VALUE=DATE:20241226'));
let icsThrew = false; try { buildIcs({ title: '', start: '' }); } catch { icsThrew = true; }
ok('ics rejects empty', icsThrew);

// ---------- vCard ----------
const VCF = `BEGIN:VCARD
VERSION:3.0
FN:Ada Lovelace
N:Lovelace;Ada;;;
EMAIL;TYPE=INTERNET:ada@example.com
TEL;TYPE=CELL:+1-555-0100
ORG:Analytical Engines;R&D
TITLE:Mathematician
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Bo O'Brien
N:O'Brien;Bo;;;
EMAIL:bo@example.org
END:VCARD`;

const contacts = parseVcards(VCF);
ok('vcf parsed 2 contacts', contacts.length === 2);
ok('vcf full name', contacts[0].fullName === 'Ada Lovelace');
ok('vcf N first/last', contacts[0].firstName === 'Ada' && contacts[0].lastName === 'Lovelace');
ok('vcf email', contacts[0].email === 'ada@example.com');
ok('vcf phone', contacts[0].phone === '+1-555-0100');
ok('vcf org (first component)', contacts[0].organization === 'Analytical Engines');
ok('vcf title', contacts[0].title === 'Mathematician');

const csv = vcardsToCsv(VCF);
ok('vcf→csv header', csv.output.startsWith('Full Name,First Name,Last Name,Email,Phone,Organization,Title'));
ok('vcf→csv 2 rows + header', csv.output.split('\n').length === 3 && csv.count === 2);
ok('vcf→csv row content', csv.output.includes('Ada Lovelace,Ada,Lovelace,ada@example.com'));

// folded-line unfolding
const foldedVcf = 'BEGIN:VCARD\r\nFN:Very Long Name That \r\n Continues Here\r\nEND:VCARD';
ok('vcf unfolds continuation', parseVcards(foldedVcf)[0].fullName === 'Very Long Name That Continues Here');

// CSV → vCard
const back = csvToVcards('First Name,Last Name,Email,Company\nAda,Lovelace,ada@example.com,Engines\nBo,,bo@x.org,');
ok('csv→vcf 2 cards', back.count === 2);
ok('csv→vcf has BEGIN/END', (back.output.match(/BEGIN:VCARD/g) || []).length === 2);
ok('csv→vcf FN built from first+last', back.output.includes('FN:Ada Lovelace'));
ok('csv→vcf N structured', back.output.includes('N:Lovelace;Ada;;;'));
ok('csv→vcf email typed', back.output.includes('EMAIL;TYPE=INTERNET:ada@example.com'));
ok('csv→vcf ORG', back.output.includes('ORG:Engines'));

// round trip vcf→csv→vcf preserves count
ok('roundtrip count', csvToVcards(vcardsToCsv(VCF).output).count === 2);
let vThrew = false; try { vcardsToCsv('not a vcard'); } catch { vThrew = true; }
ok('vcf→csv rejects non-vcard', vThrew);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
