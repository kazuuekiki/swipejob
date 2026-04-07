const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.resolve('C:/GitProject/スクレイパー製作/collected.csv');
const text = fs.readFileSync(csvPath, 'utf-8');
const records = parse(text, { columns: true, bom: true, relax_column_count: true });

// Random logo colors
const COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4",
  "#8b5cf6", "#f97316", "#64748b", "#059669", "#dc2626",
  "#1e3a5f", "#2d6a4f", "#0077b6", "#4361ee", "#e76f51",
  "#5a189a", "#023e8a", "#ff6b6b", "#495057", "#f4a261",
  "#343a40", "#7209b7", "#0096c7", "#d00000", "#3a0ca3",
  "#e63946", "#9b5de5", "#2a9d8f", "#560bad", "#e85d04",
];

// Culture tags based on industry keywords
function guessCulture(r) {
  const tags = [];
  const desc = (r.business_description || '') + (r.remarks || '') + (r.job_description || '');
  const empType = r.employment_type || '';
  const holidays = parseInt(r.annual_holidays) || parseInt(r.holidays) || 0;

  if (holidays >= 120) tags.push('ワークライフバランス');
  if (/安定|創業|歴史/.test(desc)) tags.push('安定志向');
  if (/成長|スキルアップ|研修|教育/.test(desc)) tags.push('成長志向');
  if (/チーム|仲間|協力/.test(desc)) tags.push('チームワーク');
  if (/技術|エンジニア|開発/.test(desc)) tags.push('技術重視');
  if (/未経験|経験不問/.test(desc)) tags.push('未経験歓迎');
  if (/リモート|在宅/.test(desc)) tags.push('自由な働き方');
  if (/社会|地域|貢献/.test(desc)) tags.push('社会貢献');
  if (/アットホーム|家族|温かい/.test(desc)) tags.push('アットホーム');

  if (tags.length === 0) tags.push('安定志向');
  return tags.slice(0, 3).join(',');
}

// Extract city from location
function extractCity(loc) {
  if (!loc) return '';
  // Match prefecture + city
  const m = loc.match(/(東京都|北海道|(?:京都|大阪)府|.+?県)(.+?[市区町村郡])/);
  if (m) return m[1] + m[2];
  const m2 = loc.match(/(東京都|北海道|(?:京都|大阪)府|.+?県)/);
  if (m2) return m2[1];
  return '';
}

// Format salary
function formatSalary(min, max) {
  const smin = parseInt(min);
  const smax = parseInt(max);
  if (!smin && !smax) return '';
  if (smin && smax) {
    return `月給${(smin/10000).toFixed(1)}万円〜${(smax/10000).toFixed(1)}万円`;
  }
  if (smin) return `月給${(smin/10000).toFixed(1)}万円〜`;
  return `月給〜${(smax/10000).toFixed(1)}万円`;
}

// Extract employee count
function extractEmployees(emp) {
  if (!emp) return '';
  const m = emp.match(/(\d[\d,]*)\s*人/);
  if (m) return m[1].replace(/,/g, '') + '名';
  return '';
}

// Extract catchphrase from job title or description
function extractCatchphrase(r) {
  // Use job title, clean it up
  let title = (r.job_title || '').replace(/職種解説\s*\n?/, '').trim();
  // Remove quotes
  title = title.replace(/[「」]/g, '');
  if (title.length > 40) title = title.substring(0, 40) + '...';
  return title || r.company_name;
}

// Deduplicate by company name (keep first occurrence)
const seen = new Set();
const unique = [];
for (const r of records) {
  const name = (r.company_name || '').trim();
  if (!name || seen.has(name)) continue;
  seen.add(name);
  unique.push(r);
}

console.log(`Unique companies: ${unique.length}`);

const companies = unique.map((r, i) => {
  const name = (r.company_name || '').trim().replace(/\s+/g, ' ');
  return {
    companyName: name,
    email: `hr${i+1}@company.example.jp`,
    profile: {
      catchphrase: extractCatchphrase(r),
      description: (r.business_description || '').replace(/\n/g, '').trim().substring(0, 200),
      industry: (r.industry || '').trim(),
      location: extractCity(r.location),
      employeeCount: extractEmployees(r.employees),
      salary: formatSalary(r.salary_min, r.salary_max),
      foundedYear: '',
      workStyle: (r.employment_type || '').trim(),
      culture: guessCulture(r),
      logoColor: COLORS[i % COLORS.length],
    },
  };
});

// Output as JSON for seed
fs.writeFileSync(
  path.resolve(__dirname, '../prisma/companies-data.json'),
  JSON.stringify(companies, null, 2),
  'utf-8'
);
console.log(`Wrote ${companies.length} companies to prisma/companies-data.json`);
