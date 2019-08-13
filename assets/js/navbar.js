window.components = window.components || {};
window.components.NavBar = function(options) { this.init(options) };
window.components.NavBar.prototype = {
    DELAY: 500,
    init(options) {
        this.eventsContainer = options.container;
        this.container = options.container.find('#pfo-nvbar');
        this.btnHtml = this.container.find('.btn-html');
        this.btnCss = this.container.find('.btn-css');
        this.btnJs = this.container.find('.btn-js');
        this.btnRun = this.container.find('.btn-run');
        this._bindEvents();
    },

    _bindEvents() {
        this.btnHtml.on('click', () => this.eventsContainer.trigger('navbar:click:html'));
        this.btnCss.on('click', () => this.eventsContainer.trigger('navbar:click:css'));
        this.btnJs.on('click', () => this.eventsContainer.trigger('navbar:click:js'));
        this.btnRun.on('click', () => this.eventsContainer.trigger('navbar:click:run'));
    },

    hideButtons() {
        this.container.hide(this.DELAY);
    },

    showButtons() {
        this.container.show(this.DELAY);
    },
};
