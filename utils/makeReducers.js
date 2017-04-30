export default (reducers, initialState) => (state = initialState, action) => (
  reducers[action.type] ? reducers[action.type](state, action) : state
)
