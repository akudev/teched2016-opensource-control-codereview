// Provides control sap.ase.ui5.controls.Map.
/*globals sap, ol*/
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/HTML', './MapPOI', './lib/ol'],
	function(jQuery, library, Control, HTMLControl, MapPOI) {
	"use strict";

	var iZoomMin = 0;
	var iZoomMax = 20;
	var iZoomDefault = 15;

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
	 * @alias sap.ase.ui5.controls.Map
	 */
	var MapCtrl = Control.extend('sap.ase.ui5.controls.MapMarkers', {

		metadata: {
			properties: {
				zoom : {type: "int", defaultValue: iZoomDefault},
				width : {type: "sap.ui.core.CSSSize", defaultValue: "500px"},
				height : {type: "sap.ui.core.CSSSize", defaultValue: "500px"}
			},

			aggregations: {
				"_map": {type: "sap.ui.core.HTML", multiple: false, visibility: "hidden"},
				"_defaultCenter": {type: "sap.ase.ui5.controls.MapPOI", multiple: false, visibility: "hidden"},
				"center": {type: "sap.ase.ui5.controls.MapPOI", multiple: false},
				"markers": {type: "sap.ase.ui5.controls.MapPOI", multiple: true}
			}
		},
		
		init : function(){
			var that = this;
			this.setAggregation("_defaultCenter", new MapPOI(this.getId() + "-defaultCenter"));
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
		
		_getCenter : function(){
			return this.getCenter() || this.getAggregation("_defaultCenter");
		},

		setCenter : function(oCenter){
			this.setAggregation("center", oCenter, true);
			if (oCenter) {
				this.getAggregation("_defaultCenter").setProperty("long", oCenter.getLong(), true);
				this.getAggregation("_defaultCenter").setProperty("lat", oCenter.getLat(), true);
			}
			if (this._map) {
				this._map.getView().setCenter(this._getCenter()._getCoordinateForMap());
			}
			return this;
		},

		invalidate : function(oOrigin){
			if (oOrigin && oOrigin === this.getCenter()) {
				this.setCenter(this.getCenter());
			} else if (oOrigin != this.getAggregation("_defaultCenter")){
				sap.ui.core.Control.prototype.invalidate.apply(this, arguments);
			}
		},

		onBeforeRendering : function() {
			if (this._map) {
				var oOverlays = this._map.getOverlays();
				var iLen = oOverlays.getLength();
				for (var i = iLen - 1; i >= 0; i--) {
					this._map.removeOverlay(oOverlays.item(i));
				}
			}
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
			
			var aMarkers = oCtrl.getMarkers();
			var sTooltip;

			for (var i = 0; i < aMarkers.length; i++) {
				sTooltip = aMarkers[i].getTooltip_AsString();
				oRm.write("<div");
				oRm.writeElementData(aMarkers[i]);
				oRm.addClass("sapAseUI5CtrlMapMarker");
				oRm.writeClasses();
				if (sTooltip) {
					oRm.writeAttributeEscaped("title", sTooltip);
				}
				oRm.write(">");
				oRm.writeIcon(aMarkers[i].getIcon());
				oRm.write("</div>");
			}

			oRm.write("</div>");
		},

		onAfterRendering : function() {
			if (!this._map) {
				this._map = new ol.Map({
					view: new ol.View({
						center : this._getCenter()._getCoordinateForMap(),
						zoom : this.getZoom(),
						maxZoom : iZoomMax
					}),
					layers: [ new ol.layer.Tile({source: new ol.source.OSM()}) ],
					controls : [ new ol.control.Attribution() ],
					target: this.getId() + "-map"
				});

				this._map.getView().on("change:resolution", function(oEvent){
					this.setZoom(this._map.getView().getZoom(), false, true);
				}, this);
				
				this._map.getView().on("change:center", function(oEvent){
					var oCoord = this._map.getView().getCenter();
					if (this.getCenter()) {
						this.getCenter()._setCoordinateFromMap(oCoord);
					}
					this.getAggregation("_defaultCenter")._setCoordinateFromMap(oCoord);
				}, this);
			}

			var aMarkers = this.getMarkers();
			for (var i = 0; i < aMarkers.length; i++) {
				var oOverlay = new ol.Overlay({
					element: aMarkers[i].getDomRef(),
					position: aMarkers[i]._getCoordinateForMap(),
					positioning: 'bottom-left'
				});
				this._map.addOverlay(oOverlay);
				aMarkers[i]._onAfterRendering();
			}

			this._map.updateSize();
		}
	});

	return MapCtrl;

}, /* bExport= */ true);
