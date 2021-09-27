import {logout} from "../actions/userActions";


export const outdatedTokenMiddleware = (() => {
    return ({dispatch, getState}) => (next) => (action) => {
        // Use return; if you want thunk or other next middlewares will not receive the action.
        // If you want other middlewares to handle the action or maybe you didn't handle it at all, use next(action)
        let payload = action.payload;
        if (payload && typeof payload === "string" && payload.indexOf('Invalid/Expired token') === 0) {
            dispatch(logout());
            return;
        }
        return next(action);
    };
})();
