

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const C = {
//   primary:  [26,  115, 232],
//   accent:   [124, 77,  255],
//   dark:     [15,  23,  42],
//   mid:      [71,  85,  105],
//   light:    [241, 245, 249],
//   white:    [255, 255, 255],
//   green:    [16,  185, 129],
//   red:      [239, 68,  68],
//   orange:   [245, 158, 11],
//   blue:     [0,   120, 212],
//   teal:     [0,   184, 163],
//   purple:   [124, 77,  255],
//   tblAlt:   [248, 250, 255],
// };

// function feedbackLabel(pct) {
//   if (pct === null || pct === undefined) return '—';
//   if (pct >= 95) return 'Exceptional Engagement - Fully Committed!';
//   if (pct >= 80) return 'Well Prepared';
//   if (pct >= 65) return 'Needs Effort';
//   if (pct >= 50) return 'Needs More Effort';
//   return 'Needs Improvement';
// }

// function overallStatus(pct) {
//   if (pct >= 80) return 'Excellent';
//   if (pct >= 65) return 'Good';
//   if (pct >= 50) return 'Average';
//   return 'Needs Improvement';
// }

// function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
//   const W = doc.internal.pageSize.getWidth();
//   doc.setFillColor(...C.primary);
//   doc.rect(0, 0, W, 18, 'F');
//   doc.setFillColor(...C.accent);
//   doc.rect(W - 62, 0, 62, 18, 'F');
//   if (collegeLogoDataUrl) {
//     try { doc.addImage(collegeLogoDataUrl, 'PNG', 5, 2, 14, 14); } catch {}
//   }
//   doc.setTextColor(...C.white);
//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.text('MINDSPARK LEARNING HUB', W - 59, 8.5, { align: 'left' });
//   doc.setFontSize(6.5);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Powered by Mind Spark', W - 59, 13.5, { align: 'left' });
//   doc.setTextColor(...C.dark);
// }

// function drawPageFooter(doc, pageNum, totalPages) {
//   const W = doc.internal.pageSize.getWidth();
//   const H = doc.internal.pageSize.getHeight();
//   doc.setDrawColor(220, 220, 230);
//   doc.setLineWidth(0.3);
//   doc.line(10, H - 12, W - 10, H - 12);
//   doc.setFontSize(7.5);
//   doc.setTextColor(...C.mid);
//   doc.setFont('helvetica', 'normal');
//   doc.text('MINDSPARK LEARNING HUB', 10, H - 6);
//   doc.text(`${pageNum}`, W / 2, H - 6, { align: 'center' });
//   doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 6, { align: 'right' });
// }

// function drawStatBoxes(doc, stats, y) {
//   const W = doc.internal.pageSize.getWidth();
//   const bw = 32, bh = 22, bGap = 3;
//   const totalW = stats.length * bw + (stats.length - 1) * bGap;
//   let bx = (W - totalW) / 2;
//   stats.forEach(({ label, value, color }) => {
//     doc.setFillColor(...C.light);
//     doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
//     doc.setFillColor(...(color || C.primary));
//     doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...(color || C.primary));
//     doc.text(String(value), bx + bw / 2, y + bh / 2 - 0.5, { align: 'center' });
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6.5, { align: 'center' });
//     bx += bw + bGap;
//   });
//   doc.setTextColor(...C.dark);
//   return y + bh + 4;
// }

// function drawBarChart(doc, x, y, w, h, data, title, barColor = C.blue) {
//   const maxVal = Math.max(...data.map(d => d.value), 1);
//   if (title) {
//     doc.setFontSize(8.5);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text(title, x, y - 3);
//   }
//   doc.setFillColor(250, 252, 255);
//   doc.setDrawColor(220, 225, 235);
//   doc.setLineWidth(0.3);
//   doc.rect(x, y, w, h, 'FD');
//   const n = data.length;
//   const barW = (w * 0.6) / n;
//   const gap  = (w * 0.4) / (n + 1);
//   const axisH = h - 16;
//   const yBase = y + h - 8;
//   doc.setDrawColor(210, 215, 225);
//   doc.setLineWidth(0.2);
//   [0.25, 0.5, 0.75].forEach(pct => {
//     const gy = yBase - axisH * pct;
//     doc.line(x, gy, x + w, gy);
//     doc.setFontSize(5);
//     doc.setTextColor(180, 180, 195);
//     doc.text(String(Math.round(maxVal * pct)), x - 1, gy + 1, { align: 'right' });
//   });
//   data.forEach((d, i) => {
//     const bx = x + gap + i * (barW + gap);
//     const bh2 = maxVal > 0 ? (d.value / maxVal) * (axisH - 4) : 0;
//     const by  = yBase - bh2;
//     doc.setFillColor(...(d.color || barColor));
//     if (bh2 > 0) doc.rect(bx, by, barW, bh2, 'F');
//     if (d.value > 0) {
//       doc.setFontSize(5.5);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...C.dark);
//       doc.text(String(d.value), bx + barW / 2, by - 1, { align: 'center' });
//     }
//     doc.setFontSize(5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     const lbl = d.label || '';
//     const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
//     lblLines.forEach((l, li) => doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' }));
//   });
//   doc.setTextColor(...C.dark);
//   return y + h + 8;
// }

// function drawPieChart(doc, cx, cy, r, data, title) {
//   doc.setFontSize(8.5);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   if (title) doc.text(title, cx - r, cy - r - 4);
//   const total = data.reduce((a, d) => a + d.value, 0);
//   if (total === 0) return;
//   let startAngle = -Math.PI / 2;
//   data.forEach(d => {
//     const sweep = (d.value / total) * 2 * Math.PI;
//     const steps = Math.max(8, Math.round(sweep * 20));
//     const pts   = [[cx, cy]];
//     for (let s = 0; s <= steps; s++) {
//       const a = startAngle + (s / steps) * sweep;
//       pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
//     }
//     doc.setFillColor(...d.color);
//     doc.lines(
//       pts.slice(1).map((p, i) => [p[0] - (i === 0 ? cx : pts[i][0]), p[1] - (i === 0 ? cy : pts[i][1])]),
//       cx, cy, [1, 1], 'F', true,
//     );
//     const midAngle = startAngle + sweep / 2;
//     const lx = cx + Math.cos(midAngle) * r * 0.65;
//     const ly = cy + Math.sin(midAngle) * r * 0.65;
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.white);
//     doc.text(`${((d.value / total) * 100).toFixed(1)}%`, lx, ly, { align: 'center' });
//     startAngle += sweep;
//   });
//   let lx = cx + r + 6, ly = cy - r / 2;
//   data.forEach((d, i) => {
//     doc.setFillColor(...d.color);
//     doc.rect(lx, ly + i * 9 - 2, 6, 5, 'F');
//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.dark);
//     doc.text(`${d.label} (${((d.value / total) * 100).toFixed(1)}%)`, lx + 8, ly + i * 9 + 2);
//   });
//   doc.setTextColor(...C.dark);
// }

// const RANGES = [
//   { label: '90-100%', min: 90, max: 101 },
//   { label: '80-90%',  min: 80, max: 90  },
//   { label: '70-80%',  min: 70, max: 80  },
//   { label: '60-70%',  min: 60, max: 70  },
//   { label: '50-60%',  min: 50, max: 60  },
//   { label: '40-50%',  min: 40, max: 50  },
//   { label: '30-40%',  min: 30, max: 40  },
//   { label: '20-30%',  min: 20, max: 30  },
//   { label: '10-20%',  min: 10, max: 20  },
//   { label: '0-10%',   min: 0,  max: 10  },
// ];

// function scoreDistribution(submissions, maxPossible) {
//   return RANGES.map(r => ({
//     label: r.label,
//     value: submissions.filter(s => {
//       const pct = ((s.totalScore ?? 0) / maxPossible) * 100;
//       return pct >= r.min && pct < r.max;
//     }).length,
//   }));
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // OVERALL REPORT
// // ─────────────────────────────────────────────────────────────────────────────
// export function generateOverallReport({
//   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// }) {
//   const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W   = doc.internal.pageSize.getWidth();

//   const total       = submissions.length;
//   const completed   = submissions.filter(s => s.status === 'completed').length;
//   const scores      = submissions.map(s => s.totalScore ?? 0);
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const maxScore    = total > 0 ? Math.max(...scores) : 0;
//   const minScore    = total > 0 ? Math.min(...scores.filter(s => s > 0)) : 0;
//   const avgScore    = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
//   const qualified   = submissions.filter(s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40).length;
//   const highestPct  = maxPossible > 0 ? `${((maxScore / maxPossible) * 100).toFixed(3)}%` : '0.000%';

//   const deptMap = {};
//   submissions.forEach(s => {
//     const dept = s.department || s.branch || 'Unknown';
//     if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
//     deptMap[dept].attempted++;
//     deptMap[dept].scores.push(s.totalScore ?? 0);
//   });
//   const deptRegistered = exam?.deptRegistered || {};
//   const deptKeys = Object.keys(deptMap);

//   // PAGE 1
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//   doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('MINDSPARK LEARNING HUB-ENTIRE REPORT', W / 2, 27, { align: 'center' });
//   doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//   const dayLabel = exam?.dayNumber ? `Consolidated Report on Day ${exam.dayNumber}` : 'Consolidated Report';
//   doc.text(dayLabel, W / 2, 33, { align: 'center' });
//   doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text(examTitle || 'Grand Test', W / 2, 40, { align: 'center' });

//   let cy = drawStatBoxes(doc, [
//     { label: 'Total Attempts',    value: total,             color: C.primary },
//     { label: 'Completed',         value: completed,         color: C.green   },
//     { label: 'Qualified',         value: qualified,         color: C.accent  },
//     { label: 'Not Qualified',     value: total - qualified, color: C.red     },
//     { label: 'Qualified Highest', value: highestPct,        color: C.teal    },
//   ], 46);
//   cy += 4;

//   // Attendance dept table
//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Attendance', 14, cy + 4); cy += 8;

//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['DEPT', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
//       body: deptKeys.map(dept => {
//         const attempted = deptMap[dept].attempted;
//         const registered = deptRegistered[dept] || attempted;
//         return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
//       }),
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // Dept performance
//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['DEPT', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: deptKeys.map(dept => {
//         const s = deptMap[dept].scores;
//         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
//       }),
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // PAGE 2: Assessment info + section breakdown
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

//   const sectionBreakdown = {};
//   questions.forEach(q => {
//     const key = q.sectionName || q.section || q.category || (q.type === 'MCQ' ? 'MCQ' : 'Coding');
//     if (!sectionBreakdown[key]) sectionBreakdown[key] = { count: 0, marks: 0, questions: [] };
//     sectionBreakdown[key].count++;
//     sectionBreakdown[key].marks += q.marks || 0;
//     sectionBreakdown[key].questions.push(q);
//   });

//   const notAttemptedTotal = (exam?.registeredStudents?.length || 0) - total;

//   autoTable(doc, {
//     startY: cy,
//     head: [['NAME', 'VALUE']],
//     body: [
//       ['Assessment Name',    examTitle || '—'],
//       ['Questions Count',    String(questions.length)],
//       ['Students Attempted', String(total)],
//       ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
//       ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
//       ['Highest Percentage', highestPct],
//       ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
//     ],
//     styles: { fontSize: 8.5, cellPadding: 3 },
//     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55 } },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   if (Object.keys(sectionBreakdown).length) {
//     const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
//     secBody.push(['Total', String(questions.length), String(maxPossible)]);
//     autoTable(doc, {
//       startY: cy,
//       head: [['SECTION', 'QUESTIONS COUNT', 'MARKS']],
//       body: secBody,
//       styles: { fontSize: 8.5, cellPadding: 3, halign: 'center' },
//       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       didParseCell: data => { if (data.section === 'body' && data.row.index === secBody.length - 1) data.cell.styles.fontStyle = 'bold'; },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // PAGE 3: Charts
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

//   if (deptKeys.length) {
//     drawPieChart(doc, 38, cy + 28, 22, [
//       { label: 'Attempted',     value: total,                           color: C.green },
//       { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal),  color: [220, 220, 230] },
//     ], 'Attendance');
//     cy += 68;
//   }

//   const overallDist = scoreDistribution(submissions, maxPossible).reverse();
//   cy = drawBarChart(doc, 14, cy, W - 28, 50, overallDist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//     'Overall Performance Student Distribution', C.blue);

//   Object.entries(sectionBreakdown).forEach(([secName, secData]) => {
//     const secMax = secData.marks || 1;
//     const secScores = submissions.map(s => {
//       const brk = s.scoreBreakdown || [];
//       const secScore = brk
//         .filter(b => secData.questions.find(q => q.id === b.questionId))
//         .reduce((a, b2) => a + (b2.score || 0), 0);
//       return { totalScore: secScore };
//     });
//     const dist = scoreDistribution(secScores, secMax).reverse();
//     if (cy > 210) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }
//     cy = drawBarChart(doc, 14, cy, W - 28, 48, dist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//       `${secName} Performance Student Distribution`, C.blue);
//   });

//   // PAGE 4: Top/Bottom/Full table
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;
//   const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
//   const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Top Students', 14, cy); cy += 3;
//   autoTable(doc, {
//     startY: cy,
//     head: [['EMAIL', 'REGD', 'PERCENTAGE']],
//     body: sorted.slice(0, 10).map(s => [
//       s.studentEmail || s.studentId || '—',
//       s.studentRegNo || '—',
//       maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%` : '0.00%',
//     ]),
//     styles: { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles: { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 2: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles: { fillColor: C.tblAlt },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Bottom Students', 14, cy); cy += 3;
//   autoTable(doc, {
//     startY: cy,
//     head: [['EMAIL', 'REGD', 'PERCENTAGE']],
//     body: bottom.slice(0, 9).map(s => [
//       s.studentEmail || s.studentId || '—',
//       s.studentRegNo || '—',
//       maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%` : '0.00%',
//     ]),
//     styles: { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles: { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 2: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles: { fillColor: C.tblAlt },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   if (cy > 200) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }
//   autoTable(doc, {
//     startY: cy,
//     head: [['#', 'Name', 'Reg No / Email', 'MCQ', 'Coding', 'Total', '%', 'Status', 'Violations']],
//     body: sorted.map((s, i) => [
//       `${i + 1}`, s.studentName || '—', s.studentRegNo || s.studentEmail || '—',
//       String(s.mcqScore ?? '—'), String(s.codingScore ?? '—'), String(s.totalScore ?? 0),
//       maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%` : '0.0%',
//       s.status || 'completed', String(s.violations ?? 0),
//     ]),
//     styles: { fontSize: 7, cellPadding: 2 },
//     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 7 },
//     columnStyles: { 0:{cellWidth:8}, 3:{halign:'center'}, 4:{halign:'center'}, 5:{halign:'center',fontStyle:'bold'}, 6:{halign:'center'}, 7:{halign:'center'}, 8:{halign:'center'} },
//     margin: { left: 10, right: 10 }, theme: 'striped',
//     didParseCell: data => {
//       if (data.section === 'body' && data.column.index === 5) {
//         const score = parseInt(data.row.raw[5]);
//         const pct   = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
//         if      (pct >= 80) data.cell.styles.textColor = C.green;
//         else if (pct >= 40) data.cell.styles.textColor = C.orange;
//         else                data.cell.styles.textColor = C.red;
//       }
//     },
//   });

//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
//   doc.save(`Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STUDENT-WISE REPORT
// // Only shows REAL data from the exam. No hardcoded/fabricated section scores.
// // If a section doesn't exist in this exam, it shows "—" and "—".
// // ─────────────────────────────────────────────────────────────────────────────
// export function generateStudentWiseReport({
//   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// }) {
//   if (!submissions.length) { alert('No submissions to generate report for.'); return; }

//   const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W           = doc.internal.pageSize.getWidth();
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

//   // Build section map from actual questions — only real sections in THIS exam
//   const sectionMap = {};
//   questions.forEach(q => {
//     const key = q.sectionName || q.section || q.category || (q.type === 'MCQ' ? 'MCQ' : 'Coding');
//     if (!sectionMap[key]) sectionMap[key] = [];
//     sectionMap[key].push(q);
//   });

//   // MCQ and Coding splits from actual questions
//   const mcqQs    = questions.filter(q => q.type === 'MCQ');
//   const codingQs = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
//   const mcqMax    = mcqQs.reduce((a, q) => a + (q.marks || 0), 0);
//   const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

//   // Helper: get real score % for a student in a section, null if section not in exam
//   const getSectionPct = (sub, secName) => {
//     const secQs = sectionMap[secName];
//     if (!secQs || secQs.length === 0) return null; // section doesn't exist
//     const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//     if (secMax === 0) return null;
//     const brk = sub.scoreBreakdown || [];
//     const secScore = brk
//       .filter(b => secQs.find(q => q.id === b.questionId))
//       .reduce((a, b) => a + (b.score || 0), 0);
//     return Math.round((secScore / secMax) * 100);
//   };

//   // Helper: render a rating cell — null means the section doesn't exist → show "—"
//   const ratingStr = (pct) => pct !== null && pct !== undefined ? `${pct}%` : '—';

//   sorted.forEach((sub, idx) => {
//     if (idx > 0) doc.addPage();
//     drawPageHeader(doc, collegeLogoDataUrl, collegeName);

//     const score  = sub.totalScore ?? 0;
//     const pct    = maxPossible > 0 ? ((score / maxPossible) * 100) : 0;
//     const pctStr = `${pct.toFixed(0)}%`;
//     const status = overallStatus(pct);
//     const passed = pct >= 40;

//     // Student info block
//     doc.setFillColor(...C.light);
//     doc.roundedRect(10, 22, W - 20, 36, 3, 3, 'F');
//     doc.setFillColor(...C.primary);
//     doc.roundedRect(10, 22, 4, 36, 2, 2, 'F');

//     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//     doc.text('Student Performance Report', W / 2, 28, { align: 'center' });

//     doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//     [['Student Name:', sub.studentName || '—'], ['Student ID:', sub.studentRegNo || sub.studentId || '—'], ['Overall Status:', status]]
//       .forEach(([lbl, val], i) => {
//         doc.setFont('helvetica', 'bold'); doc.text(lbl, 17, 35 + i * 6);
//         doc.setFont('helvetica', 'normal'); doc.text(val, 50, 35 + i * 6);
//       });
//     [['Batch:', sub.batch || sub.section || exam?.batch || '—'], ['Evaluation Period:', examTitle || '—']]
//       .forEach(([lbl, val], i) => {
//         doc.setFont('helvetica', 'bold'); doc.text(lbl, W / 2 + 5, 35 + i * 6);
//         doc.setFont('helvetica', 'normal'); doc.text(val, W / 2 + 32, 35 + i * 6);
//       });

//     // Overall % badge
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(W - 36, 23, 24, 14, 3, 3, 'F');
//     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
//     doc.text(pctStr, W - 24, 31, { align: 'center' });
//     doc.setFontSize(6); doc.setFont('helvetica', 'normal');
//     doc.text('Overall', W - 24, 35, { align: 'center' });
//     doc.setTextColor(...C.dark);

//     let cy = 63;

//     const sectionHeading = (title, yPos) => {
//       doc.setFillColor(...C.primary);
//       doc.rect(10, yPos, W - 20, 6, 'F');
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
//       doc.text(title, 14, yPos + 4);
//       doc.setTextColor(...C.dark);
//       return yPos + 8;
//     };

//     // Overall Performance section
//     cy = sectionHeading('Overall Performance', cy);
//     doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//     doc.text(`Overall Performance: ${pctStr}`, 14, cy + 4);
//     const pbW = W - 28;
//     doc.setFillColor(220, 225, 235);
//     doc.roundedRect(14, cy + 7, pbW, 4, 2, 2, 'F');
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(14, cy + 7, pbW * Math.min(1, pct / 100), 4, 2, 2, 'F');
//     doc.setTextColor(...C.dark);
//     cy += 16;

//     // ── Participation Metrics ─────────────────────────────────────────────
//     // Only shows what's actually measurable from the submission data.
//     // If a value can't be determined, shows "—".
//     cy = sectionHeading('Participation Metrics:', cy);

//     const totalExamsAssigned  = sub.totalExamsAssigned ?? 1;
//     const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
//     const overallParticipationPct = totalExamsAssigned > 0
//       ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100)
//       : null;

//     // Practice and Weekly counts — only show if the field actually exists on the submission
//     const practiceAttempts = sub.practiceAttempts ?? sub.practiceCount ?? null;
//     const weeklyAttempts   = sub.weeklyAttempts   ?? sub.weeklyCount   ?? null;

//     const participationRows = [
//       ['Overall Assessment',              overallParticipationPct],
//       ['Placement Readiness',             Math.round(pct)],
//       ['Practice Assessments - Weekly',   practiceAttempts !== null
//           ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
//           : null],
//       ['Assessments - Weekly',            weeklyAttempts !== null
//           ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
//           : null],
//     ];

//     autoTable(doc, {
//       startY: cy,
//       head: [['Sno', 'For', 'Rating', 'Feedback']],
//       body: participationRows.map(([label, rPct], i) => [
//         String(i + 1), label, ratingStr(rPct), feedbackLabel(rPct),
//       ]),
//       styles: { fontSize: 8, cellPadding: 2.5 },
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0:{cellWidth:10,halign:'center'}, 1:{cellWidth:65}, 2:{cellWidth:18,halign:'center',fontStyle:'bold'}, 3:{cellWidth:85} },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 10, right: 10 }, theme: 'grid',
//       didParseCell: data => {
//         if (data.section === 'body' && data.column.index === 2) {
//           const raw = data.cell.raw;
//           if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//           const v = parseInt(raw);
//           if      (v >= 80) data.cell.styles.textColor = C.green;
//           else if (v >= 50) data.cell.styles.textColor = C.orange;
//           else              data.cell.styles.textColor = C.red;
//         }
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Performance Metrics ───────────────────────────────────────────────
//     // Uses REAL scoreBreakdown data. If a section doesn't exist → shows "—".
//     cy = sectionHeading('Performance Metrics:', cy);

//     // MCQ score (if MCQ questions exist)
//     const mcqPct    = mcqMax > 0    ? Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100) : null;
//     const codingPct = codingMax > 0 ? Math.round(((sub.codingScore ?? 0) / codingMax) * 100) : null;

//     // Combined tech = (mcq + coding) / total — only if either section exists
//     const techOverallPct = maxPossible > 0 ? Math.round(pct) : null;

//     // Try to get scores from named sections via scoreBreakdown
//     // Only returns a value if that specific section name exists in the exam
//     const findNamedSectionPct = (...names) => {
//       for (const n of names) {
//         const k = Object.keys(sectionMap).find(k => k.toLowerCase().includes(n.toLowerCase()));
//         if (k) return getSectionPct(sub, k);
//       }
//       return null; // section not in this exam
//     };

//     const perfRows = [
//       // Non-Technical = MCQ score (if MCQs exist), else null
//       ['Non-Technical Overall',  mcqPct],
//       // Named sections — only show if they're actually in this exam
//       ['Quantitative Aptitude',  findNamedSectionPct('quantitative', 'quant', 'aptitude')],
//       ['Logical Ability',        findNamedSectionPct('logical', 'logic')],
//       ['Verbal Ability',         findNamedSectionPct('verbal')],
//       ['Essay Writing',          findNamedSectionPct('essay', 'writing', 'english writing')],
//       // Technical = Coding score (if coding exists), else null
//       ['Technical Overall',      techOverallPct],
//       ['Technical MCQs',         findNamedSectionPct('technical', 'tech mcq') ?? mcqPct],
//       ['Programming',            codingPct],
//     ];

//     autoTable(doc, {
//       startY: cy,
//       head: [['Sno', 'For', 'Rating', 'Feedback']],
//       body: perfRows.map(([label, rPct], i) => [
//         String(i + 1), label, ratingStr(rPct), feedbackLabel(rPct),
//       ]),
//       styles: { fontSize: 8, cellPadding: 2.5 },
//       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0:{cellWidth:10,halign:'center'}, 1:{cellWidth:65}, 2:{cellWidth:18,halign:'center',fontStyle:'bold'}, 3:{cellWidth:85} },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 10, right: 10 }, theme: 'grid',
//       didParseCell: data => {
//         if (data.section === 'body' && data.column.index === 2) {
//           const raw = data.cell.raw;
//           if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//           const v = parseInt(raw);
//           if      (v >= 80) data.cell.styles.textColor = C.green;
//           else if (v >= 50) data.cell.styles.textColor = C.orange;
//           else              data.cell.styles.textColor = C.red;
//         }
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Weekly Assessment Metrics ─────────────────────────────────────────
//     // Only shown if data exists on the submission
//     if (cy < 230) {
//       cy = sectionHeading('Weekly Assessment Metrics:', cy);
//       const practiceWeeklyPct = findNamedSectionPct('practice') ??
//         (practiceAttempts !== null ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100)) : null);
//       const weeklyAssessPct   = findNamedSectionPct('weekly') ??
//         (weeklyAttempts !== null ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100)) : null);

//       autoTable(doc, {
//         startY: cy,
//         head: [['Sno', 'For', 'Rating', 'Feedback']],
//         body: [
//           ['1', 'Practice Assessments', ratingStr(practiceWeeklyPct), feedbackLabel(practiceWeeklyPct)],
//           ['2', 'Weekly Assessments',   ratingStr(weeklyAssessPct),   feedbackLabel(weeklyAssessPct)],
//         ],
//         styles: { fontSize: 8, cellPadding: 2.5 },
//         headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//         columnStyles: { 0:{cellWidth:10,halign:'center'}, 1:{cellWidth:65}, 2:{cellWidth:18,halign:'center',fontStyle:'bold'}, 3:{cellWidth:85} },
//         alternateRowStyles: { fillColor: C.tblAlt },
//         margin: { left: 10, right: 10 }, theme: 'grid',
//         didParseCell: data => {
//           if (data.section === 'body' && data.column.index === 2) {
//             const raw = data.cell.raw;
//             if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//             const v = parseInt(raw);
//             if      (v >= 80) data.cell.styles.textColor = C.green;
//             else if (v >= 50) data.cell.styles.textColor = C.orange;
//             else              data.cell.styles.textColor = C.red;
//           }
//         },
//       });
//       cy = doc.lastAutoTable.finalY + 4;
//     }

//     // Proctoring note
//     const viols = sub.violations ?? 0;
//     if (viols > 0 && cy < 270) {
//       doc.setFontSize(7.5); doc.setTextColor(...C.red);
//       doc.text(`⚠  ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`, 10, cy);
//       doc.setTextColor(...C.dark);
//     }
//   });

//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
//   doc.save(`StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// }

















// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const C = {
//   primary:  [26,  115, 232],
//   accent:   [124, 77,  255],
//   dark:     [15,  23,  42],
//   mid:      [71,  85,  105],
//   light:    [241, 245, 249],
//   white:    [255, 255, 255],
//   green:    [16,  185, 129],
//   red:      [239, 68,  68],
//   orange:   [245, 158, 11],
//   blue:     [0,   120, 212],
//   teal:     [0,   184, 163],
//   purple:   [124, 77,  255],
//   tblAlt:   [248, 250, 255],
// };

// function feedbackLabel(pct) {
//   if (pct === null || pct === undefined) return '—';
//   if (pct >= 95) return 'Exceptional Engagement - Fully Committed!';
//   if (pct >= 80) return 'Well Prepared';
//   if (pct >= 65) return 'Needs Effort';
//   if (pct >= 50) return 'Needs More Effort';
//   return 'Needs Improvement';
// }

// function overallStatus(pct) {
//   if (pct >= 80) return 'Excellent';
//   if (pct >= 65) return 'Good';
//   if (pct >= 50) return 'Average';
//   return 'Needs Improvement';
// }

// function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
//   const W = doc.internal.pageSize.getWidth();
//   doc.setFillColor(...C.primary);
//   doc.rect(0, 0, W, 18, 'F');
//   doc.setFillColor(...C.accent);
//   doc.rect(W - 62, 0, 62, 18, 'F');
//   if (collegeLogoDataUrl) {
//     try { doc.addImage(collegeLogoDataUrl, 'PNG', 5, 2, 14, 14); } catch {}
//   }
//   doc.setTextColor(...C.white);
//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.text('MINDSPARK LEARNING HUB', W - 59, 8.5, { align: 'left' });
//   doc.setFontSize(6.5);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Powered by Mind Spark', W - 59, 13.5, { align: 'left' });
//   doc.setTextColor(...C.dark);
// }

// function drawPageFooter(doc, pageNum, totalPages) {
//   const W = doc.internal.pageSize.getWidth();
//   const H = doc.internal.pageSize.getHeight();
//   doc.setDrawColor(220, 220, 230);
//   doc.setLineWidth(0.3);
//   doc.line(10, H - 12, W - 10, H - 12);
//   doc.setFontSize(7.5);
//   doc.setTextColor(...C.mid);
//   doc.setFont('helvetica', 'normal');
//   doc.text('MINDSPARK LEARNING HUB', 10, H - 6);
//   doc.text(`${pageNum}`, W / 2, H - 6, { align: 'center' });
//   doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 6, { align: 'right' });
// }

// function drawStatBoxes(doc, stats, y) {
//   const W = doc.internal.pageSize.getWidth();
//   const bw = 32, bh = 22, bGap = 3;
//   const totalW = stats.length * bw + (stats.length - 1) * bGap;
//   let bx = (W - totalW) / 2;
//   stats.forEach(({ label, value, color }) => {
//     doc.setFillColor(...C.light);
//     doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
//     doc.setFillColor(...(color || C.primary));
//     doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...(color || C.primary));
//     doc.text(String(value), bx + bw / 2, y + bh / 2 - 0.5, { align: 'center' });
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6.5, { align: 'center' });
//     bx += bw + bGap;
//   });
//   doc.setTextColor(...C.dark);
//   return y + bh + 4;
// }

// function drawBarChart(doc, x, y, w, h, data, title, barColor = C.blue) {
//   const maxVal = Math.max(...data.map(d => d.value), 1);
//   if (title) {
//     doc.setFontSize(8.5);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text(title, x, y - 3);
//   }
//   doc.setFillColor(250, 252, 255);
//   doc.setDrawColor(220, 225, 235);
//   doc.setLineWidth(0.3);
//   doc.rect(x, y, w, h, 'FD');
//   const n = data.length;
//   const barW = (w * 0.6) / n;
//   const gap  = (w * 0.4) / (n + 1);
//   const axisH = h - 16;
//   const yBase = y + h - 8;
//   doc.setDrawColor(210, 215, 225);
//   doc.setLineWidth(0.2);
//   [0.25, 0.5, 0.75].forEach(pct => {
//     const gy = yBase - axisH * pct;
//     doc.line(x, gy, x + w, gy);
//     doc.setFontSize(5);
//     doc.setTextColor(180, 180, 195);
//     doc.text(String(Math.round(maxVal * pct)), x - 1, gy + 1, { align: 'right' });
//   });
//   data.forEach((d, i) => {
//     const bx  = x + gap + i * (barW + gap);
//     const bh2 = maxVal > 0 ? (d.value / maxVal) * (axisH - 4) : 0;
//     const by  = yBase - bh2;
//     doc.setFillColor(...(d.color || barColor));
//     if (bh2 > 0) doc.rect(bx, by, barW, bh2, 'F');
//     if (d.value > 0) {
//       doc.setFontSize(5.5);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...C.dark);
//       doc.text(String(d.value), bx + barW / 2, by - 1, { align: 'center' });
//     }
//     doc.setFontSize(5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     const lbl = d.label || '';
//     const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
//     lblLines.forEach((l, li) => doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' }));
//   });
//   doc.setTextColor(...C.dark);
//   return y + h + 8;
// }

// function drawPieChart(doc, cx, cy, r, data, title) {
//   doc.setFontSize(8.5);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   if (title) doc.text(title, cx - r, cy - r - 4);
//   const total = data.reduce((a, d) => a + d.value, 0);
//   if (total === 0) return;
//   let startAngle = -Math.PI / 2;
//   data.forEach(d => {
//     const sweep = (d.value / total) * 2 * Math.PI;
//     const steps = Math.max(8, Math.round(sweep * 20));
//     const pts   = [[cx, cy]];
//     for (let s = 0; s <= steps; s++) {
//       const a = startAngle + (s / steps) * sweep;
//       pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
//     }
//     doc.setFillColor(...d.color);
//     doc.lines(
//       pts.slice(1).map((p, i) => [p[0] - (i === 0 ? cx : pts[i][0]), p[1] - (i === 0 ? cy : pts[i][1])]),
//       cx, cy, [1, 1], 'F', true,
//     );
//     const midAngle = startAngle + sweep / 2;
//     const lx = cx + Math.cos(midAngle) * r * 0.65;
//     const ly = cy + Math.sin(midAngle) * r * 0.65;
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.white);
//     doc.text(`${((d.value / total) * 100).toFixed(1)}%`, lx, ly, { align: 'center' });
//     startAngle += sweep;
//   });
//   let lx = cx + r + 6, ly = cy - r / 2;
//   data.forEach((d, i) => {
//     doc.setFillColor(...d.color);
//     doc.rect(lx, ly + i * 9 - 2, 6, 5, 'F');
//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.dark);
//     doc.text(`${d.label} (${((d.value / total) * 100).toFixed(1)}%)`, lx + 8, ly + i * 9 + 2);
//   });
//   doc.setTextColor(...C.dark);
// }

// const RANGES = [
//   { label: '90-100%', min: 90, max: 101 },
//   { label: '80-90%',  min: 80, max: 90  },
//   { label: '70-80%',  min: 70, max: 80  },
//   { label: '60-70%',  min: 60, max: 70  },
//   { label: '50-60%',  min: 50, max: 60  },
//   { label: '40-50%',  min: 40, max: 50  },
//   { label: '30-40%',  min: 30, max: 40  },
//   { label: '20-30%',  min: 20, max: 30  },
//   { label: '10-20%',  min: 10, max: 20  },
//   { label: '0-10%',   min: 0,  max: 10  },
// ];

// function scoreDistribution(submissions, maxPossible) {
//   return RANGES.map(r => ({
//     label: r.label,
//     value: submissions.filter(s => {
//       const pct = ((s.totalScore ?? 0) / maxPossible) * 100;
//       return pct >= r.min && pct < r.max;
//     }).length,
//   }));
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // OVERALL REPORT
// // ─────────────────────────────────────────────────────────────────────────────
// export function generateOverallReport({
//   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// }) {
//   const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W   = doc.internal.pageSize.getWidth();

//   const total       = submissions.length;
//   const completed   = submissions.filter(s => s.status === 'completed').length;
//   const scores      = submissions.map(s => s.totalScore ?? 0);
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const maxScore    = total > 0 ? Math.max(...scores) : 0;
//   const minScore    = total > 0 ? Math.min(...scores.filter(s => s > 0)) : 0;
//   const avgScore    = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
//   const qualified   = submissions.filter(s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40).length;
//   const highestPct  = maxPossible > 0 ? `${((maxScore / maxPossible) * 100).toFixed(3)}%` : '0.000%';

//   // ── Department grouping — use branch (from ExamDetailsForm), fallback chain
//   const deptMap = {};
//   submissions.forEach(s => {
//     const dept = s.branch || s.department || s.section || 'Unknown';
//     if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
//     deptMap[dept].attempted++;
//     deptMap[dept].scores.push(s.totalScore ?? 0);
//   });
//   const deptRegistered = exam?.deptRegistered || {};
//   const deptKeys = Object.keys(deptMap);

//   // PAGE 1
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//   doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('MINDSPARK LEARNING HUB-ENTIRE REPORT', W / 2, 27, { align: 'center' });
//   doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//   const dayLabel = exam?.dayNumber ? `Consolidated Report on Day ${exam.dayNumber}` : 'Consolidated Report';
//   doc.text(dayLabel, W / 2, 33, { align: 'center' });
//   doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text(examTitle || 'Grand Test', W / 2, 40, { align: 'center' });

//   let cy = drawStatBoxes(doc, [
//     { label: 'Total Attempts',    value: total,             color: C.primary },
//     { label: 'Completed',         value: completed,         color: C.green   },
//     { label: 'Qualified',         value: qualified,         color: C.accent  },
//     { label: 'Not Qualified',     value: total - qualified, color: C.red     },
//     { label: 'Qualified Highest', value: highestPct,        color: C.teal    },
//   ], 46);
//   cy += 4;

//   // Attendance dept table
//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Attendance by Branch', 14, cy + 4); cy += 8;

//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
//       body: deptKeys.map(dept => {
//         const attempted   = deptMap[dept].attempted;
//         const registered  = deptRegistered[dept] || attempted;
//         return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
//       }),
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // Dept performance
//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: deptKeys.map(dept => {
//         const s   = deptMap[dept].scores;
//         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
//       }),
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // Section-wise performance (filter by branch if needed)
//   // Grouping by section too for multi-section analysis
//   const sectionStudentMap = {};
//   submissions.forEach(s => {
//     const sec = s.section || '—';
//     if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
//     sectionStudentMap[sec].attempted++;
//     sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
//   });
//   const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '—');
//   if (secKeys.length > 1) {
//     doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//     doc.text('Attendance by Section', 14, cy + 4); cy += 8;
//     autoTable(doc, {
//       startY: cy,
//       head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: secKeys.map(sec => {
//         const s   = sectionStudentMap[sec].scores;
//         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
//       }),
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // PAGE 2: Assessment info + section breakdown
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

//   // Build section breakdown from q.category (the real section name)
//   const sectionBreakdown = {};
//   questions.forEach(q => {
//     // Priority: explicit sectionName > q.category (e.g. "ARRAY", "APTITUDE") > type fallback
//     const key = q.sectionName || q.section || q.category
//       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
//     if (!sectionBreakdown[key]) sectionBreakdown[key] = { count: 0, marks: 0, questions: [] };
//     sectionBreakdown[key].count++;
//     sectionBreakdown[key].marks += q.marks || 0;
//     sectionBreakdown[key].questions.push(q);
//   });

//   const notAttemptedTotal = (exam?.registeredStudents?.length || 0) - total;

//   autoTable(doc, {
//     startY: cy,
//     head: [['NAME', 'VALUE']],
//     body: [
//       ['Assessment Name',    examTitle || '—'],
//       ['Questions Count',    String(questions.length)],
//       ['Students Attempted', String(total)],
//       ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
//       ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
//       ['Highest Percentage', highestPct],
//       ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
//     ],
//     styles: { fontSize: 8.5, cellPadding: 3 },
//     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55 } },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   if (Object.keys(sectionBreakdown).length) {
//     const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
//     secBody.push(['Total', String(questions.length), String(maxPossible)]);
//     autoTable(doc, {
//       startY: cy,
//       head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
//       body: secBody,
//       styles: { fontSize: 8.5, cellPadding: 3, halign: 'center' },
//       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
//       didParseCell: data => {
//         if (data.section === 'body' && data.row.index === secBody.length - 1)
//           data.cell.styles.fontStyle = 'bold';
//       },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 14, right: 14 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // PAGE 3: Charts
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

//   if (deptKeys.length) {
//     drawPieChart(doc, 38, cy + 28, 22, [
//       { label: 'Attempted',     value: total,                          color: C.green     },
//       { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [220,220,230] },
//     ], 'Attendance');
//     cy += 68;
//   }

//   const overallDist = scoreDistribution(submissions, maxPossible).reverse();
//   cy = drawBarChart(doc, 14, cy, W - 28, 50,
//     overallDist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//     'Overall Performance Student Distribution', C.blue);

//   // Per-section distribution using actual section names from q.category
//   Object.entries(sectionBreakdown).forEach(([secName, secData]) => {
//     const secMax    = secData.marks || 1;
//     const secScores = submissions.map(s => {
//       const brk      = s.scoreBreakdown || [];
//       const secScore = brk
//         .filter(b => secData.questions.find(q => q.id === b.questionId))
//         .reduce((a, b2) => a + (b2.score || 0), 0);
//       return { totalScore: secScore };
//     });
//     const dist = scoreDistribution(secScores, secMax).reverse();
//     if (cy > 210) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }
//     cy = drawBarChart(doc, 14, cy, W - 28, 48,
//       dist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//       `${secName} Performance Student Distribution`, C.blue);
//   });

//   // PAGE 4: Top / Bottom / Full table
//   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;
//   const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
//   const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Top Students', 14, cy); cy += 3;
//   autoTable(doc, {
//     startY: cy,
//     head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
//     body: sorted.slice(0, 10).map(s => [
//       s.studentName  || '—',
//       s.studentRegNo || '—',
//       s.branch       || s.department || '—',
//       s.section      || '—',
//       maxPossible > 0
//         ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
//         : '0.00%',
//     ]),
//     styles: { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles: { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles: { fillColor: C.tblAlt },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//   doc.text('Bottom Students', 14, cy); cy += 3;
//   autoTable(doc, {
//     startY: cy,
//     head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
//     body: bottom.slice(0, 9).map(s => [
//       s.studentName  || '—',
//       s.studentRegNo || '—',
//       s.branch       || s.department || '—',
//       s.section      || '—',
//       maxPossible > 0
//         ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
//         : '0.00%',
//     ]),
//     styles: { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles: { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles: { fillColor: C.tblAlt },
//     margin: { left: 14, right: 14 }, theme: 'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   if (cy > 200) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }

//   // Build dynamic section score columns for the full table
//   const secNames = Object.keys(sectionBreakdown);
//   autoTable(doc, {
//     startY: cy,
//     head: [['#', 'Name', 'Regd', 'Branch', 'Sec', ...secNames, 'Total', '%', 'Violations']],
//     body: sorted.map((s, i) => {
//       const brk = s.scoreBreakdown || [];
//       const secScores = secNames.map(secName => {
//         const secQs    = sectionBreakdown[secName].questions;
//         const secScore = brk
//           .filter(b => secQs.find(q => q.id === b.questionId))
//           .reduce((a, b2) => a + (b2.score || 0), 0);
//         return String(secScore);
//       });
//       return [
//         `${i + 1}`,
//         s.studentName  || '—',
//         s.studentRegNo || '—',
//         s.branch       || s.department || '—',
//         s.section      || '—',
//         ...secScores,
//         String(s.totalScore ?? 0),
//         maxPossible > 0
//           ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%`
//           : '0.0%',
//         String(s.violations ?? 0),
//       ];
//     }),
//     styles: { fontSize: 7, cellPadding: 2 },
//     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 7 },
//     columnStyles: {
//       0: { cellWidth: 8 },
//       [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold' }, // Total
//       [5 + secNames.length + 1]: { halign: 'center' },                    // %
//       [5 + secNames.length + 2]: { halign: 'center' },                    // Violations
//     },
//     margin: { left: 10, right: 10 }, theme: 'striped',
//     didParseCell: data => {
//       const totalColIdx = 5 + secNames.length;
//       if (data.section === 'body' && data.column.index === totalColIdx) {
//         const score = parseInt(data.row.raw[totalColIdx]);
//         const pct   = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
//         if      (pct >= 80) data.cell.styles.textColor = C.green;
//         else if (pct >= 40) data.cell.styles.textColor = C.orange;
//         else                data.cell.styles.textColor = C.red;
//       }
//     },
//   });

//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
//   doc.save(`Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STUDENT-WISE REPORT
// // Uses REAL q.category as section names. No hardcoded section rows.
// // ─────────────────────────────────────────────────────────────────────────────
// export function generateStudentWiseReport({
//   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// }) {
//   if (!submissions.length) { alert('No submissions to generate report for.'); return; }

//   const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W           = doc.internal.pageSize.getWidth();
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

//   // ── Build section map from actual questions — key = q.category (e.g. "ARRAY", "APTITUDE")
//   const sectionMap = {};
//   questions.forEach(q => {
//     const key = q.sectionName || q.section || q.category
//       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
//     if (!sectionMap[key]) sectionMap[key] = [];
//     sectionMap[key].push(q);
//   });
//   const allSectionNames = Object.keys(sectionMap);

//   // ── MCQ / Coding splits from actual questions
//   const mcqQs    = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
//   const codingQs = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
//   const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
//   const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

//   // ── Get score % for a student in a named section (null if section not in exam)
//   const getSectionPct = (sub, secName) => {
//     const secQs = sectionMap[secName];
//     if (!secQs || secQs.length === 0) return null;
//     const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//     if (secMax === 0) return null;
//     const brk      = sub.scoreBreakdown || [];
//     const secScore = brk
//       .filter(b => secQs.find(q => q.id === b.questionId))
//       .reduce((a, b) => a + (b.score || 0), 0);
//     return Math.round((secScore / secMax) * 100);
//   };

//   const ratingStr = pct => (pct !== null && pct !== undefined ? `${pct}%` : '—');

//   sorted.forEach((sub, idx) => {
//     if (idx > 0) doc.addPage();
//     drawPageHeader(doc, collegeLogoDataUrl, collegeName);

//     const score  = sub.totalScore ?? 0;
//     const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
//     const pctStr = `${pct.toFixed(0)}%`;
//     const status = overallStatus(pct);
//     const passed = pct >= 40;

//     // Student info block
//     doc.setFillColor(...C.light);
//     doc.roundedRect(10, 22, W - 20, 36, 3, 3, 'F');
//     doc.setFillColor(...C.primary);
//     doc.roundedRect(10, 22, 4, 36, 2, 2, 'F');

//     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
//     doc.text('Student Performance Report', W / 2, 28, { align: 'center' });

//     doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//     [
//       ['Student Name:',   sub.studentName  || '—'],
//       ['Student ID:',     sub.studentRegNo || sub.studentId || '—'],
//       ['Overall Status:', status],
//     ].forEach(([lbl, val], i) => {
//       doc.setFont('helvetica', 'bold');   doc.text(lbl, 17, 35 + i * 6);
//       doc.setFont('helvetica', 'normal'); doc.text(val, 50, 35 + i * 6);
//     });
//     [
//       // Use sub.section for Batch, sub.branch for Branch
//       ['Branch:',             sub.branch  || sub.department || '—'],
//       ['Section / Batch:',    sub.section || exam?.batch    || '—'],
//       ['Evaluation Period:',  examTitle   || '—'],
//     ].forEach(([lbl, val], i) => {
//       const x = i < 2 ? W / 2 + 5 : W / 2 + 5;
//       const y = i < 2 ? 35 + i * 6 : 47;
//       doc.setFont('helvetica', 'bold');   doc.text(lbl, x, y);
//       doc.setFont('helvetica', 'normal'); doc.text(val, x + 36, y);
//     });

//     // Overall % badge
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(W - 36, 23, 24, 14, 3, 3, 'F');
//     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
//     doc.text(pctStr, W - 24, 31, { align: 'center' });
//     doc.setFontSize(6); doc.setFont('helvetica', 'normal');
//     doc.text('Overall', W - 24, 35, { align: 'center' });
//     doc.setTextColor(...C.dark);

//     let cy = 63;

//     const sectionHeading = (title, yPos) => {
//       doc.setFillColor(...C.primary);
//       doc.rect(10, yPos, W - 20, 6, 'F');
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
//       doc.text(title, 14, yPos + 4);
//       doc.setTextColor(...C.dark);
//       return yPos + 8;
//     };

//     const colorCell = (data) => {
//       if (data.section === 'body' && data.column.index === 2) {
//         const raw = data.cell.raw;
//         if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//         const v = parseInt(raw);
//         if      (v >= 80) data.cell.styles.textColor = C.green;
//         else if (v >= 50) data.cell.styles.textColor = C.orange;
//         else              data.cell.styles.textColor = C.red;
//       }
//     };

//     const tableStyle = {
//       styles: { fontSize: 8, cellPadding: 2.5 },
//       columnStyles: {
//         0: { cellWidth: 10, halign: 'center' },
//         1: { cellWidth: 65 },
//         2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
//         3: { cellWidth: 85 },
//       },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 10, right: 10 },
//       theme: 'grid',
//       didParseCell: colorCell,
//     };

//     // ── Overall Performance ─────────────────────────────────────────────────
//     cy = sectionHeading('Overall Performance', cy);
//     doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//     doc.text(`Overall Performance: ${pctStr}`, 14, cy + 4);
//     const pbW = W - 28;
//     doc.setFillColor(220, 225, 235);
//     doc.roundedRect(14, cy + 7, pbW, 4, 2, 2, 'F');
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(14, cy + 7, pbW * Math.min(1, pct / 100), 4, 2, 2, 'F');
//     doc.setTextColor(...C.dark);
//     cy += 16;

//     // ── Participation Metrics ───────────────────────────────────────────────
//     cy = sectionHeading('Participation Metrics:', cy);

//     const totalExamsAssigned  = sub.totalExamsAssigned ?? 1;
//     const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
//     const overallParticipationPct = totalExamsAssigned > 0
//       ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100)
//       : null;

//     const practiceAttempts = sub.practiceAttempts ?? sub.practiceCount ?? null;
//     const weeklyAttempts   = sub.weeklyAttempts   ?? sub.weeklyCount   ?? null;

//     const participationRows = [
//       ['Overall Assessment',            overallParticipationPct],
//       ['Placement Readiness',           Math.round(pct)],
//       ['Practice Assessments - Weekly', practiceAttempts !== null
//         ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
//         : null],
//       ['Assessments - Weekly', weeklyAttempts !== null
//         ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
//         : null],
//     ];

//     autoTable(doc, {
//       startY: cy,
//       head: [['Sno', 'For', 'Rating', 'Feedback']],
//       body: participationRows.map(([label, rPct], i) => [
//         String(i + 1), label, ratingStr(rPct), feedbackLabel(rPct),
//       ]),
//       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       ...tableStyle,
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Performance Metrics ─────────────────────────────────────────────────
//     // Dynamically lists ALL real sections from q.category
//     cy = sectionHeading('Performance Metrics:', cy);

//     const mcqPct    = mcqMax    > 0 ? Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100) : null;
//     const codingPct = codingMax > 0 ? Math.round(((sub.codingScore ?? 0) / codingMax) * 100) : null;

//     // Build rows: one row per actual section in this exam
//     const perfRows = allSectionNames.map((secName, i) => {
//       const pctVal = getSectionPct(sub, secName);
//       return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
//     });

//     // Append summary rows only when those question types exist
//     if (mcqMax > 0 && codingMax > 0) {
//       const mcqRow    = ['—', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)];
//       const codingRow = ['—', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)];
//       perfRows.push(mcqRow, codingRow);
//     }

//     autoTable(doc, {
//       startY: cy,
//       head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
//       body: perfRows,
//       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       ...tableStyle,
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Section Score Details ────────────────────────────────────────────────
//     // Shows actual marks scored vs max marks per section
//     cy = sectionHeading('Section Score Details:', cy);
//     const scoreDetailRows = allSectionNames.map(secName => {
//       const secQs    = sectionMap[secName];
//       const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//       const brk      = sub.scoreBreakdown || [];
//       const secScore = brk
//         .filter(b => secQs.find(q => q.id === b.questionId))
//         .reduce((a, b) => a + (b.score || 0), 0);
//       const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '—';
//       return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
//     });
//     scoreDetailRows.push([
//       'TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length),
//     ]);

//     autoTable(doc, {
//       startY: cy,
//       head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
//       body: scoreDetailRows,
//       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold' },
//         1: { halign: 'center' },
//         2: { halign: 'center', fontStyle: 'bold' },
//         3: { halign: 'center' },
//       },
//       didParseCell: data => {
//         if (data.section === 'body' && data.row.index === scoreDetailRows.length - 1)
//           data.cell.styles.fontStyle = 'bold';
//       },
//       alternateRowStyles: { fillColor: C.tblAlt },
//       margin: { left: 10, right: 10 }, theme: 'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 4;

//     // ── Weekly Assessment Metrics ────────────────────────────────────────────
//     if (cy < 240) {
//       cy = sectionHeading('Weekly Assessment Metrics:', cy);
//       const practiceWeeklyPct = practiceAttempts !== null
//         ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
//         : null;
//       const weeklyAssessPct = weeklyAttempts !== null
//         ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
//         : null;

//       autoTable(doc, {
//         startY: cy,
//         head: [['Sno', 'For', 'Rating', 'Feedback']],
//         body: [
//           ['1', 'Practice Assessments', ratingStr(practiceWeeklyPct), feedbackLabel(practiceWeeklyPct)],
//           ['2', 'Weekly Assessments',   ratingStr(weeklyAssessPct),   feedbackLabel(weeklyAssessPct)],
//         ],
//         headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//         ...tableStyle,
//       });
//       cy = doc.lastAutoTable.finalY + 4;
//     }

//     // ── Proctoring violations note ───────────────────────────────────────────
//     // FIX: Use ASCII "!" instead of Unicode ⚠ which breaks jsPDF Helvetica
//     const viols = sub.violations ?? 0;
//     if (viols > 0 && cy < 270) {
//       doc.setFontSize(7.5);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...C.red);
//       doc.text(
//         `! WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`,
//         10, cy,
//       );
//       doc.setTextColor(...C.dark);
//       doc.setFont('helvetica', 'normal');
//     }
//   });

//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
//   doc.save(`StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// } 





import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const C = {
  primary:  [26,  115, 232],
  accent:   [124, 77,  255],
  dark:     [15,  23,  42],
  mid:      [71,  85,  105],
  light:    [241, 245, 249],
  white:    [255, 255, 255],
  green:    [16,  185, 129],
  red:      [239, 68,  68],
  orange:   [245, 158, 11],
  blue:     [0,   120, 212],
  teal:     [0,   184, 163],
  purple:   [124, 77,  255],
  tblAlt:   [248, 250, 255],
};

function feedbackLabel(pct) {
  if (pct === null || pct === undefined) return '—';
  if (pct >= 95) return 'Exceptional Engagement - Fully Committed!';
  if (pct >= 80) return 'Well Prepared';
  if (pct >= 65) return 'Needs Effort';
  if (pct >= 50) return 'Needs More Effort';
  return 'Needs Improvement';
}

function overallStatus(pct) {
  if (pct >= 80) return 'Excellent';
  if (pct >= 65) return 'Good';
  if (pct >= 50) return 'Average';
  return 'Needs Improvement';
}

function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, W, 18, 'F');
  doc.setFillColor(...C.accent);
  doc.rect(W - 62, 0, 62, 18, 'F');
  if (collegeLogoDataUrl) {
    try { doc.addImage(collegeLogoDataUrl, 'PNG', 5, 2, 14, 14); } catch {}
  }
  doc.setTextColor(...C.white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MINDSPARK LEARNING HUB', W - 59, 8.5, { align: 'left' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by Mind Spark', W - 59, 13.5, { align: 'left' });
  doc.setTextColor(...C.dark);
}

function drawPageFooter(doc, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.3);
  doc.line(10, H - 12, W - 10, H - 12);
  doc.setFontSize(7.5);
  doc.setTextColor(...C.mid);
  doc.setFont('helvetica', 'normal');
  doc.text('MINDSPARK LEARNING HUB', 10, H - 6);
  doc.text(`${pageNum}`, W / 2, H - 6, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 6, { align: 'right' });
}

function drawStatBoxes(doc, stats, y) {
  const W = doc.internal.pageSize.getWidth();
  const bw = 32, bh = 22, bGap = 3;
  const totalW = stats.length * bw + (stats.length - 1) * bGap;
  let bx = (W - totalW) / 2;
  stats.forEach(({ label, value, color }) => {
    doc.setFillColor(...C.light);
    doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
    doc.setFillColor(...(color || C.primary));
    doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(color || C.primary));
    doc.text(String(value), bx + bw / 2, y + bh / 2 - 0.5, { align: 'center' });
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6.5, { align: 'center' });
    bx += bw + bGap;
  });
  doc.setTextColor(...C.dark);
  return y + bh + 4;
}

function drawBarChart(doc, x, y, w, h, data, title, barColor = C.blue) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  if (title) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(title, x, y - 3);
  }
  doc.setFillColor(250, 252, 255);
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.rect(x, y, w, h, 'FD');
  const n = data.length;
  const barW = (w * 0.6) / n;
  const gap  = (w * 0.4) / (n + 1);
  const axisH = h - 16;
  const yBase = y + h - 8;
  doc.setDrawColor(210, 215, 225);
  doc.setLineWidth(0.2);
  [0.25, 0.5, 0.75].forEach(pct => {
    const gy = yBase - axisH * pct;
    doc.line(x, gy, x + w, gy);
    doc.setFontSize(5);
    doc.setTextColor(180, 180, 195);
    doc.text(String(Math.round(maxVal * pct)), x - 1, gy + 1, { align: 'right' });
  });
  data.forEach((d, i) => {
    const bx  = x + gap + i * (barW + gap);
    const bh2 = maxVal > 0 ? (d.value / maxVal) * (axisH - 4) : 0;
    const by  = yBase - bh2;
    doc.setFillColor(...(d.color || barColor));
    if (bh2 > 0) doc.rect(bx, by, barW, bh2, 'F');
    if (d.value > 0) {
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.dark);
      doc.text(String(d.value), bx + barW / 2, by - 1, { align: 'center' });
    }
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    const lbl = d.label || '';
    const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
    lblLines.forEach((l, li) => doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' }));
  });
  doc.setTextColor(...C.dark);
  return y + h + 8;
}

function drawPieChart(doc, cx, cy, r, data, title) {
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  if (title) doc.text(title, cx - r, cy - r - 4);
  const total = data.reduce((a, d) => a + d.value, 0);
  if (total === 0) return;
  let startAngle = -Math.PI / 2;
  data.forEach(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const steps = Math.max(8, Math.round(sweep * 20));
    const pts   = [[cx, cy]];
    for (let s = 0; s <= steps; s++) {
      const a = startAngle + (s / steps) * sweep;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    doc.setFillColor(...d.color);
    doc.lines(
      pts.slice(1).map((p, i) => [p[0] - (i === 0 ? cx : pts[i][0]), p[1] - (i === 0 ? cy : pts[i][1])]),
      cx, cy, [1, 1], 'F', true,
    );
    const midAngle = startAngle + sweep / 2;
    const lx = cx + Math.cos(midAngle) * r * 0.65;
    const ly = cy + Math.sin(midAngle) * r * 0.65;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(`${((d.value / total) * 100).toFixed(1)}%`, lx, ly, { align: 'center' });
    startAngle += sweep;
  });
  let lx = cx + r + 6, ly = cy - r / 2;
  data.forEach((d, i) => {
    doc.setFillColor(...d.color);
    doc.rect(lx, ly + i * 9 - 2, 6, 5, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.dark);
    doc.text(`${d.label} (${((d.value / total) * 100).toFixed(1)}%)`, lx + 8, ly + i * 9 + 2);
  });
  doc.setTextColor(...C.dark);
}

const RANGES = [
  { label: '90-100%', min: 90, max: 101 },
  { label: '80-90%',  min: 80, max: 90  },
  { label: '70-80%',  min: 70, max: 80  },
  { label: '60-70%',  min: 60, max: 70  },
  { label: '50-60%',  min: 50, max: 60  },
  { label: '40-50%',  min: 40, max: 50  },
  { label: '30-40%',  min: 30, max: 40  },
  { label: '20-30%',  min: 20, max: 30  },
  { label: '10-20%',  min: 10, max: 20  },
  { label: '0-10%',   min: 0,  max: 10  },
];

function scoreDistribution(submissions, maxPossible) {
  return RANGES.map(r => ({
    label: r.label,
    value: submissions.filter(s => {
      const pct = ((s.totalScore ?? 0) / maxPossible) * 100;
      return pct >= r.min && pct < r.max;
    }).length,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERALL REPORT
// ─────────────────────────────────────────────────────────────────────────────
export function generateOverallReport({
  examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();

  const total       = submissions.length;
  const completed   = submissions.filter(s => s.status === 'completed').length;
  const scores      = submissions.map(s => s.totalScore ?? 0);
  const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
  const maxScore    = total > 0 ? Math.max(...scores) : 0;
  const minScore    = total > 0 ? Math.min(...scores.filter(s => s > 0)) : 0;
  const avgScore    = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
  const qualified   = submissions.filter(s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40).length;
  const highestPct  = maxPossible > 0 ? `${((maxScore / maxPossible) * 100).toFixed(3)}%` : '0.000%';

  // ── Department grouping — use branch (from ExamDetailsForm), fallback chain
  const deptMap = {};
  submissions.forEach(s => {
    const dept = s.branch || s.department || s.section || 'Unknown';
    if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
    deptMap[dept].attempted++;
    deptMap[dept].scores.push(s.totalScore ?? 0);
  });
  const deptRegistered = exam?.deptRegistered || {};
  const deptKeys = Object.keys(deptMap);

  // PAGE 1
  drawPageHeader(doc, collegeLogoDataUrl, collegeName);
  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
  doc.text('MINDSPARK LEARNING HUB-ENTIRE REPORT', W / 2, 27, { align: 'center' });
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
  const dayLabel = exam?.dayNumber ? `Consolidated Report on Day ${exam.dayNumber}` : 'Consolidated Report';
  doc.text(dayLabel, W / 2, 33, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
  doc.text(examTitle || 'Grand Test', W / 2, 40, { align: 'center' });

  let cy = drawStatBoxes(doc, [
    { label: 'Total Attempts',    value: total,             color: C.primary },
    { label: 'Completed',         value: completed,         color: C.green   },
    { label: 'Qualified',         value: qualified,         color: C.accent  },
    { label: 'Not Qualified',     value: total - qualified, color: C.red     },
    { label: 'Qualified Highest', value: highestPct,        color: C.teal    },
  ], 46);
  cy += 4;

  // Attendance dept table
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
  doc.text('Attendance by Branch', 14, cy + 4); cy += 8;

  if (deptKeys.length) {
    autoTable(doc, {
      startY: cy,
      head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
      body: deptKeys.map(dept => {
        const attempted   = deptMap[dept].attempted;
        const registered  = deptRegistered[dept] || attempted;
        return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
      }),
      styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
      headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 14, right: 14 }, theme: 'grid',
    });
    cy = doc.lastAutoTable.finalY + 6;
  }

  // Dept performance
  if (deptKeys.length) {
    autoTable(doc, {
      startY: cy,
      head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
      body: deptKeys.map(dept => {
        const s   = deptMap[dept].scores;
        const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
        const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
        return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
      }),
      styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
      headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 14, right: 14 }, theme: 'grid',
    });
    cy = doc.lastAutoTable.finalY + 6;
  }

  // Section-wise performance (filter by branch if needed)
  const sectionStudentMap = {};
  submissions.forEach(s => {
    const sec = s.section || '—';
    if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
    sectionStudentMap[sec].attempted++;
    sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
  });
  const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '—');
  if (secKeys.length > 1) {
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
    doc.text('Attendance by Section', 14, cy + 4); cy += 8;
    autoTable(doc, {
      startY: cy,
      head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
      body: secKeys.map(sec => {
        const s   = sectionStudentMap[sec].scores;
        const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
        const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
        return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
      }),
      styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
      headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 14, right: 14 }, theme: 'grid',
    });
    cy = doc.lastAutoTable.finalY + 6;
  }

  // PAGE 2: Assessment info + section breakdown
  doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

  const sectionBreakdown = {};
  questions.forEach(q => {
    const key = q.sectionName || q.section || q.category
      || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
    if (!sectionBreakdown[key]) sectionBreakdown[key] = { count: 0, marks: 0, questions: [] };
    sectionBreakdown[key].count++;
    sectionBreakdown[key].marks += q.marks || 0;
    sectionBreakdown[key].questions.push(q);
  });

  const notAttemptedTotal = (exam?.registeredStudents?.length || 0) - total;

  autoTable(doc, {
    startY: cy,
    head: [['NAME', 'VALUE']],
    body: [
      ['Assessment Name',    examTitle || '—'],
      ['Questions Count',    String(questions.length)],
      ['Students Attempted', String(total)],
      ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
      ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
      ['Highest Percentage', highestPct],
      ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
    ],
    styles: { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55 } },
    margin: { left: 14, right: 14 }, theme: 'grid',
  });
  cy = doc.lastAutoTable.finalY + 6;

  if (Object.keys(sectionBreakdown).length) {
    const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
    secBody.push(['Total', String(questions.length), String(maxPossible)]);
    autoTable(doc, {
      startY: cy,
      head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
      body: secBody,
      styles: { fontSize: 8.5, cellPadding: 3, halign: 'center' },
      headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
      didParseCell: data => {
        if (data.section === 'body' && data.row.index === secBody.length - 1)
          data.cell.styles.fontStyle = 'bold';
      },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 14, right: 14 }, theme: 'grid',
    });
    cy = doc.lastAutoTable.finalY + 6;
  }

  // PAGE 3: Charts
  doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

  if (deptKeys.length) {
    drawPieChart(doc, 38, cy + 28, 22, [
      { label: 'Attempted',     value: total,                          color: C.green     },
      { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [220,220,230] },
    ], 'Attendance');
    cy += 68;
  }

  const overallDist = scoreDistribution(submissions, maxPossible).reverse();
  cy = drawBarChart(doc, 14, cy, W - 28, 50,
    overallDist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
    'Overall Performance Student Distribution', C.blue);

  Object.entries(sectionBreakdown).forEach(([secName, secData]) => {
    const secMax    = secData.marks || 1;
    const secScores = submissions.map(s => {
      const brk      = s.scoreBreakdown || [];
      const secScore = brk
        .filter(b => secData.questions.find(q => q.id === b.questionId))
        .reduce((a, b2) => a + (b2.score || 0), 0);
      return { totalScore: secScore };
    });
    const dist = scoreDistribution(secScores, secMax).reverse();
    if (cy > 210) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }
    cy = drawBarChart(doc, 14, cy, W - 28, 48,
      dist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
      `${secName} Performance Student Distribution`, C.blue);
  });

  // PAGE 4: Top / Bottom / Full table
  doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;
  const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
  const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
  doc.text('Top Students', 14, cy); cy += 3;
  autoTable(doc, {
    startY: cy,
    head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
    body: sorted.slice(0, 10).map(s => [
      s.studentName  || '—',
      s.studentRegNo || '—',
      s.branch       || s.department || '—',
      s.section      || '—',
      maxPossible > 0
        ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
        : '0.00%',
    ]),
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    headStyles: { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
    columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
    alternateRowStyles: { fillColor: C.tblAlt },
    margin: { left: 14, right: 14 }, theme: 'grid',
  });
  cy = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
  doc.text('Bottom Students', 14, cy); cy += 3;
  autoTable(doc, {
    startY: cy,
    head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
    body: bottom.slice(0, 9).map(s => [
      s.studentName  || '—',
      s.studentRegNo || '—',
      s.branch       || s.department || '—',
      s.section      || '—',
      maxPossible > 0
        ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
        : '0.00%',
    ]),
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    headStyles: { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
    columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
    alternateRowStyles: { fillColor: C.tblAlt },
    margin: { left: 14, right: 14 }, theme: 'grid',
  });
  cy = doc.lastAutoTable.finalY + 8;

  if (cy > 200) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }

  const secNames = Object.keys(sectionBreakdown);
  autoTable(doc, {
    startY: cy,
    head: [['#', 'Name', 'Regd', 'Branch', 'Sec', ...secNames, 'Total', '%', 'Violations']],
    body: sorted.map((s, i) => {
      const brk = s.scoreBreakdown || [];
      const secScores = secNames.map(secName => {
        const secQs    = sectionBreakdown[secName].questions;
        const secScore = brk
          .filter(b => secQs.find(q => q.id === b.questionId))
          .reduce((a, b2) => a + (b2.score || 0), 0);
        return String(secScore);
      });
      return [
        `${i + 1}`,
        s.studentName  || '—',
        s.studentRegNo || '—',
        s.branch       || s.department || '—',
        s.section      || '—',
        ...secScores,
        String(s.totalScore ?? 0),
        maxPossible > 0
          ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%`
          : '0.0%',
        String(s.violations ?? 0),
      ];
    }),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 8 },
      [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold' },
      [5 + secNames.length + 1]: { halign: 'center' },
      [5 + secNames.length + 2]: { halign: 'center' },
    },
    margin: { left: 10, right: 10 }, theme: 'striped',
    didParseCell: data => {
      const totalColIdx = 5 + secNames.length;
      if (data.section === 'body' && data.column.index === totalColIdx) {
        const score = parseInt(data.row.raw[totalColIdx]);
        const pct   = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
        if      (pct >= 80) data.cell.styles.textColor = C.green;
        else if (pct >= 40) data.cell.styles.textColor = C.orange;
        else                data.cell.styles.textColor = C.red;
      }
    },
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
  doc.save(`Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT-WISE REPORT
// ─────────────────────────────────────────────────────────────────────────────
export function generateStudentWiseReport({
  examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
}) {
  if (!submissions.length) { alert('No submissions to generate report for.'); return; }

  const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W           = doc.internal.pageSize.getWidth();
  const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
  const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

  const sectionMap = {};
  questions.forEach(q => {
    const key = q.sectionName || q.section || q.category
      || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
    if (!sectionMap[key]) sectionMap[key] = [];
    sectionMap[key].push(q);
  });
  const allSectionNames = Object.keys(sectionMap);

  const mcqQs    = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
  const codingQs = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
  const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
  const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

  const getSectionPct = (sub, secName) => {
    const secQs = sectionMap[secName];
    if (!secQs || secQs.length === 0) return null;
    const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
    if (secMax === 0) return null;
    const brk      = sub.scoreBreakdown || [];
    const secScore = brk
      .filter(b => secQs.find(q => q.id === b.questionId))
      .reduce((a, b) => a + (b.score || 0), 0);
    return Math.round((secScore / secMax) * 100);
  };

  const ratingStr = pct => (pct !== null && pct !== undefined ? `${pct}%` : '—');

  sorted.forEach((sub, idx) => {
    if (idx > 0) doc.addPage();
    drawPageHeader(doc, collegeLogoDataUrl, collegeName);

    const score  = sub.totalScore ?? 0;
    const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    const pctStr = `${pct.toFixed(0)}%`;
    const status = overallStatus(pct);
    const passed = pct >= 40;

    doc.setFillColor(...C.light);
    doc.roundedRect(10, 22, W - 20, 36, 3, 3, 'F');
    doc.setFillColor(...C.primary);
    doc.roundedRect(10, 22, 4, 36, 2, 2, 'F');

    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
    doc.text('Student Performance Report', W / 2, 28, { align: 'center' });

    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
    [
      ['Student Name:',   sub.studentName  || '—'],
      ['Student ID:',     sub.studentRegNo || sub.studentId || '—'],
      ['Overall Status:', status],
    ].forEach(([lbl, val], i) => {
      doc.setFont('helvetica', 'bold');   doc.text(lbl, 17, 35 + i * 6);
      doc.setFont('helvetica', 'normal'); doc.text(val, 50, 35 + i * 6);
    });
    [
      ['Branch:',             sub.branch  || sub.department || '—'],
      ['Section / Batch:',    sub.section || exam?.batch    || '—'],
      ['Evaluation Period:',  examTitle   || '—'],
    ].forEach(([lbl, val], i) => {
      const x = i < 2 ? W / 2 + 5 : W / 2 + 5;
      const y = i < 2 ? 35 + i * 6 : 47;
      doc.setFont('helvetica', 'bold');   doc.text(lbl, x, y);
      doc.setFont('helvetica', 'normal'); doc.text(val, x + 36, y);
    });

    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(W - 36, 23, 24, 14, 3, 3, 'F');
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
    doc.text(pctStr, W - 24, 31, { align: 'center' });
    doc.setFontSize(6); doc.setFont('helvetica', 'normal');
    doc.text('Overall', W - 24, 35, { align: 'center' });
    doc.setTextColor(...C.dark);

    let cy = 63;

    const sectionHeading = (title, yPos) => {
      doc.setFillColor(...C.primary);
      doc.rect(10, yPos, W - 20, 6, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
      doc.text(title, 14, yPos + 4);
      doc.setTextColor(...C.dark);
      return yPos + 8;
    };

    const colorCell = (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const raw = data.cell.raw;
        if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
        const v = parseInt(raw);
        if      (v >= 80) data.cell.styles.textColor = C.green;
        else if (v >= 50) data.cell.styles.textColor = C.orange;
        else              data.cell.styles.textColor = C.red;
      }
    };

    const tableStyle = {
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 65 },
        2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 85 },
      },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 10, right: 10 },
      theme: 'grid',
      didParseCell: colorCell,
    };

    // ── Overall Performance
    cy = sectionHeading('Overall Performance', cy);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
    doc.text(`Overall Performance: ${pctStr}`, 14, cy + 4);
    const pbW = W - 28;
    doc.setFillColor(220, 225, 235);
    doc.roundedRect(14, cy + 7, pbW, 4, 2, 2, 'F');
    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(14, cy + 7, pbW * Math.min(1, pct / 100), 4, 2, 2, 'F');
    doc.setTextColor(...C.dark);
    cy += 16;

    // ── Participation Metrics
    cy = sectionHeading('Participation Metrics:', cy);

    const totalExamsAssigned  = sub.totalExamsAssigned ?? 1;
    const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
    const overallParticipationPct = totalExamsAssigned > 0
      ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100)
      : null;

    const practiceAttempts = sub.practiceAttempts ?? sub.practiceCount ?? null;
    const weeklyAttempts   = sub.weeklyAttempts   ?? sub.weeklyCount   ?? null;

    const participationRows = [
      ['Overall Assessment',            overallParticipationPct],
      ['Placement Readiness',           Math.round(pct)],
      ['Practice Assessments - Weekly', practiceAttempts !== null
        ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
        : null],
      ['Assessments - Weekly', weeklyAttempts !== null
        ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
        : null],
    ];

    autoTable(doc, {
      startY: cy,
      head: [['Sno', 'For', 'Rating', 'Feedback']],
      body: participationRows.map(([label, rPct], i) => [
        String(i + 1), label, ratingStr(rPct), feedbackLabel(rPct),
      ]),
      headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      ...tableStyle,
    });
    cy = doc.lastAutoTable.finalY + 5;

    // ── Performance Metrics
    cy = sectionHeading('Performance Metrics:', cy);

    const mcqPct    = mcqMax    > 0 ? Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100) : null;
    const codingPct = codingMax > 0 ? Math.round(((sub.codingScore ?? 0) / codingMax) * 100) : null;

    const perfRows = allSectionNames.map((secName, i) => {
      const pctVal = getSectionPct(sub, secName);
      return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
    });

    if (mcqMax > 0 && codingMax > 0) {
      perfRows.push(['—', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
      perfRows.push(['—', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
    }

    autoTable(doc, {
      startY: cy,
      head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
      body: perfRows,
      headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      ...tableStyle,
    });
    cy = doc.lastAutoTable.finalY + 5;

    // ── Section Score Details
    cy = sectionHeading('Section Score Details:', cy);
    const scoreDetailRows = allSectionNames.map(secName => {
      const secQs    = sectionMap[secName];
      const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
      const brk      = sub.scoreBreakdown || [];
      const secScore = brk
        .filter(b => secQs.find(q => q.id === b.questionId))
        .reduce((a, b) => a + (b.score || 0), 0);
      const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '—';
      return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
    });
    scoreDetailRows.push([
      'TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length),
    ]);

    autoTable(doc, {
      startY: cy,
      head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
      body: scoreDetailRows,
      styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
      headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center', fontStyle: 'bold' },
        3: { halign: 'center' },
      },
      didParseCell: data => {
        if (data.section === 'body' && data.row.index === scoreDetailRows.length - 1)
          data.cell.styles.fontStyle = 'bold';
      },
      alternateRowStyles: { fillColor: C.tblAlt },
      margin: { left: 10, right: 10 }, theme: 'grid',
    });
    cy = doc.lastAutoTable.finalY + 4;

    // ── Weekly Assessment Metrics
    if (cy < 240) {
      cy = sectionHeading('Weekly Assessment Metrics:', cy);
      const practiceWeeklyPct = practiceAttempts !== null
        ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
        : null;
      const weeklyAssessPct = weeklyAttempts !== null
        ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
        : null;

      autoTable(doc, {
        startY: cy,
        head: [['Sno', 'For', 'Rating', 'Feedback']],
        body: [
          ['1', 'Practice Assessments', ratingStr(practiceWeeklyPct), feedbackLabel(practiceWeeklyPct)],
          ['2', 'Weekly Assessments',   ratingStr(weeklyAssessPct),   feedbackLabel(weeklyAssessPct)],
        ],
        headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
        ...tableStyle,
      });
      cy = doc.lastAutoTable.finalY + 4;
    }

    // ── Proctoring violations note
    const viols = sub.violations ?? 0;
    if (viols > 0 && cy < 270) {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.red);
      doc.text(
        `! WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`,
        10, cy,
      );
      doc.setTextColor(...C.dark);
      doc.setFont('helvetica', 'normal');
    }
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
  doc.save(`StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
}