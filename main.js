"use strict";

import { getComments } from "./api.js";
import { postComments } from "./api.js";
import { getDateComment } from "./date.js";
import { render } from "./render.js";

const listElement = document.getElementById("list");
const nameInput = document.getElementById("add-name");
const commentTextarea = document.getElementById("add-comment");
const buttonElement = document.getElementById("add-button");
const loadedComment = document.querySelector(".loaded-comment");
const loadedPage = document.querySelector(".loaded-page");

// Массив, в который кладем комменатрии пользователей
let comments = [];

const fetchAndRenderComments = () => {
  getComments()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          author: comment.author.name,
          text: comment.text,
          date: getDateComment(new Date(comment.date)), // Вызываем дату
          like: comment.likes,
          myLike: comment.isLiked,
        };
      });
      comments = appComments;
      renderComments();
    })
    .then((response) => {
      return (loadedPage.style.display = "none");
    })
    .catch((error) => {
      if (error.message === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у тебя сломался интернет, попробуй позже");
      }
    });
};

// Опция ответить на комментарий
const editTextArea = () => {
  const editUsersComment = document.querySelectorAll(".comment-text");

  // Цикл for проходит по каждому элементу в списке
  for (const editUserComment of editUsersComment) {
    // Добавляет обработчик клика на конкретный элемент в списке
    editUserComment.addEventListener("click", () => {
      const index = editUserComment.dataset.comment;
      commentTextarea.value =
        "QUOTE_BEGIN " +
        comments[index].author +
        ":\n " +
        comments[index].text +
        " QUOTE_END ";
    });
  }
};

// Поставить лайк
const initLikeAddListener = () => {
  const likeComments = document.querySelectorAll(".like-button");

  for (const likeComment of likeComments) {
    likeComment.addEventListener("click", () => {
      const index = likeComment.dataset.index;
      if (comments[index].myLike === false) {
        comments[index].myLike = true;
        comments[index].like++;
      } else {
        comments[index].myLike = false;
        comments[index].like--;
      }
      renderComments();
    });
  }
};

// Отправка сообщений по enter
const sendMessageByClickEnter = () => {
  const sendMessage = document
    .getElementById("add-comment")
    .addEventListener("keydown", (enter) => {
      if (enter.key === "Enter") {
        enter.preventDefault();
        buttonElement.click();
      }
    });
};

// Рендер комментариев
const renderComments = () => {
  listElement.innerHTML = render(comments);
  initLikeAddListener();
  editTextArea();
  sendMessageByClickEnter();
};

fetchAndRenderComments();
renderComments();

// Функция разблокировки кнопки «Написать»
nameInput.addEventListener("input", () => {
  buttonElement.disabled = false;
});
commentTextarea.addEventListener("input", () => {
  buttonElement.disabled = false;
});

// Действия с кнопкой «Написать»
buttonElement.addEventListener("click", () => {
  // Валидация на поле ввода имени и комментария
  nameInput.classList.remove("error");
  commentTextarea.classList.remove("error");

  if (nameInput.value === "" && commentTextarea.value === "") {
    nameInput.classList.add("error");
    commentTextarea.classList.add("error");
    buttonElement.disabled = true;
    return;
  } else if (nameInput.value === "" && commentTextarea.value !== "") {
    nameInput.classList.add("error");
    buttonElement.disabled = true;
    return;
  } else if (commentTextarea.value === "" && nameInput.value !== "") {
    commentTextarea.classList.add("error");
    buttonElement.disabled = true;
    return;
  }

  // Сохраняем имя и текст комментария
  const saveName = nameInput.value;
  const saveComment = commentTextarea.value;

  loadedComment.style.display = "block";
  buttonElement.disabled = true;

  postComments({
    name: nameInput.value,
    text: commentTextarea.value,
  })
    .then(() => {
      return fetchAndRenderComments();
    })
    .then((response) => {
      loadedComment.style.display = "none";
      buttonElement.disabled = true;
      nameInput.value = ""; // Очищаем поле ввода имени
      commentTextarea.value = ""; // Очищаем поле ввода комментария
    })
    .catch((error) => {
      buttonElement.disabled = false;

      if (error.message === "Ошибка ввода") {
        alert(
          `${nameInput.value} и ${commentTextarea.value} должны быть не короче 3 символов`
        );
      } else if (error.message === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у тебя сломался интернет, попробуй позже");
      }
      nameInput.value = saveName;
      commentTextarea.value = saveComment;
    });

  // Рендерим комменты
  renderComments();
});
