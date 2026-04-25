const Constructor = require("../models/Constructor");

exports.getConstructorById = async (req, res) => {
  try {
    const constructor = await Constructor.findOne({
      constructorId: Number(req.params.constructorId)
    });

    if (!constructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json(constructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateConstructor = async (req, res) => {
  try {
    const updatedConstructor = await Constructor.findOneAndUpdate(
      { constructorId: Number(req.params.constructorId) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedConstructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json(updatedConstructor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteConstructor = async (req, res) => {
  try {
    const deletedConstructor = await Constructor.findOneAndDelete({
      constructorId: Number(req.params.constructorId)
    });

    if (!deletedConstructor) {
      return res.status(404).json({ message: "Constructor not found" });
    }

    res.json({ message: "Constructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};