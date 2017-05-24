class Element {
    constructor(element=null) {
        this.childElements = [];
        this.element = $(element);
    }
    initDom(parent) {
        if(this.element && parent && parent.element ){
            this.element.appendTo(parent.element);
        }
    }
    initDomAll(parent) {
        if(this.element == null) {
            return;
        }
        this.initDom(parent);

        for (let i=0; i<this.childElements.length; i++) {
            this.childElements[i].initDomAll(this);
        }
    }
    process(){}
    processAll(){
        this.process();

        for (let i=0; i<this.childElements.length; i++) {
            this.childElements[i].processAll();
        }
    }
    render(){}
}
