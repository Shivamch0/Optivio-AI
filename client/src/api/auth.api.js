import api from './axios.js';

const registerUser = async(data) => {
    const res = await api.post("/users/register" , data)
    return res.data
}

const loginUser = async (data) => {
    const res = await api.post("/users/login" , data);
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
    const res = await api.put("/users/change-password" , data);
    return res.data;
}

const changeDetails = async (data) => {
    const res = await api.put("/users/update-details" , data)
    return res.data
}

export {registerUser , loginUser , logoutUser , refreshToken , getCurrentUser , changeDetails , changePassword}