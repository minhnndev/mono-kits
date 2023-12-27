/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */

class Subject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        observer && this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter((item) => item !== observer);
    }

    notify(newState) {
        this.observers.forEach((observer) => {
            if (typeof observer === 'function') {
                observer(newState);
            } else {
                observer.updateData && observer.updateData(newState);
            }
        });
    }
}

class ObserverInstance {
    constructor(props) {
        this.props = props;
    }

    remove() {
        const { detach, observer } = this.props;
        detach && detach(observer);
    }
}

export default class Observer {
    static SCHEMA = 'Observer';

    static instances = {};

    constructor(props) {
        this.schema = props.schema;
        this.subject = new Subject();
        this.data = null;
        this.loaded = false;
        this.initilize();
    }

    static getInstance(schema, Class = Observer) {
        schema = schema || Class.SCHEMA;
        let instance = Observer.instances[schema];
        if (!instance) {
            instance = new Class({ schema });
            Observer.instances[schema] = instance;
        }
        return instance;
    }

    initilize = () => {
    }

    notify = (state) => {
        this.subject.notify(state);
    }

    attach = (observer) => {
        this.subject.attach(observer);
        return new ObserverInstance({ observer, detach: this.detach });
    }

    detach = (observer) => {
        this.subject.detach(observer);
    }
}
