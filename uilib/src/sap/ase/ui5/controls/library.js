/**
* Initialization Code and shared classes of library sap.ase.ui5.controls.
*/
sap.ui.define(['jquery.sap.global',
	'sap/ui/core/library' // library dependency
	],
	function(jQuery) {
	"use strict";

	/**
	* Library for TechEd training
	*
	* @namespace
	* @name sap.ase.ui5.controls
	* @author SAP SE
	* @version @version@
	* @public
	*/

	//delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name: 'sap.ase.ui5.controls',
		dependencies: ['sap.ui.core'],
		controls: [			
			'sap.ase.ui5.controls.Map',
			'sap.ase.ui5.controls.MapMarkers',
			'sap.ase.ui5.controls.SimpleMap',
			'sap.ase.ui5.controls.BasicMap'
		],
		elements: [
			'sap.ase.ui5.controls.MapPOI'
		],
		version: '@version@'
	});

	return sap.ase.ui5.controls;

}, /* bExport= */ false);
