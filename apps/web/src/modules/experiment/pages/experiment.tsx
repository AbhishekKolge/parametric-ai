import { ExperimentList } from "../components/common/experiment-list";

export const Experiment = () => (
  <section className="flex h-full flex-col gap-6 md:gap-8">
    <div className="flex flex-col gap-2">
      <h1 className="font-medium text-2xl md:text-3xl">Experiments</h1>
      <p className="font-light text-sm md:text-base">
        Track and compare your LLM parameter experiments
      </p>
    </div>
    <ExperimentList />
  </section>
);
