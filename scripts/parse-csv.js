const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.resolve('C:/GitProject/スクレイパー製作/collected.csv');
const text = fs.readFileSync(csvPath, 'utf-8');
const records = parse(text, { columns: true, bom: true, relax_column_count: true });

console.log('Total records:', records.length);

for (let i = 0; i < Math.min(5, records.length); i++) {
  const r = records[i];
  console.log('---');
  console.log('company:', r.company_name);
  console.log('job_title:', (r.job_title || '').substring(0, 80));
  console.log('industry:', r.industry);
  console.log('location:', (r.location || '').substring(0, 50));
  console.log('salary_min:', r.salary_min, 'salary_max:', r.salary_max);
  console.log('employment_type:', r.employment_type);
  console.log('employees:', (r.employees || '').substring(0, 30));
  console.log('business_desc:', (r.business_description || '').substring(0, 80));
}
