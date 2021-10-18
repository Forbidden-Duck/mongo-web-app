import API from "./";

export const get = async () => {
    try {
        return (await API.get("user")).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const update = async (data) => {
    try {
        return (await API.put("user", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const delete1 = async (data) => {
    try {
        return (await API.delete("user", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};
