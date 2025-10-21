import { ParametersForm } from "../components/forms/parameters-form";

export const ExperimentDetails = () => (
  <section className="flex h-full flex-col gap-8">
    <div className="flex flex-col gap-2">
      <h1 className="font-medium text-3xl">Generated Responses</h1>
      <p className="font-light">
        Compare outputs across different parameter configurations
      </p>
    </div>
    <div>
      <ParametersForm />
    </div>
  </section>
);
