import * as updateProfile from "./user/UpdateProfile.js";
import * as getProfile from "./user/GetProfile.js";

export const userService = {
    ...updateProfile,
    ...getProfile
};
