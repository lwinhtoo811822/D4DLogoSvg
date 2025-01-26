<script>
  const questionContainer = document.getElementById('questions');
  const timeDisplay = document.getElementById('time');
  const reviewContainer = document.getElementById('review');

  document.getElementById('startBtn').onclick = startTest;

  function startTest() {
      document.getElementById('startContainer').style.display = 'none'; // Hide start button
      document.getElementById('HPNQ').style.display = 'block'; // Show HPNQ
  	  document.getElementById('Vocab').style.display = 'none'; // Hide Vocabs
      document.getElementById('TimeSealed').style.display = 'block'; // Show timer
      document.getElementById('submitBtn').style.display = 'block'; // Show submit button
      document.getElementById('PrintP').style.display = 'block'; // Show PrintP button
      document.getElementById('PRINT').style.display = 'block'; // Show print button
      displayQuestions();
      startTimer();
  }

  // Updated displayQuestions function
function displayQuestions() {
    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';

        const ruleSection = q.rule
            ? `
        <p class="rule-name">${q.rule.name}</p>
        <p id="TEXT" class="rule-description">${q.rule.description}</p>
      `
            : '';

        if (q.type === 'dropdown') {
            questionElement.innerHTML = `
          ${ruleSection}
          <p class="Qs">${index + 1}. ${q.question}</p>
          ${q.image ? `<img src="${q.image}" alt="Question Image" class="question-image"><br>` : ''}
          <select id="answer${index}">
            <option value="" disabled selected>Select an answer</option>
            ${q.options.map(option => `<option value="${option}">${option}</option>`).join('')}
          </select>
        `;
        } else if (q.type === 'fill-in-the-blank') {
            questionElement.innerHTML = `
          ${ruleSection}
          <p class="Qs">${index + 1}. ${q.question}</p>
          <input type="text" id="answer${index}" placeholder="Type your answer here" />
        `;
        } else if (q.type === 'drag-and-drop') {
            questionElement.innerHTML = `
          ${ruleSection}
          <p class="Qs">${index + 1}. ${q.question}</p>
          ${q.image ? `<img src="${q.image}" alt="Question Image" class="question-image">` : ''}
          <p class="drag-instructions">Drag the items below into the respective categories:</p>
          <div class="drag-options" id="dragOptions${index}">
          ${q.options.map((option, i) => `<div class="drag-item" draggable="true" id="drag${index}-${i}">${option}</div>`).join("")}
        </div>
        <div class="drop-zones" id="dropZones${index}">
          <div class="drop-zone" data-answer="Yes">Yes</div>
          <div class="drop-zone" data-answer="No">No</div>
        </div>
        <button class="cancel-drag" onclick="resetDragAndDrop(${index})">Cancel</button>
      `;
        } else {
            questionElement.innerHTML = `
          ${ruleSection}
          <p class="Qs">${index + 1}. ${q.question}</p>
          ${q.image ? `<img src="${q.image}" alt="Question Image" class="question-image">` : ''}
          <ul class="options">
            ${q.options.map((option, i) =>
                `<li>
                <input type="checkbox" name="q${index}" value="${String.fromCharCode(65 + i)}"> ${option}
              </li>`
            ).join('')}
          </ul>
        `;
        }

        questionContainer.appendChild(questionElement);

        if (q.type === 'drag-and-drop') {
            initializeDragAndDrop(index);
        }
    });

    questionContainer.style.display = 'block'; // Show questions
}

  function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Submitting your test...");
            evaluateTest(); // Automatically submit the test when time runs out
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

  document.getElementById('submitBtn').onclick = evaluateTest;

// Function to initialize drag-and-drop functionality
function initializeDragAndDrop(index) {
    const dragItems = document.querySelectorAll(`#dragOptions${index} .drag-item`);
    const dropZones = document.querySelectorAll(`#dropZones${index} .drop-zone`);

    dragItems.forEach(item => {
        item.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', e.target.id);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-hover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-hover');
        });

        zone.addEventListener('drop', e => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text');
    const draggedItem = document.getElementById(draggedItemId);

    if (draggedItem) {
        zone.appendChild(draggedItem); // Append dragged item to the drop zone
        zone.dataset.selected = draggedItem.innerText.trim(); // Save the selection
        zone.classList.remove('drag-hover');
    }
});
    });
}
  
// Function to reset drag-and-drop selections for a specific question
function resetDragAndDrop(index) {
    const dragOptions = document.getElementById(`dragOptions${index}`);
    const dropZones = document.querySelectorAll(`#dropZones${index} .drop-zone`);

    dropZones.forEach(zone => {
        const items = Array.from(zone.querySelectorAll('.drag-item'));
        items.forEach(item => {
            dragOptions.appendChild(item);
            item.draggable = true;
        });
        zone.innerHTML = ''; // Clear drop zone content
    });

    initializeDragAndDrop(index); // Reapply drag-and-drop functionality
}

// Disable all inputs after submission
function disableInputs() {
    const inputs = document.querySelectorAll('input, select, .drag-item');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT' || input.tagName === 'INPUT') {
            input.disabled = true; // Disable text inputs and dropdowns
        } else if (input.classList.contains('drag-item')) {
            input.draggable = false; // Disable dragging for drag-and-drop items
        }
    });

    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.style.pointerEvents = 'none'; // Disable interactions with drop zones
    });
}
  
// Function to reset drag-and-drop selections for a specific question
function resetDragAndDrop(index) {
  const dragOptions = document.getElementById(`dragOptions${index}`);
  const dropZones = document.querySelectorAll(`#dropZones${index} .drop-zone`);

  dropZones.forEach(zone => {
    const items = zone.querySelectorAll(".drag-item");
    items.forEach(item => dragOptions.appendChild(item));
    zone.dataset.selected = "";
  });
}  
  
// Update the evaluateTest functio
function evaluateTest() {
    const studentName = document.getElementById('studentName').value.trim();
    const batchNumber = document.getElementById('batchNumber').value.trim();

    const nameDisplay = studentName ? `<strong>Student Name:</strong> ${studentName}` : 'Student Name: Anonymous';
    const batchDisplay = batchNumber ? `<strong>Batch No.:</strong> ${batchNumber}` : 'Batch No.: Not Provided';

    let score = 0;
    const totalQuestions = questions.length;
    const userAnswers = [];
    const feedback = [];

    questions.forEach((q, index) => {
        let userAnswer = '';
        let isCorrect = false;

        if (q.type === 'dropdown') {
            userAnswer = document.getElementById(`answer${index}`).value || '';
            isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
        } else if (q.type === 'fill-in-the-blank') {
            userAnswer = document.getElementById(`answer${index}`).value.trim();
            isCorrect = Array.isArray(q.answer)
                ? q.answer.some(ans => ans.toLowerCase() === userAnswer.toLowerCase())
                : q.answer.toLowerCase() === userAnswer.toLowerCase();
        } else if (q.type === 'drag-and-drop') {
            const dropZones = document.querySelectorAll(`#dropZones${index} .drop-zone`);
            const userSelections = { Yes: [], No: [] };

            // Collect user selections from each drop zone
            dropZones.forEach(zone => {
                const zoneType = zone.dataset.answer; // "Yes" or "No"
                const items = Array.from(zone.querySelectorAll('.drag-item')).map(item =>
                    item.innerText.trim().toLowerCase()
                );
                userSelections[zoneType] = items;
            });

            // Expected answers grouped by "Yes" and "No"
            const expectedSelections = {
                Yes: q.answer
                    .map((ans, i) => (ans === "Yes" ? q.options[i].trim().toLowerCase() : null))
                    .filter(item => item !== null),
                No: q.answer
                    .map((ans, i) => (ans === "No" ? q.options[i].trim().toLowerCase() : null))
                    .filter(item => item !== null),
            };

            // Compare user selections with expected answers (ignoring order)
            let correctCount = 0;
            let totalCorrect = expectedSelections.Yes.length + expectedSelections.No.length;

            Object.keys(expectedSelections).forEach(zone => {
                const correctItems = expectedSelections[zone];
                const userItems = userSelections[zone] || [];
                const matches = userItems.filter(item => correctItems.includes(item)); // Count matches
                correctCount += matches.length;
            });

            // Final check: total matches must equal the total correct answers
            isCorrect = correctCount === totalCorrect;

            // Prepare user answer for debugging/logging
            userAnswer = JSON.stringify(userSelections);
        } else {
            const selectedOptions = Array.from(
                document.querySelectorAll(`input[name="q${index}"]:checked`)
            ).map(opt => opt.value.trim().toLowerCase());
            isCorrect = Array.isArray(q.answer)
                ? selectedOptions.length === q.answer.length &&
                  selectedOptions.every(opt => q.answer.map(a => a.trim().toLowerCase()).includes(opt))
                : selectedOptions[0] === q.answer.trim().toLowerCase();
            userAnswer = selectedOptions.join(', ');
        }

        if (isCorrect) score++;
        userAnswers.push(userAnswer);

        feedback.push(
            `Question ${index + 1}: ${isCorrect ? '✅' : '❌'}\n` +
            `  - Your Answer: ${userAnswer || '(No Answer)'}\n` +
            `  - Correct Answer: ${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}`
        );
    });

    const resultMessage = `
${batchDisplay}
${nameDisplay}

${feedback.join('\n')}

<strong>Total Score: ${score} / ${totalQuestions}</strong>
    `;

    // Send the result to Telegram
    sendResultToTelegram(resultMessage);

    // Display results in the review section
    displayReview(score, totalQuestions, userAnswers, `${batchDisplay}\n${nameDisplay}`, feedback);

    // Scroll to review section
    const reviewSection = document.getElementById('review');
    setTimeout(() => {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
    }, 200);
}



  
function sendResultToTelegram(message) {
    const telegramToken = '7369868826:AAHk_4Fcs2W3aGDvjCWaXf1Oe3Yo02xxJlI';
    const chatId = '-1002329198348';
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    // Telegram API limits messages to 4096 characters, so split the message if it's too long
    const maxMessageLength = 4096;
    const messageChunks = [];

    for (let i = 0; i < message.length; i += maxMessageLength) {
        messageChunks.push(message.substring(i, i + maxMessageLength));
    }

    // Send each chunk separately to Telegram
    messageChunks.forEach(chunk => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: chunk,
                parse_mode: 'HTML',
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (!data.ok) {
                    console.error('Telegram Error:', data.description);
                } else {
                    console.log('Telegram Response:', data);
                }
            })
            .catch(error => console.error('Telegram Error:', error));
    });
}


function displayReview(score, total, userAnswers, nameDisplay, feedback) {
    const batchNumber = document.getElementById('batchNumber').value.trim() || "Not Provided";
    const studentName = document.getElementById('studentName').value.trim() || "Anonymous";

    // Render header and summary in the review container
    reviewContainer.innerHTML = `
        <h2>Test Review</h2>
        <b>Batch No. :</b> ${batchNumber}<br>
        <b>Student Name :</b> ${studentName}<br>
        <b>Your Score:</b> ${score} out of ${total}<hr>
    `;

    // Loop through questions and display detailed feedback
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index] || 'No answer';
        const correctAnswers = Array.isArray(q.answer) ? q.answer.join(", ") : q.answer;
        const explanation = q.explanation;

        // Determine if the answer is correct
        const isCorrect = feedback[index].includes('✅');

        // Append question feedback to the review container
        reviewContainer.innerHTML += `
            <div class="rContainer">
                <p class="rQs"><strong>Question ${index + 1}:</strong> ${q.question}</p>
                <p class="rAns"><b>Your Answer:</b> ${Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer} ${isCorrect ? '✅' : '❌'}</p>
                <p class="CorrectAns"><b>Correct Answer:</b> <span class="CAns">${correctAnswers}</span></p>
                <p class="Explain note"><em>${explanation}</em></p>
            </div>
        `;
    });

    // Ensure the review section is displayed
    reviewContainer.style.display = 'block';
}



// Zoom functionality
// Get modal element
const zoomModal = document.getElementById("zoomModal");
const zoomText = document.getElementById("zoomText");
const closeModal = document.querySelector(".close");

// Toggle body scroll
function disableScroll() {
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

function enableScroll() {
    document.body.style.overflow = ''; // Enable scrolling
}

// Display the modal when #LAW, #SP, or #Dat is clicked
    ["LAW", "SP", "Dat"].forEach(id => {
      document.getElementById(id).onclick = function() {
        zoomText.innerHTML = this.innerHTML; // Copy the inner HTML
        zoomModal.style.display = "block"; // Show the modal
        disableScroll(); // Disable scrolling on the body
      };
    });

// Close the modal
closeModal.onclick = function() {
    zoomModal.style.display = "none"; // Hide the modal when the close button is clicked
    enableScroll(); // Re-enable scrolling on the body
};

// Close the modal when clicking anywhere outside of the modal content
window.onclick = function(event) {
    if (event.target == zoomModal) {
        zoomModal.style.display = "none"; // Hide modal if click is outside of the modal
        enableScroll(); // Re-enable scrolling on the body
    }
};
</script>