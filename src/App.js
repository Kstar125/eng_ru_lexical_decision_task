import './App.css';
import ImageCard from './Components/ImageCard';
import IMAGES from './Images.js'
import SECONDIMAGES from './SecondImages.js';
import ResponseButton from './Components/ResponseButton';
import { useState, useEffect } from 'react'
import AUDIO from './audio.js'
import UniversityLogo from './Photos/photos/universityLogo.png'
import { db } from './firebase-config.js'
import { collection, setDoc, doc, addDoc } from 'firebase/firestore'

//Data Arrays

const russianCognateList = [["Доктор", 0], ["Шарф", 1], ["Робот", 2], ["Статуя", 3], ["Ваза", 4], ["Джинсы", 5], ["Зебра", 6], ["Каноэ", 7], ["Радио", 8], ["Документ", 9], ["Студент", 10], ["Попкорн", 11], ["Кактус", 12], ["Микроскоп", 13], ["Ковбой", 14],
["Бомба", 15], ["Музыка", 16], ["банджо", 17], ["Стетоскоп", 18], ["Пингвин", 19], ["Микрофон", 20], ["Вулкан", 21], ["Полиция", 22], ["Тигр", 23], ["Рок", 24], ["Лама", 25], ["Туалет", 26], ["Ропе", 27], ["Нест", 28],
["Траш", 29], ["Магнит", 30]]

const russianNonCognateList = [["Вентилятор", 31], ["Рюкзак", 32], ["Ремень", 33], ["Часы", 34], ["Церковь", 35], ["Окно", 36], ["Платье", 37], ["Машина", 38], ["Подарок", 39], ["Картина", 40], ["Зеркало", 41], ["Карта", 42],
["Город", 43], ["Пылесос", 44], ["Галстук", 45], ["Яйцо", 46], ["Мост", 47], ["Горох", 48], ["Масло", 49], ["Ифань", 50], ["Женщина", 51], ["Скрипка", 52], ["Барабан", 53], ["Грецкий Орех", 54], ["Печенье", 55], ["Груша", 56]
  , ["Клубника", 57], ["Чайник", 58], ["Кеодорё", 59], ["Шмитрия", 60]]


const SESSION_LENGTH = 35

let exclusionArray = ["Initialize Data Array"]

//Firebase Declarations
const usersCollectionRef = collection(db, "Users")

const USER_ID = Math.random().toString(36).substring(2,8)

//Project Declarations



function App() {

  let [exclusionList] = useState([]);

  let [cognateCount, setCognateCount] = useState(0);

  const updateCognateCount = () => {
    setCognateCount(
      cognateCount = cognateCount + 1
    )
  }

  

  let [nonCognateCount, setNonCognateCount] = useState(0);

  const updateNonCognateCount = () => {
    setNonCognateCount(
      nonCognateCount = nonCognateCount + 1
    )
  }

  const getChosenWord = () => {
    let wordChoiceIndex = Math.floor(Math.random() * 29);
    let arrayChoiceIndex = Math.floor(Math.random() * 2);
    if(cognateCount >= 15 && nonCognateCount < 15){
      arrayChoiceIndex = 0;
    }
    if(nonCognateCount >= 15 && cognateCount < 15){
      arrayChoiceIndex = 1;
    }
    if (arrayChoiceIndex === 1) {
      return [russianCognateList[wordChoiceIndex][0], russianCognateList[wordChoiceIndex][1]];
    }
    return [russianNonCognateList[wordChoiceIndex][0], russianNonCognateList[wordChoiceIndex][1]];
  }
  
  //Initially creating a user

  
  useEffect(() => {
    
    const newUser = async () => {
      await setDoc(doc(usersCollectionRef, USER_ID), { Name: "X" })
   
      
        const trialRef = collection(db, `Users/${USER_ID}/Trials`)
        
      await addDoc(trialRef, {
        chosenWord: 'H',
        instanceWord: 'J',
        time: '4'
      })
      //console.log(USER_ID)
    }

    newUser()
    

  }, [])
  //

  let [fullReport] = useState([]);

  let [instanceReport, setInstanceReport] = useState();

  const generateInstanceReport = async (wordArray, clickedWord, chosenWord, time) => {
    setInstanceReport(
      instanceReport = [wordArray, clickedWord, chosenWord, time]
    );

    fullReport.push(instanceReport);

   
    if(instanceCount > 5){

      //console.log("THE INSTANCE WORD IS: " + chosenWord)
      
      await addDoc(collection(db, `Users/${USER_ID}/Trials`), {
        chosenWord: clickedWord,
        instanceWord: chosenWord,
        time: time
      })
      
      //console.log(instanceCount);
  } 
    console.log(fullReport)
    //console.log(chosenWord)
  }

  let [instanceCount, setInstanceCount] = useState(0);

  const updateInstanceCount = () => {
    setInstanceCount(
      instanceCount = instanceCount + 1
    );
    //console.log(instanceCount)
  }

  let [startTime, setStartTime] = useState();

  const updateStartTime = () => {
    setStartTime(
      startTime = new Date()
    );
  }

  const getQueryWordIndex = (queryWord, cognateArray, nonCognateArray) => {
    let arrayLength = cognateArray.length;

    for (let i = 0; i < arrayLength; i++) {
      if (cognateArray[i][0] === queryWord) {
        return cognateArray[i][1]
      }
    }
    arrayLength = nonCognateArray.length;

    for (let i = 0; i < arrayLength; i++) {
      if (nonCognateArray[i][0] === queryWord) {
        return nonCognateArray[i][1]
      }
    }
  }


  let [chosenWord, setChosenWord] = useState("");
  let [chosenWordNumber, setChosenWordNumber] = useState(0); //Returns the index of the chosenWord in the cognate/non-cognate array.
  let [chosenInstanceNumber] = useState(0); //Returns the index of the chosenWord in the four word array.
  const updateChosenWord = (array) => { 
    
    chosenInstanceNumber = Math.floor(Math.random() * 4)
    setChosenWord(
      chosenWord = array[chosenInstanceNumber]
    );
      //console.log("Chosen Word: " + chosenWord)
    if(exclusionList.includes(chosenWord) && exclusionList.length < 37){ //Removing duplicate trials.
      //console.log("Duplicate test recorded! Instance word: " + chosenWord + " chosenInstanceNumber: " + chosenInstanceNumber);
      if(chosenInstanceNumber === 0){
        let iterationCounter = 0;
        //console.log("Change first word: " + firstWord)
        while(exclusionList.includes(chosenWord) || array[1] === firstWord || array[2] === firstWord || array[3] === firstWord){
          iterationCounter = iterationCounter + 1;
          if(iterationCounter > 29){
            break;
          }
          //console.log("Array entries:" + array + "Iteration count: " + iterationCounter)
          updateFirstWord();
          array[chosenInstanceNumber] = firstWord;
          setChosenWord(
            chosenWord = array[chosenInstanceNumber]
          );
        }
        //console.log("The updated word is: " + firstWord)
      }
      if(chosenInstanceNumber === 1){
        let iterationCounter = 0;
        //console.log("Change second word: " + secondWord)
        while(exclusionList.includes(chosenWord) || array[0] === secondWord || array[2] === secondWord || array[3] === secondWord){
          iterationCounter = iterationCounter + 1;
          if(iterationCounter > 29){
            break;
          }
          //console.log("Array entries:" + array + "Iteration count: " + iterationCounter)
          updateSecondWord();
          array[chosenInstanceNumber] = secondWord;
          setChosenWord(
            chosenWord = array[chosenInstanceNumber]
          );
        }
        //console.log("The updated word is: " + secondWord)
      }
      if(chosenInstanceNumber === 2){
        let iterationCounter = 0;
        //console.log("Change third word: " + thirdWord)
        while(exclusionList.includes(chosenWord) || array[0] === thirdWord || array[1] === thirdWord || array[3] === thirdWord){
          iterationCounter = iterationCounter + 1;
          if(iterationCounter > 29){
            break;
          }
          //console.log("Array entries:" + array + "Iteration count: " + iterationCounter)
          updateThirdWord();
          array[chosenInstanceNumber] = thirdWord;
          setChosenWord(
            chosenWord = array[chosenInstanceNumber]
          );
        }
      
        //console.log("The updated word is: " + thirdWord)
      }
      if(chosenInstanceNumber === 3){
        let iterationCounter = 0;
        //console.log("Change fourth word: " + fourthWord)
        while(exclusionList.includes(chosenWord)|| array[0] === fourthWord || array[1] === fourthWord || array[2] === fourthWord){
          iterationCounter = iterationCounter + 1;
          if(iterationCounter > 29){
            break;
          }
          //console.log("Array entries:" + array + "Iteration count: " + iterationCounter)
          updateFourthWord();
          array[chosenInstanceNumber] = fourthWord;
          setChosenWord(
            chosenWord = array[chosenInstanceNumber]
          );
        }
        //console.log("The updated word is: " + fourthWord)
      }
    }

    exclusionList.push(chosenWord);
    //console.log("Excluded words include: " + exclusionList + " :Index #" + chosenInstanceNumber);

    

    setChosenWordNumber(
      chosenWordNumber = getQueryWordIndex(chosenWord, russianCognateList, russianNonCognateList)
    );
      //console.log("The list of words is:" + array)
      //console.log("The chosen word is:" + chosenWord)
    
    if(chosenWordNumber > 30 && instanceCount >= 5){
      updateNonCognateCount();
      //console.log("The cognate count for this trial is: " + cognateCount)
      //console.log("The non-cognate count for this trial is: " + nonCognateCount)
    }
    if(chosenWordNumber < 31 && instanceCount >= 5){
      updateCognateCount();
      //console.log("The cognate count for this trial is: " + cognateCount)
      //console.log("The non-cognate count for this trial is: " + nonCognateCount)
    }
  }

  


  let [firstImageReference, setFirstImageReference] = useState(0);
  let [firstWord, setFirstWord] = useState("");

  const updateFirstWord = () => {
    let firstWordProxy = []
    firstWordProxy = getChosenWord()
    setFirstWord(

      firstWord = firstWordProxy[0],
    )

    setFirstImageReference(
      firstImageReference = firstWordProxy[1]
    );
  }

  let [secondImageReference, setSecondImageReference] = useState(0);
  let [secondWord, setSecondWord] = useState("");

  const updateSecondWord = () => {
    let secondWordProxy = []
    secondWordProxy = getChosenWord()

    setSecondWord(
      secondWord = secondWordProxy[0]
    );

    setSecondImageReference(
      secondImageReference = secondWordProxy[1]
    );
  }

  let [thirdImageReference, setThirdImageReference] = useState(0);
  let [thirdWord, setThirdWord] = useState("");

  const updateThirdWord = () => {
    let thirdImageProxy = []
    thirdImageProxy = getChosenWord()

    setThirdWord(
      thirdWord = thirdImageProxy[0]
    );

    setThirdImageReference(
      thirdImageReference = thirdImageProxy[1]
    )
  }

  let [fourthImageReference, setFourthImageReference] = useState(0)
  let [fourthWord, setFourthWord] = useState("");

  const updateFourthWord = () => {
    let fourthImageProxy = []
    fourthImageProxy = getChosenWord()

    setFourthWord(
      fourthWord = fourthImageProxy[0]
    )

    setFourthImageReference(
      fourthImageReference = fourthImageProxy[1]
    );
  }
if(instanceCount!== 0){
  AUDIO[chosenWordNumber][0].play();
}

  
  //Audio needs to be played as app loads then before the button press resets for the next word array.

  const update = () => {


    updateFirstWord()
    exclusionArray.push(firstWord);
    updateSecondWord()
    if (secondWord === exclusionArray[0] && secondWord !== '') {
      while (secondWord === exclusionArray[0]) {
        updateSecondWord()
      }
    }
    exclusionArray.push(secondWord);

    updateThirdWord()
    if ((thirdWord === exclusionArray[0] && thirdWord !== '') || (thirdWord === exclusionArray[1] && thirdWord !== '')) {
      while (thirdWord === exclusionArray[0] || thirdWord === exclusionArray[1]) {
        updateThirdWord()
      }
    }
    exclusionArray.push(thirdWord);

    updateFourthWord()
    if ((fourthWord === exclusionArray[0] && fourthWord !== '') || (fourthWord === exclusionArray[1] && fourthWord !== '') || (fourthWord === exclusionArray[2] && fourthWord !== '')) {
      while (fourthWord === exclusionArray[0] || fourthWord === exclusionArray[1] || fourthWord === exclusionArray[2]) {
        updateFourthWord()
      }
    }
    exclusionArray.push(fourthWord);
    updateChosenWord(exclusionArray);
  }

  const instanceOne = () => {
    //AUDIO[chosenWordNumber][0].play();
    //console.log("Audio number: " + AUDIO[chosenWordNumber][1])
    updateInstanceCount();
    updateStartTime();

    generateInstanceReport(exclusionArray, firstWord, chosenWord, startTime);

    exclusionArray = [];
    //console.log(instanceReport);

    update();

    if (instanceCount >= SESSION_LENGTH) {
      alert("Thank you for participating in the study; you may now close this web page.")
    }



  }
  const instanceTwo = () => {
    //AUDIO[chosenWordNumber][0].play();
    //console.log("Audio number: " + AUDIO[chosenWordNumber][1])

    updateInstanceCount();
    updateStartTime();

    generateInstanceReport(exclusionArray, secondWord, chosenWord, startTime);
    exclusionArray = [];
    //console.log(instanceReport);

    update();

    if (instanceCount >= SESSION_LENGTH) {
      alert("Thank you for participating in the study, you may now close this web page.")
    }
  }
  const instanceThree = () => {
    //AUDIO[chosenWordNumber][0].play();
    //console.log("Audio number: " + AUDIO[chosenWordNumber][1])

    updateInstanceCount();
    updateStartTime();

    generateInstanceReport(exclusionArray, thirdWord, chosenWord, startTime);
    exclusionArray = [];
    //console.log(instanceReport);

    update();

    if (instanceCount >= SESSION_LENGTH) {
      alert("Thank you for participating in the study, you may now close this web page.")
    }
  }
  const instanceFour = () => {
    //AUDIO[chosenWordNumber][0].play();
    //console.log("Audio number: " + AUDIO[chosenWordNumber][1])

    updateInstanceCount();
    updateStartTime();

    generateInstanceReport(exclusionArray, fourthWord, chosenWord, startTime);
    exclusionArray = [];
    //console.log(instanceReport);

    update();

    if (instanceCount >= SESSION_LENGTH) {
      alert("Thank you for participating in the study, you may now close this web page.")
    }
  }

  const chooseFirstImageObject = () => {
    let imageChoiceIndex = Math.floor(Math.random() * 2);

    if(imageChoiceIndex === 0){
      return IMAGES[firstImageReference][0]
    }
    
    return SECONDIMAGES[firstImageReference][0]

  }

  const chooseSecondImageObject = () => {
    let imageChoiceIndex = Math.floor(Math.random() * 2);

    if(imageChoiceIndex === 0){
      return IMAGES[secondImageReference][0]
    }
    
    return SECONDIMAGES[secondImageReference][0]

  }

  const chooseThirdImageObject = () => {
    let imageChoiceIndex = Math.floor(Math.random() * 2);

    if(imageChoiceIndex === 0){
      return IMAGES[thirdImageReference][0]
    }
    
    return SECONDIMAGES[thirdImageReference][0]

  }

  const chooseFourthImageObject = () => {
    let imageChoiceIndex = Math.floor(Math.random() * 2);

    if(imageChoiceIndex === 0){
      return IMAGES[fourthImageReference][0]
    }
    
    return SECONDIMAGES[fourthImageReference][0]

  }

  return (
    <div className="App">
      <div className="displayArea">

        <div className="imageDisplayArea">
          <div className='topDisplayRow'>
            <div className='leftTopDisplayArea'>
              <div className='buttonControlOne' onClick={instanceOne}>
                <ResponseButton wordChoice={1} />
              </div>
              <ImageCard imageAddress={chooseFirstImageObject()} imageNumber={1} />

            </div>
            <div className='rightTopDisplayArea'>
              <div className='buttonControlTwo' onClick={instanceTwo}>
                <ResponseButton wordChoice={2} />
              </div>
              <ImageCard imageAddress={chooseSecondImageObject()} imageNumber={2} />

            </div>
          </div>
          <div className='bottomDisplayRow'>
            <div className='leftBottomDisplayArea'>
              <div className='buttonControlThree' onClick={instanceThree}>
                <ResponseButton wordChoice={3} />
              </div>
              <ImageCard imageAddress={chooseThirdImageObject()} imageNumber={3} />

            </div>
            <div className='rightBottomDisplayArea'>
              <div className='buttonControlFour' onClick={instanceFour}>
                <ResponseButton wordChoice={4} />
              </div>
              <ImageCard imageAddress={chooseFourthImageObject()} imageNumber={4} />

            </div>
          </div>
        </div>
        <div className="instructionArea">
          <div className='instructionTitleArea'>
            <h1 className='instructionTitleText'>Instructions</h1>
          </div>
          <div className='instructionBodyArea'>
            <div className='instructionBeginningTitleBox'>
              <h3>Beginning the Experiment:</h3>
            </div>
            <div className='instructionBeginningTextBox'>
              <p className='beginningInstructionText'>To begin this experiment, use the mouse and left-click any of the buttons below the images of the four doctors.</p>
            </div>
            <div className='instructionProcedureTitleBox'>
              <h3>Procedural Instructions:</h3>
            </div>
            <div className='instructionProcedureBox'>
              <p className='methodInstructionText'>Listen to the audio files and use the mouse to left-click the button corresponding to the image that resembles the words presented in the audio.</p>
            </div>
            <div className='instructionEndingTitleBox'>
              <h3>Exiting the Experiment:</h3>
            </div>
            <div className='instructionEndingTextBox'>
              <p className='exitingText'>After completing the sufficient number of trials, a warning will appear on-screen indicating you have completed the study; after the warning is presented, exit and close the web page. If needed earlier, to exit the experiment, close the page.</p>
            </div>
            <div className='universityLogoBox'>
              <img className="universityLogo" src={UniversityLogo} alt='University Logo' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
