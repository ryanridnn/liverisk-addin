import { v4 } from "uuid";
import { SHEET_NAMES } from "../constants";
import { connection } from "../store";
// import { generateRandomNumber } from "../utils";

const TABLE_NAMES = {
	MARKET_RATES: "marketrates",
	FITTED_VALUES: "fittedvalues",
	RISK: "trisk",
};

export const printHiddenData = async () => {
	await Excel.run(async (context) => {
		const sheet = context.workbook.worksheets.getItem(SHEET_NAMES.HIDDEN_DATA);
		sheet.visibility = Excel.SheetVisibility.hidden;

		sheet.tables.load("items/name");

		await context.sync();

		const tableNames = sheet.tables.m__items.map((table) => table.name);

		if (!tableNames.includes(TABLE_NAMES.MARKET_RATES)) {
			const marketRatesTable = sheet.tables.add("A1:C1", true);
			marketRatesTable.name = TABLE_NAMES.MARKET_RATES;
			marketRatesTable.getHeaderRowRange().values = [["Key", "Original Market Rates", "Current Market Rates"]];

			marketRatesTable.rows.add(null, connection.marketRates);
		} else {
			const marketRatesTable = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.MARKET_RATES);

			marketRatesTable.getDataBodyRange().values = connection.marketRates;
		}

		if (!tableNames.includes(TABLE_NAMES.FITTED_VALUES)) {
			const fittedValuesTable = sheet.tables.add("E1:F1");
			fittedValuesTable.name = TABLE_NAMES.FITTED_VALUES;
			fittedValuesTable.getHeaderRowRange().values = [["Forecast", "Discount"]];

			fittedValuesTable.rows.add(null, connection.fitted_values);
		} else {
			const fittedValuesTable = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.FITTED_VALUES);

			fittedValuesTable.getDataBodyRange().values = connection.fitted_values;
		}

		if (!tableNames.includes(TABLE_NAMES.RISK)) {
			const riskTable = sheet.tables.add("H1:I1", true);
			riskTable.name = TABLE_NAMES.RISK;
			riskTable.getHeaderRowRange().values = [["Key", "Value"]];

			riskTable.rows.add(null, connection.risk);
		} else {
			const riskTable = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.RISK);

			riskTable.getDataBodyRange().values = connection.risk;
		}

		await context.sync();
	});
};
