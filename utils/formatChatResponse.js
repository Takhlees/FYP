export function cleanText(text) {
  let decodedText = text
    .replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .replace(/\\\\/g, "\\");

  return decodedText
    .replace(/\\/g, "") // Remove **
    .replace(/\*/g, "") // Remove *
    .replace(/\n{3,}/g, "\n\n") // Replace 3 or more newlines with 2
    .trim();
}

export function formatMessage(text) {
  const cleanedText = cleanText(text);
  const paragraphs = cleanedText.split(/\n\n/);

  const formattedParagraphs = paragraphs.map((paragraph) => {
    const lines = paragraph.split("\n").map((line) => {
      if (/^[^\n:]+:\s*$/.test(line.trim())) {
        return `<b>${line.trim()}</b>`;
      }
      return line;
    });

    const transformed = lines.join("\n");

    if (/^\d+\.\s/.test(transformed)) {
      const items = transformed.split(/\n/);
      return `<ol class="numbered-list">${items
        .map((item) => `<li>${item.replace(/^\d+\.\s/, "")}</li>`)
        .join("")}</ol>`;
    }

    if (/^\s*\*\s/.test(transformed) || /^\s{3}/.test(transformed)) {
      const items = transformed.split(/\n/);
      return `<ul class="bullet-list">${items
        .map((item) => {
          if (/^\s{4}\*\s/.test(item) || /^\s{6}/.test(item)) {
            return `<li class="nested-item">${item.replace(
              /^\s{4}\*\s|^\s{6}/,
              ""
            )}</li>`;
          }
          return `<li>${item.replace(/^\s*\*\s|^\s{3}/, "")}</li>`;
        })
        .join("")}</ul>`;
    }

    return `<p>${transformed.replace(/\n/g, "<br>")}</p>`;
  });

  return formattedParagraphs.join("");
}
