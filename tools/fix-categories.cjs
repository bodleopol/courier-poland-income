#!/usr/bin/env node
/**
 * Fix cross-category data pools in generate-jobs.js
 * Replaces global WORKPLACE_TYPES, INDUSTRY_SECTORS, EQUIPMENT_LIST, PHYSICAL_REQUIREMENTS
 * with category-scoped versions.
 * Also adds CITY_CONTEXT for unique per-city content.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'generate-jobs.js');
let code = fs.readFileSync(filePath, 'utf8');

// ===== 1. Replace WORKPLACE_TYPES with category-scoped version =====
const oldWorkplace = code.match(/const WORKPLACE_TYPES = \{[\s\S]*?\n\};\s*\n/);
if (oldWorkplace) {
  code = code.replace(oldWorkplace[0], `const WORKPLACE_TYPES_BY_CAT = {
  logistics: {
    ua: ["Тип об\u2019єкта: логістичний центр", "Тип об\u2019єкта: склад e-commerce", "Тип об\u2019єкта: термінал доставки", "Тип об\u2019єкта: розподільчий хаб"],
    pl: ["Typ obiektu: centrum logistyczne", "Typ obiektu: magazyn e-commerce", "Typ obiektu: terminal dostaw", "Typ obiektu: hub dystrybucyjny"]
  },
  production: {
    ua: ["Тип об\u2019єкта: виробничий цех", "Тип об\u2019єкта: заводська лінія", "Тип об\u2019єкта: пакувальний зал", "Тип об\u2019єкта: монтажний цех"],
    pl: ["Typ obiektu: hala produkcyjna", "Typ obiektu: linia fabryczna", "Typ obiektu: hala pakowania", "Typ obiektu: sala montażowa"]
  },
  construction: {
    ua: ["Тип об\u2019єкта: будівельний майданчик", "Тип об\u2019єкта: житловий комплекс", "Тип об\u2019єкта: комерційний об\u2019єкт", "Тип об\u2019єкта: реконструкція будівлі"],
    pl: ["Typ obiektu: plac budowy", "Typ obiektu: osiedle mieszkaniowe", "Typ obiektu: obiekt komercyjny", "Typ obiektu: remont budynku"]
  },
  hospitality: {
    ua: ["Тип об\u2019єкта: готель 3–4★", "Тип об\u2019єкта: ресторан/кафе", "Тип об\u2019єкта: резорт/пансіонат", "Тип об\u2019єкта: кейтерінг-центр"],
    pl: ["Typ obiektu: hotel 3–4★", "Typ obiektu: restauracja/kawiarnia", "Typ obiektu: resort/pensjonat", "Typ obiektu: centrum cateringowe"]
  },
  agriculture: {
    ua: ["Тип об\u2019єкта: ферма/господарство", "Тип об\u2019єкта: теплиця", "Тип об\u2019єкта: пакувальний цех (овочі/фрукти)", "Тип об\u2019єкта: сад/плантація"],
    pl: ["Typ obiektu: farma/gospodarstwo", "Typ obiektu: szklarnia", "Typ obiektu: pakowalnia (owoce/warzywa)", "Typ obiektu: sad/plantacja"]
  },
  cleaning: {
    ua: ["Тип об\u2019єкта: офісний центр", "Тип об\u2019єкта: торговий центр", "Тип об\u2019єкта: медичний заклад", "Тип об\u2019єкта: житловий комплекс"],
    pl: ["Typ obiektu: biurowiec", "Typ obiektu: centrum handlowe", "Typ obiektu: placówka medyczna", "Typ obiektu: osiedle mieszkaniowe"]
  },
  retail: {
    ua: ["Тип об\u2019єкта: торговий зал", "Тип об\u2019єкта: супермаркет", "Тип об\u2019єкта: склад магазину", "Тип об\u2019єкта: аутлет"],
    pl: ["Typ obiektu: sala sprzedaży", "Typ obiektu: supermarket", "Typ obiektu: magazyn sklepowy", "Typ obiektu: outlet"]
  }
};
function getWorkplaceTypes(catKey) {
  return WORKPLACE_TYPES_BY_CAT[catKey] || WORKPLACE_TYPES_BY_CAT.logistics;
}

`);
  console.log('✅ Replaced WORKPLACE_TYPES with category-scoped version');
} else {
  console.log('⚠️ Could not find WORKPLACE_TYPES to replace');
}

// ===== 2. Replace INDUSTRY_SECTORS with category-scoped version =====
const oldSectors = code.match(/const INDUSTRY_SECTORS = \{[\s\S]*?\n\};\s*\n/);
if (oldSectors) {
  code = code.replace(oldSectors[0], `const INDUSTRY_SECTORS_BY_CAT = {
  production: {
    ua: ["Сектор: FMCG (повсякденні товари)", "Сектор: automotive (автодеталі)", "Сектор: fashion (одяг/взуття)", "Сектор: food (харчове виробництво)", "Сектор: electronics (електроніка)", "Сектор: pharma (фарма/косметика)"],
    pl: ["Sektor: FMCG (towary codzienne)", "Sektor: automotive (części)", "Sektor: fashion (odzież/obuwie)", "Sektor: food (produkcja spożywcza)", "Sektor: electronics (elektronika)", "Sektor: pharma (farmacja/kosmetyki)"]
  },
  construction: {
    ua: ["Сектор: житлове будівництво", "Сектор: комерційне будівництво", "Сектор: дорожнє будівництво", "Сектор: ремонт та реконструкція"],
    pl: ["Sektor: budownictwo mieszkaniowe", "Sektor: budownictwo komercyjne", "Sektor: budownictwo drogowe", "Sektor: remonty i rekonstrukcje"]
  },
  agriculture: {
    ua: ["Сектор: овочівництво", "Сектор: садівництво", "Сектор: тваринництво", "Сектор: переробка с/г продукції"],
    pl: ["Sektor: warzywnictwo", "Sektor: sadownictwo", "Sektor: hodowla", "Sektor: przetwórstwo rolne"]
  },
  cleaning: {
    ua: ["Сектор: комерційний клінінг", "Сектор: промисловий клінінг", "Сектор: готельний сервіс", "Сектор: медичний клінінг"],
    pl: ["Sektor: sprzątanie komercyjne", "Sektor: sprzątanie przemysłowe", "Sektor: serwis hotelowy", "Sektor: sprzątanie medyczne"]
  }
};
function getIndustrySectors(catKey) {
  return INDUSTRY_SECTORS_BY_CAT[catKey] || INDUSTRY_SECTORS_BY_CAT.production;
}

`);
  console.log('✅ Replaced INDUSTRY_SECTORS with category-scoped version');
} else {
  console.log('⚠️ Could not find INDUSTRY_SECTORS');
}

// ===== 3. Replace EQUIPMENT_LIST with category-scoped version =====
const oldEquip = code.match(/const EQUIPMENT_LIST = \{[\s\S]*?\n\};\s*\n/);
if (oldEquip) {
  code = code.replace(oldEquip[0], `const EQUIPMENT_LIST_BY_CAT = {
  production: {
    ua: ["Обладнання: сканери Zebra/Honeywell", "Обладнання: пакувальні машини", "Обладнання: конвеєрні лінії", "Обладнання: промислові тележки"],
    pl: ["Sprzęt: skanery Zebra/Honeywell", "Sprzęt: maszyny pakujące", "Sprzęt: linie taśmowe", "Sprzęt: wózki przemysłowe"]
  },
  construction: {
    ua: ["Обладнання: будівельні інструменти", "Обладнання: бетонозмішувач", "Обладнання: буд. ліси та помости", "Обладнання: електроінструменти"],
    pl: ["Sprzęt: narzędzia budowlane", "Sprzęt: betoniarka", "Sprzęt: rusztowania", "Sprzęt: elektronarzędzia"]
  },
  agriculture: {
    ua: ["Обладнання: с/г техніка", "Обладнання: ручний садовий інструмент", "Обладнання: системи зрошення", "Обладнання: сортувальні лінії"],
    pl: ["Sprzęt: maszyny rolnicze", "Sprzęt: ręczne narzędzia ogrodnicze", "Sprzęt: systemy nawadniające", "Sprzęt: linie sortujące"]
  },
  cleaning: {
    ua: ["Обладнання: промислові пилососи", "Обладнання: мийні машини", "Обладнання: полірувальники підлоги", "Обладнання: хімічні засоби (надаються)"],
    pl: ["Sprzęt: odkurzacze przemysłowe", "Sprzęt: maszyny czyszczące", "Sprzęt: polerki do podłóg", "Sprzęt: środki chemiczne (zapewnione)"]
  },
  logistics: {
    ua: ["Обладнання: електричні рокли", "Обладнання: сканери штрих-кодів", "Обладнання: навантажувачі", "Обладнання: сортувальні системи"],
    pl: ["Sprzęt: wózki elektryczne", "Sprzęt: skanery kodów kreskowych", "Sprzęt: wózki widłowe", "Sprzęt: systemy sortujące"]
  }
};
function getEquipmentList(catKey) {
  return EQUIPMENT_LIST_BY_CAT[catKey] || EQUIPMENT_LIST_BY_CAT.production;
}

`);
  console.log('✅ Replaced EQUIPMENT_LIST with category-scoped version');
} else {
  console.log('⚠️ Could not find EQUIPMENT_LIST');
}

// ===== 4. Replace PHYSICAL_REQUIREMENTS with category-scoped version =====
const oldPhys = code.match(/const PHYSICAL_REQUIREMENTS = \{[\s\S]*?\n\};\s*\n/);
if (oldPhys) {
  code = code.replace(oldPhys[0], `const PHYSICAL_REQUIREMENTS_BY_CAT = {
  production: {
    ua: ["Фізичні вимоги: піднімання до 15 кг", "Фізичні вимоги: робота стоячи 6–8 год", "Фізичні вимоги: робота у швидкому темпі", "Фізичні вимоги: багато ходьби протягом зміни"],
    pl: ["Wymagania fizyczne: dźwiganie do 15 kg", "Wymagania fizyczne: praca stojąca 6–8 h", "Wymagania fizyczne: praca w szybkim tempie", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany"]
  },
  construction: {
    ua: ["Фізичні вимоги: піднімання до 25 кг", "Фізичні вимоги: робота на висоті", "Фізичні вимоги: робота на відкритому повітрі", "Фізичні вимоги: фізична витривалість"],
    pl: ["Wymagania fizyczne: dźwiganie do 25 kg", "Wymagania fizyczne: praca na wysokości", "Wymagania fizyczne: praca na zewnątrz", "Wymagania fizyczne: wytrzymałość fizyczna"]
  },
  agriculture: {
    ua: ["Фізичні вимоги: робота на відкритому повітрі", "Фізичні вимоги: нахил/присідання", "Фізичні вимоги: піднімання до 15 кг", "Фізичні вимоги: робота у різних погодних умовах"],
    pl: ["Wymagania fizyczne: praca na zewnątrz", "Wymagania fizyczne: pochylanie/przysiady", "Wymagania fizyczne: dźwiganie do 15 kg", "Wymagania fizyczne: praca w różnych warunkach pogodowych"]
  },
  cleaning: {
    ua: ["Фізичні вимоги: піднімання до 10 кг", "Фізичні вимоги: робота стоячи 4–6 год", "Фізичні вимоги: багато ходьби протягом зміни", "Фізичні вимоги: робота ротаційна"],
    pl: ["Wymagania fizyczne: dźwiganie do 10 kg", "Wymagania fizyczne: praca stojąca 4–6 h", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany", "Wymagania fizyczne: praca rotacyjna"]
  },
  logistics: {
    ua: ["Фізичні вимоги: піднімання до 20 кг", "Фізичні вимоги: робота стоячи 6–8 год", "Фізичні вимоги: багато ходьби протягом зміни", "Фізичні вимоги: робота у швидкому темпі"],
    pl: ["Wymagania fizyczne: dźwiganie do 20 kg", "Wymagania fizyczne: praca stojąca 6–8 h", "Wymagania fizyczne: dużo chodzenia w trakcie zmiany", "Wymagania fizyczne: praca w szybkim tempie"]
  }
};
function getPhysicalRequirements(catKey) {
  return PHYSICAL_REQUIREMENTS_BY_CAT[catKey] || PHYSICAL_REQUIREMENTS_BY_CAT.production;
}

`);
  console.log('✅ Replaced PHYSICAL_REQUIREMENTS with category-scoped version');
} else {
  console.log('⚠️ Could not find PHYSICAL_REQUIREMENTS');
}

// ===== 5. Update references in the generation code =====

// Replace WORKPLACE_TYPES.ua/pl with getWorkplaceTypes(catKey).ua/pl
code = code.replace(
  /Math\.min\(WORKPLACE_TYPES\.ua\.length,\s*WORKPLACE_TYPES\.pl\.length\)/g,
  'Math.min(getWorkplaceTypes(catKey).ua.length, getWorkplaceTypes(catKey).pl.length)'
);
code = code.replace(/WORKPLACE_TYPES\.ua\[/g, 'getWorkplaceTypes(catKey).ua[');
code = code.replace(/WORKPLACE_TYPES\.pl\[/g, 'getWorkplaceTypes(catKey).pl[');

// Replace INDUSTRY_SECTORS.ua/pl with getIndustrySectors(catKey).ua/pl
code = code.replace(
  /Math\.min\(INDUSTRY_SECTORS\.ua\.length,\s*INDUSTRY_SECTORS\.pl\.length\)/g,
  'Math.min(getIndustrySectors(catKey).ua.length, getIndustrySectors(catKey).pl.length)'
);
code = code.replace(/INDUSTRY_SECTORS\.ua\[/g, 'getIndustrySectors(catKey).ua[');
code = code.replace(/INDUSTRY_SECTORS\.pl\[/g, 'getIndustrySectors(catKey).pl[');

// Replace EQUIPMENT_LIST.ua/pl with getEquipmentList(catKey).ua/pl
code = code.replace(
  /Math\.min\(EQUIPMENT_LIST\.ua\.length,\s*EQUIPMENT_LIST\.pl\.length\)/g,
  'Math.min(getEquipmentList(catKey).ua.length, getEquipmentList(catKey).pl.length)'
);
code = code.replace(/EQUIPMENT_LIST\.ua\[/g, 'getEquipmentList(catKey).ua[');
code = code.replace(/EQUIPMENT_LIST\.pl\[/g, 'getEquipmentList(catKey).pl[');

// Replace PHYSICAL_REQUIREMENTS.ua/pl with getPhysicalRequirements(catKey).ua/pl
code = code.replace(
  /Math\.min\(PHYSICAL_REQUIREMENTS\.ua\.length,\s*PHYSICAL_REQUIREMENTS\.pl\.length\)/g,
  'Math.min(getPhysicalRequirements(catKey).ua.length, getPhysicalRequirements(catKey).pl.length)'
);
code = code.replace(/PHYSICAL_REQUIREMENTS\.ua\[/g, 'getPhysicalRequirements(catKey).ua[');
code = code.replace(/PHYSICAL_REQUIREMENTS\.pl\[/g, 'getPhysicalRequirements(catKey).pl[');

console.log('✅ Updated all pool references to use category-scoped helpers');

// ===== 5b. Expand categoriesWithSector to include logistics =====
code = code.replace(
  "const categoriesWithSector = ['production', 'construction', 'agriculture', 'cleaning'];",
  "const categoriesWithSector = ['production', 'construction', 'agriculture', 'cleaning', 'logistics'];"
);
console.log('✅ Expanded categoriesWithSector to include logistics');

// ===== 6. Add CITY_CONTEXT for unique per-city content (Fix 7) =====
const cityContextInsertPoint = code.indexOf('const ROLES = {');
if (cityContextInsertPoint > 0) {
  const cityContext = `
// City-specific context for unique per-page content
const CITY_CONTEXT = {
  warsaw:    { ua: "Варшава — найбільший ринок праці в Польщі, столиця з розвиненою інфраструктурою та високим попитом на робочу силу.", pl: "Warszawa — największy rynek pracy w Polsce, stolica z rozwiniętą infrastrukturą i dużym zapotrzebowaniem na pracowników." },
  krakow:    { ua: "Краків — друге за величиною місто Польщі, відоме великою кількістю сервісних центрів та туристичною інфраструктурою.", pl: "Kraków — drugie co do wielkości miasto Polski, znane z licznych centrów usługowych i infrastruktury turystycznej." },
  wroclaw:   { ua: "Вроцлав — динамічне місто з великою кількістю логістичних центрів та виробництв.", pl: "Wrocław — dynamiczne miasto z dużą liczbą centrów logistycznych i zakładów produkcyjnych." },
  poznan:    { ua: "Познань — потужний промисловий центр на заході Польщі з розвиненою логістикою.", pl: "Poznań — silne centrum przemysłowe w zachodniej Polsce z rozwiniętą logistyką." },
  gdansk:    { ua: "Гданськ — портове місто з розвиненою судноплавною і логістичною галуззю.", pl: "Gdańsk — miasto portowe z rozwiniętą branżą morską i logistyczną." },
  szczecin:  { ua: "Щецін — портовий хаб біля кордону з Німеччиною, зручна логістика та доступ до EU.", pl: "Szczecin — hub portowy blisko granicy z Niemcami, wygodna logistyka i dostęp do UE." },
  lodz:      { ua: "Лодзь — колишня текстильна столиця Польщі, тепер великий логістичний та виробничий центр.", pl: "Łódź — była stolica tekstylna Polski, obecnie duże centrum logistyczne i produkcyjne." },
  katowice:  { ua: "Катовіце — серце Сілезького регіону з великою кількістю виробничих підприємств.", pl: "Katowice — serce regionu śląskiego z licznymi zakładami produkcyjnymi." },
  lublin:    { ua: "Люблін — найбільше місто на сході Польщі з розвиненим агро- та харчовим сектором.", pl: "Lublin — największe miasto wschodniej Polski z rozwiniętym sektorem rolno-spożywczym." },
  bialystok: { ua: "Білосток — місто на північному сході, близькість до кордону, зростаючий ринок праці.", pl: "Białystok — miasto na północnym wschodzie, bliskość granicy, rosnący rynek pracy." },
  rzeszow:   { ua: "Ряшів — столиця Підкарпаття, динамічно розвивається, зростає попит на працівників.", pl: "Rzeszów — stolica Podkarpacia, dynamicznie się rozwija, rosnące zapotrzebowanie na pracowników." },
  torun:     { ua: "Торунь — історичне місто з розвиненою харчовою промисловістю та виробництвом.", pl: "Toruń — zabytkowe miasto z rozwiniętym przemysłem spożywczym i produkcją." },
  plock:     { ua: "Плоцьк — промислове місто на р. Вісла, відоме нафтопереробкою та хімічною промисловістю.", pl: "Płock — miasto przemysłowe nad Wisłą, znane z rafinerii i przemysłu chemicznego." },
  sosnowiec: { ua: "Сосновець — частина Сілезької агломерації, великий промисловий і логістичний потенціал.", pl: "Sosnowiec — część aglomeracji śląskiej, duży potencjał przemysłowy i logistyczny." },
  gdynia:    { ua: "Гдиня — портове місто Тріміста, центр морської логістики та контейнерних перевезень.", pl: "Gdynia — miasto portowe Trójmiasta, centrum logistyki morskiej i kontenerowej." }
};

`;
  code = code.slice(0, cityContextInsertPoint) + cityContext + code.slice(cityContextInsertPoint);
  console.log('✅ Added CITY_CONTEXT map');
} else {
  console.log('⚠️ Could not find insertion point for CITY_CONTEXT');
}

// ===== 7. Add city context to vacancy body generation =====
// Inject city-specific paragraph into vacancy body templates
// Find the bodyUA and bodyPL template strings and add city context after the intro paragraph

// For UA body
const bodyUAIntro = '<p>${introUA}</p>';
const bodyUAIntroIdx = code.indexOf(bodyUAIntro);
if (bodyUAIntroIdx > 0) {
  const afterIntroUA = bodyUAIntroIdx + bodyUAIntro.length;
  code = code.slice(0, afterIntroUA) +
    "\n          ${CITY_CONTEXT[city.slug] ? '<p class=\"city-context\">' + CITY_CONTEXT[city.slug].ua + '</p>' : ''}" +
    code.slice(afterIntroUA);
  console.log('✅ UA body: injected city context after intro');
} else {
  console.log('⚠️ Could not find UA body intro');
}

// For PL body
const bodyPLIntro = '<p>${introPL}</p>';
const bodyPLIntroIdx = code.indexOf(bodyPLIntro);
if (bodyPLIntroIdx > 0) {
  const afterIntroPL = bodyPLIntroIdx + bodyPLIntro.length;
  code = code.slice(0, afterIntroPL) +
    "\n          ${CITY_CONTEXT[city.slug] ? '<p class=\"city-context\">' + CITY_CONTEXT[city.slug].pl + '</p>' : ''}" +
    code.slice(afterIntroPL);
  console.log('✅ PL body: injected city context after intro');
} else {
  console.log('⚠️ Could not find PL body intro');
}

// ===== 8. Remove is_generated / data_source from output =====
// Already handled in generate.js, but also clean up the source marker
// (keep is_generated internally for generate.js to use, but it won't appear in public JSON)

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n✅ All fixes applied to generate-jobs.js');
console.log('Run: node src/generate-jobs.js && node src/generate.js && node src/generate-sitemap.js');
