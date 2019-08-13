window.api = {
    getMap: () => $.get('projects/map.json'),
    getProject: name => Promise.all(
        [
            $.get(`projects/${name}/index.html`),
            $.get(`projects/${name}/style.css`),
            $.get(`projects/${name}/script.js`),
        ],
    ),
};