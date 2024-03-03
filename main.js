"use strict";

import { getComments } from "./api.js";
import { format } from "date-fns";
import { renderComments } from "./render.js";

const loadedPage = document.querySelector(".loaded-page");

// Массив, в который кладем комменатрии пользователей
let comments = [];

export const fetchAndRenderComments = () => {
  getComments()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          author: comment.author.name,
          text: comment.text,
          date: format(new Date(comment.date), "yyyy-MM-dd hh.mm.ss"),
          like: comment.likes,
          myLike: comment.isLiked,
        };
      });
      comments = appComments;
      renderComments({ comments, fetchAndRenderComments });
    })
    .then(() => {
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

fetchAndRenderComments();
