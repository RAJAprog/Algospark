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
//   brown:    [180, 100, 10],
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// function feedbackLabel(pct) {
//   if (pct === null || pct === undefined) return '-';
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

// function ratingStr(pct) {
//   return (pct !== null && pct !== undefined) ? `${pct}%` : '-';
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // FETCH COLLEGE LOGO AS BASE64
// // ─────────────────────────────────────────────────────────────────────────────
// export async function fetchCollegeLogoBase64(collegeId, db) {
//   if (!collegeId || !db) return null;
//   try {
//     const { doc, getDoc, collection, query, where, getDocs } =
//       await import('firebase/firestore');

//     let logoUrl = null;

//     const directSnap = await getDoc(doc(db, 'colleges', collegeId));
//     if (directSnap.exists()) {
//       logoUrl = directSnap.data().logoUrl;
//     } else {
//       const q    = query(collection(db, 'colleges'), where('name', '==', collegeId));
//       const snap = await getDocs(q);
//       if (!snap.empty) logoUrl = snap.docs[0].data().logoUrl;
//     }

//     if (!logoUrl) return null;

//     try {
//       const response = await fetch(logoUrl, { mode: 'cors', cache: 'no-cache' });
//       if (!response.ok) throw new Error('fetch failed');
//       const blob = await response.blob();
//       return await new Promise((resolve, reject) => {
//         const reader   = new FileReader();
//         reader.onload  = () => resolve(reader.result);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//     } catch {
//       return await new Promise((resolve) => {
//         const img       = new Image();
//         img.crossOrigin = 'anonymous';
//         img.onload = () => {
//           const canvas  = document.createElement('canvas');
//           canvas.width  = img.naturalWidth  || 128;
//           canvas.height = img.naturalHeight || 128;
//           canvas.getContext('2d').drawImage(img, 0, 0);
//           try { resolve(canvas.toDataURL('image/png')); }
//           catch { resolve(null); }
//         };
//         img.onerror = () => resolve(null);
//         img.src = logoUrl;
//       });
//     }
//   } catch (e) {
//     console.warn('fetchCollegeLogoBase64 failed:', e);
//     return null;
//   }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // GET IMAGE NATURAL DIMENSIONS from a base64 data-URL
// // Used to compute the correct aspect-ratio box for jsPDF addImage.
// // ─────────────────────────────────────────────────────────────────────────────
// function getImageDimensions(dataUrl) {
//   return new Promise((resolve) => {
//     const img    = new Image();
//     img.onload   = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
//     img.onerror  = () => resolve({ w: 1, h: 1 });
//     img.src      = dataUrl;
//   });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // COMPUTE FIT DIMENSIONS
// // Fit `imgW × imgH` into a `maxW × maxH` box, preserving aspect ratio.
// // Returns the final { fitW, fitH } in mm.
// // ─────────────────────────────────────────────────────────────────────────────
// function fitInBox(imgW, imgH, maxW, maxH) {
//   if (!imgW || !imgH) return { fitW: maxW, fitH: maxH };
//   const scale = Math.min(maxW / imgW, maxH / imgH);
//   return { fitW: imgW * scale, fitH: imgH * scale };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE HEADER  (async — must be awaited)
// //
// // Layout (full-width, height 22 mm):
// //
// //   LEFT block  (primary blue,   0 → SPLIT):
// //     • College logo — aspect-ratio preserved, centred vertically in 16×16 mm box
// //     • College name  + subtitle text
// //
// //   RIGHT block (accent purple, SPLIT → W):
// //     • MindSpark logo (public/logo.png pre-loaded as algoLogoDataUrl)
// //     • "MindSpark" bold text
// //     • "Powered by MindSpark" small text
// //
// // The AlgoSpark/MindSpark logo is loaded ONCE per report via
// // `loadAlgoSparkLogo()` and passed in so it doesn't re-fetch on every page.
// // ─────────────────────────────────────────────────────────────────────────────

// /** Load the MindSpark/AlgoSpark logo from the public folder as base64. */
// export async function loadAlgoSparkLogo() {
//   // The logo lives at /logo.png in the public folder (same as HomePage uses).
//   // We try three paths in order so it works regardless of dev/prod base URL.
//   const candidates = ['/logo.png', './logo.png', `${window.location.origin}/logo.png`];
//   for (const path of candidates) {
//     try {
//       const res = await fetch(path, { cache: 'no-cache' });
//       if (!res.ok) continue;
//       const blob = await res.blob();
//       const b64  = await new Promise((resolve, reject) => {
//         const r   = new FileReader();
//         r.onload  = () => resolve(r.result);
//         r.onerror = reject;
//         r.readAsDataURL(blob);
//       });
//       if (b64) return b64;
//     } catch (_) { /* try next */ }
//   }
//   return null;
// }

// async function drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl) {
//   const W       = doc.internal.pageSize.getWidth();
//   const HDR_H   = 24;           // header height in mm (slightly taller for logo room)
//   const RIGHT_W = 68;           // width of the right (purple) block
//   const SPLIT   = W - RIGHT_W;

//   // ── Background blocks ────────────────────────────────────────────────────
//   doc.setFillColor(...C.primary);
//   doc.rect(0, 0, SPLIT, HDR_H, 'F');

//   doc.setFillColor(...C.accent);
//   doc.rect(SPLIT, 0, RIGHT_W, HDR_H, 'F');

//   // ── LEFT: College logo with correct aspect ratio ─────────────────────────
//   const MAX_LOGO_W = 18;   // maximum width  (mm) the logo may occupy
//   const MAX_LOGO_H = 18;   // maximum height (mm) the logo may occupy
//   const LOGO_PAD_X = 4;    // gap from left edge
//   const LOGO_PAD_Y = 3;    // gap from top edge

//   let logoDrawW = MAX_LOGO_W;
//   let logoDrawH = MAX_LOGO_H;
//   let logoPosX  = LOGO_PAD_X;
//   // Centre vertically inside the header
//   let logoPosY  = (HDR_H - MAX_LOGO_H) / 2;

//   if (
//     collegeLogoDataUrl &&
//     typeof collegeLogoDataUrl === 'string' &&
//     collegeLogoDataUrl.startsWith('data:')
//   ) {
//     try {
//       // Get actual pixel dimensions so we can preserve aspect ratio
//       const { w: imgW, h: imgH } = await getImageDimensions(collegeLogoDataUrl);
//       const { fitW, fitH }       = fitInBox(imgW, imgH, MAX_LOGO_W, MAX_LOGO_H);

//       logoDrawW = fitW;
//       logoDrawH = fitH;
//       // Horizontally: flush-left within the pad zone; vertically: centred
//       logoPosX  = LOGO_PAD_X;
//       logoPosY  = (HDR_H - fitH) / 2;

//       const fmt = collegeLogoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
//       doc.addImage(collegeLogoDataUrl, fmt, logoPosX, logoPosY, logoDrawW, logoDrawH);
//     } catch (e) {
//       console.warn('drawPageHeader: college logo addImage failed', e.message);
//       _drawLogoPlaceholder(doc, logoPosX, logoPosY, MAX_LOGO_W, MAX_LOGO_H, collegeName);
//       logoDrawW = MAX_LOGO_W;
//       logoDrawH = MAX_LOGO_H;
//     }
//   } else {
//     _drawLogoPlaceholder(doc, logoPosX, logoPosY, MAX_LOGO_W, MAX_LOGO_H, collegeName);
//   }

//   // ── LEFT: College name + subtitle ────────────────────────────────────────
//   const textX = LOGO_PAD_X + MAX_LOGO_W + 3;   // always start text after the max logo box
//   doc.setTextColor(...C.white);

//   const rawName     = collegeName || 'Institution';
//   const displayName = rawName.length > 32 ? rawName.slice(0, 30) + '…' : rawName;

//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'bold');
//   doc.text(displayName, textX, 11);

//   doc.setFontSize(6.5);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Student Assessment Report | MindSpark Learning Hub', textX, 17);

//   // ── RIGHT: MindSpark logo + text ─────────────────────────────────────────
//   const rightCX   = SPLIT + RIGHT_W / 2;   // horizontal centre of right block
//   const ALGO_MAX_W = 14;
//   const ALGO_MAX_H = 14;

//   if (
//     algoLogoDataUrl &&
//     typeof algoLogoDataUrl === 'string' &&
//     algoLogoDataUrl.startsWith('data:')
//   ) {
//     try {
//       const { w: aW, h: aH } = await getImageDimensions(algoLogoDataUrl);
//       const { fitW, fitH }   = fitInBox(aW, aH, ALGO_MAX_W, ALGO_MAX_H);

//       // Place the logo centred horizontally, near the top of the right block
//       const algoPosX = rightCX - fitW / 2;
//       const algoPosY = (HDR_H / 2 - fitH) / 2;   // upper half

//       const aFmt = algoLogoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
//       doc.addImage(algoLogoDataUrl, aFmt, algoPosX, algoPosY, fitW, fitH);

//       // Text below the logo
//       doc.setTextColor(...C.white);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.text('MindSpark', rightCX, algoPosY + fitH + 4.5, { align: 'center' });

//       doc.setFontSize(5.5);
//       doc.setFont('helvetica', 'normal');
//       doc.text('Powered by MindSpark', rightCX, algoPosY + fitH + 9, { align: 'center' });
//     } catch (e) {
//       // Fallback: text-only right block
//       _drawRightBlockTextOnly(doc, rightCX, HDR_H);
//     }
//   } else {
//     _drawRightBlockTextOnly(doc, rightCX, HDR_H);
//   }

//   doc.setTextColor(...C.dark);
// }

// /** Text-only fallback for the right header block when logo is unavailable. */
// function _drawRightBlockTextOnly(doc, rightCX, HDR_H) {
//   doc.setTextColor(...C.white);
//   doc.setFontSize(13);
//   doc.setFont('helvetica', 'bold');
//   doc.text('MindSpark', rightCX, HDR_H / 2 - 1, { align: 'center' });
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'normal');
//   doc.text('Powered by MindSpark', rightCX, HDR_H / 2 + 5, { align: 'center' });
// }

// function _drawLogoPlaceholder(doc, x, y, w, h, collegeName) {
//   doc.setFillColor(255, 255, 255);
//   doc.roundedRect(x, y, w, h, 2, 2, 'F');
//   doc.setTextColor(...C.primary);
//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.text(
//     (collegeName || 'C').charAt(0).toUpperCase(),
//     x + w / 2,
//     y + h / 2 + 4,
//     { align: 'center' },
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // PAGE FOOTER
// // ─────────────────────────────────────────────────────────────────────────────
// function drawPageFooter(doc, pageNum, totalPages) {
//   const W = doc.internal.pageSize.getWidth();
//   const H = doc.internal.pageSize.getHeight();

//   doc.setDrawColor(210, 215, 230);
//   doc.setLineWidth(0.3);
//   doc.line(10, H - 10, W - 10, H - 10);

//   doc.setFontSize(7);
//   doc.setTextColor(...C.mid);
//   doc.setFont('helvetica', 'normal');
//   doc.text('MindSpark Learning Hub | Powered by MindSpark', 10, H - 5);
//   doc.text(`Page ${pageNum} of ${totalPages}`, W / 2, H - 5, { align: 'center' });
//   doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 5, { align: 'right' });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // STAT BOXES
// // ─────────────────────────────────────────────────────────────────────────────
// function drawStatBoxes(doc, stats, y) {
//   const W      = doc.internal.pageSize.getWidth();
//   const n      = stats.length;
//   const bw     = Math.min(34, (W - 20 - (n - 1) * 3) / n);
//   const bh     = 22;
//   const bGap   = 3;
//   const totalW = n * bw + (n - 1) * bGap;
//   let   bx     = (W - totalW) / 2;

//   stats.forEach(({ label, value, color }) => {
//     doc.setFillColor(...C.light);
//     doc.roundedRect(bx, y, bw, bh, 3, 3, 'F');
//     doc.setFillColor(...(color || C.primary));
//     doc.roundedRect(bx, y, 3, bh, 1.5, 1.5, 'F');

//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...(color || C.primary));
//     doc.text(String(value), bx + bw / 2, y + bh / 2 - 1, { align: 'center' });

//     doc.setFontSize(5.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...C.mid);
//     doc.text(label.toUpperCase(), bx + bw / 2, y + bh / 2 + 6, { align: 'center' });

//     bx += bw + bGap;
//   });

//   doc.setTextColor(...C.dark);
//   return y + bh + 4;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTION HEADING STRIP
// // ─────────────────────────────────────────────────────────────────────────────
// function sectionHeading(doc, title, y, color) {
//   const W = doc.internal.pageSize.getWidth();
//   color   = color || C.primary;
//   doc.setFillColor(...color);
//   doc.rect(10, y, W - 20, 6.5, 'F');
//   doc.setFontSize(8);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.white);
//   doc.text(title, 14, y + 4.5);
//   doc.setTextColor(...C.dark);
//   return y + 9;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // BAR CHART
// // ─────────────────────────────────────────────────────────────────────────────
// function drawBarChart(doc, x, y, w, h, data, title, barColor) {
//   barColor     = barColor || C.blue;
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
//     const lbl      = (d.label || '').replace('%', '');
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
//   if (title) {
//     doc.setFontSize(8.5);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text(title, cx - r, cy - r - 4);
//   }
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

//   let lx = cx + r + 6;
//   let ly = cy - r / 2;
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
// // SCORE DISTRIBUTION BUCKETS
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
// // SHARED TABLE CONFIG
// // ─────────────────────────────────────────────────────────────────────────────
// const BASE_TABLE = {
//   styles: {
//     fontSize:    8,
//     cellPadding: 3,
//     valign:      'middle',
//     lineColor:   [220, 225, 235],
//     lineWidth:   0.2,
//   },
//   alternateRowStyles: { fillColor: C.tblAlt },
//   margin:             { left: 10, right: 10 },
//   theme:              'grid',
// };

// const METRIC_COL_WIDTHS = {
//   sno:      10,
//   for_:     72,
//   rating:   22,
//   feedback: null,
// };

// const DW_COL_WIDTHS = {
//   sno:       10,
//   type:      60,
//   completed: 24,
//   rating:    22,
//   feedback:  null,
// };

// function metricColumnStyles() {
//   return {
//     0: { cellWidth: METRIC_COL_WIDTHS.sno,   halign: 'center' },
//     1: { cellWidth: METRIC_COL_WIDTHS.for_,  halign: 'left'   },
//     2: { cellWidth: METRIC_COL_WIDTHS.rating, halign: 'center', fontStyle: 'bold' },
//     3: { halign: 'left' },
//   };
// }

// function dwColumnStyles() {
//   return {
//     0: { cellWidth: DW_COL_WIDTHS.sno,       halign: 'center' },
//     1: { cellWidth: DW_COL_WIDTHS.type,      halign: 'left'   },
//     2: { cellWidth: DW_COL_WIDTHS.completed, halign: 'center' },
//     3: { cellWidth: DW_COL_WIDTHS.rating,    halign: 'center', fontStyle: 'bold' },
//     4: { halign: 'left' },
//   };
// }

// function ratingCellColor(data, colIndex) {
//   if (data.section === 'body' && data.column.index === colIndex) {
//     const raw = String(data.cell.raw ?? '');
//     if (!raw || raw === '-') { data.cell.styles.textColor = C.mid; return; }
//     const v = parseInt(raw);
//     if      (v >= 80) data.cell.styles.textColor = C.green;
//     else if (v >= 50) data.cell.styles.textColor = C.orange;
//     else              data.cell.styles.textColor = C.red;
//   }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // OVERALL REPORT  (now async — loads logos before drawing)
// // ─────────────────────────────────────────────────────────────────────────────
// export async function generateOverallReport({
//   examTitle,
//   exam,
//   submissions,
//   questions,
//   collegeName,
//   collegeLogoDataUrl,
// }) {
//   // Pre-load the MindSpark logo once; reuse across all pages
//   const algoLogoDataUrl = await loadAlgoSparkLogo();

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

//   const deptMap = {};
//   submissions.forEach(s => {
//     const dept = s.branch || s.department || s.section || 'Unknown';
//     if (!deptMap[dept]) deptMap[dept] = { attempted: 0, scores: [] };
//     deptMap[dept].attempted++;
//     deptMap[dept].scores.push(s.totalScore ?? 0);
//   });
//   const deptRegistered = exam?.deptRegistered || {};
//   const deptKeys       = Object.keys(deptMap);

//   // ── PAGE 1 ────────────────────────────────────────────────────────────────
//   await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);

//   doc.setFontSize(13);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text('MINDSPARK LEARNING HUB - OVERALL REPORT', W / 2, 32, { align: 'center' });

//   doc.setFontSize(9.5);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...C.mid);
//   const dayLabel = exam?.dayNumber
//     ? `Consolidated Report - Day ${exam.dayNumber}`
//     : 'Consolidated Report';
//   doc.text(dayLabel, W / 2, 38, { align: 'center' });

//   doc.setFontSize(11);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...C.dark);
//   doc.text(examTitle || 'Grand Test', W / 2, 44, { align: 'center' });

//   let cy = drawStatBoxes(doc, [
//     { label: 'Total Attempts', value: total,             color: C.primary },
//     { label: 'Completed',      value: completed,         color: C.green   },
//     { label: 'Qualified',      value: qualified,         color: C.accent  },
//     { label: 'Not Qualified',  value: total - qualified, color: C.red     },
//     { label: 'Highest %',      value: highestPct,        color: C.teal    },
//   ], 50);
//   cy += 3;

//   cy = sectionHeading(doc, 'Attendance by Branch', cy);
//   if (deptKeys.length) {
//     autoTable(doc, {
//       ...BASE_TABLE,
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'NOT ATTEMPTED', 'TOTAL']],
//       body: deptKeys.map(dept => {
//         const attempted  = deptMap[dept].attempted;
//         const registered = deptRegistered[dept] || attempted;
//         return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
//       }),
//       headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
//         1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;
//   }

//   cy = sectionHeading(doc, 'Branch-wise Performance', cy);
//   if (deptKeys.length) {
//     autoTable(doc, {
//       ...BASE_TABLE,
//       startY: cy,
//       head: [['BRANCH', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: deptKeys.map(dept => {
//         const s   = deptMap[dept].scores;
//         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [dept, String(deptMap[dept].attempted), String(avg), `${acc}%`];
//       }),
//       headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
//         1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;
//   }

//   const sectionStudentMap = {};
//   submissions.forEach(s => {
//     const sec = s.section || '-';
//     if (!sectionStudentMap[sec]) sectionStudentMap[sec] = { attempted: 0, scores: [] };
//     sectionStudentMap[sec].attempted++;
//     sectionStudentMap[sec].scores.push(s.totalScore ?? 0);
//   });
//   const secKeys = Object.keys(sectionStudentMap).filter(k => k !== '-');
//   if (secKeys.length > 1) {
//     cy = sectionHeading(doc, 'Attendance by Section', cy);
//     autoTable(doc, {
//       ...BASE_TABLE,
//       startY: cy,
//       head: [['SECTION', 'ATTEMPTED', 'AVG. MARKS', 'AVG. ACCURACY']],
//       body: secKeys.map(sec => {
//         const s   = sectionStudentMap[sec].scores;
//         const avg = s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
//         const acc = maxPossible > 0 ? Math.round((avg / maxPossible) * 100) : 0;
//         return [sec, String(sectionStudentMap[sec].attempted), String(avg), `${acc}%`];
//       }),
//       headStyles:   { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
//         1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;
//   }

//   // ── PAGE 2 ────────────────────────────────────────────────────────────────
//   doc.addPage();
//   await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
//   cy = 30;

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

//   cy = sectionHeading(doc, 'Assessment Information', cy);
//   autoTable(doc, {
//     ...BASE_TABLE,
//     startY: cy,
//     head: [['FIELD', 'VALUE']],
//     body: [
//       ['Assessment Name',    examTitle || '-'],
//       ['Platform',           'MindSpark Learning Hub | Powered by MindSpark'],
//       ['Questions Count',    String(questions.length)],
//       ['Students Attempted', String(total)],
//       ['Not Attempted',      String(Math.max(0, notAttemptedTotal))],
//       ['No. of Sections',    String(Object.keys(sectionBreakdown).length)],
//       ['Highest Percentage', highestPct],
//       ['Lowest Percentage',  total > 0 ? `${((minScore / maxPossible) * 100).toFixed(0)}%` : '0%'],
//       ['Average Score',      `${avgScore} / ${maxPossible}`],
//     ],
//     headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: {
//       0: { fontStyle: 'bold', fillColor: C.light, cellWidth: 55, halign: 'left' },
//       1: { halign: 'left' },
//     },
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   if (Object.keys(sectionBreakdown).length) {
//     cy = sectionHeading(doc, 'Section / Module Breakdown', cy);
//     const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
//     secBody.push(['TOTAL', String(questions.length), String(maxPossible)]);
//     autoTable(doc, {
//       ...BASE_TABLE,
//       startY: cy,
//       head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
//       body: secBody,
//       headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold', cellWidth: 90 },
//         1: { halign: 'center' }, 2: { halign: 'center' },
//       },
//       didParseCell: data => {
//         if (data.section === 'body' && data.row.index === secBody.length - 1)
//           data.cell.styles.fontStyle = 'bold';
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 6;
//   }

//   // ── PAGE 3: Charts ─────────────────────────────────────────────────────────
//   doc.addPage();
//   await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
//   cy = 30;

//   if (deptKeys.length) {
//     drawPieChart(doc, 40, cy + 28, 22, [
//       { label: 'Attempted',     value: total,                          color: C.green       },
//       { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [210,220,235] },
//     ], 'Attendance Overview');
//     cy += 68;
//   }

//   const overallDist = scoreDistribution(submissions, maxPossible).reverse();
//   cy = drawBarChart(doc, 14, cy, W - 28, 50,
//     overallDist.map(d => ({ label: d.label, value: d.value })),
//     'Overall Performance - Student Score Distribution', C.blue);

//   for (const [secName, secData] of Object.entries(sectionBreakdown)) {
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
//       await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
//       cy = 30;
//     }
//     cy = drawBarChart(doc, 14, cy, W - 28, 48,
//       dist.map(d => ({ label: d.label, value: d.value })),
//       `${secName} - Student Score Distribution`, C.blue);
//   }

//   // ── PAGE 4: Rankings ───────────────────────────────────────────────────────
//   doc.addPage();
//   await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
//   cy = 30;

//   const sorted = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));
//   const bottom = [...submissions].sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

//   const rankCols = {
//     0: { halign: 'center', cellWidth: 10 },
//     1: { halign: 'left' },
//     2: { halign: 'center', cellWidth: 28 },
//     3: { halign: 'center', cellWidth: 24 },
//     4: { halign: 'center', cellWidth: 20 },
//     5: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
//     6: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
//   };
//   const rankHead = [['#', 'NAME', 'REGD NO.', 'BRANCH', 'SECTION', 'SCORE', 'PERCENTAGE']];
//   const rankRow  = (s, i) => [
//     String(i + 1), s.studentName || '-', s.studentRegNo || '-',
//     s.branch || s.department || '-', s.section || '-',
//     String(s.totalScore ?? 0),
//     maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%` : '0.00%',
//   ];

//   cy = sectionHeading(doc, 'Top 10 Students', cy, C.green);
//   autoTable(doc, {
//     ...BASE_TABLE, startY: cy,
//     head: rankHead,
//     body: sorted.slice(0, 10).map(rankRow),
//     headStyles:   { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: rankCols,
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   cy = sectionHeading(doc, 'Bottom 10 Students', cy, C.red);
//   autoTable(doc, {
//     ...BASE_TABLE, startY: cy,
//     head: rankHead,
//     body: bottom.slice(0, 10).map(rankRow),
//     headStyles:   { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
//     columnStyles: rankCols,
//   });
//   cy = doc.lastAutoTable.finalY + 6;

//   if (cy > 210) {
//     doc.addPage();
//     await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
//     cy = 30;
//   }

//   cy = sectionHeading(doc, 'Complete Student Rankings', cy);
//   const secNames = Object.keys(sectionBreakdown);
//   autoTable(doc, {
//     ...BASE_TABLE,
//     styles:    { fontSize: 6.5, cellPadding: 1.8, valign: 'middle' },
//     startY: cy,
//     head: [['#', 'Name', 'Regd No.', 'Branch', 'Sec', ...secNames, 'Total', '%', 'Violations']],
//     body: sorted.map((s, i) => {
//       const brk       = s.scoreBreakdown || [];
//       const secScores = secNames.map(secName => {
//         const secQs    = sectionBreakdown[secName].questions;
//         const secScore = brk
//           .filter(b => secQs.find(q => q.id === b.questionId))
//           .reduce((a, b2) => a + (b2.score || 0), 0);
//         return String(secScore);
//       });
//       return [
//         `${i + 1}`, s.studentName || '-', s.studentRegNo || '-',
//         s.branch || s.department || '-', s.section || '-',
//         ...secScores,
//         String(s.totalScore ?? 0),
//         maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%` : '0.0%',
//         String(s.violations ?? 0),
//       ];
//     }),
//     headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold', fontSize: 6.5 },
//     columnStyles: {
//       0: { cellWidth: 8,  halign: 'center' },
//       1: { halign: 'left' },
//       2: { cellWidth: 24, halign: 'center' },
//       3: { cellWidth: 18, halign: 'center' },
//       4: { cellWidth: 10, halign: 'center' },
//       [5 + secNames.length]:     { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
//       [5 + secNames.length + 1]: { halign: 'center', cellWidth: 16 },
//       [5 + secNames.length + 2]: { halign: 'center', cellWidth: 16 },
//     },
//     margin: { left: 8, right: 8 },
//     didParseCell: data => {
//       const totalIdx = 5 + secNames.length;
//       if (data.section === 'body' && data.column.index === totalIdx) {
//         const score = parseInt(data.row.raw[totalIdx]);
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
// // STUDENT-WISE REPORT  (now async)
// // ─────────────────────────────────────────────────────────────────────────────
// export async function generateStudentWiseReport({
//   examTitle,
//   exam,
//   submissions,
//   questions,
//   collegeName,
//   collegeLogoDataUrl,
//   allExams       = [],
//   allSubmissions = [],
// }) {
//   if (!submissions.length) {
//     alert('No submissions to generate report for.');
//     return;
//   }

//   const algoLogoDataUrl = await loadAlgoSparkLogo();

//   const doc         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
//   const W           = doc.internal.pageSize.getWidth();
//   const maxPossible = questions.reduce((a, q) => a + (q.marks || 0), 0) || 100;
//   const sorted      = [...submissions].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

//   const sectionMap = {};
//   questions.forEach(q => {
//     const key = q.sectionName || q.section || q.category
//       || (q.type === 'CODING' ? 'Coding / Programming' : 'MCQ');
//     if (!sectionMap[key]) sectionMap[key] = [];
//     sectionMap[key].push(q);
//   });
//   const allSectionNames = Object.keys(sectionMap);

//   const mcqQs     = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
//   const codingQs  = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
//   const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
//   const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

//   const examTypeOf = examId => {
//     const found = allExams.find(e => e.id === examId);
//     return (found?.examType || found?.type || 'EXAM').toUpperCase();
//   };

//   const computeCrossExamStats = studentId => {
//     const studentSubs = allSubmissions.filter(s => s.studentId === studentId && s.status === 'completed');
//     const daily  = studentSubs.filter(s => examTypeOf(s.examId) === 'DAILY');
//     const weekly = studentSubs.filter(s => examTypeOf(s.examId) === 'WEEKLY');
//     const avgOf  = arr => arr.length ? Math.round(arr.reduce((a, s) => a + (s.totalScore ?? s.score ?? 0), 0) / arr.length) : 0;
//     return { dailyCompleted: daily.length, dailyAvgScore: avgOf(daily), weeklyCompleted: weekly.length, weeklyAvgScore: avgOf(weekly) };
//   };

//   const getSectionPct = (sub, secName) => {
//     const secQs  = sectionMap[secName];
//     if (!secQs || !secQs.length) return null;
//     const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//     if (secMax === 0) return null;
//     const brk      = sub.scoreBreakdown || [];
//     const secScore = brk.filter(b => secQs.find(q => q.id === b.questionId)).reduce((a, b) => a + (b.score || 0), 0);
//     return Math.round((secScore / secMax) * 100);
//   };

//   const toPercent = (val, max) => {
//     if (val === null || val === undefined) return null;
//     if (max <= 0) return null;
//     if (val <= 1)  return Math.round(val * 100);
//     if (val > 100) return Math.round((val / max) * 100);
//     return Math.round(val);
//   };

//   for (let idx = 0; idx < sorted.length; idx++) {
//     const sub = sorted[idx];
//     if (idx > 0) doc.addPage();
//     await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);

//     const score  = sub.totalScore ?? 0;
//     const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
//     const pctStr = `${pct.toFixed(0)}%`;
//     const status = overallStatus(pct);
//     const passed = pct >= 40;

//     const bannerY = 27;
//     const bannerH = 32;
//     doc.setFillColor(...C.light);
//     doc.roundedRect(10, bannerY, W - 20, bannerH, 3, 3, 'F');
//     doc.setFillColor(...C.primary);
//     doc.roundedRect(10, bannerY, 4, bannerH, 2, 2, 'F');

//     doc.setFontSize(9.5);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...C.dark);
//     doc.text('MindSpark - Student Performance Report', W / 2, bannerY + 8, { align: 'center' });

//     const leftPairs = [
//       ['Student Name:', sub.studentName  || '-'],
//       ['Student ID:',   sub.studentRegNo || sub.studentId || '-'],
//       ['Status:',       status],
//     ];
//     leftPairs.forEach(([lbl, val], i) => {
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.mid);
//       doc.text(lbl, 17, bannerY + 14 + i * 6);
//       doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.dark);
//       doc.text(String(val), 52, bannerY + 14 + i * 6);
//     });

//     const rightPairs = [
//       ['Branch:',  sub.branch || sub.department || '-'],
//       ['Section:', sub.section || exam?.batch || '-'],
//       ['Exam:',    examTitle || '-'],
//     ];
//     const midX = W / 2 + 4;
//     rightPairs.forEach(([lbl, val], i) => {
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.mid);
//       doc.text(lbl, midX, bannerY + 14 + i * 6);
//       doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.dark);
//       const v = String(val);
//       doc.text(v.length > 22 ? v.slice(0, 20) + '...' : v, midX + 22, bannerY + 14 + i * 6);
//     });

//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(W - 30, bannerY + 2, 20, 13, 2, 2, 'F');
//     doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
//     doc.text(pctStr, W - 20, bannerY + 10, { align: 'center' });
//     doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
//     doc.text(passed ? 'PASS' : 'FAIL', W - 20, bannerY + 15, { align: 'center' });
//     doc.setTextColor(...C.dark);

//     let cy = bannerY + bannerH + 4;

//     cy = sectionHeading(doc, 'Overall Performance', cy);
//     doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
//     doc.text(`Score: ${score} / ${maxPossible}  |  Accuracy: ${pctStr}`, 14, cy + 3);
//     const pbW = W - 28;
//     doc.setFillColor(220, 225, 235);
//     doc.roundedRect(14, cy + 6, pbW, 4, 2, 2, 'F');
//     doc.setFillColor(...(passed ? C.green : C.red));
//     doc.roundedRect(14, cy + 6, Math.max(0, pbW * Math.min(1, pct / 100)), 4, 2, 2, 'F');
//     doc.setTextColor(...C.dark);
//     cy += 15;

//     cy = sectionHeading(doc, 'Participation Metrics', cy);
//     const totalExamsAssigned  = sub.totalExamsAssigned  ?? 1;
//     const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
//     const overallParticipationPct = totalExamsAssigned > 0
//       ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100) : null;

//     autoTable(doc, {
//       ...BASE_TABLE, startY: cy,
//       head: [['Sno', 'For', 'Rating', 'Feedback']],
//       body: [
//         ['1', 'Overall Assessment',  ratingStr(overallParticipationPct), feedbackLabel(overallParticipationPct)],
//         ['2', 'Placement Readiness', ratingStr(Math.round(pct)),         feedbackLabel(Math.round(pct))],
//       ],
//       headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: metricColumnStyles(),
//       didParseCell: data => ratingCellColor(data, 2),
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     cy = sectionHeading(doc, 'Performance Metrics', cy);
//     const perfRows = allSectionNames.map((secName, i) => {
//       const pctVal = getSectionPct(sub, secName);
//       return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
//     });
//     if (mcqMax > 0 && codingMax > 0) {
//       const mcqPct    = Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100);
//       const codingPct = Math.round(((sub.codingScore ?? 0) / codingMax) * 100);
//       perfRows.push(['-', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
//       perfRows.push(['-', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
//     }
//     autoTable(doc, {
//       ...BASE_TABLE, startY: cy,
//       head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
//       body: perfRows,
//       headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: metricColumnStyles(),
//       didParseCell: data => ratingCellColor(data, 2),
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     cy = sectionHeading(doc, 'Section Score Details', cy);
//     const scoreDetailRows = allSectionNames.map(secName => {
//       const secQs    = sectionMap[secName];
//       const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
//       const brk      = sub.scoreBreakdown || [];
//       const secScore = brk.filter(b => secQs.find(q => q.id === b.questionId)).reduce((a, b) => a + (b.score || 0), 0);
//       const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '-';
//       return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
//     });
//     scoreDetailRows.push(['TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length)]);

//     autoTable(doc, {
//       ...BASE_TABLE, startY: cy,
//       head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
//       body: scoreDetailRows,
//       headStyles:   { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
//       columnStyles: {
//         0: { halign: 'left', fontStyle: 'bold', cellWidth: 80 },
//         1: { halign: 'center', cellWidth: 30 },
//         2: { halign: 'center', fontStyle: 'bold', cellWidth: 24 },
//         3: { halign: 'center', cellWidth: 20 },
//       },
//       didParseCell: data => {
//         if (data.section === 'body' && data.row.index === scoreDetailRows.length - 1)
//           data.cell.styles.fontStyle = 'bold';
//         if (data.section === 'body' && data.column.index === 2)
//           ratingCellColor(data, 2);
//       },
//     });
//     cy = doc.lastAutoTable.finalY + 5;

//     if (cy < 248) {
//       cy = sectionHeading(doc, 'Daily and Weekly Assessment Performance', cy, C.brown);
//       const crossStats = allSubmissions.length > 0 ? computeCrossExamStats(sub.studentId) : null;
//       const dailyCompleted  = crossStats?.dailyCompleted  ?? sub.dailyCompleted  ?? null;
//       const dailyAvgRaw     = crossStats?.dailyAvgScore   ?? sub.dailyAvgScore   ?? null;
//       const weeklyCompleted = crossStats?.weeklyCompleted ?? sub.weeklyCompleted  ?? null;
//       const weeklyAvgRaw    = crossStats?.weeklyAvgScore  ?? sub.weeklyAvgScore  ?? null;
//       const dailyPct  = toPercent(dailyAvgRaw,  maxPossible);
//       const weeklyPct = toPercent(weeklyAvgRaw, maxPossible);

//       autoTable(doc, {
//         ...BASE_TABLE, startY: cy,
//         head: [['Sno', 'Assessment Type', 'Completed', 'Avg Score', 'Feedback']],
//         body: [
//           ['1', 'Daily Assessments',  dailyCompleted  !== null ? String(dailyCompleted)  : '-', ratingStr(dailyPct),  feedbackLabel(dailyPct)],
//           ['2', 'Weekly Assessments', weeklyCompleted !== null ? String(weeklyCompleted) : '-', ratingStr(weeklyPct), feedbackLabel(weeklyPct)],
//         ],
//         headStyles:   { fillColor: C.brown, textColor: C.white, fontStyle: 'bold' },
//         columnStyles: dwColumnStyles(),
//         didParseCell: data => ratingCellColor(data, 3),
//       });
//       cy = doc.lastAutoTable.finalY + 5;
//     }

//     const viols = sub.violations ?? 0;
//     if (viols > 0 && cy < 272) {
//       doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.red);
//       doc.text(`WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`, 10, cy);
//       doc.setTextColor(...C.dark); doc.setFont('helvetica', 'normal');
//     }
//   }

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

    const directSnap = await getDoc(doc(db, 'colleges', collegeId));
    if (directSnap.exists()) {
      logoUrl = directSnap.data().logoUrl;
    } else {
      const q    = query(collection(db, 'colleges'), where('name', '==', collegeId));
      const snap = await getDocs(q);
      if (!snap.empty) logoUrl = snap.docs[0].data().logoUrl;
    }

    if (!logoUrl) return null;

    try {
      const response = await fetch(logoUrl, { mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error('fetch failed');
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader   = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return await new Promise((resolve) => {
        const img       = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas  = document.createElement('canvas');
          canvas.width  = img.naturalWidth  || 128;
          canvas.height = img.naturalHeight || 128;
          canvas.getContext('2d').drawImage(img, 0, 0);
          try { resolve(canvas.toDataURL('image/png')); }
          catch { resolve(null); }
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
// GET IMAGE NATURAL DIMENSIONS from a base64 data-URL
// Used to compute the correct aspect-ratio box for jsPDF addImage.
// ─────────────────────────────────────────────────────────────────────────────
function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img    = new Image();
    img.onload   = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror  = () => resolve({ w: 1, h: 1 });
    img.src      = dataUrl;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE FIT DIMENSIONS
// Fit `imgW × imgH` into a `maxW × maxH` box, preserving aspect ratio.
// Returns the final { fitW, fitH } in mm.
// ─────────────────────────────────────────────────────────────────────────────
function fitInBox(imgW, imgH, maxW, maxH) {
  if (!imgW || !imgH) return { fitW: maxW, fitH: maxH };
  const scale = Math.min(maxW / imgW, maxH / imgH);
  return { fitW: imgW * scale, fitH: imgH * scale };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER  (async — must be awaited)
//
// Layout (full-width, height 22 mm):
//
//   LEFT block  (primary blue,   0 → SPLIT):
//     • College logo — aspect-ratio preserved, centred vertically in 16×16 mm box
//     • College name  + subtitle text
//
//   RIGHT block (accent purple, SPLIT → W):
//     • MindSpark logo (public/logo.png pre-loaded as algoLogoDataUrl)
//     • "MindSpark" bold text
//     • "Powered by MindSpark" small text
//
// The AlgoSpark/MindSpark logo is loaded ONCE per report via
// `loadAlgoSparkLogo()` and passed in so it doesn't re-fetch on every page.
// ─────────────────────────────────────────────────────────────────────────────

/** Load the MindSpark/AlgoSpark logo from the public folder as base64. */
export async function loadAlgoSparkLogo() {
  // The logo lives at /logo.png in the public folder (same as HomePage uses).
  // We try three paths in order so it works regardless of dev/prod base URL.
  const candidates = ['/logo.png', './logo.png', `${window.location.origin}/logo.png`];
  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) continue;
      const blob = await res.blob();
      const b64  = await new Promise((resolve, reject) => {
        const r   = new FileReader();
        r.onload  = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      if (b64) return b64;
    } catch (_) { /* try next */ }
  }
  return null;
}

async function drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl) {
  const W       = doc.internal.pageSize.getWidth();
  const HDR_H   = 24;           // header height in mm (slightly taller for logo room)
  const RIGHT_W = 68;           // width of the right (purple) block
  const SPLIT   = W - RIGHT_W;

  // ── Background blocks ────────────────────────────────────────────────────
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, SPLIT, HDR_H, 'F');

  doc.setFillColor(...C.accent);
  doc.rect(SPLIT, 0, RIGHT_W, HDR_H, 'F');

  // ── LEFT: College logo with correct aspect ratio ─────────────────────────
  const MAX_LOGO_W = 18;   // maximum width  (mm) the logo may occupy
  const MAX_LOGO_H = 18;   // maximum height (mm) the logo may occupy
  const LOGO_PAD_X = 4;    // gap from left edge
  const LOGO_PAD_Y = 3;    // gap from top edge

  let logoDrawW = MAX_LOGO_W;
  let logoDrawH = MAX_LOGO_H;
  let logoPosX  = LOGO_PAD_X;
  // Centre vertically inside the header
  let logoPosY  = (HDR_H - MAX_LOGO_H) / 2;

  if (
    collegeLogoDataUrl &&
    typeof collegeLogoDataUrl === 'string' &&
    collegeLogoDataUrl.startsWith('data:')
  ) {
    try {
      // Get actual pixel dimensions so we can preserve aspect ratio
      const { w: imgW, h: imgH } = await getImageDimensions(collegeLogoDataUrl);
      const { fitW, fitH }       = fitInBox(imgW, imgH, MAX_LOGO_W, MAX_LOGO_H);

      logoDrawW = fitW;
      logoDrawH = fitH;
      // Horizontally: flush-left within the pad zone; vertically: centred
      logoPosX  = LOGO_PAD_X;
      logoPosY  = (HDR_H - fitH) / 2;

      const fmt = collegeLogoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(collegeLogoDataUrl, fmt, logoPosX, logoPosY, logoDrawW, logoDrawH);
    } catch (e) {
      console.warn('drawPageHeader: college logo addImage failed', e.message);
      _drawLogoPlaceholder(doc, logoPosX, logoPosY, MAX_LOGO_W, MAX_LOGO_H, collegeName);
      logoDrawW = MAX_LOGO_W;
      logoDrawH = MAX_LOGO_H;
    }
  } else {
    _drawLogoPlaceholder(doc, logoPosX, logoPosY, MAX_LOGO_W, MAX_LOGO_H, collegeName);
  }

  // ── LEFT: College name + subtitle ────────────────────────────────────────
  const textX = LOGO_PAD_X + MAX_LOGO_W + 3;   // always start text after the max logo box
  doc.setTextColor(...C.white);

  const rawName     = collegeName || 'Institution';
  const displayName = rawName.length > 32 ? rawName.slice(0, 30) + '…' : rawName;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(displayName, textX, 11);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Student Assessment Report | MindSpark Learning Hub', textX, 17);

  // ── RIGHT: MindSpark logo + text ─────────────────────────────────────────
  const rightCX   = SPLIT + RIGHT_W / 2;   // horizontal centre of right block
  const ALGO_MAX_W = 14;
  const ALGO_MAX_H = 14;

  if (
    algoLogoDataUrl &&
    typeof algoLogoDataUrl === 'string' &&
    algoLogoDataUrl.startsWith('data:')
  ) {
    try {
      const { w: aW, h: aH } = await getImageDimensions(algoLogoDataUrl);
      const { fitW, fitH }   = fitInBox(aW, aH, ALGO_MAX_W, ALGO_MAX_H);

      // Place the logo centred horizontally, near the top of the right block
      const algoPosX = rightCX - fitW / 2;
      const algoPosY = (HDR_H / 2 - fitH) / 2;   // upper half

      const aFmt = algoLogoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(algoLogoDataUrl, aFmt, algoPosX, algoPosY, fitW, fitH);

      // Text below the logo — "AlgoSpark" bold, "Powered by MindSpark" small
      doc.setTextColor(...C.white);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('AlgoSpark', rightCX, algoPosY + fitH + 4.5, { align: 'center' });

      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Powered by MindSpark', rightCX, algoPosY + fitH + 9, { align: 'center' });
    } catch (e) {
      // Fallback: text-only right block
      _drawRightBlockTextOnly(doc, rightCX, HDR_H);
    }
  } else {
    _drawRightBlockTextOnly(doc, rightCX, HDR_H);
  }

  doc.setTextColor(...C.dark);
}

/** Text-only fallback for the right header block when logo is unavailable. */
function _drawRightBlockTextOnly(doc, rightCX, HDR_H) {
  doc.setTextColor(...C.white);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('AlgoSpark', rightCX, HDR_H / 2 - 1, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by MindSpark', rightCX, HDR_H / 2 + 5, { align: 'center' });
}

function _drawLogoPlaceholder(doc, x, y, w, h, collegeName) {
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  doc.setTextColor(...C.primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(
    (collegeName || 'C').charAt(0).toUpperCase(),
    x + w / 2,
    y + h / 2 + 4,
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
  doc.text('AlgoSpark | Powered by MindSpark Learning Hub', 10, H - 5);
  doc.text(`Page ${pageNum} of ${totalPages}`, W / 2, H - 5, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, W - 10, H - 5, { align: 'right' });
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT BOXES
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

const METRIC_COL_WIDTHS = {
  sno:      10,
  for_:     72,
  rating:   22,
  feedback: null,
};

const DW_COL_WIDTHS = {
  sno:       10,
  type:      60,
  completed: 24,
  rating:    22,
  feedback:  null,
};

function metricColumnStyles() {
  return {
    0: { cellWidth: METRIC_COL_WIDTHS.sno,   halign: 'center' },
    1: { cellWidth: METRIC_COL_WIDTHS.for_,  halign: 'left'   },
    2: { cellWidth: METRIC_COL_WIDTHS.rating, halign: 'center', fontStyle: 'bold' },
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
// OVERALL REPORT  (now async — loads logos before drawing)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateOverallReport({
  examTitle,
  exam,
  submissions,
  questions,
  collegeName,
  collegeLogoDataUrl,
}) {
  // Pre-load the MindSpark logo once; reuse across all pages
  const algoLogoDataUrl = await loadAlgoSparkLogo();

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
  await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text('MINDSPARK LEARNING HUB - OVERALL REPORT', W / 2, 32, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.mid);
  const dayLabel = exam?.dayNumber
    ? `Consolidated Report - Day ${exam.dayNumber}`
    : 'Consolidated Report';
  doc.text(dayLabel, W / 2, 38, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.dark);
  doc.text(examTitle || 'Grand Test', W / 2, 44, { align: 'center' });

  let cy = drawStatBoxes(doc, [
    { label: 'Total Attempts', value: total,             color: C.primary },
    { label: 'Completed',      value: completed,         color: C.green   },
    { label: 'Qualified',      value: qualified,         color: C.accent  },
    { label: 'Not Qualified',  value: total - qualified, color: C.red     },
    { label: 'Highest %',      value: highestPct,        color: C.teal    },
  ], 50);
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
        return [dept, String(attempted), String(Math.max(0, registered - attempted)), String(registered)];
      }),
      headStyles:   { fillColor: C.primary, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 55 },
        1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
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
        1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
      },
    });
    cy = doc.lastAutoTable.finalY + 5;
  }

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
        1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
      },
    });
    cy = doc.lastAutoTable.finalY + 5;
  }

  // ── PAGE 2 ────────────────────────────────────────────────────────────────
  doc.addPage();
  await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
  cy = 30;

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
      ['Platform',           'MindSpark Learning Hub | Powered by MindSpark'],
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
    const secBody = Object.entries(sectionBreakdown).map(([k, v]) => [k, String(v.count), String(v.marks)]);
    secBody.push(['TOTAL', String(questions.length), String(maxPossible)]);
    autoTable(doc, {
      ...BASE_TABLE,
      startY: cy,
      head: [['SECTION / MODULE', 'QUESTIONS COUNT', 'MARKS']],
      body: secBody,
      headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 90 },
        1: { halign: 'center' }, 2: { halign: 'center' },
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
  await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
  cy = 30;

  if (deptKeys.length) {
    drawPieChart(doc, 40, cy + 28, 22, [
      { label: 'Attempted',     value: total,                          color: C.green       },
      { label: 'Not Attempted', value: Math.max(0, notAttemptedTotal), color: [210,220,235] },
    ], 'Attendance Overview');
    cy += 68;
  }

  const overallDist = scoreDistribution(submissions, maxPossible).reverse();
  cy = drawBarChart(doc, 14, cy, W - 28, 50,
    overallDist.map(d => ({ label: d.label, value: d.value })),
    'Overall Performance - Student Score Distribution', C.blue);

  for (const [secName, secData] of Object.entries(sectionBreakdown)) {
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
      await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
      cy = 30;
    }
    cy = drawBarChart(doc, 14, cy, W - 28, 48,
      dist.map(d => ({ label: d.label, value: d.value })),
      `${secName} - Student Score Distribution`, C.blue);
  }

  // ── PAGE 4: Rankings ───────────────────────────────────────────────────────
  doc.addPage();
  await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
  cy = 30;

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
    String(i + 1), s.studentName || '-', s.studentRegNo || '-',
    s.branch || s.department || '-', s.section || '-',
    String(s.totalScore ?? 0),
    maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(2)}%` : '0.00%',
  ];

  cy = sectionHeading(doc, 'Top 10 Students', cy, C.green);
  autoTable(doc, {
    ...BASE_TABLE, startY: cy,
    head: rankHead,
    body: sorted.slice(0, 10).map(rankRow),
    headStyles:   { fillColor: C.green, textColor: C.white, fontStyle: 'bold' },
    columnStyles: rankCols,
  });
  cy = doc.lastAutoTable.finalY + 6;

  cy = sectionHeading(doc, 'Bottom 10 Students', cy, C.red);
  autoTable(doc, {
    ...BASE_TABLE, startY: cy,
    head: rankHead,
    body: bottom.slice(0, 10).map(rankRow),
    headStyles:   { fillColor: C.red, textColor: C.white, fontStyle: 'bold' },
    columnStyles: rankCols,
  });
  cy = doc.lastAutoTable.finalY + 6;

  if (cy > 210) {
    doc.addPage();
    await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);
    cy = 30;
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
        `${i + 1}`, s.studentName || '-', s.studentRegNo || '-',
        s.branch || s.department || '-', s.section || '-',
        ...secScores,
        String(s.totalScore ?? 0),
        maxPossible > 0 ? `${(((s.totalScore ?? 0) / maxPossible) * 100).toFixed(1)}%` : '0.0%',
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
// STUDENT-WISE REPORT  (now async)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStudentWiseReport({
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

  const algoLogoDataUrl = await loadAlgoSparkLogo();

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

  const mcqQs     = questions.filter(q => (q.type || '').toUpperCase() === 'MCQ');
  const codingQs  = questions.filter(q => (q.type || '').toUpperCase() === 'CODING');
  const mcqMax    = mcqQs.reduce((a, q)    => a + (q.marks || 0), 0);
  const codingMax = codingQs.reduce((a, q) => a + (q.marks || 0), 0);

  const examTypeOf = examId => {
    const found = allExams.find(e => e.id === examId);
    return (found?.examType || found?.type || 'EXAM').toUpperCase();
  };

  const computeCrossExamStats = studentId => {
    const studentSubs = allSubmissions.filter(s => s.studentId === studentId && s.status === 'completed');
    const daily  = studentSubs.filter(s => examTypeOf(s.examId) === 'DAILY');
    const weekly = studentSubs.filter(s => examTypeOf(s.examId) === 'WEEKLY');
    const avgOf  = arr => arr.length ? Math.round(arr.reduce((a, s) => a + (s.totalScore ?? s.score ?? 0), 0) / arr.length) : 0;
    return { dailyCompleted: daily.length, dailyAvgScore: avgOf(daily), weeklyCompleted: weekly.length, weeklyAvgScore: avgOf(weekly) };
  };

  const getSectionPct = (sub, secName) => {
    const secQs  = sectionMap[secName];
    if (!secQs || !secQs.length) return null;
    const secMax = secQs.reduce((a, q) => a + (q.marks || 0), 0);
    if (secMax === 0) return null;
    const brk      = sub.scoreBreakdown || [];
    const secScore = brk.filter(b => secQs.find(q => q.id === b.questionId)).reduce((a, b) => a + (b.score || 0), 0);
    return Math.round((secScore / secMax) * 100);
  };

  const toPercent = (val, max) => {
    if (val === null || val === undefined) return null;
    if (max <= 0) return null;
    if (val <= 1)  return Math.round(val * 100);
    if (val > 100) return Math.round((val / max) * 100);
    return Math.round(val);
  };

  for (let idx = 0; idx < sorted.length; idx++) {
    const sub = sorted[idx];
    if (idx > 0) doc.addPage();
    await drawPageHeader(doc, collegeLogoDataUrl, collegeName, algoLogoDataUrl);

    const score  = sub.totalScore ?? 0;
    const pct    = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    const pctStr = `${pct.toFixed(0)}%`;
    const status = overallStatus(pct);
    const passed = pct >= 40;

    const bannerY = 27;
    const bannerH = 32;
    doc.setFillColor(...C.light);
    doc.roundedRect(10, bannerY, W - 20, bannerH, 3, 3, 'F');
    doc.setFillColor(...C.primary);
    doc.roundedRect(10, bannerY, 4, bannerH, 2, 2, 'F');

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.dark);
    doc.text('MindSpark - Student Performance Report', W / 2, bannerY + 8, { align: 'center' });

    const leftPairs = [
      ['Student Name:', sub.studentName  || '-'],
      ['Student ID:',   sub.studentRegNo || sub.studentId || '-'],
      ['Status:',       status],
    ];
    leftPairs.forEach(([lbl, val], i) => {
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.mid);
      doc.text(lbl, 17, bannerY + 14 + i * 6);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.dark);
      doc.text(String(val), 52, bannerY + 14 + i * 6);
    });

    const rightPairs = [
      ['Branch:',  sub.branch || sub.department || '-'],
      ['Section:', sub.section || exam?.batch || '-'],
      ['Exam:',    examTitle || '-'],
    ];
    const midX = W / 2 + 4;
    rightPairs.forEach(([lbl, val], i) => {
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.mid);
      doc.text(lbl, midX, bannerY + 14 + i * 6);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.dark);
      const v = String(val);
      doc.text(v.length > 22 ? v.slice(0, 20) + '...' : v, midX + 22, bannerY + 14 + i * 6);
    });

    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(W - 30, bannerY + 2, 20, 13, 2, 2, 'F');
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.white);
    doc.text(pctStr, W - 20, bannerY + 10, { align: 'center' });
    doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
    doc.text(passed ? 'PASS' : 'FAIL', W - 20, bannerY + 15, { align: 'center' });
    doc.setTextColor(...C.dark);

    let cy = bannerY + bannerH + 4;

    cy = sectionHeading(doc, 'Overall Performance', cy);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.mid);
    doc.text(`Score: ${score} / ${maxPossible}  |  Accuracy: ${pctStr}`, 14, cy + 3);
    const pbW = W - 28;
    doc.setFillColor(220, 225, 235);
    doc.roundedRect(14, cy + 6, pbW, 4, 2, 2, 'F');
    doc.setFillColor(...(passed ? C.green : C.red));
    doc.roundedRect(14, cy + 6, Math.max(0, pbW * Math.min(1, pct / 100)), 4, 2, 2, 'F');
    doc.setTextColor(...C.dark);
    cy += 15;

    cy = sectionHeading(doc, 'Participation Metrics', cy);
    const totalExamsAssigned  = sub.totalExamsAssigned  ?? 1;
    const totalExamsAttempted = sub.totalExamsAttempted ?? (sub.status === 'completed' ? 1 : 0);
    const overallParticipationPct = totalExamsAssigned > 0
      ? Math.round((totalExamsAttempted / totalExamsAssigned) * 100) : null;

    autoTable(doc, {
      ...BASE_TABLE, startY: cy,
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

    cy = sectionHeading(doc, 'Performance Metrics', cy);
    const perfRows = allSectionNames.map((secName, i) => {
      const pctVal = getSectionPct(sub, secName);
      return [String(i + 1), secName, ratingStr(pctVal), feedbackLabel(pctVal)];
    });
    if (mcqMax > 0 && codingMax > 0) {
      const mcqPct    = Math.round(((sub.mcqScore    ?? 0) / mcqMax)    * 100);
      const codingPct = Math.round(((sub.codingScore ?? 0) / codingMax) * 100);
      perfRows.push(['-', 'MCQ Total',    ratingStr(mcqPct),    feedbackLabel(mcqPct)]);
      perfRows.push(['-', 'Coding Total', ratingStr(codingPct), feedbackLabel(codingPct)]);
    }
    autoTable(doc, {
      ...BASE_TABLE, startY: cy,
      head: [['Sno', 'Section / Module', 'Rating', 'Feedback']],
      body: perfRows,
      headStyles:   { fillColor: C.accent, textColor: C.white, fontStyle: 'bold' },
      columnStyles: metricColumnStyles(),
      didParseCell: data => ratingCellColor(data, 2),
    });
    cy = doc.lastAutoTable.finalY + 5;

    cy = sectionHeading(doc, 'Section Score Details', cy);
    const scoreDetailRows = allSectionNames.map(secName => {
      const secQs    = sectionMap[secName];
      const secMax   = secQs.reduce((a, q) => a + (q.marks || 0), 0);
      const brk      = sub.scoreBreakdown || [];
      const secScore = brk.filter(b => secQs.find(q => q.id === b.questionId)).reduce((a, b) => a + (b.score || 0), 0);
      const secPct   = secMax > 0 ? `${Math.round((secScore / secMax) * 100)}%` : '-';
      return [secName, `${secScore} / ${secMax}`, secPct, String(secQs.length)];
    });
    scoreDetailRows.push(['TOTAL', `${score} / ${maxPossible}`, pctStr, String(questions.length)]);

    autoTable(doc, {
      ...BASE_TABLE, startY: cy,
      head: [['Section / Module', 'Score', 'Accuracy', 'Questions']],
      body: scoreDetailRows,
      headStyles:   { fillColor: C.teal, textColor: C.white, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 80 },
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

    if (cy < 248) {
      cy = sectionHeading(doc, 'Daily and Weekly Assessment Performance', cy, C.brown);
      const crossStats = allSubmissions.length > 0 ? computeCrossExamStats(sub.studentId) : null;
      const dailyCompleted  = crossStats?.dailyCompleted  ?? sub.dailyCompleted  ?? null;
      const dailyAvgRaw     = crossStats?.dailyAvgScore   ?? sub.dailyAvgScore   ?? null;
      const weeklyCompleted = crossStats?.weeklyCompleted ?? sub.weeklyCompleted  ?? null;
      const weeklyAvgRaw    = crossStats?.weeklyAvgScore  ?? sub.weeklyAvgScore  ?? null;
      const dailyPct  = toPercent(dailyAvgRaw,  maxPossible);
      const weeklyPct = toPercent(weeklyAvgRaw, maxPossible);

      autoTable(doc, {
        ...BASE_TABLE, startY: cy,
        head: [['Sno', 'Assessment Type', 'Completed', 'Avg Score', 'Feedback']],
        body: [
          ['1', 'Daily Assessments',  dailyCompleted  !== null ? String(dailyCompleted)  : '-', ratingStr(dailyPct),  feedbackLabel(dailyPct)],
          ['2', 'Weekly Assessments', weeklyCompleted !== null ? String(weeklyCompleted) : '-', ratingStr(weeklyPct), feedbackLabel(weeklyPct)],
        ],
        headStyles:   { fillColor: C.brown, textColor: C.white, fontStyle: 'bold' },
        columnStyles: dwColumnStyles(),
        didParseCell: data => ratingCellColor(data, 3),
      });
      cy = doc.lastAutoTable.finalY + 5;
    }

    const viols = sub.violations ?? 0;
    if (viols > 0 && cy < 272) {
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.red);
      doc.text(`WARNING: ${viols} proctoring violation${viols > 1 ? 's' : ''} recorded during this exam.`, 10, cy);
      doc.setTextColor(...C.dark); doc.setFont('helvetica', 'normal');
    }
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, i, totalPages);
  }
  doc.save(`AlgoSpark_StudentWise_Report_${(examTitle || 'Exam').replace(/\s+/g, '_')}.pdf`);
}
