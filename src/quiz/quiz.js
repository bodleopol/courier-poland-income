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

  const QUESTIONS_PER_QUIZ = 20; // Number of questions to ask per session

  // Determine language
  const currentLang = document.documentElement.lang || 'ua';

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
    const industryKey = `industry_${currentLang}`;
    const industries = [...new Set(quizData.map(q => q[industryKey]))].sort();

    industries.forEach(industry => {
      const card = document.createElement('div');
      card.className = 'industry-card';

      // Get a count of questions for this industry
      const count = quizData.filter(q => q[industryKey] === industry).length;

      card.innerHTML = `
        <h3 style="margin-top: 0;">${industry}</h3>
        <p style="color: #6c757d; font-size: 0.9rem; margin-bottom: 0;">${count} питань</p>
      `;

      card.addEventListener('click', () => startQuiz(industry));
      industryGrid.appendChild(card);
    });

    showScreen(selectionScreen);
  }

  function startQuiz(industry) {
    currentIndustry = industry;
    const industryKey = `industry_${currentLang}`;

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
    progressText.textContent = `Питання ${currentQuestionIndex + 1} з ${currentQuestions.length}`;

    // Update Question
    questionText.textContent = question[`question_${currentLang}`];

    // Update Options (assuming options A, B, C, D exist in the data)
    optionsGrid.innerHTML = '';

    const optionLabels = ['A', 'B', 'C', 'D'];
    const options = [
      { id: 'A', text: question[`option_a_${currentLang}`] },
      { id: 'B', text: question[`option_b_${currentLang}`] },
      { id: 'C', text: question[`option_c_${currentLang}`] },
      { id: 'D', text: question[`option_d_${currentLang}`] }
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
      btnNext.textContent = 'Завершити тест';
    } else {
      btnNext.textContent = 'Наступне питання';
    }
  }

  function finishQuiz() {
    const percentage = Math.round((score / currentQuestions.length) * 100) || 0;

    finalScoreEl.textContent = percentage;

    if (percentage >= 90) {
      resultMessageEl.textContent = 'Відмінно! Ви справжній професіонал у цій галузі. 🏆';
      resultMessageEl.style.color = '#2e7d32';
    } else if (percentage >= 70) {
      resultMessageEl.textContent = 'Гарний результат! У вас хороші знання. 👍';
      resultMessageEl.style.color = '#00a67e';
    } else if (percentage >= 50) {
      resultMessageEl.textContent = 'Непогано, але є куди рости. Варто ще потренуватися. 📚';
      resultMessageEl.style.color = '#f57c00';
    } else {
      resultMessageEl.textContent = 'Потрібно більше практики. Спробуйте пройти тест ще раз! 💪';
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
    startQuiz(currentIndustry);
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
