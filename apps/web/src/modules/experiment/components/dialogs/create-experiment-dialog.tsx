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
import { Input } from "@parametric-ai/ui/components/input";
import { Label } from "@parametric-ai/ui/components/label";

import type { useDisclosure } from "@/hooks/use-disclosure";

type CreateExperimentDialogProps = ReturnType<typeof useDisclosure>;

export const CreateExperimentDialog = ({
  isOpen,
  toggle,
}: CreateExperimentDialogProps) => (
  <Dialog onOpenChange={toggle} open={isOpen}>
    <form>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Experiment</DialogTitle>
          <DialogDescription>
            Set up a new experiment to test different LLM parameters
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input defaultValue="Pedro Duarte" id="name-1" name="name" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">Username</Label>
            <Input defaultValue="@peduarte" id="username-1" name="username" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
);
