import "./App.css";
import { useEffect, useState } from "react";
import SingleCard from "./components/SingleCard";

//doesn't need to be created on component level, because we don't want to rerender it every time (nature of the game)
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);

  //shuffle cards
  const shuffleCards = () => {
    //when random number is (-), items order will remain unchanged. when (+) it's going to switch the order
    //and mapped through the cards with newly added id properties
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    //make sure starting new game the choices are null
    setChoiceOne(null);
    setChoiceTwo(null);

    setCards(shuffledCards);
    setTurns(0);
  };

  //handle a choice
  const handleChoice = (card) => {
    console.log(card);

    //if the card has no value then it handles first choice
    //when the card has a value then it handles second choice
    //not null = true
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compare cards
  //useEffect will fire once when the component first mount automatically, fires again whenever a dependency changes (choiceOne and two)

  useEffect(() => {
    //only then fires if two cards selected, despite using useEffect
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        console.log("same cards!");
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        console.log("try again");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  console.log(cards);

  //reset choices
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //start the game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Memory Games</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns : {turns}</p>
    </div>
  );
}

export default App;
