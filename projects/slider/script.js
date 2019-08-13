$(function() {
    const versions = {
        PROTOTYPE() {
            const Slider = function() {
                this.init();
            };

            Slider.prototype = {
                settings: {
                    timeout: 1000,
                    slideWidth: 500,
                },
                slide: 0,
                direction: 1,
                timer: null,
                animateEnd: true,
                isStoped: false,

                init() {
                    this.container = $('.container');
                    this.lent = this.container.find('.slider');
                    this.pagination = this.container.find('.pagination');
                    this.slides = this.lent.find('li');
                    this.MAX_SLIDES = this.slides.length;
                    this.next();
                    this._generatePagination();
                    this._bindEvents();
                },

                next() {
                    this.timer = setTimeout(() => {
                        this.slide = this._getNext();

                        this.goTo(this.slide);
                    }, this.settings.timeout);
                },

                goTo(index) {
                    this.lent.animate(
                        { 'marginLeft': -this.settings.slideWidth * index },
                        this.settings.timeout,
                        () => {
                            this.animateEnd = true;
                            this._setActive();
                            if (!this.isStoped){
                                this.next();
                            }
                        }
                    );
                },

                _setActive() {
                    const pagers = this.pagination.find('li');

                    pagers.removeClass('active');
                    pagers.eq(this.slide).addClass('active');
                },

                _generatePagination() {
                    for (let i = 0; i < this.MAX_SLIDES; i++) {
                        this.pagination.append(
                            $('<li>', {
                                text: i + 1,
                                'data-index': i,
                                class: i === 0 ? 'active' : '',
                            })
                        );
                    }
                },

                _getNext() {
                    const nextIndex = this.slide + this.direction;

                    if (nextIndex >= this.MAX_SLIDES) {
                        return 0;
                    } else if (nextIndex < 0) {
                        return this.MAX_SLIDES - 1;
                    }

                    return nextIndex;
                },

                _bindEvents() {
                    this.container.on('click', '.pagination li', (e) => {
                        const index = $(e.target).data('index');
                        this._stop();
                        this.direction = this.slide > index ? -1 : 1;
                        this.slide = index;
                        this.goTo(index);
                    });

                    this.container.on('click', '.left', () => {
                        if (this.animateEnd) {
                            this.animateEnd = false;
                            this._stop();
                            this.direction = -1;
                            this.slide = this._getNext();
                            this.goTo(this.slide);
                        }
                    });

                    this.container.on('click', '.right', () => {
                        if (this.animateEnd) {
                            this.animateEnd = false;
                            this._stop();
                            this.direction = 1;
                            this.slide = this._getNext();
                            this.goTo(this.slide);
                        }
                    });

                    this.container.on('click', '.slide', () => {
                        if (this.isStoped) {
                            this.next();
                        } else {
                            clearTimeout(this.timer);
                        }

                        this.isStoped = !this.isStoped;
                    });
                },

                _stop() {
                    clearTimeout(this.timer);
                    this.lent.stop();
                }
            };

            new Slider();
        },

        ES5() {
            var settings = {
                timeout: 1000,
                slideWidth: 500,
            };
            var slide = 0;
            var direction = 1;
            var timer = null;
            var animateEnd = true;
            var isStoped = false;

            var container = $('.container');
            var lent = container.find('.slider');
            var pagination = container.find('.pagination');
            var slides = lent.find('li');
            var MAX_SLIDES = slides.length;

            next();
            generatePagination();
            bindEvents();

            function next() {
                timer = setTimeout(() => {
                    slide = getNext();

                    goTo(slide);
                }, settings.timeout);
            }

            function goTo(index) {
                lent.animate(
                    { 'marginLeft': -settings.slideWidth * index },
                    settings.timeout,
                    function() {
                        animateEnd = true;
                        setActive();
                        if (!isStoped){
                            next();
                        }
                    }
                );
            }

            function setActive() {
                var pagers = pagination.find('li');

                pagers.removeClass('active');
                pagers.eq(slide).addClass('active');
            }

            function generatePagination() {
                for (var i = 0; i < MAX_SLIDES; i++) {
                    pagination.append(
                        $('<li>', {
                            text: i + 1,
                            'data-index': i,
                            class: i === 0 ? 'active' : '',
                        })
                    );
                }
            }

            function getNext() {
                var nextIndex = slide + direction;

                if (nextIndex >= MAX_SLIDES) {
                    return 0;
                } else if (nextIndex < 0) {
                    return MAX_SLIDES - 1;
                }

                return nextIndex;
            }

            function bindEvents() {
                container.on('click', '.pagination li', function(e) {
                    var index = $(e.target).data('index');
                    stop();
                    direction = slide > index ? -1 : 1;
                    slide = index;
                    goTo(index);
                });

                container.on('click', '.left', function() {
                    if (animateEnd) {
                        animateEnd = false;
                        stop();
                        direction = -1;
                        slide = getNext();
                        goTo(slide);
                    }
                });

                container.on('click', '.right', function() {
                    if (animateEnd) {
                        animateEnd = false;
                        stop();
                        direction = 1;
                        slide = getNext();
                        goTo(slide);
                    }
                });

                container.on('click', '.slide', function() {
                    if (isStoped) {
                        next();
                    } else {
                        clearTimeout(timer);
                    }

                    isStoped = !isStoped;
                });
            }

            function stop() {
                clearTimeout(timer);
                lent.stop();
            }
        },

        ES6() {

            class Slider {
                settings = {
                    timeout: 1000,
                    slideWidth: 500,
                };
                slide = 0;
                direction = 1;
                timer = null;
                animateEnd = true;
                isStoped = false;

                constructor() {
                    this.container = $('.container');
                    this.lent = this.container.find('.slider');
                    this.pagination = this.container.find('.pagination');
                    this.slides = this.lent.find('li');
                    this.MAX_SLIDES = this.slides.length;

                    this.next();
                    this._generatePagination();
                    this._bindEvents();
                };

                next() {
                    this.timer = setTimeout(() => {
                        this.slide = this._getNext();

                        this.goTo(this.slide);
                    }, this.settings.timeout);
                };

                goTo(index) {
                    this.lent.animate(
                        { 'marginLeft': -this.settings.slideWidth * index },
                        this.settings.timeout,
                        () => {
                            this.animateEnd = true;
                            this._setActive();
                            if (!this.isStoped){
                                this.next();
                            }
                        }
                    );
                };

                _setActive() {
                    const pagers = this.pagination.find('li');

                    pagers.removeClass('active');
                    pagers.eq(this.slide).addClass('active');
                };

                _generatePagination() {
                    for (let i = 0; i < this.MAX_SLIDES; i++) {
                        this.pagination.append(
                            $('<li>', {
                                text: i + 1,
                                'data-index': i,
                                class: i === 0 ? 'active' : '',
                            })
                        );
                    }
                };

                _getNext() {
                    const nextIndex = this.slide + this.direction;

                    if (nextIndex >= this.MAX_SLIDES) {
                        return 0;
                    } else if (nextIndex < 0) {
                        return this.MAX_SLIDES - 1;
                    }

                    return nextIndex;
                };

                _bindEvents() {
                    this.container.on('click', '.pagination li', (e) => {
                        const index = $(e.target).data('index');
                        this._stop();
                        this.direction = this.slide > index ? -1 : 1;
                        this.slide = index;
                        this.goTo(index);
                    });

                    this.container.on('click', '.left', () => {
                        if (this.animateEnd) {
                            this.animateEnd = false;
                            this._stop();
                            this.direction = -1;
                            this.slide = this._getNext();
                            this.goTo(this.slide);
                        }
                    });

                    this.container.on('click', '.right', () => {
                        if (this.animateEnd) {
                            this.animateEnd = false;
                            this._stop();
                            this.direction = 1;
                            this.slide = this._getNext();
                            this.goTo(this.slide);
                        }
                    });

                    this.container.on('click', '.slide', () => {
                        if (this.isStoped) {
                            this.next();
                        } else {
                            clearTimeout(this.timer);
                        }

                        this.isStoped = !this.isStoped;
                    });
                };

                _stop() {
                    clearTimeout(this.timer);
                    this.lent.stop();
                }
            }

            new Slider();
        },

    };

    versions.ES6();
});