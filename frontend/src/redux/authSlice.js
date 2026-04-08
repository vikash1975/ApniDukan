import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userSignup, userLogin, adminSignup, adminLogin } from '../services/api';

export const signupUser = createAsyncThunk('auth/signup', async ({name,email,password}, {rejectWithValue}) => {
  try {
    const response = await userSignup({name,email,password});
    const {token,user:userData} = response.data;
    localStorage.setItem('token',token);
    localStorage.setItem('role','user');
    localStorage.setItem('user',JSON.stringify(userData));
    return {token,role:'user',...userData};
  } catch (err) {
    return rejectWithValue(err.response?.data?.message||'Signup failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async ({email,password}, {rejectWithValue}) => {
  try {
    const response = await userLogin({email,password});
    const token = response.data.token;
    const userData = {name:response.data.name,email:response.data.email,role:response.data.role};
    localStorage.setItem('token',token);
    localStorage.setItem('role',userData.role);
    localStorage.setItem('user',JSON.stringify(userData));
    return {token,...userData};
  } catch (err) {
    return rejectWithValue(err.response?.data?.message||'Login failed');
  }
});

export const signupAdmin = createAsyncThunk('auth/adminSignup', async ({name,email,password,adminSecret}, {rejectWithValue}) => {
  try {
    const response = await adminSignup({name,email,password,adminSecret});
    const {token} = response.data;
    localStorage.setItem('token',token);
    localStorage.setItem('role','admin');
    localStorage.setItem('user',JSON.stringify({email,name}));
    return {token,role:'admin',email,name};
  } catch (err) {
    return rejectWithValue(err.response?.data?.message||'Admin signup failed');
  }
});

export const loginAdmin = createAsyncThunk('auth/adminLogin', async ({email,password}, {rejectWithValue}) => {
  try {
    const response = await adminLogin({email,password});
    const {token} = response.data;
    localStorage.setItem('token',token);
    localStorage.setItem('role','admin');
    localStorage.setItem('user',JSON.stringify({email}));
    return {token,role:'admin',email};
  } catch (err) {
    return rejectWithValue(err.response?.data?.message||'Admin login failed');
  }
});

const getInitialState = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userData = localStorage.getItem('user');
  let parsedUser = {};
  try { parsedUser = userData?JSON.parse(userData):{}; } catch(e) { parsedUser={}; }
  if(token&&role) return {user:{token,role,...parsedUser},loading:false,error:null};
  return {user:null,loading:false,error:null};
};

const authSlice = createSlice({
  name:'auth',
  initialState:getInitialState(),
  reducers:{
    logout:(state)=>{localStorage.removeItem('token');localStorage.removeItem('role');localStorage.removeItem('user');localStorage.removeItem('cart');state.user=null;state.error=null;},
    clearError:(state)=>{state.error=null;},
    initializeAuth:(state)=>{const token=localStorage.getItem('token');const role=localStorage.getItem('role');const userData=localStorage.getItem('user');let parsedUser={};try{parsedUser=userData?JSON.parse(userData):{};}catch(e){parsedUser={};}if(token&&role){state.user={token,role,...parsedUser};}state.loading=false;}
  },
  extraReducers:(builder)=>{
    builder.addCase(signupUser.pending,(state)=>{state.loading=true;state.error=null;})
           .addCase(signupUser.fulfilled,(state,action)=>{state.loading=false;state.user=action.payload;})
           .addCase(signupUser.rejected,(state,action)=>{state.loading=false;state.error=action.payload;})
           .addCase(loginUser.pending,(state)=>{state.loading=true;state.error=null;})
           .addCase(loginUser.fulfilled,(state,action)=>{state.loading=false;state.user=action.payload;})
           .addCase(loginUser.rejected,(state,action)=>{state.loading=false;state.error=action.payload;})
           .addCase(signupAdmin.pending,(state)=>{state.loading=true;state.error=null;})
           .addCase(signupAdmin.fulfilled,(state,action)=>{state.loading=false;state.user=action.payload;})
           .addCase(signupAdmin.rejected,(state,action)=>{state.loading=false;state.error=action.payload;})
           .addCase(loginAdmin.pending,(state)=>{state.loading=true;state.error=null;})
           .addCase(loginAdmin.fulfilled,(state,action)=>{state.loading=false;state.user=action.payload;})
           .addCase(loginAdmin.rejected,(state,action)=>{state.loading=false;state.error=action.payload;});
  }
});

export const {logout,clearError,initializeAuth}=authSlice.actions;
export const selectAuth=(state)=>state.auth;
export const selectUser=(state)=>state.auth.user;
export const selectLoading=(state)=>state.auth.loading;
export const selectError=(state)=>state.auth.error;
export const selectIsAuthenticated=(state)=>!!state.auth.user&&!!localStorage.getItem('token');
export const selectIsAdmin=(state)=>state.auth.user?.role==='admin';
export const selectIsUserRole=(state)=>state.auth.user?.role==='user';

export default authSlice.reducer;