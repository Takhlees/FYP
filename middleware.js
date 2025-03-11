export {default } from "next-auth/middleware"

export const config = {
  matcher: ["/home","/about","/departments","/admins","/tutorial","/profile","/change-password"], // Apply middleware to all routes starting with "/api/auth"
}
 