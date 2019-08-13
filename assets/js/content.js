window.components = window.components || {};
window.components.Content = function(options) { this.init(options) };
window.components.Content.prototype = {
    DELAY: 500,
    current: {},

    init(options) {
        this.container = options.container.find('#pfo-content');
        this.codeWrapper = this.container.find('.scroll-container pre');
        this.inviteTpl = this.container.find('.invite');
        // this._bindEvents();
    },
        renderHighlightedText(text) {
        const code = $('<code>', { text });

        hljs.highlightBlock(code[0]);
        this.codeWrapper.html('').append(code);
        this.showCode();
    },

    loadMapping(name) {
        api.getProject(name).then(data => {
            this.current = {
                eHtml: data[0],
                eCss: data[1],
                eJs: data[2],
            };
            this.renderHighlightedText(this.current.eHtml);
        });
    },

    onClickHtml() {
        this.renderHighlightedText(this.current.eHtml);
    },

    onClickCss() {
        this.renderHighlightedText(this.current.eCss);
    },

    onClickJs() {
        this.renderHighlightedText(this.current.eJs);
    },

    onClickRun() {
        const projectHtml = $(this.current.eHtml).filter('.container');
        const projectCss = $('<style>', { text: this.current.eCss });
        const projectJs = $('<script>', { text: this.current.eJs });

        projectHtml.append(projectCss);
        projectHtml.append(projectJs);
        this.codeWrapper.html('').append(projectHtml);
        this.showCode();
        this.container.removeClass('light').addClass('dark');
    },

    showInvite() {
        this.inviteTpl.show(this.DELAY);
        this.codeWrapper.hide(this.DELAY);
        this.container.removeClass('light dark');
    },

    showCode() {
        this.inviteTpl.hide(this.DELAY);
        this.codeWrapper.show(this.DELAY);
        this.container.removeClass('dark').addClass('light');
    },
};
