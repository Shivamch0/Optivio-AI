import api from './axios.js';

const registerUser = async(data) => {
    const res = await api.post("/users/register" , data)
    return res.data
}

const loginUser = async (data) => {
    const res = await api.post("/users/login" , data);
    return res.data;
}

const loginWithGoogle = async (idToken) => {
    const res = await api.post("/users/oauth/google", { idToken });
    return res.data;
}

const getSsoLogin = async () => {
    const res = await api.get("/users/sso/login");
    return res.data;
}

const logoutUser = async () => {
    const res = await api.post("/users/logout");
    return res.data;
}

const refreshToken = async () => {
    const res = await api.post("/users/refresh-token");
    return res.data;
}

const getCurrentUser = async () => {
    const res = await api.get('/users/current-user');
    return res.data;
}

const changePassword = async (data) => {
    const res = await api.patch("/users/change-password" , data);
    return res.data;
}

const requestPasswordReset = async (data) => {
    const res = await api.post("/users/forgot-password", data);
    return res.data;
}

const resetPassword = async (data) => {
    const res = await api.post("/users/reset-password", data);
    return res.data;
}

const changeDetails = async (data) => {
    const res = await api.patch("/users/update-details" , data)
    return res.data
}

export {registerUser , loginUser , loginWithGoogle, getSsoLogin, logoutUser , refreshToken , getCurrentUser , changeDetails , changePassword, requestPasswordReset, resetPassword}
