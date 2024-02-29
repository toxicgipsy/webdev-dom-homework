import { postComments, token } from "./api.js";
import { renderLogin } from "./login.js";

// Рендер комментариев
export const renderComments = ({ comments, fetchAndRenderComments }) => {
  const appElement = document.getElementById("app");

  const commentsHtml = comments
    .map((comment, index) => {
      comment.text = comment.text
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>");
      let activeLike;
      comment.myLike ? (activeLike = "-active-like") : false;
      return `<li class="comment">
      <div class="comment-header">
        <div>${comment.author}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" data-comment="${index}">
          ${comment.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.like}</span>
          <button data-index="${index}" class="like-button ${activeLike}"></button>
        </div>
      </div>
    </li>`;
    })
    .join("");

  const form = `<div class="add-form">
  <input id="add-name" value="" type="text" class="add-form-name" placeholder="Введите ваше имя"/>
  <textarea id="add-comment" value="" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
  <div class="add-form-row">
    <button id="add-button" class="add-form-button">Написать</button> 
  </div>
  </div>`;

  const appHtml = `
    <ul id="list" class="comments">${commentsHtml}</ul>
    <span class="loaded-comment">Коментарий добавляется</span>
    ${
      token
        ? form
        : "<a class='auth'>Чтобы добавить комментарий, авторизуйтесь</a>"
    }`;

  appElement.innerHTML = appHtml;

  const loadedComment = document.querySelector(".loaded-comment");

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
        renderComments({ comments, fetchAndRenderComments });
      });
    }
  };

  // Опция ответить на комментарий
  const editTextArea = () => {
    const editUsersComment = document.querySelectorAll(".comment-text");
    const commentTextarea = document.getElementById("add-comment");

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

  const addPost = () => {
    if (!token) {
      return;
    }

    const commentTextarea = document.getElementById("add-comment");
    const nameInput = document.getElementById("add-name");
    const buttonElement = document.getElementById("add-button");

    // Отправка сообщений по enter
    const sendMessageByClickEnter = () => {
      const sendMessage = document.getElementById("add-comment");

      sendMessage.addEventListener("keydown", (enter) => {
        if (enter.key === "Enter") {
          enter.preventDefault();
          buttonElement.click();
        }
      });
    };

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
        .then((response) => {
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
    });

    // Функция разблокировки кнопки «Написать»
    nameInput.addEventListener("input", () => {
      buttonElement.disabled = false;
    });
    commentTextarea.addEventListener("input", () => {
      buttonElement.disabled = false;
    });
    sendMessageByClickEnter();
  };

  const navigateToLogin = () => {
    if (token) {
      return;
    }
    const authBtn = document.querySelector(".auth");

    authBtn.addEventListener("click", () => {
      renderLogin();
    });
  };

  initLikeAddListener();
  editTextArea();
  addPost();
  navigateToLogin();
};
