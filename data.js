const router = require("express").Router();
const { movieLists } = require("./db");
const authorize = require("./middleware/authorize");

const validateData = (movieList) => {
  let message = "";
  if (!movieList.id) {
    message = "id not found";
  }
  if (!movieList.movie) {
    message = "movie name not found";
  }
  if (!movieList.cast) {
    message = "cast not found";
  } else {
    return message;
  }
};

router.get("/list", authorize, (req, res) => {
  res.json(movieLists);
});

router.get("/list/:ID",  (req, res) => {
  let id = parseInt(req.params.ID);
  let newMovielist = movieLists.filter((list) => list.id == id)[0];
  if (newMovielist) {
    res.status(200).json(newMovielist);
  } else {
    res.sendStatus(404);
  }
});

router.post("/list",authorize, (req, res) => {
  let movieList = req.body;

  let isValidData = validateData(movieList);
  if (isValidData == "") {
    movieLists.push(movieList);
    // console.log(movieList);
    res.status(200).send(movieLists);
  } else {
    res.statusMessage = isValidData;
    res.status(400).json({
      error: [
        {
          msg: "Data missing",
        },
      ],
    });
  }
});

router.put("/list/:ID", authorize, (req, res) => {
  let id = req.params.ID;
  let movieList = req.body;
  let updatedList = movieLists.filter((list) => list.id === id)[0];
  if (updatedList) {
    let isValidList = validateData(movieList);
    if (isValidList == "") {
      updatedList.movie = movieList.movie;
      updatedList.cast = movieList.cast;
      res.status(200).send(movieLists);
    } else {
      res.statusMessage = isValidList;
      res.status(400);
    }
  } else {
    res.statusMessage = "Does not exist";
    res.status(400).json({
      error: [
        {
          msg: "Data missing",
        },
      ],
    });
  }
});

router.delete("/list/:ID", authorize,(req, res) => {
  let id = req.params.ID;
  const deletedList = movieLists.findIndex((list) => list.id == id);
  console.log(deletedList)
  if(deletedList >= 0){
    let newList=movieLists.splice(deletedList);
    console.log(newList)
    res.status(200).send(movieLists)
  }else{
      res.status(400).json({
        error: [
            {
              msg: "No data to delete",
            },
          ]
      })
     
  }
 

});

module.exports = router;
