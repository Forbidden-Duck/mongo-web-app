import API from "./";
import * as Base64 from "../utils/base64";

export const register = async (data) => {
    try {
        data.password = !!data.password
            ? Base64.encode(data.password)
            : data.password;
        return (await API.post("auth/register", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const login = async (data) => {
    try {
        data.password = !!data.password
            ? Base64.encode(data.password)
            : data.password;
        return (await API.post("auth/login", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const logout = async () => {
    try {
        return (await API.post("auth/logout")).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const verify = async (token) => {
    try {
        return (await API.get(`auth/verify/${token}`)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const resend = async () => {
    try {
        return (await API.post("auth/verify/resend")).data;
    } catch (err) {
        throw err.response.data;
    }
};
