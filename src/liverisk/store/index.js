class ConnectionStore {
	constructor() {
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

	setWs(ws) {
		this.ws = ws;
	}

	setConnected(bool) {
		this.connected = bool;
	}

	setDagNodes(dagNodes) {
		this.dagNodes = dagNodes;
	}

	setDagNodesInput(params, nodeIndex) {
		this.dagNodes[nodeIndex].input_params = {
			...this.dagNodes[nodeIndex].input_params,
			...params,
		};
	}

	setDagNodesOutput(output, nodeIndex) {
		this.dagNodes[nodeIndex].output_params = output;
	}

	setGotInitial(bool) {
		this.gotInitial = bool;
	}

	setStatus(nodeIndex, status) {
		this.dagNodesStatus[nodeIndex] = status;
	}

	setProgress(nodeIndex, progress) {
		this.dagNodesProgress[nodeIndex] = progress;
	}

	setLoadComplete(bool) {
		this.loadComplete = bool;
	}

	setInitialLoadProgress(progress) {
		this.initialLoadProgress = progress;
		this.progressEffect.forEach((cb) => {
			cb(this.initialLoadProgress);
		});
	}

	setRandomizeData(bool) {
		this.randomizeData = bool;
		this.randomizeDataEffect.forEach((cb) => {
			cb(bool);
		});
	}

	useProgressEffect(cb) {
		this.progressEffect.push(cb);
		cb(this.initialLoadProgress);
	}

	useRandomizeDataEffect(cb) {
		this.randomizeDataEffect.push(cb);
	}

	// getters
	get portfolio() {
		return this.dagNodes[0];
	}

	get priceAndRisk() {
		return this.dagNodes[1];
	}

	get portfolioNPV() {
		return this.priceAndRisk?.output_params?.PortfolioNPV || 0;
	}

	get totalTime() {
		return (this.priceAndRisk?.output_params?.CalcTime || 0).toFixed(2) + " ms";
	}

	get LM_info() {
		const lminfo = this.priceAndRisk?.output_params?.LM_info;

		if (!!lminfo === false) {
			return 0;
		} else {
			const goalfarr = lminfo.goalf.toString().split("e");
			goalfarr[0] = Number(goalfarr[0]).toFixed(2);
			const goalf = goalfarr.join("e");
			return `${lminfo?.NX || 0}x${lminfo?.NY || 0} niter:${lminfo?.niter || 0} ${goalf || 0}`;
		}
	}

	get irSwaps() {
		return this.portfolio?.input_params?.NumTrades || 0;
	}

	get curveBuildTime() {
		return (this.priceAndRisk?.output_params?.CurveBuildTimeMs || 0).toFixed(2) + " ms";
	}

	get portfolioBuildTime() {
		return (this.portfolio?.output_params?.CalcTime || 0).toFixed(2) + " ms";
	}

	get parallel_shift() {
		return this.priceAndRisk?.input_params?.parallel_shift || 0;
	}

	get parallel_tilt() {
		return this.priceAndRisk?.input_params?.parallel_tilt || 0;
	}

	get parallel_twist() {
		return this.priceAndRisk?.input_params?.parallel_twist || 0;
	}

	get marketRates() {
		return (this.portfolio?.output_params?.OriginalMarketRates || []).map((item, index) => {
			return [item[0], item[1], this.priceAndRisk?.output_params?.MarketRates[index][1] || null];
		});
	}

	get fitted_values() {
		return (this.priceAndRisk?.output_params?.fitted_values_discount || []).map((item, index) => {
			return [this.priceAndRisk?.output_params?.fitted_values_forecast[index] || null, item];
		});
	}

	get risk() {
		return this.priceAndRisk?.output_params?.Risk || [];
	}

	get trades() {
		return (this.portfolio?.output_params?.Trades || []).map((trade) => {
			return [trade.Maturity, trade.Nominal, trade["Start Date"], trade.Type, trade.lengthInYears];
		});
	}

	get npv() {
		return this.priceAndRisk?.output_params?.TradeNPV || [];
	}

	get tradesNPV() {
		return (this.trades || []).map((trade, index) => {
			return [...trade, this.npv[index]];
		});
	}

	get numTrades() {
		return this.portfolio?.input_params?.NumTrades || 0;
	}
}

export const connection = new ConnectionStore();

export class SheetStore {
	constructor() {
		this.sheets = [];
		this.onChange = () => {};
	}

	setOnChange(cb) {
		this.onChange = cb;
	}

	add(sheets) {
		this.sheets.push(...sheets);
		this.onChange(this.sheets);
	}

	remove(id) {
		this.sheets = this.sheets.filter((sheet) => sheet.id !== id);
		this.onChange(this.sheets);
	}
}
