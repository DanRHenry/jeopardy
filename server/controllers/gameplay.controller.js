const router = require("express").Router();
const GameplayInformation = require ("../models/gameplay.model");

const serverError = (res, error) => {
    console.log("Server-side error");
    return res.status(500).json({
        Error: error.message,
    });
};

// -------------------------- Post -------------------------

router.post("/gameplayinformation", async (req, res) => {
    try{
        const gameplayInfo = new GameplayInformation({
            question: req.body.question,
            answer: req.body.answer,
            category: req.body.category,
            gameName: req.body.gameName,
            userEmail: req.body.userEmail,
	    className: req.body.className,
        })

        const newGameplayInfo = await gameplayInfo.save();
        if (newGameplayInfo) {
            console.log("newGameplayInfo:", newGameplayInfo)
        }
        res.status(200).json({
            gameplayInfo: newGameplayInfo,
            message: `Success! GameplayInfo Saved!: ${req.body}`,
        });
    } catch (err) {
        res.status(500).json({
            ERROR: err.message,
        });
    }
});

// ------------------------- GET ------------------------

router.get("/find/:id", async (req, res) => {
    try{
        const { id } = req.params;
        console.log("id:", id);
        const findGameplayInformation = await GameplayInformation.findOne({_id: id});

        findGameplayInformation
            ? res.status(200).json({
                message: "Found!",
                findGameplayInformation,
            })
            : res.status(404).json({
                message: `Can't find the gameplay information`
            });
    } catch (err) {
        serverError(res, err);
    }
})

// --------------------------Get All ---------------------
router.get("/", async (req, res) => {
    try {
      const getAllGameplayInformation = await GameplayInformation.find();
      getAllGameplayInformation
        ? res.status(200).json({
            message: "All GameplayInformation:",
            getAllGameplayInformation,
          })
        : res.status(404).json({
            message: `No GameplayInformation Found!`,
          });
    } catch (err) {
      serverError(res, err);
    }
  });

  module.exports = router;
