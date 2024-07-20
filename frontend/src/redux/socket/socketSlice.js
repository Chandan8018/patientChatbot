import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null, // Do not persist this
  onlineUsers: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { setSocket, setOnlineUsers, disconnectSocket } =
  socketSlice.actions;
export default socketSlice.reducer;
