export function render(comments) {
  const commentsHtml = comments
    .map((comment, index) => {
      comment.text = comment.text
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>");
      // let quote_e = comment.text.replaceAll("QUOTE_END", "</div>");
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
  return commentsHtml;
}
