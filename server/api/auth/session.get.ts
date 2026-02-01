import { auth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const session = await auth.api.getSession({
            headers: event.headers
        });

        if (!session) {
            return {
                authenticated: false,
                user: null
            };
        }

        return {
            authenticated: true,
            user: {
                id: session.user.id,
                name: session.user.name,
                username: (session.user as any).username,
                role: (session.user as any).role,
                irbanUnit: (session.user as any).irbanUnit,
            }
        };
    } catch (error: any) {
        return {
            authenticated: false,
            user: null,
            error: error.message
        };
    }
});
