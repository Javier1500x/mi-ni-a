'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function remove(target) {
	if (!fs.existsSync(target)) return;
	const stat = fs.lstatSync(target);
	if (stat.isDirectory()) {
		fs.readdirSync(target).forEach((name) => remove(path.join(target, name)));
		fs.rmdirSync(target);
	} else {
		fs.unlinkSync(target);
	}
}

function copyFile(from, to) {
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.copyFileSync(from, to);
}

function copyDirectory(from, to) {
	fs.mkdirSync(to, { recursive: true });
	fs.readdirSync(from).forEach((name) => {
		const source = path.join(from, name);
		const destination = path.join(to, name);
		if (fs.lstatSync(source).isDirectory()) {
			copyDirectory(source, destination);
		} else {
			fs.copyFileSync(source, destination);
		}
	});
}

remove(dist);
fs.mkdirSync(dist, { recursive: true });

copyFile(path.join(root, 'build.html'), path.join(dist, 'index.html'));
copyDirectory(path.join(root, 'images'), path.join(dist, 'images'));
['wall.jpg', 'floor.jpg'].forEach((name) => {
	copyFile(path.join(root, 'res', name), path.join(dist, 'res', name));
});

console.log('Sitio preparado en dist/');
