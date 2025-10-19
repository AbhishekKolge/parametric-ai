import { Button } from "@parametric-ai/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@parametric-ai/ui/components/dialog";
import type { useDisclosure } from "@/hooks/use-disclosure";
import { CreateExperimentForm } from "../forms/create-experiment-form";

type CreateExperimentDialogProps = ReturnType<typeof useDisclosure>;

export const CreateExperimentDialog = ({
  isOpen,
  toggle,
}: CreateExperimentDialogProps) => (
  <Dialog onOpenChange={toggle} open={isOpen}>
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create New Experiment</DialogTitle>
        <DialogDescription>
          Set up a new experiment to test different LLM parameters
        </DialogDescription>
      </DialogHeader>
      <CreateExperimentForm close={close} />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button form="create-experiment-form" type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
