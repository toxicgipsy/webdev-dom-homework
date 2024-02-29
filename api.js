const commentsURL = "https://wedev-api.sky.pro/api/v2/aman_arazmedov/comments";
const commentsLogin = "https://wedev-api.sky.pro/api/user/login";

export let token;

export const setToken = (newToken) => {
  token = newToken;
};

export function getComments() {
  return fetch(commentsURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Сервер упал");
    }
  });
}

export function postComments({ name, text }) {
  return fetch(commentsURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      text: text,
      forceError: false, // выкл
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Ошибка ввода");
    } else {
      throw new Error("Сервер упал");
    }
  });
}

export function login({ login, password }) {
  return fetch(commentsLogin, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Ошибка ввода");
    } else {
      throw new Error("Сервер упал");
    }
  });
}
