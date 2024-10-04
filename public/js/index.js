let app = document.getElementById('app');


// load template file
const loadTemplate = () => {
    fetch ('./template.html')
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const scripts = doc.getElementsByTagName('script');

        for(let script of scripts) {
            const newScript = document.createElement('script');
            newScript.innerHTML = script.innerHTML;
            console.log(newScript.innerHTML);
            document.body.appendChild(newScript);
        }
        app.innerHTML = html;
    })
}
loadTemplate();