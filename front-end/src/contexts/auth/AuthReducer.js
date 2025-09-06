export const InitialState = {
    accessToken: null,
    isAuthenticated: false,
    user: null
};

export function AuthReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                isAuthenticated: true,
                user: action.payload.user
            };
        case 'LOGOUT':
            localStorage.removeItem("accessToken");
            return {
                accessToken: null,
                isAuthenticated: false,
                user: null
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            };
        default:
            return state;
    }
}
