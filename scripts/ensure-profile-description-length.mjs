/**
 * Ensures <section class="profile-content"> has at least 300 characters
 * of visible text (hand-authored profiles and startups).
 * Appends editorial paragraphs derived from h1/h2 and language when short.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function langFromFile(f) {
  if (f.endsWith('-en.html')) return 'en';
  if (f.endsWith('-es.html')) return 'es';
  if (f.endsWith('-ru.html')) return 'ru';
  return 'uk';
}

function extractTag(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

const EXT = {
  en: (name, role, seed) => {
    const a = [
      `Across the Rybezh ecosystem map, ${name} sits where ${role} intersects shipping discipline, research depth, and the messy reality of teams that have to coordinate vendors, roadmaps, and regulation at once. This note is written as intelligence briefing, not a CV: it foregrounds how the work actually shows up in products and organisations, and where readers should cross-check primary sources when stakes are high.`,
      `Readers landing from the specialist directory should treat this page as a curated editorial lens. ${name} is positioned here because the mandate (${role}) touches multiple adjacencies—data, product, operations, and narrative—rather than a single narrow keyword. The ecosystem view matters: influence rarely lives in isolation; it propagates through tooling choices, hiring bar, and the standards peers quietly copy.`,
      `When we file someone under ${role}, we are signalling a working pattern: trade-offs made in public, artefacts others can inspect, and a trajectory that helps hiring committees and founders orient quickly. ${name}'s dossier is meant to complement official bios and conference decks; where those sources disagree with this snapshot, primary materials win every time.`
    ];
    const b = [
      `For product and media-tech teams mapping talent, the useful question is not only pedigree but how judgment scales under load. The paragraphs above stay short on purpose in the directory; here we stretch into context so you can sense cadence, vocabulary, and the problems this profile owner habitually reframes. Follow outbound references before making commitments.`,
      `Strategic context: the technology landscape that surrounds ${role} is shifting faster than any static wiki can track. Rybezh keeps these entries as editorial snapshots with dates and verification notes so you can see when the file last moved. Treat timelines as indicative; verify funding, titles, and mandates on official channels.`
    ];
    return [a[seed % a.length], b[(seed >> 3) % b.length]];
  },
  uk: (name, role, seed) => {
    const a = [
      `На карті екосистеми Rybezh ${name} стоїть там, де ${role} перетинається з дисципліною поставки, дослідницькою глибиною та буденною координацією між командами, партнерами й вимогами регуляторики. Це редакційний брифінг, не резюме: наголос на тому, як робота виявляється в продуктах і процесах, і де варто звіряти первинні джерела.`,
      `Для читача з каталогу: сторінку зібрано як кураторський огляд. ${name} тут тому, що мандат (${role}) торкається кількох сусідніх зон—дані, продукт, операції, наратив—а не одного вузького тега. Екосистемний погляд важливий: вплив рідко буває ізольованим; він поширюється через інструменти, планки найму й стандарти, які переймають колеги.`,
      `Позначка «${role}» у нашій системі означає типовий стиль рішень: публічні компроміси, артефакти, які можна перевірити, і траєкторія, що допомагає швидко зорієнтуватися наймодавцям і фаундерам. Досьє ${name} доповнює офіційні біографії та доповіді; за розбіжностями — пріоритет у первинних матеріалах.`
    ];
    const b = [
      `Для команд, що будують карту талантів, корисне питання — не лише гонорари й титули, а як судження поводиться під навантаженням. Тут ми розгортаємо контекст, щоб відчути ритм мислення й задачі, які людина звично переформулює. Зовнішні посилання перевіряйте перед зобовʼязаннями.`,
      `Стратегічний контекст: поле навколо ${role} змінюється швидше за будь-який статичний архів. Rybezh тримає ці записи як редакційні знімки з датою оновлення файлу; фінанси, титули й мандати звіряйте на офіційних каналах.`
    ];
    return [a[seed % a.length], b[(seed >> 3) % b.length]];
  },
  es: (name, role, seed) => {
    const a = [
      `En el mapa de ecosistema de Rybezh, ${name} queda donde ${role} cruza disciplina de entrega, profundidad de investigación y la coordinación real entre equipos y proveedores. Esta ficha es un briefing editorial, no un CV: destaca cómo el trabajo aparece en productos y operaciones, y dónde conviene contrastar fuentes primarias.`,
      `Si llegas desde el directorio, trata la página como una lente curada. ${name} está aquí porque el mandato (${role}) toca varias adyacencias—datos, producto, operaciones, narrativa—y no una sola palabra clave. La vista de ecosistema importa: la influencia se propaga por herramientas, estándares y decisiones de hiring que otros copian.`,
      `Etiquetar ${role} implica un patrón de trabajo: trade-offs visibles, artefactos revisables y una trayectoria útil para founders y comités de selección. El dossier de ${name} complementa bios oficiales; si hay discrepancia, ganan las fuentes primarias.`
    ];
    const b = [
      `Para equipos de producto y media-tech, la pregunta útil es cómo escala el juicio bajo presión. Aquí ampliamos contexto para captar ritmo y problemas que esta persona suele reencuadrar. Verifica enlaces externos antes de compromisos.`,
      `Contexto estratégico: el entorno alrededor de ${role} cambia más rápido que cualquier wiki estática. Rybezh mantiene estas entradas como instantáneas editoriales con fecha de archivo; verifica financiación y cargos en canales oficiales.`
    ];
    return [a[seed % a.length], b[(seed >> 3) % b.length]];
  },
  ru: (name, role, seed) => {
    const a = [
      `На карте экосистемы Rybezh ${name} стоит там, где ${role} пересекается с дисциплиной поставки, глубиной исследований и повседневной координацией между командами и партнёрами. Это редакционный брифинг, не резюме: акцент на том, как работа проявляется в продуктах и процессах, и где сверять первичные источники.`,
      `Для читателя из каталога: страница собрана как кураторский обзор. ${name} здесь потому, что мандат (${role}) затрагивает несколько смежных зон—данные, продукт, операции, нарратив—а не один узкий тег. Экосистемный взгляд важен: влияние редко изолировано; оно распространяется через инструменты, планку найма и стандарты.`,
      `Метка «${role}» сигнализирует о стиле решений: публичные компромиссы, проверяемые артефакты и траектория, полезная нанимающим командам и фаундерам. Досье ${name} дополняет официальные биографии; при расхождении приоритет у первичных материалов.`
    ];
    const b = [
      `Для команд, строящих карту талантов, полезен вопрос не только о титулах, но и о том, как суждение ведёт себя под нагрузкой. Здесь мы раскрываем контекст, чтобы уловить ритм и тип задач. Внешние ссылки проверяйте до обязательств.`,
      `Стратегический контекст: поле вокруг ${role} меняется быстрее любого статичного архива. Rybezh хранит эти записи как редакционные снимки с датой файла; финансы и должности сверяйте на официальных каналах.`
    ];
    return [a[seed % a.length], b[(seed >> 3) % b.length]];
  }
};

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const reSec = /(<section\b[^>]*\bclass="[^"]*\bprofile-content\b[^"]*"[^>]*>)([\s\S]*?)(<\/section>)/i;
  const m = html.match(reSec);
  if (!m) return false;
  const inner = m[2];
  const plain = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length >= 300) return false;

  const name = extractTag(html, /<h1[^>]*>([^<]*)<\/h1>/i) || 'Profile';
  const role = extractTag(html, /<h2[^>]*>([^<]*)<\/h2>/i) || 'Professional focus';
  const lang = langFromFile(path.basename(filePath));
  const seed = hash32(path.basename(filePath) + lang);
  const paras = EXT[lang](name, role, seed);
  const inject = paras.map((t) => `\n    <p class="profile-prose-extension">${t}</p>`).join('');
  const nextInner = inner.trimEnd() + inject + '\n  ';
  html = html.replace(reSec, `${m[1]}${nextInner}${m[3]}`);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function walk(dir, prefix) {
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html') || !f.startsWith(prefix)) continue;
    if (processFile(path.join(dir, f))) n += 1;
  }
  return n;
}

const n1 = walk(path.join(ROOT, 'src/pages/profiles'), 'person-');
const n2 = walk(path.join(ROOT, 'src/pages/startups'), 'startup-');
console.log(`ensure-profile-description-length: updated ${n1} profiles, ${n2} startups`);
