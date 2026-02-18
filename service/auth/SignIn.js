import { supabase } from '../../utils/supabase.js';
import AppError from "../../utils/appError.js";
import prisma from '../../utils/prisma.js';

export const signIn = async (req) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw new AppError("Email and password are required.", 400)

        const { data, error } = await supabase.auth.signInWithPassword({email,password,})

        if (error) 
        {
            console.log(error);
            switch (error.code) {
                case "invalid_email":
                case "invalid_credentials":
                case "user_not_found":
                case "wrong_password":
                    throw new AppError("Invalid email or password.", 400)
                case "email_not_confirmed":
                    throw new AppError("Email not confirmed. Please confirm your email.", 400)
                default:
                    throw new AppError("SignIn failed. Please try again.", 400)
            }
        }

        const userData = await prisma.user.findUnique({where: {id: data.user.id},
            select: {
                id: true,
                email: true,
                role: true,
                first_name: true,
                last_name: true,
                phone: true,
                avatar_url: true,
                isActive: true,
            }
        })
        if(!userData) {
            throw new AppError("User not found.", 400)
        }

        return {
            user: userData,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_in: data.session.expires_in,
            }
        }
    } catch (error) {
        if (error instanceof AppError) throw error
        throw new AppError(`SignIn failed, please try again later. ${error}`, 400)
    }
};
