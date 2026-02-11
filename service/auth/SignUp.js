import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from '../../utils/prisma.js';

export const signUp = async (req) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new AppError("Email and password are required", 400);

        const { data, error } = await supabase.auth.signUp({email,password,})

        if(data.user){
            const { error: profileError } = await prisma.user.create({
                data: {
                    id: data.user.id,
                    email: data.user.email,
                    role: 'ADMIN',
                    first_name: 'Admin',
                    last_name: 'Admin',
                    phone: '',
                    avatar_url: '',
                    isActive: false,
                }
            })
            if (profileError) {
                console.log('error from supabase: ',profileError)
                throw new AppError('Profile creation failed, please try again later.', 400)
            }
        }

        if (error) {
            console.log("Signup error:", error);

            switch (error.code) {
                case "weak_password":
                    throw new AppError("Password must be at least 6 characters.", 400);
                case "email_already_in_use":
                case "user_already_exists":
                    throw new AppError("Email already registered.", 400);
                case "over_email_send_rate_limit":
                    throw new AppError("Too many attempts. Try again later.", 429);
                default:
                    throw new AppError("Signup failed. Please try again.", 400);
            }
        }


        return data
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) throw error
        throw new AppError('Signup failed, please try again later.', 400);
    }
}
