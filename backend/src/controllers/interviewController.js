import mongoose from "mongoose";
import InterviewPack from "../models/interviewPack.js";
import Purchase from "../models/purchase.js";

const normalizePayload = (body = {}) => {
  const payload = { ...body };

  if (typeof payload.packId === "string") payload.packId = payload.packId.trim().toLowerCase();
  if (typeof payload.company === "string") payload.company = payload.company.trim();
  if (typeof payload.role === "string") payload.role = payload.role.trim();
  if (typeof payload.type === "string") payload.type = payload.type.trim().toLowerCase();
  if (typeof payload.currency === "string") payload.currency = payload.currency.trim().toLowerCase();
  if (typeof payload.description === "string") payload.description = payload.description.trim();

  if (payload.isPremium === false) payload.priceInCents = 0;

  return payload;
};

const createInterviewPack = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (!payload.packId || !payload.company || !payload.role || !payload.type) {
      return res.status(400).json({ error: "packId, company, role and type are required" });
    }

    const exists = await InterviewPack.findOne({ packId: payload.packId });
    if (exists) {
      return res.status(409).json({ error: "Pack with same packId already exists" });
    }

    const doc = await InterviewPack.create({
      ...payload,
      createdBy: req.result._id,
    });

    return res.status(201).json({ message: "Interview pack created", pack: doc });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create interview pack", details: error.message });
  }
};

const updateInterviewPack = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid pack id" });
    }

    const payload = normalizePayload(req.body);

    if (payload.packId) {
      const duplicate = await InterviewPack.findOne({ packId: payload.packId, _id: { $ne: id } });
      if (duplicate) {
        return res.status(409).json({ error: "Another pack already uses this packId" });
      }
    }

    const updated = await InterviewPack.findByIdAndUpdate(id, payload, {
      runValidators: true,
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Interview pack not found" });
    }

    return res.status(200).json({ message: "Interview pack updated", pack: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update interview pack", details: error.message });
  }
};

const deleteInterviewPack = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid pack id" });
    }

    const deleted = await InterviewPack.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Interview pack not found" });
    }

    return res.status(200).json({ message: "Interview pack deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete interview pack", details: error.message });
  }
};

const getAdminInterviewPacks = async (_req, res) => {
  try {
    const packs = await InterviewPack.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(packs);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch interview packs", details: error.message });
  }
};

const getPublicInterviewPacks = async (req, res) => {
  try {
    const packs = await InterviewPack.find({ isActive: true })
      .select("packId company role type sets attempted successRate isPremium priceInCents currency description")
      .sort({ isPremium: 1, attempted: -1 })
      .lean();

    const userId = req.result?._id;
    let purchasedPackIds = new Set();
    if (userId) {
      const purchases = await Purchase.find({ userId, paid: true }).select("packId").lean();
      purchasedPackIds = new Set(purchases.map(p => p.packId));
    }

    const packsWithPurchaseInfo = packs.map((pack) => ({
      ...pack,
      isPurchased: purchasedPackIds.has(pack.packId),
    }));

    return res.status(200).json(packsWithPurchaseInfo);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch interview packs", details: error.message });
  }
};

export {
  createInterviewPack,
  updateInterviewPack,
  deleteInterviewPack,
  getAdminInterviewPacks,
  getPublicInterviewPacks,
};
