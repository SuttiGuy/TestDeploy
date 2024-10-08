import { Request, Response } from "express";
import PackageModel from "../model/package.model";

const getAllPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await PackageModel.find();
    res.status(200).json(packages);
  } catch (err) {
    console.log(err);
    res.status(500).send("have an error on server!");
  }
};

const searchByTypePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const type_package = req.params.type_package;
  try {
    const packageType = await PackageModel.findOne({ type_package });
    if (!packageType) {
      res.status(404).send("Not Found Package name: " + type_package);
    }
    res.status(200).json({ packageType });
  } catch (err) {
    console.log(err);
    res.status(500).send("have an error on server");
  }
};

const getByIdPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const packageId = req.params.id;
    console.log(packageId);

    const data = await PackageModel.findById(packageId).populate({
      path: "homestay",
      model: "HomeStay",
    });
    console.log(data);
    if (!data) {
      res.status(404).json({ message: "Package not found" });
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
    const data = await PackageModel.find({business_user: homeStayId});
    if (!data) {
      res.status(404).json({ message: "HomeStay not found" });
    } else {
      res.json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const createPackage = async (req: Request, res: Response): Promise<void> => {
  const packageData = req.body;
  const newPackage = new PackageModel(packageData);
  console.log(packageData);
  try {
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getByPricePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const price = req.params.price;
    const packagePrice = await PackageModel.findOne({ price });
    if (!packagePrice) {
      res.status(404).json({ message: "Not found package price" });
    } else {
      res.json(packagePrice);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updatePackage = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedPackage = await PackageModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedPackage) {
      res.status(404).json({ message: "Package Not Found" });
    } else {
      res.status(200).json({ message: "Package Updated!", updatedPackage });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deletePackage = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const data = await PackageModel.findByIdAndDelete(id);
    if (!data) {
      res.status(404).json({ message: "Package Not Found" });
    } else {
      res.status(200).json(data);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const searchPackage = async (req: Request, res: Response): Promise<void> => {
  const name = req.query.name_package as string;
  const type = req.query.type_package as string;
  const detail = req.query.detail_package as string;
  try {
    const data = await PackageModel.find({
      $or: [
        { name_package: { $regex: name, $options: "i" } },
        { type_package: { $regex: type, $options: "i" } },
        { detail_package: { $regex: detail, $options: "i" } },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

export {
  getAllPackage,
  searchByTypePackage,
  getByIdPackage,
  createPackage,
  getByPricePackage,
  updatePackage,
  deletePackage,
  searchPackage,
  getByIdBusiness
};
