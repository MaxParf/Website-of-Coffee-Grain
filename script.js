// УПРАВЛЕНИЕ ЭЛЕМЕНТАМИ БЛОКА МЕНЮ
// Находим все кнопки меню категорий
const categoryButtons = document.querySelectorAll('.menu__category');
// Находим все блоки с контентом (кофе, десерты, закуски)
const menuSections = document.querySelectorAll('.menu__coffee, .menu__desserts, .menu__snacks');

// Функция скрывает все категории
function hideAllSections() {
  menuSections.forEach(section => {
    section.style.display = 'none';
  });
}

// Функция удаляет активное состояние у кнопок
function deactivateAllButtons() {
  categoryButtons.forEach(button => {
    button.classList.remove('active');
  });
}

// Назначаем обработчик на каждую кнопку
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.menu; // coffee / desserts / snacks

    // Скрываем все блоки и убираем активные кнопки
    hideAllSections();
    deactivateAllButtons();

    // Показываем выбранный блок
    document.querySelector(`.menu__${target}`).style.display = 'grid'; // или flex
    // Активируем кнопку
    button.classList.add('active');
  });
});

// При загрузке страницы показываем первую категорию
hideAllSections();
document.querySelector('.menu__coffee').style.display = 'grid';
categoryButtons[0].classList.add('active');

// БЛОК БРОНИРОВАНИЯ
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  const modalMessage = document.getElementById('bookingModalMessage');

  const showModal = (message, success = true) => {
    modalMessage.textContent = message;
    modalMessage.style.color = success ? 'green' : 'red';
    modal.style.display = 'flex';
  };

  // Закрытие модалки кликом по фону
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.name;
    const phoneInput = form.phone;
    const commentInput = form.comment;

    const sanitize = (str) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Проверка имени
    if (!nameInput.value.trim()) {
      nameInput.value = '';
      nameInput.placeholder = 'Введите ваше имя';
      nameInput.focus();
      return;
    }

    // Проверка телефона
    const phonePattern = /^(\+7\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}|\+7\d{10}|\d{10}|\d{3}\s\d{3}\s\d{2}\s\d{2})$/;
    if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value.trim())) {
      phoneInput.value = '';
      phoneInput.placeholder = 'Введите корректный телефон';
      phoneInput.focus();
      return;
    }

    // Проверка комментария
    if (!commentInput.value.trim()) {
      commentInput.value = '';
      commentInput.placeholder = 'Введите комментарий';
      commentInput.focus();
      return;
    }

    const data = {
      name: sanitize(nameInput.value.trim()),
      phone: sanitize(phoneInput.value.trim()),
      comment: sanitize(commentInput.value.trim()),
    };

    try {
      const response = await fetch('sendBooking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showModal('✅ Бронирование успешно отправлено!', true);
        form.reset();
      } else {
        showModal('❌ Ошибка при отправке. Попробуйте позже.', false);
      }
    } catch (err) {
      showModal('❌ Ошибка при отправке. Попробуйте позже.', false);
    }
  });
});

