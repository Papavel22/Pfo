$(function() {
    const Pfo = function() { this.init(); };

    Pfo.prototype = {
        init() {
            this.container = $('#pfo');
            this.navBar = new window.components.NavBar({ container: this.container });
            this.sideBar = new window.components.SideBar({ container: this.container });
            this.content = new window.components.Content({ container: this.container });
            this._bindEvents();
        },
        _bindEvents() {
            this.container
                .on('sidebar:click:logo', () => {
                    this.content.showInvite();
                    this.navBar.hideButtons();
                })
                .on('sidebar:click:tab', (e, name) => {
                    this.content.loadMapping(name);
                    this.navBar.showButtons();
                })
                .on('navbar:click:html', () => this.content.onClickHtml())
                .on('navbar:click:css', () => this.content.onClickCss())
                .on('navbar:click:js', () => this.content.onClickJs())
                .on('navbar:click:run', () => this.content.onClickRun())
        },
    };

    new Pfo();
});