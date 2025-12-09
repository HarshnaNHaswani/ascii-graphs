// Helper function to replace regular spaces with non-breaking spaces
export const NBSP = "\u00A0";

export const replaceSpaces = (str: string): string => {
  return str.replace(/ /g, NBSP);
};

// Helper function to escape HTML entities
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
