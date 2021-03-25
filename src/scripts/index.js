
import '../styles/index.scss';

import {
    Archive
} from 'libarchive.js/main.js';

import {
    v4 as uuidv4
} from 'uuid';

const textarea = document.getElementById('fileOutput');
const fileInput = document.getElementById('fileInput');
const treeView = document.getElementById('treeView');

Archive.init({
    workerUrl: 'public/worker-bundle.js',
});

if (location.href.split('?archiveUrl=')[1]) {
    fetch(location.href.split('?archiveUrl=')[1]).then(response => {
            return response.blob();
        })
        .then(async (blob) => {
            const archive = await Archive.open(blob);
            let obj = await archive.extractFiles();
            treeView.innerHTML = '';
            walk({
                node: obj,
                liId: 'treeView',
                name: 'externalArchive'
            });
            openFirstFolder();
        });
}

fileInput.addEventListener('change', async (e) => {
    const file = e.currentTarget.files[0];
    const archive = await Archive.open(file);
    let obj = await archive.extractFiles();
    treeView.innerHTML = '';
    walk({
        node: obj,
        liId: 'treeView',
        name: file.name
    });
    openFirstFolder();
});

function walk({
    node,
    liId,
    name
}) {
    const root = document.getElementById(liId);
    if (!(node instanceof File)) {
        const newUlId = uuidv4();
        const newUl = document.createElement('ul');
        newUl.classList.add('nested');
        newUl.id = newUlId;
        const newLi = document.createElement('li');
        root.appendChild(newLi);
        newLi.classList.add('folder');
        newLi.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            newLi.childNodes.forEach(c => {
                if (c.classList.contains('nested')) {
                    c.classList.toggle("active");
                }
            });
        });

        const span = document.createElement('span');
        span.innerText = name;
        newLi.appendChild(span);
        newLi.appendChild(newUl);
        const keys = Object.keys(node);
        if (keys.length > 0) {
            keys.forEach((key) => {
                walk({
                    node: node[key],
                    liId: newUlId,
                    name: key
                });
            });
        } else {
            const span = document.createElement('span');
            span.innerHTML = '<i>Empty folder</i>';
            root.appendChild(span);
        }
    } else {
        const li = document.createElement('li');
        li.innerText = node.name;
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            const reader = new FileReader();
            reader.onload = function(event) {
                if (isASCII(event.target.result)){
                    textarea.textContent = event.target.result;    
                } else {
                    textarea.textContent = "Sorry, we cannot display binary files";
                }
            };
            reader.readAsText(node);
        });
        root.appendChild(li);
    }
}

function openFirstFolder() {
    const firstFolder = treeView.querySelector('.folder');
    firstFolder.click();
}

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}