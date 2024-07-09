function extractId(url) {
    const regex = /\/(\d+)(\?|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  export { extractId}