sap.ui.define([
	"com/sap/sdrive/ui/fee/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/v2/ODataModel"
], function(BaseController, JSONModel,  Filter, FilterOperator, ODataModel) {
	"use strict";

	return BaseController.extend("com.sap.sdrive.ui.fee.controller.FeeList", {
		onInit: function () {
			this.oFilterBar = sap.ui.getCore().byId("filterBar");
			var oSearchModel = new JSONModel({
				plateNumberKeys: [],
				feeStartDateFrom: null,
				feeStartDateTo: null,
				feeEndDateFrom: null,
				feeEndDateTo: null,
				changedOnFrom: null,
				changedOnTo: null
			});
			oSearchModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.setModel(oSearchModel, "searchModel");

			var that = this;

            this.getView().byId("feeTable").bindElement({
                path : "/Fee",
                model: "DrivingSafety",
                parameters: {
                    expand: "Vehicle"
                },
                events: {
                    dataReceived: function(response) {
                        // if (response.mParameters.data.Message !== '') {
                        //     sap.m.MessageToast.show(that.getI18NText("OPERATION_FAILED"));
                        // }
                    }
                }
			});
		
		},
		onChangeDateRange: function(oEvent) {
			var bValid = oEvent.getParameter("valid"),
				oEventSource = oEvent.getSource();
			if (bValid) {
				oEventSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEventSource.setValueState(sap.ui.core.ValueState.Error);
			}
		},
        onClear: function (oEvent) {
			var oSearch = {
				plateNumberKeys: [],
				feeStartDateFrom: null,
				feeStartDateTo: null,
				feeEndDateFrom: null,
				feeEndDateTo: null,
				changedOnFrom: null,
				changedOnTo: null
			};

			this.getModel("searchModel").setData(oSearch);
		},
		onSearch: function(oEvent) {
			var oSearchModel = this.getModel("searchModel"),
				oSearch = oSearchModel.getProperty("/"),
				aPlateNumberFilters = [],
				aFeeStartDateFilters = [],
				aFeeEndDateFilters = [],
				aChangedOnFilters = [],
				aFilterGroups = [];
				
			if (oSearch.plateNumberKeys && oSearch.plateNumberKeys.length > 0) {
				for (var i = 0; i < oSearch.plateNumberKeys.length; i ++) {
					aPlateNumberFilters.push(new sap.ui.model.Filter(
						"PLATE_NUMBER",
						sap.ui.model.FilterOperator.EQ,
						oSearch.plateNumberKeys[i]
					))
				}
				aFilterGroups.push(new sap.ui.model.Filter(aPlateNumberFilters, false));
			}

			

			if (oSearch.feeStartDateFrom && oSearch.feeStartDateTo) {
				aFeeStartDateFilters.push(new sap.ui.model.Filter(
					"FEE_START_DATE",
					sap.ui.model.FilterOperator.GE,
					oSearch.feeStartDateFrom
				));
				aFeeStartDateFilters.push(new sap.ui.model.Filter(
					"FEE_START_DATE",
					sap.ui.model.FilterOperator.LT,
					oSearch.feeStartDateTo
				));

				aFilterGroups.push(new sap.ui.model.Filter(aFeeStartDateFilters, true));
			}

			

			if (oSearch.feeEndDateFrom && oSearch.feeEndDateTo) {
				aFeeEndDateFilters.push(new sap.ui.model.Filter(
					"FEE_END_DATE",
					sap.ui.model.FilterOperator.GE,
					oSearch.feeEndDateFrom
				));
				aFeeEndDateFilters.push(new sap.ui.model.Filter(
					"FEE_END_DATE",
					sap.ui.model.FilterOperator.LT,
					oSearch.feeEndDateTo
				));

				aFilterGroups.push(new sap.ui.model.Filter(aFeeEndDateFilters, true));
			}

			
			if (oSearch.changedOnFrom && oSearch.changedOnTo) {
				aChangedOnFilters.push(new sap.ui.model.Filter(
					"CHANGED_ON",
					sap.ui.model.FilterOperator.GE,
					oSearch.changedOnFrom
				));
				aChangedOnFilters.push(new sap.ui.model.Filter(
					"CHANGED_ON",
					sap.ui.model.FilterOperator.LT,
					oSearch.changedOnTo
				));

				aFilterGroups.push(new sap.ui.model.Filter(aChangedOnFilters, true));
			}

			var oBindingItems = this.getView().byId("feeTable").getBinding("items");
			if (aFilterGroups && aFilterGroups.length > 0) {
				var oGroupFilter = new Filter(aFilterGroups, true);
				oBindingItems.filter(oGroupFilter);
			} else {
				oBindingItems.filter([]);
			}
			
			
		},
		onFeeSortButtonPressed: function(oEvent) {
            var _oFeeSortSettingsDialog = sap.ui.xmlfragment("com.sap.sdrive.ui.fee.view.fragment.FeeSortDialog", this);
            this._oFeeSortSettingsDialog = _oFeeSortSettingsDialog;
            this.getView().addDependent(this._oFeeSortSettingsDialog);
            this._oFeeSortSettingsDialog.open();
		},
		handleFeeSortDialogConfirm: function(oEvent) {
            var oTable = this.byId("feeTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];
            
            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
		}
	});

});