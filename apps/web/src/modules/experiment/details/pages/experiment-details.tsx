import { Responses } from "../components/common/responses";
import { ParametersForm } from "../components/forms/parameters-form";

export const ExperimentDetails = () => (
  <section className="flex h-full items-start gap-8">
    <aside className="sticky top-[88px] flex w-full flex-col gap-8 sm:max-w-md">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-3xl">Generated Responses</h1>
        <p className="font-light">
          Compare outputs across different parameter configurations
        </p>
      </div>
      <ParametersForm />
    </aside>
    <Responses />
  </section>
);
