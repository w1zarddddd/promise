// Слушаем событие отправки формы (когда пользователь нажимает кнопку "Поиск")
document.getElementById('movieForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    // Получаем значение из поля ввода
    const movieTitle = document.getElementById('movieTitle').value;
    // Элементы для отображения информации о фильме и ошибок
    const movieInfo = document.getElementById('movieInfo');
    const errorMessage = document.getElementById('errorMessage');
    
    // Очищаем предыдущую информацию и сообщения об ошибках
    movieInfo.innerHTML = '';
    errorMessage.innerHTML = '';

    // Вызываем функцию поиска фильма
    searchMovie(movieTitle)
        .then(data => displayMovieInfo(data)) // Если поиск успешен, показываем информацию о фильме
        .catch(error => displayError(error)); // Если возникла ошибка, показываем сообщение об ошибке
});

// Функция для поиска фильма по названию
function searchMovie(title) {
    const apiKey = '9573e1b7'; // ключ API для сервиса OMDB
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    
    // Отправляем запрос к API
    return fetch(url)
        .then(response => {
            if (!response.ok) { // Проверяем, успешен ли ответ
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Преобразуем ответ в формат JSON (данные)
        })
        .then(data => {
            if (data.Response === 'False') { // Проверяем, нашелся ли фильм
                throw new Error(data.Error); // Если фильм не найден, бросаем ошибку
            }
            return data; // Возвращаем данные о фильме
        });
}

// Функция для отображения информации о фильме на странице
function displayMovieInfo(data) {
    const movieInfo = document.getElementById('movieInfo');
    movieInfo.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <p><strong>Жанр:</strong> ${data.Genre}</p>
        <p><strong>Режиссер:</strong> ${data.Director}</p>
        <p><strong>Сюжет:</strong> ${data.Plot}</p>
        <img src="${data.Poster}" alt="${data.Title}">
    `;
}

// Функция для отображения сообщения об ошибке на странице
function displayError(error) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = `Error: ${error.message}`;
}

// Пример функции для поиска нескольких фильмов подряд
function searchMultipleMovies(titles) {
    // Создаем массив обещаний (promises) для каждого фильма
    const promises = titles.map(title => searchMovie(title));
    // Когда все обещания будут выполнены, выполняем обработку
    Promise.all(promises)
        .then(movies => {
            // Отображаем информацию для каждого найденного фильма
            movies.forEach(movie => displayMovieInfo(movie));
        })
        .catch(error => displayError(error)); // Если возникла ошибка, показываем сообщение об ошибке
}

// Пример использования функции для поиска нескольких фильмов
const movieTitles = ['Inception', 'The Matrix', 'breaking bad'];
searchMultipleMovies(movieTitles);
