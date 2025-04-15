import auth from "./auth.json";
import eventManagement from "./event-management.json";
import eventResponse from "./event-response.json";
import events from "./events.json";
import navigation from "./navigation.json";
import shared from "./shared.json";

export default {
	...auth,
	...eventManagement,
	...eventResponse,
	...events,
	...navigation,
	...shared,
};
