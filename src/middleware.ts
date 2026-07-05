import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  "/a", // Add any additional routes here
  "/a/home", // Add any additional routes here
  "/a/conversations", // Add any additional routes here
  "/a/profile", // Add any additional routes here
]);
// Update clerkMiddleware to manually protect routes
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches the defined criteria
  }
  // if (req.url.startsWith("/a")) {
  //   auth().allow(); // Allow the route if it matches the defined criteria
  // }
});
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
