const promptform = document.querySelector(".prompt-form");
const promptinput = document.querySelector(".prompt-input");
const chatcontainer = document.querySelector(".chat-container");

const API_KEY = "AIzaSyCML8r-WV7VcUc2oy5QHLOEGE9TuuMFREk";
const API_URL = `https:generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let usremessage = "";

const chatHistory = [];
// function to create elemnt//
const creatMsgElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = "";
  const words = text.splice();
  let wordIndex = 0;
  const typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent +=
        (wordIndex === 0 ? "" : "") + words[wordIndex++];
      botMsgDiv.classList.remove("loading");
    } else {
      clearInterval(typingInterval);
    }
  }, 40);
};

const generateResponce = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  chatHistory.push({
    role: "user",
    parts: [{ text: usremessage }],
  });
  try {
    const responce = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "appplication/json" },
      body: JSON.stringify({ contents: chatHistory }),
    });
    console.log(responce, "response");

    const data = await responce.json();

    if (!responce.ok) throw new Error(data.error.message);
    console.log(data);
    const responceText = data.candidates[0].content.parts[0].text
      .replace(/\*\*\(([^*]+)\)\*\*/g, "$1")

      .trim();
    typingEffect(responceText, textElement, botMsgDiv);
  } catch (error) {
    console.log(error);
  }
};

// hendle the submishion form//

const hendleformsubmit = (e) => {
  e.preventDefault();
  usremessage = promptinput.value.trim();
  if (!usremessage) return;
  promptinput.value = "";
  const userMsgHTML = `<p class="message-text"></p>`;
  const userMsgDiv = creatMsgElement(userMsgHTML, "message-user-mes");
  userMsgDiv.querySelector(".message-text").textContent = usremessage;
  chatcontainer.appendChild(userMsgDiv);

  setTimeout(() => {
    const botMsgHTML = ` <img src="images/logo.jpg" alt="myiage" class="avatar"> <p class="message-text">Just a sec..</p>`;
    const botMsgDiv = creatMsgElement(botMsgHTML, "bot-mes", "loding");
    chatcontainer.appendChild(botMsgDiv);

    generateResponce(botMsgDiv);
  }, 600);
};

promptform.addEventListener("submit", hendleformsubmit);
