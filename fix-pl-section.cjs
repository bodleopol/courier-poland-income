const fs = require('fs');
let html = fs.readFileSync('src/about.html', 'utf8');

// Find PL section
const plStartMarker = 'data-lang-content="pl"';
const plStartIdx = html.indexOf(plStartMarker);
if (plStartIdx === -1) { console.log('PL section not found!'); process.exit(1); }

// Go back to find the opening <div
const divOpenIdx = html.lastIndexOf('<div', plStartIdx);
console.log('PL <div starts at index:', divOpenIdx);

// Find the closing </div> that matches this section
// The PL div ends right before </article>
const articleIdx = html.indexOf('</article>', plStartIdx);
if (articleIdx === -1) { console.log('</article> not found!'); process.exit(1); }

// The last </div> before </article> closes the PL section
const beforeArticle = html.substring(0, articleIdx);
const lastDivClose = beforeArticle.lastIndexOf('</div>');
const plEndIdx = lastDivClose + '</div>'.length;

console.log('PL section ends at index:', plEndIdx);
console.log('Old PL section length:', plEndIdx - divOpenIdx);

const oldPl = html.substring(divOpenIdx, plEndIdx);
console.log('Old PL starts with:', oldPl.substring(0, 100));
console.log('Old PL ends with:', oldPl.substring(oldPl.length - 100));

const newPl = `<div data-lang-content="pl" style="display:none">
        <p style="font-size:1.15rem;line-height:1.7;"><strong>Rybezh</strong> to platforma informacyjna i redakcja, kt\u00F3ra pomaga Ukrai\u0144com zorientowa\u0107 si\u0119 na rynku pracy w Polsce. Nie jeste\u015Bmy agencj\u0105 rekrutacyjn\u0105 i nie podpisujemy um\u00F3w w Twoim imieniu \u2014 naszym zadaniem jest dostarczenie rzetelnych, sprawdzonych informacji, wyja\u015Bnienie warunk\u00F3w prostym j\u0119zykiem i ostrze\u017Cenie o \u201Edrobnym druku\u201D, kt\u00F3ry zwykle widoczny jest dopiero po pierwszej wyp\u0142acie.</p>

        <div class="brand-story">
          <span class="brand-kicker">Dlaczego Rybezh istnieje</span>
          <h2>Misja i warto\u015Bci</h2>
          <div class="brand-grid">
            <div class="brand-card">
              <h3>\uD83C\uDFAF Misja</h3>
              <p>U\u0142atwi\u0107 start pracy w Polsce. Bez \u201Ez\u0142otych g\u00F3r\u201D w og\u0142oszeniach, z realnymi liczbami i wsparciem, gdy co\u015B idzie nie po my\u015Bli.</p>
            </div>
            <div class="brand-card">
              <h3>\uD83D\uDD2D Wizja</h3>
              <p>Rynek pracy, na kt\u00F3rym decyzje podejmuje si\u0119 na podstawie fakt\u00F3w, nie obietnic. Warunki zrozumia\u0142e jeszcze przed przyjazdem, a szarych schemat\u00F3w z roku na rok coraz mniej.</p>
            </div>
            <div class="brand-card">
              <h3>\uD83D\uDCD6 Jak to si\u0119 zacz\u0119\u0142o</h3>
              <p>W 2021 roku pomagali\u015Bmy znajomym w pierwszych zmianach w Polsce. Listy porad, sprawdzone warunki i \u201Eco jest nie tak z t\u0105 ofert\u0105\u201D stopniowo z\u0142o\u017Cy\u0142y si\u0119 w Rybezh \u2014 projekt, kt\u00F3ry wyr\u00F3s\u0142 z prawdziwych historii, nie z prezentacji marketingowych.</p>
            </div>
          </div>
        </div>

        <h2>Za\u0142o\u017Cycielka i redakcja</h2>
        <p>Za ka\u017Cdym tekstem na Rybezh stoi konkretna osoba: z do\u015Bwiadczeniem, specjalizacj\u0105 i odpowiedzialno\u015Bci\u0105 za to, co zosta\u0142o napisane. Nie jeste\u015Bmy anonimowym \u201Ezespo\u0142em\u201D \u2014 poka\u017Cemy, kto sprawdza\u0142 liczby, kto pisa\u0142 poradnik, kto analizowa\u0142 rynek.</p>

        <div class="team-grid" style="margin-top:1.5rem;">

          <div class="team-card" style="border-left: 4px solid var(--color-accent);">
            <div class="testimonial-header">
              <div class="avatar-circle" style="background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;font-size:1.1rem;">OR</div>
              <div>
                <div class="testimonial-name" style="font-size:1.1rem;">Olena Rybecka</div>
                <div class="team-role">Za\u0142o\u017Cycielka Rybezh</div>
              </div>
            </div>
            <p>6 lat w logistyce w Polsce. Wspiera\u0142a adaptacj\u0119 nowych pracownik\u00F3w i widzia\u0142a, gdzie dok\u0142adnie ludzie trac\u0105 czas i pieni\u0105dze z powodu niedopowiedze\u0144. Rybezh wymy\u015Bli\u0142a jako serwis, kt\u00F3ry m\u00F3wi uczciwie: bez szablon\u00F3w, bez upiekszania warunk\u00F3w, zrozumia\u0142ym j\u0119zykiem. Pisze o strategii zatrudnienia, umowach, legalizacji i og\u00F3lnym obrazie rynku.</p>
            <div style="font-size:0.85rem;color:var(--color-secondary);margin-top:0.5rem;">\u270D\uFE0F Autorka 15 artyku\u0142\u00F3w na blogu Rybezh</div>
          </div>

          <div class="team-card">
            <div class="testimonial-header">
              <div class="avatar-circle" style="background:#e0f2fe;color:#0369a1;">MK</div>
              <div>
                <div class="testimonial-name">Maryna Kowalenko</div>
                <div class="team-role">Redaktorka Rybezh</div>
              </div>
            </div>
            <p>Dziennikarka z 8-letnim do\u015Bwiadczeniem w mediach. Sprawdza fakty, redaguje teksty i pilnuje, \u017Ceby \u017Cadne zdanie nie by\u0142o \u201Ewod\u0105\u201D. Je\u015Bli co\u015B nie jest potwierdzone \u2014 wstrzymuje publikacj\u0119. Odpowiada za jako\u015B\u0107 tre\u015Bci i standardy redakcyjne.</p>
            <div style="font-size:0.85rem;color:var(--color-secondary);margin-top:0.5rem;">\u270D\uFE0F Autorka 9 artyku\u0142\u00F3w na blogu Rybezh</div>
          </div>

          <div class="team-card">
            <div class="testimonial-header">
              <div class="avatar-circle" style="background:#fef3c7;color:#92400e;">AM</div>
              <div>
                <div class="testimonial-name">Andrij Melnyk</div>
                <div class="team-role">Analityk rynku pracy</div>
              </div>
            </div>
            <p>Ekonomista z wykszta\u0142cenia, 5 lat analizuje migracj\u0119 zarobkow\u0105 w UE. Zbiera dane o stawkach, ZUS, podatkach i realnych kosztach w r\u00F3\u017Cnych miastach Polski. Jego teksty to liczby, tabele i por\u00F3wnania, nie og\u00F3lne s\u0142owa.</p>
            <div style="font-size:0.85rem;color:var(--color-secondary);margin-top:0.5rem;">\u270D\uFE0F Autor 9 artyku\u0142\u00F3w na blogu Rybezh</div>
          </div>

          <div class="team-card">
            <div class="testimonial-header">
              <div class="avatar-circle" style="background:#f0fdf4;color:#166534;">DB</div>
              <div>
                <div class="testimonial-name">Dmytro Bondarenko</div>
                <div class="team-role">Konsultant HR</div>
              </div>
            </div>
            <p>10 lat w HR i rekrutacji w Polsce i na Ukrainie. Zna rynek \u201Eod \u015Brodka\u201D: jak wygl\u0105da realny nab\u00F3r, co naprawd\u0119 sprawdzaj\u0105 pracodawcy i gdzie zaczynaj\u0105 si\u0119 szare schematy. Pisze praktyczne poradniki dla os\u00F3b rozpoczynaj\u0105cych poszukiwanie pracy.</p>
            <div style="font-size:0.85rem;color:var(--color-secondary);margin-top:0.5rem;">\u270D\uFE0F Autor 10 artyku\u0142\u00F3w na blogu Rybezh</div>
          </div>

        </div>

        <h3 style="margin-top:2.5rem;">Kr\u00F3tki timeline</h3>
        <div class="brand-timeline">
          <div class="timeline-item"><span class="timeline-year">2021</span><span>Pierwsze checklisty i konsultacje dla znajomych. Testowanie formatu \u201Euczciwa informacja bez upieksze\u0144\u201D.</span></div>
          <div class="timeline-item"><span class="timeline-year">2022</span><span>Start strony. Pierwsze zweryfikowane oferty w Warszawie i \u0141odzi. Pierwsze poradniki redakcyjne.</span></div>
          <div class="timeline-item"><span class="timeline-year">2023</span><span>Standardy weryfikacji warunk\u00F3w: ka\u017Cda oferta przechodzi fact-check. Dodano sekcj\u0119 bloga.</span></div>
          <div class="timeline-item"><span class="timeline-year">2024</span><span>Rozszerzenie zespo\u0142u: Maryna, Andrij i Dmytro do\u0142\u0105czyli do redakcji. Wsparcie 24/7 na Telegramie.</span></div>
          <div class="timeline-item"><span class="timeline-year">2025</span><span>Ponad 5 000 u\u017Cytkownik\u00F3w. Partnerstwa z firmami logistycznymi. 40+ autorskich artyku\u0142\u00F3w.</span></div>
          <div class="timeline-item"><span class="timeline-year">2026</span><span>Aktualizacja bloga, nowe narz\u0119dzia adaptacyjne, rozszerzenie na nowe kategorie ofert.</span></div>
        </div>

        <h2>Jak pracujemy</h2>
        <div style="display: grid; gap: 1rem;">
          <div style="background: var(--color-surface-alt); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--color-accent);">
            <h3>\uD83D\uDCCB Weryfikacja ofert</h3>
            <p>Sprawdzamy warunki z kilku \u017Ar\u00F3de\u0142, doprecyzowujemy szczeg\u00F3\u0142y bezpo\u015Brednio z pracodawc\u0105. Zapisujemy grafik, realn\u0105 stawk\u0119, dodatkowe koszty i zakres zada\u0144. Je\u015Bli co\u015B si\u0119 nie zgadza \u2014 oferta nie przechodzi.</p>
          </div>
          <div style="background: var(--color-surface-alt); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--color-accent);">
            <h3>\u270D\uFE0F Standardy redakcyjne</h3>
            <p>Ka\u017Cdy tekst przechodzi przez autora, fact-checkera i redaktora. Nie piszemy \u201Ewody\u201D i nie kopiujemy z innych \u017Ar\u00F3de\u0142. Wszystkie liczby \u2014 z otwartych polskich \u017Ar\u00F3de\u0142 (GUS, ZUS, PIP), sprawdzone na dat\u0119 publikacji.</p>
          </div>
          <div style="background: var(--color-surface-alt); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--color-accent);">
            <h3>\uD83E\uDD1D Uczciwe podej\u015Bcie</h3>
            <p>Ka\u017Cda oferta ma plusy i minusy \u2014 pokazujemy obie strony. Nie obiecujemy \u201Ez\u0142otych g\u00F3r\u201D i nie ukrywamy niuans\u00F3w. Cel \u2014 \u015Bwiadoma decyzja, nie impulsywna przeprowadzka.</p>
          </div>
        </div>

        <h2>Partnerzy</h2>
        <div class="trust-badges">
          <span class="trust-badge">5 000+ u\u017Cytkownik\u00F3w</span>
          <span class="trust-badge">Za\u0142o\u017Cono w 2021</span>
          <span class="trust-badge">43 autorskie artyku\u0142y</span>
          <span class="trust-badge">UA + PL j\u0119zyki</span>
        </div>
        <div class="logo-wall">
          <div class="logo-pill">NordLane Logistics</div>
          <div class="logo-pill">Vistula Ware</div>
          <div class="logo-pill">MetroFleet</div>
          <div class="logo-pill">GreenDock</div>
          <div class="logo-pill">CityPost Hub</div>
        </div>

        <h2 style="margin-top: 2.5rem;">Opinie</h2>
        <div class="testimonial-grid">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="avatar-circle">IK</div>
              <div>
                <div class="testimonial-name">Iryna K.</div>
                <div class="testimonial-role">Krak\u00F3w, magazyn</div>
              </div>
            </div>
            <p>\u201EBy\u0142am sceptyczna, ale zesp\u00F3\u0142 naprawd\u0119 pom\u00F3g\u0142 si\u0119 zorientowa\u0107. Bez presji, bez obietnic, wszystko po ludzku.\u201D</p>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="avatar-circle">PW</div>
              <div>
                <div class="testimonial-name">Pawe\u0142 W.</div>
                <div class="testimonial-role">Warszawa, delivery</div>
              </div>
            </div>
            <p>\u201EKoordynator by\u0142 dost\u0119pny, wszystko wyt\u0142umaczy\u0142 normalnym j\u0119zykiem. Spokojnie ruszy\u0142em na pierwsz\u0105 zmian\u0119.\u201D</p>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="avatar-circle">EP</div>
              <div>
                <div class="testimonial-name">Ewa P.</div>
                <div class="testimonial-role">Gda\u0144sk, HR-koordynator</div>
              </div>
            </div>
            <p>\u201EWsp\u00F3\u0142praca z Rybezh to jako\u015B\u0107 i szczero\u015B\u0107, a nie pogoń za liczb\u0105.\u201D</p>
          </div>
        </div>

        <h2>Kontakt</h2>
        <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));margin-top:1rem;">
          <div style="background:var(--color-surface-alt);padding:1.25rem;border-radius:12px;">
            <h3>\uD83D\uDCE7 Email</h3>
            <p><a href="mailto:contacts@rybezh.site">contacts@rybezh.site</a></p>
          </div>
          <div style="background:var(--color-surface-alt);padding:1.25rem;border-radius:12px;">
            <h3>\uD83D\uDCAC Telegram</h3>
            <p><a href="https://t.me/rybezh_site" target="_blank" rel="noopener noreferrer">@rybezh_site</a></p>
          </div>
          <div style="background:var(--color-surface-alt);padding:1.25rem;border-radius:12px;">
            <h3>\uD83D\uDCC4 Dokumenty</h3>
            <p><a href="/terms.html">Regulamin</a> \u00B7 <a href="/privacy.html">Prywatno\u015B\u0107</a> \u00B7 <a href="/company.html">Dane firmy</a></p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(0, 166, 126, 0.1), rgba(15, 118, 110, 0.1)); padding: 2rem; border-radius: 12px; border: 1px solid var(--color-accent); margin-top: 2.5rem; text-align:center;">
          <h3>Gotowy om\u00F3wi\u0107 opcje?</h3>
          <p>Napisz do nas na Telegramie lub zostaw kr\u00F3tkie zg\u0142oszenie \u2014 podpowiemy kolejne kroki i pomo\u017Cemy si\u0119 zorientowa\u0107.</p>
          <a href="/apply.html" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Z\u0142\u00F3\u017C wniosek</a>
        </div>
      </div>`;

html = html.substring(0, divOpenIdx) + newPl + html.substring(plEndIdx);

fs.writeFileSync('src/about.html', html, 'utf8');
console.log('PL section replaced successfully!');
console.log('New file length:', html.length);
