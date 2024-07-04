import placeholderQuestions from "./placeholder-questions.js";
// console.log(sessionStorage.gameName);
if (sessionStorage.gameName?.length > 0) {
  // sessionStorage.currentGame = ""
}
// console.log(sessionStorage);

if (document.title === "Jeopardy") {
  sessionStorage.clear();
  console.log(sessionStorage);
}
// Global DOM Variables

// Gameplay API
const serverPort = 3300;
const apiServer = `http://127.0.0.1:${serverPort}/api/jeopardy`;
// const apiServer = "https://danhenrydev.com/api/jeopardy";

// Title Page
let PREFIX = "http://127.0.0.1:";
// PREFIX = apiServer;
const PORT = 8080;
// const PORT = 5500;
const EDITPATH = "/edit-content.html";
const ROUND1PATH = "/round-1.html";

//! Title Page
const teacherSignInBtn = document.getElementById("teacherSignIn");
const studentRegistrationBtn = document.getElementById("studentRegistration");

//! Return Home
const returnHome = document.getElementById("returnHome");
returnHome?.addEventListener("click", function returnHome() {
  window.location.href = `${PREFIX}${PORT}/index.html`;
});

//! Update Token Function
const updateToken = (newToken) => {
  sessionStorage.setItem("token", newToken);
};

//! Teacher Sign-in Page
if (document.title === "Teacher Login") {
  let displayNameInput = document.getElementById("nameField");
  let passwordInput = document.getElementById("passwordField");
  let emailInput = document.getElementById("emailField");

  //! Sign In / Sign Up

  const signinOrCreateAccountBtn = document.getElementById(
    "signin-or-createaccount-btn"
  );

  signinOrCreateAccountBtn.addEventListener("click", () => {
    let adminLoginHeader = document.getElementById("adminLoginHeader");
    if (adminLoginHeader.innerText == "Log In") {
      adminLoginHeader.innerText = "Create New Account";
      signinOrCreateAccountBtn.innerText = "Log In";
    } else if (adminLoginHeader.innerText == "Create New Account") {
      adminLoginHeader.innerText = "Log In";
      signinOrCreateAccountBtn.innerText = "Create New Account";
    }
  });

  const submitTeacherLogin = async () => {
    if (document.getElementById("adminLoginHeader").textContent === "Log In") {
      let email = emailInput.value;
      sessionStorage.setItem("email", `${email}@eastlongmeadowma.gov`);
      const url = `${apiServer}/user/findAdmin`;
      let signInSignUpObject = JSON.stringify({
        displayName: displayNameInput.value,
        email: sessionStorage.email,
        password: passwordInput.value,
      });

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: signInSignUpObject, // The second body refers to the body object above.
        });
        const data = await res.json(); // The .json takes the promise and makes it usable

        if (data.message === "Login Successful") {
          updateToken(data.token);
          window.location.href = `${PREFIX}${PORT}/edit-content.html`;
        } else {
          // alert("Not Found");
          console.log("Not Found");
        }
      } catch (err) {
        console.error(err);
      }
    } else if (
      document.getElementById("adminLoginHeader").textContent ===
      "Create New Account"
    ) {
      const url = `${apiServer}/user/signup`;
      let signInSignUpObject = JSON.stringify({
        displayName: displayNameInput.value,
        email: `${emailInput.value}@eastlongmeadowma.gov`,
        password: passwordInput.value,
        role: "teacher",
        course: "",
      });
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: signInSignUpObject, // The second body refers to the body object above.
        });
        const data = await res.json(); // The .json takes the promise and makes it usable
        if (data.message === "Success! User Created!") {
          updateToken(data.token);
          console.log("user created! Yay! Now move to the round one screen");
        } else {
          console.log("Oops, user not created...");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  //! Search for user/email

  document
    .getElementById("submit")
    .addEventListener("click", async function submitAdmin(e) {
      e.preventDefault();

      await submitTeacherLogin();
      userNameInput.value = "";
      passwordInput.value = "";
      emailInput.value = "";
    });
}

//! Student Registration Page
if (document.title === "Student Registration") {
  // }
  const ws = new WebSocket("ws://127.0.0.1:3300");
  ws.addEventListener("open", () => {
    console.log("Socket Open");
  });

  ws.addEventListener("message", (message) => {
    // console.log("message.data:", message.data);
    if (message.data == "Welcome new client") {
      console.log(message.data);
      return;
    }
    if (message.data == "gameStarted") {
      sessionStorage.gameStarted = true;

      //todo -- before the students have been redirected to the game page, send appropriate game information to fill in questions, answers, etc.

      window.location.href = `${PREFIX}${PORT}${ROUND1PATH}`
      return;
    }
    if (!message.data === "Welcome new client") {
      alert(JSON.stringify(message.data));
      return;
    }
    // message = JSON.parse(message.data)
    // console.log("message.data:", message.data)
    // console.log("message.answer:", message.answer)
    let gameInformation = JSON.parse(message.data);
    const {
      answer,
      question,
      category,
      className,
      gameStarted,
      gameName,
      playerList,
      playerObject,
    } = gameInformation;
    // } = message.data;
    // console.log("answer:", answer)
    // console.log("question:", question)
    // console.log("className", className)
    sessionStorage.answer = `${answer}`;
    sessionStorage.category = `${category}`;
    sessionStorage.question = `${question}`;
    sessionStorage.className = `${className}`;
    sessionStorage.gameStarted = `${gameStarted}`;
    sessionStorage.gameName = `${gameName}`;
    sessionStorage.playerList = `${playerList}`;


    if (message.data === JSON.stringify({ teacherPresent: true })) {
      sessionStorage.teacherPresent = true;
    }
  });
  const studentNameField = document.getElementById("studentNameField");
  const studentEmailField = document.getElementById("studentEmailField");
  const studentSigninBtn = document.getElementById("studentSigninBtn");

  studentSigninBtn?.addEventListener("click", () => {
    if (
      studentNameField.value.length === 0 ||
      studentEmailField.value.length === 0
    ) {
      alert("Please enter your name and email address");
      return;
    }
    //todo add logic to the teacher side to send a signed-in status to students
    //todo send students either to a waiting room, or add a message onscreen to wait for the game to begin
    //todo on game begin, students should be redirected to the jeopardy round one page

    let playerObject = JSON.stringify({
      studentName: studentNameField.value,
      //todo change this to add logic to check if the input has the @eastlongmeadowma or not
      email: `${studentEmailField.value}@eastlongmeadowma.gov`,
      role: "student",
      course: "",
      score: 0,
    });
    sessionStorage.email = JSON.stringify(`${studentEmailField.value}@eastlongmeadowma.gov`);
    sessionStorage.score = 0;
    // console.log(playerObject);

    // ws.send({
    // console.log("sending player object...")
    let counter = 0;
    function checkForTeacherAndSendStudentInfo() {
      counter++;
      if (!sessionStorage.teacherPresent) {
        console.log("counter", counter);
        setTimeout(() => {
          checkForTeacherAndSendStudentInfo();
        }, 1000);
      } else {
        ws.send(JSON.stringify({ playerObject: playerObject }));
        console.log("sending:", { playerObject: playerObject });
        console.log("player object sent");
      }
      // })
      //todo check if the teacher has already logged in (add this to the teacher's side)
      //todo if the teacher hasn't logged in yet, retry sending the information until the teacher has logged in
    }
    checkForTeacherAndSendStudentInfo();
  });
}
//! Game Page
const classNameText = document.getElementById("class-name");
const gameNameText = document.getElementById("game-name");

// Scoreboard
let playerTwoScoreName = document.getElementById("p2Name");
let playerOneScoreName = document.getElementById("p1Name");
let p1Score = document.getElementById("p1Score");
let p2Score = document.getElementById("p2Score");

// Gameplay Area
let passBtn = document.getElementById("passBtn");
let placeholderPassBtn = document.getElementById("placeholderPassBtn");
let guessBtn = document.getElementById("guessBtn");
let placeholderGuessBtn = document.getElementById("placeholderGuessBtn");
let playerTurn = document.getElementById("playerTurn");
let nextRound = document.getElementsByClassName("nextRound");
let placeholderNextRound = document.getElementsByClassName(
  "placeholderNextRound"
);
let inputFieldForAnswer = document.getElementById("inputFieldForAnswer");

// Answer board
let answerBoard = document.getElementById("answerBoard");
let textDisplay = document.getElementById("textDisplay");
let textDispCont = document.getElementById("textDispCont");
let textDisplayBtn = document.getElementById("textDisplayBtn");
let answer200 = document.createElement("div");
let answer400 = document.createElement("div");
let answer600 = document.createElement("div");
let answer800 = document.createElement("div");
let answer1000 = document.createElement("div");

const activeStudentsList = document.getElementById("activeStudentsList");

// Global State Variables
let playerGuess;
let win;
let player1Score = 0;
let player2Score = 0;
let playerOnesName;
let playerTwosName;
let passed;
let activePlayerScore = 0;
let activePlayer;
let round;
let index;
let resultsHTML = "";
let availableGames;

// -------------------------------------------------- Global Arrays ------------------------------------------------------------
let roundOneArray = []; //this gets used by the game and defaults to placeholder questions
let roundTwoArray = [];
let finalJeopardyCategory = [];
let classList = [];
let results = [];
let studentList = [];
// sessionStorage.players = JSON.stringify(studentList);

// -------------------------------------------------- Global Objects ------------------------------------------------------------
let categoriesObject = {};
let gameplayCategoryObject = {};
let customGameInformation = {};
let customCategories = {};
let customQuestions = {};
let customAnswers = {};
let currentGame = {};

// --------------------------------------------------- Global Strings -----------------------------------------------------------
let customGameName = "";
const addedCategoriesDefaultHTML = `\n <h1>Gameplay Categories:</h1><ol id="tempCategories"></ol>\n`;

// ----------------------------------- Fill Round One, Two, and final Arrays ---------------------------------------------
for (let m = 0; roundTwoArray.length < 36; m++) {
  for (let questionPosition = m; questionPosition < 60; questionPosition++) {
    for (let catIndex = 0; catIndex < 6; catIndex++) {
      if (roundTwoArray.length < 36) {
        roundOneArray.push(placeholderQuestions[questionPosition]);
        questionPosition += 5;
        roundTwoArray.push(placeholderQuestions[questionPosition]);
        questionPosition += 5;
      }
    }
  }
}

finalJeopardyCategory.push(placeholderQuestions[60]);

// -------------------------------------------- Set the round value ------------------------------------------------------
if (document.title === "Jeopardy") {
  round = "title";
  titleScreen();
} else if (document.title === "Round-1") {
  round = "round1";
  roundOne();
} else if (document.title === "Double Jeopardy") {
  round = "round2";
  roundOne();
} else if (document.title === "Final Jeopardy") {
  round = "final";
}

//!------------------------------------------- Admin Page Functionality --------------------------------------------------

if (document.title === "Editor") {
  const ws = new WebSocket(`ws://127.0.0.1:3300`);
  ws.addEventListener("open", () => {
    console.log("Socket Open");
    const teacherPresent = { teacherPresent: true };
    ws.send(JSON.stringify(teacherPresent));
  });

  ws.addEventListener("message", (message) => {
    // socket.addEventListener("message", (message) => {
    if (message.data[0] === "{") {
      message = JSON.parse(message.data);
      console.log("message:", message);
      let { playerObject } = message;

      studentList.push(JSON.parse(playerObject));
      fillAvailableStudentsList();
      playerObject = {};
    }
  });

  function clearOptions() {
    const option = document.getElementsByTagName("option");
    for (let i = option.length; i > 0; i--) {
      option[i - 1].parentElement.removeChild(option[i - 1]);
    }
  }

  // ------------------------------------ Fill the class list in the admin page --------------------------------------------
  async function fillClassListDropdown() {
    // await fetchInformation();
    // await fillClassListArray();
    clearOptions();

    const options = document.getElementsByTagName("option");
    // console.log("options:",options)
    // if (options.length > 0) {

    for (let i = 0; i < classList.length; i++) {
      const listing = document.createElement("option");
      // console.log("classList:",classList)

      // listing.className = "class-list-item";
      // console.log("class-list-item:",document.getElementsByClassName("class-list-item"))
      // for (let l = document.getElementsByClassName("class-list-item").length; l > 0 ; i--) {
      //   console.log('listing-l:',listing[l]);
      //   listing[l].parentElement.removeChild(listing[l]);
      // }

      // Check for consecutive duplicate classes (//todo:  come up with a solution to deal with non-consecutive duplicates: either sort alphabetically and keep the same logic, or search through the array) Use Filter Array Prototype?
      if (options.length < classList.length) {
        if (classList[i - 1]?.className != classList[i].className) {
          // if (classList.includes(classList[classList.length -1].className)) {
          //   console.log("same")
          // } else {console.log("different")}

          // for (let i = classList.length; i > 0; i --) {
          // if (classList[i]?.className === (classList[classList.length]?.className)) {
          listing.value = classList[i].className;
          listing.innerText = classList[i].className;
          document.getElementById("class-names")?.append(listing);
        }
      } else {
        console.log("else");
      }
    }
  }

  // --------------- Post a new Class Name and fetch the information again to populate the class List ------------------------------

  const postNewClassName = async () => {
    // const options = document.getElementsByTagName("option");
    // console.log("options:", options);

    // ----------- Class Name Input ----------
    const classNameInputField = document.getElementById("classNameInputField");
    if (classNameInputField.value === "") {
      console.log("Enter a name");
      return;
    }

    // ----------- Question Input -------------
    // todo: add logic to check the number of questions
    const questionInputField = document.getElementById("questionInputField");
    if (questionInputField.value === "") {
      console.log("Enter questions");
      return;
    }

    // ------------Answer Input ----------------
    // todo: add logic to check the number of answers
    const answerInputField = document.getElementById("answerInputField");
    if (answerInputField.value === "") {
      console.log("Enter answers");
      return;
    }

    // ----------- Unit Input -------------------
    const unitNameInputField = document.getElementById("unitNameInputField");
    if (unitNameInputField.value === "") {
      console.log("Enter a Unit Name");
      return;
    }

    // ----------- Category Input ---------------

    const categoryInputField = document.getElementById("categoryInputField");
    if (categoryInputField.value === "") {
      console.log("Enter a Category Name");
      return;
    }

    // ----------------------------- Create a new Class object and send it to the server ------------------------------------
    let newClass = {};
    newClass.className = classNameInputField.value;
    newClass.question = questionInputField.value;
    newClass.answer = answerInputField.value;
    newClass.category = categoryInputField.value;
    newClass.unit = unitNameInputField.value;
    newClass.userEmail = sessionStorage.email;

    classNameInputField.value = "";
    questionInputField.value = "";
    answerInputField.value = "";
    categoryInputField.value = "";
    unitNameInputField.value = "";
    // console.log("posting", newClass, "to server");
    const url = `${apiServer}/questions/storeQuestion/`;
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClass),
    });
    // console.log("clicked");
    // await fetchInformation();
    // console.log("newClass should be posted")
    await fillClassListArray();
  };

  const postGameplayInformation = async () => {
    const gameNameInput = document.getElementById("gameNameField");

    // -------------------------------- Check that a game name has been entered --------------------------------------------
    if (gameNameInput.value === "") {
      console.log("needs a value");
      return;
    }

    // -------------- Add gameNameInput field value to the customGameInformation object to send -----------------------------
    customGameInformation.gameName = gameNameInput.value;
    customGameInformation.className =
      document.getElementById("class-names").value;
    customGameInformation.userEmail = sessionStorage.email;

    // Todo: socket
    const url = `${apiServer}/gameplay/gameplayinformation/`;

    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customGameInformation),
    });

    // fillAvailableGamesList(); //todo: check if this is needed
    addedCategories.innerHTML = addedCategoriesDefaultHTML;
  };

  // ----------------------------- Submit New Class Event Listener ----------------------------------------------------------
  if (document.getElementById("submitNewClassBtn")) {
    document
      .getElementById("submitNewClassBtn")

      .addEventListener("click", postNewClassName);
  }

  //! The categories object being fetched isn't complete

  const fetchInformation = async () => {
    const url = `${apiServer}/questions/`;
    let result = await fetch(url);
    categoriesObject = await result.json();
    // todo are classList and categoriesObject.getAllQuestions the same thing? Can they be reduced to one variable?
    classList = categoriesObject.getAllQuestions;
  };

  // ---------------------------------- Fetch Games from API and set to availableGames object ------------------------------
  const fetchGames = async () => {
    const url = `${apiServer}/gameplay/`;
    let result = await fetch(url);
    availableGames = await result.json();
  };

  //Todo - delete gameNameInput when the number of checked boxes goes below 6

  await fetchInformation();

  fillClassListArray();

  fillClassListDropdown();

  fillCategoryOptionsDropdown();

  fillAvailableGamesList();

  //Todo -- eventually, put this in the socket message event listener
  fillAvailableStudentsList();

  // -------------------------------------- Fill the customContent array --------------------------------------------------

  function fillCustomContentArray(
    gameAnswers,
    gameQuestions,
    gameCategories,
    gameClassName
  ) {
    // --------Push Information for the Gameplay Categories/Class/Questions/Answers/Scores to the customContentArray -------------
    // console.log("gameAnswers",gameAnswers)
    // for (let index = 0; index < gameAnswers.length; index++) {
    //   customContentArray.push({
    //     category: gameCategories[0],
    //     className: gameClassName[0],
    //     question: gameQuestions[index],
    //     answer: gameAnswers[index],
    //     score: (index + 1) * 200,
    //   });
    //   // console.log("customContentArray: ",customContentArray)
    // }
  }

  async function fillClassListArray() {
    await fetchInformation();
    await fillClassListDropdown();

    // -------------------------------------- Clear the classList array ---------------------------------------------------
    classList = [];

    // -------------------------------------- Clear the customContentArray --------------------------------------------------

    // customContentArray = []; //! Maybe remove this. Did not check into whether this is necessary.

    for (let i = 0; i < categoriesObject.getAllQuestions.length; i++) {
      const gameAnswers =
        categoriesObject.getAllQuestions[i].answer.split("\r\n");
      const gameQuestions =
        categoriesObject.getAllQuestions[i].question.split("\r\n");
      const gameCategories =
        categoriesObject.getAllQuestions[i].category.split("\r\n");
      const gameClassName =
        categoriesObject.getAllQuestions[i].className.split("\r\n");

      // ------------------------------------- Push Class Names & IDs to the classList array --------------------------------
      classList.push({
        className: categoriesObject.getAllQuestions[i].className,
        id: categoriesObject.getAllQuestions[i]._id,
      });
      fillCustomContentArray(
        gameAnswers,
        gameQuestions,
        gameCategories,
        gameClassName
      );
    }
  }

  fillClassListArray();

  // ---------------------------------- Function to fill the Category Options List ------------------------------------------
  function fillCategoryOptionsDropdown() {
    // ----------------------------------------------------------- Clear checkboxes ----------------------------------------
    if (document.getElementById(`checkBoxes`)) {
      document.getElementById(`checkBoxes`).innerHTML = "";
    }
    // -------------------------------------------- clear the results array and the resultsHTML ----------------------------
    results = [];
    resultsHTML = "";
    gameplayCategoryObject = {};
    customGameInformation = {};
    customCategories = {};
    customQuestions = {};
    customAnswers = {};
    customGameName = "";
    const addedCategories = document.getElementById("addedCategories");

    if (addedCategories) {
      addedCategories.innerHTML = addedCategoriesDefaultHTML;
    }
    // ---Check through the fetched category categoriesObject and Fill the results with categories of the same class name ---
    for (let i = 0; i < categoriesObject.getAllQuestions.length; i++) {
      if (
        categoriesObject.getAllQuestions[i].className ===
        document.getElementById("class-names")?.value
      ) {
        // ------------- For each category that matches the selected class, push an object into results ---------------------
        results.push({
          question: categoriesObject.getAllQuestions[i].question,
          answer: categoriesObject.getAllQuestions[i].answer,
          className: categoriesObject.getAllQuestions[i].className,
          category: categoriesObject.getAllQuestions[i].category,
          score: categoriesObject.getAllQuestions[i].score,
          unit: categoriesObject.getAllQuestions[i].unit,
        });
      }
    }

    // ---------------- Use the results array of category objects to create HTML in the Select Questions section --------

    // ----------------------------------------------------- Primary Category -------------------------------------------
    // Add the first category information from the results array to the resultsHTML string. This is done separately from the rest to accomidate the bootstrap differences.

    for (let i = 0; i < results.length; i++) {
      if (i === 0) {
        resultsHTML += `
    <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header accordionClassListHeader" id="accordionHeader_${i}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
<!--         <b>${results[i].category}</b> -->
         <span>
          <strong>Unit: </strong>${results[i].unit}
          <br> 
          <strong>Category: </strong> ${results[i].category}
          </span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
      <strong class="questions">Questions:</strong>
      <div>
      <ol class="categoryItems"><li>${results[i].question.replaceAll(
        "\r\n",
        "</li><li>"
      )}</ol> 
      <strong class="answers">Answers:</strong>
      <ol class="categoryItems"><li>${results[i].answer.replaceAll(
        "\r\n",
        "</li><li>"
      )}</ol>
      </div>
    </div>
      </div>
    </div>
    `;
      }

      const element = document.createElement("div");
      element.value = classList[i].className;
      element.innerText = classList[i].className;
      element.id = classList[i].id;
      element.innerText = categoriesObject.getAllQuestions[i].question;

      for (let i = 0; i < results.length; i++) {
        document.getElementById("questionList").innerHTML =
          "<span>" +
          resultsHTML +
          `

        <div class="form-group" name="className">
      </span>`;
      }

      // }

      // ! -------------------------------------------- Secondary categories: ---------------------------------------------

      if (results.length > 1 && i >= 1) {
        // console.log("secondary:");
        let dataBsTarget = `collapse${i}`;
        // resultsHTML = ""
        resultsHTML += `
<div class = "accordion-item">
<h2 class="accordion-header accordionClassListHeader" id="accordionHeader_${i}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${dataBsTarget}" aria-expanded="false" aria-controls="${dataBsTarget}">
            <div>
              <strong>Unit: </strong>${results[i].unit}
              <br>
              <strong>Category: </strong>${results[i].category}
            </div>
              </button>
          </h2>
          <div id="${dataBsTarget}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body">
              <strong class="questions">Questions:</strong>
              <div>
              <ol class="categoryItems"><li>${results[i].question.replaceAll(
                "\r\n",
                "</li><li>"
              )}</ol> 
              <strong class = "answers">Answers:</strong>
              <ol class="categoryItems"><li>${results[i].answer.replaceAll(
                "\r\n",
                "</li><li>"
              )}</ol>
              </div>
            </div>
          </div>
        </div>
        `;

        const element = document.createElement("div");
        element.value = classList[i].className;
        element.innerText = classList[i].className;
        element.id = classList[i].id;
        element.innerText = categoriesObject.getAllQuestions[i].question;

        for (let i = 0; i < results.length; i++) {
          document.getElementById("questionList").innerHTML = resultsHTML;
        }
        const categorySelectBtn = document.getElementById(
          `categorySelectBtn${i}`
        );

        categorySelectBtn?.addEventListener("click", () => {
          console.log("click");
        });
      }
    }
    addCheckboxes();

    // !---------------------------------- Checkbox Functionality -------------------------------------------------
    for (
      let i = 0;
      i < document.getElementsByClassName("checkboxInput").length;
      i++
    ) {
      //! Listen to checkbox for checked or unchecked
      document
        .getElementsByClassName("checkboxInput")
        [i].addEventListener("change", () => checkNumberOfCheckboxesTicked(i));
    }
  }

  let catIndex = 0;

  // --------------------------------------- Check to see how many category boxes have been checked -----------------------

  // ------------------------If 6 have been checked, make a submit button and name entry field (change this?) --------------
  function checkNumberOfCheckboxesTicked(i) {
    // If checked...
    if (document.getElementsByClassName("checkboxInput")[i].checked === true) {
      // Check for existing gameplayItems list on the page.
      const gameplayItems = document.getElementsByClassName("gameplayItems");

      //If the length of gameplayItems is less than 6, allow the item to be appended
      console.log("gameplayItems.length:", gameplayItems.length);

      // If the length of gameplayItems is greater or equal to 6, deselect the most recent box and warn that the limit has been reached.

      if (gameplayItems.length >= 6) {
        alert("There's a maximum of 6 categories.\n Uncheck one to add this.");
        document.getElementsByClassName("checkboxInput")[i].checked = false;
        return;
      }
      if (gameplayItems.length < 6) {
        console.log("less than 6");

        // Add two new keys to gameplayCategoryObject

        if (document.getElementsByClassName("checkboxInput")[i].checked) {
          gameplayCategoryObject["id_" + i] = i;
          gameplayCategoryObject["content_" + i] = results[i];

          // Create a new div element, gameplayItem, with a className "gameplayItems", and add text (results.category, .className, and .unit)
          const gameplayItem = document.createElement("li");
          gameplayItem.id = `gameplayItem_${i}`;
          gameplayItem.className = "gameplayItems";
          gameplayItem.innerText = `${results[i].category},${results[i].className}, ${results[i].unit}`;

          customCategories[`category_${catIndex}`] = results[i].category;
          customGameName = "gameName";
          customQuestions[`question_${i}`] = results[i].question;
          customAnswers[`answer_${i}`] = results[i].answer;

          // Append the new gameplayItem to "tempCategories" on the page
          const tempCategories = document.getElementById("tempCategories");
          tempCategories.appendChild(gameplayItem);
          // Check if the length of gameplayItems is equal to 6,
          catIndex++;
        }

        if (gameplayItems.length === 6) {
          // Create a "Start Game" button
          const addBtnPosition = document.createElement("div");
          addBtnPosition.id = "addBtnPosition";

          const addGameBtn = document.createElement("button");
          addGameBtn.type = "button";
          addGameBtn.id = "addGameBtn";
          addGameBtn.innerText = "Create Game";

          const gameNameField = document.createElement("input");
          gameNameField.id = "gameNameField";

          // const addBtnPosition = document.getElementById("addBtnPosition");
          // Add the "Start Game" button to "addedCategories"
          document
            .getElementById("addedCategories")
            .appendChild(addBtnPosition);
          addBtnPosition.appendChild(addGameBtn);
          addBtnPosition.appendChild(gameNameField);
          // Add an event listener for click
          addGameBtn.addEventListener("click", postGameplayInformation);
        }
      }
    }

    if (document.getElementsByClassName("checkboxInput")[i].checked === false) {
      // console.log("gameplayItems:",gameplayItems)
      console.log("gameplayCategoryObject:", gameplayCategoryObject);

      const gameplayItem = document.getElementById(`gameplayItem_${i}`);

      gameplayItem.parentElement.removeChild(gameplayItem);
      delete gameplayCategoryObject["content_" + i];
      delete gameplayCategoryObject["id_" + i];

      delete customCategories[`category_${i}`];
      customGameName = "";
      delete customQuestions[`question_${i}`];
      delete customAnswers[`answer_${i}`];

      const startbtn = document.getElementById("addGameBtn");
      if (startbtn) {
        startbtn.remove();
      }
    }
    customGameInformation.question = customQuestions;
    customGameInformation.answer = customAnswers;
    customGameInformation.gameName = customGameName;
    customGameInformation.category = customCategories;
  }

  //todo ------------------------ Event Listener to run fillCategoryOptionsDropdown() on change !I don't think this is working...
  document.getElementById("class-names")?.addEventListener("change", () => {
    fillCategoryOptionsDropdown();
    fillAvailableGamesList();
  });

  // ! --------------------------------------- Add Checkboxes to Categories List --------------------------
  function addCheckboxes() {
    if (document.getElementsByClassName("accordionClassListHeader")) {
      const accordionHeaders = document.getElementsByClassName(
        "accordionClassListHeader"
      );
      for (let i = 0; i < accordionHeaders.length; i++) {
        const accordionHeader = document.getElementById(`accordionHeader_${i}`);

        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = `btncheck${i + 1}`;
        checkboxLabel.innerText = "Add Category to Game:";
        checkboxLabel.className = "checkboxLabel";

        const checkBoxInput = document.createElement("input");
        checkBoxInput.type = "checkbox";
        checkBoxInput.className = "checkboxInput";
        checkBoxInput.id = `btncheck${i + 1}`;
        checkBoxInput.autocomplete = "off";

        const deleteSection = document.createElement("div");
        deleteSection.id = `deleteSection_${i}`;

        const deleteCategoryLabel = document.createElement("label");
        deleteCategoryLabel.htmlFor = `deleteCategoryCheck${i + 1}`;
        deleteCategoryLabel.innerText = "Delete Category:";
        deleteCategoryLabel.className = "deleteCatLabel";

        const deleteCategoryInput = document.createElement("input");
        deleteCategoryInput.type = "input";
        deleteCategoryInput.className = "deleteCatInput";
        deleteCategoryInput.id = `deleteCatInput${i + 1}`;
        deleteCategoryInput.autocomplete = "off";
        deleteCategoryInput.placeholder = `enter "delete" to delete`;

        const deleteArea = document.createElement("div");
        deleteArea.id = "deleteArea";

        const deleteImage = document.createElement("img");
        deleteImage.type = "button";
        deleteImage.src = "./assets/delete.png";
        deleteImage.alt = "Del Img";
        deleteImage.className = "deleteImg";
        deleteImage.id = `deleteImg${i}`;
        // if (deleteCategoryInput.innerText.toLocaleLowerCase() = "delete")

        accordionHeader.appendChild(checkboxLabel);
        accordionHeader.appendChild(checkBoxInput);
        accordionHeader.appendChild(deleteArea);
        deleteArea.appendChild(deleteCategoryLabel);
        deleteArea.appendChild(deleteCategoryInput);
        deleteArea.appendChild(deleteImage);
        deleteCategoryInput.addEventListener("change", () => {
          let deleteCategoryValue =
            deleteCategoryInput.value.toLocaleLowerCase();
          if (deleteCategoryValue === "delete") {
            console.log("deletebuttonwillappear");
            deleteImage.style.visibility = "visible";
          } else {
            deleteImage.style.visibility = "hidden";
            console.log("nodeletebutton");
          }
        });

        deleteImage.addEventListener("click", () => {
          let deleteCategoryValue =
            deleteCategoryInput.value.toLocaleLowerCase();
          if (deleteCategoryValue === "delete") {
            console.log(`ready to delete ${i}`);

            if (confirm(`Are you sure you want to delete ${i}?`) === true) {
              console.log(`${i} has been deleted.`);
              deleteImage.style.visibility = "hidden";
              fillCategoryOptionsDropdown();
            }
          } else {
            console.log(`clicked delete ${i}, but no text`);
          }
        });
      }
    }
  }

  // --------------------------------------------- Event Listener for the Questions List Button ----------------------------

  document
    .getElementById("questionsListBtn")
    ?.addEventListener("click", fillCategoryOptionsDropdown);

  //! ----------------------------------------------- Fill Available Games List -------------------------------------------

  async function fillAvailableGamesList() {
    const availableGamesList = document.getElementById("availableGamesList");
    if (availableGamesList) {
      // console.log("here")

      // --------------------------- Clear out Games List -------------
      availableGamesList.innerHTML = "";
      await fetchGames();

      let availableGamesResults = [];
      //----------------------- First Games List Item -------------

      // console.log(availableGames.getAllGameplayInformation);
      for (
        let i = 0;
        i < availableGames.getAllGameplayInformation.length;
        i++
      ) {
        // console.log("availablegames.classname:",availableGames.getAllGameplayInformation[i].className)
        // console.log("dropdownselectedvalue:",document.getElementById("class-names").value)
        /* 
(
        categoriesObject.getAllQuestions[i].className ===
        document.getElementById("class-names")?.value
      )

*/

        // Check the fetched games list class name against the dropdown selected class

        if (
          availableGames.getAllGameplayInformation[i].className ===
          document.getElementById("class-names").value
        ) {
          availableGamesResults.push(
            availableGames.getAllGameplayInformation[i]
          );
          // console.log(availableGames.getAllGameplayInformation[i])
          // console.log(availableGamesResults);
        }
      }
      // ------------------------------ Creating HTML elements ---------------------------------------

      // console.log("availableGamesResults", availableGamesResults);
      for (let i = 0; i < availableGamesResults.length; i++) {
        const gamesListAccordionItem = document.createElement("div");
        gamesListAccordionItem.className =
          "accordion-item accordionGamesItems gamesListAccordionItem";
        availableGamesList.appendChild(gamesListAccordionItem);

        const accordionHeader = document.createElement("h2");
        accordionHeader.className = "accordion-header";
        accordionHeader.id = `gamesListAccordionHeader_${i}`;
        gamesListAccordionItem.appendChild(accordionHeader);

        const gamesListAccordionButton = document.createElement("button");
        gamesListAccordionButton.className = "accordion-button collapsed";
        gamesListAccordionButton.type = "button";
        gamesListAccordionButton.setAttribute("data-bs-toggle", "collapse");
        gamesListAccordionButton.setAttribute(
          "data-bs-target",
          `#collapseGame${i}`
        );
        gamesListAccordionButton.ariaExpanded = "true";
        gamesListAccordionButton.setAttribute(
          "aria-controls",
          `collapseGame${i}`
        );

        const gameName = availableGames.getAllGameplayInformation[i].gameName;
        gamesListAccordionButton.innerText = gameName;
        accordionHeader.appendChild(gamesListAccordionButton);

        // ---------------- On click, send the selected Game Information to the currentGame global object ------------------
        const gameSelector = document.createElement("a");
        gameSelector.href = `${PREFIX}${PORT}${ROUND1PATH}`;
        gameSelector.innerText = "Start Game";
        gameSelector.className = "start_game";

        //! ------- Start Game Event Listener (Sends the game information through the websockets) ----------
        gameSelector.addEventListener("click", () => {
          console.log("studentList:", studentList);
          currentGame = availableGames.getAllGameplayInformation[i];

          sessionStorage.question = JSON.stringify(currentGame.question);
          sessionStorage.answer = JSON.stringify(currentGame.answer);
          sessionStorage.gameName = JSON.stringify(currentGame.gameName);
          sessionStorage.category = JSON.stringify(currentGame.category);
          sessionStorage.className = JSON.stringify(currentGame.className)
          sessionStorage.gameStarted = true;

          let gameObject = JSON.stringify({
            category: sessionStorage.category,
            answer: sessionStorage.answer,
            question: sessionStorage.question,
            className: sessionStorage.className,
            playerList: sessionStorage.playerList,
            gameName: sessionStorage.gameName,
          });
          // gameObject.answer = sessionStorage.answer;
          // gameObject.question = JSON.stringify(sessionStorage.question);
          // gameObject.category = sessionStorage.category;
          // gameObject.className = sessionStorage.className;
          // gameObject.gameStarted = sessionStorage.gameStarted;
          // gameObject.gameName = sessionStorage.gameName;
          // gameObject.players = sessionStorage.players;
          // gameObject.studentList = JSON.stringify(studentList);
          // gameObject.studentList = sessionStorage.studentList;
          console.log(gameObject);
          ws.send(gameObject);
          // ws.send(JSON.stringify(gameObject));

          ws.send("gameStarted");
          //! This is the studentList that ends up in the gameplay
          const tempList = [];
          studentList.forEach((student) => {
            if (!student.remove) {
              tempList.push(student);
            }
          });
          sessionStorage.playerList = JSON.stringify(tempList);
        });

        accordionHeader.appendChild(gameSelector);

        const collapseGamei = document.createElement("div");
        collapseGamei.id = `collapseGame${i}`;
        collapseGamei.className = "accordion-collapse collapse";
        collapseGamei.setAttribute("data-bs-parent", "#availableGamesList");
        gamesListAccordionItem.appendChild(collapseGamei);

        const accordionGamesListBody = document.createElement("div");
        accordionGamesListBody.className = "accordion-body";
        collapseGamei.appendChild(accordionGamesListBody);

        const gamesListInnerText = document.createElement("div");
        gamesListInnerText.className = "gamesListInnerText";
        gamesListInnerText.id = `gamesListInnerText_${i}`;

        const item = availableGames.getAllGameplayInformation;

        /* 
    Iterate over the available games

    */
        let categories = "";
        for (let c = 1; c < Object.values(item).length + 1; c++) {
          // categories = "";
          for (let i = 0; i < Object.values(item[c - 1].category).length; i++) {
            // console.log("item:", item[i].category);

            // console.log(item[c - 1].category[`category_${i}`]);

            categories +=
              `Category ${c}: ` + item[c - 1].category[`category_${i}`];
            categories += "</br>";
          }
          accordionGamesListBody.appendChild(gamesListInnerText);
          document.getElementById(`gamesListInnerText_${i}`).innerHTML =
            categories;
          categories = "";
        }
      }
    }
  }

  async function fillAvailableStudentsList() {
    const studentNamesItems = document.getElementById("studentNamesItems");
    studentNamesItems.innerHTML = null;
    const students = document.getElementsByClassName("students");
    studentList.forEach((student) => {
      // console.log("students:", students);
      // if (!students.includes(student.studentName)) { //todo change this to email
      const entry = document.createElement("button");
      entry.textContent = student.studentName;
      entry.className = "students";
      if (studentList[studentList.indexOf(student)].remove) {
        entry.style.backgroundColor = "black";
        entry.style.color = "white";
      }
      entry.addEventListener("click", () => {
        if (entry.style.backgroundColor === "black") {
          entry.style = null;
          delete studentList[studentList.indexOf(student)]?.remove;
          return;
        }
        entry.style.backgroundColor = "black";
        entry.style.color = "white";
        studentList[studentList.indexOf(student)].remove = true;
        // console.log("studentList:",studentList);
        // console.log("student:", student)
      });
      studentNamesItems.append(entry);
    });
  }
}

//! --------------------------------------------- Game Functionality ---------------------------------------------

if (round === "round1") {
  // console.log(roundOneArray);
  document.getElementById("catr1-1").innerText = roundOneArray[0].category;
  document.getElementById("catr1-2").innerText = roundOneArray[6].category;
  document.getElementById("catr1-3").innerText = roundOneArray[12].category;
  document.getElementById("catr1-4").innerText = roundOneArray[18].category;
  document.getElementById("catr1-5").innerText = roundOneArray[24].category;
  document.getElementById("catr1-6").innerText = roundOneArray[30].category;
}

if (round === "round2") {
  document.getElementById("catr2-1").innerText = roundTwoArray[0].category;
  document.getElementById("catr2-2").innerText = roundTwoArray[1].category;
  document.getElementById("catr2-3").innerText = roundTwoArray[2].category;
  document.getElementById("catr2-4").innerText = roundTwoArray[3].category;
  document.getElementById("catr2-5").innerText = roundTwoArray[4].category;
  document.getElementById("catr2-6").innerText = roundTwoArray[5].category;
}

if (round === "final") {
}

function clearInputs() {
  document.getElementById("classNameInputField").value = "";
  document.getElementById("unitNameInputField").value = "";
  document.getElementById("categoryInputField").value = "";
  document.getElementById("questionInputField").value = "";
  document.getElementById("answerInputField").value = "";
}
//---------------------------------------------- Event Listeners ----------------------------------------------

passBtn?.addEventListener("click", function listener() {
  if (passed == undefined || passed == false) {
    console.log("passed value:", passed);
    console.log("I'll Pass Thank you");
    switchPlayer();
    // displayPlayerTurnMessage();
    passed = true;
    console.log("passed value:", passed);
  } else {
    switchPlayer();
    console.log("can't pass anymore");
    console.log("passed value:", passed);
    // Change to close the window and the question.
  }
});

activeStudentsList?.addEventListener("click", fetchStudentList);

//-------------------------------------------------- Functions ------------------------------------------------

// Get Player Names on the Title Screen and Set to Local Storage

//!--------------------------------------------- Title Screen Function ------------------------------------------

function titleScreen() {
  teacherSignInBtn.addEventListener("click", function signInTeacher() {
    window.location.href = `${PREFIX}${PORT}/admin_login.html`;
  });
  studentRegistrationBtn.addEventListener("click", function signInStudent() {
    window.location.href = `${PREFIX}${PORT}/student_registration.html`;
  });
}

//!----------------------------------------------- Button Enable/Disable ----------------------------------------
// Disable the pass and guess buttons / enable the placeholder pass and guess buttons
function deactivateButtons() {
  placeholderGuessBtn.style.display = "inline-block";
  guessBtn.style.display = "none";
  placeholderPassBtn.style.display = "inline-block";
  passBtn.style.display = "none";
}

// Disable the close button
function hideTextDisplayBtn() {
  textDisplayBtn.style.display = "none";
}

// Enable the pass and guess buttons / disable the placeholder pass and guess buttons
function activateButtons() {
  placeholderGuessBtn.style.display = "none";
  guessBtn.style.display = "inline-block";
  placeholderPassBtn.style.display = "none";
  passBtn.style.display = "inline-block";
}

// Enable the next round button/disable the placeholder nextround button
function enableNextRound() {
  nextRound.style.display = "inline-block";
  placeholderNextRound.style.display = "none";
}

//!------------------------------------------ Scoreboard and Name Functionality ------------------------------------

// Todo -- Change this to deal with multiple players coming from the socket --
function getNamesAndScoreboardInfo() {
  // console.log(sessionStorage.players)
  // if (!sessionStorage.players||sessionStorage.players == undefined) {
  //   console.log("here")
  //   sessionStorage.players = JSON.stringify([{"studentName":"Player 1"},{"studentName":"Player 2"}])
  // }
  // alert(JSON.stringify(sessionStorage.players));
  if (sessionStorage.token) {
    let playerList = JSON.parse(sessionStorage.playerList);
    const ws = new WebSocket("ws://127.0.0.1:3300");
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({playerList: playerList}))
    })
  }
  // let players = [{'studentName': "player 1"}];
  // Todo -- Limit the number of players to the top 5 scorers:
  // Todo -- sort the players by score
  // Todo -- only add the first 5 entries
  // Todo -- on refresh, clear the players and scores html lists
  // console.log("players:",players)
  function fillPlayerList () {
    console.log("players",playerList)
  playerList.forEach((player) => {
    const playerListing = document.createElement("div");
    playerListing.innerText = player.studentName;
    document.getElementById("players").append(playerListing);

    const playerScore = document.createElement("div");
    playerScore.innerText = player.score;
    document.getElementById("scores").append(playerScore);
  });
}


  //Todo -- Add logic to randomly pick the active player from the list of players
  // activePlayer = playerOnesName;
  fillPlayerList();

}

// Notify that it is player 1's turn to choose
function displayPlayerTurnMessage() {
  // console.log("activePlayer in Display Player Turn Message Function", activePlayer)
  if (activePlayer[activePlayer.length - 1] === "s") {
    playerTurn.innerText = `${activePlayer}' turn. Pick an Answer!`;
  } else {
    playerTurn.innerText = `${activePlayer}'s turn. Pick an Answer!`;
  }
}

// Switch Players
function switchPlayer() {
  // if (passed === true) {
  //   // passed = false;
  // } else if (activePlayer == playerOnesName) {
  //   activePlayer = playerTwosName;
  //   activePlayerScore = player2Score;
  //   console.log("Player's turn:", activePlayer);
  //   win = null;
  // } else if (activePlayer == playerTwosName) {
  //   activePlayer = playerOnesName;
  //   activePlayerScore = player1Score;
  //   console.log("Player's turn:", activePlayer);
  //   win = null;
  // }
  displayPlayerTurnMessage();
}

function setActivePlayerScore(pointsAvailable) {
  // if (activePlayer === playerOnesName) {
  //   console.log("pointsAvailable:", pointsAvailable);
  //   console.log("activePlayerScore:", activePlayerScore);
  //   console.log("round1ArrayScore", roundOneArray[index].score);
  //   player1Score = activePlayerScore += pointsAvailable;
  // } else if (activePlayer === playerTwosName) {
  //   player2Score = activePlayerScore += pointsAvailable;
  //   console.log("pointsAvailable:", pointsAvailable);
  //   console.log("activePlayerScore:", activePlayerScore);
  //   console.log("round1ArrayScore", roundOneArray[index].score);
  // }
}

textDisplayBtn?.addEventListener("click", function () {
  closeTextDisplayWindow();
  deactivateButtons();
  hideTextDisplayBtn();
});

//! --------------------------------------- Open the Clue Window -----------------------
function openTextDisplayWindow(index) {
  textDisplay.style.display = "flex";
  textDisplay.style.border = ".5em solid black";
  textDisplay.style.borderRadius = "2em";
  textDisplay.style.height = "clamp(15vh,14em,50vh)";
  textDisplay.style.width = "60%";
  textDisplay.style.top = "7em";
  textDisplay.style.left = "20%";
  textDisplayBtn.innerText = "Buzz In";
  setTimeout(() => {
    textDisplayBtn.style.display = "inline-block";
    textDisplayBtn.id = "riskBtn"; //todo maybe change this later to remove the id change
    document.getElementById("riskBtn").addEventListener("click", () => {
      //todo maybe change this later to remove the id change
      console.log("click");
    });
  }, 200);

  //! --------------------------------- Hide the Clue Window text until the animation finishes -----------------
  setTimeout(() => {
    textDisplay.style.color = "white";
  }, "200");

  //!---------------------------------------------- Timer for Buzzing in ---------------------------------------
  setTimeout(() => {
    deactivateButtons();
    textDisplayBtn.id = "textDisplayBtn"; //todo maybe change this later to remove the id change
    textDisplayBtn.innerText = "Close";
    // textDisplayBtn.innerHTML = `<button id="textDisplayBtn">Risk</button>`

    if (round === "round1") {
      textDispCont.innerText =
        "Time Up! The Answer Was " + `"${roundOneArray[index].answer}"`;
    }
    if (round === "round2") {
      textDispCont.innerText =
        "Time Up! The Answer Was " + `"${roundTwoArray[index].answer}"`;
    }
    if (round === "final") {
      textDispCont.innerText =
        "Time Up! The Answer Was " + `"${finalJeopardyCategory[index].answer}"`;
    }
    textDisplayBtn.style.display = "inline-block";
  }, "5000");
}

//! ---------------------------------------- Function to Close the Clue Window ----------------------------------
function closeTextDisplayWindow() {
  textDisplay.style.color = "rgb(92, 107, 160)";
  textDisplay.style.height = "0em";
  textDisplay.style.width = "0em";
  textDisplay.style.top = "12em";
  textDisplay.style.left = "50%";
  textDisplay.style.borderRadius = "0";
  textDisplay.style.border = "0";
  if (win === false) {
    // passed = false;
    // win = undefined;
    console.log("playerOnesName:", playerOnesName);
    console.log("playerTwosName", playerTwosName);

    if (activePlayer == playerOnesName) {
      activePlayer = playerTwosName;
    } else {
      activePlayer = playerOnesName;
    }
    displayPlayerTurnMessage();
    console.log("activePlayer", activePlayer);
  }
}

//!----------------------------------------- Correct / Incorrect Functions -----------------------------------------

const correct = () => {
  playerGuess = "";
  textDispCont.textContent = `Congratulations ${activePlayer}, you answered correctly!`;
  textDisplayBtn.style.display = "inline-block";
  let pointsAvailable;
  if (round === "round1") {
    pointsAvailable = roundOneArray[index].score;
  }
  if (round === "round2") {
    pointsAvailable = roundTwoArray[index].score;
  }
  if (round === "final") {
    console.log("implement this later");
  }
  setActivePlayerScore(pointsAvailable);
  p1Score.textContent = player1Score;
  p2Score.textContent = player2Score;
  guessBtn.removeEventListener("click", submitGuess);
  deactivateButtons();
};

const incorrect = () => {
  playerGuess = "";
  let pointsAvailable;
  if (round === "round1") {
    pointsAvailable = roundOneArray[index].score * -1;
  }
  if (round === "round2") {
    pointsAvailable = roundTwoArray[index].score * -1;
  }
  if (round === "final") {
    console.log("implement this later");
  }
  if (passed == false || passed == undefined) {
    // activePlayerScore = 0;
    setActivePlayerScore(pointsAvailable);
    switchPlayer();
    console.log("activePlayerScore:", activePlayerScore);
    passed = true;
    textDispCont.textContent = `Wrong answer. ${activePlayer}, would you like to play?`;
    p1Score.textContent = player1Score;
    p2Score.textContent = player2Score;
    // passed = true;
    if (round === "round1") {
      setTimeout(() => {
        textDispCont.textContent = roundOneArray[index].question;
      }, 2000);
    }
    if (round === "round2") {
      setTimeout(() => {
        textDispCont.textContent = roundTwoArray[index].question;
      }, 2000);
    }
    if (round === "final") {
      setTimeout(() => {
        textDispCont.textContent = finalJeopardyCategory.question;
      }, 2000);
    }
    // setTimeout(() => {
    //   textDispCont.textContent = roundOneArray[i].question;
    // }, 2000);
  } else {
    // activePlayerScore = 0;
    setActivePlayerScore(pointsAvailable);
    textDispCont.textContent = `I'm sorry, ${activePlayer} that's the wrong answer.`;
    p1Score.textContent = player1Score;
    p2Score.textContent = player2Score;
    switchPlayer();
    setTimeout(() => {
      // textDisplay.style.display = "none";
      closeTextDisplayWindow();
      deactivateButtons();
      hideTextDisplayBtn();
    }, 2000);
  }
};

function submitGuess() {
  // Set the playerGuess Variable
  playerGuess = inputFieldForAnswer.value;

  // Clear the input field
  inputFieldForAnswer.value = "";

  // Check the Round
  if (round === "round1") {
    if (
      roundOneArray[index].answer.toLowerCase() === playerGuess.toLowerCase()
    ) {
      win = true;
      correct();
    } else {
      win = false;
      incorrect();
    }
  }
  if (round === "round2") {
    if (
      roundTwoArray[index].answer.toLowerCase() === playerGuess.toLowerCase()
    ) {
      win = true;
      correct();
    } else {
      win = false;
      incorrect();
    }
  }
  if (round === "final") {
    if (
      finalJeopardyCategory[i].answer.toLowerCase() == playerGuess.toLowerCase()
    ) {
      win = true;
      correct();
    } else {
      win = false;
      incorrect();
    }
  }
}

//! Round One Function
async function roundOne() {
  if (document.title === "Round-1") {
    getNamesAndScoreboardInfo();
  }
  // console.log("studentList:",studentList)

  // const ws = new WebSocket(`ws://127.0.0.1:${PORT}`);
  // sessionStorage.currentGame = "";
  // if (sessionStorage.currentGame.length > 0) {
  // const val = { sessionStorage: currentGame };

  //todo -- move ws.send(JSON.stringify(teacherPresent)); to respond to students signing up after the teacher has already opened the websocket

  const ws = new WebSocket("ws://127.0.0.1:3300");

  ws.addEventListener("open", () => {
    console.log("sending now...");
    // console.log(gameObject);
    console.log("sent done");
  });

  ws.addEventListener("message", (message) => {
    console.log("message.data.teacherPresent:", message.data);
    if (message.data[0] === "{") {
      message = JSON.parse(message.data);
      console.log("message:", JSON.parse(message));
      // console.log(message.question);
      const {
        answer,
        question,
        category,
        className,
        gameStarted,
        gameName,
        playerList,
        playerObject,
      } = message;

      sessionStorage.answer = answer;
      sessionStorage.category = category;
      sessionStorage.question = question;
      sessionStorage.className = className;
      sessionStorage.gameStarted = gameStarted;
      sessionStorage.playerList = playerList;
      if (playerObject) {
        studentList.push(JSON.parse(playerObject));
      }
      // console.log("studentList after message:", studentList)
      // if (!studentList.includes(playerObject.email)) {
      //   console.log("not found, so pushing", playerObject)
      //   studentList.push(playerObject)
      // }
      // sessionStorage.players = studentList
      // if (sessionStorage.players.length > 0){
      //   let temp = sessionStorage.players
      // console.log("sessionStorage.players:", sessionStorage.players);

      // }

      // sessionStorage.playerList.push(playerObject)

      //Todo Finish looking for students in the websocket, as they submit

      pullGameInformationFromSessionStorage(
        answer,
        question,
        category,
        className,
        gameName,
        players,
        playerObject,
        gameStarted
      );
      getNamesAndScoreboardInfo();
      displayPlayerTurnMessage();
    }
  });

  // }
  function pullGameInformationFromSessionStorage() {
    /* 
  Destructure game information from session storage
  Parse the objects to question, category, and answer
  Fill gameplay arrays with questions and answers, splitting at new lines
  Fill gameplayCategories array with category items, duplicating six times for each category

*/

    let { answer, question, category, className, gameName, gameStarted } =
      sessionStorage;
    //! must have an open websocket
    // broadcastGameInformation(category, className, gameName, question, answer);
    // sessionStorage.question = "";
    // sessionStorage.answer = "";

    // console.log(className);
    classNameText.textContent = className;
    gameNameText.textContent = gameName;

    // console.log(classNameText)
    const gameplayAnswers = [];
    const gameplayQuestions = [];
    const gameplayCategories = [];

    for (let index = 0; index < 6; index += 6) {
      let answerArray = Object.entries(answer);
      let questionArray = Object.entries(question);
      for (const item of answerArray) {
        gameplayAnswers.push(item[1].split("\r\n"));
      }
      for (const item of questionArray) {
        gameplayQuestions.push(item[1].split("\r\n"));
      }
    }
    for (let index = 0; index < Object.values(category).length; index++) {
      for (let i = 0; i < 6; i += 6) {
        gameplayCategories.push(category[`category_${index}`]);
      }
    }
    const tempAnswersArray = [];
    const tempQuestionsArray = [];
    for (let i = 0; i < gameplayAnswers.length; i++) {
      for (let item = 0; item < gameplayAnswers[i].length; item++) {
        tempAnswersArray.push(gameplayAnswers[i][item]);
        tempQuestionsArray.push(gameplayQuestions[i][item]);
      }
    }
    for (let position = 0; position < 6; position++) {
      for (let i = 0; i < 6; i++) {
        roundOneArray[position].question = question[`question_${position}`];
        roundOneArray[position].answer = answer[`answer_${position}`];
        roundOneArray[position].category = category[`category_${position}`];
      }
      for (let i = 0; i < 36; i++) {
        if (!roundOneArray[i]) {
          roundOneArray.push([]);
        }
        if (gameplayCategories[i]) {
          roundOneArray[i].category = gameplayCategories[i];
        }
        if (tempQuestionsArray[i]) {
          roundOneArray[i].question = tempQuestionsArray[i];
        }
        if (tempAnswersArray[i]) {
          roundOneArray[i].answer = tempAnswersArray[i];
        }
      }
    }
  }

  for (let m = 0; roundTwoArray.length < 36; m++) {
    for (let questionPosition = m; questionPosition < 60; questionPosition++) {
      for (let catIndex = 0; catIndex < 6; catIndex++) {
        if (roundTwoArray.length < 36) {
          roundOneArray.push(placeholderQuestions[questionPosition]);
          questionPosition += 5;
          roundTwoArray.push(placeholderQuestions[questionPosition]);
          questionPosition += 5;
        }
      }
    }
  }
  const tempRoundOneArray = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < roundOneArray.length; j += 6) {
      tempRoundOneArray.push(roundOneArray[i + j]);
    }
  }

  // Set the score values
  let j = 0;
  for (let i = 0; i < tempRoundOneArray.length; i++) {
    if (i % 6 === 0 && i != 0) {
      j += 200;
    }
    tempRoundOneArray[i].score = 200 + j;
  }

  //! Change this to the WS object
  // roundOneArray = tempRoundOneArray;
  console.log("roundOneArray:", roundOneArray);

  //!------------------------------------- Fill in the Answer board --------------------------------------

  // First Row
  for (let i = 0; i < 6; i++) {
    if (round === "round1") {
      answer200.textContent = `$200`;
    } else if (round === "round2") {
      answer200.textContent = `$400`;
    }
    answer200.className = `answer`;
    answerBoard.appendChild(answer200.cloneNode(true));
  }
  // Second Row
  for (let i = 0; i < 6; i++) {
    answer400.className = `answer`;
    if (round === "round1") {
      answer400.textContent = `$400`;
    } else if (round === "round2") {
      answer400.textContent = `$800`;
    }
    answerBoard.appendChild(answer400.cloneNode(true));
  }
  // Third Row
  for (let i = 0; i < 6; i++) {
    // answer600.id = `answerBtn${i + 1}`;
    answer600.className = `answer`;
    if (round === "round1") {
      answer600.textContent = `$600`;
    } else if (round === "round2") {
      answer600.textContent = `$1200`;
    }
    answerBoard.appendChild(answer600.cloneNode(true));
  }
  // Fourth Row
  for (let i = 0; i < 6; i++) {
    // answer800.id = `answerBtn${i + 1}`;
    answer800.className = `answer`;
    if (round === "round1") {
      answer800.textContent = `$800`;
    } else if (round === "round2") {
      answer800.textContent = `$1600`;
    }
    answerBoard.appendChild(answer800.cloneNode(true));
  }
  // Fifth Row
  for (let i = 0; i < 6; i++) {
    answer1000.className = `answer`;
    if (round === "round1") {
      answer1000.textContent = `$1000`;
    } else if (round === "round2") {
      answer1000.textContent = `$2000`;
    }
    answerBoard.appendChild(answer1000.cloneNode(true));
  }

  let answerSquares = document.getElementsByClassName("answer");
  for (let i = 0; i < answerSquares.length; i++) {
    answerSquares[i].addEventListener("click", function clicked() {
      passed = false;

      let box = answerSquares[i];
      activateButtons();
      box.textContent = "";
      openTextDisplayWindow(i);

      //! This fills in the question (answer) when the box is clicked.
      if (round === "round1") {
        textDispCont.textContent = roundOneArray[i].question;
      } else if (round === "round2") {
        textDispCont.textContent = roundTwoArray[i].question;
      }

      //! When clicked, the guess button calls submitGuess
      guessBtn.addEventListener("click", submitGuess);
      answerSquares[i].removeEventListener("click", clicked);
    });
  }
}
