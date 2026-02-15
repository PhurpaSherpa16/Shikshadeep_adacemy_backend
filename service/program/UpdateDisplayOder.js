import prisma from "../../utils/prisma.js";
import AppError from "../../utils/appError.js";

export const updateDisplayOrder = async (req) => {
    try {
        if (!req.body) {
            throw new AppError("Request body is missing. Ensure you are sending JSON with correct headers.", 400);
        }
        const { items } = req.body

        if (!Array.isArray(items) || items.length === 0) {
            throw new AppError("A non-empty array of items is required", 400);
        }

        // bulk update in transaction to handle unique constraint
        await prisma.$transaction(async (tx) => {
            // temp displayOrder providing for bypassing unique error
            for (let i = 0; i < items.length; i++) {
                await tx.program.update({
                    where: { id: items[i].id },
                    data: { displayOrder: 10000 + i }
                });
            }

            // giving final displayOrder
            for (let i = 0; i < items.length; i++) {
                await tx.program.update({
                    where: { id: items[i].id },
                    data: { displayOrder: items[i].displayOrder }
                });
            }
        });

        return { message: "Display order updated successfully" };

    } catch (error) {
        console.error("Error in updateDisplayOrder:", error);
        
        if (error.code === 'P2002') {
             throw new AppError("Unique constraint error during reordering. Please refresh and try again.", 400);
        }

        if (error instanceof AppError) throw error;
        throw new AppError("Failed to update display order, please try again later.", 500);
    }
}