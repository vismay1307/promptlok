import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

router.get("/test", (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Backend authentication successful",
    userId,
  });
});

export default router;