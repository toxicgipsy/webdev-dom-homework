export function getDateComment(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Добавляем ко дня +1, у месяцев отчет с 0
  const year = date.getFullYear().toString().slice(-2); // Отнимаем у года первые 2 цифры
  const hours = date.getHours().toString().padStart(2, "0"); // Добавляем строку 0, чтобы время было 00:00, а не 0:00
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
