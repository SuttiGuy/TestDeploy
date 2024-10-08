import { Request, Response } from "express";
import HomeStayModel from "../model/homestay.model";

const getAllHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const homestays = await HomeStayModel.find();
    res.status(200).json(homestays);
  } catch (err) {
    console.log(err);
    res.status(500).send("Have an error on server!");
  }
};

const searchByTypeHomeStay = async (
  req: Request,
  res: Response
): Promise<void> => {
  const type_homeStay = req.params.type_homeStay;
  try {
    const homeStayType = await HomeStayModel.findOne({ type_homeStay });
    if (!homeStayType) {
      res.status(404).send("Not Found HomeStay type: " + type_homeStay);
    }
    res.status(200).json({ homeStayType });
  } catch (err) {
    console.log(err);
    res.status(500).send("Have an error on server");
  }
};

const getByIdHomeStay = async (req: Request, res: Response): Promise<void> => {
  try {
    const homeStayId = req.params.id;
    const data = await HomeStayModel.findById(homeStayId);
    if (!data) {
      res.status(404).json({ message: "HomeStay not found" });
    } else {
      res.json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getByIdBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const homeStayId = req.params.id;
    const data = await HomeStayModel.find({ business_user: homeStayId });
    if (!data) {
      res.status(404).json({ message: "HomeStay not found" });
    } else {
      res.json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const createHomeStay = async (req: Request, res: Response): Promise<void> => {
  const homeStayData = req.body;
  const newHomeStay = new HomeStayModel(homeStayData);
  try {
    const savedHomeStay = await newHomeStay.save();
    res.status(201).json(savedHomeStay);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getByPriceHomeStay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const price = req.params.price;
    const homeStayPrice = await HomeStayModel.findOne({
      price_homeStay: price,
    });
    if (!homeStayPrice) {
      res.status(404).json({ message: "Not found homeStay price" });
    } else {
      res.json(homeStayPrice);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateHomeStay = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedHomeStay = await HomeStayModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedHomeStay) {
      res.status(404).json({ message: "HomeStay Not Found" });
    } else {
      res.status(200).json({ message: "HomeStay Updated!", updatedHomeStay });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHomeStay = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await HomeStayModel.findByIdAndDelete(id);
    if (!data) {
      res.status(404).json({ message: "HomeStay Not Found" });
    } else {
      res.status(200).json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const searchHomeStay = async (req: Request, res: Response): Promise<void> => {
  const name = req.query.name_homeStay as string;
  const type = req.query.type_homeStay as string;

  const detail = req.query.detail_homeStay as string;
  try {
    const data = await HomeStayModel.find({
      $or: [
        { name_homeStay: { $regex: new RegExp(name, "i") } },
        { type_homeStay: { $regex: new RegExp(type, "i") } },
        { detail_homeStay: { $regex: new RegExp(detail, "i") } },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeStatus = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const { status_sell_homeStay } = req.body; // รับค่าใหม่จาก body

  try {
    if (!status_sell_homeStay) {
      return res.status(400).json({ message: "Status is required" });
    }

    const data = await HomeStayModel.findByIdAndUpdate(
      id,
      { status_sell_homeStay },
      { new: true, runValidators: true }
    );
    console.log(data?.status_sell_homeStay);

    if (!data) {
      return res.status(404).json({ message: "Package Not Found" });
    }

    return res.status(200).json(data.status_sell_homeStay);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  getAllHomeStay,
  searchByTypeHomeStay,
  getByIdHomeStay,
  createHomeStay,
  getByPriceHomeStay,
  updateHomeStay,
  deleteHomeStay,
  searchHomeStay,
  getByIdBusiness,
  changeStatus,
};
