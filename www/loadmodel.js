let model;
let webcam;

async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/classic-11/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
    }
}

async function init() {
    const webcamElement = document.getElementById('wc');
    webcam = new Webcam(webcamElement);
    
    await webcam.setup();
    await loadModel();
    
    if (model) {
        console.log('Model and webcam initialized successfully');
    } else {
        console.error('Model is not loaded');
    }
}

async function predict() {
    if (!model || !webcam) {
        console.error('Model or webcam not initialized');
        return;
    }

    const img = webcam.capture();
    console.log('Captured image tensor:', img.shape, img.dataSync());

    const predictions = model.predict(img);
    const predictionArray = await predictions.data();
    console.log('Predictions:', predictionArray);

    const predictedClass = predictions.as1D().argMax();
    const classId = (await predictedClass.data())[0];
    console.log('Predicted Class ID:', classId);

    let predictionText = '';
    let solutions = [];

    switch (classId) {
        case 0:
            predictionText = "Angry";
            solutions = [
                "1. Approach the student calmly and ask them to share what’s bothering them.",
                "2. Encourage the student to take deep breaths or use other relaxation techniques.",
                "3. Engage the student in a discussion about appropriate ways to express anger."
            ];
            break;
        case 1:
            predictionText = "Disgust";
            solutions = [
                "1. Identify the source of the student's disgust and try to address it directly.",
                "2. Encourage the student to communicate their feelings and provide support.",
                "3. Help the student find positive aspects or solutions to the situation."
            ];
            break;
        case 2:
            predictionText = "Fear";
            solutions = [
                "1. Provide reassurance and a safe environment for the student.",
                "2. Gradually introduce the student to what they fear in a controlled manner.",
                "3. Encourage the student to talk about their fears and offer support."
            ];
            break;
        case 3:
            predictionText = "Happy";
            solutions = [
                "1. Share in the student's happiness and celebrate their successes.",
                "2. Encourage the student to express what makes them happy.",
                "3. Use the student's positive mood to engage them in learning activities."
            ];
            break;
        case 4:
            predictionText = "Neutral";
            solutions = [
                "1. Provide the student with a variety of activities to spark interest.",
                "2. Check in with the student to see if they need any support or assistance.",
                "3. Encourage the student to explore new hobbies or interests."
            ];
            break;
        case 5:
            predictionText = "Sad";
            solutions = [
                "1. Offer a listening ear and allow the student to express their feelings.",
                "2. Provide comforting and supportive words to help lift the student's mood.",
                "3. Engage the student in activities that they usually enjoy."
            ];
            break;
        case 6:
            predictionText = "Surprise";
            solutions = [
                "1. Acknowledge the student's surprise and explore the cause together.",
                "2. Help the student understand and adapt to unexpected changes.",
                "3. Use the element of surprise to introduce new and exciting learning opportunities."
            ];
            break;
        default:
            predictionText = "Unknown";
            solutions = ["Stay positive and keep exploring your emotions."];
    }

    console.log('Prediction:', predictionText);
    document.getElementById("prediction").innerText = "Mood Detection: " + predictionText;
    
    const solutionElement = document.getElementById("solution");
    solutionElement.innerHTML = "";
    solutions.forEach(solution => {
        const listItem = document.createElement("li");
        listItem.textContent = solution;
        solutionElement.appendChild(listItem);
    });

    predictedClass.dispose();
    predictions.dispose();
}

init();
