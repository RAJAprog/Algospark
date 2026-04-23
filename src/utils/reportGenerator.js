
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // const C = {
// //   primary:  [26,  115, 232],
// //   accent:   [124, 77,  255],
// //   dark:     [15,  23,  42],
// //   mid:      [71,  85,  105],
// //   light:    [241, 245, 249],
// //   white:    [255, 255, 255],
// //   green:    [16,  185, 129],
// //   red:      [239, 68,  68],
// //   orange:   [245, 158, 11],
// //   blue:     [0,   120, 212],
// //   teal:     [0,   184, 163],
// //   purple:   [124, 77,  255],
// //   tblAlt:   [248, 250, 255],
// // };

// // function feedbackLabel(pct) {
// //   if (pct === null || pct === undefined) return '—';
// //   if (pct >= 95) return 'Exceptional Engagement - Fully Committed!';
// //   if (pct >= 80) return 'Well Prepared';
// //   if (pct >= 65) return 'Needs Effort';
// //   if (pct >= 50) return 'Needs More Effort';
// //   return 'Needs Improvement';
// // }

// // function overallStatus(pct) {
// //   if (pct >= 80) return 'Excellent';
// //   if (pct >= 65) return 'Good';
// //   if (pct >= 50) return 'Average';
// //   return 'Needs Improvement';
// // }

// // function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
// //   const W = doc.internal.pageSize.getWidth();
// //   doc.setFillColor(...C.primary);
// //   doc.rect(0, 0, W, 18, 'F');
// //   doc.setFillColor(...C.accent);
// //   doc.rect(W - 62, 0, 62, 18, 'F');
// //   if (collegeLogoDataUrl) {
// //     try { doc.addImage(collegeLogoDataUrl, 'PNG', 5, 2, 14, 14); } catch {}
// //   }
// //   doc.setTextColor(...C.white);
// //   doc.setFontSize(11);
// //   doc.setFont('helvetica', 'bold');
// //   doc.text('MINDSPARK LEARNING HUB', W - 59, 8.5, { align: 'left' });
// //   doc.setFontSize(6.5);
// //   doc.setFont('helvetica', 'normal');
// //   doc.text('Powered by Mind Spark', W - 59, 13.5, { align: 'left' });
// //   doc.setTextColor(...C.dark);
// // }

// // function drawPageFooter(doc, pageNum, totalPages) {
// //   const W = doc.internal.pageSize.getWidth();
// //   const H = doc.internal.pageSize.getHeight();
// //   doc.setDrawColor(220, 220, 230);
// //   doc.setLineWidth(0.3);
// //   doc.line(10, H - 12, W - 10, H - 12);
// //   doc.setFontSize(7.5);
// //   doc.setTextColor(...C.mid);
// //   doc.setFont('helvetica', 'normal');
// //   doc.text('MINDSPARK LEARNING HUB', 10, H - 6);
// //   doc.text(`${pageNum}`, W / 2, H - 6, { align: 'center' });
// //   doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 6, { align: 'right' });
// // }

// // function drawStatBoxes(doc, stats, y) {
// //   const W = doc.internal.pageSize.getWidth();
// //   const bw = 32, bh = 22, bGap = 3;
// //   const totalW = stats.length * bw + (stats.length - 1) * bGap;
// //   let bx = (W - totalW) / 2;
// //   stats.forEach(({ label, value, color }) => {
// //     doc.setFillColor(...C.light);
// //     doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
// //     doc.setFillColor(...(color || C.primary));
// //     doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');
// //     doc.setFontSize(12);
// //     doc.setFont('helvetica', 'bold');
// //     doc.setTextColor(...(color || C.primary));
// //     doc.text(String(value), bx + bw / 2, y + bh / 2 - 0.5, { align: 'center' });
// //     doc.setFontSize(6);
// //     doc.setFont('helvetica', 'normal');
// //     doc.setTextColor(...C.mid);
// //     doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6.5, { align: 'center' });
// //     bx += bw + bGap;
// //   });
// //   doc.setTextColor(...C.dark);
// //   return y + bh + 4;
// // }

// // function drawBarChart(doc, x, y, w, h, data, title, barColor = C.blue) {
// //   const maxVal = Math.max(...data.map(d => d.value), 1);
// //   if (title) {
// //     doc.setFontSize(8.5);
// //     doc.setFont('helvetica', 'bold');
// //     doc.setTextColor(...C.dark);
// //     doc.text(title, x, y - 3);
// //   }
// //   doc.setFillColor(250, 252, 255);
// //   doc.setDrawColor(220, 225, 235);
// //   doc.setLineWidth(0.3);
// //   doc.rect(x, y, w, h, 'FD');
// //   const n = data.length;
// //   const barW = (w * 0.6) / n;
// //   const gap  = (w * 0.4) / (n + 1);
// //   const axisH = h - 16;
// //   const yBase = y + h - 8;
// //   doc.setDrawColor(210, 215, 225);
// //   doc.setLineWidth(0.2);
// //   [0.25, 0.5, 0.75].forEach(pct => {
// //     const gy = yBase - axisH * pct;
// //     doc.line(x, gy, x + w, gy);
// //     doc.setFontSize(5);
// //     doc.setTextColor(180, 180, 195);
// //     doc.text(String(Math.round(maxVal * pct)), x - 1, gy + 1, { align: 'right' });
// //   });
// //   data.forEach((d, i) => {
// //     const bx  = x + gap + i * (barW + gap);
// //     const bh2 = maxVal > 0 ? (d.value / maxVal) * (axisH - 4) : 0;
// //     const by  = yBase - bh2;
// //     doc.setFillColor(...(d.color || barColor));
// //     if (bh2 > 0) doc.rect(bx, by, barW, bh2, 'F');
// //     if (d.value > 0) {
// //       doc.setFontSize(5.5);
// //       doc.setFont('helvetica', 'bold');
// //       doc.setTextColor(...C.dark);
// //       doc.text(String(d.value), bx + barW / 2, by - 1, { align: 'center' });
// //     }
// //     doc.setFontSize(5);
// //     doc.setFont('helvetica', 'normal');
// //     doc.setTextColor(...C.mid);
// //     const lbl = d.label || '';
// //     const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
// //     lblLines.forEach((l, li) => doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' }));
// //   });
// //   doc.setTextColor(...C.dark);
// //   return y + h + 8;
// // }

// // function drawPieChart(doc, cx, cy, r, data, title) {
// //   doc.setFontSize(8.5);
// //   doc.setFont('helvetica', 'bold');
// //   doc.setTextColor(...C.dark);
// //   if (title) doc.text(title, cx - r, cy - r - 4);
// //   const total = data.reduce((a, d) => a + d.value, 0);
// //   if (total === 0) return;
// //   let startAngle = -Math.PI / 2;
// //   data.forEach(d => {
// //     const sweep = (d.value / total) * 2 * Math.PI;
// //     const steps = Math.max(8, Math.round(sweep * 20));
// //     const pts   = [[cx, cy]];
// //     for (let s = 0; s <= steps; s++) {
// //       const a = startAngle + (s / steps) * sweep;
// //       pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
// //     }
// //     doc.setFillColor(...d.color);
// //     doc.lines(
// //       pts.slice(1).map((p, i) => [p[0] - (i === 0 ? cx : pts[i][0]), p[1] - (i === 0 ? cy : pts[i][1])]),
// //       cx, cy, [1, 1], 'F', true,
// //     );
// //     const midAngle = startAngle + sweep / 2;
// //     const lx = cx + Math.cos(midAngle) * r * 0.65;
// //     const ly = cy + Math.sin(midAngle) * r * 0.65;
// //     doc.setFontSize(6);
// //     doc.setFont('helvetica', 'bold');
// //     doc.setTextColor(...C.white);
// //     doc.text(`${((d.value / total) * 100).toFixed(1)}%`, lx, ly, { align: 'center' });
// //     startAngle += sweep;
// //   });
// //   let lx = cx + r + 6, ly = cy - r / 2;
// //   data.forEach((d, i) => {
// //     doc.setFillColor(...d.color);
// //     doc.rect(lx, ly + i * 9 - 2, 6, 5, 'F');
// //     doc.setFontSize(6.5);
// //     doc.setFont('helvetica', 'normal');
// //     doc.setTextColor(...C.dark);
// //     doc.text(`${d.label} (${((d.value / total) * 100).toFixed(1)}%)`, lx + 8, ly + i * 9 + 2);
// //   });
// //   doc.setTextColor(...C.dark);
// // }

// // const RANGES = [
// //   { label: '90-100%', min: 90, max: 101 },
// //   { label: '80-90%',  min: 80, max: 90  },
// //   { label: '70-80%',  min: 70, max: 80  },
// //   { label: '60-70%',  min: 60, max: 70  },
// //   { label: '50-60%',  min: 50, max: 60  },
// //   { label: '40-50%',  min: 40, max: 50  },
// //   { label: '30-40%',  min: 30, max: 40  },
// //   { label: '20-30%',  min: 20, max: 30  },
// //   { label: '10-20%',  min: 10, max: 20  },
// //   { label: '0-10%',   min: 0,  max: 10  },
// // ];

// // function scoreDistribution(submissions, maxPossible) {
// //   return RANGES.map(r => ({
// //     label: r.label,
// //     value: submissions.filter(s => {
// //       const pct = ((s.totalScore ?? 0) / maxPossible) * 100;
// //       return pct >= r.min && pct < r.max;
// //     }).length,
// //   }));
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // OVERALL REPORT
// // // ─────────────────────────────────────────────────────────────────────────────
// // export function generateOverallReport({
// //   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// // }) {
// //   const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
// //   const W   = doc.internal.pageSize.getWidth();

// //   const total       = submissions.length;
// //   const completed   = submissions.filter(s => s.status === 'completed').length;
// //   const scores      = submissions.map(s => s.totalScore ?? 0);
// //   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
// //   const maxScore    = total > 0 ? Math.max(...scores) : 0;
// //   const minScore    = total > 0 ? Math.min(...scores.filter(s => s > 0)) : 0;
// //   const avgScore    = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
// //   const qualified   = submissions.filter(s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40).length;
// //   const highestPct  = maxPossible > 0 ? `${((maxScore / maxPossible) * 100).toFixed(3)}%` : '0.000%';

// //   // ── Department grouping — use branch (from ExamDetailsForm), fallback chain
// //   const deptMap = {};
// //   submissions.forEach(s => {
// //     const dept = s.branch || s.department || s.section || 'Unknown';
// //     if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
// //     deptMap[dept].attempted++;
// //     deptMap[dept].scores.push(s.totalScore ?? 0);
// //   });
// //   const deptRegistered = exam?.deptRegistered || {};
// //   const deptKeys = Object.keys(deptMap);

// //   // PAGE 1
// //   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
// //   doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //   doc.text('MINDSPARK LEARNING HUB-ENTIRE REPORT', W / 2, 27, { align: 'center' });
// //   doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
// //   const dayLabel = exam?.dayNumber ? `Consolidated Report on Day ${exam.dayNumber}` : 'Consolidated Report';
// //   doc.text(dayLabel, W / 2, 33, { align: 'center' });
// //   doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //   doc.text(examTitle || 'Grand Test', W / 2, 40, { align: 'center' });

// //   let cy = drawStatBoxes(doc, [
// //     { label: 'Total Attempts',    value: total,             color: C.primary },
// //     { label: 'Completed',         value: completed,         color: C.green   },
// //     { label: 'Qualified',         value: qualified,         color: C.accent  },
// //     { label: 'Not Qualified',     value: total - qualified, color: C.red     },
// //     { label: 'Qualified Highest', value: highestPct,        color: C.teal    },
// //   ], 46);
// //   cy += 4;

// //   // Attendance dept table
// //   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //   doc.text('Attendance by Branch', 14, cy + 4); cy += 8;

// //   if (deptKeys.length) {
// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
// //       body: deptKeys.map(dept => {
// //         const attempted   = deptMap[dept].attempted;
// //         const registered  = deptRegistered[dept] || attempted;
// //         return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
// //       }),
// //       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
// //       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
// //       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 14, right: 14 }, theme: 'grid',
// //     });
// //     cy = doc.lastAutoTable.finalY + 6;
// //   }

// //   // Dept performance
// //   if (deptKeys.length) {
// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
// //       body: deptKeys.map(dept => {
// //         const s   = deptMap[dept].scores;
// //         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
// //         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
// //         return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
// //       }),
// //       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
// //       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
// //       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 14, right: 14 }, theme: 'grid',
// //     });
// //     cy = doc.lastAutoTable.finalY + 6;
// //   }

// //   // Section-wise performance (filter by branch if needed)
// //   const sectionStudentMap = {};
// //   submissions.forEach(s => {
// //     const sec = s.section || '—';
// //     if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
// //     sectionStudentMap[sec].attempted++;
// //     sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
// //   });
// //   const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '—');
// //   if (secKeys.length > 1) {
// //     doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //     doc.text('Attendance by Section', 14, cy + 4); cy += 8;
// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
// //       body: secKeys.map(sec => {
// //         const s   = sectionStudentMap[sec].scores;
// //         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
// //         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
// //         return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
// //       }),
// //       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
// //       headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
// //       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 14, right: 14 }, theme: 'grid',
// //     });
// //     cy = doc.lastAutoTable.finalY + 6;
// //   }

// //   // PAGE 2: Assessment info + section breakdown
// //   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

// //   const sectionBreakdown = {};
// //   questions.forEach(q => {
// //     const key = q.sectionName || q.section || q.category
// //       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
// //     if (!sectionBreakdown[key]) sectionBreakdown[key] = { count: 0, marks: 0, questions: [] };
// //     sectionBreakdown[key].count++;
// //     sectionBreakdown[key].marks += q.marks || 0;
// //     sectionBreakdown[key].questions.push(q);
// //   });

// //   const notAttemptedTotal = (exam?.registeredStudents?.length || 0) - total;

// //   autoTable(doc, {
// //     startY: cy,
// //     head: [['NAME', 'VALUE']],
// //     body: [
// //       ['Assessment Name',    examTitle || '—'],
// //       ['Questions Count',    String(questions.length)],
// //       ['Students Attempted', String(total)],
// //       ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
// //       ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
// //       ['Highest Percentage', highestPct],
// //       ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
// //     ],
// //     styles: { fontSize: 8.5, cellPadding: 3 },
// //     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
// //     columnStyles: { 0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55 } },
// //     margin: { left: 14, right: 14 }, theme: 'grid',
// //   });
// //   cy = doc.lastAutoTable.finalY + 6;

// //   if (Object.keys(sectionBreakdown).length) {
// //     const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
// //     secBody.push(['Total', String(questions.length), String(maxPossible)]);
// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
// //       body: secBody,
// //       styles: { fontSize: 8.5, cellPadding: 3, halign: 'center' },
// //       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
// //       columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
// //       didParseCell: data => {
// //         if (data.section === 'body' && data.row.index === secBody.length - 1)
// //           data.cell.styles.fontStyle = 'bold';
// //       },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 14, right: 14 }, theme: 'grid',
// //     });
// //     cy = doc.lastAutoTable.finalY + 6;
// //   }

// //   // PAGE 3: Charts
// //   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;

// //   if (deptKeys.length) {
// //     drawPieChart(doc, 38, cy + 28, 22, [
// //       { label: 'Attempted',     value: total,                          color: C.green     },
// //       { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [220,220,230] },
// //     ], 'Attendance');
// //     cy += 68;
// //   }

// //   const overallDist = scoreDistribution(submissions, maxPossible).reverse();
// //   cy = drawBarChart(doc, 14, cy, W - 28, 50,
// //     overallDist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
// //     'Overall Performance Student Distribution', C.blue);

// //   Object.entries(sectionBreakdown).forEach(([secName, secData]) => {
// //     const secMax    = secData.marks || 1;
// //     const secScores = submissions.map(s => {
// //       const brk      = s.scoreBreakdown || [];
// //       const secScore = brk
// //         .filter(b => secData.questions.find(q => q.id === b.questionId))
// //         .reduce((a, b2) => a + (b2.score || 0), 0);
// //       return { totalScore: secScore };
// //     });
// //     const dist = scoreDistribution(secScores, secMax).reverse();
// //     if (cy > 210) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }
// //     cy = drawBarChart(doc, 14, cy, W - 28, 48,
// //       dist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
// //       `${secName} Performance Student Distribution`, C.blue);
// //   });

// //   // PAGE 4: Top / Bottom / Full table
// //   doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24;
// //   const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
// //   const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

// //   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //   doc.text('Top Students', 14, cy); cy += 3;
// //   autoTable(doc, {
// //     startY: cy,
// //     head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
// //     body: sorted.slice(0, 10).map(s => [
// //       s.studentName  || '—',
// //       s.studentRegNo || '—',
// //       s.branch       || s.department || '—',
// //       s.section      || '—',
// //       maxPossible > 0
// //         ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
// //         : '0.00%',
// //     ]),
// //     styles: { fontSize: 7.5, cellPadding: 2.5 },
// //     headStyles: { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
// //     columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
// //     alternateRowStyles: { fillColor: C.tblAlt },
// //     margin: { left: 14, right: 14 }, theme: 'grid',
// //   });
// //   cy = doc.lastAutoTable.finalY + 8;

// //   doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //   doc.text('Bottom Students', 14, cy); cy += 3;
// //   autoTable(doc, {
// //     startY: cy,
// //     head: [['NAME', 'REGD', 'BRANCH', 'SECTION', 'PERCENTAGE']],
// //     body: bottom.slice(0, 9).map(s => [
// //       s.studentName  || '—',
// //       s.studentRegNo || '—',
// //       s.branch       || s.department || '—',
// //       s.section      || '—',
// //       maxPossible > 0
// //         ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
// //         : '0.00%',
// //     ]),
// //     styles: { fontSize: 7.5, cellPadding: 2.5 },
// //     headStyles: { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
// //     columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
// //     alternateRowStyles: { fillColor: C.tblAlt },
// //     margin: { left: 14, right: 14 }, theme: 'grid',
// //   });
// //   cy = doc.lastAutoTable.finalY + 8;

// //   if (cy > 200) { doc.addPage(); drawPageHeader(doc, collegeLogoDataUrl, collegeName); cy = 24; }

// //   const secNames = Object.keys(sectionBreakdown);
// //   autoTable(doc, {
// //     startY: cy,
// //     head: [['#', 'Name', 'Regd', 'Branch', 'Sec', ...secNames, 'Total', '%', 'Violations']],
// //     body: sorted.map((s, i) => {
// //       const brk = s.scoreBreakdown || [];
// //       const secScores = secNames.map(secName => {
// //         const secQs    = sectionBreakdown[secName].questions;
// //         const secScore = brk
// //           .filter(b => secQs.find(q => q.id === b.questionId))
// //           .reduce((a, b2) => a + (b2.score || 0), 0);
// //         return String(secScore);
// //       });
// //       return [
// //         `${i + 1}`,
// //         s.studentName  || '—',
// //         s.studentRegNo || '—',
// //         s.branch       || s.department || '—',
// //         s.section      || '—',
// //         ...secScores,
// //         String(s.totalScore ?? 0),
// //         maxPossible > 0
// //           ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%`
// //           : '0.0%',
// //         String(s.violations ?? 0),
// //       ];
// //     }),
// //     styles: { fontSize: 7, cellPadding: 2 },
// //     headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 7 },
// //     columnStyles: {
// //       0: { cellWidth: 8 },
// //       [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold' },
// //       [5 + secNames.length + 1]: { halign: 'center' },
// //       [5 + secNames.length + 2]: { halign: 'center' },
// //     },
// //     margin: { left: 10, right: 10 }, theme: 'striped',
// //     didParseCell: data => {
// //       const totalColIdx = 5 + secNames.length;
// //       if (data.section === 'body' && data.column.index === totalColIdx) {
// //         const score = parseInt(data.row.raw[totalColIdx]);
// //         const pct   = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
// //         if      (pct >= 80) data.cell.styles.textColor = C.green;
// //         else if (pct >= 40) data.cell.styles.textColor = C.orange;
// //         else                data.cell.styles.textColor = C.red;
// //       }
// //     },
// //   });

// //   const totalPages = doc.internal.getNumberOfPages();
// //   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
// //   doc.save(`Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// // }

// // // ─────────────────────────────────────────────────────────────────────────────
// // // STUDENT-WISE REPORT
// // // ─────────────────────────────────────────────────────────────────────────────
// // export function generateStudentWiseReport({
// //   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
// // }) {
// //   if (!submissions.length) { alert('No submissions to generate report for.'); return; }

// //   const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
// //   const W           = doc.internal.pageSize.getWidth();
// //   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
// //   const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

// //   const sectionMap = {};
// //   questions.forEach(q => {
// //     const key = q.sectionName || q.section || q.category
// //       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
// //     if (!sectionMap[key]) sectionMap[key] = [];
// //     sectionMap[key].push(q);
// //   });
// //   const allSectionNames = Object.keys(sectionMap);

// //   const mcqQs    = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
// //   const codingQs = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
// //   const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
// //   const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

// //   const getSectionPct = (sub, secName) => {
// //     const secQs = sectionMap[secName];
// //     if (!secQs || secQs.length === 0) return null;
// //     const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
// //     if (secMax === 0) return null;
// //     const brk      = sub.scoreBreakdown || [];
// //     const secScore = brk
// //       .filter(b => secQs.find(q => q.id === b.questionId))
// //       .reduce((a, b) => a + (b.score || 0), 0);
// //     return Math.round((secScore / secMax) * 100);
// //   };

// //   const ratingStr = pct => (pct !== null && pct !== undefined ? `${pct}%` : '—');

// //   sorted.forEach((sub, idx) => {
// //     if (idx > 0) doc.addPage();
// //     drawPageHeader(doc, collegeLogoDataUrl, collegeName);

// //     const score  = sub.totalScore ?? 0;
// //     const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
// //     const pctStr = `${pct.toFixed(0)}%`;
// //     const status = overallStatus(pct);
// //     const passed = pct >= 40;

// //     doc.setFillColor(...C.light);
// //     doc.roundedRect(10, 22, W - 20, 36, 3, 3, 'F');
// //     doc.setFillColor(...C.primary);
// //     doc.roundedRect(10, 22, 4, 36, 2, 2, 'F');

// //     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.dark);
// //     doc.text('Student Performance Report', W / 2, 28, { align: 'center' });

// //     doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
// //     [
// //       ['Student Name:',   sub.studentName  || '—'],
// //       ['Student ID:',     sub.studentRegNo || sub.studentId || '—'],
// //       ['Overall Status:', status],
// //     ].forEach(([lbl, val], i) => {
// //       doc.setFont('helvetica', 'bold');   doc.text(lbl, 17, 35 + i * 6);
// //       doc.setFont('helvetica', 'normal'); doc.text(val, 50, 35 + i * 6);
// //     });
// //     [
// //       ['Branch:',             sub.branch  || sub.department || '—'],
// //       ['Section / Batch:',    sub.section || exam?.batch    || '—'],
// //       ['Evaluation Period:',  examTitle   || '—'],
// //     ].forEach(([lbl, val], i) => {
// //       const x = i < 2 ? W / 2 + 5 : W / 2 + 5;
// //       const y = i < 2 ? 35 + i * 6 : 47;
// //       doc.setFont('helvetica', 'bold');   doc.text(lbl, x, y);
// //       doc.setFont('helvetica', 'normal'); doc.text(val, x + 36, y);
// //     });

// //     doc.setFillColor(...(passed ? C.green : C.red));
// //     doc.roundedRect(W - 36, 23, 24, 14, 3, 3, 'F');
// //     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
// //     doc.text(pctStr, W - 24, 31, { align: 'center' });
// //     doc.setFontSize(6); doc.setFont('helvetica', 'normal');
// //     doc.text('Overall', W - 24, 35, { align: 'center' });
// //     doc.setTextColor(...C.dark);

// //     let cy = 63;

// //     const sectionHeading = (title, yPos) => {
// //       doc.setFillColor(...C.primary);
// //       doc.rect(10, yPos, W - 20, 6, 'F');
// //       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
// //       doc.text(title, 14, yPos + 4);
// //       doc.setTextColor(...C.dark);
// //       return yPos + 8;
// //     };

// //     const colorCell = (data) => {
// //       if (data.section === 'body' && data.column.index === 2) {
// //         const raw = data.cell.raw;
// //         if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
// //         const v = parseInt(raw);
// //         if      (v >= 80) data.cell.styles.textColor = C.green;
// //         else if (v >= 50) data.cell.styles.textColor = C.orange;
// //         else              data.cell.styles.textColor = C.red;
// //       }
// //     };

// //     const tableStyle = {
// //       styles: { fontSize: 8, cellPadding: 2.5 },
// //       columnStyles: {
// //         0: { cellWidth: 10, halign: 'center' },
// //         1: { cellWidth: 65 },
// //         2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
// //         3: { cellWidth: 85 },
// //       },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 10, right: 10 },
// //       theme: 'grid',
// //       didParseCell: colorCell,
// //     };

// //     // ── Overall Performance
// //     cy = sectionHeading('Overall Performance', cy);
// //     doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
// //     doc.text(`Overall Performance: ${pctStr}`, 14, cy + 4);
// //     const pbW = W - 28;
// //     doc.setFillColor(220, 225, 235);
// //     doc.roundedRect(14, cy + 7, pbW, 4, 2, 2, 'F');
// //     doc.setFillColor(...(passed ? C.green : C.red));
// //     doc.roundedRect(14, cy + 7, pbW * Math.min(1, pct / 100), 4, 2, 2, 'F');
// //     doc.setTextColor(...C.dark);
// //     cy += 16;

// //     // ── Participation Metrics
// //     cy = sectionHeading('Participation Metrics:', cy);

// //     const totalExamsAssigned  = sub.totalExamsAssigned ?? 1;
// //     const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
// //     const overallParticipationPct = totalExamsAssigned > 0
// //       ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100)
// //       : null;

// //     const practiceAttempts = sub.practiceAttempts ?? sub.practiceCount ?? null;
// //     const weeklyAttempts   = sub.weeklyAttempts   ?? sub.weeklyCount   ?? null;

// //     const participationRows = [
// //       ['Overall Assessment',            overallParticipationPct],
// //       ['Placement Readiness',           Math.round(pct)],
// //       ['Practice Assessments - Weekly', practiceAttempts !== null
// //         ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
// //         : null],
// //       ['Assessments - Weekly', weeklyAttempts !== null
// //         ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
// //         : null],
// //     ];

// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['Sno', 'For', 'Rating', 'Feedback']],
// //       body: participationRows.map(([label, rPct], i) => [
// //         String(i + 1), label, ratingStr(rPct), feedbackLabel(rPct),
// //       ]),
// //       headStyles: { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
// //       ...tableStyle,
// //     });
// //     cy = doc.lastAutoTable.finalY + 5;

// //     // ── Performance Metrics
// //     cy = sectionHeading('Performance Metrics:', cy);

// //     const mcqPct    = mcqMax    > 0 ? Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100) : null;
// //     const codingPct = codingMax > 0 ? Math.round(((sub.codingScore ?? 0) / codingMax) * 100) : null;

// //     const perfRows = allSectionNames.map((secName, i) => {
// //       const pctVal = getSectionPct(sub, secName);
// //       return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
// //     });

// //     if (mcqMax > 0 && codingMax > 0) {
// //       perfRows.push(['—', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
// //       perfRows.push(['—', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
// //     }

// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
// //       body: perfRows,
// //       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
// //       ...tableStyle,
// //     });
// //     cy = doc.lastAutoTable.finalY + 5;

// //     // ── Section Score Details
// //     cy = sectionHeading('Section Score Details:', cy);
// //     const scoreDetailRows = allSectionNames.map(secName => {
// //       const secQs    = sectionMap[secName];
// //       const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
// //       const brk      = sub.scoreBreakdown || [];
// //       const secScore = brk
// //         .filter(b => secQs.find(q => q.id === b.questionId))
// //         .reduce((a, b) => a + (b.score || 0), 0);
// //       const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '—';
// //       return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
// //     });
// //     scoreDetailRows.push([
// //       'TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length),
// //     ]);

// //     autoTable(doc, {
// //       startY: cy,
// //       head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
// //       body: scoreDetailRows,
// //       styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
// //       headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
// //       columnStyles: {
// //         0: { halign: 'left', fontStyle: 'bold' },
// //         1: { halign: 'center' },
// //         2: { halign: 'center', fontStyle: 'bold' },
// //         3: { halign: 'center' },
// //       },
// //       didParseCell: data => {
// //         if (data.section === 'body' && data.row.index === scoreDetailRows.length - 1)
// //           data.cell.styles.fontStyle = 'bold';
// //       },
// //       alternateRowStyles: { fillColor: C.tblAlt },
// //       margin: { left: 10, right: 10 }, theme: 'grid',
// //     });
// //     cy = doc.lastAutoTable.finalY + 4;

// //     // ── Weekly Assessment Metrics
// //     if (cy < 240) {
// //       cy = sectionHeading('Weekly Assessment Metrics:', cy);
// //       const practiceWeeklyPct = practiceAttempts !== null
// //         ? Math.min(100, Math.round((practiceAttempts / Math.max(practiceAttempts, 10)) * 100))
// //         : null;
// //       const weeklyAssessPct = weeklyAttempts !== null
// //         ? Math.min(100, Math.round((weeklyAttempts / Math.max(weeklyAttempts, 10)) * 100))
// //         : null;

// //       autoTable(doc, {
// //         startY: cy,
// //         head: [['Sno', 'For', 'Rating', 'Feedback']],
// //         body: [
// //           ['1', 'Practice Assessments', ratingStr(practiceWeeklyPct), feedbackLabel(practiceWeeklyPct)],
// //           ['2', 'Weekly Assessments',   ratingStr(weeklyAssessPct),   feedbackLabel(weeklyAssessPct)],
// //         ],
// //         headStyles: { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
// //         ...tableStyle,
// //       });
// //       cy = doc.lastAutoTable.finalY + 4;
// //     }

// //     // ── Proctoring violations note
// //     const viols = sub.violations ?? 0;
// //     if (viols > 0 && cy < 270) {
// //       doc.setFontSize(7.5);
// //       doc.setFont('helvetica', 'bold');
// //       doc.setTextColor(...C.red);
// //       doc.text(
// //         `! WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`,
// //         10, cy,
// //       );
// //       doc.setTextColor(...C.dark);
// //       doc.setFont('helvetica', 'normal');
// //     }
// //   });

// //   const totalPages = doc.internal.getNumberOfPages();
// //   for (let i = 1; i <= totalPages; i++) { doc.setPage(i); drawPageFooter(doc, i, totalPages); }
// //   doc.save(`StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// // }




















// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // ─────────────────────────────────────────────────────────────────────────────
// // COLOUR PALETTE
// // ─────────────────────────────────────────────────────────────────────────────
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

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
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

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE HEADER
// // Layout:
// //   Left  → college logo + college name (if provided)
// //   Centre→ platform title bar (blue strip)
// //   Right → AlgoSpark logo/name (accent strip)
// // ─────────────────────────────────────────────────────────────────────────────
// function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
//   const W = doc.internal.pageSize.getWidth();

//   // Full-width blue bar
//   doc.setFillColor(...C.primary);
//   doc.rect(0, 0, W, 18, 'F');

//   // Right accent block for platform name
//   doc.setFillColor(...C.accent);
//   doc.rect(W - 54, 0, 54, 18, 'F');

//   // ── College logo — top-right corner inside accent block ──
//   if (collegeLogoDataUrl) {
//     try {
//       // Place logo at top-right, inside the accent strip
//       doc.addImage(collegeLogoDataUrl, 'PNG', W - 52, 1, 14, 14);
//     } catch (e) {
//       console.warn('College logo render failed:', e);
//     }
//   }

//   // College name beneath logo (white, small)
//   if (collegeName) {
//     doc.setTextColor(...C.white);
//     doc.setFontSize(5.5);
//     doc.setFont('helvetica', 'bold');
//     // Truncate long names
//     const shortName = collegeName.length > 18 ? collegeName.slice(0, 16) + '…' : collegeName;
//     doc.text(shortName, W - 44, 15.5, { align: 'left' });
//   }

//   // Platform name — AlgoSpark — left part of accent strip (after logo space)
//   doc.setTextColor(...C.white);
//   doc.setFontSize(8.5);
//   doc.setFont('helvetica', 'bold');
//   doc.text('AlgoSpark', W - 52, 8, { align: 'left' });
//   doc.setFontSize(5.5);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Learning Hub', W - 52, 13, { align: 'left' });

//   doc.setTextColor(...C.dark);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE FOOTER
// // ─────────────────────────────────────────────────────────────────────────────
// function drawPageFooter(doc, pageNum, totalPages) {
//   const W = doc.internal.pageSize.getWidth();
//   const H = doc.internal.pageSize.getHeight();
//   doc.setDrawColor(220, 220, 230);
//   doc.setLineWidth(0.3);
//   doc.line(10, H - 12, W - 10, H - 12);
//   doc.setFontSize(7.5);
//   doc.setTextColor(...C.mid);
//   doc.setFont('helvetica', 'normal');
//   doc.text('AlgoSpark Learning Hub', 10, H - 6);
//   doc.text(`${pageNum} / ${totalPages}`, W / 2, H - 6, { align: 'center' });
//   doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 6, { align: 'right' });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STAT BOXES ROW
// // ─────────────────────────────────────────────────────────────────────────────
// function drawStatBoxes(doc, stats, y) {
//   const W  = doc.internal.pageSize.getWidth();
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

// // ─────────────────────────────────────────────────────────────────────────────
// // BAR CHART
// // ─────────────────────────────────────────────────────────────────────────────
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

//   const n     = data.length;
//   const barW  = (w * 0.6) / n;
//   const gap   = (w * 0.4) / (n + 1);
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
//     const lbl      = d.label || '';
//     const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
//     lblLines.forEach((l, li) =>
//       doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' })
//     );
//   });

//   doc.setTextColor(...C.dark);
//   return y + h + 8;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PIE CHART
// // ─────────────────────────────────────────────────────────────────────────────
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
//       pts.slice(1).map((p, i) => [
//         p[0] - (i === 0 ? cx : pts[i][0]),
//         p[1] - (i === 0 ? cy : pts[i][1]),
//       ]),
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
//     doc.text(
//       `${d.label} (${((d.value / total) * 100).toFixed(1)}%)`,
//       lx + 8, ly + i * 9 + 2,
//     );
//   });
//   doc.setTextColor(...C.dark);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SCORE DISTRIBUTION RANGES
// // ─────────────────────────────────────────────────────────────────────────────
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
// /**
//  * @param {object} params
//  * @param {string}   params.examTitle
//  * @param {object}   params.exam            – Firestore exam document
//  * @param {object[]} params.submissions      – Firestore submission documents
//  * @param {object[]} params.questions        – Firestore question documents
//  * @param {string}   params.collegeName      – College display name
//  * @param {string}   params.collegeLogoDataUrl – Base-64 data URL of college logo
//  */
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
//   const qualified   = submissions.filter(
//     s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40
//   ).length;
//   const highestPct  = maxPossible > 0
//     ? `${((maxScore / maxPossible) * 100).toFixed(3)}%`
//     : '0.000%';

//   // Department grouping — branch field (set by ExamDetailsForm), fallback chain
//   const deptMap = {};
//   submissions.forEach(s => {
//     const dept = s.branch || s.department || s.section || 'Unknown';
//     if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
//     deptMap[dept].attempted++;
//     deptMap[dept].scores.push(s.totalScore ?? 0);
//   });
//   const deptRegistered = exam?.deptRegistered || {};
//   const deptKeys       = Object.keys(deptMap);

//   // ── PAGE 1: Summary stats ──────────────────────────────────────────────────
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);

//   doc.setFontSize(13);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text('ALGOSPARK LEARNING HUB — OVERALL REPORT', W / 2, 27, { align: 'center' });

//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...C.mid);
//   const dayLabel = exam?.dayNumber
//     ? `Consolidated Report on Day ${exam.dayNumber}`
//     : 'Consolidated Report';
//   doc.text(dayLabel, W / 2, 33, { align: 'center' });

//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text(examTitle || 'Grand Test', W / 2, 40, { align: 'center' });

//   let cy = drawStatBoxes(doc, [
//     { label: 'Total Attempts',    value: total,             color: C.primary },
//     { label: 'Completed',         value: completed,         color: C.green   },
//     { label: 'Qualified',         value: qualified,         color: C.accent  },
//     { label: 'Not Qualified',     value: total - qualified, color: C.red     },
//     { label: 'Highest %',         value: highestPct,        color: C.teal    },
//   ], 46);
//   cy += 4;

//   // Attendance by branch
//   doc.setFontSize(9);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text('Attendance by Branch', 14, cy + 4);
//   cy += 8;

//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
//       body: deptKeys.map(dept => {
//         const attempted  = deptMap[dept].attempted;
//         const registered = deptRegistered[dept] || attempted;
//         return [
//           dept,
//           String(attempted),
//           String(Math.max(0, registered - attempted)),
//           String(registered),
//         ];
//       }),
//       styles:            { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles:        { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles:      { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles:{ fillColor: C.tblAlt },
//       margin:            { left: 14, right: 14 },
//       theme:             'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // Department performance
//   if (deptKeys.length) {
//     autoTable(doc, {
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: deptKeys.map(dept => {
//         const s   = deptMap[dept].scores;
//         const avg = s.length
//           ? Math.round(s.reduce((a, b) => a + b, 0) / s.length)
//           : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
//       }),
//       styles:            { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles:        { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles:      { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles:{ fillColor: C.tblAlt },
//       margin:            { left: 14, right: 14 },
//       theme:             'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // Section-wise attendance (only when >1 real section)
//   const sectionStudentMap = {};
//   submissions.forEach(s => {
//     const sec = s.section || '—';
//     if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
//     sectionStudentMap[sec].attempted++;
//     sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
//   });
//   const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '—');
//   if (secKeys.length > 1) {
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text('Attendance by Section', 14, cy + 4);
//     cy += 8;
//     autoTable(doc, {
//       startY: cy,
//       head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: secKeys.map(sec => {
//         const s   = sectionStudentMap[sec].scores;
//         const avg = s.length
//           ? Math.round(s.reduce((a, b) => a + b, 0) / s.length)
//           : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
//       }),
//       styles:            { fontSize: 8, cellPadding: 2.5, halign: 'center' },
//       headStyles:        { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//       columnStyles:      { 0: { halign: 'left', fontStyle: 'bold' } },
//       alternateRowStyles:{ fillColor: C.tblAlt },
//       margin:            { left: 14, right: 14 },
//       theme:             'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // ── PAGE 2: Assessment info + section breakdown ────────────────────────────
//   doc.addPage();
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//   cy = 24;

//   const sectionBreakdown = {};
//   questions.forEach(q => {
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
//       ['Platform',           'AlgoSpark Learning Hub'],
//       ['Questions Count',    String(questions.length)],
//       ['Students Attempted', String(total)],
//       ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
//       ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
//       ['Highest Percentage', highestPct],
//       ['Lowest Percentage',  total > 0
//         ? `${((minScore / maxPossible) * 100).toFixed(0)}%`
//         : '0%'],
//       ['Average Score',      `${avgScore} / ${maxPossible}`],
//     ],
//     styles:        { fontSize: 8.5, cellPadding: 3 },
//     headStyles:    { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//     columnStyles:  { 0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55 } },
//     margin:        { left: 14, right: 14 },
//     theme:         'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   if (Object.keys(sectionBreakdown).length) {
//     const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [
//       k, String(v.count), String(v.marks),
//     ]);
//     secBody.push(['Total', String(questions.length), String(maxPossible)]);

//     autoTable(doc, {
//       startY: cy,
//       head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
//       body: secBody,
//       styles:            { fontSize: 8.5, cellPadding: 3, halign: 'center' },
//       headStyles:        { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles:      { 0: { halign: 'left', fontStyle: 'bold' } },
//       didParseCell:      data => {
//         if (data.section === 'body' && data.row.index === secBody.length - 1)
//           data.cell.styles.fontStyle = 'bold';
//       },
//       alternateRowStyles:{ fillColor: C.tblAlt },
//       margin:            { left: 14, right: 14 },
//       theme:             'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // ── PAGE 3: Charts ─────────────────────────────────────────────────────────
//   doc.addPage();
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//   cy = 24;

//   if (deptKeys.length) {
//     drawPieChart(doc, 38, cy + 28, 22, [
//       { label: 'Attempted',     value: total,                           color: C.green       },
//       { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal),  color: [220, 220, 230] },
//     ], 'Attendance Overview');
//     cy += 68;
//   }

//   const overallDist = scoreDistribution(submissions, maxPossible).reverse();
//   cy = drawBarChart(
//     doc, 14, cy, W - 28, 50,
//     overallDist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//     'Overall Performance — Student Score Distribution',
//     C.blue,
//   );

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
//     if (cy > 210) {
//       doc.addPage();
//       drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//       cy = 24;
//     }
//     cy = drawBarChart(
//       doc, 14, cy, W - 28, 48,
//       dist.map(d => ({ label: d.label.replace('%', ''), value: d.value })),
//       `${secName} — Student Score Distribution`,
//       C.blue,
//     );
//   });

//   // ── PAGE 4: Top / Bottom / Full ranked table ───────────────────────────────
//   doc.addPage();
//   drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//   cy = 24;

//   const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
//   const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

//   doc.setFontSize(9);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text('Top Students', 14, cy);
//   cy += 3;

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
//     styles:            { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles:        { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
//     columnStyles:      { 4: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles:{ fillColor: C.tblAlt },
//     margin:            { left: 14, right: 14 },
//     theme:             'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   doc.setFontSize(9);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text('Bottom Students', 14, cy);
//   cy += 3;

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
//     styles:            { fontSize: 7.5, cellPadding: 2.5 },
//     headStyles:        { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
//     columnStyles:      { 4: { halign: 'center', fontStyle: 'bold' } },
//     alternateRowStyles:{ fillColor: C.tblAlt },
//     margin:            { left: 14, right: 14 },
//     theme:             'grid',
//   });
//   cy = doc.lastAutoTable.finalY + 8;

//   if (cy > 200) {
//     doc.addPage();
//     drawPageHeader(doc, collegeLogoDataUrl, collegeName);
//     cy = 24;
//   }

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
//     styles:    { fontSize: 7, cellPadding: 2 },
//     headStyles:{ fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 7 },
//     columnStyles: {
//       0: { cellWidth: 8 },
//       [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold' },
//       [5 + secNames.length + 1]: { halign: 'center' },
//       [5 + secNames.length + 2]: { halign: 'center' },
//     },
//     margin: { left: 10, right: 10 },
//     theme:  'striped',
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
//   for (let i = 1; i <= totalPages; i++) {
//     doc.setPage(i);
//     drawPageFooter(doc, i, totalPages);
//   }

//   doc.save(`AlgoSpark_Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STUDENT-WISE REPORT
// //
// // New in this version
// // ───────────────────
// // • Daily / Weekly performance pulled from each submission's
// //   examType field (DAILY | WEEKLY | EXAM) via the `allExams` array.
// // • College logo rendered top-right on every page.
// // • Platform name changed to AlgoSpark throughout.
// //
// // Required extra props
// // ────────────────────
// // allExams       – full list of exam documents from Firestore
// //                  (used to look up examType per submission)
// // allSubmissions – ALL submissions of this student across every exam
// //                  (used to compute daily/weekly totals/averages)
// //                  Pass the same `submissions` array if you only have
// //                  the current exam's data — daily/weekly rows will
// //                  show "—" gracefully.
// // ─────────────────────────────────────────────────────────────────────────────
// /**
//  * @param {object}   params
//  * @param {string}   params.examTitle
//  * @param {object}   params.exam
//  * @param {object[]} params.submissions        – submissions for THIS exam
//  * @param {object[]} params.questions          – questions for THIS exam
//  * @param {string}   params.collegeName
//  * @param {string}   params.collegeLogoDataUrl
//  * @param {object[]} [params.allExams]         – all exam docs (for examType lookup)
//  * @param {object[]} [params.allSubmissions]   – all submissions for each student
//  *                                               across every exam (for daily/weekly agg)
//  */
// export function generateStudentWiseReport({
//   examTitle, exam, submissions, questions, collegeName, collegeLogoDataUrl,
//   allExams = [], allSubmissions = [],
// }) {
//   if (!submissions.length) {
//     alert('No submissions to generate report for.');
//     return;
//   }

//   const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W           = doc.internal.pageSize.getWidth();
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

//   // Section → questions map
//   const sectionMap = {};
//   questions.forEach(q => {
//     const key = q.sectionName || q.section || q.category
//       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
//     if (!sectionMap[key]) sectionMap[key] = [];
//     sectionMap[key].push(q);
//   });
//   const allSectionNames = Object.keys(sectionMap);

//   // MCQ vs Coding max marks
//   const mcqQs     = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
//   const codingQs  = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
//   const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
//   const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

//   // Exam-type lookup helper
//   const examTypeOf = examId => {
//     const found = allExams.find(e => e.id === examId);
//     return found?.examType || found?.type || 'EXAM';
//   };

//   // Per-student cross-exam aggregation helper
//   // Returns { dailyCompleted, dailyAvg, weeklyCompleted, weeklyAvg }
//   const computeCrossExamStats = (studentId) => {
//     const studentSubs = allSubmissions.filter(
//       s => s.studentId === studentId && s.status === 'completed'
//     );
//     const daily  = studentSubs.filter(s => examTypeOf(s.examId) === 'DAILY');
//     const weekly = studentSubs.filter(s => examTypeOf(s.examId) === 'WEEKLY');

//     const avgOf = arr =>
//       arr.length
//         ? Math.round(arr.reduce((a, s) => a + (s.totalScore ?? s.score ?? 0), 0) / arr.length)
//         : 0;

//     return {
//       dailyCompleted:  daily.length,
//       dailyAvg:        avgOf(daily),
//       weeklyCompleted: weekly.length,
//       weeklyAvg:       avgOf(weekly),
//     };
//   };

//   // Section accuracy helper
//   const getSectionPct = (sub, secName) => {
//     const secQs  = sectionMap[secName];
//     if (!secQs || secQs.length === 0) return null;
//     const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//     if (secMax === 0) return null;
//     const brk      = sub.scoreBreakdown || [];
//     const secScore = brk
//       .filter(b => secQs.find(q => q.id === b.questionId))
//       .reduce((a, b) => a + (b.score || 0), 0);
//     return Math.round((secScore / secMax) * 100);
//   };

//   const ratingStr = pct =>
//     pct !== null && pct !== undefined ? `${pct}%` : '—';

//   // ── Shared table style ─────────────────────────────────────────────────────
//   const tableStyle = {
//     styles: { fontSize: 8, cellPadding: 2.5 },
//     columnStyles: {
//       0: { cellWidth: 10, halign: 'center' },
//       1: { cellWidth: 65 },
//       2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
//       3: { cellWidth: 85 },
//     },
//     alternateRowStyles: { fillColor: C.tblAlt },
//     margin: { left: 10, right: 10 },
//     theme:  'grid',
//     didParseCell: (data) => {
//       if (data.section === 'body' && data.column.index === 2) {
//         const raw = data.cell.raw;
//         if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//         const v = parseInt(raw);
//         if      (v >= 80) data.cell.styles.textColor = C.green;
//         else if (v >= 50) data.cell.styles.textColor = C.orange;
//         else              data.cell.styles.textColor = C.red;
//       }
//     },
//   };

//   // ── Render one page per student ────────────────────────────────────────────
//   sorted.forEach((sub, idx) => {
//     if (idx > 0) doc.addPage();
//     drawPageHeader(doc, collegeLogoDataUrl, collegeName);

//     const score  = sub.totalScore ?? 0;
//     const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
//     const pctStr = `${pct.toFixed(0)}%`;
//     const status = overallStatus(pct);
//     const passed = pct >= 40;

//     // Student info banner
//     doc.setFillColor(...C.light);
//     doc.roundedRect(10, 22, W - 20, 36, 3, 3, 'F');
//     doc.setFillColor(...C.primary);
//     doc.roundedRect(10, 22, 4, 36, 2, 2, 'F');

//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text('AlgoSpark — Student Performance Report', W / 2, 28, { align: 'center' });

//     doc.setFontSize(8.5);
//     doc.setTextColor(...C.mid);
//     [
//       ['Student Name:',   sub.studentName  || '—'],
//       ['Student ID:',     sub.studentRegNo || sub.studentId || '—'],
//       ['Overall Status:', status],
//     ].forEach(([lbl, val], i) => {
//       doc.setFont('helvetica', 'bold');   doc.text(lbl, 17, 35 + i * 6);
//       doc.setFont('helvetica', 'normal'); doc.text(val, 52, 35 + i * 6);
//     });

//     [
//       ['Branch:',          sub.branch  || sub.department || '—'],
//       ['Section / Batch:', sub.section || exam?.batch    || '—'],
//       ['Exam:',            examTitle   || '—'],
//     ].forEach(([lbl, val], i) => {
//       const y = i < 3 ? 35 + i * 6 : 47;
//       doc.setFont('helvetica', 'bold');   doc.text(lbl, W / 2 + 5, y);
//       doc.setFont('helvetica', 'normal'); doc.text(val, W / 2 + 38, y);
//     });

//     // Score badge
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(W - 36, 23, 24, 14, 3, 3, 'F');
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.white);
//     doc.text(pctStr, W - 24, 31, { align: 'center' });
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Overall', W - 24, 35, { align: 'center' });
//     doc.setTextColor(...C.dark);

//     let cy = 63;

//     // Section heading helper
//     const sectionHeading = (title, yPos) => {
//       doc.setFillColor(...C.primary);
//       doc.rect(10, yPos, W - 20, 6, 'F');
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...C.white);
//       doc.text(title, 14, yPos + 4);
//       doc.setTextColor(...C.dark);
//       return yPos + 8;
//     };

//     // ── Overall Performance bar ────────────────────────────────────────────
//     cy = sectionHeading('Overall Performance', cy);
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     doc.text(`Score: ${score} / ${maxPossible} (${pctStr})`, 14, cy + 4);
//     const pbW = W - 28;
//     doc.setFillColor(220, 225, 235);
//     doc.roundedRect(14, cy + 7, pbW, 4, 2, 2, 'F');
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(14, cy + 7, pbW * Math.min(1, pct / 100), 4, 2, 2, 'F');
//     doc.setTextColor(...C.dark);
//     cy += 16;

//     // ── Participation Metrics ─────────────────────────────────────────────
//     cy = sectionHeading('Participation Metrics', cy);

//     const totalExamsAssigned  = sub.totalExamsAssigned  ?? 1;
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

//     // ── Performance Metrics (section-wise) ────────────────────────────────
//     cy = sectionHeading('Performance Metrics', cy);

//     const mcqPct    = mcqMax    > 0 ? Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100) : null;
//     const codingPct = codingMax > 0 ? Math.round(((sub.codingScore ?? 0) / codingMax) * 100) : null;

//     const perfRows = allSectionNames.map((secName, i) => {
//       const pctVal = getSectionPct(sub, secName);
//       return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
//     });

//     if (mcqMax > 0 && codingMax > 0) {
//       perfRows.push(['—', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
//       perfRows.push(['—', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
//     }

//     autoTable(doc, {
//       startY: cy,
//       head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
//       body: perfRows,
//       headStyles: { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       ...tableStyle,
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Section Score Details ─────────────────────────────────────────────
//     cy = sectionHeading('Section Score Details', cy);

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
//     scoreDetailRows.push(['TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length)]);

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
//       margin: { left: 10, right: 10 },
//       theme:  'grid',
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     // ── Daily & Weekly Performance (NEW) ──────────────────────────────────
//     if (cy < 245) {
//       cy = sectionHeading('Daily & Weekly Assessment Performance', cy);

//       // Use cross-exam stats when allSubmissions is populated, else fall back
//       // to per-field data stored directly on the submission document
//       const crossStats = allSubmissions.length > 0
//         ? computeCrossExamStats(sub.studentId)
//         : null;

//       const dailyCompleted  = crossStats?.dailyCompleted  ?? sub.dailyCompleted  ?? null;
//       const dailyAvgScore   = crossStats?.dailyAvg        ?? sub.dailyAvgScore   ?? null;
//       const weeklyCompleted = crossStats?.weeklyCompleted ?? sub.weeklyCompleted  ?? null;
//       const weeklyAvgScore  = crossStats?.weeklyAvg       ?? sub.weeklyAvgScore  ?? null;

//       // Convert raw avg scores to percentage (relative to maxPossible of this exam)
//       const toPct = val =>
//         val !== null && val !== undefined && maxPossible > 0
//           ? Math.round((val / maxPossible) * 100)
//           : null;

//       const dailyPct  = typeof dailyAvgScore  === 'number' && dailyAvgScore  > 1
//         ? toPct(dailyAvgScore)
//         : (dailyAvgScore ?? null);
//       const weeklyPct = typeof weeklyAvgScore === 'number' && weeklyAvgScore > 1
//         ? toPct(weeklyAvgScore)
//         : (weeklyAvgScore ?? null);

//       autoTable(doc, {
//         startY: cy,
//         head: [['Sno', 'Assessment Type', 'Completed', 'Avg Score', 'Feedback']],
//         body: [
//           [
//             '1',
//             '📅 Daily Assessments',
//             dailyCompleted !== null ? String(dailyCompleted) : '—',
//             ratingStr(dailyPct),
//             feedbackLabel(dailyPct),
//           ],
//           [
//             '2',
//             '📊 Weekly Assessments',
//             weeklyCompleted !== null ? String(weeklyCompleted) : '—',
//             ratingStr(weeklyPct),
//             feedbackLabel(weeklyPct),
//           ],
//         ],
//         styles: { fontSize: 8, cellPadding: 2.5 },
//         headStyles: { fillColor: C.orange, textColor: C.white, fontStyle: 'bold' },
//         columnStyles: {
//           0: { cellWidth: 10, halign: 'center' },
//           1: { cellWidth: 52 },
//           2: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
//           3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//           4: { cellWidth: 75 },
//         },
//         didParseCell: data => {
//           if (data.section === 'body' && data.column.index === 3) {
//             const raw = data.cell.raw;
//             if (raw === '—') { data.cell.styles.textColor = C.mid; return; }
//             const v = parseInt(raw);
//             if      (v >= 80) data.cell.styles.textColor = C.green;
//             else if (v >= 50) data.cell.styles.textColor = C.orange;
//             else              data.cell.styles.textColor = C.red;
//           }
//         },
//         alternateRowStyles: { fillColor: C.tblAlt },
//         margin: { left: 10, right: 10 },
//         theme:  'grid',
//       });
//       cy = doc.lastAutoTable.finalY + 5;
//     }

//     // ── Weekly Assessment Metrics (practice breakdown) ────────────────────
//     if (cy < 245) {
//       cy = sectionHeading('Weekly Assessment Metrics', cy);

//       const practiceAttempts = sub.practiceAttempts ?? sub.practiceCount ?? null;
//       const weeklyAttempts   = sub.weeklyAttempts   ?? sub.weeklyCount   ?? null;

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

//     // ── Proctoring violation warning ──────────────────────────────────────
//     const viols = sub.violations ?? 0;
//     if (viols > 0 && cy < 270) {
//       doc.setFontSize(7.5);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...C.red);
//       doc.text(
//         `⚠ WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`,
//         10, cy,
//       );
//       doc.setTextColor(...C.dark);
//       doc.setFont('helvetica', 'normal');
//     }
//   });

//   // Paginate footers
//   const totalPages = doc.internal.getNumberOfPages();
//   for (let i = 1; i <= totalPages; i++) {
//     doc.setPage(i);
//     drawPageFooter(doc, i, totalPages);
//   }

//   doc.save(`AlgoSpark_StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
// }


























import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR PALETTE
// ─────────────────────────────────────────────────────────────────────────────
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
  brown:    [180, 100, 10],
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function feedbackLabel(pct) {
  if (pct === null || pct === undefined) return '-';
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

function ratingStr(pct) {
  return (pct !== null && pct !== undefined) ? `${pct}%` : '-';
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH COLLEGE LOGO AS BASE64
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchCollegeLogoBase64(collegeId, db) {
  if (!collegeId || !db) return null;
  try {
    const { doc, getDoc, collection, query, where, getDocs } =
      await import('firebase/firestore');

    let logoUrl = null;

    // Direct document lookup
    const directSnap = await getDoc(doc(db, 'colleges', collegeId));
    if (directSnap.exists()) {
      logoUrl = directSnap.data().logoUrl;
    } else {
      // Fallback: query by name field
      const q    = query(collection(db, 'colleges'), where('name', '==', collegeId));
      const snap = await getDocs(q);
      if (!snap.empty) logoUrl = snap.docs[0].data().logoUrl;
    }

    if (!logoUrl) return null;

    // Try fetch with no-cors fallback
    try {
      const response = await fetch(logoUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('fetch failed');
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader   = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // Fallback: load via Image element (bypasses CORS for display-only)
      return await new Promise((resolve) => {
        const img    = new Image();
        img.crossOrigin = 'anonymous';
        img.onload  = () => {
          const canvas  = document.createElement('canvas');
          canvas.width  = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          try {
            resolve(canvas.toDataURL('image/png'));
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = logoUrl;
      });
    }
  } catch (e) {
    console.warn('fetchCollegeLogoBase64 failed:', e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
//
// Layout (full-width, height 22mm):
//   LEFT  block (primary blue, 0 to W-65): college logo + name + subtitle
//   RIGHT block (accent purple, W-65 to W): AlgoSpark + Powered by MindSpark
// ─────────────────────────────────────────────────────────────────────────────
function drawPageHeader(doc, collegeLogoDataUrl, collegeName) {
  const W       = doc.internal.pageSize.getWidth();
  const HDR_H   = 22;
  const SPLIT   = W - 65;

  // ── Background blocks ────────────────────────────────────────────────────
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, SPLIT, HDR_H, 'F');

  doc.setFillColor(...C.accent);
  doc.rect(SPLIT, 0, W - SPLIT, HDR_H, 'F');

  // ── Left block: college logo ─────────────────────────────────────────────
  const LOGO_X = 5;
  const LOGO_Y = 3;
  const LOGO_W = 16;
  const LOGO_H = 16;

  if (collegeLogoDataUrl && typeof collegeLogoDataUrl === 'string' && collegeLogoDataUrl.startsWith('data:')) {
    try {
      const fmt = collegeLogoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(collegeLogoDataUrl, fmt, LOGO_X, LOGO_Y, LOGO_W, LOGO_H);
    } catch (e) {
      _drawLogoPlaceholder(doc, LOGO_X, LOGO_Y, LOGO_W, LOGO_H, collegeName);
    }
  } else {
    _drawLogoPlaceholder(doc, LOGO_X, LOGO_Y, LOGO_W, LOGO_H, collegeName);
  }

  // ── Left block: college name + subtitle ──────────────────────────────────
  const textX = LOGO_X + LOGO_W + 4;
  doc.setTextColor(...C.white);

  const displayName = collegeName
    ? (collegeName.length > 34 ? collegeName.slice(0, 32) + '...' : collegeName)
    : 'Institution';
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(displayName, textX, 11);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Assessment Report | AlgoSpark Learning Hub', textX, 16.5);

  // ── Right block: AlgoSpark branding ──────────────────────────────────────
  const rightCX = SPLIT + (W - SPLIT) / 2;

  doc.setTextColor(...C.white);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('AlgoSpark', rightCX, 11, { align: 'center' });

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by MindSpark', rightCX, 17, { align: 'center' });

  doc.setTextColor(...C.dark);
}

function _drawLogoPlaceholder(doc, x, y, w, h, collegeName) {
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setTextColor(...C.primary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(
    (collegeName || 'C').charAt(0).toUpperCase(),
    x + w / 2,
    y + h / 2 + 3.5,
    { align: 'center' },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function drawPageFooter(doc, pageNum, totalPages) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  doc.setDrawColor(210, 215, 230);
  doc.setLineWidth(0.3);
  doc.line(10, H - 10, W - 10, H - 10);

  doc.setFontSize(7);
  doc.setTextColor(...C.mid);
  doc.setFont('helvetica', 'normal');
  doc.text('AlgoSpark Learning Hub | Powered by MindSpark', 10, H - 5);
  doc.text(`Page ${pageNum} of ${totalPages}`, W / 2, H - 5, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 5, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT BOXES  (used on overall report cover)
// ─────────────────────────────────────────────────────────────────────────────
function drawStatBoxes(doc, stats, y) {
  const W      = doc.internal.pageSize.getWidth();
  const n      = stats.length;
  const bw     = Math.min(34, (W - 20 - (n - 1) * 3) / n);
  const bh     = 22;
  const bGap   = 3;
  const totalW = n * bw + (n - 1) * bGap;
  let   bx     = (W - totalW) / 2;

  stats.forEach(({ label, value, color }) => {
    doc.setFillColor(...C.light);
    doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
    doc.setFillColor(...(color || C.primary));
    doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(color || C.primary));
    doc.text(String(value), bx + bw / 2, y + bh / 2 - 1, { align: 'center' });

    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6, { align: 'center' });

    bx += bw + bGap;
  });

  doc.setTextColor(...C.dark);
  return y + bh + 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADING STRIP
// ─────────────────────────────────────────────────────────────────────────────
function sectionHeading(doc, title, y, color) {
  const W = doc.internal.pageSize.getWidth();
  color   = color || C.primary;
  doc.setFillColor(...color);
  doc.rect(10, y, W - 20, 6.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text(title, 14, y + 4.5);
  doc.setTextColor(...C.dark);
  return y + 9;
}

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
function drawBarChart(doc, x, y, w, h, data, title, barColor) {
  barColor     = barColor || C.blue;
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

  const n     = data.length;
  const barW  = (w * 0.6) / n;
  const gap   = (w * 0.4) / (n + 1);
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
    const lbl      = (d.label || '').replace('%', '');
    const lblLines = lbl.length > 8 ? [lbl.slice(0, 7), lbl.slice(7)] : [lbl];
    lblLines.forEach((l, li) =>
      doc.text(l, bx + barW / 2, yBase + 4 + li * 4, { align: 'center' })
    );
  });

  doc.setTextColor(...C.dark);
  return y + h + 8;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE CHART
// ─────────────────────────────────────────────────────────────────────────────
function drawPieChart(doc, cx, cy, r, data, title) {
  if (title) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text(title, cx - r, cy - r - 4);
  }
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
      pts.slice(1).map((p, i) => [
        p[0] - (i === 0 ? cx : pts[i][0]),
        p[1] - (i === 0 ? cy : pts[i][1]),
      ]),
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

  let lx = cx + r + 6;
  let ly = cy - r / 2;
  data.forEach((d, i) => {
    doc.setFillColor(...d.color);
    doc.rect(lx, ly + i * 9 - 2, 6, 5, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.dark);
    doc.text(
      `${d.label} (${((d.value / total) * 100).toFixed(1)}%)`,
      lx + 8, ly + i * 9 + 2,
    );
  });
  doc.setTextColor(...C.dark);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE DISTRIBUTION BUCKETS
// ─────────────────────────────────────────────────────────────────────────────
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
// SHARED TABLE CONFIG
// All tables use the same base styles for visual consistency.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_TABLE = {
  styles: {
    fontSize:    8,
    cellPadding: 3,
    valign:      'middle',
    lineColor:   [220, 225, 235],
    lineWidth:   0.2,
  },
  alternateRowStyles: { fillColor: C.tblAlt },
  margin:             { left: 10, right: 10 },
  theme:              'grid',
};

// ── Uniform column definitions ────────────────────────────────────────────────
// Used in ALL student-wise metric tables (Participation, Performance, Daily/Weekly)
// so every table lines up perfectly column-by-column.
const METRIC_COL_WIDTHS = {
  sno:      10,   // column 0: Sno
  for_:     72,   // column 1: For / Section / Assessment Type
  rating:   22,   // column 2: Rating / Avg Score
  feedback: null, // column 3: Feedback (fills remaining space)
};

// Daily/weekly table adds a "Completed" column between for_ and rating
const DW_COL_WIDTHS = {
  sno:       10,
  type:      60,
  completed: 24,
  rating:    22,
  feedback:  null,
};

function metricColumnStyles() {
  return {
    0: { cellWidth: METRIC_COL_WIDTHS.sno,    halign: 'center' },
    1: { cellWidth: METRIC_COL_WIDTHS.for_,   halign: 'left'   },
    2: { cellWidth: METRIC_COL_WIDTHS.rating,  halign: 'center', fontStyle: 'bold' },
    3: { halign: 'left' },
  };
}

function dwColumnStyles() {
  return {
    0: { cellWidth: DW_COL_WIDTHS.sno,       halign: 'center' },
    1: { cellWidth: DW_COL_WIDTHS.type,      halign: 'left'   },
    2: { cellWidth: DW_COL_WIDTHS.completed, halign: 'center' },
    3: { cellWidth: DW_COL_WIDTHS.rating,    halign: 'center', fontStyle: 'bold' },
    4: { halign: 'left' },
  };
}

// Rating colour helper (green / orange / red by value)
function ratingCellColor(data, colIndex) {
  if (data.section === 'body' && data.column.index === colIndex) {
    const raw = String(data.cell.raw ?? '');
    if (!raw || raw === '-') { data.cell.styles.textColor = C.mid; return; }
    const v = parseInt(raw);
    if      (v >= 80) data.cell.styles.textColor = C.green;
    else if (v >= 50) data.cell.styles.textColor = C.orange;
    else              data.cell.styles.textColor = C.red;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERALL REPORT
// ─────────────────────────────────────────────────────────────────────────────
export function generateOverallReport({
  examTitle,
  exam,
  submissions,
  questions,
  collegeName,
  collegeLogoDataUrl,
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
  const qualified   = submissions.filter(
    s => ((s.totalScore ?? 0) / maxPossible) * 100 >= 40
  ).length;
  const highestPct  = maxPossible > 0
    ? `${((maxScore / maxPossible) * 100).toFixed(3)}%`
    : '0.000%';

  // Department grouping
  const deptMap = {};
  submissions.forEach(s => {
    const dept = s.branch || s.department || s.section || 'Unknown';
    if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
    deptMap[dept].attempted++;
    deptMap[dept].scores.push(s.totalScore ?? 0);
  });
  const deptRegistered = exam?.deptRegistered || {};
  const deptKeys       = Object.keys(deptMap);

  // ── PAGE 1 ────────────────────────────────────────────────────────────────
  drawPageHeader(doc, collegeLogoDataUrl, collegeName);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text('ALGOSPARK LEARNING HUB - OVERALL REPORT', W / 2, 30, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mid);
  const dayLabel = exam?.dayNumber
    ? `Consolidated Report - Day ${exam.dayNumber}`
    : 'Consolidated Report';
  doc.text(dayLabel, W / 2, 36, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text(examTitle || 'Grand Test', W / 2, 42, { align: 'center' });

  let cy = drawStatBoxes(doc, [
    { label: 'Total Attempts', value: total,             color: C.primary },
    { label: 'Completed',      value: completed,         color: C.green   },
    { label: 'Qualified',      value: qualified,         color: C.accent  },
    { label: 'Not Qualified',  value: total - qualified, color: C.red     },
    { label: 'Highest %',      value: highestPct,        color: C.teal    },
  ], 48);
  cy += 3;

  cy = sectionHeading(doc, 'Attendance by Branch', cy);
  if (deptKeys.length) {
    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
      body: deptKeys.map(dept => {
        const attempted  = deptMap[dept].attempted;
        const registered = deptRegistered[dept] || attempted;
        return [
          dept,
          String(attempted),
          String(Math.max(0, registered - attempted)),
          String(registered),
        ];
      }),
      headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
    });
    cy = doc.lastAutoTable.finalY + 5;
  }

  cy = sectionHeading(doc, 'Branch-wise Performance', cy);
  if (deptKeys.length) {
    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
      body: deptKeys.map(dept => {
        const s   = deptMap[dept].scores;
        const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
        const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
        return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
      }),
      headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
    });
    cy = doc.lastAutoTable.finalY + 5;
  }

  // Section-wise (only if >1 distinct sections)
  const sectionStudentMap = {};
  submissions.forEach(s => {
    const sec = s.section || '-';
    if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
    sectionStudentMap[sec].attempted++;
    sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
  });
  const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '-');
  if (secKeys.length > 1) {
    cy = sectionHeading(doc, 'Attendance by Section', cy);
    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
      body: secKeys.map(sec => {
        const s   = sectionStudentMap[sec].scores;
        const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
        const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
        return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
      }),
      headStyles:   { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
    });
    cy = doc.lastAutoTable.finalY + 5;
  }

  // ── PAGE 2: Assessment details ─────────────────────────────────────────────
  doc.addPage();
  drawPageHeader(doc, collegeLogoDataUrl, collegeName);
  cy = 28;

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

  cy = sectionHeading(doc, 'Assessment Information', cy);
  autoTable(doc, {
    ...BASE_TABLE,
    startY: cy,
    head: [['FIELD', 'VALUE']],
    body: [
      ['Assessment Name',    examTitle || '-'],
      ['Platform',           'AlgoSpark Learning Hub | Powered by MindSpark'],
      ['Questions Count',    String(questions.length)],
      ['Students Attempted', String(total)],
      ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
      ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
      ['Highest Percentage', highestPct],
      ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
      ['Average Score',      `${avgScore} / ${maxPossible}`],
    ],
    headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55, halign: 'left' },
      1: { halign: 'left' },
    },
  });
  cy = doc.lastAutoTable.finalY + 6;

  if (Object.keys(sectionBreakdown).length) {
    cy = sectionHeading(doc, 'Section / Module Breakdown', cy);
    const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [
      k, String(v.count), String(v.marks),
    ]);
    secBody.push(['TOTAL', String(questions.length), String(maxPossible)]);
    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
      body: secBody,
      headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 90 },
        1: { halign: 'center' },
        2: { halign: 'center' },
      },
      didParseCell: data => {
        if (data.section === 'body' && data.row.index === secBody.length - 1)
          data.cell.styles.fontStyle = 'bold';
      },
    });
    cy = doc.lastAutoTable.finalY + 6;
  }

  // ── PAGE 3: Charts ─────────────────────────────────────────────────────────
  doc.addPage();
  drawPageHeader(doc, collegeLogoDataUrl, collegeName);
  cy = 28;

  if (deptKeys.length) {
    drawPieChart(doc, 40, cy + 28, 22, [
      { label: 'Attempted',     value: total,                          color: C.green       },
      { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [210,220,235] },
    ], 'Attendance Overview');
    cy += 68;
  }

  const overallDist = scoreDistribution(submissions, maxPossible).reverse();
  cy = drawBarChart(
    doc, 14, cy, W - 28, 50,
    overallDist.map(d => ({ label: d.label, value: d.value })),
    'Overall Performance - Student Score Distribution',
    C.blue,
  );

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
    if (cy > 210) {
      doc.addPage();
      drawPageHeader(doc, collegeLogoDataUrl, collegeName);
      cy = 28;
    }
    cy = drawBarChart(
      doc, 14, cy, W - 28, 48,
      dist.map(d => ({ label: d.label, value: d.value })),
      `${secName} - Student Score Distribution`,
      C.blue,
    );
  });

  // ── PAGE 4: Rankings ───────────────────────────────────────────────────────
  doc.addPage();
  drawPageHeader(doc, collegeLogoDataUrl, collegeName);
  cy = 28;

  const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
  const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

  const rankCols = {
    0: { halign: 'center', cellWidth: 10 },
    1: { halign: 'left' },
    2: { halign: 'center', cellWidth: 28 },
    3: { halign: 'center', cellWidth: 24 },
    4: { halign: 'center', cellWidth: 20 },
    5: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
    6: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
  };
  const rankHead = [['#', 'NAME', 'REGD NO.', 'BRANCH', 'SECTION', 'SCORE', 'PERCENTAGE']];
  const rankRow  = (s, i) => [
    String(i + 1),
    s.studentName  || '-',
    s.studentRegNo || '-',
    s.branch       || s.department || '-',
    s.section      || '-',
    String(s.totalScore ?? 0),
    maxPossible > 0
      ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%`
      : '0.00%',
  ];

  cy = sectionHeading(doc, 'Top 10 Students', cy, C.green);
  autoTable(doc, {
    ...BASE_TABLE,
    startY: cy,
    head: rankHead,
    body: sorted.slice(0, 10).map(rankRow),
    headStyles:   { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
    columnStyles: rankCols,
  });
  cy = doc.lastAutoTable.finalY + 6;

  cy = sectionHeading(doc, 'Bottom 10 Students', cy, C.red);
  autoTable(doc, {
    ...BASE_TABLE,
    startY: cy,
    head: rankHead,
    body: bottom.slice(0, 10).map(rankRow),
    headStyles:   { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
    columnStyles: rankCols,
  });
  cy = doc.lastAutoTable.finalY + 6;

  if (cy > 210) {
    doc.addPage();
    drawPageHeader(doc, collegeLogoDataUrl, collegeName);
    cy = 28;
  }

  cy = sectionHeading(doc, 'Complete Student Rankings', cy);
  const secNames = Object.keys(sectionBreakdown);
  autoTable(doc, {
    ...BASE_TABLE,
    styles:    { fontSize: 6.5, cellPadding: 1.8, valign: 'middle' },
    startY: cy,
    head: [['#', 'Name', 'Regd No.', 'Branch', 'Sec', ...secNames, 'Total', '%', 'Violations']],
    body: sorted.map((s, i) => {
      const brk       = s.scoreBreakdown || [];
      const secScores = secNames.map(secName => {
        const secQs    = sectionBreakdown[secName].questions;
        const secScore = brk
          .filter(b => secQs.find(q => q.id === b.questionId))
          .reduce((a, b2) => a + (b2.score || 0), 0);
        return String(secScore);
      });
      return [
        `${i + 1}`,
        s.studentName  || '-',
        s.studentRegNo || '-',
        s.branch       || s.department || '-',
        s.section      || '-',
        ...secScores,
        String(s.totalScore ?? 0),
        maxPossible > 0
          ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%`
          : '0.0%',
        String(s.violations ?? 0),
      ];
    }),
    headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 6.5 },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { halign: 'left' },
      2: { cellWidth: 24, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 10, halign: 'center' },
      [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
      [5 + secNames.length + 1]: { halign: 'center', cellWidth: 16 },
      [5 + secNames.length + 2]: { halign: 'center', cellWidth: 16 },
    },
    margin: { left: 8, right: 8 },
    didParseCell: data => {
      const totalIdx = 5 + secNames.length;
      if (data.section === 'body' && data.column.index === totalIdx) {
        const score = parseInt(data.row.raw[totalIdx]);
        const pct   = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
        if      (pct >= 80) data.cell.styles.textColor = C.green;
        else if (pct >= 40) data.cell.styles.textColor = C.orange;
        else                data.cell.styles.textColor = C.red;
      }
    },
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }
  doc.save(`AlgoSpark_Overall_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT-WISE REPORT
// ─────────────────────────────────────────────────────────────────────────────
export function generateStudentWiseReport({
  examTitle,
  exam,
  submissions,
  questions,
  collegeName,
  collegeLogoDataUrl,
  allExams       = [],
  allSubmissions = [],
}) {
  if (!submissions.length) {
    alert('No submissions to generate report for.');
    return;
  }

  const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W           = doc.internal.pageSize.getWidth();
  const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
  const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

  // Section -> questions map
  const sectionMap = {};
  questions.forEach(q => {
    const key = q.sectionName || q.section || q.category
      || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
    if (!sectionMap[key]) sectionMap[key] = [];
    sectionMap[key].push(q);
  });
  const allSectionNames = Object.keys(sectionMap);

  const mcqQs     = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
  const codingQs  = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
  const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
  const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

  const examTypeOf = examId => {
    const found = allExams.find(e => e.id === examId);
    return (found?.examType || found?.type || 'EXAM').toUpperCase();
  };

  const computeCrossExamStats = studentId => {
    const studentSubs = allSubmissions.filter(
      s => s.studentId === studentId && s.status === 'completed'
    );
    const daily  = studentSubs.filter(s => examTypeOf(s.examId) === 'DAILY');
    const weekly = studentSubs.filter(s => examTypeOf(s.examId) === 'WEEKLY');
    const avgOf  = arr =>
      arr.length
        ? Math.round(arr.reduce((a, s) => a + (s.totalScore ?? s.score ?? 0), 0) / arr.length)
        : 0;
    return {
      dailyCompleted:  daily.length,
      dailyAvgScore:   avgOf(daily),
      weeklyCompleted: weekly.length,
      weeklyAvgScore:  avgOf(weekly),
    };
  };

  const getSectionPct = (sub, secName) => {
    const secQs  = sectionMap[secName];
    if (!secQs || !secQs.length) return null;
    const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
    if (secMax === 0) return null;
    const brk      = sub.scoreBreakdown || [];
    const secScore = brk
      .filter(b => secQs.find(q => q.id === b.questionId))
      .reduce((a, b) => a + (b.score || 0), 0);
    return Math.round((secScore / secMax) * 100);
  };

  const toPercent = (val, max) => {
    if (val === null || val === undefined) return null;
    if (max <= 0) return null;
    if (val <= 1)  return Math.round(val * 100);
    if (val > 100) return Math.round((val / max) * 100);
    return Math.round(val);
  };

  // ── One page per student ───────────────────────────────────────────────────
  sorted.forEach((sub, idx) => {
    if (idx > 0) doc.addPage();
    drawPageHeader(doc, collegeLogoDataUrl, collegeName);

    const score  = sub.totalScore ?? 0;
    const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    const pctStr = `${pct.toFixed(0)}%`;
    const status = overallStatus(pct);
    const passed = pct >= 40;

    // ── Student info banner ──────────────────────────────────────────────
    const bannerY = 25;
    const bannerH = 32;
    doc.setFillColor(...C.light);
    doc.roundedRect(10, bannerY, W - 20, bannerH, 3, 3, 'F');
    doc.setFillColor(...C.primary);
    doc.roundedRect(10, bannerY, 4, bannerH, 2, 2, 'F');

    // Report title inside banner
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text('AlgoSpark - Student Performance Report', W / 2, bannerY + 8, { align: 'center' });

    // Left info columns
    const leftPairs = [
      ['Student Name:', sub.studentName  || '-'],
      ['Student ID:',   sub.studentRegNo || sub.studentId || '-'],
      ['Status:',       status],
    ];
    leftPairs.forEach(([lbl, val], i) => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.mid);
      doc.text(lbl, 17, bannerY + 14 + i * 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.dark);
      doc.text(String(val), 52, bannerY + 14 + i * 6);
    });

    // Right info columns
    const rightPairs = [
      ['Branch:',  sub.branch  || sub.department || '-'],
      ['Section:', sub.section || exam?.batch    || '-'],
      ['Exam:',    examTitle   || '-'],
    ];
    const midX = W / 2 + 4;
    rightPairs.forEach(([lbl, val], i) => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.mid);
      doc.text(lbl, midX, bannerY + 14 + i * 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.dark);
      const v = String(val);
      doc.text(v.length > 22 ? v.slice(0, 20) + '...' : v, midX + 22, bannerY + 14 + i * 6);
    });

    // Score badge (top-right of banner)
    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(W - 30, bannerY + 2, 20, 13, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.white);
    doc.text(pctStr, W - 20, bannerY + 10, { align: 'center' });
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(passed ? 'PASS' : 'FAIL', W - 20, bannerY + 15, { align: 'center' });
    doc.setTextColor(...C.dark);

    let cy = bannerY + bannerH + 4;

    // ── Overall Performance bar ──────────────────────────────────────────
    cy = sectionHeading(doc, 'Overall Performance', cy);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.mid);
    doc.text(`Score: ${score} / ${maxPossible}  |  Accuracy: ${pctStr}`, 14, cy + 3);
    const pbW = W - 28;
    doc.setFillColor(220, 225, 235);
    doc.roundedRect(14, cy + 6, pbW, 4, 2, 2, 'F');
    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(14, cy + 6, Math.max(0, pbW * Math.min(1, pct / 100)), 4, 2, 2, 'F');
    doc.setTextColor(...C.dark);
    cy += 15;

    // ── Participation Metrics ────────────────────────────────────────────
    // Only 2 rows: Overall Assessment + Placement Readiness
    // (Daily/Weekly moved to its own dedicated table below — NO duplicates here)
    cy = sectionHeading(doc, 'Participation Metrics', cy);

    const totalExamsAssigned  = sub.totalExamsAssigned  ?? 1;
    const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
    const overallParticipationPct = totalExamsAssigned > 0
      ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100)
      : null;

    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['Sno', 'For', 'Rating', 'Feedback']],
      body: [
        ['1', 'Overall Assessment',  ratingStr(overallParticipationPct), feedbackLabel(overallParticipationPct)],
        ['2', 'Placement Readiness', ratingStr(Math.round(pct)),         feedbackLabel(Math.round(pct))],
      ],
      headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: metricColumnStyles(),
      didParseCell: data => ratingCellColor(data, 2),
    });
    cy = doc.lastAutoTable.finalY + 5;

    // ── Performance Metrics (section accuracy) ───────────────────────────
    cy = sectionHeading(doc, 'Performance Metrics', cy);

    const perfRows = allSectionNames.map((secName, i) => {
      const pctVal = getSectionPct(sub, secName);
      return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
    });

    // Append MCQ / Coding summary rows only if both exist
    if (mcqMax > 0 && codingMax > 0) {
      const mcqPct    = Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100);
      const codingPct = Math.round(((sub.codingScore ?? 0) / codingMax) * 100);
      perfRows.push(['-', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
      perfRows.push(['-', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
    }

    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
      body: perfRows,
      headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      columnStyles: metricColumnStyles(),
      didParseCell: data => ratingCellColor(data, 2),
    });
    cy = doc.lastAutoTable.finalY + 5;

    // ── Section Score Details ────────────────────────────────────────────
    cy = sectionHeading(doc, 'Section Score Details', cy);

    const scoreDetailRows = allSectionNames.map(secName => {
      const secQs    = sectionMap[secName];
      const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
      const brk      = sub.scoreBreakdown || [];
      const secScore = brk
        .filter(b => secQs.find(q => q.id === b.questionId))
        .reduce((a, b) => a + (b.score || 0), 0);
      const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '-';
      return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
    });
    scoreDetailRows.push(['TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length)]);

    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
      body: scoreDetailRows,
      headStyles:   { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left',   fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'center', fontStyle: 'bold', cellWidth: 24 },
        3: { halign: 'center', cellWidth: 20 },
      },
      didParseCell: data => {
        if (data.section === 'body' && data.row.index === scoreDetailRows.length - 1)
          data.cell.styles.fontStyle = 'bold';
        if (data.section === 'body' && data.column.index === 2)
          ratingCellColor(data, 2);
      },
    });
    cy = doc.lastAutoTable.finalY + 5;

    // ── Daily & Weekly Assessment Performance ────────────────────────────
    // This is its OWN separate table — NOT mixed into Participation Metrics.
    if (cy < 248) {
      cy = sectionHeading(doc, 'Daily and Weekly Assessment Performance', cy, C.brown);

      const crossStats = allSubmissions.length > 0
        ? computeCrossExamStats(sub.studentId)
        : null;

      const dailyCompleted  = crossStats?.dailyCompleted  ?? sub.dailyCompleted  ?? null;
      const dailyAvgRaw     = crossStats?.dailyAvgScore   ?? sub.dailyAvgScore   ?? null;
      const weeklyCompleted = crossStats?.weeklyCompleted ?? sub.weeklyCompleted  ?? null;
      const weeklyAvgRaw    = crossStats?.weeklyAvgScore  ?? sub.weeklyAvgScore  ?? null;

      const dailyPct  = toPercent(dailyAvgRaw,  maxPossible);
      const weeklyPct = toPercent(weeklyAvgRaw, maxPossible);

      autoTable(doc, {
        ...BASE_TABLE,
        startY: cy,
        head: [['Sno', 'Assessment Type', 'Completed', 'Avg Score', 'Feedback']],
        body: [
          [
            '1',
            'Daily Assessments',
            dailyCompleted  !== null ? String(dailyCompleted)  : '-',
            ratingStr(dailyPct),
            feedbackLabel(dailyPct),
          ],
          [
            '2',
            'Weekly Assessments',
            weeklyCompleted !== null ? String(weeklyCompleted) : '-',
            ratingStr(weeklyPct),
            feedbackLabel(weeklyPct),
          ],
        ],
        headStyles:   { fillColor: C.brown, textColor: C.white, fontStyle: 'bold' },
        columnStyles: dwColumnStyles(),
        didParseCell: data => ratingCellColor(data, 3),
      });
      cy = doc.lastAutoTable.finalY + 5;
    }

    // ── Proctoring warning ────────────────────────────────────────────────
    const viols = sub.violations ?? 0;
    if (viols > 0 && cy < 272) {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.red);
      doc.text(
        `WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`,
        10, cy,
      );
      doc.setTextColor(...C.dark);
      doc.setFont('helvetica', 'normal');
    }
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }
  doc.save(`AlgoSpark_StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
}
