document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loadingScreen = document.getElementById('loading-screen');
  const selectionScreen = document.getElementById('selection-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const resultsScreen = document.getElementById('results-screen');

  const industryGrid = document.getElementById('industry-grid');
  const currentIndustryTitle = document.getElementById('current-industry-title');
  const questionText = document.getElementById('question-text');
  const optionsGrid = document.getElementById('options-grid');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  const btnNext = document.getElementById('btn-next');
  const btnQuit = document.getElementById('btn-quit');
  const btnRetry = document.getElementById('btn-retry');
  const btnHome = document.getElementById('btn-home');

  const finalScoreEl = document.getElementById('final-score');
  const resultMessageEl = document.getElementById('result-message');

  // State
  let quizData = null;
  let currentIndustryId = null;
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  // Detect current language from HTML tag or fallback to 'ua'
  const currentLang = document.documentElement.lang === 'uk' ? 'ua' : (document.documentElement.lang || 'ua');

  const QUESTIONS_PER_QUIZ = 20; // Number of questions to ask per session

  // Fetch Data
  fetch('/quiz-data.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load quiz data');
      return response.json();
    })
    .then(data => {
      quizData = data;
      initIndustrySelection();
    })
    .catch(error => {
      console.error('Error loading quiz data:', error);
      loadingScreen.innerHTML = '<div class="loading-spinner" style="color: #dc3545;">Помилка завантаження даних. Спробуйте оновити сторінку.</div>';
    });

  function showScreen(screen) {
    [loadingScreen, selectionScreen, quizScreen, resultsScreen].forEach(s => {
      s.classList.remove('active');
    });
    screen.classList.add('active');
  }

  function initIndustrySelection() {
    industryGrid.innerHTML = '';

    // Group by industry_id
    const industryMap = new Map();

    quizData.forEach(q => {
      // Some old questions might still be in the data without industry_id, let's gracefully handle or skip them
      const indId = q.industry_id || q.industry;
      const indName = q[`industry_${currentLang}`] || q.industry_ua || q.industry;

      if (!industryMap.has(indId)) {
        industryMap.set(indId, {
          id: indId,
          name: indName,
          count: 0
        });
      }
      industryMap.get(indId).count++;
    });

    const industries = Array.from(industryMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    industries.forEach(ind => {
      const card = document.createElement('div');
      card.className = 'industry-card';

      card.innerHTML = `
        <h3 style="margin-top: 0;">${ind.name}</h3>
        <p style="color: #6c757d; font-size: 0.9rem; margin-bottom: 0;">${ind.count} ${currentLang === 'ua' ? 'питань' : currentLang === 'pl' ? 'pytań' : currentLang === 'ru' ? 'вопросов' : 'questions'}</p>
      `;

      card.addEventListener('click', () => startQuiz(ind));
      industryGrid.appendChild(card);
    });

    showScreen(selectionScreen);
  }

  function startQuiz(industryObj) {
    currentIndustryId = industryObj.id;

    // Filter questions for the selected industry and shuffle them
    const industryQuestions = quizData.filter(q => (q.industry_id || q.industry) === industryObj.id);
    currentQuestions = shuffleArray(industryQuestions).slice(0, QUESTIONS_PER_QUIZ);

    currentQuestionIndex = 0;
    score = 0;

    currentIndustryTitle.textContent = industryObj.name;

    loadQuestion();
    showScreen(quizScreen);
  }

  function loadQuestion() {
    hasAnswered = false;
    btnNext.disabled = true;

    const question = currentQuestions[currentQuestionIndex];

    // Update Progress
    const progressPercentage = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `Питання ${currentQuestionIndex + 1} з ${currentQuestions.length}`;

    // Update Question
    questionText.textContent = question[`question_${currentLang}`] || question.question_ua || question.question;

    // Update localized UI elements
    const nextBtnText = { ua: 'Наступне питання', pl: 'Następne pytanie', ru: 'Следующий вопрос', en: 'Next question' };
    const quitBtnText = { ua: 'Завершити достроково', pl: 'Zakończ przedwcześnie', ru: 'Завершить досрочно', en: 'Quit early' };
    const finishBtnText = { ua: 'Завершити тест', pl: 'Zakończ test', ru: 'Завершить тест', en: 'Finish quiz' };
    const qCountText = { ua: 'Питання', pl: 'Pytanie', ru: 'Вопрос', en: 'Question' };
    const ofText = { ua: 'з', pl: 'z', ru: 'из', en: 'of' };

    progressText.textContent = `${qCountText[currentLang]} ${currentQuestionIndex + 1} ${ofText[currentLang]} ${currentQuestions.length}`;
    btnQuit.textContent = quitBtnText[currentLang];

    if (currentQuestionIndex === currentQuestions.length - 1) {
      btnNext.textContent = finishBtnText[currentLang];
    } else {
      btnNext.textContent = nextBtnText[currentLang];
    }

    // Update Options (assuming options A, B, C, D exist in the data)
    optionsGrid.innerHTML = '';

    const options = [
      { id: 'A', text: question[`option_a_${currentLang}`] || question.option_a_ua || question.option_a },
      { id: 'B', text: question[`option_b_${currentLang}`] || question.option_b_ua || question.option_b },
      { id: 'C', text: question[`option_c_${currentLang}`] || question.option_c_ua || question.option_c },
      { id: 'D', text: question[`option_d_${currentLang}`] || question.option_d_ua || question.option_d }
    ];

    options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${opt.id}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => handleAnswer(opt.id, question.correct_option, btn));
      optionsGrid.appendChild(btn);
    });
  }

  function handleAnswer(selectedId, correctId, selectedBtn) {
    if (hasAnswered) return;
    hasAnswered = true;

    const optionBtns = optionsGrid.querySelectorAll('.option-btn');

    if (selectedId === correctId) {
      selectedBtn.classList.add('correct');
      score++;
    } else {
      selectedBtn.classList.add('incorrect');
      // Highlight correct answer
      optionBtns.forEach(btn => {
        if (btn.querySelector('.option-letter').textContent === correctId) {
          btn.classList.add('correct');
        }
      });
    }

    btnNext.disabled = false;

    const nextBtnText = { ua: 'Наступне питання', pl: 'Następne pytanie', ru: 'Следующий вопрос', en: 'Next question' };
    const finishBtnText = { ua: 'Завершити тест', pl: 'Zakończ test', ru: 'Завершить тест', en: 'Finish quiz' };

    if (currentQuestionIndex === currentQuestions.length - 1) {
      btnNext.textContent = finishBtnText[currentLang];
    } else {
      btnNext.textContent = nextBtnText[currentLang];
    }
  }

  function finishQuiz() {
    const percentage = Math.round((score / currentQuestions.length) * 100) || 0;

    finalScoreEl.textContent = percentage;

    const messages = {
      excellent: { ua: 'Відмінно! Ви справжній професіонал у цій галузі. 🏆', pl: 'Znakomicie! Jesteś prawdziwym profesjonalistą w tej dziedzinie. 🏆', ru: 'Отлично! Вы настоящий профессионал в этой отрасли. 🏆', en: 'Excellent! You are a true professional in this field. 🏆' },
      good: { ua: 'Гарний результат! У вас хороші знання. 👍', pl: 'Dobry wynik! Masz dobrą wiedzę. 👍', ru: 'Хороший результат! У вас хорошие знания. 👍', en: 'Good result! You have good knowledge. 👍' },
      fair: { ua: 'Непогано, але є куди рости. Варто ще потренуватися. 📚', pl: 'Nieźle, ale jest miejsce na rozwój. Warto jeszcze poćwiczyć. 📚', ru: 'Неплохо, но есть куда расти. Стоит еще потренироваться. 📚', en: 'Not bad, but there is room for growth. Worth practicing more. 📚' },
      poor: { ua: 'Потрібно більше практики. Спробуйте пройти тест ще раз! 💪', pl: 'Potrzeba więcej praktyki. Spróbuj rozwiązać test jeszcze raz! 💪', ru: 'Нужно больше практики. Попробуйте пройти тест еще раз! 💪', en: 'More practice needed. Try taking the test again! 💪' }
    };

    if (percentage >= 90) {
      resultMessageEl.textContent = messages.excellent[currentLang];
      resultMessageEl.style.color = '#2e7d32';
    } else if (percentage >= 70) {
      resultMessageEl.textContent = messages.good[currentLang];
      resultMessageEl.style.color = '#00a67e';
    } else if (percentage >= 50) {
      resultMessageEl.textContent = messages.fair[currentLang];
      resultMessageEl.style.color = '#f57c00';
    } else {
      resultMessageEl.textContent = messages.poor[currentLang];
      resultMessageEl.style.color = '#c62828';
    }

    showScreen(resultsScreen);
  }

  // Event Listeners
  btnNext.addEventListener('click', () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      finishQuiz();
    }
  });

  btnQuit.addEventListener('click', () => {
    if (confirm('Ви впевнені, що хочете достроково завершити тест? Ваш поточний результат буде збережено.')) {
      // Adjust total questions to current index to calculate score based on answered questions
      if (currentQuestionIndex === 0 && !hasAnswered) {
         showScreen(selectionScreen); // Go back if no questions answered
      } else {
         currentQuestions = currentQuestions.slice(0, hasAnswered ? currentQuestionIndex + 1 : currentQuestionIndex);
         finishQuiz();
      }
    }
  });

  btnRetry.addEventListener('click', () => {
    // Re-find the industry object to pass to startQuiz
    const indIds = Array.from(new Set(quizData.map(q => q.industry_id || q.industry)));
    const ind = indIds.map(id => {
      const q = quizData.find(x => (x.industry_id || x.industry) === id);
      return { id: id, name: q[`industry_${currentLang}`] || q.industry_ua || q.industry };
    }).find(i => i.id === currentIndustryId);

    startQuiz(ind);
  });

  btnHome.addEventListener('click', () => {
    initIndustrySelection();
  });

  // Utility function to shuffle an array
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
});
