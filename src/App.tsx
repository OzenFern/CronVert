import Header from "./components/Header.tsx";
import { useEffect, useState } from "react";
import cronToText from "./lib/cronToText.ts";
import Input from "./components/Input.tsx";
import LabelContainer from "./components/LabelContainer.tsx";
import ResultBlock from "./components/ResultBlock.tsx";
import Button from "./components/Button.tsx";
import { RotateCcw, CircleX, CircleCheck } from "lucide-react";
import CopyButton from "./components/CopyButton.tsx";
import Footer from "./components/Footer.tsx";

const initialCron = "*/15 * * * *";

const App = () => {
  const [cron, setCron] = useState((): string => localStorage.getItem("cron") ?? initialCron);
  const result = cronToText(cron);

  // Save the current cron into localStorage
  useEffect(() => {
    localStorage.setItem("cron", cron);
  }, [cron]);

  const text = result.success ? result.value : result.error.message;
  const description = result.success ? null : result.error.description;

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
            text={text}
            description={description}
            icon={result.success ? CircleCheck : CircleX}
          />
        </LabelContainer>
        <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CopyButton text="Description" toCopy={text} />
          <Button
            text="Reset Cron"
            icon={RotateCcw}
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
