const fs = require('fs');

let titles = {};
try {
    titles = JSON.parse(fs.readFileSync('./images/titles.json', 'utf8'));
} catch (e) {
    titles = {};
}

fs.readdir('./images', (err, files) => {
    files = files
        .filter(file => !/\.(js|json|txt|md)$/i.test(file))
        .sort();
    const list = files.map(file => ({
        title: titles[file] || file.split('.').slice(0, -1).join('.').replace(/-/g, ' '),
        file,
    }));
    let json = JSON.stringify({images:list}, null, 4);
    fs.writeFileSync('./images/images.json', json);
});
