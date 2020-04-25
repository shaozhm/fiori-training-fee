sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.sdrive.ui.fee.controller.NotFound", {

		onNavBack: function () {
			this.getOwnerComponent().getRouter().navto("Home");
		}
	});

});