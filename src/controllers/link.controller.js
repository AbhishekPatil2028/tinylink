import { LinkService } from "../services/link.service.js";
import { generateCode } from "../utils/generateCode.js";

export const createLink = async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      new URL(url); // validate URL
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Generate code if not provided
    if (!code) code = generateCode(6);

    // Validate pattern
    const pattern = /^[A-Za-z0-9]{6,8}$/;
    if (!pattern.test(code)) {
      return res.status(400).json({ error: "Code must be 6-8 alphanumeric characters" });
    }

    // Check duplicate
    const exists = await LinkService.findByCode(code);
    if (exists) {
      return res.status(409).json({ error: "Custom code already exists" });
    }

    const link = await LinkService.createLink({ code, url });

    return res.status(201).json({
      ...link,
      short_url: `${process.env.BASE_URL}/${link.code}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const listLinks = async (req, res) => {
  const links = await LinkService.listLinks();
  res.json(links);
};

export const linkStats = async (req, res) => {
  const link = await LinkService.findByCode(req.params.code);
  if (!link) return res.status(404).json({ error: "Not found" });
  res.json(link);
};

export const deleteLink = async (req, res) => {
  await LinkService.deleteLink(req.params.code);
  res.status(204).send();
};
