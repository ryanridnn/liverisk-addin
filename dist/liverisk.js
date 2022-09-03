/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/liverisk/connection/index.js":
/*!******************************************!*\
  !*** ./src/liverisk/connection/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "connect": function() { return /* binding */ connect; },
/* harmony export */   "disconnect": function() { return /* binding */ disconnect; },
/* harmony export */   "updateParam": function() { return /* binding */ updateParam; }
/* harmony export */ });
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ "./src/liverisk/store/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/liverisk/utils/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/liverisk/constants/index.js");



var connect = function connect(url, onInitial) {
  var onChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var on_error = function on_error() {
    _store__WEBPACK_IMPORTED_MODULE_0__.alertStore.showAlert("Failed to connect to Websocket! Please try connecting again!");
  };

  var on_open = function on_open() {
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setConnected(true);
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setGotInitial(false);
  };

  var on_close = function on_close() {
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setWs(null);
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setConnected(false);
    console.log("close");
  };

  var on_message = function on_message(message) {
    processMessage(message, onInitial, onChange); // console.log(message);
  };

  if (_store__WEBPACK_IMPORTED_MODULE_0__.connection.connected) {
    return;
  }

  try {
    var ws = new WebSocket(url);
    ws.onerror = on_error;
    ws.onclose = on_close;
    ws.onmessage = on_message;
    ws.onopen = on_open;
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setWs(ws);
  } catch (e) {
    console.log(e);
  }
};
var disconnect = function disconnect() {
  if (!_store__WEBPACK_IMPORTED_MODULE_0__.connection.connected) {
    return;
  }

  _store__WEBPACK_IMPORTED_MODULE_0__.connection.ws.close();
};
var doneInitialEffect = false;

var processMessage = function processMessage(message, onInitial, onChange) {
  if (!_store__WEBPACK_IMPORTED_MODULE_0__.connection.gotInitial) {
    try {
      var data = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.convertData)(message);
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.ws.send(JSON.stringify({
        type: "got_message"
      }));
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setDagNodes(data.dag_nodes);
      data.dag_nodes.forEach(function (node, index) {
        _store__WEBPACK_IMPORTED_MODULE_0__.connection.setStatus(index, _constants__WEBPACK_IMPORTED_MODULE_2__.STATUS.NOT_READY);
        _store__WEBPACK_IMPORTED_MODULE_0__.connection.setProgress(index, 0);
      });
      addMoreInputParams();
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setGotInitial(true);
    } catch (e) {
      console.log("Can not parse dag nodes");
    }
  } else {
    var _data = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.convertData)(message);

    if (_data.type === "dirty_nodes") {
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setInitialLoadProgress(0.01);
    }

    if (_data.type === "progress") {
      if (!_store__WEBPACK_IMPORTED_MODULE_0__.connection.loadComplete && _data.node_ind === 0) {
        _store__WEBPACK_IMPORTED_MODULE_0__.connection.setInitialLoadProgress(_data.progress);
      }

      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setStatus(_data.node_ind, _constants__WEBPACK_IMPORTED_MODULE_2__.STATUS.IN_PROGRESS);
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setProgress(_data.node_ind, _data.progress);
    } else if (_data.type === "completed") {
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setInitialLoadProgress(1);
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setStatus(_data.node_ind, _constants__WEBPACK_IMPORTED_MODULE_2__.STATUS.COMPLETED);
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setProgress(_data.node_ind, 1);
      _store__WEBPACK_IMPORTED_MODULE_0__.connection.setDagNodesOutput(_data.results, _data.node_ind);

      if (_data.node_ind === 1 && !doneInitialEffect) {
        onInitial();
        doneInitialEffect = true;
      } else if (_data.node_ind === 1) {
        onChange();
      }
    }
  }
};

var updateParam = function updateParam(nodeIndex, key, value) {
  if (_store__WEBPACK_IMPORTED_MODULE_0__.connection.connected) {
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.ws.send(JSON.stringify({
      type: "param_update",
      node_ind: nodeIndex,
      key: key,
      value: String(value)
    }));
    var params = {};
    params[key] = value;
    _store__WEBPACK_IMPORTED_MODULE_0__.connection.setDagNodesInput(params, nodeIndex);
  }
};

var addMoreInputParams = function addMoreInputParams() {
  _store__WEBPACK_IMPORTED_MODULE_0__.connection.setDagNodesInput({
    parallel_tilt: 0,
    parallel_twist: 0
  }, 1);
};

/***/ }),

/***/ "./src/liverisk/constants/index.js":
/*!*****************************************!*\
  !*** ./src/liverisk/constants/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONNECTION_URL": function() { return /* binding */ CONNECTION_URL; },
/* harmony export */   "SHEET_NAMES": function() { return /* binding */ SHEET_NAMES; },
/* harmony export */   "STATUS": function() { return /* binding */ STATUS; }
/* harmony export */ });
var CONNECTION_URL = "wss://dev.matlogica.com/live-risk-zu9poh7Queeshae9tha3/";
var STATUS = {
  NOT_READY: "Not Ready",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed"
};
var SHEET_NAMES = {
  DASHBOARD: "Dashboard",
  PORTFOLIO: "Portfolio",
  ABOUT: "About",
  HIDDEN_DATA: "Hidden Data"
};

/***/ }),

/***/ "./src/liverisk/functions/dashboardFunctions.js":
/*!******************************************************!*\
  !*** ./src/liverisk/functions/dashboardFunctions.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onDashboardSheetChanged": function() { return /* binding */ onDashboardSheetChanged; },
/* harmony export */   "printDashboard": function() { return /* binding */ printDashboard; },
/* harmony export */   "updateParamsRandomly": function() { return /* binding */ updateParamsRandomly; }
/* harmony export */ });
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ "./src/liverisk/store/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/liverisk/constants/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/liverisk/utils/index.js");
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../connection */ "./src/liverisk/connection/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





var CHART_NAMES = {
  MARKET_RATES: "market-rates",
  FITTED_VALUES: "fitted-values",
  RISK_GRAPH: "risk-graph"
};
var TABLE_NAMES = {
  TRADES_NPV: "tradesNPV",
  RISK: "risk"
};
var printDashboard = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var onCompleted,
        _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            onCompleted = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : function () {};
            _context2.prev = 1;
            _context2.next = 4;
            return Excel.run( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(context) {
                var sheet, dataSheet, sheetTitleRange, inputsRange, inputsTitleRange, readonliesRange, marketRatesTitleRange, fittedValuesTitleRange, riskGraphTitleRange, chartNames, marketRatesRange, marketRatesChart, fittedValuesRange, fittedValuesChart, riskRange, riskGraph, tradesNPVTitle, riskTableTitle, tableNames, tradesNPVTable, _tradesNPVTable, bodyRange, riskTable, _riskTable;

                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_1__.SHEET_NAMES.DASHBOARD);
                        dataSheet = context.workbook.worksheets.getItem("Hidden Data");
                        sheet.charts.load("items/name");
                        sheet.tables.load("items/name");
                        _context.next = 6;
                        return context.sync();

                      case 6:
                        sheetTitleRange = sheet.getRange("A1");
                        sheetTitleRange.values = [["Dashboard"]];
                        sheetTitleRange.format.set({
                          font: {
                            bold: true
                          }
                        });
                        inputsRange = sheet.getRange("A3:B7");
                        inputsRange.values = [["Market Data Simulation", null], ["randomize", _store__WEBPACK_IMPORTED_MODULE_0__.connection.randomizeData ? "Y" : "N"], ["shift", _store__WEBPACK_IMPORTED_MODULE_0__.connection.parallel_shift], ["tilt", _store__WEBPACK_IMPORTED_MODULE_0__.connection.parallel_tilt], ["twist", _store__WEBPACK_IMPORTED_MODULE_0__.connection.parallel_twist]];
                        inputsTitleRange = sheet.getRange("A3");
                        inputsTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        readonliesRange = sheet.getRange("D4:G6");
                        readonliesRange.values = [["Portfolio NPV", _store__WEBPACK_IMPORTED_MODULE_0__.connection.portfolioNPV, "# IR SWAPS", _store__WEBPACK_IMPORTED_MODULE_0__.connection.irSwaps], ["Total Time", _store__WEBPACK_IMPORTED_MODULE_0__.connection.totalTime, "Curve Build Time", _store__WEBPACK_IMPORTED_MODULE_0__.connection.curveBuildTime], ["LM Info", _store__WEBPACK_IMPORTED_MODULE_0__.connection.LM_info, "Portfolio Build Time", _store__WEBPACK_IMPORTED_MODULE_0__.connection.portfolioBuildTime]];
                        _context.next = 17;
                        return context.sync();

                      case 17:
                        marketRatesTitleRange = sheet.getRange("A10");
                        marketRatesTitleRange.values = [["Market Rates"]];
                        marketRatesTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        fittedValuesTitleRange = sheet.getRange("F10");
                        fittedValuesTitleRange.values = [["Fitted Values"]];
                        fittedValuesTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        riskGraphTitleRange = sheet.getRange("L10");
                        riskGraphTitleRange.values = [["Risk Graph"]];
                        riskGraphTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        chartNames = sheet.charts.m__items.map(function (chart) {
                          return chart.name;
                        });
                        marketRatesRange = dataSheet.getRange("A1:C".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.marketRates.length + 1));

                        if (!chartNames.includes(CHART_NAMES.MARKET_RATES)) {
                          marketRatesChart = sheet.charts.add(Excel.ChartType.line, marketRatesRange, Excel.ChartSeriesBy.columns);
                          marketRatesChart.name = CHART_NAMES.MARKET_RATES;
                          marketRatesChart.axes.categoryAxis.tickLabelPosition = "Low";
                          marketRatesChart.title.visible = false;
                          marketRatesChart.setPosition("A12", "D26");
                        }

                        if (!chartNames.includes(CHART_NAMES.FITTED_VALUES)) {
                          fittedValuesRange = dataSheet.getRange("E1:F".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.fitted_values.length + 1));
                          fittedValuesChart = sheet.charts.add(Excel.ChartType.line, fittedValuesRange, Excel.ChartSeriesBy.columns);
                          fittedValuesChart.axes.categoryAxis.tickLabelPosition = "Low";
                          fittedValuesChart.name = CHART_NAMES.FITTED_VALUES;
                          fittedValuesChart.title.visible = false;
                          fittedValuesChart.setPosition("F12", "J26");
                        }

                        if (!chartNames.includes(CHART_NAMES.RISK_GRAPH)) {
                          riskRange = dataSheet.getRange("H1:I".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.risk.length + 1));
                          riskGraph = sheet.charts.add(Excel.ChartType.columnClustered, riskRange, Excel.ChartSeriesBy.columns);
                          riskGraph.axes.categoryAxis.tickLabelPosition = "Low";
                          riskGraph.name = CHART_NAMES.RISK_GRAPH;
                          riskGraph.title.visible = false;
                          riskGraph.legend.visible = false;
                          riskGraph.setPosition("L12", "Q26");
                        }

                        tradesNPVTitle = sheet.getRange("A29");
                        tradesNPVTitle.values = [["TradesNPV"]];
                        tradesNPVTitle.format.set({
                          font: {
                            italic: true
                          }
                        });
                        riskTableTitle = sheet.getRange("H29");
                        riskTableTitle.values = [["Risk Table"]];
                        riskTableTitle.format.set({
                          font: {
                            italic: true
                          }
                        });
                        tableNames = sheet.tables.m__items.map(function (table) {
                          return table.name;
                        });

                        if (!tableNames.includes(TABLE_NAMES.TRADES_NPV)) {
                          tradesNPVTable = sheet.tables.add("A31:F31", true);
                          tradesNPVTable.name = TABLE_NAMES.TRADES_NPV;
                          tradesNPVTable.getHeaderRowRange().values = [["Maturity", "Nominal", "Start Date", "Type", "Length In Year", "NPV"]];
                          tradesNPVTable.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.tradesNPV);
                        } else {
                          _tradesNPVTable = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.TRADES_NPV;
                          });

                          _tradesNPVTable.getDataBodyRange().clear();

                          bodyRange = sheet.getRange("A32:F".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.tradesNPV.length + 32 - 1));
                          bodyRange.values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.tradesNPV;

                          _tradesNPVTable.resize("A31:F".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.tradesNPV.length + 31));
                        }

                        if (!tableNames.includes(TABLE_NAMES.RISK)) {
                          riskTable = sheet.tables.add("H31:I31", true);
                          riskTable.name = TABLE_NAMES.RISK;
                          riskTable.getHeaderRowRange().values = [["Key", "Value"]];
                          riskTable.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.risk);
                        } else {
                          _riskTable = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.RISK;
                          });
                          _riskTable.getDataBodyRange().values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.risk;
                        }

                        if (Office.context.requirements.isSetSupported("ExcelApi", "1.2")) {
                          sheet.getUsedRange().format.autofitColumns();
                          sheet.getUsedRange().format.autofitRows();
                        }

                        _context.next = 43;
                        return context.sync();

                      case 43:
                        onCompleted(sheet);

                      case 44:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 6]]);
  }));

  return function printDashboard() {
    return _ref.apply(this, arguments);
  };
}();
var onDashboardSheetChanged = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(e) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!(e.details.valueBefore !== e.details.valueAfter)) {
              _context6.next = 48;
              break;
            }

            if (!(e.address === "B4")) {
              _context6.next = 5;
              break;
            }

            if (e.details.valueAfter === "Y") {
              _store__WEBPACK_IMPORTED_MODULE_0__.connection.setRandomizeData(true);
            } else {
              _store__WEBPACK_IMPORTED_MODULE_0__.connection.setRandomizeData(false);
            }

            _context6.next = 48;
            break;

          case 5:
            if (!(e.address === "B5")) {
              _context6.next = 20;
              break;
            }

            if (!(e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03)) {
              _context6.next = 10;
              break;
            }

            (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_shift", e.details.valueAfter);
            _context6.next = 18;
            break;

          case 10:
            _context6.prev = 10;
            _context6.next = 13;
            return Excel.run( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(context) {
                var sheet, range;
                return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(e.worksheetId);
                        range = sheet.getRange(e.address);
                        range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
                        _context3.next = 5;
                        return context.sync();

                      case 5:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 13:
            _context6.next = 18;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](10);
            console.log(_context6.t0);

          case 18:
            _context6.next = 48;
            break;

          case 20:
            if (!(e.address === "B6")) {
              _context6.next = 35;
              break;
            }

            if (!(e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03)) {
              _context6.next = 25;
              break;
            }

            (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_tilt", e.details.valueAfter);
            _context6.next = 33;
            break;

          case 25:
            _context6.prev = 25;
            _context6.next = 28;
            return Excel.run( /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(context) {
                var sheet, range;
                return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(e.worksheetId);
                        range = sheet.getRange(e.address);
                        range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
                        _context4.next = 5;
                        return context.sync();

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 28:
            _context6.next = 33;
            break;

          case 30:
            _context6.prev = 30;
            _context6.t1 = _context6["catch"](25);
            console.log(_context6.t1);

          case 33:
            _context6.next = 48;
            break;

          case 35:
            if (!(e.address === "B7")) {
              _context6.next = 48;
              break;
            }

            if (!(e.details.valueAfter >= -0.03 && e.details.valueAfter <= 0.03)) {
              _context6.next = 40;
              break;
            }

            (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_twist", e.details.valueAfter);
            _context6.next = 48;
            break;

          case 40:
            _context6.prev = 40;
            _context6.next = 43;
            return Excel.run( /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(context) {
                var sheet, range;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(e.worksheetId);
                        range = sheet.getRange(e.address);
                        range.values = [[typeof e.details.valueBefore === "number" ? e.details.valueBefore : 0]];
                        _context5.next = 5;
                        return context.sync();

                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 43:
            _context6.next = 48;
            break;

          case 45:
            _context6.prev = 45;
            _context6.t2 = _context6["catch"](40);
            console.log(_context6.t2);

          case 48:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[10, 15], [25, 30], [40, 45]]);
  }));

  return function onDashboardSheetChanged(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var updateParamsRandomly = function updateParamsRandomly() {
  if (_store__WEBPACK_IMPORTED_MODULE_0__.sheetStore.sheets.map(function (sheet) {
    return sheet.name;
  }).includes(_constants__WEBPACK_IMPORTED_MODULE_1__.SHEET_NAMES.DASHBOARD)) {
    var parallel_shift = ((Math.random() * 6 - 3) / 100).toFixed(4);
    var parallel_tilt = ((Math.random() * 6 - 3) / 100).toFixed(4);
    var parallel_twist = ((Math.random() * 6 - 3) / 100).toFixed(4);
    (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_shift", parallel_shift);
    (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_tilt", parallel_tilt);
    (0,_connection__WEBPACK_IMPORTED_MODULE_3__.updateParam)(1, "parallel_twist", parallel_twist);
  }
};

/***/ }),

/***/ "./src/liverisk/functions/hiddenDataFunctions.js":
/*!*******************************************************!*\
  !*** ./src/liverisk/functions/hiddenDataFunctions.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "printHiddenData": function() { return /* binding */ printHiddenData; }
/* harmony export */ });
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ "./src/liverisk/store/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/liverisk/constants/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



var TABLE_NAMES = {
  MARKET_RATES: "marketrates",
  FITTED_VALUES: "fittedvalues",
  RISK: "trisk"
};
var printHiddenData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Excel.run( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(context) {
                var sheet, tableNames, marketRatesTable, _marketRatesTable, fittedValuesTable, _fittedValuesTable, riskTable, _riskTable;

                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_1__.SHEET_NAMES.HIDDEN_DATA);
                        sheet.visibility = Excel.SheetVisibility.hidden;
                        sheet.tables.load("items/name");
                        _context.next = 5;
                        return context.sync();

                      case 5:
                        tableNames = sheet.tables.m__items.map(function (table) {
                          return table.name;
                        });

                        if (!tableNames.includes(TABLE_NAMES.MARKET_RATES)) {
                          marketRatesTable = sheet.tables.add("A1:C1", true);
                          marketRatesTable.name = TABLE_NAMES.MARKET_RATES;
                          marketRatesTable.getHeaderRowRange().values = [["Key", "Original Market Rates", "Current Market Rates"]];
                          marketRatesTable.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.marketRates);
                        } else {
                          _marketRatesTable = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.MARKET_RATES;
                          });
                          _marketRatesTable.getDataBodyRange().values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.marketRates;
                        }

                        if (!tableNames.includes(TABLE_NAMES.FITTED_VALUES)) {
                          fittedValuesTable = sheet.tables.add("E1:F1");
                          fittedValuesTable.name = TABLE_NAMES.FITTED_VALUES;
                          fittedValuesTable.getHeaderRowRange().values = [["Forecast", "Discount"]];
                          fittedValuesTable.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.fitted_values);
                        } else {
                          _fittedValuesTable = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.FITTED_VALUES;
                          });
                          _fittedValuesTable.getDataBodyRange().values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.fitted_values;
                        }

                        if (!tableNames.includes(TABLE_NAMES.RISK)) {
                          riskTable = sheet.tables.add("H1:I1", true);
                          riskTable.name = TABLE_NAMES.RISK;
                          riskTable.getHeaderRowRange().values = [["Key", "Value"]];
                          riskTable.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.risk);
                        } else {
                          _riskTable = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.RISK;
                          });
                          _riskTable.getDataBodyRange().values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.risk;
                        }

                        _context.next = 11;
                        return context.sync();

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5]]);
  }));

  return function printHiddenData() {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/liverisk/functions/portfolioFunctions.js":
/*!******************************************************!*\
  !*** ./src/liverisk/functions/portfolioFunctions.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onPortfolioSheetChange": function() { return /* binding */ onPortfolioSheetChange; },
/* harmony export */   "printPortfolio": function() { return /* binding */ printPortfolio; }
/* harmony export */ });
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store */ "./src/liverisk/store/index.js");
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../connection */ "./src/liverisk/connection/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/liverisk/constants/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/liverisk/utils/index.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





var TABLE_NAMES = {
  TRADES: "trades"
};
var printPortfolio = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var onCompleted,
        _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            onCompleted = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : function () {};
            _context2.prev = 1;
            _context2.next = 4;
            return Excel.run( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(context) {
                var sheet, sheetTitleRange, inputsTitleRange, inputsRange, tableTitleRange, tableNames, table, _table, bodyRange;

                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        sheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO);
                        sheet.tables.load("items/name");
                        _context.next = 4;
                        return context.sync();

                      case 4:
                        sheetTitleRange = sheet.getRange("A1");
                        sheetTitleRange.values = [["Portfolio"]];
                        sheetTitleRange.format.set({
                          font: {
                            bold: true
                          }
                        });
                        inputsTitleRange = sheet.getRange("A3");
                        inputsTitleRange.values = [["Portfolio Settings"]];
                        inputsTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        inputsRange = sheet.getRange("A4:B5");
                        inputsRange.values = [["Num Trades", _store__WEBPACK_IMPORTED_MODULE_0__.connection.numTrades], ["Valuation Date", null]];
                        tableTitleRange = sheet.getRange("D3");
                        tableTitleRange.values = [["Trades"]];
                        tableTitleRange.format.set({
                          font: {
                            italic: true
                          }
                        });
                        tableNames = sheet.tables.m__items.map(function (table) {
                          return table.name;
                        });

                        if (!tableNames.includes(TABLE_NAMES.TRADES)) {
                          table = sheet.tables.add("D5:H5", true);
                          table.getHeaderRowRange().values = [["Maturity", "Nominal", "Start Date", "Type", "Length In Year"]];
                          table.name = TABLE_NAMES.TRADES;
                          table.rows.add(null, _store__WEBPACK_IMPORTED_MODULE_0__.connection.trades);
                        } else {
                          _table = sheet.tables.m__items.find(function (table) {
                            return table.name === TABLE_NAMES.TRADES;
                          });

                          _table.getDataBodyRange().clear();

                          bodyRange = sheet.getRange("D6:H".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.trades.length + 6 - 1));
                          bodyRange.values = _store__WEBPACK_IMPORTED_MODULE_0__.connection.trades;

                          _table.resize("D5:H".concat(_store__WEBPACK_IMPORTED_MODULE_0__.connection.trades.length + 5));
                        }

                        if (Office.context.requirements.isSetSupported("ExcelApi", "1.2")) {
                          sheet.getUsedRange().format.autofitColumns();
                          sheet.getUsedRange().format.autofitRows();
                        }

                        _context.next = 20;
                        return context.sync();

                      case 20:
                        onCompleted(sheet);

                      case 21:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 6]]);
  }));

  return function printPortfolio() {
    return _ref.apply(this, arguments);
  };
}();
var onPortfolioSheetChange = function onPortfolioSheetChange(e) {
  if (e.address === "B4" && typeof e.details.valueAfter === "number") {
    (0,_connection__WEBPACK_IMPORTED_MODULE_1__.updateParam)(0, "NumTrades", e.details.valueAfter);
  }
};

/***/ }),

/***/ "./src/liverisk/store/index.js":
/*!*************************************!*\
  !*** ./src/liverisk/store/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "alertStore": function() { return /* binding */ alertStore; },
/* harmony export */   "connection": function() { return /* binding */ connection; },
/* harmony export */   "sheetStore": function() { return /* binding */ sheetStore; }
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ConnectionStore = /*#__PURE__*/function () {
  function ConnectionStore() {
    _classCallCheck(this, ConnectionStore);

    this.ws = null;
    this.connected = false;
    this.gotInitial = false;
    this.dagNodes = [];
    this.dagNodesStatus = [];
    this.dagNodesProgress = [];
    this.loadCompleted = false;
    this.initialLoadProgress = 0;
    this.randomizeData = false;
    this.progressEffect = [];
    this.randomizeDataEffect = [];
  }

  _createClass(ConnectionStore, [{
    key: "setWs",
    value: function setWs(ws) {
      this.ws = ws;
    }
  }, {
    key: "setConnected",
    value: function setConnected(bool) {
      this.connected = bool;
    }
  }, {
    key: "setDagNodes",
    value: function setDagNodes(dagNodes) {
      this.dagNodes = dagNodes;
    }
  }, {
    key: "setDagNodesInput",
    value: function setDagNodesInput(params, nodeIndex) {
      this.dagNodes[nodeIndex].input_params = _objectSpread(_objectSpread({}, this.dagNodes[nodeIndex].input_params), params);
    }
  }, {
    key: "setDagNodesOutput",
    value: function setDagNodesOutput(output, nodeIndex) {
      this.dagNodes[nodeIndex].output_params = output;
    }
  }, {
    key: "setGotInitial",
    value: function setGotInitial(bool) {
      this.gotInitial = bool;
    }
  }, {
    key: "setStatus",
    value: function setStatus(nodeIndex, status) {
      this.dagNodesStatus[nodeIndex] = status;
    }
  }, {
    key: "setProgress",
    value: function setProgress(nodeIndex, progress) {
      this.dagNodesProgress[nodeIndex] = progress;
    }
  }, {
    key: "setLoadComplete",
    value: function setLoadComplete(bool) {
      this.loadComplete = bool;
    }
  }, {
    key: "setInitialLoadProgress",
    value: function setInitialLoadProgress(progress) {
      var _this = this;

      this.initialLoadProgress = progress;
      this.progressEffect.forEach(function (cb) {
        cb(_this.initialLoadProgress);
      });
    }
  }, {
    key: "setRandomizeData",
    value: function setRandomizeData(bool) {
      this.randomizeData = bool;
      this.randomizeDataEffect.forEach(function (cb) {
        cb(bool);
      });
    }
  }, {
    key: "useProgressEffect",
    value: function useProgressEffect(cb) {
      this.progressEffect.push(cb);
      cb(this.initialLoadProgress);
    }
  }, {
    key: "useRandomizeDataEffect",
    value: function useRandomizeDataEffect(cb) {
      this.randomizeDataEffect.push(cb);
    } // getters

  }, {
    key: "portfolio",
    get: function get() {
      return this.dagNodes[0];
    }
  }, {
    key: "priceAndRisk",
    get: function get() {
      return this.dagNodes[1];
    }
  }, {
    key: "portfolioNPV",
    get: function get() {
      var _this$priceAndRisk, _this$priceAndRisk$ou;

      return ((_this$priceAndRisk = this.priceAndRisk) === null || _this$priceAndRisk === void 0 ? void 0 : (_this$priceAndRisk$ou = _this$priceAndRisk.output_params) === null || _this$priceAndRisk$ou === void 0 ? void 0 : _this$priceAndRisk$ou.PortfolioNPV) || 0;
    }
  }, {
    key: "totalTime",
    get: function get() {
      var _this$priceAndRisk2, _this$priceAndRisk2$o;

      return (((_this$priceAndRisk2 = this.priceAndRisk) === null || _this$priceAndRisk2 === void 0 ? void 0 : (_this$priceAndRisk2$o = _this$priceAndRisk2.output_params) === null || _this$priceAndRisk2$o === void 0 ? void 0 : _this$priceAndRisk2$o.CalcTime) || 0).toFixed(2) + " ms";
    }
  }, {
    key: "LM_info",
    get: function get() {
      var _this$priceAndRisk3, _this$priceAndRisk3$o;

      var lminfo = (_this$priceAndRisk3 = this.priceAndRisk) === null || _this$priceAndRisk3 === void 0 ? void 0 : (_this$priceAndRisk3$o = _this$priceAndRisk3.output_params) === null || _this$priceAndRisk3$o === void 0 ? void 0 : _this$priceAndRisk3$o.LM_info;

      if (!!lminfo === false) {
        return 0;
      } else {
        var goalfarr = lminfo.goalf.toString().split("e");
        goalfarr[0] = Number(goalfarr[0]).toFixed(2);
        var goalf = goalfarr.join("e");
        return "".concat((lminfo === null || lminfo === void 0 ? void 0 : lminfo.NX) || 0, "x").concat((lminfo === null || lminfo === void 0 ? void 0 : lminfo.NY) || 0, " niter:").concat((lminfo === null || lminfo === void 0 ? void 0 : lminfo.niter) || 0, " ").concat(goalf || 0);
      }
    }
  }, {
    key: "irSwaps",
    get: function get() {
      var _this$portfolio, _this$portfolio$input;

      return ((_this$portfolio = this.portfolio) === null || _this$portfolio === void 0 ? void 0 : (_this$portfolio$input = _this$portfolio.input_params) === null || _this$portfolio$input === void 0 ? void 0 : _this$portfolio$input.NumTrades) || 0;
    }
  }, {
    key: "curveBuildTime",
    get: function get() {
      var _this$priceAndRisk4, _this$priceAndRisk4$o;

      return (((_this$priceAndRisk4 = this.priceAndRisk) === null || _this$priceAndRisk4 === void 0 ? void 0 : (_this$priceAndRisk4$o = _this$priceAndRisk4.output_params) === null || _this$priceAndRisk4$o === void 0 ? void 0 : _this$priceAndRisk4$o.CurveBuildTimeMs) || 0).toFixed(2) + " ms";
    }
  }, {
    key: "portfolioBuildTime",
    get: function get() {
      var _this$portfolio2, _this$portfolio2$outp;

      return (((_this$portfolio2 = this.portfolio) === null || _this$portfolio2 === void 0 ? void 0 : (_this$portfolio2$outp = _this$portfolio2.output_params) === null || _this$portfolio2$outp === void 0 ? void 0 : _this$portfolio2$outp.CalcTime) || 0).toFixed(2) + " ms";
    }
  }, {
    key: "parallel_shift",
    get: function get() {
      var _this$priceAndRisk5, _this$priceAndRisk5$i;

      return ((_this$priceAndRisk5 = this.priceAndRisk) === null || _this$priceAndRisk5 === void 0 ? void 0 : (_this$priceAndRisk5$i = _this$priceAndRisk5.input_params) === null || _this$priceAndRisk5$i === void 0 ? void 0 : _this$priceAndRisk5$i.parallel_shift) || 0;
    }
  }, {
    key: "parallel_tilt",
    get: function get() {
      var _this$priceAndRisk6, _this$priceAndRisk6$i;

      return ((_this$priceAndRisk6 = this.priceAndRisk) === null || _this$priceAndRisk6 === void 0 ? void 0 : (_this$priceAndRisk6$i = _this$priceAndRisk6.input_params) === null || _this$priceAndRisk6$i === void 0 ? void 0 : _this$priceAndRisk6$i.parallel_tilt) || 0;
    }
  }, {
    key: "parallel_twist",
    get: function get() {
      var _this$priceAndRisk7, _this$priceAndRisk7$i;

      return ((_this$priceAndRisk7 = this.priceAndRisk) === null || _this$priceAndRisk7 === void 0 ? void 0 : (_this$priceAndRisk7$i = _this$priceAndRisk7.input_params) === null || _this$priceAndRisk7$i === void 0 ? void 0 : _this$priceAndRisk7$i.parallel_twist) || 0;
    }
  }, {
    key: "marketRates",
    get: function get() {
      var _this$portfolio3,
          _this$portfolio3$outp,
          _this2 = this;

      return (((_this$portfolio3 = this.portfolio) === null || _this$portfolio3 === void 0 ? void 0 : (_this$portfolio3$outp = _this$portfolio3.output_params) === null || _this$portfolio3$outp === void 0 ? void 0 : _this$portfolio3$outp.OriginalMarketRates) || []).map(function (item, index) {
        var _this2$priceAndRisk, _this2$priceAndRisk$o;

        return [item[0], item[1], ((_this2$priceAndRisk = _this2.priceAndRisk) === null || _this2$priceAndRisk === void 0 ? void 0 : (_this2$priceAndRisk$o = _this2$priceAndRisk.output_params) === null || _this2$priceAndRisk$o === void 0 ? void 0 : _this2$priceAndRisk$o.MarketRates[index][1]) || null];
      });
    }
  }, {
    key: "fitted_values",
    get: function get() {
      var _this$priceAndRisk8,
          _this$priceAndRisk8$o,
          _this3 = this;

      return (((_this$priceAndRisk8 = this.priceAndRisk) === null || _this$priceAndRisk8 === void 0 ? void 0 : (_this$priceAndRisk8$o = _this$priceAndRisk8.output_params) === null || _this$priceAndRisk8$o === void 0 ? void 0 : _this$priceAndRisk8$o.fitted_values_discount) || []).map(function (item, index) {
        var _this3$priceAndRisk, _this3$priceAndRisk$o;

        return [((_this3$priceAndRisk = _this3.priceAndRisk) === null || _this3$priceAndRisk === void 0 ? void 0 : (_this3$priceAndRisk$o = _this3$priceAndRisk.output_params) === null || _this3$priceAndRisk$o === void 0 ? void 0 : _this3$priceAndRisk$o.fitted_values_forecast[index]) || null, item];
      });
    }
  }, {
    key: "risk",
    get: function get() {
      var _this$priceAndRisk9, _this$priceAndRisk9$o;

      return ((_this$priceAndRisk9 = this.priceAndRisk) === null || _this$priceAndRisk9 === void 0 ? void 0 : (_this$priceAndRisk9$o = _this$priceAndRisk9.output_params) === null || _this$priceAndRisk9$o === void 0 ? void 0 : _this$priceAndRisk9$o.Risk) || [];
    }
  }, {
    key: "trades",
    get: function get() {
      var _this$portfolio4, _this$portfolio4$outp;

      return (((_this$portfolio4 = this.portfolio) === null || _this$portfolio4 === void 0 ? void 0 : (_this$portfolio4$outp = _this$portfolio4.output_params) === null || _this$portfolio4$outp === void 0 ? void 0 : _this$portfolio4$outp.Trades) || []).map(function (trade) {
        return [trade.Maturity, trade.Nominal, trade["Start Date"], trade.Type, trade.lengthInYears];
      });
    }
  }, {
    key: "npv",
    get: function get() {
      var _this$priceAndRisk10, _this$priceAndRisk10$;

      return ((_this$priceAndRisk10 = this.priceAndRisk) === null || _this$priceAndRisk10 === void 0 ? void 0 : (_this$priceAndRisk10$ = _this$priceAndRisk10.output_params) === null || _this$priceAndRisk10$ === void 0 ? void 0 : _this$priceAndRisk10$.TradeNPV) || [];
    }
  }, {
    key: "tradesNPV",
    get: function get() {
      var _this4 = this;

      return (this.trades || []).map(function (trade, index) {
        return [].concat(_toConsumableArray(trade), [_this4.npv[index]]);
      });
    }
  }, {
    key: "numTrades",
    get: function get() {
      var _this$portfolio5, _this$portfolio5$inpu;

      return ((_this$portfolio5 = this.portfolio) === null || _this$portfolio5 === void 0 ? void 0 : (_this$portfolio5$inpu = _this$portfolio5.input_params) === null || _this$portfolio5$inpu === void 0 ? void 0 : _this$portfolio5$inpu.NumTrades) || 0;
    }
  }]);

  return ConnectionStore;
}();

var connection = new ConnectionStore();

var SheetStore = /*#__PURE__*/function () {
  function SheetStore() {
    _classCallCheck(this, SheetStore);

    this.sheets = [];

    this.onChange = function () {};
  }

  _createClass(SheetStore, [{
    key: "setOnChange",
    value: function setOnChange(cb) {
      this.onChange = cb;
    }
  }, {
    key: "add",
    value: function add(sheets) {
      var _this$sheets;

      (_this$sheets = this.sheets).push.apply(_this$sheets, _toConsumableArray(sheets));

      this.onChange(this.sheets);
    }
  }, {
    key: "remove",
    value: function remove(id) {
      this.sheets = this.sheets.filter(function (sheet) {
        return sheet.id !== id;
      });
      this.onChange(this.sheets);
    }
  }]);

  return SheetStore;
}();

var sheetStore = new SheetStore();

var AlertStore = /*#__PURE__*/function () {
  function AlertStore() {
    _classCallCheck(this, AlertStore);

    this.show = false;
    this.message = null;

    this.onChange = function () {};
  }

  _createClass(AlertStore, [{
    key: "showAlert",
    value: function showAlert(message) {
      this.show = true;
      this.message = message;
      this.onChange(true, message);
    }
  }, {
    key: "hideAlert",
    value: function hideAlert() {
      this.show = false;
      this.message = null;
      this.onChange(false, null);
    }
  }, {
    key: "setOnChange",
    value: function setOnChange(onChange) {
      this.onChange = onChange;
    }
  }]);

  return AlertStore;
}();

var alertStore = new AlertStore();

/***/ }),

/***/ "./src/liverisk/utils/index.js":
/*!*************************************!*\
  !*** ./src/liverisk/utils/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertData": function() { return /* binding */ convertData; },
/* harmony export */   "generateRandomNumber": function() { return /* binding */ generateRandomNumber; }
/* harmony export */ });
var convertData = function convertData(message) {
  return JSON.parse(message.data);
};
var generateRandomNumber = function generateRandomNumber() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  return Math.random() * (max - min) + min;
};

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/cjs.js!./src/liverisk/assets/liverisk.css":
/*!***********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/cjs.js!./src/liverisk/assets/liverisk.css ***!
  \***********************************************************************************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  position: relative;\n  height: 100vh;\n  overflow: hidden;\n}\n\n#sideload-msg {\n  min-height: 95vh;\n  display: flex;\n  align-items: center;\n  padding: 0 2rem;\n}\n\n.loader {\n  display: flex;\n}\n\n.loader__label {\n  margin-left: 0.5rem;\n  font-size: 1rem;\n  top: -2px !important;\n}\n\n.app {\n  min-height: 100vh;\n  display: none;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  padding: 0 2rem;\n  gap: 0.5rem;\n}\n\n.alert {\n  position: absolute;\n  top: 0.5rem;\n  left: 50%;\n  transform: translate(-50%, calc(-100% - 0.5rem));\n  display: flex;\n  width: 100%;\n  gap: 0.75rem;\n  padding: 1rem;\n  background: #fdfcd9;\n  max-width: 90%;\n  transition: all 0.2s ease;\n}\n\n#generateData {\n  margin-top: 0.5rem;\n  display: flex;\n  align-items: center;\n}\n\n#generateData svg {\n  height: 1rem;\n  color: white;\n}\n\n#syncData {\n  margin-top: 0.25rem;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem 1rem;\n}\n\n#syncData svg {\n  height: 1rem;\n}\n\n.app__bottom {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  transform: translateY(100%);\n  transition: all 0.2s ease;\n}\n\n.progress {\n  height: 1.5rem;\n  background: #41a6f5;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n}\n\n.progress__bar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background: #0078d7;\n  transition: all 0.2s ease;\n}\n\n.progress__text {\n  position: relative;\n  z-index: 1;\n  color: white;\n  font-weight: bold;\n}\n", "",{"version":3,"sources":["webpack://./src/liverisk/assets/liverisk.css"],"names":[],"mappings":"AAAA;EACE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;EAChB,aAAa;EACb,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,mBAAmB;EACnB,eAAe;EACf,oBAAoB;AACtB;;AAEA;EACE,iBAAiB;EACjB,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,kBAAkB;EAClB,eAAe;EACf,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,gDAAgD;EAChD,aAAa;EACb,WAAW;EACX,YAAY;EACZ,aAAa;EACb,mBAAmB;EACnB,cAAc;EACd,yBAAyB;AAC3B;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,YAAY;EACZ,YAAY;AACd;;AAEA;EACE,mBAAmB;EACnB,aAAa;EACb,mBAAmB;EACnB,YAAY;EACZ,sBAAsB;AACxB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,WAAW;EACX,2BAA2B;EAC3B,yBAAyB;AAC3B;;AAEA;EACE,cAAc;EACd,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,YAAY;EACZ,mBAAmB;EACnB,yBAAyB;AAC3B;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,iBAAiB;AACnB","sourcesContent":["* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  position: relative;\n  height: 100vh;\n  overflow: hidden;\n}\n\n#sideload-msg {\n  min-height: 95vh;\n  display: flex;\n  align-items: center;\n  padding: 0 2rem;\n}\n\n.loader {\n  display: flex;\n}\n\n.loader__label {\n  margin-left: 0.5rem;\n  font-size: 1rem;\n  top: -2px !important;\n}\n\n.app {\n  min-height: 100vh;\n  display: none;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  padding: 0 2rem;\n  gap: 0.5rem;\n}\n\n.alert {\n  position: absolute;\n  top: 0.5rem;\n  left: 50%;\n  transform: translate(-50%, calc(-100% - 0.5rem));\n  display: flex;\n  width: 100%;\n  gap: 0.75rem;\n  padding: 1rem;\n  background: #fdfcd9;\n  max-width: 90%;\n  transition: all 0.2s ease;\n}\n\n#generateData {\n  margin-top: 0.5rem;\n  display: flex;\n  align-items: center;\n}\n\n#generateData svg {\n  height: 1rem;\n  color: white;\n}\n\n#syncData {\n  margin-top: 0.25rem;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem 1rem;\n}\n\n#syncData svg {\n  height: 1rem;\n}\n\n.app__bottom {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  transform: translateY(100%);\n  transition: all 0.2s ease;\n}\n\n.progress {\n  height: 1.5rem;\n  background: #41a6f5;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n}\n\n.progress__bar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background: #0078d7;\n  transition: all 0.2s ease;\n}\n\n.progress__text {\n  position: relative;\n  z-index: 1;\n  color: white;\n  font-weight: bold;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/api.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/api.js ***!
  \********************************************************************************************************/
/***/ (function(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \***************************************************************************************************************/
/***/ (function(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/liverisk/assets/liverisk.css":
/*!******************************************!*\
  !*** ./src/liverisk/assets/liverisk.css ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_cjs_js_liverisk_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/cjs.js!./liverisk.css */ "./node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/cjs.js!./src/liverisk/assets/liverisk.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_pnpm_style_loader_3_3_1_webpack_5_74_0_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_cjs_js_liverisk_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ __webpack_exports__["default"] = (_node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_cjs_js_liverisk_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_cjs_js_liverisk_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_pnpm_css_loader_6_7_1_webpack_5_74_0_node_modules_css_loader_dist_cjs_js_liverisk_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*********************************************************************************************************************************/
/***/ (function(module) {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*************************************************************************************************************************/
/***/ (function(module) {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***************************************************************************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \********************************************************************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/style-loader@3.3.1_webpack@5.74.0/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**************************************************************************************************************************/
/***/ (function(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************************!*\
  !*** ./src/liverisk/liverisk.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateData": function() { return /* binding */ generateData; }
/* harmony export */ });
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connection */ "./src/liverisk/connection/index.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./src/liverisk/store/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/liverisk/constants/index.js");
/* harmony import */ var _functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions/dashboardFunctions */ "./src/liverisk/functions/dashboardFunctions.js");
/* harmony import */ var _functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions/portfolioFunctions */ "./src/liverisk/functions/portfolioFunctions.js");
/* harmony import */ var _functions_hiddenDataFunctions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./functions/hiddenDataFunctions */ "./src/liverisk/functions/hiddenDataFunctions.js");
/* harmony import */ var _assets_liverisk_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./assets/liverisk.css */ "./src/liverisk/assets/liverisk.css");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }








var appBottom = document.querySelector(".app__bottom");
var progressBar = document.querySelector(".progress__bar");
var progressText = document.querySelector(".progress__text");
var dashboardListenerIsExist = false;
var portfolioListenerIsExist = false;
Office.onReady( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(info) {
    var sideload, mainApp, generateDataBtn, syncDataBtn, alert, alertText;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            setupLibraries();

            if (!(info.host === Office.HostType.Excel)) {
              _context3.next = 24;
              break;
            }

            sideload = document.getElementById("sideload-msg");
            mainApp = document.getElementById("app");
            generateDataBtn = document.getElementById("generateData");
            syncDataBtn = document.getElementById("syncData");
            alert = document.querySelector(".alert");
            alertText = document.querySelector(".alert__text");
            sideload.style.display = "none";
            mainApp.style.display = "flex";
            generateDataBtn.onclick = generateData;
            syncDataBtn.onclick = syncData;
            _store__WEBPACK_IMPORTED_MODULE_1__.connection.useProgressEffect(onProgressChange);
            _store__WEBPACK_IMPORTED_MODULE_1__.connection.useRandomizeDataEffect(onRandomizeChange);
            _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.setOnChange(function (sheets) {
              if ([_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD, _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO, _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.HIDDEN_DATA].every(function (name) {
                return sheets.map(function (sheet) {
                  return sheet.name;
                }).includes(name);
              })) {
                generateDataBtn.disabled = true;
                syncDataBtn.disabled = false;
              } else {
                generateDataBtn.disabled = false;
                syncDataBtn.disabled = true;
              }
            });
            _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.setOnChange(function (show, message) {
              if (show) {
                alert.style.transform = "translate(-50%, 0)";
                alertText.innerHTML = message;
                var timeout = setTimeout(function () {
                  _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.hideAlert();
                  clearTimeout(timeout);
                }, 5000);
              } else {
                alert.style.transform = "translate(-50%, calc(-100% - .5rem))";
              }
            });
            _context3.prev = 16;
            _context3.next = 19;
            return Excel.run( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(context) {
                var sheets;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        sheets = context.workbook.worksheets;
                        sheets.load("name");
                        _context2.next = 4;
                        return context.sync();

                      case 4:
                        _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.add(sheets.items.map(function (item) {
                          return {
                            id: item.id,
                            name: item.name
                          };
                        }));
                        context.workbook.worksheets.onAdded.add( /*#__PURE__*/function () {
                          var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
                            var sheet;
                            return _regeneratorRuntime().wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    sheet = context.workbook.worksheets.getItem(e.worksheetId);
                                    sheet.load("name");
                                    _context.next = 4;
                                    return context.sync();

                                  case 4:
                                    _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.add([{
                                      id: e.worksheetId,
                                      name: sheet.name
                                    }]);

                                  case 5:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x3) {
                            return _ref3.apply(this, arguments);
                          };
                        }());
                        context.workbook.worksheets.onDeleted.add(function (e) {
                          var sheet = _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.sheets.find(function (sheet) {
                            return sheet.id === e.worksheetId;
                          });

                          if (sheet.name === _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD) {
                            dashboardListenerIsExist = false;
                            _store__WEBPACK_IMPORTED_MODULE_1__.connection.setRandomizeData(false);
                          } else if (sheet.name === _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO) {
                            portfolioListenerIsExist = false;
                          }

                          _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.remove(e.worksheetId);
                        });
                        context.workbook.worksheets.onNameChanged.add(function (e) {
                          if (e.nameAfter !== e.nameBefore && ![_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD, _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO, _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.HIDDEN_DATA].includes(e.nameAfter)) {
                            var sheet = _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.sheets.find(function (sheet) {
                              return sheet.id === e.worksheetId;
                            });

                            if (sheet.name === _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD) {
                              dashboardListenerIsExist = false;
                              _store__WEBPACK_IMPORTED_MODULE_1__.connection.setRandomizeData(false);
                            } else if (sheet.name === _constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO) {
                              portfolioListenerIsExist = false;
                            }

                            _store__WEBPACK_IMPORTED_MODULE_1__.sheetStore.remove(e.worksheetId);
                          }
                        });

                      case 8:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 19:
            _context3.next = 24;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](16);
            _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.showAlert("<b>Failed to setup Live Risk Add-In!</b> Please reload this add-in!");

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[16, 21]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
function generateData() {
  if (_store__WEBPACK_IMPORTED_MODULE_1__.connection.connected) {
    generateSheets();
  } else {
    (0,_connection__WEBPACK_IMPORTED_MODULE_0__.connect)(_constants__WEBPACK_IMPORTED_MODULE_2__.CONNECTION_URL, generateSheets, generateSheets);
  }
}

var syncData = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (_store__WEBPACK_IMPORTED_MODULE_1__.connection.connected) {
              setListenerAndSync();
            }

            try {
              (0,_connection__WEBPACK_IMPORTED_MODULE_0__.connect)(_constants__WEBPACK_IMPORTED_MODULE_2__.CONNECTION_URL, setListenerAndSync, generateSheets);
            } catch (e) {
              _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.showAlert("<b>Failed to sync the data!</b> Please click the sync button again!");
              dashboardListenerIsExist = false;
              portfolioListenerIsExist = false;
            }

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function syncData() {
    return _ref4.apply(this, arguments);
  };
}();

var getAndUpdate = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return Excel.run( /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(context) {
                var dashboardSheet, portfolioSheet, randomize_range, parallel_shift_range, parallel_tilt_range, parallel_twist_range, numTradesRange, randomize, parallel_shift, parallel_tilt, parallel_twist, numTrades;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        dashboardSheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD);
                        portfolioSheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO);
                        randomize_range = dashboardSheet.getRange("B4");
                        parallel_shift_range = dashboardSheet.getRange("B5");
                        parallel_tilt_range = dashboardSheet.getRange("B6");
                        parallel_twist_range = dashboardSheet.getRange("B7");
                        numTradesRange = portfolioSheet.getRange("B4");
                        randomize_range.load("values");
                        parallel_shift_range.load("values");
                        parallel_tilt_range.load("values");
                        parallel_twist_range.load("values");
                        numTradesRange.load("values");
                        _context5.next = 14;
                        return context.sync();

                      case 14:
                        randomize = randomize_range.values[0][0];
                        parallel_shift = parallel_shift_range.values[0][0];
                        parallel_tilt = parallel_tilt_range.values[0][0];
                        parallel_twist = parallel_twist_range.values[0][0];
                        numTrades = numTradesRange.values[0][0];

                        if (randomize === "Y") {
                          _store__WEBPACK_IMPORTED_MODULE_1__.connection.setRandomizeData(true);
                        } else {
                          randomize_range.values = [["N"]];

                          if (typeof parallel_shift === "number" && parallel_shift >= -0.03 && parallel_shift <= 0.03) {
                            (0,_connection__WEBPACK_IMPORTED_MODULE_0__.updateParam)(1, "parallel_shift", parallel_shift);
                          } else {
                            parallel_shift_range.values = [[0]];
                          }

                          if (typeof parallel_tilt === "number" && parallel_tilt >= -0.03 && parallel_tilt <= 0.03) {
                            (0,_connection__WEBPACK_IMPORTED_MODULE_0__.updateParam)(1, "parallel_tilt", parallel_tilt);
                          } else {
                            parallel_tilt_range.values = [[0]];
                          }

                          if (typeof parallel_twist === "number" && parallel_twist >= -0.03 && parallel_twist <= 0.03) {
                            (0,_connection__WEBPACK_IMPORTED_MODULE_0__.updateParam)(1, "parallel_twist", parallel_twist);
                          } else {
                            parallel_twist_range.values = [[0]];
                          }
                        }

                        if (typeof numTrades === "number") {
                          (0,_connection__WEBPACK_IMPORTED_MODULE_0__.updateParam)(0, "NumTrades", numTrades);
                        } else {
                          parallel_shift_range.values = [[0]];
                        }

                      case 21:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x4) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 3:
            _context6.next = 8;
            break;

          case 5:
            _context6.prev = 5;
            _context6.t0 = _context6["catch"](0);
            _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.showAlert("<b>Failed to sync the data!</b> Please click the sync button again!");

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 5]]);
  }));

  return function getAndUpdate() {
    return _ref5.apply(this, arguments);
  };
}();

var setListenerAndSync = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return Excel.run( /*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(context) {
                var dashboardSheet, portfolioSheet;
                return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (!dashboardListenerIsExist) {
                          dashboardSheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD);
                          dashboardListenerIsExist = true;
                          dashboardSheet.onChanged.add(_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.onDashboardSheetChanged);
                        }

                        if (!portfolioListenerIsExist) {
                          portfolioSheet = context.workbook.worksheets.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO);
                          portfolioSheet.onChanged.add(_functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__.onPortfolioSheetChange);
                          portfolioListenerIsExist = true;
                        }

                        getAndUpdate();

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x5) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 3:
            _context8.next = 8;
            break;

          case 5:
            _context8.prev = 5;
            _context8.t0 = _context8["catch"](0);
            _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.showAlert("<b>Failed to setup the synchronization!</b> Please click the sync button again!");

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 5]]);
  }));

  return function setListenerAndSync() {
    return _ref7.apply(this, arguments);
  };
}();

var generateSheets = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _context10.next = 3;
            return Excel.run( /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(context) {
                var sheets, sheetNames, dashboardSheet;
                return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        sheets = context.workbook.worksheets;
                        sheets.load("name");
                        _context9.next = 4;
                        return context.sync();

                      case 4:
                        sheetNames = sheets.m__items.map(function (sheet) {
                          return sheet.name;
                        });

                        if (!sheetNames.includes(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.HIDDEN_DATA)) {
                          _context9.next = 9;
                          break;
                        }

                        (0,_functions_hiddenDataFunctions__WEBPACK_IMPORTED_MODULE_5__.printHiddenData)();
                        _context9.next = 13;
                        break;

                      case 9:
                        context.workbook.worksheets.add(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.HIDDEN_DATA);
                        _context9.next = 12;
                        return context.sync();

                      case 12:
                        (0,_functions_hiddenDataFunctions__WEBPACK_IMPORTED_MODULE_5__.printHiddenData)();

                      case 13:
                        if (!sheetNames.includes(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD)) {
                          _context9.next = 17;
                          break;
                        }

                        (0,_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.printDashboard)(function (sheet) {
                          if (!dashboardListenerIsExist) {
                            dashboardListenerIsExist = true;
                            sheet.onChanged.add(_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.onDashboardSheetChanged);
                          }
                        });
                        _context9.next = 22;
                        break;

                      case 17:
                        dashboardSheet = context.workbook.worksheets.add(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.DASHBOARD);
                        dashboardSheet.activate();
                        _context9.next = 21;
                        return context.sync();

                      case 21:
                        (0,_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.printDashboard)(function (sheet) {
                          if (!dashboardListenerIsExist) {
                            dashboardListenerIsExist = true;
                            sheet.onChanged.add(_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.onDashboardSheetChanged);
                          }
                        });

                      case 22:
                        if (!sheetNames.includes(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO)) {
                          _context9.next = 26;
                          break;
                        }

                        (0,_functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__.printPortfolio)(function (sheet) {
                          if (!portfolioListenerIsExist) {
                            portfolioListenerIsExist = true;
                            sheet.onChanged.add(_functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__.onPortfolioSheetChange);
                          }
                        });
                        _context9.next = 30;
                        break;

                      case 26:
                        context.workbook.worksheets.add(_constants__WEBPACK_IMPORTED_MODULE_2__.SHEET_NAMES.PORTFOLIO);
                        _context9.next = 29;
                        return context.sync();

                      case 29:
                        (0,_functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__.printPortfolio)(function (sheet) {
                          if (!portfolioListenerIsExist) {
                            portfolioListenerIsExist = true;
                            sheet.onChanged.add(_functions_portfolioFunctions__WEBPACK_IMPORTED_MODULE_4__.onPortfolioSheetChange);
                          }
                        });

                      case 30:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x6) {
                return _ref10.apply(this, arguments);
              };
            }());

          case 3:
            _context10.next = 8;
            break;

          case 5:
            _context10.prev = 5;
            _context10.t0 = _context10["catch"](0);
            _store__WEBPACK_IMPORTED_MODULE_1__.alertStore.showAlert("<b>Failed to generate sheets!</b> Please try again!");

          case 8:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 5]]);
  }));

  return function generateSheets() {
    return _ref9.apply(this, arguments);
  };
}();

var onProgressChange = function onProgressChange(progress) {
  var progressInPercentage = progress === 0 || progress === 1 ? progress * 100 + "%" : (progress * 100).toFixed(2) + "%";

  if (progress === 0 || progress === 1) {
    var timeout = setTimeout(function () {
      appBottom.style.transform = "translateY(100%)";
      clearTimeout(timeout);
    }, 500);
  } else {
    appBottom.style.transform = "translateY(0)";
  }

  progressBar.style.width = progressInPercentage;
  progressText.innerText = progressInPercentage;
};

var randomizeInterval;

var onRandomizeChange = function onRandomizeChange(randomize) {
  if (randomize) {
    (0,_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.updateParamsRandomly)();
    randomizeInterval = setInterval(_functions_dashboardFunctions__WEBPACK_IMPORTED_MODULE_3__.updateParamsRandomly, 4000);
  } else {
    if (randomizeInterval) clearInterval(randomizeInterval);
  }
};

var setupLibraries = function setupLibraries() {
  feather.replace();
  var SpinnerElements = document.querySelectorAll(".ms-Spinner");

  for (var i = 0; i < SpinnerElements.length; i++) {
    new fabric["Spinner"](SpinnerElements[i]);
  }
};
}();
/******/ })()
;
//# sourceMappingURL=liverisk.js.map