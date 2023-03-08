// requires poppler to be installed (brew install poppler) - it includes the pdftotext binary
import extract from 'pdf-text-extract';
import path from 'path';
import fs from 'fs';


const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(__dirname, './data/');
const textPath = dataPath.replace("/data/", "/text/");

if(!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, {recursive: true});
if(!fs.existsSync(textPath)) fs.mkdirSync(textPath, {recursive: true});

const convertPDF = async (filePath) => {
    const text = await extract(filePath, { splitPages: false }, (err, text) => {
       // console.log(text);
        fs.writeFileSync(filePath.replace("/data/", "/text/").replace(/\.pdf$/, '.txt'), text.join(''));
    });
};

fs.readdir(dataPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach((file) => {
        if (path.extname(file) === '.pdf') {
            console.log(`path: ${path.join(dataPath, file)}`);
            convertPDF(path.join(dataPath, file))
                .then(() => console.log(`Converted ${file} to text.`))
                .catch((err) => console.error(`Failed to convert ${file} to text: ${err}`));
        }
    });
});
