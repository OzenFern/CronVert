import Header from "./components/Header.jsx";
import { useState } from "react";
import cronToText from "./lib/cronToText.js";
import Input from "./components/Input.jsx";
import LabelContainer from "./components/LabelContainer.jsx";
import ResultBlock from "./components/ResultBlock.jsx";
import Button from "./components/Button.jsx";
import { RotateCcw, CircleX, CircleCheck } from "lucide-react";
import CopyButton from "./components/CopyButton.jsx";
import Footer from "./components/Footer.jsx";

const initialCron = "*/15 * * * *";

const App = () => {
  const [cron, setCron] = useState(initialCron);
  const result = cronToText(cron);

  let description = null;
  let errorDescription = null;

  if (result.success) {
    description = result.value;
  } else {
    errorDescription = result.error;
  }

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="m-2 my-2 flex flex-col justify-center md:mx-20 lg:mx-40">
        <LabelContainer label="Cron Expression">
          <Input
            baseValue={cron}
            fn={(e) => {
              setCron(e.target.value);
            }}
            helperMessage="minute • hour • day • month • weekday"
          />
        </LabelContainer>
        <LabelContainer
          label={"Human-Readable Description"}
          textColor={result.success ? "text-success" : "text-error"}
        >
          <ResultBlock
            text={description ?? errorDescription?.message}
            description={errorDescription?.description}
            icon={result.success ? <CircleCheck /> : <CircleX />}
          />
        </LabelContainer>
        <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CopyButton text="Description" toCopy={description} />
          <Button
            text="Reset Cron"
            icon={<RotateCcw />}
            click={() => setCron(initialCron)}
            bgColor="bg-accent-active"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
