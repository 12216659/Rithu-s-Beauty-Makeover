const fs = require('fs');

const transcriptPath = 'C:\\\\Users\\\\hp\\\\.gemini\\\\antigravity\\\\brain\\\\d05b9901-4a01-41da-84fb-99adc7ce611c\\\\.system_generated\\\\logs\\\\transcript_full.jsonl';
const targetPath = 'c:\\\\Users\\\\hp\\\\OneDrive\\\\Desktop\\\\Rithu’s Beauty Makeover\\\\client\\\\public\\\\logo.png';

const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');
let found = false;

for(let line of lines) {
    if (line.includes('data:image/png;base64,')) {
        const match = line.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
        if (match && match[1]) {
            const base64Data = match[1];
            fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
            found = true;
            break;
        }
    }
}

if (found) {
    console.log('Logo successfully extracted and saved to ' + targetPath);
} else {
    console.log('Logo base64 string not found in transcript.');
}
