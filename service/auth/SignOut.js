import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) throw new AppError(error.message, error.status || 400)
            
        return { message: "Signed out successfully" }
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) throw error
        throw new AppError(error.message, error.status || 400)
    }
};
