const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const code = scriptMatch[1];
    try {
        new Function(code);
        console.log("No syntax errors in JS!");
    } catch (e) {
        console.log("Syntax error in JS: ", e);
    }
}
