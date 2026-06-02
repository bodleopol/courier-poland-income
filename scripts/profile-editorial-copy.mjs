/**
 * Short, neutral editorial copy for catalogue profiles (no AI-doorway phrasing).
 */

function escText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const COPY = {
  uk: (name, role) =>
    `Сторінка «${name}» у каталозі Rybezh — редакційний орієнтир для фільтрів каталогу${role ? ` (роль: ${role})` : ''}. Тут немає перевіреного резюме: перед наймом, інвестицією чи публікацією звіряйте біографію, проєкти, роботодавців і цифри на LinkedIn, корпоративних сайтах, реєстрах компаній та в первинних інтерв’ю й звітах.`,
  en: (name, role) =>
    `The "${name}" page in the Rybezh directory is an editorial signpost for catalogue filters${role ? ` (role: ${role})` : ''}. It is not a verified CV: before hiring, investing, or citing, confirm biography, projects, employers, and figures on LinkedIn, company sites, corporate registries, and primary interviews or filings.`,
  es: (name, role) =>
    `La página «${name}» en el directorio Rybezh es una señal editorial para los filtros del catálogo${role ? ` (rol: ${role})` : ''}. No es un CV verificado: antes de contratar, invertir o citar, confirma biografía, proyectos, empleadores y cifras en LinkedIn, webs corporativas, registros mercantiles y fuentes primarias.`,
  ru: (name, role) =>
    `Страница «${name}» в каталоге Rybezh — редакционный ориентир для фильтров${role ? ` (роль: ${role})` : ''}. Это не проверенное резюме: перед наймом, инвестициями или цитированием сверяйте биографию, проекты, работодателей и цифры в LinkedIn, на сайтах компаний, в реестрах и первичных источниках.`,
};

export function editorialSupplementParagraph(langKey, name, role) {
  const fn = COPY[langKey] || COPY.uk;
  return escText(fn(name, role));
}
