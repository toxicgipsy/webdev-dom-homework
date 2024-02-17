export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/aman_arazmedov/comments", {
    method: "GET",
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Сервер упал");
    }
  });
}

export function postComments({ name, text }) {
  return fetch("https://wedev-api.sky.pro/api/v1/aman_arazmedov/comments", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      text: text,
      forceError: false, // По умолчанию ошибка 500 выключена
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
