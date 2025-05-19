/**
 * Utility functions for cleaning up code before export
 */

// Remove all types of comments from code
export const removeComments = (code) => {
  if (!code) return code;
  
  return code
    // Remove single-line comments
    .replace(/\/\/[^\n]*(?:\n|$)/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

// Remove comments from JavaScript/JSX code
export const cleanJavaScript = (code) => {
  return removeComments(code)
    // Remove console.log statements
    .replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, '')
    // Remove debugger statements
    .replace(/debugger;/g, '');
};

// Remove comments from CSS
export const cleanCSS = (code) => {
  return removeComments(code)
    // Remove empty rules, but keep rules with !important
    .replace(/[^{}]*{\s*}(?!\s*!important)/g, '')
    // Normalize whitespace in rules, but preserve !important
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    // Preserve !important declarations
    .replace(/\s*!\s*important/g, ' !important');
};

// Remove comments from HTML
export const cleanHTML = (code) => {
  return removeComments(code)
    // Remove empty lines
    .replace(/^\s*[\r\n]/gm, '')
    // Normalize whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove whitespace around attributes
    .replace(/\s+=/g, '=')
    .replace(/=\s+/g, '=');
}; 