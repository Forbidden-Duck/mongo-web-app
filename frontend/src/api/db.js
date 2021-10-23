import API from "./";

export const all = async () => {
    try {
        return (await API.get("dbs")).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const get = async (data) => {
    try {
        return (await API.get(`db/${data.id}`)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const create = async (data) => {
    try {
        return (await API.post("db", data.db)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const update = async (data) => {
    try {
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
