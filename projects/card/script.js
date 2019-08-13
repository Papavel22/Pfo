$(function() {
    const versions = {
        PROTOTYPE() {
            const PageComponent = function() {
                this.init();
            };

            const Form = function(options) {
                this.init(options);
            };

            const Card = function(options) {
                this.init(options);
            };

            const Validator = function() {
                this.init();
            };

            Form.prototype = {
                init(options) {
                    this.validator = options.validator;
                    this.triggerContainer = options.triggerContainer;
                    this.elementForm = this.triggerContainer.find('.form');

                    this._bindEvents();
                },

                _bindEvents() {
                    this.elementForm
                        .on('submit', (e) => {
                            e.preventDefault();

                            if (this.validator.isValid(this.elementForm)) {
                                this.triggerContainer.trigger(
                                    'mediator:create',
                                    this.elementForm
                                        .serializeArray()
                                        .reduce((res, pair) => {
                                            res[pair.name] = pair.value;
                                            return res;
                                        }, {}),
                                );
                                this.elementForm.trigger('reset');
                            }
                        })
                        .on('keyup', () => {
                            this.validator.isValid(this.elementForm);
                        });
                },
            };

            Card.prototype = {
                init(options) {
                    this.options = options;
                    this.card = this.getCard();
                },

                getCard() {
                    return $('<div>', {
                        class: 'card ' + this.options.id,
                        html:
                            $('<div>', {
                                class: 'card-body',
                                html:
                                    $('<h4>', {
                                        class: 'card-title',
                                        text: 'Name: ' + this.options.name
                                    }).get(0).outerHTML +
                                    $('<p>', {
                                        class: 'card-text',
                                        text: 'Phone: ' + this.options.phone
                                    }).get(0).outerHTML +
                                    $('<p>', {
                                        class: 'card-text',
                                        text: 'Email: ' + this.options.mail
                                    }).get(0).outerHTML +
                                    $('<p>', { class: 'card-text', text: 'Age: ' + this.options.age }).get(0).outerHTML
                            }),
                    });
                },
            };

            PageComponent.prototype = {
                cards: [],
                init() {
                    this.container = $('.container');
                    this.cardsContainer = $('.cardsStacked');
                    new Form({
                        validator: new Validator(),
                        triggerContainer: this.container,
                    });
                    this._bindEvents();
                },

                _bindEvents() {
                    this.container.on('mediator:create', (e, options) => {
                        this.cards[options.id] = new Card(options);
                        this.cardsContainer.append(this.cards[options.id].card);
                    });
                },
            };

            Validator.prototype = {
                init() {
                    this._initDependency();
                },

                _initDependency() {
                    const Rules = function() {};
                    const Highlighter = function() {};
                    const Composer = function(options) {
                        this.init(options);
                    };

                    Rules.prototype = {
                        regEx: {
                            phonePattern: /^\+?(38)?(\d{10,11})$/,
                            mailPattern: /^(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})$/,
                            passwordPattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                        },
                        required(str) {
                            return str.length ? null : 'This field is required';
                        },
                        minLength(str) {
                            return str.length >= 2 ? null : 'Minimum length 2 characters';
                        },
                        maxLength(str) {
                            return str.length <= 128 ? null : 'Maximum length 128 characters';
                        },
                        phone(str) {
                            return this.regEx.phonePattern.test(str) ? null : 'Should be valid Phone';
                        },
                        mail(str) {
                            return this.regEx.mailPattern.test(str) ? null : 'Should be valid Email';
                        },
                        password(str) {
                            return this.regEx.passwordPattern.test(str) ? null : 'Should be valid Password';
                        },
                        // confirm_password(str, pass) {
                        //     return str === pass ? null : 'These passwords don\'t match';
                        // },
                        age(num) {
                            return (num >= 0 && num <= 100) ? null : 'Should be from 0 to 100 years';
                        },
                    };

                    Highlighter.prototype = {
                        highlight(input, error) {
                            input.next('.error-message').remove();
                            error ? this.onError(input, error) : this.onSuccess(input);
                        },

                        onError(input, error) {
                            input.addClass('error');
                            $('<p>', { class: `error-message`, text: error }).insertAfter(input);
                        },

                        onSuccess(input) {
                            input.removeClass('error');
                        }
                    };

                    Composer.prototype = {
                        init(options) {
                            this.rules = options.rules;
                        },
                        name(str) {
                            return (this.rules.required(str) ||  this.rules.minLength(str) || this.rules.maxLength(str));
                        },
                        phone(str) {
                            return (this.rules.required(str) || this.rules.phone(str));
                        },
                        mail(str) {
                            return (this.rules.required(str) || this.rules.mail(str));
                        },
                        password(str) {
                            return (this.rules.required(str) || this.rules.password(str));
                        },
                        // confirm_password(str, pass) {
                        //     return (this.rules.required(str) || this.rules.confirm_password(str, pass));
                        // },
                        age(num) {
                            return this.rules.age(num);
                        }
                    };

                    this.composer = new Composer({ rules: new Rules() });
                    this.highlighter = new Highlighter();
                },

                isValid(form) {
                    return !form
                        .serializeArray()
                        .map(data => {
                            const input = form.find(`[name=${data.name}]`);
                            const rule = this.composer[data.name];

                            if (rule && input.length) {
                                const error = rule.bind(this.composer)(data.value || '');

                                this.highlighter.highlight(input, error);
                                return error;
                            }
                        })
                        .find(err => !!err);
                },
            };

            new PageComponent();
        },

        ES5() {
        },

        ES6() {
        },
    };

    versions.PROTOTYPE();
});

