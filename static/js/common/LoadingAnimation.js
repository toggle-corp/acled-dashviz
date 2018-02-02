class LoadingAnimation extends Element {
    constructor() {
        super(`
            <div class="loading-animation" hidden>
                <span class="fa fa-circle-o-notch fa-spin"></span>
            </div>
        `);
    }

    show() {
        if (this.element) {
            this.element.show();
        }
    }

    hide() {
        if (this.element) {
            this.element.hide();
        }
    }
}
