const extractImageUrls = (markdown: string): string[] => {
  const regex = /<img src="([^"]*)" \/>/g;
  const urls = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }

  return urls;
};

export const MarkdownHelpers = {
  extractImageUrls,
};
