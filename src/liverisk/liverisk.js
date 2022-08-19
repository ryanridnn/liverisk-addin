import { connect, updateParam } from "./connection";
import { connection, sheetStore, alertStore } from "./store";
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

Office.onReady(async (info) => {
  setupLibraries();
  if (info.host === Office.HostType.Excel) {
    const sideload = document.getElementById("sideload-msg");
    const mainApp = document.getElementById("app");
    const generateDataBtn = document.getElementById("generateData");
    const syncDataBtn = document.getElementById("syncData");
    const alert = document.querySelector(".alert");
    const alertText = document.querySelector(".alert__text");

    sideload.style.display = "none";
    mainApp.style.display = "flex";
    generateDataBtn.onclick = generateData;
    syncDataBtn.onclick = syncData;

    connection.useProgressEffect(onProgressChange);
    connection.useRandomizeDataEffect(onRandomizeChange);

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

    alertStore.setOnChange((show, message) => {
      if (show) {
        alert.style.transform = "translate(-50%, 0)";
        alertText.innerHTML = message;
        const timeout = setTimeout(() => {
          alertStore.hideAlert();
          clearTimeout(timeout);
        }, 5000);
      } else {
        alert.style.transform = "translate(-50%, calc(-100% - .5rem))";
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
            connection.setRandomizeData(false);
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
              connection.setRandomizeData(false);
            } else if (sheet.name === SHEET_NAMES.PORTFOLIO) {
              portfolioListenerIsExist = false;
            }
            sheetStore.remove(e.worksheetId);
          }
        });
      });
    } catch (e) {
      alertStore.showAlert("<b>Failed to setup Live Risk Add-In!</b> Please reload this add-in!");
    }
  }
});

export function generateData() {
  if (connection.connected) {
    generateSheets();
  } else {
    connect(CONNECTION_URL, generateSheets, generateSheets);
  }
}

const syncData = async () => {
  if (connection.connected) {
    setListenerAndSync();
  }
  try {
    connect(CONNECTION_URL, setListenerAndSync, generateSheets);
  } catch (e) {
    alertStore.showAlert("<b>Failed to sync the data!</b> Please click the sync button again!");
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
    alertStore.showAlert("<b>Failed to sync the data!</b> Please click the sync button again!");
  }
};

const setListenerAndSync = async () => {
  try {
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
  } catch (e) {
    alertStore.showAlert("<b>Failed to setup the synchronization!</b> Please click the sync button again!");
  }
};

const generateSheets = async () => {
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
    alertStore.showAlert("<b>Failed to generate sheets!</b> Please try again!");
  }
};

const onProgressChange = (progress) => {
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

let randomizeInterval;

const onRandomizeChange = (randomize) => {
  if (randomize) {
    updateParamsRandomly();
    randomizeInterval = setInterval(updateParamsRandomly, 4000);
  } else {
    if (randomizeInterval) clearInterval(randomizeInterval);
  }
};

const setupLibraries = () => {
  feather.replace();

  const SpinnerElements = document.querySelectorAll(".ms-Spinner");
  for (let i = 0; i < SpinnerElements.length; i++) {
    new fabric["Spinner"](SpinnerElements[i]);
  }
};
