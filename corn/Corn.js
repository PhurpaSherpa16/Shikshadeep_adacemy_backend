// hitting api every day to keep the website alive
// free supabase version pause on 7 day of inacitivty
import corn from "node-cron"

export const startHitApiToKeepHealthy = () => {
    corn.schedule("0 0 * * *", async() => {
        try {
            console.log("⏱ Running hit api to keep healthy cron...")
            const response = await prisma.blog.findFirst({
                orderBy: {createdAt: "desc"},
                select: {title: true} 
            })
            if(response) console.log("✅ Latest blog:", response.title)
            else console.log("❌ No blogs found")
        } catch (error) {
            console.error("❌ Cron error:", error.message);
        }
    })
        
}