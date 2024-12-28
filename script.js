// Show signup form when clicking on "Create Account" link
document.getElementById("show-signup").addEventListener("click", function () {
    document.getElementById("login-form").style.display = "none"; // Hide Login
    document.getElementById("signup-form").style.display = "block"; // Show Signup
  });
  
  // Show login form when clicking on "Login" link
  const showLogin = document
    .getElementById("show-login")
    .addEventListener("click", function () {
      document.getElementById("signup-form").style.display = "none"; // Hide Signup
      document.getElementById("login-form").style.display = "block"; // Show Login
    });
  
  const loginbtn = document.querySelector(".login-btn");
  const loginUsername = document.getElementById("login-username");
  const loginPassword = document.getElementById("login-password");

  // Signup button event
  const signupbtn = document.querySelector(".signup-btn");
  const signupUsername = document.getElementById("signup-username");
  const signupPassword = document.getElementById("signup-password");
  signupbtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    if (signupUsername.value === "" || signupPassword.value === "") {
      alert("Please enter both username and password.");
    } else {
      try {
        const user = {
          username: signupUsername.value,
          password: signupPassword.value,
        };
  
        const response = await fetch("http://localhost:1000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(user),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
           
  
            // Clear input fields
            signupUsername.value = "";
            signupPassword.value = "";
  
            // Hide the signup screen and show the main content
            if (data.token) {
              // Clear input fields
              signupUsername.value = "";
              signupPassword.value = "";

              // Hide the signup screen and show the main content
              document.querySelector(".main-container").style.display = "flex";
              document.querySelector(".auth-container").style.display = "none";
              console.log("Signup successful");
            } else {
              alert("Unexpected response format.");
            }
          } else {
            alert("Unexpected response format.");
          }
        } else {
          alert("Failed to sign up.");
        }
      } catch (error) {
        alert("An error occurred while signing up. Please try again.");
      }
    }
  });
  
  // Login button event
  
  loginbtn.addEventListener("click", async (e) => {
    e.preventDefault();
  
    if (loginUsername.value === "" || loginPassword.value === "") {
      alert("Please enter both username and password.");
    } else {
      try {
        const user = {
          username: loginUsername.value,
          password: loginPassword.value,
        };
  
        const response = await fetch("http://localhost:1000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            // Store the token in localStorage
            localStorage.setItem("authToken", data.token);
  
            // Clear input fields
            loginUsername.value = "";
            loginPassword.value = "";
  
            // Hide the login screen and show the main content
            document.querySelector(".main-container").style.display = "flex";
            document.querySelector(".auth-container").style.display = "none";
            console.log("Login successful");
  
            // Optionally, fetch protected data right after login
            getProtectedData();
  
            // GETTING THE FETCHED DATE
  
            // get data
            document.addEventListener("DOMContentLoaded", () => {
              const apiUrl = "http://localhost:1000/quote"; // Your API endpoint
  
              fetch(apiUrl)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json(); // Parse the response as JSON
                })
                .then((data) => {
                  // Check if the data is an array
                  if (Array.isArray(data)) {
                    // Get the container where the quotes will be displayed
                    const postContainer = document.querySelector(".posts");
  
                    // Clear existing content
  
                    // Loop through each quote and create a <p> element for each one
                    data.forEach((quote) => {
                      const quoteElement = document.createElement("p");
                      const date = document.createElement("p");
                      const box = document.createElement("div");
                      box.classList.add("box");
                      quoteElement.textContent = quote.userquote; // Set the text to the quote
                      data.textContent = quote.data; // set the date to the quote
                      box.appendChild(quoteElement);
                      box.appendChild(data);
                      postContainer.appendChild(box);
                    });
                  } else {
                    console.error("Invalid data format", data);
                  }
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            });
  
            //END OF FETCH DATE
          } else {
            alert("Unexpected response format.");
          }
        } else {
          alert("Invalid username or password.");
        }
      } catch (error) {
        alert("An error occurred while logging in. Please try again.");
      }
    }
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
  
    if (token) {
      // Token exists, consider the user logged in
      console.log("User is already logged in.");
  
      // Optionally, fetch protected data
      getProtectedData();
    } else {
      // Token doesn't exist, prompt user to log in
      console.log("User is not logged in.");
    }
  });
  
  async function getProtectedData() {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("You need to log in first.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:1000/quote", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        data.forEach((quote) => {
          const postContainer = document.querySelector(".posts");
          const quoteElement = document.createElement("p");
          const data = document.createElement("p");
          const box = document.createElement("div");
          box.classList.add("box");
          quoteElement.textContent = quote.userquote; // Set the text to the quote
          const formattedDate = new Date(quote.createdAt)
            .toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
            .replace(",", "")
            .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")
            .replace(" ", " - "); // Format the date
          data.textContent = `-- ${formattedDate}`; // set the formatted date of the quote
          box.appendChild(quoteElement);
          box.appendChild(data);
          postContainer.appendChild(box);
          document.querySelector(".main-container").style.display = "flex";
          document.querySelector(".auth-container").style.display = "none";
        });
        // You can now display this data on your page
      } else {
        console.log("Failed to fetch protected data:", response.status);
        alert("Failed to fetch protected data.");
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
      alert("An error occurred while fetching protected data.");
    }
  }
  
  // LogOut function for the thoughts
  
  const logoutBtn = document.querySelector(".logoutBtn");
  
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    document.querySelector(".main-container").style.display = "none";
    document.querySelector(".auth-container").style.display = "flex";
  });
  
  //for Post Thougths
  
  let sharebtn = document.querySelector(".share");
  let input = document.querySelector(".input");
  
  sharebtn.addEventListener("click", async () => {
    if (input.value === "") {
      alert("Enter thoughts");
      return;
    }
  
    try {
      const data = { userquote: input.value };
  
      // Await the response from fetch
      const response = await fetch("http://localhost:1000/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is successful
      if (response.ok) {
        let box = document.createElement("div");
        let quote = document.createElement("p");
        let posts = document.querySelector(".posts");
  
        posts.appendChild(box);
        box.appendChild(quote);
  
        quote.textContent = input.value;
        input.value = ""; // Clear the input field after posting
      } else {
        console.log("Error: Unable to post quote.");
        alert("Failed to share thoughts.");
      }
    } catch (e) {
      console.error("Error:", e);
      alert("An error occurred while posting.");
    }
  });