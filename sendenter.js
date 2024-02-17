export function sendCommentsEnter(sendMessage, buttonElement) {
    return sendMessage.addEventListener("keydown", (enter) => {
        if (enter.key === "Enter") {
          enter.preventDefault();
          buttonElement.click();
        }
      });
}