const router = require("express").Router();
const Question = require("../models/questions.model");

const serverError = (res, error) => {
  console.log("Server-side error");
  return res.status(500).json({
    Error: error.message,
  });
};

// ------------------------ POST ----------------------

router.post("/storeQuestion", async (req, res) => {
  try {
    const questionInfo = new Question({
      className: req.body.className,
      question: req.body.question,
      answer: req.body.answer,
      category: req.body.category,
      unit: req.body.unit,
      userEmail: req.body.userEmail,
    }); // using values from req.body to form our object.

    const newQuestionInfo = await questionInfo.save();
    if (newQuestionInfo) {
      console.log("newQuestion:", newQuestionInfo);
    }
    res.status(200).json({
      questionInfo: newQuestionInfo,
      message: `Success! Question Saved!:${req.body}`,
    });
  } catch (err) {
    console.log(Question)
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

// ------------------------- GET -----------------------

router.get("/find/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);
    const findQuestion = await Question.findOne({ _id: id });

    findQuestion
      ? res.status(200).json({
          message: "Found!",
          findQuestion,
        })
      : res.status(404).json({
          message: `Can't Find the Question.`,
        });
  } catch (err) {
    serverError(res, err);
  }
})

// --------------------------Get All ---------------------
  router.get("/", async (req, res) => {
    try {
      const getAllQuestions = await Question.find();
      getAllQuestions
        ? res.status(200).json({
            message: "All Questions:",
            getAllQuestions,
          })
        : res.status(404).json({
            message: `No Questions Found!`,
          });
    } catch (err) {
      serverError(res, err);
    }
  });
/* 
----------------------------- Delete Category Endpoint ------------------------
*/
router.delete("/delete/:id", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // console.log("deleting...");
  try {
    //* Pull the category's info from the req
    const {id} = req.params;

    const categoryID = { _id: id };

    // const returnOption = { new: true };

    //* Remove user profile
    const deleteCategory = await Question.deleteOne(categoryID);

    deleteCategory.deletedCount === 1
      ? res.status(200).json({
          message: `The category was successfully deleted!`,
        })
      : res.status(404).json({
          message: `The category was unable to be deleted.`,
        });
  } catch (err) {
    console.log("oops");
    serverError(res, err);
  }
});

module.exports = router;
