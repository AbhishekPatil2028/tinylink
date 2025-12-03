import { LinkService } from "../services/link.service.js";

export const handleRedirect = async (req, res) => {
  const { code } = req.params;

  const link = await LinkService.findByCode(code);
  if (!link) return res.status(404).send("Not Found");

  await LinkService.incrementClicks(code);

  return res.redirect(302, link.target_url);
};
