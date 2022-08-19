import { connection, alertStore } from "../store";
import { convertData } from "../utils";
import { STATUS } from "../constants";

export const connect = (url, onInitial, onChange = () => {}) => {
	const on_error = () => {
		alertStore.showAlert("Failed to connect to Websocket! Please try connecting again!");
	};

	const on_open = () => {
		connection.setConnected(true);
		connection.setGotInitial(false);
	};

	const on_close = () => {
		connection.setWs(null);
		connection.setConnected(false);
		console.log("close");
	};

	const on_message = (message) => {
		processMessage(message, onInitial, onChange);
		// console.log(message);
	};

	if (connection.connected) {
		return;
	}

	try {
		const ws = new WebSocket(url);

		ws.onerror = on_error;
		ws.onclose = on_close;
		ws.onmessage = on_message;
		ws.onopen = on_open;

		connection.setWs(ws);
	} catch (e) {
		console.log(e);
	}
};

export const disconnect = () => {
	if (!connection.connected) {
		return;
	}

	connection.ws.close();
};

let doneInitialEffect = false;

const processMessage = (message, onInitial, onChange) => {
	if (!connection.gotInitial) {
		try {
			const data = convertData(message);

			connection.ws.send(
				JSON.stringify({
					type: "got_message",
				})
			);

			connection.setDagNodes(data.dag_nodes);
			data.dag_nodes.forEach((node, index) => {
				connection.setStatus(index, STATUS.NOT_READY);

				connection.setProgress(index, 0);
			});
			addMoreInputParams();
			connection.setGotInitial(true);
		} catch (e) {
			console.log("Can not parse dag nodes");
		}
	} else {
		const data = convertData(message);

		if (data.type === "dirty_nodes") {
			connection.setInitialLoadProgress(0.01);
		}

		if (data.type === "progress") {
			if (!connection.loadComplete && data.node_ind === 0) {
				connection.setInitialLoadProgress(data.progress);
			}
			connection.setStatus(data.node_ind, STATUS.IN_PROGRESS);
			connection.setProgress(data.node_ind, data.progress);
		} else if (data.type === "completed") {
			connection.setInitialLoadProgress(1);
			connection.setStatus(data.node_ind, STATUS.COMPLETED);
			connection.setProgress(data.node_ind, 1);
			connection.setDagNodesOutput(data.results, data.node_ind);
			if (data.node_ind === 1 && !doneInitialEffect) {
				onInitial();
				doneInitialEffect = true;
			} else if (data.node_ind === 1) {
				onChange();
			}
		}
	}
};

export const updateParam = (nodeIndex, key, value) => {
	if (connection.connected) {
		connection.ws.send(
			JSON.stringify({
				type: "param_update",
				node_ind: nodeIndex,
				key,
				value: String(value),
			})
		);

		const params = {};
		params[key] = value;
		connection.setDagNodesInput(params, nodeIndex);
	}
};

const addMoreInputParams = () => {
	connection.setDagNodesInput(
		{
			parallel_tilt: 0,
			parallel_twist: 0,
		},
		1
	);
};
