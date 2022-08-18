import { connect, updateParam } from "./connection";
import { connection, SheetStore } from "./store";
import { CONNECTION_URL, SHEET_NAMES } from "./constants";
import { printDashboard, onDashboardSheetChanged, updateParamsRandomly } from "./functions/dashboardFunctions";
import { onPortfolioSheetChange, printPortfolio } from "./functions/portfolioFunctions";
import { printHiddenData } from "./functions/hiddenDataFunctions";

import "./assets/liverisk.css";

const appBottom = document.querySelector(".app__bottom");
const progressBar = document.querySelector(".progress__bar");
const progressText = document.querySelector(".progress__text");

let dashboardListenerIsExist = false;
let portfolioListenerIsExist = false;

const sheetStore = new SheetStore();

Office.onReady(async (info) => {
  setupLibraries();
  if (info.host === Office.HostType.Excel) {
    const sideload = document.getElementById("sideload-msg");
    const mainApp = document.getElementById("app");
    const generateDataBtn = document.getElementById("generateData");
    const syncDataBtn = document.getElementById("syncData");

    sideload.style.display = "none";
    mainApp.style.display = "flex";
    generateDataBtn.onclick = run;
    syncDataBtn.onclick = syncData;

    let randomizeInterval;

    connection.useProgressEffect(onProgress);
    connection.useRandomizeDataEffect((randomize) => {
      if (randomize) {
        updateParamsRandomly();
        randomizeInterval = setInterval(updateParamsRandomly, 4000);
      } else {
        if (randomizeInterval) clearInterval(randomizeInterval);
      }
    });

    sheetStore.setOnChange((sheets) => {
      if (
        [SHEET_NAMES.DASHBOARD, SHEET_NAMES.PORTFOLIO, SHEET_NAMES.HIDDEN_DATA].every((name) =>
          sheets.map((sheet) => sheet.name).includes(name)
        )
      ) {
        generateDataBtn.disabled = true;
        syncDataBtn.disabled = false;
      } else {
        generateDataBtn.disabled = false;
        syncDataBtn.disabled = true;
      }
    });
    try {
      await Excel.run(async (context) => {
        const sheets = context.workbook.worksheets;
        sheets.load("name");
        await context.sync();
        sheetStore.add(sheets.items.map((item) => ({ id: item.id, name: item.name })));
        context.workbook.worksheets.onAdded.add(async (e) => {
          const sheet = context.workbook.worksheets.getItem(e.worksheetId);
          sheet.load("name");
          await context.sync();

          sheetStore.add([{ id: e.worksheetId, name: sheet.name }]);
        });
        context.workbook.worksheets.onDeleted.add((e) => {
          const sheet = sheetStore.sheets.find((sheet) => sheet.id === e.worksheetId);
          if (sheet.name === SHEET_NAMES.DASHBOARD) {
            dashboardListenerIsExist = false;
          } else if (sheet.name === SHEET_NAMES.PORTFOLIO) {
            portfolioListenerIsExist = false;
          }
          sheetStore.remove(e.worksheetId);
        });
        context.workbook.worksheets.onNameChanged.add((e) => {
          if (
            e.nameAfter !== e.nameBefore &&
            ![SHEET_NAMES.DASHBOARD, SHEET_NAMES.PORTFOLIO, SHEET_NAMES.HIDDEN_DATA].includes(e.nameAfter)
          ) {
            const sheet = sheetStore.sheets.find((sheet) => sheet.id === e.worksheetId);
            if (sheet.name === SHEET_NAMES.DASHBOARD) {
              dashboardListenerIsExist = false;
            } else if (sheet.name === SHEET_NAMES.PORTFOLIO) {
              portfolioListenerIsExist = false;
            }
            sheetStore.remove(e.worksheetId);
            console.log(dashboardListenerIsExist, portfolioListenerIsExist);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
});

export function run() {
  if (connection.connected) {
    generateData();
  } else {
    connect(
      CONNECTION_URL,
      () => {
        generateData();
        console.log(connection);
      },
      () => {
        generateData();
      }
    );
  }
}

const syncData = async () => {
  if (connection.connected) {
    await Excel.run(async (context) => {
      if (!dashboardListenerIsExist) {
        const dashboardSheet = context.workbook.worksheets.getItem(SHEET_NAMES.DASHBOARD);
        dashboardListenerIsExist = true;
        dashboardSheet.onChanged.add(onDashboardSheetChanged);
      }

      if (!portfolioListenerIsExist) {
        const portfolioSheet = context.workbook.worksheets.getItem(SHEET_NAMES.PORTFOLIO);
        portfolioSheet.onChanged.add(onPortfolioSheetChange);
        portfolioListenerIsExist = true;
      }

      getAndUpdate();
    });
  }
  try {
    connect(
      CONNECTION_URL,
      async () => {
        await Excel.run(async (context) => {
          if (!dashboardListenerIsExist) {
            const dashboardSheet = context.workbook.worksheets.getItem(SHEET_NAMES.DASHBOARD);
            dashboardListenerIsExist = true;
            dashboardSheet.onChanged.add(onDashboardSheetChanged);
          }

          if (!portfolioListenerIsExist) {
            const portfolioSheet = context.workbook.worksheets.getItem(SHEET_NAMES.PORTFOLIO);
            portfolioSheet.onChanged.add(onPortfolioSheetChange);
            portfolioListenerIsExist = true;
          }

          getAndUpdate();
        });
      },
      async () => {
        generateData();
      }
    );
  } catch (e) {
    console.log(e);
    dashboardListenerIsExist = false;
    portfolioListenerIsExist = false;
  }
};

const getAndUpdate = async () => {
  try {
    await Excel.run(async (context) => {
      const dashboardSheet = context.workbook.worksheets.getItem(SHEET_NAMES.DASHBOARD);
      const portfolioSheet = context.workbook.worksheets.getItem(SHEET_NAMES.PORTFOLIO);

      const randomize_range = dashboardSheet.getRange("B4");
      const parallel_shift_range = dashboardSheet.getRange("B5");
      const parallel_tilt_range = dashboardSheet.getRange("B6");
      const parallel_twist_range = dashboardSheet.getRange("B7");

      const numTradesRange = portfolioSheet.getRange("B4");

      randomize_range.load("values");
      parallel_shift_range.load("values");
      parallel_tilt_range.load("values");
      parallel_twist_range.load("values");
      numTradesRange.load("values");

      await context.sync();

      const randomize = randomize_range.values[0][0];
      const parallel_shift = parallel_shift_range.values[0][0];
      const parallel_tilt = parallel_tilt_range.values[0][0];
      const parallel_twist = parallel_twist_range.values[0][0];
      const numTrades = numTradesRange.values[0][0];

      if (randomize === "Y") {
        connection.setRandomizeData(true);
      } else {
        randomize_range.values = [["N"]];
        if (typeof parallel_shift === "number" && parallel_shift >= -0.03 && parallel_shift <= 0.03) {
          updateParam(1, "parallel_shift", parallel_shift);
        } else {
          parallel_shift_range.values = [[0]];
        }

        if (typeof parallel_tilt === "number" && parallel_tilt >= -0.03 && parallel_tilt <= 0.03) {
          updateParam(1, "parallel_tilt", parallel_tilt);
        } else {
          parallel_tilt_range.values = [[0]];
        }

        if (typeof parallel_twist === "number" && parallel_twist >= -0.03 && parallel_twist <= 0.03) {
          updateParam(1, "parallel_twist", parallel_twist);
        } else {
          parallel_twist_range.values = [[0]];
        }
      }

      if (typeof numTrades === "number") {
        updateParam(0, "NumTrades", numTrades);
      } else {
        parallel_shift_range.values = [[0]];
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const onProgress = (progress) => {
  const progressInPercentage =
    progress === 0 || progress === 1 ? progress * 100 + "%" : (progress * 100).toFixed(2) + "%";

  if (progress === 0 || progress === 1) {
    const timeout = setTimeout(() => {
      appBottom.style.transform = "translateY(100%)";
      clearTimeout(timeout);
    }, 500);
  } else {
    appBottom.style.transform = "translateY(0)";
  }

  progressBar.style.width = progressInPercentage;
  progressText.innerText = progressInPercentage;
};

const generateData = async () => {
  try {
    await Excel.run(async (context) => {
      const sheets = context.workbook.worksheets;
      sheets.load("name");

      await context.sync();

      const sheetNames = sheets.m__items.map((sheet) => sheet.name);

      if (sheetNames.includes(SHEET_NAMES.HIDDEN_DATA)) {
        printHiddenData();
      } else {
        context.workbook.worksheets.add(SHEET_NAMES.HIDDEN_DATA);
        await context.sync();
        printHiddenData();
      }

      if (sheetNames.includes(SHEET_NAMES.DASHBOARD)) {
        printDashboard((sheet) => {
          if (!dashboardListenerIsExist) {
            dashboardListenerIsExist = true;
            sheet.onChanged.add(onDashboardSheetChanged);
          }
        });
      } else {
        const dashboardSheet = context.workbook.worksheets.add(SHEET_NAMES.DASHBOARD);
        dashboardSheet.activate();

        await context.sync();
        printDashboard((sheet) => {
          if (!dashboardListenerIsExist) {
            dashboardListenerIsExist = true;
            sheet.onChanged.add(onDashboardSheetChanged);
          }
        });
      }

      if (sheetNames.includes(SHEET_NAMES.PORTFOLIO)) {
        printPortfolio((sheet) => {
          if (!portfolioListenerIsExist) {
            portfolioListenerIsExist = true;
            sheet.onChanged.add(onPortfolioSheetChange);
          }
        });
      } else {
        context.workbook.worksheets.add(SHEET_NAMES.PORTFOLIO);
        await context.sync();
        printPortfolio((sheet) => {
          if (!portfolioListenerIsExist) {
            portfolioListenerIsExist = true;
            sheet.onChanged.add(onPortfolioSheetChange);
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const setupLibraries = () => {
  feather.replace();

  const SpinnerElements = document.querySelectorAll(".ms-Spinner");
  for (let i = 0; i < SpinnerElements.length; i++) {
    new fabric["Spinner"](SpinnerElements[i]);
  }
};
