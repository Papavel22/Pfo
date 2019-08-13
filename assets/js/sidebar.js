window.components = window.components || {};
window.components.SideBar = function(options) { this.init(options) };
window.components.SideBar.prototype = {
    init(options) {
        this.eventsContainer = options.container;
        this.container = options.container.find('#pfo-sidebar');
        this.tabsContainer = this.container.find('.nav-stacked');
        this.logo = this.container.find('.logo');
        this._bindEvents();
        api.getMap().then(tabsData => tabsData.forEach(data => this.tabsContainer.append(this.renderTab(data))));
    },

    _bindEvents() {
        this.logo.on('click', () => this.eventsContainer.trigger('sidebar:click:logo'));
        this.container.on('click', '.project',
            e => this.eventsContainer.trigger('sidebar:click:tab', e.target.parentElement.dataset.id),
        );
    },

    renderTab(data) {
        const link = $('<a>', { text: data.title });
        const element = $('<li>', { class: 'project', 'data-id': data.title });
        element.append(link);
        return element;
    },
};
