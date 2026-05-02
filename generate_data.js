import fs from 'fs';

const specialists = [];
const roles = ['Software Engineer', 'Director', 'Founder', 'Scientist', 'Designer'];
const names = ['Alex', 'Maria', 'John', 'Anna', 'David', 'Sarah', 'Michael', 'Emily', 'James', 'Jessica'];
const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

for (let i = 1; i <= 100; i++) {
    const name = names[i % names.length];
    const surname = surnames[i % surnames.length];
    const role = roles[i % roles.length];
    const slug = `${name.toLowerCase()}-${surname.toLowerCase()}-${i}`;

    specialists.push({
        slug: slug,
        image: `https://ui-avatars.com/api/?name=${name}+${surname}&size=200`,
        name: {
            uk: `${name} ${surname} (UK)`,
            ru: `${name} ${surname} (RU)`,
            en: `${name} ${surname}`,
            es: `${name} ${surname} (ES)`
        },
        role: {
            uk: `${role} (UK)`,
            ru: `${role} (RU)`,
            en: `${role}`,
            es: `${role} (ES)`
        },
        bio: {
            uk: `Це біографія для ${name} ${surname}, досвідченого ${role} з України. Має багато років досвіду у своїй сфері та прагне до інновацій.`,
            ru: `Это биография для ${name} ${surname}, опытного ${role}. Имеет многолетний опыт в своей сфере и стремится к инновациям.`,
            en: `This is the biography for ${name} ${surname}, an experienced ${role}. They have years of experience in their field and are passionate about innovation.`,
            es: `Esta es la biografía de ${name} ${surname}, un experimentado ${role}. Tienen años de experiencia en su campo y les apasiona la innovación.`
        },
        tags: {
            uk: ['Лідерство', 'Технології', 'Інновації'],
            ru: ['Лидерство', 'Технологии', 'Инновации'],
            en: ['Leadership', 'Technology', 'Innovation'],
            es: ['Liderazgo', 'Tecnología', 'Innovación']
        }
    });
}

fs.writeFileSync('src/specialists.json', JSON.stringify(specialists, null, 2));
console.log('100 specialists generated.');
