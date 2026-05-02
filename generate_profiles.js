import fs from 'fs';
import path from 'path';

const DB_FILE = 'src/specialists.json';
const OUTPUT_DIR = 'src/pages/profiles';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const specialists = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// We will accumulate cards to inject into the dist index files later via build.js
let indexCards = { uk: '', ru: '', en: '', es: '' };

specialists.forEach(person => {
    const slug = person.slug;

    // HTML fragment generation
    const generateHtml = (lang) => {
        const title = person.name[lang];
        const role = person.role[lang];
        const bio = person.bio[lang];
        const image = person.image;

        let tagsHtml = '';
        if (person.tags && person.tags[lang]) {
            tagsHtml = person.tags[lang].map(tag => `<span class="tag">${tag}</span>`).join('');
        }

        // Return ONLY a fragment, no doctype/head/body so build.js can inject it
        return `
<title>${title} - ${role} | Rybezh</title>
<meta name="description" content="${bio.substring(0, 150)}...">
<meta name="keywords" content="${title}, ${role}, Rybezh">

<article class="content-wrapper">
    <div class="profile-header">
        <img src="${image}" alt="${title}" class="profile-avatar-large">
        <div class="profile-info">
            <h1>${title}</h1>
            <h2>${role}</h2>
            <div class="tags">
                ${tagsHtml}
            </div>
        </div>
    </div>

    <div class="profile-content">
        <h3>Biography</h3>
        <p>${bio}</p>
    </div>
</article>
`;
    };

    // Generate fragments
    fs.writeFileSync(path.join(OUTPUT_DIR, `generated_${slug}.html`), generateHtml('uk'));
    fs.writeFileSync(path.join(OUTPUT_DIR, `generated_${slug}-ru.html`), generateHtml('ru'));
    fs.writeFileSync(path.join(OUTPUT_DIR, `generated_${slug}-en.html`), generateHtml('en'));
    fs.writeFileSync(path.join(OUTPUT_DIR, `generated_${slug}-es.html`), generateHtml('es'));

    // Accumulate cards for index
    const createCard = (lang, viewBtnText, fileSuffix) => `
        <article class="card">
            <img src="${person.image}" alt="${person.name[lang]}">
            <h3>${person.name[lang]}</h3>
            <p class="meta">${person.role[lang]}</p>
            <a class="btn" href="generated_${slug}${fileSuffix}">${viewBtnText}</a>
        </article>`;

    indexCards.uk += createCard('uk', 'Подивитись профіль', '.html');
    indexCards.ru += createCard('ru', 'Все профили', '-ru.html');
    indexCards.en += createCard('en', 'View profile', '-en.html');
    indexCards.es += createCard('es', 'Ver perfil', '-es.html');
});

fs.writeFileSync('src/generated_index_cards.json', JSON.stringify(indexCards));
console.log('Profiles generated successfully.');
