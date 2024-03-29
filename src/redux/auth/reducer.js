const initialState = {
    user: null,
    circles: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload }

        case "REMOVE_USER":
            return { ...state, user: null }

        default:
            return state
    }
}

export default reducer;