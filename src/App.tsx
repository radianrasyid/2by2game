import { useEffect, useState } from "react";
import "./App.css";

enum Rule {
  Horizontal = "horizontal",
  Vertical = "vertical",
  Component = "component",
}

interface MyObject {
  color: string;
  rule: Rule;
}

function App() {
  const [remainingTime, setRemainingTime] = useState<number>(3);
  const [coloredComponent, setColoredComponent] = useState<string>("");
  const [timeInputted, setTimeInputted] = useState<number>(0);
  const [playedTime, setPlayedTime] = useState<number>(0);
  const [rule, setRule] = useState<MyObject[]>([
    {
      color: "green",
      rule: Rule.Horizontal,
    },
    {
      color: "red",
      rule: Rule.Vertical,
    },
    {
      color: "blue",
      rule: Rule.Component,
    },
  ]);
  function randomizeRules(arr: MyObject[]): MyObject[] {
    // Create a copy of the original array to avoid modifying the original
    const newArray: MyObject[] = arr.map((obj) => ({ ...obj }));

    // Create an array of available rules
    const availableRules = [Rule.Horizontal, Rule.Vertical, Rule.Component];

    // Shuffle the array of available rules
    availableRules.sort(() => Math.random() - 0.5);

    // Assign shuffled rules to each object
    newArray.forEach((obj) => {
      obj.rule = availableRules.pop() || Rule.Horizontal; // Use a default rule if needed
    });

    setRule(newArray);

    return newArray;
  }

  const [timeAppeared, setTimeAppeared] = useState<any[]>([]);
  const [answerList, setAnswerList] = useState<
    { result: boolean; interval: any }[]
  >([]);

  const RandomizeComponentId = () => {
    setTimeAppeared([...timeAppeared, new Date()]);
    setRemainingTime(3);
    let column1 = document.getElementById("column-1");
    let column2 = document.getElementById("column-2");
    let column3 = document.getElementById("column-3");
    let column4 = document.getElementById("column-4");
    if (column1) {
      column1.style.backgroundColor = "transparent";
    }
    if (column2) {
      column2.style.backgroundColor = "transparent";
    }
    if (column3) {
      column3.style.backgroundColor = "transparent";
    }
    if (column4) {
      column4.style.backgroundColor = "transparent";
    }
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    let pickedId = `column-${randomNumber}`;
    let pickedColumn = document.getElementById(pickedId);
    setColoredComponent(pickedId);
    let colors = rule.map((e) => e.color);
    if (pickedColumn) {
      let randomColor = Math.floor(Math.random() * colors.length);
      let pickedColor = colors[randomColor];
      pickedColumn.style.backgroundColor = pickedColor;
    }
  };

  const handleClick = ({
    clickedComponent,
    referenceComponent,
  }: {
    clickedComponent: HTMLElement;
    referenceComponent: HTMLElement;
  }) => {
    let currentGivenColor = referenceComponent.style.backgroundColor;
    let clickedBounding = clickedComponent.getBoundingClientRect();
    let referenceBouding = referenceComponent.getBoundingClientRect();
    let selectedRule = rule.find((e) => e.color === currentGivenColor);
    console.log("ini clickedBounding", clickedBounding);
    console.log("ini referenceBounding", referenceBouding);
    if (selectedRule?.rule === "vertical") {
      let isRight =
        clickedBounding.x === referenceBouding?.x &&
        clickedBounding.left === referenceBouding?.left &&
        clickedBounding.right === referenceBouding?.right &&
        clickedComponent.id !== referenceComponent.id;
      setAnswerList([
        ...answerList,
        {
          result: isRight,
          interval: new Date().getTime() - timeAppeared.pop().getTime(),
        },
      ]);
      console.log("vertical", isRight);
      RandomizeComponentId();
      return isRight;
    } else if (selectedRule?.rule === "horizontal") {
      let isRight =
        clickedBounding.y === referenceBouding?.y &&
        clickedBounding.top === referenceBouding?.top &&
        clickedBounding.bottom === referenceBouding?.bottom &&
        clickedComponent.id !== referenceComponent.id;
      setAnswerList([
        ...answerList,
        {
          result: isRight,
          interval: new Date().getTime() - timeAppeared.pop().getTime(),
        },
      ]);
      console.log("horizontal", isRight);
      RandomizeComponentId();
      return isRight;
    } else {
      let isRight =
        clickedBounding.x === referenceBouding?.x &&
        clickedBounding.y === referenceBouding?.y;
      setAnswerList([
        ...answerList,
        {
          result: isRight,
          interval: new Date().getTime() - timeAppeared.pop().getTime(),
        },
      ]);
      console.log("component", isRight);
      RandomizeComponentId();
      return isRight;
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      } else if (remainingTime === 0) {
        setRemainingTime(3);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    let interval = setInterval(() => {
      setPlayedTime(playedTime - 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [playedTime]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      {playedTime > 0 ? null : (
        <div>
          {rule.map((item, index) => {
            switch (item.rule) {
              case "horizontal":
                return (
                  <div className="flex gap-2" key={index}>
                    <div
                      style={{
                        backgroundColor: item.color,
                      }}
                      className="col-span-1 border min-w-[2rem] min-h-[2rem] cursor-pointer"
                    ></div>
                    <span>
                      Click the square that horizontally align with this color
                    </span>
                  </div>
                );
              case "vertical":
                return (
                  <div className="flex gap-2" key={index}>
                    <div
                      style={{
                        backgroundColor: item.color,
                      }}
                      className="col-span-1 border min-w-[2rem] min-h-[2rem] cursor-pointer"
                    ></div>
                    <span>
                      Click the square that vertically align with this color
                    </span>
                  </div>
                );
              case "component":
                return (
                  <div className="flex gap-2" key={index}>
                    <div
                      style={{
                        backgroundColor: item.color,
                      }}
                      className="col-span-1 border min-w-[2rem] min-h-[2rem] cursor-pointer"
                    ></div>
                    <span>Click the colored square</span>
                  </div>
                );
            }
          })}
        </div>
      )}
      {playedTime > 0 ? null : (
        <div className="flex gap-2">
          <input
            type="number"
            onChange={(e) => {
              setTimeInputted(Number(e.target.value) * 1000);
            }}
            className="text-black"
          />
          <button
            className="bg-slate-500 px-5 py-1"
            onClick={() => {
              setPlayedTime(timeInputted);
              setTimeout(() => {
                RandomizeComponentId();
              }, 10);
              setAnswerList([]);
              setTimeAppeared([]);
            }}
            onMouseEnter={() => {
              randomizeRules(rule);
            }}
            disabled={!timeInputted ? true : false}
          >
            hit it!
          </button>
        </div>
      )}
      {playedTime > 0 ? (
        <div className="grid-cols-2 gap-4 grid mt-5">
          <div
            onClick={(e) => {
              const clickedComponent = e.currentTarget;
              const referenceComponent =
                document.getElementById(coloredComponent);
              handleClick({
                clickedComponent: clickedComponent,
                referenceComponent: referenceComponent as HTMLElement,
              });
            }}
            id="column-1"
            className="col-span-1 border min-w-[15rem] min-h-[15rem] cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              const clickedComponent = e.currentTarget;
              const referenceComponent =
                document.getElementById(coloredComponent);
              handleClick({
                clickedComponent: clickedComponent,
                referenceComponent: referenceComponent as HTMLElement,
              });
            }}
            id="column-2"
            className="col-span-1 border min-w-[15rem] min-h-[15rem] cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              const clickedComponent = e.currentTarget;
              const referenceComponent =
                document.getElementById(coloredComponent);
              handleClick({
                clickedComponent: clickedComponent,
                referenceComponent: referenceComponent as HTMLElement,
              });
            }}
            id="column-3"
            className="col-span-1 border min-w-[15rem] min-h-[15rem] cursor-pointer"
          ></div>
          <div
            onClick={(e) => {
              const clickedComponent = e.currentTarget;
              const referenceComponent =
                document.getElementById(coloredComponent);

              handleClick({
                clickedComponent: clickedComponent,
                referenceComponent: referenceComponent as HTMLElement,
              });
            }}
            id="column-4"
            className="col-span-1 border min-w-[15rem] min-h-[15rem] cursor-pointer"
          ></div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center">
          <span>
            average response time:{" "}
            {(
              answerList.reduce((acc, item) => acc + item.interval, 0) /
              answerList.length
            ).toFixed(3)}
            ms
          </span>
          <span>
            accuracy:{" "}
            {(
              ([...answerList].filter((item) => item.result).length /
                answerList.length) *
              100
            ).toFixed(2)}
            %
          </span>
        </div>
      )}
      {playedTime > 0 ? (
        <div>
          <span>{playedTime / 1000}</span>
        </div>
      ) : null}
    </div>
  );
}

export default App;
