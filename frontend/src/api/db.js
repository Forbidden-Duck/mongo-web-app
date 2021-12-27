import API from "./";
import { Utils } from "@forbidden_duck/super-mongo";

export const all = async () => {
    try {
        const data = (await API.get("dbs")).data;
        if (Array.isArray(data)) {
            for (const index in data) {
                data[index].password =
                    typeof data[index].password === "string"
                        ? Utils.Base64.decode(data[index].password)
                        : data[index].password;
            }
        }
        return data;
    } catch (err) {
        throw err.response.data;
    }
};

export const get = async (data) => {
    try {
        const data1 = (await API.get(`db/${data.id}`)).data;
        data1.password =
            typeof data1.password === "string"
                ? Utils.Base64.decode(data1.password)
                : data1.password;
        return data1;
    } catch (err) {
        throw err.response.data;
    }
};

export const create = async (data) => {
    try {
        data.db.password = !!data.db.password
            ? Utils.Base64.encode(data.db.password)
            : data.db.password;
        return (await API.post("db", data.db)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const update = async (data) => {
    try {
        data.db.password = !!data.db.password
            ? Utils.Base64.encode(data.db.password)
            : data.db.password;
        return (await API.put(`db/${data.id}`, data.db)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const delete1 = async (data) => {
    try {
        return (await API.delete(`db/${data.id}`)).data;
    } catch (err) {
        throw err.response.data;
    }
};
