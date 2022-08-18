import { v4 } from "uuid";
import { SHEET_NAMES } from "../constants";
import { generateRandomNumber } from "../utils";
import { connection } from "../store";
import { updateParam } from "../connection";

const CHART_NAMES = {
	MARKET_RATES: "market-rates",
	FITTED_VALUES: "fitted-values",
	RISK_GRAPH: "risk-graph",
};

const TABLE_NAMES = {
	TRADES_NPV: "tradesNPV",
	RISK: "risk",
};

export const printDashboard = async (onCompleted = () => {}) => {
	try {
		await Excel.run(async (context) => {
			const sheet = context.workbook.worksheets.getItem(SHEET_NAMES.DASHBOARD);
			const dataSheet = context.workbook.worksheets.getItem("Hidden Data");

			sheet.charts.load("items/name");
			sheet.tables.load("items/name");

			await context.sync();

			const sheetTitleRange = sheet.getRange("A1");
			sheetTitleRange.values = [["Dashboard"]];
			sheetTitleRange.format.set({ font: { bold: true } });

			const inputsRange = sheet.getRange("A3:B7");
			inputsRange.values = [
				["Market Data Simulation", null],
				["randomize", connection.randomizeData ? "Y" : "N"],
				["shift", connection.parallel_shift],
				["tilt", connection.parallel_tilt],
				["twist", connection.parallel_twist],
			];
			const inputsTitleRange = sheet.getRange("A3");
			inputsTitleRange.format.set({ font: { italic: true } });

			const readonliesRange = sheet.getRange("D4:G6");
			readonliesRange.values = [
				["Portfolio NPV", connection.portfolioNPV, "# IR SWAPS", connection.irSwaps],
				["Total Time", connection.totalTime, "Curve Build Time", connection.curveBuildTime],
				["LM Info", connection.LM_info, "Portfolio Build Time", connection.portfolioBuildTime],
			];

			await context.sync();

			const marketRatesTitleRange = sheet.getRange("A10");
			marketRatesTitleRange.values = [["Market Rates"]];
			marketRatesTitleRange.format.set({ font: { italic: true } });

			const fittedValuesTitleRange = sheet.getRange("F10");
			fittedValuesTitleRange.values = [["Fitted Values"]];
			fittedValuesTitleRange.format.set({ font: { italic: true } });

			const riskGraphTitleRange = sheet.getRange("L10");
			riskGraphTitleRange.values = [["Risk Graph"]];
			riskGraphTitleRange.format.set({ font: { italic: true } });

			const chartNames = sheet.charts.m__items.map((chart) => chart.name);

			let marketRatesRange = dataSheet.getRange(`A1:C${connection.marketRates.length + 1}`);
			if (!chartNames.includes(CHART_NAMES.MARKET_RATES)) {
				const marketRatesChart = sheet.charts.add(Excel.ChartType.line, marketRatesRange, Excel.ChartSeriesBy.columns);

				marketRatesChart.name = CHART_NAMES.MARKET_RATES;
				marketRatesChart.axes.categoryAxis.tickLabelPosition = "Low";

				marketRatesChart.title.visible = false;
				marketRatesChart.setPosition("A12", "D26");
			}

			if (!chartNames.includes(CHART_NAMES.FITTED_VALUES)) {
				const fittedValuesRange = dataSheet.getRange(`E1:F${connection.fitted_values.length + 1}`);
				const fittedValuesChart = sheet.charts.add(
					Excel.ChartType.line,
					fittedValuesRange,
					Excel.ChartSeriesBy.columns
				);
				fittedValuesChart.axes.categoryAxis.tickLabelPosition = "Low";

				fittedValuesChart.name = CHART_NAMES.FITTED_VALUES;

				fittedValuesChart.title.visible = false;
				fittedValuesChart.setPosition("F12", "J26");
			}

			if (!chartNames.includes(CHART_NAMES.RISK_GRAPH)) {
				const riskRange = dataSheet.getRange(`H1:I${connection.risk.length + 1}`);
				const riskGraph = sheet.charts.add(Excel.ChartType.columnClustered, riskRange, Excel.ChartSeriesBy.columns);
				riskGraph.axes.categoryAxis.tickLabelPosition = "Low";

				riskGraph.name = CHART_NAMES.RISK_GRAPH;

				riskGraph.title.visible = false;
				riskGraph.legend.visible = false;
				riskGraph.setPosition("L12", "Q26");
			}

			const tradesNPVTitle = sheet.getRange("A29");
			tradesNPVTitle.values = [["TradesNPV"]];
			tradesNPVTitle.format.set({ font: { italic: true } });

			const riskTableTitle = sheet.getRange("H29");
			riskTableTitle.values = [["Risk Table"]];
			riskTableTitle.format.set({ font: { italic: true } });

			const tableNames = sheet.tables.m__items.map((table) => table.name);

			if (!tableNames.includes(TABLE_NAMES.TRADES_NPV)) {
				const tradesNPVTable = sheet.tables.add("A31:F31", true);
				tradesNPVTable.name = TABLE_NAMES.TRADES_NPV;

				tradesNPVTable.getHeaderRowRange().values = [
					["Maturity", "Nominal", "Start Date", "Type", "Length In Year", "NPV"],
				];

				tradesNPVTable.rows.add(null, connection.tradesNPV);
			} else {
				const tradesNPVTable = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.TRADES_NPV);

				tradesNPVTable.getDataBodyRange().clear();
				const bodyRange = sheet.getRange(`A32:F${connection.tradesNPV.length + 32 - 1}`);
				bodyRange.values = connection.tradesNPV;
				tradesNPVTable.resize(`A31:F${connection.tradesNPV.length + 31}`);
			}

			if (!tableNames.includes(TABLE_NAMES.RISK)) {
				const riskTable = sheet.tables.add("H31:I31", true);
				riskTable.name = TABLE_NAMES.RISK;

				riskTable.getHeaderRowRange().values = [["Key", "Value"]];

				riskTable.rows.add(null, connection.risk);
			} else {
				const riskTable = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.RISK);

				riskTable.getDataBodyRange().values = connection.risk;
			}

			if (Office.context.requirements.isSetSupported("ExcelApi", "1.2")) {
				sheet.getUsedRange().format.autofitColumns();
				sheet.getUsedRange().format.autofitRows();
			}

			await context.sync();
			onCompleted(sheet);
		});
	} catch (e) {
		console.log(e);
	}
};

export const onDashboardSheetChanged = async (e) => {
	if (e.details.valueBefore !== e.details.valueAfter) {
		if (e.address === "B4") {
			if (e.details.valueAfter === "Y") {
				connection.setRandomizeData(true);
			} else {
				connection.setRandomizeData(false);
			}
		} else if (e.address === "B5") {
			if (e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03) {
				updateParam(1, "parallel_shift", e.details.valueAfter);
			} else {
				await Excel.run(async (context) => {
					const sheet = context.workbook.worksheets.getItem(e.worksheetId);
					const range = sheet.getRange(e.address);

					range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
					await context.sync();
				});
			}
		} else if (e.address === "B6") {
			if (e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03) {
				updateParam(1, "parallel_tilt", e.details.valueAfter);
			} else {
				await Excel.run(async (context) => {
					const sheet = context.workbook.worksheets.getItem(e.worksheetId);
					const range = sheet.getRange(e.address);

					range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
					await context.sync();
				});
			}
		} else if (e.address === "B7") {
			if (e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03) {
				updateParam(1, "parallel_twist", e.details.valueAfter);
			} else {
				await Excel.run(async (context) => {
					const sheet = context.workbook.worksheets.getItem(e.worksheetId);
					const range = sheet.getRange(e.address);

					range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
					await context.sync();
				});
			}
		}
	}
};

export const updateParamsRandomly = () => {
	const parallel_shift = ((Math.random() * 6 - 3) / 100).toFixed(4);
	const parallel_tilt = ((Math.random() * 6 - 3) / 100).toFixed(4);
	const parallel_twist = ((Math.random() * 6 - 3) / 100).toFixed(4);

	updateParam(1, "parallel_shift", parallel_shift);
	updateParam(1, "parallel_tilt", parallel_tilt);
	updateParam(1, "parallel_twist", parallel_twist);
};
