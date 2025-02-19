import {MutableUserData} from "../../../backend/models/user";

const editUserData = (userData: MutableUserData, updatedValues: Record<string, string>): MutableUserData => {
    for (const key in updatedValues) {
        if (Object.prototype.hasOwnProperty.call(updatedValues, key) && key in userData) {
            (userData as any)[key] = updatedValues[key];
        }
    }
    return userData;
};

export default editUserData;