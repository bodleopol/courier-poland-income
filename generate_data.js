import fs from 'fs';

const langs = ['uk', 'en', 'ru', 'es'];

const t = (uk, en, ru, es) => ({ uk, en, ru, es });
const commons = file => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURI(file.replaceAll(' ', '_'))}?width=720`;
const logo = domain => `https://logo.clearbit.com/${domain}`;

const specialists = [
  {
    slug: 'ada-lovelace',
    image: commons('Ada_Lovelace_portrait.jpg'),
    name: t('Ада Лавлейс', 'Ada Lovelace', 'Ада Лавлейс', 'Ada Lovelace'),
    role: t('Піонерка програмування', 'Programming pioneer', 'Пионер программирования', 'Pionera de la programación'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('алгоритми, аналітичні машини, математичне моделювання', 'algorithms, analytical engines, mathematical modelling', 'алгоритмы, аналитические машины, математическое моделирование', 'algoritmos, máquinas analíticas y modelado matemático'),
    knownFor: t('перший опис алгоритму для обчислювальної машини Чарльза Беббіджа', 'the first published algorithm for Charles Babbage\'s analytical engine', 'первое опубликованное описание алгоритма для аналитической машины Чарльза Бэббиджа', 'el primer algoritmo publicado para la máquina analítica de Charles Babbage'),
    life: t('Її нотатки поєднали математику з баченням машин, здатних працювати не лише з числами, а й із символами та музикою.', 'Her notes joined mathematics with a broader vision of machines that could work with symbols, music and ideas, not only numbers.', 'Ее заметки соединили математику с представлением о машинах, которые могут работать не только с числами, но и с символами и музыкой.', 'Sus notas unieron matemáticas con una visión de máquinas capaces de trabajar no solo con números, sino también con símbolos y música.'),
    tags: ['software', 'research', 'history']
  },
  {
    slug: 'grace-hopper',
    image: commons('Commodore_Grace_M._Hopper,_USN_(covered).jpg'),
    name: t('Грейс Гоппер', 'Grace Hopper', 'Грейс Хоппер', 'Grace Hopper'),
    role: t('Компʼютерна науковиця та контрадмірал', 'Computer scientist and rear admiral', 'Компьютерный ученый и контр-адмирал', 'Científica informática y contraalmirante'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('компілятори, COBOL, стандарти програмування', 'compilers, COBOL, programming standards', 'компиляторы, COBOL, стандарты программирования', 'compiladores, COBOL y estándares de programación'),
    knownFor: t('популяризацію машинно-незалежних мов програмування', 'popularising machine-independent programming languages', 'популяризацию машинно-независимых языков программирования', 'popularizar lenguajes de programación independientes de la máquina'),
    life: t('Вона працювала на перетині науки, флоту та промисловості, роблячи програмування зрозумілішим для широких команд.', 'She worked across science, the navy and industry, making software development more understandable for large teams.', 'Она работала на стыке науки, флота и индустрии, делая разработку программ понятнее для больших команд.', 'Trabajó entre ciencia, marina e industria, haciendo el desarrollo de software más comprensible para equipos amplios.'),
    tags: ['software', 'operations', 'education']
  },
  {
    slug: 'margaret-hamilton',
    image: commons('Margaret_Hamilton_-_restoration.jpg'),
    name: t('Маргарет Гамільтон', 'Margaret Hamilton', 'Маргарет Гамильтон', 'Margaret Hamilton'),
    role: t('Інженерка програмного забезпечення', 'Software engineer', 'Инженер программного обеспечения', 'Ingeniera de software'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('надійні системи, космічне ПЗ, системна архітектура', 'reliable systems, space software, systems architecture', 'надежные системы, космическое ПО, системная архитектура', 'sistemas fiables, software espacial y arquitectura de sistemas'),
    knownFor: t('керівництво розробкою бортового ПЗ Apollo', 'leading the Apollo flight software effort', 'руководство разработкой бортового ПО Apollo', 'liderar el software de vuelo de Apollo'),
    life: t('Її робота показала, що програмне забезпечення може бути критичною інженерною дисципліною з власними методами контролю ризику.', 'Her work helped define software as a critical engineering discipline with its own methods for managing risk.', 'Ее работа показала, что программное обеспечение является критической инженерной дисциплиной со своими методами управления риском.', 'Su trabajo ayudó a definir el software como disciplina crítica de ingeniería con métodos propios de control de riesgo.'),
    tags: ['software', 'space', 'engineering']
  },
  {
    slug: 'katherine-johnson',
    image: commons('Katherine_Johnson_1983.jpg'),
    name: t('Кетрін Джонсон', 'Katherine Johnson', 'Кэтрин Джонсон', 'Katherine Johnson'),
    role: t('Математикиня NASA', 'NASA mathematician', 'Математик NASA', 'Matemática de NASA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('орбітальна механіка, траєкторії польотів, аналітика місій', 'orbital mechanics, flight trajectories, mission analysis', 'орбитальная механика, траектории полетов, аналитика миссий', 'mecánica orbital, trayectorias de vuelo y análisis de misiones'),
    knownFor: t('розрахунки траєкторій для Mercury та Apollo', 'trajectory calculations for Mercury and Apollo missions', 'расчеты траекторий для миссий Mercury и Apollo', 'cálculos de trayectoria para Mercury y Apollo'),
    life: t('Її точність і спокійна експертиза стали частиною фундаменту ранньої пілотованої космонавтики.', 'Her precision and calm expertise became part of the foundation of early human spaceflight.', 'Ее точность и спокойная экспертиза стали частью фундамента ранней пилотируемой космонавтики.', 'Su precisión y experiencia serena formaron parte de la base de los primeros vuelos espaciales tripulados.'),
    tags: ['science', 'space', 'mathematics']
  },
  {
    slug: 'mae-jemison',
    image: commons('Mae_Jemison_in_Space.jpg'),
    name: t('Мей Джемісон', 'Mae Jemison', 'Мэй Джемисон', 'Mae Jemison'),
    role: t('Астронавтка, лікарка та інженерна лідерка', 'Astronaut, physician and engineering leader', 'Астронавт, врач и инженерный лидер', 'Astronauta, médica y líder de ingeniería'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('космос, медицина, STEM-освіта, технологічні місії', 'space, medicine, STEM education, technology missions', 'космос, медицина, STEM-образование, технологические миссии', 'espacio, medicina, educación STEM y misiones tecnológicas'),
    knownFor: t('першу афроамериканську жінку в космосі', 'becoming the first Black woman in space', 'статус первой афроамериканки в космосе', 'ser la primera mujer afroamericana en el espacio'),
    life: t('Після польоту вона розвивала освітні й технологічні ініціативи, що відкривають науку для ширших спільнот.', 'After her flight she built education and technology initiatives that make science accessible to wider communities.', 'После полета она развивала образовательные и технологические инициативы, открывающие науку для широких сообществ.', 'Tras su vuelo impulsó iniciativas educativas y tecnológicas que acercan la ciencia a comunidades más amplias.'),
    tags: ['space', 'science', 'education']
  },
  {
    slug: 'yuri-gagarin',
    image: commons('Yuri_Gagarin_(1961)_-_Restoration.jpg'),
    name: t('Юрій Гагарін', 'Yuri Gagarin', 'Юрий Гагарин', 'Yuri Gagarin'),
    role: t('Космонавт', 'Cosmonaut', 'Космонавт', 'Cosmonauta'),
    country: t('СРСР', 'Soviet Union', 'СССР', 'Unión Soviética'),
    focus: t('пілотована космонавтика, льотна підготовка, випробування', 'human spaceflight, pilot training, flight testing', 'пилотируемая космонавтика, летная подготовка, испытания', 'vuelos espaciales tripulados, entrenamiento de pilotos y pruebas'),
    knownFor: t('перший політ людини в космос', 'the first human journey into outer space', 'первый полет человека в космос', 'el primer viaje humano al espacio exterior'),
    life: t('Політ “Восток-1” зробив його символом космічної епохи та показав масштаби інженерних команд за кожною місією.', 'The Vostok 1 flight made him a symbol of the space age and revealed the scale of engineering teams behind every mission.', 'Полет «Восток-1» сделал его символом космической эпохи и показал масштаб инженерных команд за каждой миссией.', 'El vuelo Vostok 1 lo convirtió en símbolo de la era espacial y mostró la escala de los equipos de ingeniería detrás de cada misión.'),
    tags: ['space', 'aviation', 'history']
  },
  {
    slug: 'valentina-tereshkova',
    image: commons('RIAN_archive_612748_Valentina_Tereshkova.jpg'),
    name: t('Валентина Терешкова', 'Valentina Tereshkova', 'Валентина Терешкова', 'Valentina Tereshkova'),
    role: t('Космонавтка', 'Cosmonaut', 'Космонавт', 'Cosmonauta'),
    country: t('СРСР', 'Soviet Union', 'СССР', 'Unión Soviética'),
    focus: t('космічні польоти, випробування, громадська діяльність', 'spaceflight, testing, public service', 'космические полеты, испытания, общественная деятельность', 'vuelos espaciales, pruebas y servicio público'),
    knownFor: t('першу жінку в космосі', 'becoming the first woman in space', 'статус первой женщины в космосе', 'ser la primera mujer en el espacio'),
    life: t('Її місія стала історичним прикладом того, як інженерія, підготовка й особиста витривалість змінюють уявлення про можливе.', 'Her mission became a historic example of engineering, training and personal endurance expanding what society considered possible.', 'Ее миссия стала историческим примером того, как инженерия, подготовка и личная выносливость меняют представления о возможном.', 'Su misión fue un ejemplo histórico de cómo ingeniería, entrenamiento y resistencia personal amplían lo posible.'),
    tags: ['space', 'leadership', 'history']
  },
  {
    slug: 'tim-berners-lee',
    image: commons('Sir_Tim_Berners-Lee_(cropped).jpg'),
    name: t('Тім Бернерс-Лі', 'Tim Berners-Lee', 'Тим Бернерс-Ли', 'Tim Berners-Lee'),
    role: t('Винахідник World Wide Web', 'Inventor of the World Wide Web', 'Изобретатель World Wide Web', 'Inventor de la World Wide Web'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('відкритий веб, протоколи, цифрові права', 'open web, protocols, digital rights', 'открытый веб, протоколы, цифровые права', 'web abierta, protocolos y derechos digitales'),
    knownFor: t('створення HTTP, HTML, URL та концепції вебу', 'creating HTTP, HTML, URL concepts and the Web itself', 'создание HTTP, HTML, URL и самой концепции веба', 'crear HTTP, HTML, URL y la web moderna'),
    life: t('Його підхід зробив інтернет платформою для спільних знань, бізнесу, науки та культури.', 'His approach turned the internet into a platform for shared knowledge, business, science and culture.', 'Его подход сделал интернет платформой для знаний, бизнеса, науки и культуры.', 'Su enfoque convirtió internet en una plataforma para conocimiento compartido, negocios, ciencia y cultura.'),
    tags: ['software', 'internet', 'standards']
  },
  {
    slug: 'linus-torvalds',
    image: commons('LinuxCon_Europe_Linus_Torvalds_03_(cropped).jpg'),
    name: t('Лінус Торвальдс', 'Linus Torvalds', 'Линус Торвальдс', 'Linus Torvalds'),
    role: t('Інженер ПЗ, засновник Linux', 'Software engineer, creator of Linux', 'Инженер ПО, создатель Linux', 'Ingeniero de software, creador de Linux'),
    country: t('Фінляндія / США', 'Finland / United States', 'Финляндия / США', 'Finlandia / Estados Unidos'),
    focus: t('ядра ОС, open source, розподілена розробка', 'operating-system kernels, open source, distributed development', 'ядра ОС, open source, распределенная разработка', 'núcleos de sistemas operativos, código abierto y desarrollo distribuido'),
    knownFor: t('Linux та Git', 'Linux and Git', 'Linux и Git', 'Linux y Git'),
    life: t('Його інструменти стали інфраструктурою для серверів, хмарних платформ, мобільних пристроїв і команд розробників.', 'His tools became infrastructure for servers, cloud platforms, mobile devices and software teams.', 'Его инструменты стали инфраструктурой для серверов, облаков, мобильных устройств и команд разработчиков.', 'Sus herramientas se volvieron infraestructura para servidores, nubes, dispositivos móviles y equipos de software.'),
    tags: ['software', 'open-source', 'infrastructure']
  },
  {
    slug: 'guido-van-rossum',
    image: commons('Guido_van_Rossum_OSCON_2006.jpg'),
    name: t('Гвідо ван Россум', 'Guido van Rossum', 'Гвидо ван Россум', 'Guido van Rossum'),
    role: t('Програміст, творець Python', 'Programmer, creator of Python', 'Программист, создатель Python', 'Programador, creador de Python'),
    country: t('Нідерланди / США', 'Netherlands / United States', 'Нидерланды / США', 'Países Bajos / Estados Unidos'),
    focus: t('мови програмування, читабельність коду, спільноти розробників', 'programming languages, code readability, developer communities', 'языки программирования, читаемость кода, сообщества разработчиков', 'lenguajes de programación, legibilidad del código y comunidades de desarrolladores'),
    knownFor: t('створення Python', 'creating Python', 'создание Python', 'crear Python'),
    life: t('Python став мовою для освіти, веброзробки, науки про дані, автоматизації й машинного навчання.', 'Python became a language for education, web development, data science, automation and machine learning.', 'Python стал языком для образования, веб-разработки, науки о данных, автоматизации и машинного обучения.', 'Python se convirtió en lenguaje para educación, web, ciencia de datos, automatización y aprendizaje automático.'),
    tags: ['software', 'language-design', 'education']
  },
  {
    slug: 'radia-perlman',
    image: commons('Radia_Perlman_2009.jpg'),
    name: t('Радія Перлман', 'Radia Perlman', 'Радия Перлман', 'Radia Perlman'),
    role: t('Мережева інженерка', 'Network engineer', 'Сетевой инженер', 'Ingeniera de redes'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('мережеві протоколи, стійкість інфраструктури, безпека', 'network protocols, resilient infrastructure, security', 'сетевые протоколы, устойчивость инфраструктуры, безопасность', 'protocolos de red, infraestructura resiliente y seguridad'),
    knownFor: t('алгоритм Spanning Tree Protocol', 'the Spanning Tree Protocol algorithm', 'алгоритм Spanning Tree Protocol', 'el algoritmo Spanning Tree Protocol'),
    life: t('Її робота допомогла Ethernet-мережам масштабуватися без руйнівних петель і стала базою сучасної мережевої інженерії.', 'Her work helped Ethernet networks scale without destructive loops and became a foundation of modern network engineering.', 'Ее работа помогла Ethernet-сетям масштабироваться без разрушительных петель и стала базой современной сетевой инженерии.', 'Su trabajo permitió escalar redes Ethernet sin bucles destructivos y se volvió base de la ingeniería de redes moderna.'),
    tags: ['engineering', 'internet', 'infrastructure']
  },
  {
    slug: 'fei-fei-li',
    image: commons('Fei-Fei_Li_at_AI_for_Good_2017.jpg'),
    name: t('Фей-Фей Лі', 'Fei-Fei Li', 'Фэй-Фэй Ли', 'Fei-Fei Li'),
    role: t('Дослідниця штучного інтелекту', 'AI researcher', 'Исследовательница ИИ', 'Investigadora de IA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('компʼютерний зір, відповідальний ШІ, освіта', 'computer vision, responsible AI, education', 'компьютерное зрение, ответственный ИИ, образование', 'visión por computador, IA responsable y educación'),
    knownFor: t('ImageNet та розвиток візуального розпізнавання', 'ImageNet and advances in visual recognition', 'ImageNet и развитие визуального распознавания', 'ImageNet y avances en reconocimiento visual'),
    life: t('Вона поєднує фундаментальні дослідження з публічною розмовою про людськоцентричний ШІ.', 'She combines foundational research with public work on human-centred AI.', 'Она сочетает фундаментальные исследования с публичной работой над человекоцентричным ИИ.', 'Combina investigación fundamental con trabajo público sobre IA centrada en las personas.'),
    tags: ['ai', 'research', 'education']
  },
  {
    slug: 'yann-lecun',
    image: commons('Yann_LeCun_-_2018_(cropped).jpg'),
    name: t('Ян Лекун', 'Yann LeCun', 'Ян Лекун', 'Yann LeCun'),
    role: t('Дослідник ШІ, лауреат премії Тюрінга', 'AI researcher, Turing Award laureate', 'Исследователь ИИ, лауреат премии Тьюринга', 'Investigador de IA, premio Turing'),
    country: t('Франція / США', 'France / United States', 'Франция / США', 'Francia / Estados Unidos'),
    focus: t('глибоке навчання, компʼютерний зір, самонавчальні системи', 'deep learning, computer vision, self-supervised systems', 'глубокое обучение, компьютерное зрение, самообучающиеся системы', 'aprendizaje profundo, visión por computador y sistemas autosupervisados'),
    knownFor: t('згорткові нейронні мережі та фундаментальний внесок у deep learning', 'convolutional neural networks and foundational deep-learning work', 'сверточные нейронные сети и фундаментальный вклад в deep learning', 'redes neuronales convolucionales y aportes clave al deep learning'),
    life: t('Його дослідження вплинули на розпізнавання зображень, документообіг, робототехніку та сучасні AI-платформи.', 'His research influenced image recognition, document processing, robotics and modern AI platforms.', 'Его исследования повлияли на распознавание изображений, обработку документов, робототехнику и современные AI-платформы.', 'Su investigación influyó en reconocimiento de imágenes, procesamiento documental, robótica y plataformas modernas de IA.'),
    tags: ['ai', 'research', 'science']
  },
  {
    slug: 'demis-hassabis',
    image: commons('Demis_Hassabis_Royal_Society.jpg'),
    name: t('Деміс Хассабіс', 'Demis Hassabis', 'Демис Хассабис', 'Demis Hassabis'),
    role: t('CEO Google DeepMind, дослідник ШІ', 'CEO of Google DeepMind, AI researcher', 'CEO Google DeepMind, исследователь ИИ', 'CEO de Google DeepMind, investigador de IA'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('штучний інтелект, нейронаука, наукові відкриття', 'artificial intelligence, neuroscience, scientific discovery', 'искусственный интеллект, нейронаука, научные открытия', 'inteligencia artificial, neurociencia y descubrimiento científico'),
    knownFor: t('DeepMind, AlphaGo та AlphaFold', 'DeepMind, AlphaGo and AlphaFold', 'DeepMind, AlphaGo и AlphaFold', 'DeepMind, AlphaGo y AlphaFold'),
    life: t('Він будує команди, які переводять прориви ШІ з лабораторії у складні задачі біології, ігор та науки.', 'He builds teams that move AI breakthroughs from the lab into difficult problems in biology, games and science.', 'Он строит команды, переводящие прорывы ИИ из лаборатории к сложным задачам биологии, игр и науки.', 'Construye equipos que llevan avances de IA del laboratorio a problemas complejos en biología, juegos y ciencia.'),
    tags: ['ai', 'ceo', 'research']
  },
  {
    slug: 'ilya-sutskever',
    image: commons('Ilya_Sutskever_2017.jpg'),
    name: t('Ілля Суцкевер', 'Ilya Sutskever', 'Илья Суцкевер', 'Ilya Sutskever'),
    role: t('Дослідник машинного навчання', 'Machine-learning researcher', 'Исследователь машинного обучения', 'Investigador de aprendizaje automático'),
    country: t('Канада / Ізраїль / США', 'Canada / Israel / United States', 'Канада / Израиль / США', 'Canadá / Israel / Estados Unidos'),
    focus: t('нейронні мережі, великі моделі, безпека ШІ', 'neural networks, large models, AI safety', 'нейронные сети, большие модели, безопасность ИИ', 'redes neuronales, grandes modelos y seguridad de IA'),
    knownFor: t('співзаснування OpenAI та внесок у глибоке навчання', 'co-founding OpenAI and contributing to deep learning', 'соосновательство OpenAI и вклад в глубокое обучение', 'cofundar OpenAI y aportar al aprendizaje profundo'),
    life: t('Його наукова робота стала частиною розвитку моделей, що змінили обробку мови, зору та генеративні системи.', 'His scientific work became part of the model advances that changed language processing, vision and generative systems.', 'Его научная работа стала частью развития моделей, изменивших обработку языка, зрения и генеративные системы.', 'Su trabajo científico formó parte de avances que cambiaron lenguaje, visión y sistemas generativos.'),
    tags: ['ai', 'research', 'startup']
  },
  {
    slug: 'sam-altman',
    image: commons('Sam_Altman_2024.jpg'),
    name: t('Сем Альтман', 'Sam Altman', 'Сэм Альтман', 'Sam Altman'),
    role: t('CEO OpenAI, інвестор', 'CEO of OpenAI, investor', 'CEO OpenAI, инвестор', 'CEO de OpenAI, inversor'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('штучний інтелект, стартапи, технологічна стратегія', 'artificial intelligence, startups, technology strategy', 'искусственный интеллект, стартапы, технологическая стратегия', 'inteligencia artificial, startups y estrategia tecnológica'),
    knownFor: t('керівництво OpenAI та попередню роботу в Y Combinator', 'leading OpenAI and earlier work at Y Combinator', 'руководство OpenAI и прежнюю работу в Y Combinator', 'liderar OpenAI y su trabajo previo en Y Combinator'),
    life: t('Його карʼєра поєднує інкубацію стартапів, інвестиції та управління продуктами, що швидко входять у масове використання.', 'His career combines startup incubation, investing and managing products that quickly enter mainstream use.', 'Его карьера объединяет инкубацию стартапов, инвестиции и управление продуктами, быстро входящими в массовое использование.', 'Su carrera combina incubación de startups, inversión y gestión de productos que entran rápido al uso masivo.'),
    tags: ['ai', 'ceo', 'startup']
  },
  {
    slug: 'elon-musk',
    image: commons('Elon_Musk_Royal_Society.jpg'),
    name: t('Ілон Маск', 'Elon Musk', 'Илон Маск', 'Elon Musk'),
    role: t('Підприємець та CEO', 'Entrepreneur and CEO', 'Предприниматель и CEO', 'Emprendedor y CEO'),
    country: t('ПАР / США', 'South Africa / United States', 'ЮАР / США', 'Sudáfrica / Estados Unidos'),
    focus: t('електромобілі, космос, енергетика, інфраструктура', 'electric vehicles, space, energy, infrastructure', 'электромобили, космос, энергетика, инфраструктура', 'vehículos eléctricos, espacio, energía e infraestructura'),
    knownFor: t('Tesla, SpaceX, Starlink та інші технологічні компанії', 'Tesla, SpaceX, Starlink and other technology companies', 'Tesla, SpaceX, Starlink и другие технологические компании', 'Tesla, SpaceX, Starlink y otras empresas tecnológicas'),
    life: t('Він просуває масштабні інженерні програми, де продукт, виробництво та програмне забезпечення розглядаються як єдина система.', 'He drives large engineering programs where product, manufacturing and software are treated as one system.', 'Он продвигает крупные инженерные программы, где продукт, производство и ПО рассматриваются как единая система.', 'Impulsa programas de ingeniería donde producto, fabricación y software se tratan como un solo sistema.'),
    tags: ['ceo', 'engineering', 'space']
  },
  {
    slug: 'jensen-huang',
    image: commons('Jensen_Huang_2023.jpg'),
    name: t('Дженсен Хуанг', 'Jensen Huang', 'Дженсен Хуанг', 'Jensen Huang'),
    role: t('CEO NVIDIA', 'CEO of NVIDIA', 'CEO NVIDIA', 'CEO de NVIDIA'),
    country: t('Тайвань / США', 'Taiwan / United States', 'Тайвань / США', 'Taiwán / Estados Unidos'),
    focus: t('графічні процесори, AI-обчислення, апаратна інфраструктура', 'GPUs, AI computing, hardware infrastructure', 'графические процессоры, AI-вычисления, аппаратная инфраструктура', 'GPU, cómputo de IA e infraestructura de hardware'),
    knownFor: t('перетворення NVIDIA на ключову платформу для ШІ', 'turning NVIDIA into a key platform for AI computing', 'превращение NVIDIA в ключевую платформу AI-вычислений', 'convertir NVIDIA en plataforma clave para el cómputo de IA'),
    life: t('Його управління поєднує довгострокову ставку на архітектуру чипів із екосистемою розробників.', 'His leadership combines a long-term bet on chip architecture with a developer ecosystem.', 'Его управление сочетает долгосрочную ставку на архитектуру чипов с экосистемой разработчиков.', 'Su liderazgo combina una apuesta de largo plazo por arquitectura de chips con un ecosistema de desarrolladores.'),
    tags: ['ceo', 'hardware', 'ai']
  },
  {
    slug: 'lisa-su',
    image: commons('Lisa_Su_2015.jpg'),
    name: t('Ліза Су', 'Lisa Su', 'Лиза Су', 'Lisa Su'),
    role: t('CEO AMD, інженерка-електронниця', 'CEO of AMD, electrical engineer', 'CEO AMD, инженер-электронщик', 'CEO de AMD, ingeniera eléctrica'),
    country: t('Тайвань / США', 'Taiwan / United States', 'Тайвань / США', 'Taiwán / Estados Unidos'),
    focus: t('напівпровідники, високопродуктивні обчислення, корпоративна стратегія', 'semiconductors, high-performance computing, corporate strategy', 'полупроводники, высокопроизводительные вычисления, корпоративная стратегия', 'semiconductores, computación de alto rendimiento y estrategia corporativa'),
    knownFor: t('поворот AMD до конкурентних процесорних платформ', 'leading AMD\'s turnaround into competitive processor platforms', 'разворот AMD к конкурентным процессорным платформам', 'liderar el giro de AMD hacia plataformas de procesadores competitivas'),
    life: t('Її інженерна дисципліна й фокус на дорожніх картах продуктів стали прикладом технічного CEO.', 'Her engineering discipline and focus on product roadmaps became a model for technical CEOs.', 'Ее инженерная дисциплина и фокус на продуктовых дорожных картах стали примером технического CEO.', 'Su disciplina de ingeniería y foco en hojas de ruta de producto son modelo de liderazgo técnico.'),
    tags: ['ceo', 'hardware', 'operations']
  },
  {
    slug: 'gwynne-shotwell',
    image: commons('Gwynne_Shotwell_at_2018_Commercial_Crew_announcement.jpg'),
    name: t('Ґвінн Шотвелл', 'Gwynne Shotwell', 'Гвинн Шотвелл', 'Gwynne Shotwell'),
    role: t('Президентка та COO SpaceX', 'President and COO of SpaceX', 'Президент и COO SpaceX', 'Presidenta y COO de SpaceX'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('операційне управління, космічні запуски, комерційні контракти', 'operations, space launches, commercial contracts', 'операционное управление, космические запуски, коммерческие контракты', 'operaciones, lanzamientos espaciales y contratos comerciales'),
    knownFor: t('масштабування комерційних запусків SpaceX', 'scaling SpaceX commercial launch operations', 'масштабирование коммерческих запусков SpaceX', 'escalar las operaciones comerciales de lanzamiento de SpaceX'),
    life: t('Вона є прикладом операційного керівника, який перетворює складну інженерію на повторюваний бізнес-процес.', 'She is an example of an operations leader turning complex engineering into a repeatable business process.', 'Она является примером операционного руководителя, превращающего сложную инженерию в повторяемый бизнес-процесс.', 'Es ejemplo de liderazgo operativo que convierte ingeniería compleja en proceso empresarial repetible.'),
    tags: ['coo', 'space', 'operations']
  },
  {
    slug: 'safra-catz',
    image: commons('Safra_Catz_-_World_Economic_Forum_Annual_Meeting_2012.jpg'),
    name: t('Сафра Кац', 'Safra Catz', 'Сафра Кац', 'Safra Catz'),
    role: t('CEO Oracle', 'CEO of Oracle', 'CEO Oracle', 'CEO de Oracle'),
    country: t('Ізраїль / США', 'Israel / United States', 'Израиль / США', 'Israel / Estados Unidos'),
    focus: t('корпоративне ПЗ, фінанси, M&A, операційна ефективність', 'enterprise software, finance, M&A, operational efficiency', 'корпоративное ПО, финансы, M&A, операционная эффективность', 'software empresarial, finanzas, fusiones y eficiencia operativa'),
    knownFor: t('керівництво Oracle у період великих корпоративних угод і хмарної трансформації', 'leading Oracle through major enterprise deals and cloud transformation', 'руководство Oracle в период крупных корпоративных сделок и облачной трансформации', 'liderar Oracle durante grandes acuerdos empresariales y transformación cloud'),
    life: t('Її профіль важливий для розуміння ролі фінансової дисципліни та операцій у великих технологічних компаніях.', 'Her profile is important for understanding the role of financial discipline and operations in large technology companies.', 'Ее профиль важен для понимания роли финансовой дисциплины и операций в крупных технологических компаниях.', 'Su perfil ayuda a entender el papel de disciplina financiera y operaciones en grandes tecnológicas.'),
    tags: ['ceo', 'operations', 'enterprise']
  },
  {
    slug: 'mary-barra',
    image: commons('Mary_Barra_2014.jpg'),
    name: t('Мері Барра', 'Mary Barra', 'Мэри Барра', 'Mary Barra'),
    role: t('CEO General Motors', 'CEO of General Motors', 'CEO General Motors', 'CEO de General Motors'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('автомобільна інженерія, електрифікація, виробничі системи', 'automotive engineering, electrification, manufacturing systems', 'автомобильная инженерия, электрификация, производственные системы', 'ingeniería automotriz, electrificación y sistemas de fabricación'),
    knownFor: t('трансформацію GM у напрямі електромобілів і програмно-керованих авто', 'transforming GM toward electric and software-defined vehicles', 'трансформацию GM в сторону электромобилей и программно-управляемых авто', 'transformar GM hacia vehículos eléctricos y definidos por software'),
    life: t('Її карʼєра від інженерних ролей до CEO демонструє, як операційні знання впливають на стратегічні рішення.', 'Her path from engineering roles to CEO shows how operational knowledge shapes strategic decisions.', 'Ее путь от инженерных ролей до CEO показывает, как операционные знания влияют на стратегию.', 'Su paso de ingeniería a CEO muestra cómo el conocimiento operativo moldea decisiones estratégicas.'),
    tags: ['ceo', 'engineering', 'operations']
  },
  {
    slug: 'satya-nadella',
    image: commons('Satya_Nadella_2023.jpg'),
    name: t('Сатья Наделла', 'Satya Nadella', 'Сатья Наделла', 'Satya Nadella'),
    role: t('CEO Microsoft', 'CEO of Microsoft', 'CEO Microsoft', 'CEO de Microsoft'),
    country: t('Індія / США', 'India / United States', 'Индия / США', 'India / Estados Unidos'),
    focus: t('хмарні сервіси, корпоративне ПЗ, AI-стратегія', 'cloud services, enterprise software, AI strategy', 'облачные сервисы, корпоративное ПО, AI-стратегия', 'servicios cloud, software empresarial y estrategia de IA'),
    knownFor: t('переорієнтацію Microsoft на cloud, open source та AI', 'reorienting Microsoft around cloud, open source and AI', 'переориентацию Microsoft на cloud, open source и AI', 'reorientar Microsoft hacia cloud, código abierto e IA'),
    life: t('Його управління часто розглядають як приклад культурної трансформації великої технологічної організації.', 'His leadership is often studied as an example of cultural transformation in a large technology organisation.', 'Его управление часто изучают как пример культурной трансформации крупной технологической организации.', 'Su liderazgo se estudia como ejemplo de transformación cultural en una gran tecnológica.'),
    tags: ['ceo', 'cloud', 'ai']
  },
  {
    slug: 'katalin-kariko',
    image: commons('Katalin_Kariko_2021_(cropped).jpg'),
    name: t('Каталін Каріко', 'Katalin Kariko', 'Каталин Карико', 'Katalin Kariko'),
    role: t('Біохімікиня, лауреатка Нобелівської премії', 'Biochemist, Nobel laureate', 'Биохимик, лауреат Нобелевской премии', 'Bioquímica, premio Nobel'),
    country: t('Угорщина / США', 'Hungary / United States', 'Венгрия / США', 'Hungría / Estados Unidos'),
    focus: t('мРНК, біотехнології, трансляційна медицина', 'mRNA, biotechnology, translational medicine', 'мРНК, биотехнологии, трансляционная медицина', 'ARNm, biotecnología y medicina traslacional'),
    knownFor: t('фундаментальний внесок у мРНК-вакцини', 'foundational work behind mRNA vaccines', 'фундаментальный вклад в мРНК-вакцины', 'trabajo fundamental detrás de las vacunas de ARNm'),
    life: t('Її наполегливі дослідження показують, як довга наукова лінія може змінити глобальну охорону здоровʼя.', 'Her persistent research shows how a long scientific path can change global public health.', 'Ее настойчивые исследования показывают, как длинная научная линия может изменить глобальное здравоохранение.', 'Su investigación persistente muestra cómo una larga línea científica puede cambiar la salud pública global.'),
    tags: ['science', 'biotech', 'research']
  },
  {
    slug: 'donna-strickland',
    image: commons('Donna_Strickland_EM1B5767_(46122789402)_(cropped).jpg'),
    name: t('Донна Стрікленд', 'Donna Strickland', 'Донна Стрикленд', 'Donna Strickland'),
    role: t('Фізикиня, лауреатка Нобелівської премії', 'Physicist, Nobel laureate', 'Физик, лауреат Нобелевской премии', 'Física, premio Nobel'),
    country: t('Канада', 'Canada', 'Канада', 'Canadá'),
    focus: t('лазерна фізика, надкороткі імпульси, фотоніка', 'laser physics, ultrashort pulses, photonics', 'лазерная физика, ультракороткие импульсы, фотоника', 'física láser, pulsos ultracortos y fotónica'),
    knownFor: t('метод chirped pulse amplification', 'chirped pulse amplification', 'метод усиления чирпированных импульсов', 'la amplificación de pulsos chirped'),
    life: t('Її робота стала основою для потужних лазерів, що використовуються в медицині, промисловості та фундаментальній науці.', 'Her work underpins powerful lasers used in medicine, industry and fundamental science.', 'Ее работа стала основой мощных лазеров для медицины, промышленности и фундаментальной науки.', 'Su trabajo sostiene láseres potentes usados en medicina, industria y ciencia fundamental.'),
    tags: ['science', 'physics', 'research']
  },
  {
    slug: 'patrick-collison',
    image: commons('Patrick_Collison_Web_Summit_2018.jpg'),
    name: t('Патрік Коллісон', 'Patrick Collison', 'Патрик Коллисон', 'Patrick Collison'),
    role: t('Співзасновник та CEO Stripe', 'Co-founder and CEO of Stripe', 'Сооснователь и CEO Stripe', 'Cofundador y CEO de Stripe'),
    country: t('Ірландія / США', 'Ireland / United States', 'Ирландия / США', 'Irlanda / Estados Unidos'),
    focus: t('фінтех, платіжна інфраструктура, стартап-екосистеми', 'fintech, payments infrastructure, startup ecosystems', 'финтех, платежная инфраструктура, стартап-экосистемы', 'fintech, infraestructura de pagos y ecosistemas startup'),
    knownFor: t('створення Stripe як платформи для інтернет-платежів', 'building Stripe as an internet payments platform', 'создание Stripe как платформы интернет-платежей', 'construir Stripe como plataforma de pagos en internet'),
    life: t('Його робота цікава операційним командам, бо Stripe поєднує API-дизайн, комплаєнс і глобальну фінансову інфраструктуру.', 'His work matters to operations teams because Stripe combines API design, compliance and global financial infrastructure.', 'Его работа важна операционным командам: Stripe объединяет API-дизайн, комплаенс и глобальную финансовую инфраструктуру.', 'Su trabajo importa a equipos operativos porque Stripe combina diseño de API, cumplimiento e infraestructura financiera global.'),
    tags: ['ceo', 'fintech', 'startup']
  },
  {
    slug: 'melanie-perkins',
    image: commons('Melanie_Perkins_at_TechCrunch_Disrupt_SF_2019.jpg'),
    name: t('Мелані Перкінс', 'Melanie Perkins', 'Мелани Перкинс', 'Melanie Perkins'),
    role: t('Співзасновниця та CEO Canva', 'Co-founder and CEO of Canva', 'Соосновательница и CEO Canva', 'Cofundadora y CEO de Canva'),
    country: t('Австралія', 'Australia', 'Австралия', 'Australia'),
    focus: t('дизайн-платформи, продуктова стратегія, глобальне масштабування', 'design platforms, product strategy, global scaling', 'дизайн-платформы, продуктовая стратегия, глобальное масштабирование', 'plataformas de diseño, estrategia de producto y escala global'),
    knownFor: t('перетворення Canva на масову платформу дизайну', 'turning Canva into a mainstream design platform', 'превращение Canva в массовую платформу дизайна', 'convertir Canva en una plataforma masiva de diseño'),
    life: t('Її шлях показує, як простий користувацький досвід може відкрити професійні інструменти для мільйонів людей.', 'Her path shows how simple user experience can open professional tools to millions of people.', 'Ее путь показывает, как простой пользовательский опыт открывает профессиональные инструменты миллионам людей.', 'Su trayectoria muestra cómo una experiencia simple abre herramientas profesionales a millones de personas.'),
    tags: ['ceo', 'design', 'startup']
  },
  {
    slug: 'charity-majors',
    image: commons('Charity_Majors_2019.jpg'),
    name: t('Черіті Мейджорс', 'Charity Majors', 'Чэрити Мейджорс', 'Charity Majors'),
    role: t('Співзасновниця Honeycomb, інженерка інфраструктури', 'Co-founder of Honeycomb, infrastructure engineer', 'Соосновательница Honeycomb, инженер инфраструктуры', 'Cofundadora de Honeycomb, ingeniera de infraestructura'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('observability, SRE, операційна надійність', 'observability, SRE, operational reliability', 'observability, SRE, операционная надежность', 'observability, SRE y fiabilidad operativa'),
    knownFor: t('практичну популяризацію сучасної спостережуваності систем', 'practical advocacy for modern observability', 'практическую популяризацию современной наблюдаемости систем', 'defensa práctica de la observabilidad moderna'),
    life: t('Її досвід корисний для команд, які будують складні сервіси й хочуть швидко розуміти поведінку production-систем.', 'Her experience is useful for teams building complex services and needing fast insight into production behaviour.', 'Ее опыт полезен командам, строящим сложные сервисы и стремящимся быстро понимать поведение production-систем.', 'Su experiencia ayuda a equipos que construyen servicios complejos y necesitan entender rápido sistemas en producción.'),
    tags: ['engineering', 'startup', 'operations']
  },
  {
    slug: 'claire-hughes-johnson',
    image: commons('Claire_Hughes_Johnson_2017.jpg'),
    name: t('Клер Гʼюз Джонсон', 'Claire Hughes Johnson', 'Клэр Хьюз Джонсон', 'Claire Hughes Johnson'),
    role: t('Операційна директорка та радниця', 'Operations executive and advisor', 'Операционный директор и советник', 'Ejecutiva de operaciones y asesora'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('операційні системи компаній, масштабування команд, менеджмент', 'company operating systems, team scaling, management', 'операционные системы компаний, масштабирование команд, менеджмент', 'sistemas operativos de empresa, escala de equipos y gestión'),
    knownFor: t('масштабування операцій Stripe та роботу з керівними командами', 'scaling Stripe operations and advising leadership teams', 'масштабирование операций Stripe и работу с руководящими командами', 'escalar operaciones en Stripe y asesorar equipos directivos'),
    life: t('Її профіль додає до бази менш публічний, але дуже важливий тип спеціаліста: операційного архітектора зростання.', 'Her profile adds a less public but essential specialist type: the operating architect of growth.', 'Ее профиль добавляет менее публичный, но важный тип специалиста: операционного архитектора роста.', 'Su perfil añade un tipo menos visible pero esencial: la arquitecta operativa del crecimiento.'),
    tags: ['coo', 'operations', 'startup']
  },
  {
    slug: 'sergey-korolev',
    image: commons('Sergei_Korolev.jpg'),
    name: t('Сергій Корольов', 'Sergey Korolev', 'Сергей Королёв', 'Serguéi Koroliov'),
    role: t('Головний конструктор ракетно-космічних систем', 'Chief designer of rocket and space systems', 'Главный конструктор ракетно-космических систем', 'Diseñador jefe de sistemas espaciales y cohetes'),
    country: t('Україна / СРСР', 'Ukraine / Soviet Union', 'Украина / СССР', 'Ucrania / Unión Soviética'),
    focus: t('ракетобудування, системна інженерія, космічні програми', 'rocketry, systems engineering, space programmes', 'ракетостроение, системная инженерия, космические программы', 'cohetería, ingeniería de sistemas y programas espaciales'),
    knownFor: t('організацію запуску першого супутника і перших пілотованих польотів', 'organising the first satellite launch and early crewed flights', 'организацию запуска первого спутника и первых пилотируемых полетов', 'organizar el primer satélite y los primeros vuelos tripulados'),
    life: t('Він уособлює роль системного інженера, який обʼєднує науку, виробництво, ризик і командну координацію.', 'He represents the systems engineer who combines science, manufacturing, risk and team coordination.', 'Он олицетворяет системного инженера, объединяющего науку, производство, риск и командную координацию.', 'Representa al ingeniero de sistemas que une ciencia, fabricación, riesgo y coordinación de equipos.'),
    tags: ['space', 'engineering', 'leadership']
  },
  {
    slug: 'mira-murati',
    image: commons('Mira_Murati_2024.jpg'),
    name: t('Міра Мураті', 'Mira Murati', 'Мира Мураті', 'Mira Murati'),
    role: t('Технологічна керівниця у сфері ШІ', 'AI technology executive', 'Технологический руководитель в сфере ИИ', 'Ejecutiva tecnológica de IA'),
    country: t('Албанія / США', 'Albania / United States', 'Албания / США', 'Albania / Estados Unidos'),
    focus: t('генеративний ШІ, продуктові рішення, research-to-product execution', 'generative AI, product delivery, research-to-product execution', 'генеративный ИИ, продуктовые решения, research-to-product execution', 'IA generativa, entrega de producto y ejecución research-to-product'),
    knownFor: t('керівництво продуктовим розвитком ChatGPT та мультимодальних AI-систем', 'leading product development around ChatGPT and multimodal AI systems', 'руководство продуктовым развитием ChatGPT и мультимодальных AI-систем', 'liderar el desarrollo de producto alrededor de ChatGPT y sistemas multimodales de IA'),
    life: t('Її профіль важливий для сучасного ринку після 2020 року, бо він показує, як AI-дослідження переходять у масові продукти та інструменти для бізнесу й розробників.', 'Her profile matters for the post-2020 market because it shows how AI research becomes mainstream products and tools for businesses and developers.', 'Ее профиль важен для рынка после 2020 года, потому что показывает, как AI-исследования превращаются в массовые продукты и инструменты для бизнеса и разработчиков.', 'Su perfil es clave para el mercado posterior a 2020 porque muestra cómo la investigación en IA se convierte en productos masivos y herramientas para empresas y desarrolladores.'),
    tags: ['ai', 'operations', 'leadership']
  },
  {
    slug: 'dario-amodei',
    image: commons('Dario_Amodei_2023.jpg'),
    name: t('Даріо Амодеї', 'Dario Amodei', 'Дарио Амодеи', 'Dario Amodei'),
    role: t('CEO Anthropic, дослідник ШІ', 'CEO of Anthropic, AI researcher', 'CEO Anthropic, исследователь ИИ', 'CEO de Anthropic, investigador de IA'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('AI safety, великі моделі, наукова стратегія', 'AI safety, large models, research strategy', 'AI safety, большие модели, научная стратегия', 'seguridad de IA, grandes modelos y estrategia de investigación'),
    knownFor: t('розвиток Anthropic і фокус на безпечних та керованих AI-моделях', 'building Anthropic and focusing on safe, controllable AI models', 'развитие Anthropic и фокус на безопасных и управляемых AI-моделях', 'desarrollar Anthropic y enfocarse en modelos de IA seguros y controlables'),
    life: t('Після 2020 року його імʼя стало одним із ключових у дискусії про безпеку, масштабування та відповідальне впровадження генеративного ШІ.', 'After 2020 his name became central to the discussion around safety, scaling and responsible deployment of generative AI.', 'После 2020 года его имя стало одним из ключевых в разговоре о безопасности, масштабировании и ответственном внедрении генеративного ИИ.', 'Después de 2020 su nombre se volvió central en la discusión sobre seguridad, escalamiento y despliegue responsable de la IA generativa.'),
    tags: ['ai', 'ceo', 'research']
  },
  {
    slug: 'arthur-mensch',
    image: commons('Arthur_Mensch_2024.jpg'),
    name: t('Артур Менш', 'Arthur Mensch', 'Артур Менш', 'Arthur Mensch'),
    role: t('CEO Mistral AI, інженер машинного навчання', 'CEO of Mistral AI, machine-learning engineer', 'CEO Mistral AI, инженер машинного обучения', 'CEO de Mistral AI, ingeniero de aprendizaje automático'),
    country: t('Франція', 'France', 'Франция', 'Francia'),
    focus: t('європейські AI-моделі, open models, інженерія inference', 'European AI models, open models, inference engineering', 'европейские AI-модели, open models, инженерия inference', 'modelos europeos de IA, open models e ingeniería de inference'),
    knownFor: t('побудову Mistral AI як одного з найпомітніших європейських AI-стартапів після 2023 року', 'building Mistral AI into one of the most visible European AI startups after 2023', 'создание Mistral AI как одного из самых заметных европейских AI-стартапов после 2023 года', 'construir Mistral AI como una de las startups europeas de IA más visibles desde 2023'),
    life: t('Його профіль додає до бази нову хвилю технічних засновників, які швидко формують європейський ринок генеративного ШІ.', 'His profile adds a new wave of technical founders who are rapidly shaping the European generative-AI market.', 'Его профиль добавляет новую волну технических основателей, быстро формирующих европейский рынок генеративного ИИ.', 'Su perfil añade una nueva ola de fundadores técnicos que están moldeando con rapidez el mercado europeo de IA generativa.'),
    tags: ['ai', 'ceo', 'startup']
  },
  {
    slug: 'mustafa-suleyman',
    image: commons('Mustafa_Suleyman_2024.jpg'),
    name: t('Мустафа Сулейман', 'Mustafa Suleyman', 'Мустафа Сулейман', 'Mustafa Suleyman'),
    role: t('CEO Microsoft AI, підприємець у сфері ШІ', 'CEO of Microsoft AI, AI entrepreneur', 'CEO Microsoft AI, предприниматель в сфере ИИ', 'CEO de Microsoft AI, emprendedor de IA'),
    country: t('Велика Британія', 'United Kingdom', 'Великобритания', 'Reino Unido'),
    focus: t('AI products, consumer systems, стратегія впровадження', 'AI products, consumer systems, deployment strategy', 'AI products, consumer systems, стратегия внедрения', 'productos de IA, sistemas de consumo y estrategia de despliegue'),
    knownFor: t('DeepMind, Inflection AI та управління новими AI-напрямами у Microsoft', 'DeepMind, Inflection AI and leading new AI directions at Microsoft', 'DeepMind, Inflection AI и руководство новыми AI-направлениями в Microsoft', 'DeepMind, Inflection AI y el liderazgo de nuevas direcciones de IA en Microsoft'),
    life: t('Після 2020 року його роль показує, як AI-підприємці переходять від досліджень до широкого продуктового розгортання у великих технологічних компаніях.', 'After 2020 his role shows how AI entrepreneurs move from research into broad product deployment inside major technology companies.', 'После 2020 года его роль показывает, как AI-предприниматели переходят от исследований к широкому продуктовому внедрению внутри крупных технологических компаний.', 'Después de 2020 su papel muestra cómo los emprendedores de IA pasan de la investigación al despliegue amplio de producto dentro de grandes tecnológicas.'),
    tags: ['ai', 'ceo', 'operations']
  },
  {
    slug: 'sridhar-ramaswamy',
    image: commons('Sridhar_Ramaswamy_2024.jpg'),
    name: t('Шрідхар Рамасвамі', 'Sridhar Ramaswamy', 'Шридхар Рамасвами', 'Sridhar Ramaswamy'),
    role: t('CEO Snowflake, керівник data/AI-платформ', 'CEO of Snowflake, data and AI platform executive', 'CEO Snowflake, руководитель data/AI-платформ', 'CEO de Snowflake, ejecutivo de plataformas de datos e IA'),
    country: t('Індія / США', 'India / United States', 'Индия / США', 'India / Estados Unidos'),
    focus: t('data cloud, AI infrastructure, корпоративні платформи даних', 'data cloud, AI infrastructure, enterprise data platforms', 'data cloud, AI infrastructure, корпоративные платформы данных', 'data cloud, infraestructura de IA y plataformas empresariales de datos'),
    knownFor: t('керівництво Snowflake у фазі активної інтеграції AI у корпоративні data-платформи', 'leading Snowflake through an active phase of AI integration into enterprise data platforms', 'руководство Snowflake в фазе активной интеграции ИИ в корпоративные data-платформы', 'liderar Snowflake en una etapa de integración activa de IA en plataformas empresariales de datos'),
    life: t('Його профіль додає до бази сегмент сучасних керівників, які після 2020 року будують фундамент для data та AI-інфраструктури в enterprise-середовищі.', 'His profile adds the segment of modern leaders who after 2020 are building the data and AI infrastructure foundation for enterprise environments.', 'Его профиль добавляет сегмент современных руководителей, которые после 2020 года строят фундамент data- и AI-инфраструктуры для enterprise-среды.', 'Su perfil añade el segmento de líderes modernos que, después de 2020, construyen la base de infraestructura de datos e IA para entornos enterprise.'),
    tags: ['ceo', 'cloud', 'ai']
  },
  {
    slug: 'thomas-dohmke',
    image: commons('Thomas_Dohmke_2023.jpg'),
    name: t('Томас Домке', 'Thomas Dohmke', 'Томас Домке', 'Thomas Dohmke'),
    role: t('CEO GitHub, лідер developer platform', 'CEO of GitHub, developer platform leader', 'CEO GitHub, лидер developer platform', 'CEO de GitHub, líder de plataforma para desarrolladores'),
    country: t('Німеччина / США', 'Germany / United States', 'Германия / США', 'Alemania / Estados Unidos'),
    focus: t('developer tools, Copilot, collaborative software platforms', 'developer tools, Copilot, collaborative software platforms', 'developer tools, Copilot, collaborative software platforms', 'herramientas para desarrolladores, Copilot y plataformas colaborativas de software'),
    knownFor: t('розвиток GitHub у добу Copilot і AI-assisted software development', 'leading GitHub in the Copilot era of AI-assisted software development', 'развитие GitHub в эпоху Copilot и AI-assisted software development', 'liderar GitHub en la era de Copilot y del desarrollo asistido por IA'),
    life: t('Після 2020 року його роль стала показовою для нового покоління платформ, де AI безпосередньо змінює щоденну роботу програмістів.', 'After 2020 his role became a strong example of the new platform generation where AI directly changes the daily work of software engineers.', 'После 2020 года его роль стала показательной для нового поколения платформ, где ИИ напрямую меняет ежедневную работу программистов.', 'Después de 2020 su papel se volvió un ejemplo claro de la nueva generación de plataformas donde la IA cambia directamente el trabajo diario de los programadores.'),
    tags: ['software', 'ceo', 'ai']
  },
  {
    slug: 'jay-graber',
    image: commons('Jay_Graber_2024.jpg'),
    name: t('Джей Грейбер', 'Jay Graber', 'Джей Грейбер', 'Jay Graber'),
    role: t('CEO Bluesky, product та protocol leader', 'CEO of Bluesky, product and protocol leader', 'CEO Bluesky, product и protocol leader', 'CEO de Bluesky, líder de producto y protocolo'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('децентралізовані соціальні мережі, протоколи, продуктова стратегія', 'decentralised social platforms, protocols, product strategy', 'децентрализованные социальные платформы, протоколы, продуктовая стратегия', 'plataformas sociales descentralizadas, protocolos y estrategia de producto'),
    knownFor: t('розвиток Bluesky як нової соціальної платформи на базі відкритого протоколу після 2020 року', 'building Bluesky as a new social platform on an open protocol after 2020', 'развитие Bluesky как новой социальной платформы на базе открытого протокола после 2020 года', 'desarrollar Bluesky como una nueva plataforma social basada en un protocolo abierto después de 2020'),
    life: t('Її профіль показує сучасний зріз product leadership у мережевих продуктах, де важливі і архітектура платформи, і довіра користувачів.', 'Her profile shows a modern slice of product leadership in networked products where platform architecture and user trust matter equally.', 'Ее профиль показывает современный срез product leadership в сетевых продуктах, где одинаково важны архитектура платформы и доверие пользователей.', 'Su perfil muestra una visión moderna del liderazgo de producto en servicios de red, donde importan tanto la arquitectura de plataforma como la confianza de los usuarios.'),
    tags: ['software', 'ceo', 'design']
  },
  {
    slug: 'lina-khan',
    image: commons('Lina_Khan_2022.jpg'),
    name: t('Ліна Хан', 'Lina Khan', 'Лина Хан', 'Lina Khan'),
    role: t('Голова FTC, регуляторка цифрових платформ', 'FTC chair, digital-platform regulator', 'Глава FTC, регулятор цифровых платформ', 'Presidenta de la FTC y reguladora de plataformas digitales'),
    country: t('США', 'United States', 'США', 'Estados Unidos'),
    focus: t('регулювання Big Tech, конкуренція, цифрові ринки', 'Big Tech regulation, competition, digital markets', 'регулирование Big Tech, конкуренция, цифровые рынки', 'regulación de Big Tech, competencia y mercados digitales'),
    knownFor: t('помітну роль у регуляторній дискусії навколо великих технологічних платформ після 2020 року', 'a visible role in the post-2020 regulatory debate around major technology platforms', 'заметную роль в регуляторной дискуссии вокруг крупных технологических платформ после 2020 года', 'un papel visible en el debate regulatorio posterior a 2020 sobre las grandes plataformas tecnológicas'),
    life: t('Її профіль додає до бази не лише засновників і CEO, а й тих, хто формує правила гри для цифрової економіки нового циклу.', 'Her profile adds not only founders and CEOs but also the people shaping the rules of the new-cycle digital economy.', 'Ее профиль добавляет в базу не только основателей и CEO, но и тех, кто формирует правила игры для цифровой экономики нового цикла.', 'Su perfil añade a la base no solo fundadores y CEOs, sino también a quienes están definiendo las reglas de la nueva economía digital.'),
    tags: ['operations', 'leadership', 'technology']
  }
];


const avatar = name => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=720&background=eef4ff&color=2563eb&bold=true`;

const bohdanProfile = {
  slug: 'bohdan-tiutenko',
  image: 'assets/images/bohdan-tiutenko-profile.svg',
  featured: true,
  name: t('Богдан Тютенко', 'Bohdan Tiutenko', 'Богдан Тютенко', 'Bohdan Tiutenko'),
  role: t('Директор операцій та менеджер логістики Foodtech', 'Operations Director and Foodtech Logistics Manager', 'Директор по операциям и менеджер логистики Foodtech', 'Director de Operaciones y Gerente de Logística Foodtech'),
  country: t('Україна / Перу', 'Ukraine / Peru', 'Украина / Перу', 'Ucrania / Perú'),
  focus: t('Foodtech, last-mile logistics, P&L, флот +150 курʼєрів, Power BI, SQL, Excel, Kommo CRM', 'Foodtech, last-mile logistics, P&L, 150+ courier fleets, Power BI, SQL, Excel and Kommo CRM', 'Foodtech, last-mile logistics, P&L, флот +150 курьеров, Power BI, SQL, Excel, Kommo CRM', 'Foodtech, logística de última milla, P&L, flotas de +150 repartidores, Power BI, SQL, Excel y Kommo CRM'),
  knownFor: t('масштабування last-mile операцій, контроль P&L і data-driven оптимізацію витрат до 20%', 'scaling last-mile operations, P&L ownership and data-driven cost optimisation up to 20%', 'масштабирование last-mile операций, контроль P&L и data-driven оптимизацию затрат до 20%', 'escalar operaciones de última milla, ownership de P&L y optimización de costos basada en datos hasta un 20%'),
  life: t(
    'Богдан Тютенко — операційний керівник у Foodtech і last-mile логістиці з понад 5 роками досвіду в Україні та Перу. Його управлінський стиль сформувався на перетині технічного мислення, спорту і кризового досвіду: до професійної карʼєри він навчався на програмуванні, займався бойовими мистецтвами та пройшов конкурсний відбір до розвідувального підрозділу, де з кількох сотень кандидатів відібрали лише частину. Цей етап дав йому практику дисципліни, швидкого аналізу ситуації, самоконтролю і командної взаємодії в умовах невизначеності. У Rocket він керував City Operations під час активного масштабування платформи доставки, розвивав флот понад 150 курʼєрів, відповідав за P&L, впроваджував SOPs і dashboards у Power BI та Excel, підтримуючи середній час доставки нижче 35 хвилин. У Lima він працював із dark kitchens, FIFO/PEPS, виробництвом і dispatch-процесами, зменшуючи операційні втрати на 18% і підвищуючи пропускну здатність замовлень на 25%. У Yango він покращив видимість даних на 40%, сприяв зростанню SLA на 12% і підтримував безперервність сервісу 99.9%. Для директорських ролей його сильна сторона — поєднання P&L ownership, data analytics, кризового менеджменту, побудови команд і практичної логістики. Освіта: технік з обслуговування систем і компʼютерних мереж; інженерні студії в Донецьку були перервані через війну. Мови: українська та російська — рідні, іспанська — C1, англійська — B2.',
    'Bohdan Tiutenko is an operations leader in Foodtech and last-mile logistics with 5+ years of experience across Ukraine and Peru. His management style was shaped by technical thinking, sport and crisis-tested responsibility: before his business career, he studied programming, trained in martial arts and passed a competitive selection process for a Ukrainian intelligence unit, where only a limited group was selected from several hundred candidates. That background gave him practical discipline, fast situational analysis, self-control and team coordination under uncertainty. At Rocket, he managed City Operations during aggressive delivery-platform scaling, grew a fleet of 150+ couriers, owned P&L, introduced SOPs and Power BI / Excel dashboards, and kept average delivery time under 35 minutes. In Lima, he worked with dark kitchens, FIFO/PEPS inventory control, production and dispatch workflows, reducing operational waste by 18% and increasing order-processing capacity by 25%. At Yango, he improved data visibility by 40%, contributed to a 12% SLA improvement and maintained 99.9% service continuity. For senior roles, his value is the combination of P&L ownership, data analytics, crisis management, team building and hands-on logistics execution. Education: computer systems and network maintenance technician; engineering studies in Donetsk were interrupted by the war. Languages: Ukrainian and Russian native, Spanish C1, English B2.',
    'Богдан Тютенко — операционный руководитель в Foodtech и last-mile логистике с опытом более 5 лет в Украине и Перу. Его управленческий стиль сформировался на пересечении технического мышления, спорта и опыта ответственности в кризисных условиях: до бизнес-карьеры он учился на программировании, занимался боевыми искусствами и прошел конкурсный отбор в разведывательное подразделение, где из нескольких сотен кандидатов выбрали ограниченную группу. Этот этап дал ему практику дисциплины, быстрого анализа ситуации, самоконтроля и командной координации в условиях неопределенности. В Rocket он управлял City Operations в период активного масштабирования платформы доставки, развивал флот более 150 курьеров, отвечал за P&L, внедрял SOPs и dashboards в Power BI и Excel, удерживая среднее время доставки ниже 35 минут. В Лиме он работал с dark kitchens, FIFO/PEPS, производством и dispatch-процессами, снижая операционные потери на 18% и повышая пропускную способность заказов на 25%. В Yango он улучшил видимость данных на 40%, способствовал росту SLA на 12% и поддерживал непрерывность сервиса 99.9%. Для директорских ролей его ценность — сочетание P&L ownership, data analytics, кризисного менеджмента, построения команд и практической логистики. Образование: техник по обслуживанию систем и компьютерных сетей; инженерное обучение в Донецке было прервано войной. Языки: украинский и русский — родные, испанский — C1, английский — B2.',
    'Bohdan Tiutenko es un líder de operaciones en Foodtech y logística de última milla con más de 5 años de experiencia entre Ucrania y Perú. Su estilo de gestión se formó entre pensamiento técnico, deporte y responsabilidad probada en crisis: antes de su carrera empresarial estudió programación, practicó artes marciales y superó un proceso competitivo de selección para una unidad de inteligencia ucraniana, donde solo un grupo limitado fue elegido entre varios cientos de candidatos. Esa etapa le aportó disciplina práctica, análisis rápido de situaciones, autocontrol y coordinación de equipos bajo incertidumbre. En Rocket gestionó City Operations durante una etapa de expansión agresiva de la plataforma de delivery, escaló una flota de +150 repartidores, asumió P&L, implementó SOPs y dashboards en Power BI / Excel, manteniendo el tiempo promedio de entrega por debajo de 35 minutos. En Lima trabajó con dark kitchens, control PEPS/FIFO, producción y despacho, reduciendo mermas operativas en 18% y aumentando la capacidad de procesamiento de órdenes en 25%. En Yango mejoró la visibilidad de datos en 40%, contribuyó a una mejora de SLA del 12% y mantuvo continuidad de servicio al 99.9%. Para roles directivos, su valor combina ownership de P&L, data analytics, gestión de crisis, construcción de equipos y ejecución logística práctica. Educación: técnico en mantenimiento de sistemas y redes informáticas; estudios de ingeniería en Donetsk interrumpidos por la guerra. Idiomas: ucraniano y ruso nativos, español C1, inglés B2.'
  ),
  tags: ['operations', 'leadership', 'logistics', 'analytics', 'foodtech', 'resilience', 'ukraine'],
  gallery: [
    {
      image: 'assets/images/bohdan-tiutenko-profile.svg',
      title: t('Професійний портрет', 'Professional portrait', 'Профессиональный портрет', 'Retrato profesional'),
      caption: t('Фото для рекрутингового профілю та професійної презентації.', 'Image for a recruiting profile and professional presentation.', 'Изображение для рекрутингового профиля и профессиональной презентации.', 'Imagen para perfil de reclutamiento y presentación profesional.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-operations.svg',
      title: t('Операційний досвід', 'Operations experience', 'Операционный опыт', 'Experiencia operativa'),
      caption: t('Фокус на дисципліні, координації задач і стабільній роботі команди.', 'Focus on discipline, task coordination and stable team execution.', 'Фокус на дисциплине, координации задач и стабильной работе команды.', 'Enfoque en disciplina, coordinación de tareas y ejecución estable del equipo.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-team.svg',
      title: t('Командна взаємодія', 'Team collaboration', 'Командное взаимодействие', 'Colaboración de equipo'),
      caption: t('Підхід до роботи з людьми: чіткість, спокій і відповідальність.', 'Approach to people: clarity, calmness and responsibility.', 'Подход к работе с людьми: ясность, спокойствие и ответственность.', 'Trabajo con personas: claridad, calma y responsabilidad.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-desert-motorcycle.svg',
      title: t('Мотоподорож у пустелі', 'Desert motorcycle ride', 'Мотопоездка в пустыне', 'Ruta en moto por el desierto'),
      caption: t('Особистий кадр про витримку, контроль і спокій у складних умовах.', 'A personal image about endurance, control and calmness in demanding conditions.', 'Личный кадр о выдержке, контроле и спокойствии в сложных условиях.', 'Imagen personal sobre resistencia, control y calma en condiciones exigentes.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-ocean-surf.svg',
      title: t('Пауза біля океану', 'Ocean pause', 'Пауза у океана', 'Pausa junto al océano'),
      caption: t('Кадр про відновлення, внутрішній баланс і здатність тримати фокус поза робочим шумом.', 'A personal image about recovery, inner balance and the ability to keep focus away from work noise.', 'Кадр о восстановлении, внутреннем балансе и способности сохранять фокус вне рабочего шума.', 'Imagen sobre recuperación, equilibrio interior y capacidad de mantener el foco lejos del ruido laboral.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-art-space.svg',
      title: t('Портрет у мистецькому просторі', 'Portrait in an art space', 'Портрет в художественном пространстве', 'Retrato en un espacio artístico'),
      caption: t('Спокійний професійний образ у середовищі, де поєднуються культура, уважність і характер.', 'A calm professional portrait in a setting that connects culture, attention and character.', 'Спокойный профессиональный образ в среде, где соединяются культура, внимательность и характер.', 'Retrato profesional sereno en un entorno que une cultura, atención y carácter.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-boat-dog.svg',
      title: t('На воді з собакою', 'On the water with a dog', 'На воде с собакой', 'En el agua con un perro'),
      caption: t('Особистий кадр про турботу, довіру і спокій у простих моментах поза роботою.', 'A personal image about care, trust and calm in simple moments outside work.', 'Личный кадр о заботе, доверии и спокойствии в простых моментах вне работы.', 'Imagen personal sobre cuidado, confianza y calma en momentos sencillos fuera del trabajo.')
    },
    {
      image: 'assets/images/bohdan-tiutenko-camine.svg',
      title: t('«Camine sobre la muerte, pero en mis manos queda vida»', '“Camine sobre la muerte, pero en mis manos queda vida”', '«Camine sobre la muerte, pero en mis manos queda vida»', '“Camine sobre la muerte, pero en mis manos queda vida”'),
      caption: t('Портрет, створений художницею, враженою історією життя Богдана.', 'Portrait created by an artist moved by Bohdan’s life story.', 'Портрет, созданный художницей, впечатленной историей жизни Богдана.', 'Retrato creado por una artista conmovida por la historia de vida de Bohdan.')
    }
  ],
  highlights: {
    uk: ['P&L ownership і зниження операційних витрат до 20%', 'Масштабування last-mile флоту понад 150 курʼєрів', 'Конкурсний відбір до розвідки, дисципліна і командна координація', 'Power BI, SQL, Excel, Kommo CRM, SOPs і KPI/OKR управління', 'Покращення SLA на 12% і безперервність сервісу 99.9%'],
    en: ['P&L ownership and operating-cost reduction up to 20%', 'Scaling last-mile fleets of 150+ couriers', 'Competitive intelligence-unit selection, discipline and team coordination', 'Power BI, SQL, Excel, Kommo CRM, SOPs and KPI/OKR management', '12% SLA improvement and 99.9% service continuity'],
    ru: ['P&L ownership и снижение операционных затрат до 20%', 'Масштабирование last-mile флота более 150 курьеров', 'Конкурсный отбор в разведку, дисциплина и командная координация', 'Power BI, SQL, Excel, Kommo CRM, SOPs и управление KPI/OKR', 'Улучшение SLA на 12% и непрерывность сервиса 99.9%'],
    es: ['Ownership de P&L y reducción de costos operativos hasta 20%', 'Escalamiento de flotas last-mile de +150 repartidores', 'Selección competitiva en inteligencia, disciplina y coordinación de equipo', 'Power BI, SQL, Excel, Kommo CRM, SOPs y gestión KPI/OKR', 'Mejora de SLA del 12% y continuidad de servicio al 99.9%']
  }
};

const selectedSpecialistSlugs = [
  'arthur-mensch',
  'charity-majors',
  'claire-hughes-johnson',
  'dario-amodei',
  'demis-hassabis',
  'donna-strickland',
  'elon-musk',
  'fei-fei-li',
  'guido-van-rossum',
  'gwynne-shotwell',
  'ilya-sutskever',
  'jensen-huang',
  'jay-graber',
  'katalin-kariko',
  'lina-khan',
  'linus-torvalds',
  'lisa-su',
  'margaret-hamilton',
  'mary-barra',
  'melanie-perkins',
  'mira-murati',
  'mustafa-suleyman',
  'patrick-collison',
  'radia-perlman',
  'safra-catz',
  'sam-altman',
  'sridhar-ramaswamy',
  'satya-nadella',
  'thomas-dohmke',
  'tim-berners-lee',
  'yann-lecun'
];

const curatedSpecialists = [
  bohdanProfile,
  ...specialists.filter(person => selectedSpecialistSlugs.includes(person.slug))
];

const tagLabels = {
  software: t('Програмування', 'Software', 'Программирование', 'Software'),
  research: t('Дослідження', 'Research', 'Исследования', 'Investigación'),
  history: t('Історія технологій', 'Technology history', 'История технологий', 'Historia tecnológica'),
  operations: t('Операції', 'Operations', 'Операции', 'Operaciones'),
  education: t('Освіта', 'Education', 'Образование', 'Educación'),
  space: t('Космос', 'Space', 'Космос', 'Espacio'),
  engineering: t('Інженерія', 'Engineering', 'Инженерия', 'Ingeniería'),
  science: t('Наука', 'Science', 'Наука', 'Ciencia'),
  mathematics: t('Математика', 'Mathematics', 'Математика', 'Matemáticas'),
  aviation: t('Авіація', 'Aviation', 'Авиация', 'Aviación'),
  leadership: t('Лідерство', 'Leadership', 'Лидерство', 'Liderazgo'),
  internet: t('Інтернет', 'Internet', 'Интернет', 'Internet'),
  standards: t('Стандарти', 'Standards', 'Стандарты', 'Estándares'),
  'open-source': t('Open source', 'Open source', 'Open source', 'Código abierto'),
  infrastructure: t('Інфраструктура', 'Infrastructure', 'Инфраструктура', 'Infraestructura'),
  'language-design': t('Дизайн мов', 'Language design', 'Дизайн языков', 'Diseño de lenguajes'),
  ai: t('Штучний інтелект', 'Artificial intelligence', 'Искусственный интеллект', 'Inteligencia artificial'),
  ceo: t('CEO', 'CEO', 'CEO', 'CEO'),
  startup: t('Стартапи', 'Startups', 'Стартапы', 'Startups'),
  hardware: t('Апаратне забезпечення', 'Hardware', 'Аппаратное обеспечение', 'Hardware'),
  coo: t('COO', 'COO', 'COO', 'COO'),
  enterprise: t('Корпоративне ПЗ', 'Enterprise software', 'Корпоративное ПО', 'Software empresarial'),
  cloud: t('Хмарні технології', 'Cloud', 'Облачные технологии', 'Cloud'),
  biotech: t('Біотехнології', 'Biotech', 'Биотехнологии', 'Biotecnología'),
  physics: t('Фізика', 'Physics', 'Физика', 'Física'),
  fintech: t('Фінтех', 'Fintech', 'Финтех', 'Fintech'),
  design: t('Дизайн', 'Design', 'Дизайн', 'Diseño'),
  resilience: t('Стійкість', 'Resilience', 'Устойчивость', 'Resiliencia'),
  ukraine: t('Україна', 'Ukraine', 'Украина', 'Ucrania'),
  technology: t('Технології', 'Technology', 'Технологии', 'Tecnología'),
  logistics: t('Логістика', 'Logistics', 'Логистика', 'Logística'),
  analytics: t('Аналітика даних', 'Data analytics', 'Аналитика данных', 'Analítica de datos'),
  foodtech: t('Foodtech', 'Foodtech', 'Foodtech', 'Foodtech')
};

const startups = [
  {
    slug: 'openai',
    image: logo('openai.com'),
    name: 'OpenAI',
    founded: '2015',
    category: t('Лабораторія ШІ та продуктова компанія', 'AI lab and product company', 'Лаборатория ИИ и продуктовая компания', 'Laboratorio de IA y empresa de producto'),
    summary: t('Розробляє моделі та продукти штучного інтелекту, що використовуються у бізнесі, освіті, розробці ПЗ і творчих процесах.', 'Develops AI models and products used in business, education, software development and creative workflows.', 'Разрабатывает модели и продукты ИИ для бизнеса, образования, разработки ПО и творческих процессов.', 'Desarrolla modelos y productos de IA usados en negocios, educación, software y procesos creativos.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'deepmind',
    image: logo('deepmind.google'),
    name: 'Google DeepMind',
    founded: '2010',
    category: t('Дослідницька компанія ШІ', 'AI research company', 'Исследовательская компания ИИ', 'Empresa de investigación en IA'),
    summary: t('Працює над фундаментальними системами ШІ, науковими задачами та продуктами Google.', 'Works on foundational AI systems, scientific challenges and Google products.', 'Работает над фундаментальными системами ИИ, научными задачами и продуктами Google.', 'Trabaja en sistemas fundamentales de IA, retos científicos y productos de Google.'),
    tags: ['ai', 'research', 'science']
  },
  {
    slug: 'stripe',
    image: logo('stripe.com'),
    name: 'Stripe',
    founded: '2010',
    category: t('Фінтех-інфраструктура', 'Fintech infrastructure', 'Финтех-инфраструктура', 'Infraestructura fintech'),
    summary: t('Будує API та фінансову інфраструктуру для онлайн-платежів, billing, податків і глобальних операцій.', 'Builds APIs and financial infrastructure for online payments, billing, tax and global operations.', 'Строит API и финансовую инфраструктуру для онлайн-платежей, биллинга, налогов и глобальных операций.', 'Construye APIs e infraestructura financiera para pagos online, billing, impuestos y operaciones globales.'),
    tags: ['fintech', 'software', 'operations']
  },
  {
    slug: 'spacex',
    image: logo('spacex.com'),
    name: 'SpaceX',
    founded: '2002',
    category: t('Космічна інженерія', 'Space engineering', 'Космическая инженерия', 'Ingeniería espacial'),
    summary: t('Створює ракети, супутникову інфраструктуру та комерційні сервіси запусків із фокусом на повторне використання.', 'Builds rockets, satellite infrastructure and commercial launch services with a focus on reuse.', 'Создает ракеты, спутниковую инфраструктуру и коммерческие запуски с фокусом на повторное использование.', 'Construye cohetes, infraestructura satelital y lanzamientos comerciales con foco en reutilización.'),
    tags: ['space', 'engineering', 'operations']
  },
  {
    slug: 'canva',
    image: logo('canva.com'),
    name: 'Canva',
    founded: '2013',
    category: t('Платформа дизайну', 'Design platform', 'Дизайн-платформа', 'Plataforma de diseño'),
    summary: t('Дає командам і приватним користувачам прості інструменти для презентацій, брендингу, відео та маркетингових матеріалів.', 'Gives teams and individuals simple tools for presentations, branding, video and marketing assets.', 'Дает командам и пользователям простые инструменты для презентаций, брендинга, видео и маркетинга.', 'Ofrece herramientas simples para presentaciones, marca, video y materiales de marketing.'),
    tags: ['design', 'software', 'startup']
  },
  {
    slug: 'hugging-face',
    image: logo('huggingface.co'),
    name: 'Hugging Face',
    founded: '2016',
    category: t('Open-source платформа ШІ', 'Open-source AI platform', 'Open-source платформа ИИ', 'Plataforma open-source de IA'),
    summary: t('Підтримує спільноту моделей, датасетів і інструментів для машинного навчання.', 'Supports a community of models, datasets and tools for machine learning.', 'Поддерживает сообщество моделей, датасетов и инструментов машинного обучения.', 'Sostiene una comunidad de modelos, datos y herramientas de aprendizaje automático.'),
    tags: ['ai', 'open-source', 'startup']
  },
  {
    slug: 'figma',
    image: logo('figma.com'),
    name: 'Figma',
    founded: '2012',
    category: t('Спільний дизайн у браузері', 'Collaborative browser-based design', 'Совместный дизайн в браузере', 'Diseño colaborativo en navegador'),
    summary: t('Перенесла дизайн інтерфейсів у хмару, де продукт, дизайн і розробка працюють над одним джерелом правди.', 'Moved interface design into the cloud so product, design and engineering teams share one source of truth.', 'Перенесла дизайн интерфейсов в облако, где продукт, дизайн и разработка работают с единым источником правды.', 'Llevó el diseño de interfaces a la nube para alinear producto, diseño e ingeniería.'),
    tags: ['design', 'software', 'startup']
  },
  {
    slug: 'notion',
    image: logo('notion.so'),
    name: 'Notion',
    founded: '2013',
    category: t('Продуктивність і знання', 'Productivity and knowledge', 'Продуктивность и знания', 'Productividad y conocimiento'),
    summary: t('Обʼєднує документи, бази даних, wiki та робочі процеси для команд різного масштабу.', 'Combines documents, databases, wikis and workflows for teams of many sizes.', 'Объединяет документы, базы данных, wiki и рабочие процессы для команд разного масштаба.', 'Combina documentos, bases de datos, wikis y flujos para equipos de distintos tamaños.'),
    tags: ['software', 'operations', 'startup']
  },
  {
    slug: 'anthropic',
    image: logo('anthropic.com'),
    name: 'Anthropic',
    founded: '2021',
    category: t('AI safety та моделі', 'AI safety and models', 'AI safety и модели', 'Seguridad de IA y modelos'),
    summary: t('Розробляє асистентів і дослідження безпеки, орієнтовані на контрольовані та корисні AI-системи.', 'Develops assistants and safety research focused on controllable and useful AI systems.', 'Разрабатывает ассистентов и исследования безопасности для контролируемых и полезных AI-систем.', 'Desarrolla asistentes e investigación de seguridad para sistemas de IA útiles y controlables.'),
    tags: ['ai', 'research', 'startup']
  },
  {
    slug: 'mistral-ai',
    image: logo('mistral.ai'),
    name: 'Mistral AI',
    founded: '2023',
    category: t('Європейські AI-моделі', 'European AI models', 'Европейские AI-модели', 'Modelos europeos de IA'),
    summary: t('Будує відкриті та комерційні моделі ШІ, посилюючи європейську AI-екосистему.', 'Builds open and commercial AI models, strengthening the European AI ecosystem.', 'Строит открытые и коммерческие модели ИИ, усиливая европейскую AI-экосистему.', 'Construye modelos abiertos y comerciales, fortaleciendo el ecosistema europeo de IA.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'databricks',
    image: logo('databricks.com'),
    name: 'Databricks',
    founded: '2013',
    category: t('Платформа даних та AI', 'Data and AI platform', 'Платформа данных и AI', 'Plataforma de datos e IA'),
    summary: t('Поєднує lakehouse-архітектуру, аналітику, ML та управління даними для підприємств.', 'Combines lakehouse architecture, analytics, ML and data governance for enterprises.', 'Объединяет lakehouse-архитектуру, аналитику, ML и управление данными для предприятий.', 'Combina arquitectura lakehouse, analítica, ML y gobierno de datos para empresas.'),
    tags: ['ai', 'cloud', 'enterprise']
  },
  {
    slug: 'grammarly',
    image: logo('grammarly.com'),
    name: 'Grammarly',
    founded: '2009',
    category: t('AI для письма', 'AI writing assistance', 'AI для письма', 'IA para escritura'),
    summary: t('Українсько-заснована компанія, що допомагає писати точніше, зрозуміліше й професійніше.', 'A Ukrainian-founded company helping people write more clearly, accurately and professionally.', 'Компания с украинскими корнями, помогающая писать точнее, понятнее и профессиональнее.', 'Empresa fundada por ucranianos que ayuda a escribir con claridad, precisión y profesionalismo.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'preply',
    image: logo('preply.com'),
    name: 'Preply',
    founded: '2012',
    category: t('EdTech-маркетплейс', 'EdTech marketplace', 'EdTech-маркетплейс', 'Marketplace EdTech'),
    summary: t('Платформа з українським корінням для онлайн-навчання мов із викладачами по всьому світу.', 'A Ukrainian-rooted platform for online language learning with tutors around the world.', 'Платформа с украинскими корнями для онлайн-изучения языков с преподавателями по всему миру.', 'Plataforma con raíces ucranianas para aprender idiomas online con tutores de todo el mundo.'),
    tags: ['education', 'software', 'startup']
  },
  {
    slug: 'gitlab',
    image: logo('gitlab.com'),
    name: 'GitLab',
    founded: '2011',
    category: t('DevOps-платформа', 'DevOps platform', 'DevOps-платформа', 'Plataforma DevOps'),
    summary: t('Надає інструменти для репозиторіїв, CI/CD, безпеки та спільної розробки програмного забезпечення.', 'Provides tools for repositories, CI/CD, security and collaborative software development.', 'Предоставляет инструменты для репозиториев, CI/CD, безопасности и совместной разработки ПО.', 'Ofrece repositorios, CI/CD, seguridad y desarrollo colaborativo de software.'),
    tags: ['software', 'open-source', 'operations']
  },
  {
    slug: 'scale-ai',
    image: logo('scale.com'),
    name: 'Scale AI',
    founded: '2016',
    category: t('Дані для AI', 'Data for AI', 'Данные для AI', 'Datos para IA'),
    summary: t('Підтримує підготовку даних і evaluation-процеси для компаній, що створюють AI-системи.', 'Supports data preparation and evaluation workflows for companies building AI systems.', 'Поддерживает подготовку данных и evaluation-процессы для компаний, создающих AI-системы.', 'Apoya preparación de datos y evaluación para empresas que crean sistemas de IA.'),
    tags: ['ai', 'operations', 'startup']
  },
  {
    slug: 'cursor',
    image: logo('cursor.com'),
    name: 'Cursor',
    founded: '2023',
    category: t('AI-інструменти для розробників', 'AI tooling for developers', 'AI-инструменты для разработчиков', 'Herramientas de IA para desarrolladores'),
    summary: t('Створює редактор і робочі процеси для інженерних команд, які поєднують coding assistants, codebase search та автоматизацію.', 'Builds an editor and workflows for engineering teams that combine coding assistants, codebase search and automation.', 'Создает редактор и процессы для инженерных команд, объединяя coding assistants, поиск по codebase и автоматизацию.', 'Crea un editor y flujos para equipos de ingeniería que combinan asistentes de código, búsqueda y automatización.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'vercel',
    image: logo('vercel.com'),
    name: 'Vercel',
    founded: '2015',
    category: t('Хмарна платформа для фронтенду', 'Cloud platform for frontend teams', 'Облачная платформа для фронтенд-команд', 'Plataforma cloud para equipos frontend'),
    summary: t('Підтримує розгортання, edge-інфраструктуру та продуктову швидкість для сучасних вебкоманд.', 'Supports deployment, edge infrastructure and product velocity for modern web teams.', 'Поддерживает деплой, edge-инфраструктуру и скорость продуктовых веб-команд.', 'Impulsa despliegue, edge infrastructure y velocidad de producto para equipos web modernos.'),
    tags: ['cloud', 'software', 'startup']
  },
  {
    slug: 'elevenlabs',
    image: logo('elevenlabs.io'),
    name: 'ElevenLabs',
    founded: '2022',
    category: t('Генеративний voice AI', 'Generative voice AI', 'Генеративный voice AI', 'IA generativa de voz'),
    summary: t('Розвиває синтез мовлення, voice agents і мультимовні аудіопродукти для медіа, освіти та бізнесу.', 'Develops speech synthesis, voice agents and multilingual audio products for media, education and business.', 'Развивает синтез речи, voice agents и мультиязычные аудиопродукты для медиа, образования и бизнеса.', 'Desarrolla síntesis de voz, voice agents y productos de audio multilingües para medios, educación y empresas.'),
    tags: ['ai', 'software', 'startup']
  },
  {
    slug: 'revolut',
    image: logo('revolut.com'),
    name: 'Revolut',
    founded: '2015',
    category: t('Глобальний фінтех-сервіс', 'Global fintech platform', 'Глобальная финтех-платформа', 'Plataforma fintech global'),
    summary: t('Поєднує банкінг, карткові продукти, бізнес-рахунки та міжнародні фінансові операції в одному застосунку.', 'Combines banking, cards, business accounts and international financial operations in one app.', 'Объединяет банкинг, карты, бизнес-счета и международные финансовые операции в одном приложении.', 'Combina banca, tarjetas, cuentas de negocio y operaciones financieras globales en una sola app.'),
    tags: ['fintech', 'operations', 'startup']
  },
  {
    slug: 'ajax-systems',
    image: logo('ajax.systems'),
    name: 'Ajax Systems',
    founded: '2011',
    category: t('Український hardware та security tech', 'Ukrainian hardware and security tech', 'Украинский hardware и security tech', 'Hardware y security tech ucraniano'),
    summary: t('Розробляє охоронні системи, сенсори та звʼязкову інфраструктуру для домівок і бізнесу на глобальному ринку.', 'Builds security systems, sensors and communications infrastructure for homes and businesses worldwide.', 'Разрабатывает системы безопасности, сенсоры и коммуникационную инфраструктуру для домов и бизнеса по всему миру.', 'Desarrolla sistemas de seguridad, sensores e infraestructura de comunicación para hogares y empresas a nivel global.'),
    tags: ['hardware', 'engineering', 'startup']
  }
];

const specialistOutput = curatedSpecialists.map(person => {
  const tags = {};
  for (const lang of langs) {
    tags[lang] = person.tags.map(tag => tagLabels[tag]?.[lang] || tag);
  }

  const bio = {
    uk: `${person.name.uk} — ${person.role.uk}. Професійний фокус: ${person.focus.uk}. Ключовий внесок: ${person.knownFor.uk}. ${person.life.uk}`,
    en: `${person.name.en} is known as ${person.role.en}. Professional focus: ${person.focus.en}. Key contribution: ${person.knownFor.en}. ${person.life.en}`,
    ru: `${person.name.ru} — ${person.role.ru}. Профессиональный фокус: ${person.focus.ru}. Ключевой вклад: ${person.knownFor.ru}. ${person.life.ru}`,
    es: `${person.name.es} destaca como ${person.role.es}. Foco profesional: ${person.focus.es}. Contribución clave: ${person.knownFor.es}. ${person.life.es}`
  };

  return {
    slug: person.slug,
    image: person.image,
    name: person.name,
    role: person.role,
    country: person.country,
    focus: person.focus,
    knownFor: person.knownFor,
    bio,
    tags,
    featured: Boolean(person.featured),
    gallery: person.gallery || [],
    highlights: person.highlights || null
  };
});

const startupOutput = startups.map(company => {
  const tags = {};
  for (const lang of langs) {
    tags[lang] = company.tags.map(tag => tagLabels[tag]?.[lang] || tag);
  }
  return { ...company, tags };
});

fs.writeFileSync('src/specialists.json', `${JSON.stringify(specialistOutput, null, 2)}\n`);
fs.writeFileSync('src/startups.json', `${JSON.stringify(startupOutput, null, 2)}\n`);
console.log(`Generated ${specialistOutput.length} specialist profiles and ${startupOutput.length} startup records.`);
