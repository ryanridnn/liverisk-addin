import { updateParam } from "../connection";
import { SHEET_NAMES } from "../constants";
import { connection } from "../store";
import { generateRandomNumber } from "../utils";

const TABLE_NAMES = {
	TRADES: "trades",
};

export const printPortfolio = async (onCompleted = () => {}) => {
	try {
		await Excel.run(async (context) => {
			const sheet = context.workbook.worksheets.getItem(SHEET_NAMES.PORTFOLIO);

			sheet.tables.load("items/name");
			await context.sync();

			const sheetTitleRange = sheet.getRange("A1");
			sheetTitleRange.values = [["Portfolio"]];
			sheetTitleRange.format.set({ font: { bold: true } });

			const inputsTitleRange = sheet.getRange("A3");
			inputsTitleRange.values = [["Portfolio Settings"]];
			inputsTitleRange.format.set({ font: { italic: true } });

			const inputsRange = sheet.getRange("A4:B5");
			inputsRange.values = [
				["Num Trades", connection.numTrades],
				["Valuation Date", null],
			];

			const tableTitleRange = sheet.getRange("D3");
			tableTitleRange.values = [["Trades"]];
			tableTitleRange.format.set({ font: { italic: true } });

			const tableNames = sheet.tables.m__items.map((table) => table.name);

			const tradesData = Array.from({ length: 12 }).map((item, index) => {
				const maturity = `4/${index + 1}/2014`;
				const nominal = generateRandomNumber(100, 500);
				const startDate = `2/${index + 1}/2015`;
				const type = "IR SWAP";
				const lengthInYear = Math.floor(generateRandomNumber(1, 12));

				return [maturity, nominal, startDate, type, lengthInYear];
			});

			if (!tableNames.includes(TABLE_NAMES.TRADES)) {
				const table = sheet.tables.add("D5:H5", true);
				table.getHeaderRowRange().values = [["Maturity", "Nominal", "Start Date", "Type", "Length In Year"]];
				table.name = TABLE_NAMES.TRADES;

				table.rows.add(null, connection.trades);
			} else {
				const table = sheet.tables.m__items.find((table) => table.name === TABLE_NAMES.TRADES);

				table.getDataBodyRange().clear();
				const bodyRange = sheet.getRange(`D6:H${connection.trades.length + 6 - 1}`);
				bodyRange.values = connection.trades;
				table.resize(`D5:H${connection.trades.length + 5}`);
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

export const onPortfolioSheetChange = async (e) => {
	if (e.address === "B4" && typeof e.details.valueAfter === "number") {
		updateParam(0, "NumTrades", e.details.valueAfter);
	}
};
