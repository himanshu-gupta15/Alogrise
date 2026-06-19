// // import axios from "axios";
// // import axiosClient from "./utils/axiosClient"
// // import reducer from "../../../14Dev 2/frontend/src/authSlice";
// // import { check } from "zod";
// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// // export const registerUser=createAsyncThunk(
// //     'auth/register',
// //     async(userData,{rejectWithValue})=>{
// //         try{
// //             const response=await axiosClient.post('/user/register',userData)
// //             return response.data.user;


// //         }catch(error){
// //             return rejectWithValue(error)
// //         }
// //     }

// // )

// // export const loginUser=createAsyncThunk(
// //     'auth/login',
// //     async(credentials,{rejectWithValue})=>{
// //         try{
// //           const response=await axiosClient.post("/user/login",credentials);
// //           return response.data.user;
// //         }catch(error){
// //             return rejectWithValue(error);
// //         }
// //     }
// // );

// // export const checkAuth=createAsyncThunk(
// //     'auth/check',
// //     async(_,{rejectWithValue})=>{
// //         try{
// //         const {data}=await axiosClient.get("/user/check");
// //         return data.user;
// //         }catch(error){
// //        if(error.response?.status===401){
// //         return rejectWithValue(null);
// //        }
// //        return rejectWithValue(error)
// //         }
// //     }
// // )

// // export const logoutUser=createAsyncThunk(
// //     'auth/logout',
// //     async(_,{rejectWithValue})=>{
// //         try{
// //          await axiosClient.post("/user/logout");
// //          return null;
// //         }catch(error){
// //             return rejectWithValue(error)
// //         }
// //     }
// // )

// // const authSlice=createSlice({
// //     name:'auth',
// //     initialState:{
// //         user:null,
// //         isAuthenticated:false,
// //         loading:false,
// //         error:null

// //     },
// //     reducers:{

// //     },
// //     exterReducers:(builder)=>{
// //         builder
// //         // Register user Cases 
// //         .addCase(registerUser.pending,(state)=>{
// //             state.loading=true,
// //             state.error=null;
// //         })
// //         .addCase(registerUser.fulfilled,(state,action)=>{
// //             state.loading=false;
// //             state.isAuthenticated=!!action.payload;
// //             state.user=action.payload;
// //         })

// //         .addCase(registerUser.rejected,(state,action)=>{
// //             state.loading=false;
// //             state.error=action.payload?.message || "Something went wrong";
// //             state.user=null;


// //         })
      
// //         // Login user cases 
// //         .addCase(loginUser.pending,(state,action)=>{
// //             state.loading=true;
// //             state.error=null;
// //         })
// //         .addCase(loginUser.fulfilled,(state,action)=>{
// //             state.loading=false;
// //             state.isAuthenticated=!!action.payload;
// //             state.user=action.payload;
// //         })
// //         .addCase(loginUser.rejected,(state,action)=>{
// //             state.loading=false,
// //             state.error=action.payload?.message || 'Something went wrong';
// //             state.isAuthenticated=false;
// //             state.user=null;
// //         })

// //         // Check Auth Cases 
// //         .addCase(checkAuth.pending,(state)=>{
// //             state.loading=true,
// //             state.error=null;
// //         })
// //         .addCase(checkAuth.fulfilled,(state,action)=>{
// //             state.loading=false;
// //             state.isAuthenticated=!!action.payload;
// //             state.user=action.payload;
// //         })
// //         .addCase(checkAuth.rejected,(state,action)=>{
// //             state.loading=false;
// //             state.error=action.payload?.message ||"Something went wrong";
// //             state.isAuthenticated=false;
// //             state.user=null;

// //         })

// //         // Logout User Cases 
// //         .addCase(logoutUser.pending,(state)=>{
// //             state.loading=true;
// //             state.error=null;

// //         })
// //         .addCase(logoutUser.fulfilled,(state)=>{
// //             state.loading=false;
// //             state.user=null;
// //             state.isAuthenticated=false;
// //             state.user=null;
// //         })
// //         .addCase(logoutUser.rejected,(state,action)=>{
// //             state.loading=false;
// //             state.error=action.payload?.message || 'Something went wrong';
// //             state.isAuthenticated=false;
// //             state.user=null;
// //         })

// //     }
// // })

// // export default authSlice.reducer;


// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// // import axiosClient from "./utils/axiosClient";

// // // Helper to extract serializable error messages
// // const getErrorMessage = (error) => {
// //     // If backend sends res.status(400).send("Error: message"), it's in error.response.data
// //     return error.response?.data || error.message || "Something went wrong";
// // };

// // export const registerUser = createAsyncThunk(
// //     'auth/register',
// //     async (userData, { rejectWithValue }) => {
// //         try {
// //             const response = await axiosClient.post('/user/register', userData);
// //             return response.data.user;
// //         } catch (error) {
// //             return rejectWithValue(getErrorMessage(error));
// //         }
// //     }
// // );

// // export const loginUser = createAsyncThunk(
// //     'auth/login',
// //     async (credentials, { rejectWithValue }) => {
// //         try {
// //             const response = await axiosClient.post("/user/login", credentials);
// //             return response.data.user;
// //         } catch (error) {
// //             return rejectWithValue(getErrorMessage(error));
// //         }
// //     }
// // );

// // export const checkAuth = createAsyncThunk(
// //     'auth/check',
// //     async (_, { rejectWithValue }) => {
// //         try {
// //             const { data } = await axiosClient.get("/user/check");
// //             return data.user;
// //         } catch (error) {
// //             if (error.response?.status === 401) {
// //                 return rejectWithValue(null);
// //             }
// //             return rejectWithValue(getErrorMessage(error));
// //         }
// //     }
// // );

// // export const logoutUser = createAsyncThunk(
// //     'auth/logout',
// //     async (_, { rejectWithValue }) => {
// //         try {
// //             await axiosClient.post("/user/logout");
// //             return null;
// //         } catch (error) {
// //             return rejectWithValue(getErrorMessage(error));
// //         }
// //     }
// // );

// // const authSlice = createSlice({
// //     name: 'auth',
// //     initialState: {
// //         user: null,
// //         isAuthenticated: false,
// //         loading: false,
// //         error: null,
// //         allUsers:[],
// //     },
// //     reducers: {
// //         // You can add clearError reducer here if needed
// //         clearError: (state) => {
// //             state.error = null;
// //         },
// //         setUser: (state, action) => {
// //       state.user = action.payload;
// //     },
// //     // Action to store the global user list
// //     setAllUsers: (state, action) => {
// //       state.allUsers = action.payload;
// //     },
// //     // Action to update a single user's role globally
// //     updateUserRole: (state, action) => {
// //       const { userId, newRole } = action.payload;
// //       const user = state.allUsers.find(u => u._id === userId);
// //       if (user) user.role = newRole;
// //     }
// //     },
// //     extraReducers: (builder) => { // Fixed typo from 'exterReducers'
// //         builder
// //             // Register User
// //             .addCase(registerUser.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(registerUser.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.isAuthenticated = true;
// //                 state.user = action.payload;
// //             })
// //             .addCase(registerUser.rejected, (state, action) => {
// //                 state.loading = false;
// //                 // action.payload is now just the string message
// //                 state.error = action.payload;
// //                 state.user = null;
// //             })
// //             // Login User
// //             .addCase(loginUser.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(loginUser.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.isAuthenticated = true;
// //                 state.user = action.payload;
// //             })
// //             .addCase(loginUser.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.payload;
// //                 state.isAuthenticated = false;
// //             })
// //             // Check Auth
// //             .addCase(checkAuth.pending, (state) => {
// //                 state.loading = true;
// //             })
// //             .addCase(checkAuth.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.isAuthenticated = !!action.payload;
// //                 state.user = action.payload;
// //             })
// //             .addCase(checkAuth.rejected, (state) => {
// //                 state.loading = false;
// //                 state.isAuthenticated = false;
// //                 state.user = null;
// //             })
// //             // Logout User
// //             .addCase(logoutUser.fulfilled, (state) => {
// //                 state.loading = false;
// //                 state.user = null;
// //                 state.isAuthenticated = false;
// //             });
// //     }
// // });

// // export const { clearError ,setUser, setAllUsers, updateUserRole} = authSlice.actions;
// // export default authSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axiosClient from "./utils/axiosClient";

// // ---------- Helper ----------
// const getErrorMessage = (error) => {
//   return (
//     error.response?.data?.message ||
//     error.response?.data ||
//     error.message ||
//     "Something went wrong"
//   );
// };

// // ---------- Thunks ----------
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const res = await axiosClient.post("/user/register", userData);
//       return res.data.user;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const res = await axiosClient.post("/user/login", credentials);
//       return res.data.user;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const checkAuth = createAsyncThunk(
//   "auth/check",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosClient.get("/user/check");
//       return res.data.user;
//     } catch (error) {
//       if (error.response?.status === 401) {
//         return rejectWithValue(null);
//       }
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosClient.post("/user/logout");
//       return null;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// // ---------- Slice ----------
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: true,
//     error: null,
//     allUsers: [],
//   },

//   reducers: {
//     clearError(state) {
//       state.error = null;
//     },
//     setUser(state, action) {
//       state.user = action.payload;
//       state.isAuthenticated = !!action.payload;
//     },
//     setAllUsers(state, action) {
//       state.allUsers = action.payload;
//     },
//     updateUserRole(state, action) {
//       const { userId, newRole } = action.payload;
//       const user = state.allUsers.find((u) => u._id === userId);
//       if (user) user.role = newRole;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // REGISTER
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.user = null;
//         state.isAuthenticated = false;
//       })

//       // CHECK AUTH
//       .addCase(checkAuth.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = !!action.payload;
//       })
//       .addCase(checkAuth.rejected, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })

//       // LOGOUT
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const {
//   clearError,
//   setUser,
//   setAllUsers,
//   updateUserRole,
// } = authSlice.actions;

// export default authSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

// ---------- Helper ----------
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    "Something went wrong"
  );
};

// ---------- Thunks ----------
// ... (registerUser, loginUser, checkAuth, logoutUser remain the same)
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const googleAuthUser = createAsyncThunk(
    'auth/googleAuth',
    async (accessToken, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/google-auth', { accessToken });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/login", credentials);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get("/user/check");
            return data.user;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue(null);
            }
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post("/user/logout");
            return null;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// ---------- Slice ----------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    allUsers: [],
  },

  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    updateUserRole(state, action) {
      const { userId, newRole } = action.payload;
      const user = state.allUsers.find((u) => u._id === userId);
      if (user) user.role = newRole;
    },
    // NEW REDUCER: Update stats after problem solve
    updateUserStats(state, action) {
      if (state.user) {
        state.user.streak = action.payload.streak; // Updated daily streak
        state.user.globalRank = action.payload.globalRank; // Updated competitive rank
        state.user.xp = action.payload.xp; // Updated experience points
      }
    }
  },

 extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // GOOGLE AUTH
      .addCase(googleAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(googleAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});;

export const {
  clearError,
  setUser,
  setAllUsers,
  updateUserRole,
  updateUserStats // Ensure this is exported
} = authSlice.actions;

export default authSlice.reducer;