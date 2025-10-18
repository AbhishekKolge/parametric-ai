"use client";

import { Button } from "@parametric-ai/ui/components/button";
import { Search } from "@parametric-ai/ui/components/search";
import { Plus } from "lucide-react";
import { useDisclosure } from "@/hooks/use-disclosure";
import { CreateExperimentDialog } from "../dialogs/create-experiment-dialog";

export const ExperimentList = () => {
  const createExperimentDisclosure = useDisclosure({});
  return (
    <>
      <div>
        <div className="flex items-center justify-between gap-4">
          <Search
            inputGroupProps={{
              className: "max-w-2xs",
            }}
          />
          <Button onClick={createExperimentDisclosure.open}>
            <Plus /> New Experiment
          </Button>
        </div>
      </div>
      <CreateExperimentDialog {...createExperimentDisclosure} />
    </>
  );
};
