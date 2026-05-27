// ————— Anti-abuse fingerprint helpers —————
async function blurtSha256Hex(input) {
	const text = String(input || '');
	if (window.crypto && crypto.subtle && window.TextEncoder) {
		const data = new TextEncoder().encode(text);
		const digest = await crypto.subtle.digest('SHA-256', data);
		return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	// Fallback only for very old browsers. It is not cryptographic, but keeps the form usable.
	let h1 = 0x811c9dc5;
	let h2 = 0x01000193;
	for (let i = 0; i < text.length; i += 1) {
		h1 ^= text.charCodeAt(i);
		h1 = Math.imul(h1, 16777619);
		h2 ^= text.charCodeAt(text.length - 1 - i);
		h2 = Math.imul(h2, 2166136261);
	}
	const part = ((h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0'));
	return (part + part + part + part).slice(0, 64);
}

function blurtReadCookie(name) {
	const needle = `${name}=`;
	return document.cookie.split(';').map((x) => x.trim()).find((x) => x.startsWith(needle))?.slice(needle.length) || '';
}

function blurtWriteCookie(name, value, days) {
	const maxAge = Math.max(1, Number(days || 365)) * 24 * 60 * 60;
	document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function blurtRandomId() {
	if (window.crypto && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	const bytes = new Uint8Array(16);
	if (window.crypto && crypto.getRandomValues) {
		crypto.getRandomValues(bytes);
	} else {
		for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
	}
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function blurtGetBrowserId() {
	const key = 'blurt_creator_browser_id';
	let id = '';

	try {
		id = localStorage.getItem(key) || '';
	} catch (err) {}

	if (!id) {
		id = decodeURIComponent(blurtReadCookie(key) || '');
	}

	if (!id || id.length > 128) {
		id = blurtRandomId();
	}

	try {
		localStorage.setItem(key, id);
	} catch (err) {}

	blurtWriteCookie(key, id, 365);
	return id;
}

function blurtGetWebglInfo() {
	try {
		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		if (!gl) return '';
		const dbg = gl.getExtension('WEBGL_debug_renderer_info');
		if (!dbg) return '';
		const vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '';
		const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '';
		return `${vendor} | ${renderer}`.slice(0, 300);
	} catch (err) {
		return '';
	}
}

async function blurtGetCanvasHash() {
	try {
		const canvas = document.createElement('canvas');
		canvas.width = 240;
		canvas.height = 60;
		const ctx = canvas.getContext('2d');
		if (!ctx) return '';
		ctx.textBaseline = 'top';
		ctx.font = '16px Arial';
		ctx.fillStyle = '#123456';
		ctx.fillRect(0, 0, 240, 60);
		ctx.fillStyle = '#abcdef';
		ctx.fillText('Blurt account creator fingerprint', 8, 8);
		ctx.fillStyle = 'rgba(255,255,255,0.55)';
		ctx.fillText(String(new Date(1700000000000).getTimezoneOffset()), 8, 32);
		return await blurtSha256Hex(canvas.toDataURL());
	} catch (err) {
		return '';
	}
}

async function blurtCollectFingerprint() {
	const canvasHash = await blurtGetCanvasHash();
	const data = {
		v: 1,
		ua: navigator.userAgent || '',
		platform: navigator.platform || '',
		language: navigator.language || '',
		languages: Array.isArray(navigator.languages) ? navigator.languages.join(',') : '',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
		tzOffset: new Date().getTimezoneOffset(),
		screen: `${screen?.width || 0}x${screen?.height || 0}x${screen?.colorDepth || 0}`,
		availScreen: `${screen?.availWidth || 0}x${screen?.availHeight || 0}`,
		dpr: window.devicePixelRatio || 1,
		hardwareConcurrency: navigator.hardwareConcurrency || 0,
		deviceMemory: navigator.deviceMemory || 0,
		maxTouchPoints: navigator.maxTouchPoints || 0,
		webdriver: navigator.webdriver ? 1 : 0,
		webgl: blurtGetWebglInfo(),
		canvas: canvasHash
	};

	return await blurtSha256Hex(JSON.stringify(data));
}

async function blurtSolveProofOfWork(email, started, fingerprintHash, browserId, difficulty) {
	const zeros = '0'.repeat(Math.max(2, Math.min(5, Number(difficulty || 3))));
	const cleanEmail = String(email || '').trim().toLowerCase();
	const base = `${cleanEmail}|${started}|${fingerprintHash}|${browserId}|`;
	const maxIterations = 500000;

	for (let i = 0; i < maxIterations; i += 1) {
		const nonce = i.toString(36) + ':' + Math.random().toString(36).slice(2, 8);
		const hash = await blurtSha256Hex(base + nonce);
		if (hash.startsWith(zeros)) {
			return nonce;
		}

		if (i > 0 && i % 500 === 0) {
			await new Promise((resolve) => setTimeout(resolve, 0));
		}
	}

	throw new Error('Proof of work failed.');
}

async function blurtBuildAntiAbusePayload(options = {}) {
	const browserId = blurtGetBrowserId();
	const fingerprintHash = await blurtCollectFingerprint();
	const payload = {
		fingerprint_hash: fingerprintHash,
		browser_id: browserId,
		webdriver: navigator.webdriver ? '1' : '0'
	};

	if (options.includePow) {
		payload.pow_nonce = await blurtSolveProofOfWork(
			options.email || '',
			options.started || '',
			fingerprintHash,
			browserId,
			options.difficulty || window.registerPowDifficulty || 3
		);
	}

	return payload;
}


// === script.js (CAŁOŚĆ, po poprawkach) =====================================
let currentVoucherOwner = "";

function normalizeBlurtUsername(value) {
  if (typeof value !== "string") {
    return "";
  }

  value = value.trim().toLowerCase();

  if (value.length < 3) {
    return "";
  }

  const re = /^(?=.{3,16}$)[a-z][0-9a-z-]{1,}[0-9a-z](\.[a-z][0-9a-z-]{1,}[0-9a-z])*$/;
  return re.test(value) ? value : "";
}

function resetReferrerUI() {
  currentVoucherOwner = "";

  const refWrap = document.getElementById("voucher-owner-ref-wrap");
  const refInfo = document.getElementById("voucher-owner-info");
  const checkbox = document.getElementById("use_voucher_owner_as_referrer");
  const customWrap = document.getElementById("custom-referrer-wrap");
  const customInput = document.getElementById("custom_referrer");

  if (refWrap) {
    refWrap.style.display = "none";
  }

  if (refInfo) {
    refInfo.textContent = t("form.voucher_owner_info_default");
  }

  if (checkbox) {
    checkbox.checked = true;
  }

  if (customWrap) {
    customWrap.style.display = "none";
  }

  if (customInput) {
    customInput.value = "";
  }
}

function updateReferrerUI(voucherOwner) {
  const normalizedOwner = normalizeBlurtUsername(voucherOwner);

  const refWrap = document.getElementById("voucher-owner-ref-wrap");
  const refInfo = document.getElementById("voucher-owner-info");
  const checkbox = document.getElementById("use_voucher_owner_as_referrer");
  const customWrap = document.getElementById("custom-referrer-wrap");

  currentVoucherOwner = normalizedOwner;

  if (!normalizedOwner) {
    resetReferrerUI();
    return;
  }

  if (refWrap) {
    refWrap.style.display = "block";
  }

  if (refInfo) {
    refInfo.textContent = `${t("form.voucher_owner_prefix")} @${normalizedOwner}`;
  }

  if (checkbox) {
    checkbox.checked = true;
  }

  if (customWrap) {
    customWrap.style.display = "none";
  }
}

function toggleCustomReferrerField() {
  const checkbox = document.getElementById("use_voucher_owner_as_referrer");
  const customWrap = document.getElementById("custom-referrer-wrap");

  if (!checkbox || !customWrap) {
    return;
  }

  if (!currentVoucherOwner) {
    customWrap.style.display = "none";
    return;
  }

  customWrap.style.display = checkbox.checked ? "none" : "block";
}

function getSelectedReferrerCandidate() {
  const checkbox = document.getElementById("use_voucher_owner_as_referrer");
  const customInput = document.getElementById("custom_referrer");

  if (currentVoucherOwner && checkbox && checkbox.checked) {
    return currentVoucherOwner;
  }

  if (customInput) {
    return normalizeBlurtUsername(customInput.value);
  }

  return "";
}

// ————— Inicjalizacja po DOM —————
window.addEventListener('DOMContentLoaded', () => {
  const voucherInput = document.getElementById("voucher_code");
  const skipEmail = document.getElementById("skip_email");
  const refCheckbox = document.getElementById("use_voucher_owner_as_referrer");

  resetReferrerUI();
  toggleEmailOption();

  if (voucherInput) {
    const triggerValidation = async () => {
      const code = voucherInput.value.trim();

      if (code.length >= 16) {
        await validateVoucherCode();
      } else {
        const status = document.getElementById("voucher-status");
        if (status) {
          status.textContent = t("form.voucher_too_short");
          status.className = "text-danger";
        }
        resetReferrerUI();
      }
    };

    voucherInput.addEventListener("input", triggerValidation);
    voucherInput.addEventListener("change", triggerValidation);
    voucherInput.addEventListener("blur", triggerValidation);

    if (window.prefilledVoucher && !voucherInput.value.trim()) {
      voucherInput.value = window.prefilledVoucher;
    }

    if (voucherInput.value.trim().length >= 16) {
      triggerValidation();
    }
  }

  if (skipEmail) {
    skipEmail.addEventListener("change", toggleEmailOption);
  }

  if (refCheckbox) {
    refCheckbox.addEventListener("change", toggleCustomReferrerField);
  }

  toggleEmailOption();
  toggleCustomReferrerField();

  if (window.fakeMode) {
    const maintenance = document.getElementById("maintenance_notice");
    if (maintenance) {
      maintenance.style.display = "block";
    }
  }
});

// ————— Voucher —————
async function validateVoucherCode() {
  const code = document.getElementById("voucher_code").value.trim();
  const status = document.getElementById("voucher-status");

  if (!code || code.length < 16) {
    status.textContent = t("form.voucher_too_short");
    status.className = "text-danger";
    resetReferrerUI();
    return false;
  }

  try {
    const res = await fetch("validate_voucher_proxy.php", {
      method: "POST",
      body: new URLSearchParams({ code })
    });

    const data = await res.json();

    if (data.valid) {
      status.textContent = `${t("form.voucher_valid")} ${data.remaining_uses}`;
      status.className = "text-success";

      if (data.has_voucher_owner && data.voucher_owner) {
        updateReferrerUI(data.voucher_owner);
      } else {
        resetReferrerUI();
      }

      return true;
    }

    switch (data.reason) {
      case "invalid_format":
        status.textContent = t("form.voucher_invalid_format");
        break;
      case "not_found":
        status.textContent = t("form.voucher_not_found");
        break;
      case "limit_reached":
        status.textContent = t("form.voucher_limit_reached");
        break;
      case "db_prepare_error":
        status.textContent = t("form.voucher_db_error");
        break;
      default:
        status.textContent = t("form.voucher_invalid_generic");
    }

    status.className = "text-danger";
    resetReferrerUI();
    return false;
  } catch (e) {
    status.textContent = t("form.voucher_validation_error");
    status.className = "text-warning";
    resetReferrerUI();
    return false;
  }
}

// ————— Email / skip —————
function toggleEmailOption() {
  const skip = document.getElementById('skip_email').checked;
  const section = document.getElementById('email_encrypt_section');
  const encInput = document.getElementById('encryptionEmail');
  const encInput1 = document.getElementById('encryptionPassword');

  if (skip) {
    section.style.display = 'none';
    encInput.required = false;
    encInput1.required = false;
  } else {
    section.style.display = 'block';
    encInput.required = true;
    encInput1.required = true;
  }
}

function showKeySection() {
  const skipEmail = document.getElementById('skip_email').checked;

  if (!skipEmail) {
    const email = document.querySelector('input[name="email"]').value.trim();
    const pass  = document.getElementById('encryptionPassword').value.trim();

    if (!email) {
      alert("Complete your email.");
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      alert("Please provide a valid email address.");
      return;
    }

    if (!pass) {
      alert("Enter your encryption password.");
      return;
    }
  }

  document.getElementById("keys-section").style.display = "block";
}

// ————— Backup do pliku —————
function downloadKeysFile(username, keys, master) {
  const content = [
    "============================",
    " BLURT Account Backup File",
    "============================",
    "",
    "Username:           " + username,
    "Master Password:    " + master,
    "",
    "IMPORTANT: This master password (also known as seed) can regenerate all your keys.",
    "Store it safely and do not share it with anyone.",
    "",
    "----- PRIVATE KEYS -----",
    "Owner:   " + keys.owner,
    "Active:  " + keys.active,
    "Posting: " + keys.posting,
    "Memo:    " + keys.memo,
    "",
    "Generated on: " + new Date().toISOString(),
    ""
  ].join("\n");

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = username + "_blurt_keys_backup.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}


// ————— Stan ostatniego backupu lokalnego —————
let lastBackupData = null;

function rememberBackupData(username, keys, master) {
	lastBackupData = {
		username: String(username || ''),
		master: String(master || ''),
		keys: {
			owner: String((keys && keys.owner) || ''),
			active: String((keys && keys.active) || ''),
			posting: String((keys && keys.posting) || ''),
			memo: String((keys && keys.memo) || '')
		}
	};
}

// ————— QR + PDF backup helpers —————
function qrEscapeHtml(value) {
	return String(value || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function pdfEscapeText(value) {
	return String(value || '')
		.replace(/\\/g, '\\\\')
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/[\r\n\t]+/g, ' ');
}

function pdfSafeFilename(value) {
	return String(value || 'blurt-account')
		.toLowerCase()
		.replace(/[^a-z0-9._-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '') || 'blurt-account';
}

function validateBackupData(username, keys, master) {
	const cleanUsername = String(username || '').trim().toLowerCase();
	const cleanMaster = String(master || '').trim();
	const cleanKeys = keys || {};

	if (!/^[a-z0-9.-]{3,16}$/.test(cleanUsername)) {
		throw new Error('Backup username is missing or invalid. PDF generation stopped.');
	}

	if (cleanMaster.length < 20 || !cleanMaster.startsWith('P5')) {
		throw new Error('Master Password is missing or has unexpected format. PDF generation stopped.');
	}

	for (const keyName of ['owner', 'active', 'posting', 'memo']) {
		const keyValue = String(cleanKeys[keyName] || '').trim();
		if (keyValue.length < 20 || !keyValue.startsWith('5')) {
			throw new Error('Private key is missing or has unexpected format: ' + keyName);
		}
	}
}


async function validatePdfBlob(blob) {
	if (!blob || blob.size < 5000) {
		throw new Error('Generated PDF is too small or empty.');
	}

	const header = await blob.slice(0, 8).text();
	if (!header.startsWith('%PDF-')) {
		throw new Error('Generated file is not a valid PDF.');
	}

	return true;
}

function pdfWrapText(text, maxChars) {
	const words = String(text || '').split(/\s+/);
	const lines = [];
	let line = '';

	for (const word of words) {
		if (!word) continue;

		if (word.length > maxChars) {
			if (line) {
				lines.push(line);
				line = '';
			}

			for (let i = 0; i < word.length; i += maxChars) {
				lines.push(word.slice(i, i + maxChars));
			}
			continue;
		}

		const candidate = line ? line + ' ' + word : word;
		if (candidate.length > maxChars) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}

	if (line) lines.push(line);
	return lines;
}

function forceDownloadFile(blob, filename) {
	// Firefox na części konfiguracji potrafi po pobraniu automatycznie otworzyć plik PDF
	// w bieżącej karcie, nawet gdy używamy a[download]. Żeby zachować zachowanie jak przy
	// dawnym pliku TXT, do samego mechanizmu pobierania przekazujemy neutralny MIME.
	// Zawartość pozostaje prawidłowym PDF-em, nazwa zostaje .pdf, ale przeglądarka nie
	// powinna uruchamiać własnego podglądu PDF od razu po kliknięciu.
	const isPdf = String(filename || '').toLowerCase().endsWith('.pdf');
	const downloadBlob = isPdf
		? new Blob([blob], { type: 'text/plain' })
		: blob;

	const url = window.URL.createObjectURL(downloadBlob);
	const a = document.createElement('a');

	a.href = url;
	a.download = filename;
	a.rel = 'noopener';
	a.style.display = 'none';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	setTimeout(() => {
		window.URL.revokeObjectURL(url);
	}, 5000);
}

async function loadPdfLogoImage() {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			try {
				const maxSize = 64;
				const ratio = img.width && img.height ? Math.min(maxSize / img.width, maxSize / img.height, 1) : 1;
				const width = Math.max(1, Math.round(img.width * ratio));
				const height = Math.max(1, Math.round(img.height * ratio));
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d', { willReadFrequently: true });

				// PDF XObject poniżej używa RGB, więc PNG z kanałem alfa musi zostać
				// spłaszczony na białym tle. Inaczej część viewerów pokazuje alfę jako czarny prostokąt.
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);

				const data = ctx.getImageData(0, 0, width, height).data;
				let hex = '';
				for (let i = 0; i < data.length; i += 4) {
					hex += data[i].toString(16).padStart(2, '0');
					hex += data[i + 1].toString(16).padStart(2, '0');
					hex += data[i + 2].toString(16).padStart(2, '0');
				}

				resolve({
					name: 'Logo',
					width,
					height,
					hex,
					displayWidth: 42,
					displayHeight: Math.max(1, 42 * height / width)
				});
			} catch (err) {
				console.error('PDF logo processing error:', err);
				resolve(null);
			}
		};
		img.onerror = () => resolve(null);
		img.decoding = 'async';
		img.src = '/account/img/logo.png';
	});
}

function createPdfDocument(pages, images) {
	const pageWidth = 595.28;
	const pageHeight = 841.89;
	const objects = [];
	const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

	objects.push('<< /Type /Catalog /Pages 2 0 R >>');

	const pageObjectNumbers = [];
	for (let i = 0; i < pages.length; i++) {
		pageObjectNumbers.push(4 + i * 2);
	}

	objects.push('<< /Type /Pages /Kids [' + pageObjectNumbers.map(n => n + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>');
	objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

	const firstImageObjectNumber = 4 + pages.length * 2;
	const imageRefs = [];
	for (let i = 0; i < safeImages.length; i++) {
		const img = safeImages[i];
		imageRefs.push('/' + img.name + ' ' + (firstImageObjectNumber + i) + ' 0 R');
	}
	const xObjectResource = imageRefs.length ? ' /XObject << ' + imageRefs.join(' ') + ' >>' : '';

	for (let i = 0; i < pages.length; i++) {
		const pageObjNum = 4 + i * 2;
		const contentObjNum = pageObjNum + 1;
		objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pageWidth + ' ' + pageHeight + '] /Resources << /Font << /F1 3 0 R >>' + xObjectResource + ' >> /Contents ' + contentObjNum + ' 0 R >>');
		objects.push('<< /Length ' + pages[i].length + ' >>\nstream\n' + pages[i] + '\nendstream');
	}

	for (const img of safeImages) {
		objects.push('<< /Type /XObject /Subtype /Image /Width ' + img.width + ' /Height ' + img.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /ASCIIHexDecode /Length ' + (img.hex.length + 1) + ' >>\nstream\n' + img.hex + '>\nendstream');
	}

	let pdf = '%PDF-1.4\n% generated by Blurt account creator\n';
	const offsets = [0];

	for (let i = 0; i < objects.length; i++) {
		offsets.push(pdf.length);
		pdf += (i + 1) + ' 0 obj\n' + objects[i] + '\nendobj\n';
	}

	const xrefOffset = pdf.length;
	pdf += 'xref\n0 ' + (objects.length + 1) + '\n';
	pdf += '0000000000 65535 f \n';

	for (let i = 1; i < offsets.length; i++) {
		pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
	}

	pdf += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\n';
	pdf += 'startxref\n' + xrefOffset + '\n%%EOF';

	return new Blob([pdf], { type: 'application/pdf' });
}

function makePdfPageBuilder() {
	const pageHeight = 841.89;
	let content = '';

	function yPdf(yTop) {
		return pageHeight - yTop;
	}

	return {
		fillColor(r, g, b) {
			content += Number(r).toFixed(3) + ' ' + Number(g).toFixed(3) + ' ' + Number(b).toFixed(3) + ' rg\n';
		},
		text(value, x, yTop, size = 10, bold = false) {
			const escaped = pdfEscapeText(value);
			content += 'BT /F1 ' + size + ' Tf ' + x.toFixed(2) + ' ' + yPdf(yTop).toFixed(2) + ' Td (' + escaped + ') Tj ET\n';
		},
		rect(x, yTop, width, height) {
			content += x.toFixed(2) + ' ' + (yPdf(yTop) - height).toFixed(2) + ' ' + width.toFixed(2) + ' ' + height.toFixed(2) + ' re f\n';
		},
		line(x1, y1Top, x2, y2Top) {
			content += x1.toFixed(2) + ' ' + yPdf(y1Top).toFixed(2) + ' m ' + x2.toFixed(2) + ' ' + yPdf(y2Top).toFixed(2) + ' l S\n';
		},
		circle(cx, cyTop, radius) {
			const c = radius * 0.5522847498;
			const cy = yPdf(cyTop);
			content += (cx + radius).toFixed(2) + ' ' + cy.toFixed(2) + ' m '
				+ (cx + radius).toFixed(2) + ' ' + (cy + c).toFixed(2) + ' ' + (cx + c).toFixed(2) + ' ' + (cy + radius).toFixed(2) + ' ' + cx.toFixed(2) + ' ' + (cy + radius).toFixed(2) + ' c '
				+ (cx - c).toFixed(2) + ' ' + (cy + radius).toFixed(2) + ' ' + (cx - radius).toFixed(2) + ' ' + (cy + c).toFixed(2) + ' ' + (cx - radius).toFixed(2) + ' ' + cy.toFixed(2) + ' c '
				+ (cx - radius).toFixed(2) + ' ' + (cy - c).toFixed(2) + ' ' + (cx - c).toFixed(2) + ' ' + (cy - radius).toFixed(2) + ' ' + cx.toFixed(2) + ' ' + (cy - radius).toFixed(2) + ' c '
				+ (cx + c).toFixed(2) + ' ' + (cy - radius).toFixed(2) + ' ' + (cx + radius).toFixed(2) + ' ' + (cy - c).toFixed(2) + ' ' + (cx + radius).toFixed(2) + ' ' + cy.toFixed(2) + ' c f\n';
		},
		image(name, x, yTop, width, height) {
			content += 'q ' + width.toFixed(2) + ' 0 0 ' + height.toFixed(2) + ' ' + x.toFixed(2) + ' ' + (yPdf(yTop) - height).toFixed(2) + ' cm /' + name + ' Do Q\n';
		},
		getContent() {
			return content;
		}
	};
}

function drawQrToPdf(page, text, x, yTop, size) {
	if (!window.QRCode || typeof window.QRCode.createMatrix !== 'function') {
		throw new Error('QRCode matrix generator missing.');
	}

	const matrix = window.QRCode.createMatrix(String(text || ''), {
		errorCorrectionLevel: 'M'
	});

	const quiet = 4;
	const count = matrix.length;
	const cell = size / (count + quiet * 2);

	for (let r = 0; r < count; r++) {
		for (let c = 0; c < count; c++) {
			if (matrix[r][c]) {
				page.rect(x + (c + quiet) * cell, yTop + (r + quiet) * cell, cell, cell);
			}
		}
	}
}

function addPdfHeader(page, title, username, logoImage) {
	if (logoImage) {
		page.image('Logo', 40, 24, logoImage.displayWidth, logoImage.displayHeight);
	}
	page.text(title, 94, 42, 18);
	page.text('Username: ' + username, 94, 61, 10);
	page.text('IMPORTANT: This PDF contains private BLURT keys. Keep it secret and offline.', 40, 84, 9);
	page.line(40, 99, 555, 99);
	return 110;
}

function addPdfKeyRow(page, title, value, y) {
	const qrX = 42;
	const qrSize = 82;
	const textX = 138;
	const valueText = String(value || '');
	const valueFontSize = valueText.length > 70 ? 6.4 : 6.9;

	page.text(title, textX, y + 15, 11);
	page.text(valueText, textX, y + 33, valueFontSize);
	drawQrToPdf(page, valueText, qrX, y, qrSize);
}

function addPdfFooter(page) {
	page.line(40, 802, 555, 802);
	page.text('Generated on: ' + new Date().toISOString(), 40, 817, 8);
	page.text('Do not share this PDF, screenshots of it, or the QR codes inside it.', 40, 829, 8);
}

async function downloadKeysPackage(username, keys, master) {
	try {
		validateBackupData(username, keys, master);
		rememberBackupData(username, keys, master);

		if (!window.QRCode || typeof window.QRCode.createMatrix !== 'function') {
			downloadKeysFile(username, keys, master);
			return { ok: true, type: 'txt-fallback' };
		}

		const safeUsername = pdfSafeFilename(username);
		const logoImage = await loadPdfLogoImage();
		const pdfImages = logoImage ? [logoImage] : [];
		const pages = [];
		const page = makePdfPageBuilder();
		addPdfHeader(page, 'BLURT Account Backup', username, logoImage);

		addPdfKeyRow(page, 'Master Password / Seed', master, 112);
		addPdfKeyRow(page, 'Owner Key', keys.owner, 224);
		addPdfKeyRow(page, 'Active Key', keys.active, 336);
		addPdfKeyRow(page, 'Posting Key', keys.posting, 448);
		addPdfKeyRow(page, 'Memo Key', keys.memo, 560);
		addPdfFooter(page);
		pages.push(page.getContent());

		const blob = createPdfDocument(pages, pdfImages);
		await validatePdfBlob(blob);
		forceDownloadFile(blob, safeUsername + '_blurt_account_backup.pdf');

		setTimeout(() => {
			alert('Your BLURT backup PDF has been generated. Save this file now. Without it you may lose access to your account.');
		}, 250);

		return { ok: true, type: 'pdf' };
	} catch (err) {
		console.error('PDF backup error:', err);

		try {
			validateBackupData(username, keys, master);
			downloadKeysFile(username, keys, master);
			alert('PDF generation failed, so a TXT backup file was generated instead. Save it immediately.');
			return { ok: true, type: 'txt-fallback' };
		} catch (fallbackErr) {
			console.error('Backup fallback error:', fallbackErr);
			alert('Backup file could not be generated. Account creation has been stopped to protect your keys.');
			return { ok: false, type: 'failed' };
		}
	}
}

function renderQrImage(target, text, altText) {
	if (!target || !text || !window.QRCode || typeof window.QRCode.createMatrix !== 'function') {
		return;
	}

	try {
		const matrix = window.QRCode.createMatrix(String(text), {
			errorCorrectionLevel: 'M'
		});
		const quiet = 4;
		const count = matrix.length + quiet * 2;
		const qr = document.createElement('div');
		qr.className = 'key-qr-image key-qr-grid';
		qr.setAttribute('role', 'img');
		qr.setAttribute('aria-label', altText || 'QR code');
		qr.style.gridTemplateColumns = 'repeat(' + count + ', 1fr)';
		qr.style.gridTemplateRows = 'repeat(' + count + ', 1fr)';

		for (let r = -quiet; r < matrix.length + quiet; r++) {
			for (let c = -quiet; c < matrix.length + quiet; c++) {
				const cell = document.createElement('span');
				if (r >= 0 && c >= 0 && r < matrix.length && c < matrix.length && matrix[r][c]) {
					cell.className = 'qr-dark';
				}
				qr.appendChild(cell);
			}
		}

		target.innerHTML = '';
		target.appendChild(qr);
	} catch (err) {
		console.error('QR render error:', err);
	}
}

// ————— Sprawdzanie dostępności nazwy —————
async function isUsernameAvailable(username) {
	const endpoint = window.usernameCheckEndpoint || '/account/check_username.php';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify({ username: username })
	});

	let data = null;
	try {
		data = await response.json();
	} catch (err) {
		throw new Error('Invalid JSON response from username endpoint.');
	}

	if (!response.ok || !data || data.success !== true) {
		throw new Error((data && data.error) ? data.error : 'username_check_failed');
	}

	return data.available === true;
}

function validateUsernameLocally(username) {
  const grapheneUsernameRegex = /^(?=.{3,16}$)[a-z][0-9a-z-]{1,}[0-9a-z](\.[a-z][0-9a-z-]{1,}[0-9a-z])?$/;
  return grapheneUsernameRegex.test(username);
}
async function checkUsernameAvailability() {
  const username = document.getElementById("username").value.trim();
  const statusEl = document.getElementById("username-status");

  if (!validateUsernameLocally(username)) {
    statusEl.textContent = "❌ Invalid format. Use only lowercase, digits, dots or hyphens. Each part must be ≥3 chars.";
    statusEl.className = "text-danger";
    return false;
  }

  try {
    const available = await isUsernameAvailable(username);
    if (available) {
      statusEl.textContent = "✅ Username is available.";
      statusEl.className = "text-success";
      return true;
    } else {
      statusEl.textContent = "❌ Username is already taken.";
      statusEl.className = "text-danger";
      return false;
    }
  } catch (e) {
    statusEl.textContent = "⚠️ Error checking username.";
    statusEl.className = "text-warning";
    return false;
  }
}

// ————— Szyfrowanie CryptoJS „Salted__” (kompatybilne z backendem) —————
function encryptWithSaltedAES(plainJson, passphrase) {
  const salt = CryptoJS.lib.WordArray.random(8);
  const keyIv = CryptoJS.EvpKDF(passphrase, salt, {
    keySize   : (32 + 16) / 4,   // 12 words
    iterations: 1,
    hasher    : CryptoJS.algo.MD5
  });
  const key = CryptoJS.lib.WordArray.create(keyIv.words.slice(0, 8));
  const iv  = CryptoJS.lib.WordArray.create(keyIv.words.slice(8, 12));

  const ciphertext = CryptoJS.AES.encrypt(plainJson, key, {
    iv   : iv,
    mode : CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext;

  const out = CryptoJS.enc.Utf8.parse('Salted__')
               .concat(salt)
               .concat(ciphertext);

  return CryptoJS.enc.Base64.stringify(out);
}

// ————— Pomocnicze: CryptoJS <-> Uint8Array —————
function wordArrayToUint8Array(wordArray) {
  const len = wordArray.sigBytes;
  const u8 = new Uint8Array(len);
  let offset = 0;
  for (let i = 0; i < wordArray.words.length; i++) {
    let w = wordArray.words[i];
    const bytes = Math.min(4, len - offset);
    for (let b = 0; b < bytes; b++) {
      u8[offset++] = (w >>> (24 - b * 8)) & 0xff;
    }
  }
  return u8;
}
function uint8ArrayToWordArray(u8) {
  const words = [];
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      ((u8[i] || 0) << 24) |
      ((u8[i + 1] || 0) << 16) |
      ((u8[i + 2] || 0) << 8) |
      (u8[i + 3] || 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8.length);
}
function sha256d(buffer) {
  const wa1 = uint8ArrayToWordArray(buffer);
  const h1 = CryptoJS.SHA256(wa1);
  const u1 = wordArrayToUint8Array(h1);
  const wa2 = uint8ArrayToWordArray(u1);
  const h2 = CryptoJS.SHA256(wa2);
  return wordArrayToUint8Array(h2);
}

// ————— Legacy WIF (zawsze „5…”) + MASTER = „P5…” —————
function legacyWifFrom32(raw32) {
  if (!(raw32 instanceof Uint8Array) || raw32.length !== 32) {
    throw new Error('Entropy must be 32 bytes');
  }
  const payload = new Uint8Array(33);
  payload[0] = 0x80;                 // wersja
  payload.set(raw32, 1);             // 32B klucza
  const chk = sha256d(payload).subarray(0, 4);
  const full = new Uint8Array(33 + 4);
  full.set(payload, 0);
  full.set(chk, 33);

  if (!window.bs58) throw new Error('bs58 library missing. Add <script src="https://cdn.jsdelivr.net/npm/bs58@5.0.0/dist/bs58.min.js"></script> to index.html');
  return window.bs58.encode(full);   // zawsze '5…'
}
function random32() {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return b;
}

// ————— Generator master + kluczy (NAPRAWIONY) —————
async function generateMasterAndKeys(usernameRaw) {
  const username = String(usernameRaw || '').trim().toLowerCase();
  if (!/^[a-z0-9\-.]{3,16}$/.test(username)) {
    throw new Error('Invalid username');
  }

  const wif5  = legacyWifFrom32(random32()); // 5…
  const master = 'P' + wif5;                  // P5…

  const roles = ['owner', 'active', 'posting', 'memo'];
  const priv = blurt.auth.getPrivateKeys(username, master, roles);
  const pub = {
    owner:   blurt.auth.wifToPublic(priv.owner),
    active:  blurt.auth.wifToPublic(priv.active),
    posting: blurt.auth.wifToPublic(priv.posting),
    memo:    blurt.auth.wifToPublic(priv.memo),
  };

  // self-check
  const check = blurt.auth.getPrivateKeys(username, master, roles);
  if (check.owner !== priv.owner || check.active !== priv.active ||
      check.posting !== priv.posting || check.memo !== priv.memo) {
    throw new Error('Self-check failed – derived keys mismatch');
  }

  return { master, priv, pub };
}

// ————— GŁÓWNY: Generate Keys (podpięte do przycisku) —————
async function generateKeys() {
  const usernameOk = await checkUsernameAvailability();
  if (!usernameOk) return;

  const username = document.getElementById("username").value.trim().toLowerCase();

  // 🔐 nowy, prawidłowy master „P5…” i klucze
  const { master, priv /*, pub*/ } = await generateMasterAndKeys(username);

  const sentBtn = document.getElementById("sent");
  if (sentBtn) sentBtn.style.display = "none";

  const rawKeysEl = document.getElementById("raw_keys");
  const encryptedKeysEl = document.getElementById("encrypted_keys");
  if (rawKeysEl) rawKeysEl.value = "";
  if (encryptedKeysEl) encryptedKeysEl.value = "";

  // wypełnij UI od razu po poprawnym wygenerowaniu kluczy.
  // Dzięki temu walidacja backupu nie opiera się na pustych polach formularza.
  document.getElementById("password").value     = master;
  document.getElementById("owner_key").value    = priv.owner;
  document.getElementById("active_key").value   = priv.active;
  document.getElementById("posting_key").value  = priv.posting;
  document.getElementById("memo_key").value     = priv.memo;

  // pakiety do backendu
  const skipEmail = document.getElementById("skip_email").checked;
  const encPass   = document.getElementById("encryptionPassword").value;

  if (!skipEmail && !encPass) {
    alert("⚠️ Wprowadź hasło szyfrujące lub zaznacz opcję pominięcia e-maila.");
    return;
  }

  // pobierz komplet do backupu dopiero po zapisaniu kluczy w stanie formularza
  const keysForBackup = {
    owner:   priv.owner,
    active:  priv.active,
    posting: priv.posting,
    memo:    priv.memo
  };
  const backupResult = await downloadKeysPackage(username, keysForBackup, master);
  if (!backupResult || backupResult.ok !== true) {
    return;
  }

  // surowe (dla trybu bez emaila) – backend i tak filtruje wymagane pola
  const rawKeys = {
    master,
    owner:   priv.owner,
    active:  priv.active,
    posting: priv.posting,
    memo:    priv.memo
  };
  document.getElementById("raw_keys").value = JSON.stringify(rawKeys);

  // szyfrowany pakiet do maila (CryptoJS Salted__)
  if (!skipEmail) {
    const pack = {
      username,
      master,
      owner:   priv.owner,
      active:  priv.active,
      posting: priv.posting,
      memo:    priv.memo
    };
    const encryptedKeys = encryptWithSaltedAES(JSON.stringify(pack), encPass);
    document.getElementById("encrypted_keys").value = encryptedKeys;
  } else {
    document.getElementById("encrypted_keys").value = "";
  }

  document.getElementById("sent").style.display = "block";
}
window.generateKeys = generateKeys; // podłącz do przycisku

// ————— Submit formularza (zostawione jak było) —————
document.getElementById('form_id').addEventListener('submit', async function (e) {
  e.preventDefault();

  // ✅ WALIDACJA VOUCHERA PRZED WYSŁANIEM
  const voucherOk = await validateVoucherCode();
  if (!voucherOk) {
    alert("Voucher is invalid or used. Please check again.");
    return;
  }

  const form = e.target;
  const formData = new FormData(form);
  const skipEmail = document.getElementById('skip_email').checked;

  const customReferrerInput = document.getElementById("custom_referrer");
if (customReferrerInput) {
  formData.set("custom_referrer", customReferrerInput.value.trim().toLowerCase());
}

  formData.append('send_email', skipEmail ? '0' : '1');

  if (skipEmail) {
    formData.set('encryptionPassword', '');
  }

  const antiAbuse = await blurtBuildAntiAbusePayload({ includePow: false });
  formData.set('fingerprint_hash', antiAbuse.fingerprint_hash);
  formData.set('browser_id', antiAbuse.browser_id);
  formData.set('webdriver', antiAbuse.webdriver);

  try {
    const response = await fetch('creator.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Konto utworzone! TXID: " + result.txid);
      const username  = document.getElementById("username").value;
      const master  = document.getElementById("password").value;
      const posting = document.getElementById("posting_key").value;
      showSuccessMessage(username, master, posting);
    } else {
      alert("⛔ Błąd: " + result.error);
    }
  } catch (err) {
    alert("⛔ Błąd połączenia z serwerem: " + err.message);
  }
});

// ————— Gdy zmienia się username, czyść pola z kluczami —————
document.getElementById("username").addEventListener("input", () => {
  document.getElementById("keys-section").style.display = "none";
  document.getElementById("sent").style.display = "none";

  document.getElementById("password").value    = "";
  document.getElementById("owner_key").value   = "";
  document.getElementById("active_key").value  = "";
  document.getElementById("posting_key").value = "";
  document.getElementById("memo_key").value    = "";

  document.getElementById("raw_keys").value       = "";
  document.getElementById("encrypted_keys").value = "";
});

function downloadLastBackupAgain() {
	if (!lastBackupData) {
		alert('Backup data is no longer available in this browser session.');
		return;
	}

	downloadKeysPackage(lastBackupData.username, lastBackupData.keys, lastBackupData.master);
}

// ————— Ekran sukcesu —————
function showSuccessMessage(username, master, posting) {
  const form = document.getElementById("form_id");
  form.style.display = "none";

  const container = document.createElement("div");
  container.className = "alert alert-success text-center mt-4";
  container.style.fontSize = "1.1rem";

  container.innerHTML = `
    ✅ Account <strong>${qrEscapeHtml(username)}</strong> created successfully!<br><br>
    To log in to Blurt, download the <strong>WhaleVault</strong> browser extension and use your <strong>Master Password</strong> to setup all keys.<br><br>
    <img src="img/whalevault.png" alt="WhaleVault Logo" style="width: 100%; margin-bottom: 15px;"><br>

    <div class="key-summary-grid">
      <div class="key-summary-card">
        <strong>Your Master Password:</strong><br>
        <code class="key-code">${qrEscapeHtml(master)}</code>
        <div class="key-qr-title">Master Password QR</div>
        <div id="success-master-qr" class="key-qr-box"></div>
      </div>

      <div class="key-summary-card">
        <strong>Your Posting Key:</strong><br>
        <code class="key-code">${qrEscapeHtml(posting)}</code>
        <div class="key-qr-title">Posting Key QR</div>
        <div id="success-posting-qr" class="key-qr-box"></div>
      </div>
    </div>

    <button type="button" id="download-backup-again" class="btn btn-danger mt-3">
      Download backup PDF again
    </button>

    <div class="alert alert-warning mt-3 mb-0">
      Do not share these QR codes publicly. The Master Password can regenerate all private keys.
    </div>
  `;

  form.parentNode.appendChild(container);

  const backupBtn = document.getElementById('download-backup-again');
  if (backupBtn) {
    backupBtn.addEventListener('click', downloadLastBackupAgain);
  }

  renderQrImage(document.getElementById('success-master-qr'), master, 'Master Password QR');
  renderQrImage(document.getElementById('success-posting-qr'), posting, 'Posting Key QR');

  // ↓↓↓ nowy blok ze społecznościami – już nie korzystamy z parametru
  loadCommunitiesSection();
}


async function loadCommunitiesSection() {
  // 1) Szukamy głównego kontenera (tego z cieniem)
  const outerContainer = document.querySelector('.container');
  if (!outerContainer) {
    console.warn('communities: .container not found');
    return;
  }

  // 2) Usuwamy poprzednią sekcję, żeby się nie dublowała
  let wrapper = document.getElementById('communities-wrapper');
  if (wrapper) {
    wrapper.remove();
  }

  // 3) Tworzymy wrapper NA KOŃCU kontenera – pod logo + zieloną kartą
  wrapper = document.createElement('div');
  wrapper.id = 'communities-wrapper';
  wrapper.className = 'communities-wrapper';

  const heading = document.createElement('h2');
  heading.className = 'h4 text-center mb-4';
  heading.textContent = 'Choose your community to find better support:';
  wrapper.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'communities-grid';
  wrapper.appendChild(grid);

  // wstawiamy na sam koniec głównego kontenera
  outerContainer.appendChild(wrapper);

  // 4) Pobieramy listę społeczności
  try {
    const response = await fetch('./get_communities.php', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();

    if (!data.success || !Array.isArray(data.communities) || data.communities.length === 0) {
      const info = document.createElement('p');
      info.className = 'text-center text-muted';
      info.textContent = 'There are no communities configured yet.';
      wrapper.appendChild(info);
      return;
    }

    data.communities.forEach((c) => {
      const item = document.createElement('div');
      item.className = 'community-item';

      const box = document.createElement('div');
      box.className = 'community-box';

      const link = document.createElement('a');
      link.href = c.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.src = c.thumbnail_url;
      img.alt = c.name;
      img.className = 'community-thumb';

      link.appendChild(img);
      box.appendChild(link);

      const caption = document.createElement('div');
      caption.className = 'community-name';
      caption.textContent = c.name;

      box.appendChild(caption);
      item.appendChild(box);
      grid.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading communities', err);
    const errorInfo = document.createElement('p');
    errorInfo.className = 'text-center text-warning';
    errorInfo.textContent = 'Error loading communities list.';
    wrapper.appendChild(errorInfo);
  }
}



