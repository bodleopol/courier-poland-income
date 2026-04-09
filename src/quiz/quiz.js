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
  let currentIndustry = null;
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  const htmlLang = (document.documentElement.lang || 'uk').toLowerCase();
  let appLang = 'ua';
  if (htmlLang === 'pl') appLang = 'pl';
  else if (htmlLang === 'ru') appLang = 'ru';
  else if (htmlLang === 'en') appLang = 'en';

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

    // Extract unique industries from the data based on current language
    const industryKey = `industry_${appLang}`;
    const industries = [...new Set(quizData.map(q => q[industryKey]))].sort();

    const questionsLabel = appLang === 'pl' ? 'pytań' : (appLang === 'ru' ? 'вопросов' : (appLang === 'en' ? 'questions' : 'питань'));

    industries.forEach(industry => {
      const card = document.createElement('div');
      card.className = 'industry-card';

      // Get a count of questions for this industry
      const count = quizData.filter(q => q[industryKey] === industry).length;

      card.innerHTML = `
        <h3 style="margin-top: 0;">${industry}</h3>
        <p style="color: #6c757d; font-size: 0.9rem; margin-bottom: 0;">${count} ${questionsLabel}</p>
      `;

      card.addEventListener('click', () => startQuiz(industry));
      industryGrid.appendChild(card);
    });

    showScreen(selectionScreen);
  }

  function startQuiz(industry) {
    currentIndustry = industry;
    const industryKey = `industry_${appLang}`;

    // Filter questions for the selected industry and shuffle them
    const industryQuestions = quizData.filter(q => q[industryKey] === industry);
    currentQuestions = shuffleArray(industryQuestions).slice(0, QUESTIONS_PER_QUIZ);

    currentQuestionIndex = 0;
    score = 0;

    currentIndustryTitle.textContent = industry;

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

    const progressLabel = appLang === 'pl' ? 'Pytanie' : (appLang === 'ru' ? 'Вопрос' : (appLang === 'en' ? 'Question' : 'Питання'));
    const ofLabel = appLang === 'pl' ? 'z' : (appLang === 'ru' ? 'из' : (appLang === 'en' ? 'of' : 'з'));

    progressText.textContent = `${progressLabel} ${currentQuestionIndex + 1} ${ofLabel} ${currentQuestions.length}`;

    // Update Question
    questionText.textContent = question[`question_${appLang}`];

    // Update Options (assuming options A, B, C, D exist in the data)
    optionsGrid.innerHTML = '';

    const optionLabels = ['A', 'B', 'C', 'D'];
    const options = [
      { id: 'A', text: question[`option_a_${appLang}`] },
      { id: 'B', text: question[`option_b_${appLang}`] },
      { id: 'C', text: question[`option_c_${appLang}`] },
      { id: 'D', text: question[`option_d_${appLang}`] }
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

    if (currentQuestionIndex === currentQuestions.length - 1) {
      btnNext.textContent = appLang === 'pl' ? 'Zakończ test' : (appLang === 'ru' ? 'Завершить тест' : (appLang === 'en' ? 'Finish quiz' : 'Завершити тест'));
    } else {
      btnNext.textContent = appLang === 'pl' ? 'Następne pytanie' : (appLang === 'ru' ? 'Следующий вопрос' : (appLang === 'en' ? 'Next question' : 'Наступне питання'));
    }
  }

  function finishQuiz() {
    const percentage = Math.round((score / currentQuestions.length) * 100) || 0;

    finalScoreEl.textContent = percentage;

    if (percentage >= 90) {
      resultMessageEl.textContent = appLang === 'pl' ? 'Świetnie! Jesteś prawdziwym profesjonalistą w tej dziedzinie. 🏆' : (appLang === 'ru' ? 'Отлично! Вы настоящий профессионал в этой отрасли. 🏆' : (appLang === 'en' ? 'Excellent! You are a true professional in this field. 🏆' : 'Відмінно! Ви справжній професіонал у цій галузі. 🏆'));
      resultMessageEl.style.color = '#2e7d32';
    } else if (percentage >= 70) {
      resultMessageEl.textContent = appLang === 'pl' ? 'Dobry wynik! Masz dobrą wiedzę. 👍' : (appLang === 'ru' ? 'Хороший результат! У вас хорошие знания. 👍' : (appLang === 'en' ? 'Good result! You have good knowledge. 👍' : 'Гарний результат! У вас хороші знання. 👍'));
      resultMessageEl.style.color = '#00a67e';
    } else if (percentage >= 50) {
      resultMessageEl.textContent = appLang === 'pl' ? 'Nieźle, ale jest pole do poprawy. Warto poćwiczyć. 📚' : (appLang === 'ru' ? 'Неплохо, но есть куда расти. Стоит еще потренироваться. 📚' : (appLang === 'en' ? 'Not bad, but there is room for improvement. Worth practicing more. 📚' : 'Непогано, але є куди рости. Варто ще потренуватися. 📚'));
      resultMessageEl.style.color = '#f57c00';
    } else {
      resultMessageEl.textContent = appLang === 'pl' ? 'Potrzeba więcej praktyki. Spróbuj przejść test jeszcze raz! 💪' : (appLang === 'ru' ? 'Нужно больше практики. Попробуйте пройти тест еще раз! 💪' : (appLang === 'en' ? 'More practice needed. Try taking the test again! 💪' : 'Потрібно більше практики. Спробуйте пройти тест ще раз! 💪'));
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
    const confirmMsg = appLang === 'pl' ? 'Czy na pewno chcesz przedwcześnie zakończyć test? Twój obecny wynik zostanie zapisany.' :
                      (appLang === 'ru' ? 'Вы уверены, что хотите досрочно завершить тест? Ваш текущий результат будет сохранен.' :
                      (appLang === 'en' ? 'Are you sure you want to end the test early? Your current score will be saved.' : 'Ви впевнені, що хочете достроково завершити тест? Ваш поточний результат буде збережено.'));
    if (confirm(confirmMsg)) {
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
    startQuiz(currentIndustry);
  });

  btnHome.addEventListener('click', () => {
    initIndustrySelection();
  });

  // Utility function to shuffle an array
  function shuffleArray(array, seedStr = 'quiz') {
  const shuffled = [...array];
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let seed = Math.abs(hash);

  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const rand = seed / 233280;
    const j = Math.floor(rand * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
});
