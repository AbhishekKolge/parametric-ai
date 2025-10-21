import { Responses } from "../components/common/responses";
import { ParametersForm } from "../components/forms/parameters-form";

export const ExperimentDetails = () => (
  <section className="flex h-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
    <aside className="top-[88px] flex w-full flex-col gap-6 lg:sticky lg:max-w-md lg:gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-2xl md:text-3xl">
          Generated Responses
        </h1>
        <p className="font-light text-sm md:text-base">
          Compare outputs across different parameter configurations
        </p>
      </div>
      <ParametersForm />
    </aside>
    <Responses />
  </section>
);
