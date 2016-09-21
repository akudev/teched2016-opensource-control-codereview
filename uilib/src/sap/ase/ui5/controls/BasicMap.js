// Provides control sap.ase.ui5.controls.Map.
/*globals sap, ol*/
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/HTML', './lib/ol'],
	function(jQuery, library, Control, HTMLControl) {
	"use strict";

	//see http://openlayers.org/en/v3.0.0/examples
	//see http://openlayers.org/en/v3.0.0/apidoc

	/**
	 * Constructor for a new Map.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A simple Map.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version @version@
	 *
	 * @constructor
	 * @public
	 * @alias sap.ase.ui5.controls.BasicMap
	 */
	var MapCtrl = Control.extend('sap.ase.ui5.controls.BasicMap', {

		metadata: {
			properties: {
				width : {type: "sap.ui.core.CSSSize", defaultValue: "500px"},
				height : {type: "sap.ui.core.CSSSize", defaultValue: "500px"},
				zoom : {type: "int", defaultValue: 16}
			},

			aggregations: {
				"_map": {type: "sap.ui.core.HTML", visibility: "hidden", multiple: false},
				"center": {type: "sap.ase.ui5.controls.MapPOI", multiple: false}
			}
		},

		init : function(){
			this.setAggregation("_map",
				new HTMLControl({
					id : this.getId() + "-map" ,
					content : "<div class='sapAseUI5CtrlMapMap' tabindex='0'></div>"
				})
			);
		},

		setZoom : function(iZoom){
			this.setProperty("zoom", iZoom, true);
			if (this._map) {
				this._map.getView().setZoom(iZoom);
			}
			return this;
		},
		setCenter : function(oCenter){
			this.setAggregation("center", oCenter, true);
			if (this._map) {
				this._map.getView().setCenter(this.getCenter()._getCoordinateForMap());
			}
			return this;
		},

		renderer: function(oRm, oCtrl) {
			oRm.write("<div");
			oRm.writeControlData(oCtrl);
			oRm.addClass("sapAseUI5CtrlMap");
			oRm.writeClasses();
			oRm.addStyle("width", oCtrl.getWidth());
			oRm.addStyle("height", oCtrl.getHeight());
			oRm.writeStyles();
			oRm.write(">");

			oRm.renderControl(oCtrl.getAggregation("_map"));

			oRm.write("</div>");
		},

		onAfterRendering : function() {
			if (!this._map) {
				this._map = new ol.Map({
					target: this.getId() + "-map",
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						})
					],
					view: new ol.View({
						center: this.getCenter()._getCoordinateForMap(),
						zoom: this.getZoom()
					})
				});
			}
			
			this._map.getView().on("change:resolution", function(oEvent){
				this.setZoom(this._map.getView().getZoom(), false, true);
			}, this);
		}
	});

	return MapCtrl;

}, /* bExport= */ true);
