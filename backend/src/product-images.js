'use strict';

/**
 * Generise ilustracije proizvoda (SVG -> PNG preko sharp-a) i kaci ih na
 * proizvode koji jos nemaju slike. Pokrece se iz bootstrap-a, pa je bezbedno
 * pokretati vise puta - proizvodi koji vec imaju slike se preskacu.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const SIZE = 800;

// Izgled po proizvodu (kljuc je slug)
const SPECS = {
  'iphone-17-pro-256gb': {
    type: 'phone', body: '#e07a35', frame: '#d5d6db', camera: 'tri-square', notch: 'island',
    wall: ['#ffb067', '#7a2e0e'], color: 'Kosmicko narandzasta',
  },
  'iphone-17-128gb': {
    type: 'phone', body: '#a9c2e4', frame: '#c4d3e8', camera: 'dual-module', notch: 'island',
    wall: ['#8ec5ff', '#24427e'], color: 'Plava',
  },
  'samsung-galaxy-s25-ultra-512gb': {
    type: 'phone', body: '#93a7bb', frame: '#b8c4d0', camera: 'vertical-free', notch: 'hole', radius: 20,
    wall: ['#6aa8ff', '#16224a'], color: 'Titanium Silverblue',
  },
  'samsung-galaxy-a56-5g-256gb': {
    type: 'phone', body: '#3b3e46', frame: '#55585f', camera: 'vertical-island', notch: 'hole',
    wall: ['#b18cff', '#2a1858'], color: 'Grafitna',
  },
  'xiaomi-15-ultra-512gb': {
    type: 'phone', body: '#1d1d20', frame: '#3a3a3e', camera: 'big-circle', notch: 'hole',
    wall: ['#ffd36b', '#3a2408'], color: 'Crna',
  },
  'redmi-note-14-pro-256gb': {
    type: 'phone', body: '#8d6fcb', frame: '#a58ad8', camera: 'square-3', notch: 'hole',
    wall: ['#ff8ad8', '#46176b'], color: 'Ljubicasta',
  },
  'google-pixel-10-pro-256gb': {
    type: 'phone', body: '#2b2c30', frame: '#4a4b50', camera: 'bar', notch: 'hole',
    wall: ['#7ce0c3', '#0f3a40'], color: 'Obsidian',
  },
  'motorola-edge-60-256gb': {
    type: 'phone', body: '#3f6b50', frame: '#58806a', camera: 'square-3', notch: 'hole',
    wall: ['#b4ecac', '#16432a'], color: 'Zelena',
  },
  'apple-airpods-pro-3': { type: 'buds', accent: '#dfe6f2' },
  'samsung-punjac-45w-usb-c': { type: 'charger', accent: '#d9dde6' },
};

const PHONE_W = 300;
const PHONE_H = 620;

// ---------- pomocne funkcije ----------

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const mix = (c) => (amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  const r = clamp(mix((n >> 16) & 255));
  const g = clamp(mix((n >> 8) & 255));
  const b = clamp(mix(n & 255));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function lens(cx, cy, r, id) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="#0c0c0f" opacity="0.35"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#16171b" stroke="#5c5f66" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="url(#lens-${id})"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.28}" fill="#05060a"/>
    <circle cx="${cx - r * 0.25}" cy="${cy - r * 0.28}" r="${r * 0.13}" fill="#ffffff" opacity="0.7"/>`;
}

function flash(cx, cy, r = 8) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff6d8" stroke="#c9b98a" stroke-width="2"/>`;
}

function cameraBlock(style, body, id) {
  const module = shade(body, -0.12);
  const L = (cx, cy, r) => lens(cx, cy, r, id);
  switch (style) {
    case 'tri-square':
      return `<rect x="18" y="18" width="156" height="156" rx="40" fill="${module}" stroke="${shade(body, 0.2)}" stroke-width="2"/>
        ${L(62, 62, 30)}${L(62, 130, 30)}${L(130, 96, 30)}${flash(132, 40)}<circle cx="132" cy="152" r="7" fill="#111"/>`;
    case 'dual-module':
      return `<rect x="18" y="18" width="100" height="166" rx="38" fill="${module}" stroke="${shade(body, 0.2)}" stroke-width="2"/>
        ${L(68, 62, 32)}${L(68, 140, 32)}${flash(140, 50)}`;
    case 'vertical-free':
      return `${L(58, 58, 30)}${L(58, 128, 30)}${L(58, 198, 30)}${L(120, 58, 16)}${flash(120, 100)}`;
    case 'vertical-island':
      return `<rect x="26" y="24" width="72" height="210" rx="36" fill="${shade(body, -0.25)}"/>
        ${L(62, 62, 25)}${L(62, 129, 25)}${L(62, 196, 25)}${flash(120, 40)}`;
    case 'big-circle':
      return `<circle cx="150" cy="150" r="112" fill="${shade(body, 0.08)}" stroke="#8a8c92" stroke-width="5"/>
        <circle cx="150" cy="150" r="100" fill="#121215"/>
        ${L(108, 108, 32)}${L(192, 108, 32)}${L(108, 192, 32)}${L(192, 192, 32)}`;
    case 'square-3':
      return `<rect x="22" y="22" width="148" height="148" rx="32" fill="${module}" stroke="${shade(body, 0.22)}" stroke-width="2"/>
        ${L(64, 64, 32)}${L(128, 64, 22)}${L(64, 128, 22)}${flash(128, 128, 10)}`;
    case 'bar':
      return `<rect x="-2" y="96" width="${PHONE_W + 4}" height="86" rx="43" fill="#111215" stroke="#3b3c40" stroke-width="3"/>
        ${L(62, 139, 25)}${L(120, 139, 25)}${L(178, 139, 25)}${flash(236, 139, 9)}`;
    default:
      return L(70, 70, 32);
  }
}

function defs(spec, id) {
  const [w1, w2] = spec.wall || ['#9db4ff', '#1d2a5c'];
  const body = spec.body || '#333';
  return `
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="${shade(spec.accent || body, 0.82)}"/>
    </linearGradient>
    <linearGradient id="wall-${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${w1}"/>
      <stop offset="1" stop-color="${w2}"/>
    </linearGradient>
    <linearGradient id="body-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${shade(body, 0.18)}"/>
      <stop offset="0.55" stop-color="${body}"/>
      <stop offset="1" stop-color="${shade(body, -0.18)}"/>
    </linearGradient>
    <linearGradient id="glare-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="lens-${id}" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stop-color="#6a7cff"/>
      <stop offset="0.5" stop-color="#1c2350"/>
      <stop offset="1" stop-color="#07080f"/>
    </radialGradient>
    <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#1a2040" flood-opacity="0.28"/>
    </filter>`;
}

function phoneFront(spec, id) {
  const r = spec.radius ?? 46;
  const icons = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      icons.push(
        `<rect x="${40 + col * 58}" y="${190 + row * 66}" width="44" height="44" rx="12" fill="#ffffff" opacity="${0.16 + ((row + col) % 3) * 0.08}"/>`,
      );
    }
  }
  const notch =
    spec.notch === 'island'
      ? `<rect x="105" y="26" width="90" height="26" rx="13" fill="#050506"/>`
      : `<circle cx="150" cy="38" r="9" fill="#050506"/>`;

  return `
    <rect x="0" y="0" width="${PHONE_W}" height="${PHONE_H}" rx="${r}" fill="${spec.frame}"/>
    <rect x="5" y="5" width="${PHONE_W - 10}" height="${PHONE_H - 10}" rx="${r - 4}" fill="#0a0a0c"/>
    <clipPath id="screen-${id}">
      <rect x="13" y="13" width="${PHONE_W - 26}" height="${PHONE_H - 26}" rx="${r - 11}"/>
    </clipPath>
    <rect x="13" y="13" width="${PHONE_W - 26}" height="${PHONE_H - 26}" rx="${r - 11}" fill="url(#wall-${id})"/>
    <g clip-path="url(#screen-${id})">
      <circle cx="250" cy="120" r="120" fill="#ffffff" opacity="0.08"/>
      <circle cx="40" cy="470" r="160" fill="#000000" opacity="0.12"/>
    </g>
    <rect x="40" y="88" width="120" height="34" rx="8" fill="#ffffff" opacity="0.9"/>
    <rect x="40" y="132" width="80" height="12" rx="6" fill="#ffffff" opacity="0.55"/>
    ${icons.join('')}
    <rect x="30" y="${PHONE_H - 100}" width="${PHONE_W - 60}" height="68" rx="24" fill="#ffffff" opacity="0.18"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${46 + i * 56}" y="${PHONE_H - 88}" width="44" height="44" rx="12" fill="#ffffff" opacity="0.4"/>`).join('')}
    ${notch}
    <rect x="13" y="13" width="${PHONE_W - 26}" height="${PHONE_H - 26}" rx="${r - 11}" fill="url(#glare-${id})"/>`;
}

function phoneBack(spec, id) {
  const r = spec.radius ?? 46;
  return `
    <rect x="0" y="0" width="${PHONE_W}" height="${PHONE_H}" rx="${r}" fill="${spec.frame}"/>
    <rect x="4" y="4" width="${PHONE_W - 8}" height="${PHONE_H - 8}" rx="${r - 3}" fill="url(#body-${id})"/>
    ${cameraBlock(spec.camera, spec.body, id)}
    <circle cx="150" cy="390" r="22" fill="${shade(spec.body, 0.12)}" opacity="0.55"/>
    <rect x="4" y="4" width="${PHONE_W - 8}" height="${PHONE_H - 8}" rx="${r - 3}" fill="url(#glare-${id})"/>`;
}

function svgDoc(id, spec, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <defs>${defs(spec, id)}</defs>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-${id})"/>
    <ellipse cx="400" cy="735" rx="230" ry="22" fill="#1a2040" opacity="0.08"/>
    ${content}
  </svg>`;
}

function phoneImages(spec) {
  const g = (inner, transform, id) => `<g transform="${transform}" filter="url(#shadow-${id})">${inner}</g>`;
  return [
    // 1. Prednja + zadnja strana zajedno
    svgDoc('a', spec, `
      ${g(phoneBack(spec, 'a'), 'translate(370 105) rotate(8 150 310) scale(0.92)', 'a')}
      ${g(phoneFront(spec, 'a'), 'translate(150 95) rotate(-4 150 310) scale(0.95)', 'a')}`),
    // 2. Prednja strana
    svgDoc('b', spec, g(phoneFront(spec, 'b'), 'translate(250 90)', 'b')),
    // 3. Zadnja strana
    svgDoc('c', spec, g(phoneBack(spec, 'c'), 'translate(250 90)', 'c')),
  ];
}

function budsImages(spec) {
  const bud = (x, y, flip) => `
    <g transform="translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}" filter="url(#shadow-a)">
      <ellipse cx="0" cy="0" rx="58" ry="66" fill="#fbfcfe" stroke="#d7dce6" stroke-width="3"/>
      <ellipse cx="-18" cy="-12" rx="24" ry="20" fill="#2a2d33"/>
      <ellipse cx="-18" cy="-12" rx="16" ry="13" fill="#4a4e57"/>
      <rect x="20" y="20" width="44" height="170" rx="22" fill="#fbfcfe" stroke="#d7dce6" stroke-width="3"/>
      <rect x="34" y="150" width="16" height="26" rx="8" fill="#c9ced8"/>
    </g>`;
  const box = `
    <g transform="translate(140 250)" filter="url(#shadow-a)">
      <rect x="0" y="0" width="300" height="250" rx="70" fill="#fdfdff" stroke="#d7dce6" stroke-width="3"/>
      <path d="M8 92 H292" stroke="#cdd2dc" stroke-width="3"/>
      <circle cx="150" cy="150" r="7" fill="#7bd88f"/>
      <rect x="135" y="236" width="30" height="8" rx="4" fill="#b9bfcb"/>
      <rect x="0" y="0" width="300" height="250" rx="70" fill="url(#glare-a)"/>
    </g>`;
  return [
    svgDoc('a', spec, `${box}${bud(560, 270, false)}${bud(640, 360, true)}`),
    svgDoc('a', spec, `<g transform="translate(-40 -20) scale(1.25)">${box}</g>`),
  ];
}

function chargerImages(spec) {
  const charger = `
    <g filter="url(#shadow-a)">
      <path d="M470 470 C 560 520, 600 640, 700 660" stroke="#202227" stroke-width="18" fill="none" stroke-linecap="round"/>
      <rect x="250" y="210" width="240" height="280" rx="46" fill="#222429"/>
      <rect x="250" y="210" width="240" height="280" rx="46" fill="url(#glare-a)"/>
      <rect x="290" y="150" width="22" height="80" rx="6" fill="#b9bdc6"/>
      <rect x="428" y="150" width="22" height="80" rx="6" fill="#b9bdc6"/>
      <rect x="330" y="400" width="80" height="26" rx="13" fill="#0c0d10" stroke="#4a4d55" stroke-width="3"/>
      <circle cx="370" cy="300" r="34" fill="none" stroke="#3b82f6" stroke-width="6" opacity="0.9"/>
      <path d="M372 276 L356 304 H372 L366 326 L386 296 H370 Z" fill="#3b82f6"/>
    </g>`;
  return [svgDoc('a', spec, charger)];
}

async function renderImages(slug) {
  const spec = SPECS[slug];
  if (!spec) return [];
  const svgs =
    spec.type === 'phone' ? phoneImages(spec) : spec.type === 'buds' ? budsImages(spec) : chargerImages(spec);
  return Promise.all(svgs.map((svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()));
}

async function uploadBuffer(strapi, buffer, name, alt) {
  const filepath = path.join(os.tmpdir(), `${name}-${Date.now()}.png`);
  fs.writeFileSync(filepath, buffer);
  try {
    const [file] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: { fileInfo: { name: `${name}.png`, alternativeText: alt, caption: alt } },
        files: { filepath, originalFilename: `${name}.png`, mimetype: 'image/png', size: buffer.length },
      });
    return file;
  } finally {
    fs.rmSync(filepath, { force: true });
  }
}

module.exports = async function attachProductImages(strapi) {
  const products = await strapi.documents('api::product.product').findMany({
    status: 'published',
    populate: ['images'],
    limit: 1000,
  });

  const missing = products.filter((p) => (!p.images || p.images.length === 0) && SPECS[p.slug]);
  if (missing.length === 0) return;

  strapi.log.info(`[images] Generisem slike za ${missing.length} proizvoda...`);

  for (const product of missing) {
    const buffers = await renderImages(product.slug);
    const files = [];
    for (let i = 0; i < buffers.length; i++) {
      files.push(await uploadBuffer(strapi, buffers[i], `${product.slug}-${i + 1}`, product.name));
    }

    await strapi.documents('api::product.product').update({
      documentId: product.documentId,
      data: { images: files.map((f) => f.id) },
    });
    await strapi.documents('api::product.product').publish({ documentId: product.documentId });
  }

  strapi.log.info('[images] Slike su dodate.');
};

module.exports.renderImages = renderImages;
module.exports.SPECS = SPECS;
