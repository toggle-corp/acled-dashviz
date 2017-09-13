class MapScale {
    constructor(map) {
        let that = this;
        this.control = L.control({'position': 'bottomright'}); 
         
        this.control.onAdd = function() {
            this.container = L.DomUtil.create('div', 'info map-scale');
            this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            this.container.style.padding = '0 10px';
            this.container.style.border = '1px solid rgba(0, 0, 0, 0.1)';
            that.updateControl(this);
            return this.container;
        };

        this.map = map;
        this.control.addTo(map);
    }

    updateControl() {
        // TODO: set to 10, 100, 500, 1500
        let circleRadii = [
            8.289306334778566,
            16.57861266955713,
            22.37258915431989,
            26.327593393525085,
        ];
        // let zoomLevel = this.map.getZoom();
        let scaleLabels = circleRadii.map(d => getEventCountFromMapCircleRadius(d/2));
         
        this.control.container.innerHTML = '<h5>No. of events</h5>';
        for (let i = 0; i < circleRadii.length; i++) {
            this.control.container.innerHTML += `<div><label>${scaleLabels[i]}</label><span style="width: ${circleRadii[i]}px; height: ${circleRadii[i]}px;"></span></div>`; 
        }
    }
}
