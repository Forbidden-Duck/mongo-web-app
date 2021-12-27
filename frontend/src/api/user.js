import API from "./";
import * as Base64 from "../utils/base64";

export const get = async () => {
    try {
        return (await API.get("user")).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const update = async (data) => {
    try {
        if (data.password) {
            data.password = Base64.encode(data.password);
            data.currentPassword = Base64.encode(data.currentPassword);
        }
        return (await API.put("user", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const delete1 = async (data) => {
    try {
        data.password = !!data.password
            ? Base64.encode(data.password)
            : data.password;
        return (await API.delete("user", { data })).data;
    } catch (err) {
        throw err.response.data;
    }
};
